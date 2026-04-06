"use client"

import { useState, useRef, useEffect } from "react"
import { PageSetup } from "@/components/PageSetup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { HugeiconsIcon, type HugeiconsIconProps } from "@hugeicons/react"
import {
  Calendar01Icon,
  BarChartHorizontalIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Clock01Icon,
  UserIcon,
  Cancel01Icon,
  PencilEdit01Icon,
  Delete01Icon,
  CheckmarkCircle01Icon,
  Time01Icon,
  Location01Icon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons"
import { AddEventDialog } from "@/components/AddEventDialog"
import { useEvents, type ScheduleEvent, type EventType } from "@/components/EventsContext"
import { useProjects, type Project } from "@/components/ProjectsContext"
import { useTeamMembers } from "@/components/TeamMembersContext"
import { useCategories } from "@/components/CategoriesContext"
import { cn } from "@/lib/utils"

// ─── Types ───────────────────────────────────────────────────────────────────

type ViewMode     = "calendar" | "timeline"
type CalendarMode = "month" | "week" | "day"

interface TimelineEntry {
  id: string
  site: string       // row label
  title: string      // bar content
  startDate: string  // YYYY-MM-DD
  endDate: string    // YYYY-MM-DD
  type: EventType
}

// ─── Polish date parser ───────────────────────────────────────────────────────

// Parses "3 mar 2026" → "2026-03-03" (matches format used in ProjectsContext)
const PL_MONTH_IDX: Record<string, number> = {
  sty: 0, lut: 1, mar: 2, kwi: 3, maj: 4, cze: 5,
  lip: 6, sie: 7, wrz: 8, paź: 9, lis: 10, gru: 11,
}

function parsePLDate(str: string): string | null {
  const parts = str.trim().split(/\s+/)
  if (parts.length !== 3) return null
  const day   = parseInt(parts[0])
  const month = PL_MONTH_IDX[parts[1]]
  const year  = parseInt(parts[2])
  if (isNaN(day) || month === undefined || isNaN(year)) return null
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

function projectToEntries(p: Project): TimelineEntry[] {
  const start = parsePLDate(p.orderDate)
  const end   = parsePLDate(p.completionDate)
  if (!start || !end) return []
  const type: EventType = p.type === "Dostawa" ? "wizja lokalna" : "montaz"
  return [{ id: `proj-${p.offerNumber}`, site: p.type, title: p.companyName || p.client, startDate: start, endDate: end, type }]
}

// ─── Colour tokens ────────────────────────────────────────────────────────────

const EVENT_COLORS: Record<EventType, string> = {
  spotkanie:       "bg-violet-500/15  text-violet-400  border-violet-500/25",
  montaz:          "bg-amber-500/15   text-amber-400   border-amber-500/25",
  "wizja lokalna": "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  przeglad:        "bg-sky-500/15     text-sky-400     border-sky-500/25",
}

// Slightly more opaque for the timeline bars (need to be readable as fills)
const BAR_STYLE: Record<EventType, string> = {
  spotkanie:       "bg-violet-500/20  text-violet-400  border border-violet-500/30",
  montaz:          "bg-amber-500/20   text-amber-400   border border-amber-500/30",
  "wizja lokalna": "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  przeglad:        "bg-sky-500/20     text-sky-400     border border-sky-500/30",
}

const EVENT_DOT: Record<EventType, string> = {
  spotkanie:       "bg-violet-400",
  montaz:          "bg-amber-400",
  "wizja lokalna": "bg-emerald-400",
  przeglad:        "bg-sky-400",
}

const TYPE_LABEL: Record<EventType, string> = {
  spotkanie:       "Spotkanie",
  montaz:          "Montaż",
  "wizja lokalna": "Wizja lokalna",
  przeglad:        "Przegląd",
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
  "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień",
]
const MONTH_SHORT = ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru"]
const DAY_NAMES   = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nd"]

const CAL_MODE_LABEL: Record<CalendarMode, string> = {
  month: "Miesiąc",
  week:  "Tydzień",
  day:   "Dzień",
}

// Time-grid constants (week / day views)
const HOUR_START = 6
const HOUR_END   = 21
const HOUR_H     = 64
const HOURS      = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => i + HOUR_START)
const GRID_H     = HOURS.length * HOUR_H

// Gantt / timeline constants
const DAY_W    = 32  // px per day column
const LABEL_W  = 160 // px for the site-name column
const ROW_H    = 52  // px per timeline row

// ─── Helpers ──────────────────────────────────────────────────────────────────

function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate() }

function firstWeekdayOfMonth(y: number, m: number) {
  const d = new Date(y, m, 1).getDay()
  return d === 0 ? 6 : d - 1
}

function toISO(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
}

function dateToISO(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function getWeekStart(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const dow = d.getDay()
  d.setDate(d.getDate() - (dow === 0 ? 6 : dow - 1))
  return d
}

function parseTime(time: string): { hour: number; minute: number } {
  const m = time.match(/^(\d+):(\d+)(am|pm)$/i)
  if (!m) return { hour: HOUR_START, minute: 0 }
  let h = parseInt(m[1])
  const min = parseInt(m[2])
  if (m[3].toLowerCase() === "pm" && h < 12) h += 12
  if (m[3].toLowerCase() === "am" && h === 12) h = 0
  return { hour: h, minute: min }
}

function formatHour(h: number) {
  return `${h}:00`
}

function weekRangeLabel(ws: Date) {
  const we = addDays(ws, 6)
  const s  = `${MONTH_SHORT[ws.getMonth()]} ${ws.getDate()}`
  const e  = ws.getMonth() === we.getMonth()
    ? `${we.getDate()}`
    : `${MONTH_SHORT[we.getMonth()]} ${we.getDate()}`
  return `${s} – ${e}, ${we.getFullYear()}`
}

function dayLabel(date: Date) {
  return `${DAY_NAMES[(date.getDay() + 6) % 7]}, ${MONTH_SHORT[date.getMonth()]} ${date.getDate()}`
}

/** Bar position within the displayed month, or null if outside range */
function calcBar(entry: TimelineEntry, year: number, month: number, days: number) {
  const rangeStart = new Date(year, month, 1)
  const rangeEnd   = new Date(year, month, days)
  const s  = new Date(entry.startDate)
  const e  = new Date(entry.endDate)
  const c0 = s < rangeStart ? rangeStart : s
  const c1 = e > rangeEnd   ? rangeEnd   : e
  if (c0 > rangeEnd || c1 < rangeStart) return null
  const sd = Math.round((c0.getTime() - rangeStart.getTime()) / 86_400_000)
  const ed = Math.round((c1.getTime() - rangeStart.getTime()) / 86_400_000)
  return { left: sd * DAY_W, width: (ed - sd + 1) * DAY_W }
}

// ─── EventDetailDialog helpers ────────────────────────────────────────────────

/** "9:00am" → "09:00" for <input type="time"> */
function timeToHHMM(time: string): string {
  const m = time.match(/^(\d+):(\d+)(am|pm)$/i)
  if (!m) return "09:00"
  let h = parseInt(m[1])
  const min = m[2]
  if (m[3].toLowerCase() === "pm" && h < 12) h += 12
  if (m[3].toLowerCase() === "am" && h === 12) h = 0
  return `${String(h).padStart(2, "0")}:${min}`
}

function formatDuration(minutes: number): string {
  if (minutes >= 60 && minutes % 60 === 0) return `${minutes / 60} h`
  return `${minutes} min`
}

function IconRow({ icon, label, children }: { icon: HugeiconsIconProps["icon"]; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <HugeiconsIcon icon={icon} size={15} className="shrink-0 text-muted-foreground" />
      <span className="w-24 shrink-0 text-xs text-muted-foreground">{label}</span>
      <span className="flex-1 text-sm text-foreground">{children}</span>
    </div>
  )
}

// ─── EventDetailDialog ────────────────────────────────────────────────────────

function EventDetailDialog({ event, onClose }: { event: ScheduleEvent; onClose: () => void }) {
  const { updateEvent, deleteEvent } = useEvents()
  const { members }    = useTeamMembers()
  const { categories } = useCategories()
  const [editing,        setEditing]        = useState(false)
  const [confirmDelete,  setConfirmDelete]  = useState(false)

  const [form, setForm] = useState({
    title:    event.title,
    date:     event.date,
    time:     timeToHHMM(event.time),
    type:     event.type as string,
    duration: String(event.duration),
    address:  event.address ?? "",
    assignee: event.assignee ?? "",
  })

  function handleSave() {
    const [hStr, mStr] = form.time.split(":")
    const h = parseInt(hStr, 10)
    const m = parseInt(mStr, 10)
    const suffix = h < 12 ? "am" : "pm"
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
    const timeFormatted = `${hour12}:${String(m).padStart(2, "0")}${suffix}`

    updateEvent(event.id, {
      title:    form.title.trim() || event.title,
      date:     form.date,
      time:     timeFormatted,
      type:     form.type as EventType,
      duration: parseInt(form.duration) || event.duration,
      address:  form.address.trim() || undefined,
      assignee: form.assignee || undefined,
    })
    setEditing(false)
    onClose()
  }

  function handleDelete() {
    deleteEvent(event.id)
    onClose()
  }

  const displayDate = new Date(event.date + "T00:00:00").toLocaleDateString("pl-PL", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  })

  return (
    <DialogContent
      showCloseButton={false}
      className="flex max-h-[90vh] flex-col overflow-hidden bg-background p-0 border border-border sm:max-w-md"
    >
      <DialogTitle className="sr-only">
        {editing ? "Edytuj wydarzenie" : "Szczegóły wydarzenia"}
      </DialogTitle>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <p className="text-sm font-semibold text-foreground">
          {editing ? "Edytuj wydarzenie" : "Szczegóły wydarzenia"}
        </p>
        <DialogClose asChild>
          <Button variant="ghost" size="icon-sm">
            <HugeiconsIcon icon={Cancel01Icon} size={15} />
          </Button>
        </DialogClose>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 overflow-y-auto px-4 pb-2">

        {/* Hero card */}
        <div className="rounded-xl bg-card px-5 py-4">
          {editing ? (
            <Input
              className="h-9 px-3 text-sm font-semibold"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          ) : (
            <p className="text-base font-semibold text-foreground">{event.title}</p>
          )}
        </div>

        {/* Detail rows */}
        <div className="overflow-hidden rounded-xl bg-card divide-y divide-border">
          <IconRow icon={Calendar01Icon} label="Data">
            {editing ? (
              <input
                type="date"
                className="w-full rounded-md border border-input bg-input/20 px-2 py-1 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/30"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
            ) : displayDate}
          </IconRow>

          <IconRow icon={Clock01Icon} label="Godzina">
            {editing ? (
              <input
                type="time"
                className="w-full rounded-md border border-input bg-input/20 px-2 py-1 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/30"
                value={form.time}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
              />
            ) : event.time}
          </IconRow>

          <IconRow icon={Time01Icon} label="Czas trwania">
            {editing ? (
              <Input
                type="number"
                min={5}
                step={5}
                className="h-8 px-2 text-sm"
                value={form.duration}
                onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
              />
            ) : formatDuration(event.duration)}
          </IconRow>

          <IconRow icon={CheckmarkCircle01Icon} label="Kategoria">
            {editing ? (
              <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
                <SelectTrigger size="sm" className="h-8 w-full text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    {categories.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            ) : (
              <span className={cn(
                "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium",
                categories.find(c => c.value === event.type)?.color ?? EVENT_COLORS[event.type as EventType] ?? "bg-zinc-500/15 text-zinc-400 border-zinc-500/25"
              )}>
                {categories.find(c => c.value === event.type)?.label ?? TYPE_LABEL[event.type as EventType] ?? event.type}
              </span>
            )}
          </IconRow>

          {event.customerName && (
            <IconRow icon={UserIcon} label="Klient">
              {event.customerName}
            </IconRow>
          )}

          {(event.address || editing) && (
            <IconRow icon={Location01Icon} label="Adres">
              {editing ? (
                <Input
                  className="h-8 px-2 text-sm"
                  placeholder="np. ul. Nowa 14, Warszawa"
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                />
              ) : event.address}
            </IconRow>
          )}

          {(event.assignee || editing) && (
            <IconRow icon={UserMultiple02Icon} label="Kto jedzie">
              {editing ? (
                <Select value={form.assignee} onValueChange={(v) => setForm((f) => ({ ...f, assignee: v }))}>
                  <SelectTrigger size="sm" className="h-8 w-full text-sm">
                    <SelectValue placeholder="Wybierz pracownika..." />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectGroup>
                      {members.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ) : event.assignee}
            </IconRow>
          )}
        </div>

      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border px-5 py-4">
        {editing ? (
          <>
            <Button variant="ghost" size="lg" onClick={() => setEditing(false)}>Anuluj</Button>
            <Button variant="default" size="lg" onClick={handleSave}>
              Zapisz
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-destructive" onClick={() => setConfirmDelete(true)}>
              <HugeiconsIcon icon={Delete01Icon} size={16} />
            </Button>
            <Button variant="outline" size="lg" onClick={() => setEditing(true)}>
              <HugeiconsIcon icon={PencilEdit01Icon} data-icon="inline-start" />
              Edytuj
            </Button>
          </>
        )}
      </div>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usuń wydarzenie</AlertDialogTitle>
            <AlertDialogDescription>
              Czy na pewno chcesz usunąć &ldquo;{event.title}&rdquo;? Tej operacji nie można cofnąć.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Usuń
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DialogContent>
  )
}

// ─── TimeGrid — shared by week + day views ────────────────────────────────────

function TimeGrid({ days, onEventClick }: { days: Date[]; onEventClick: (ev: ScheduleEvent) => void }) {
  const { events, updateEvent } = useEvents()
  const { categories }          = useCategories()
  const today = new Date()

  // ── Drag state ─────────────────────────────────────────────────────────────
  // Stored in a ref so document-level listeners always see fresh data without
  // needing to be re-registered every render.
  const scrollRef      = useRef<HTMLDivElement>(null)
  const onClickRef     = useRef(onEventClick)
  useEffect(() => { onClickRef.current = onEventClick }, [onEventClick])

  const dragRef = useRef<{
    ev:          ScheduleEvent
    offsetY:     number       // cursor Y offset inside the block
    targetIso:   string | null
    snappedTime: string | null
    hasMoved:    boolean
  } | null>(null)

  const [draggingId,    setDraggingId]    = useState<string | null>(null)
  const [dropIndicator, setDropIndicator] = useState<{ iso: string; top: number; time: string } | null>(null)

  // Walk elements at a point to find the day-column (has data-iso attr)
  function getColumnAt(x: number, y: number): HTMLElement | null {
    for (const el of document.elementsFromPoint(x, y)) {
      if ((el as HTMLElement).dataset?.iso) return el as HTMLElement
    }
    return null
  }

  // Convert clientY → snapped time string + fractional hour for drop indicator
  function calcTime(clientY: number, colEl: HTMLElement, offsetY: number) {
    const rect     = colEl.getBoundingClientRect()
    const scrollTop = scrollRef.current?.scrollTop ?? 0
    const relY     = clientY - rect.top + scrollTop - offsetY
    const rawH     = HOUR_START + relY / HOUR_H
    // Snap to 15-min grid
    const snapped  = Math.round(rawH * 4) / 4
    const h        = Math.max(HOUR_START, Math.min(HOUR_END - 0.25, snapped))
    const hFloor   = Math.floor(h)
    const min      = Math.round((h - hFloor) * 60)
    const suffix   = hFloor < 12 ? "am" : "pm"
    const hour12   = hFloor === 0 ? 12 : hFloor > 12 ? hFloor - 12 : hFloor
    return { time: `${hour12}:${String(min).padStart(2, "0")}${suffix}`, h }
  }

  function startDrag(e: React.MouseEvent, ev: ScheduleEvent) {
    if (e.button !== 0) return
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    dragRef.current = {
      ev,
      offsetY:     e.clientY - rect.top,
      targetIso:   null,
      snappedTime: null,
      hasMoved:    false,
    }
    setDraggingId(ev.id)
  }

  // Attach / detach document listeners only while a drag is active
  useEffect(() => {
    if (!draggingId) return

    document.body.style.userSelect = "none"
    document.body.style.cursor     = "grabbing"

    function onMove(e: MouseEvent) {
      if (!dragRef.current) return
      dragRef.current.hasMoved = true

      const col = getColumnAt(e.clientX, e.clientY)
      if (!col?.dataset.iso) {
        setDropIndicator(null)
        dragRef.current.targetIso = null
        return
      }

      const iso        = col.dataset.iso as string
      const { time, h } = calcTime(e.clientY, col, dragRef.current.offsetY)
      dragRef.current.targetIso   = iso
      dragRef.current.snappedTime = time
      setDropIndicator({ iso, top: (h - HOUR_START) * HOUR_H, time })
    }

    function onUp() {
      const d = dragRef.current
      if (d) {
        if (!d.hasMoved) {
          // Treat short press as click → open modal
          onClickRef.current(d.ev)
        } else if (d.targetIso && d.snappedTime) {
          updateEvent(d.ev.id, { date: d.targetIso, time: d.snappedTime })
        }
      }
      dragRef.current = null
      setDraggingId(null)
      setDropIndicator(null)
    }

    document.addEventListener("mousemove", onMove)
    document.addEventListener("mouseup",   onUp)
    return () => {
      document.body.style.userSelect = ""
      document.body.style.cursor     = ""
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseup",   onUp)
    }
  }, [draggingId, updateEvent])

  // ── Render ────────────────────────────────────────────────────────────────
  const todayInView = days.some(d => isSameDay(d, today))
  const nowTop = todayInView
    ? (today.getHours() - HOUR_START) * HOUR_H + (today.getMinutes() / 60) * HOUR_H
    : null

  return (
    <div ref={scrollRef} className="overflow-y-auto" style={{ maxHeight: 600 }}>
      <div className="flex" style={{ height: GRID_H }}>

        {/* Hour labels */}
        <div className="w-12 shrink-0 relative border-r border-border/30">
          {HOURS.map((h, i) => (
            <div key={h} className="absolute left-0 right-0 flex justify-end pr-2" style={{ top: i * HOUR_H }}>
              {i > 0 && (
                <span className="-translate-y-[9px] text-[10px] tabular-nums text-muted-foreground">
                  {formatHour(h)}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Day columns */}
        <div className="relative flex flex-1">
          {days.map((day, colIdx) => {
            const iso        = dateToISO(day)
            const dayEvents  = events.filter(e => e.date === iso)
            const isTodayCol = isSameDay(day, today)
            const isTarget   = dropIndicator?.iso === iso

            return (
              <div
                key={colIdx}
                data-iso={iso}
                className={cn(
                  "relative flex-1 transition-colors duration-75",
                  colIdx > 0  && "border-l border-border/20",
                  isTodayCol  && !isTarget && "bg-primary/[0.025]",
                  isTarget    && "bg-primary/[0.06]",
                )}
              >
                {/* Hour grid lines */}
                {HOURS.map((_, i) => (
                  <div
                    key={i}
                    className={cn("absolute left-0 right-0 border-t", i === 0 ? "border-border/30" : "border-border/15")}
                    style={{ top: i * HOUR_H }}
                  />
                ))}

                {/* Drop indicator — horizontal line + time pill */}
                {isTarget && dropIndicator && (
                  <div
                    className="pointer-events-none absolute left-1 right-1 z-30 flex items-center gap-1"
                    style={{ top: dropIndicator.top }}
                  >
                    <div className="size-[5px] shrink-0 rounded-full bg-primary" />
                    <div className="h-px flex-1 bg-primary" />
                    <span className="rounded bg-primary px-1 py-px text-[9px] font-semibold tabular-nums text-primary-foreground">
                      {dropIndicator.time}
                    </span>
                  </div>
                )}

                {/* Event blocks */}
                {dayEvents.map(ev => {
                  const { hour, minute } = parseTime(ev.time)
                  if (hour < HOUR_START || hour >= HOUR_END) return null
                  const top       = (hour - HOUR_START) * HOUR_H + (minute / 60) * HOUR_H
                  const height    = Math.max((ev.duration / 60) * HOUR_H - 4, 22)
                  const isDragging = draggingId === ev.id
                  return (
                    <div
                      key={ev.id}
                      onMouseDown={(e) => startDrag(e, ev)}
                      className={cn(
                        "absolute left-1 right-1 overflow-hidden rounded-md border px-1.5 py-0.5 select-none",
                        "cursor-grab",
                        categories.find(c => c.value === ev.type)?.color
                          ?? EVENT_COLORS[ev.type as EventType]
                          ?? "bg-zinc-500/15 text-zinc-400 border-zinc-500/25",
                        isDragging ? "opacity-25 z-10" : "hover:opacity-80 transition-opacity",
                      )}
                      style={{ top: top + 2, height }}
                    >
                      <p className="truncate text-[11px] font-semibold leading-tight">{ev.title}</p>
                      {height > 30 && <p className="text-[10px] leading-tight opacity-70">{ev.time}</p>}
                    </div>
                  )
                })}
              </div>
            )
          })}

          {/* Current time line */}
          {nowTop !== null && nowTop >= 0 && nowTop <= GRID_H && (
            <div className="pointer-events-none absolute left-0 right-0 z-20 flex items-center" style={{ top: nowTop }}>
              <div className="size-[7px] shrink-0 rounded-full bg-primary" />
              <div className="h-px flex-1 bg-primary" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── DayHeaders — shared by week + day views ──────────────────────────────────

function DayHeaders({ days }: { days: Date[] }) {
  const today = new Date()
  return (
    <div className="flex border-b border-border">
      <div className="w-12 shrink-0 border-r border-border/30" />
      {days.map((day, i) => {
        const isToday   = isSameDay(day, today)
        const isWeekend = day.getDay() === 0 || day.getDay() === 6
        return (
          <div key={i} className={cn("flex flex-1 flex-col items-center py-2.5", i > 0 && "border-l border-border/20")}>
            <span className={cn("text-[10px] font-medium uppercase tracking-wide", isWeekend ? "text-muted-foreground/50" : "text-muted-foreground")}>
              {DAY_NAMES[(day.getDay() + 6) % 7]}
            </span>
            <span className={cn(
              "mt-1 flex size-7 items-center justify-center rounded-full text-sm font-medium",
              isToday ? "bg-primary text-primary-foreground" : isWeekend ? "text-muted-foreground/50" : "text-foreground"
            )}>
              {day.getDate()}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ─── TimelineView — Gantt layout with calendar events ────────────────────────

function TimelineView({ year, month }: { year: number; month: number }) {
  const { events, updateEvent } = useEvents()
  const { projects }            = useProjects()
  const { categories }          = useCategories()
  const today = new Date()
  const days  = daysInMonth(year, month)

  // ── Drag state ─────────────────────────────────────────────────────────────
  const dragRef = useRef<{
    evId:      string  // event id (stripped of "dyn-" prefix)
    origDate:  string  // YYYY-MM-DD at drag start
    startX:    number  // clientX at mousedown
    dayDelta:  number  // current snapped day offset
  } | null>(null)

  const [activeDrag, setActiveDrag] = useState<{
    entryId:  string   // "dyn-{evId}"
    dayDelta: number
  } | null>(null)

  function startBarDrag(e: React.MouseEvent, entry: TimelineEntry) {
    if (!entry.id.startsWith("dyn-")) return  // project bars are not draggable
    e.preventDefault()
    dragRef.current = {
      evId:     entry.id.slice(4),
      origDate: entry.startDate,
      startX:   e.clientX,
      dayDelta: 0,
    }
    setActiveDrag({ entryId: entry.id, dayDelta: 0 })
  }

  useEffect(() => {
    if (!activeDrag) return

    document.body.style.userSelect = "none"
    document.body.style.cursor     = "grabbing"

    function onMove(e: MouseEvent) {
      if (!dragRef.current) return
      const rawDelta = (e.clientX - dragRef.current.startX) / DAY_W
      const dayDelta = Math.round(rawDelta)
      if (dayDelta === dragRef.current.dayDelta) return
      dragRef.current.dayDelta = dayDelta
      setActiveDrag(prev => prev ? { ...prev, dayDelta } : null)
    }

    function onUp() {
      const d = dragRef.current
      if (d && d.dayDelta !== 0) {
        const orig = new Date(d.origDate + "T00:00:00")
        orig.setDate(orig.getDate() + d.dayDelta)
        updateEvent(d.evId, { date: dateToISO(orig) })
      }
      dragRef.current = null
      setActiveDrag(null)
    }

    document.addEventListener("mousemove", onMove)
    document.addEventListener("mouseup",   onUp)
    return () => {
      document.body.style.userSelect = ""
      document.body.style.cursor     = ""
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseup",   onUp)
    }
  }, [activeDrag?.entryId, updateEvent])

  // ── Data ──────────────────────────────────────────────────────────────────
  const monthStart = new Date(year, month, 1)
  const monthEnd   = new Date(year, month, days)

  const projectEntries = projects.flatMap(projectToEntries).filter(entry => {
    const s = new Date(entry.startDate)
    const e = new Date(entry.endDate)
    return s <= monthEnd && e >= monthStart
  })

  const eventEntries: TimelineEntry[] = events
    .filter(ev => {
      const d = new Date(ev.date)
      return d >= monthStart && d <= monthEnd
    })
    .map(ev => ({
      id:        `dyn-${ev.id}`,
      site:      ev.customerName ?? ev.title,
      title:     ev.title,
      startDate: ev.date,
      endDate:   ev.date,
      type:      ev.type,
    }))

  const allEntries = [...projectEntries, ...eventEntries]
  const sites      = Array.from(new Set(allEntries.map(e => e.site)))

  const todayOffset =
    today.getFullYear() === year && today.getMonth() === month
      ? (today.getDate() - 1) * DAY_W + DAY_W / 2
      : null

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <div style={{ minWidth: LABEL_W + days * DAY_W }}>

          {/* Header row */}
          <div className="sticky top-0 z-10 flex border-b border-border bg-card">
            <div
              className="shrink-0 border-r border-border px-4 py-2.5 text-xs font-medium text-muted-foreground"
              style={{ width: LABEL_W }}
            >
              Realizacja
            </div>
            <div className="flex" style={{ width: days * DAY_W }}>
              {Array.from({ length: days }, (_, i) => {
                const d = new Date(year, month, i + 1)
                const isWeekend  = d.getDay() === 0 || d.getDay() === 6
                const isTodayCol = today.getDate() === i + 1 && today.getMonth() === month && today.getFullYear() === year
                return (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center justify-center border-r border-border/20 text-[10px]",
                      isWeekend ? "text-muted-foreground/30" : "text-muted-foreground",
                      isTodayCol && "font-semibold text-primary"
                    )}
                    style={{ width: DAY_W, height: 36 }}
                  >
                    {i + 1}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Site rows */}
          {sites.map((site, rowIdx) => {
            const entries = allEntries.filter(e => e.site === site)
            const isLast  = rowIdx === sites.length - 1

            return (
              <div
                key={site}
                className={cn("flex items-center transition-colors hover:bg-muted/[0.04]", !isLast && "border-b border-border/30")}
                style={{ height: ROW_H }}
              >
                {/* Site label */}
                <div
                  className="flex h-full shrink-0 items-center border-r border-border px-4"
                  style={{ width: LABEL_W }}
                >
                  <span className="truncate text-sm text-foreground">{site}</span>
                </div>

                {/* Gantt track */}
                <div className="relative h-full" style={{ width: days * DAY_W }}>

                  {/* Weekend shading */}
                  {Array.from({ length: days }, (_, i) => {
                    const d = new Date(year, month, i + 1)
                    return d.getDay() === 0 || d.getDay() === 6 ? (
                      <div key={i} className="absolute inset-y-0 bg-muted/10" style={{ left: i * DAY_W, width: DAY_W }} />
                    ) : null
                  })}

                  {/* Vertical day separators */}
                  {Array.from({ length: days }, (_, i) => (
                    <div key={i} className="absolute inset-y-0 w-px bg-border/15" style={{ left: (i + 1) * DAY_W }} />
                  ))}

                  {/* Today indicator */}
                  {todayOffset !== null && (
                    <div className="absolute inset-y-0 z-10 w-px bg-primary/40" style={{ left: todayOffset }} />
                  )}

                  {/* Bars */}
                  {entries.map(entry => {
                    const isDraggable = entry.id.startsWith("dyn-")
                    const isDragging  = activeDrag?.entryId === entry.id

                    // Compute virtual entry shifted by drag delta for bar calc
                    let displayEntry = entry
                    if (isDragging && activeDrag) {
                      const orig = new Date(entry.startDate + "T00:00:00")
                      const end  = new Date(entry.endDate   + "T00:00:00")
                      orig.setDate(orig.getDate() + activeDrag.dayDelta)
                      end.setDate(end.getDate()   + activeDrag.dayDelta)
                      displayEntry = { ...entry, startDate: dateToISO(orig), endDate: dateToISO(end) }
                    }

                    const bar = calcBar(displayEntry, year, month, days)
                    if (!bar && !isDragging) return null

                    // Fallback bar for when dragged outside visible range
                    const safeBar = bar ?? { left: 0, width: DAY_W }

                    // New date label while dragging
                    let dateLabel: string | null = null
                    if (isDragging && activeDrag && activeDrag.dayDelta !== 0) {
                      const d = new Date(entry.startDate + "T00:00:00")
                      d.setDate(d.getDate() + activeDrag.dayDelta)
                      dateLabel = `${d.getDate()} ${MONTH_SHORT[d.getMonth()]}`
                    }

                    const barColor =
                      categories.find(c => c.value === entry.type)?.color
                      ?? EVENT_COLORS[entry.type as EventType]
                      ?? "bg-zinc-500/15 text-zinc-400 border-zinc-500/25"

                    return (
                      <div
                        key={entry.id}
                        onMouseDown={isDraggable ? (e) => startBarDrag(e, entry) : undefined}
                        className={cn(
                          "absolute top-1/2 -translate-y-1/2 overflow-hidden rounded-md border px-2.5 select-none",
                          isDraggable ? "cursor-grab" : "cursor-default",
                          // Use category color for event bars, BAR_STYLE for project bars
                          isDraggable
                            ? barColor.replace(/\/15/g, "/20").replace(/\/25/g, "/35")
                            : (BAR_STYLE[entry.type as EventType] ?? barColor),
                          isDragging ? "z-20 opacity-70 shadow-lg" : "transition-opacity hover:opacity-80",
                        )}
                        style={{ left: safeBar.left + 3, width: Math.max(safeBar.width - 6, DAY_W - 6), height: 28 }}
                      >
                        <span className="flex h-full items-center truncate text-[11px] font-medium">
                          {entry.title}
                          {dateLabel && (
                            <span className="ml-1.5 shrink-0 rounded bg-black/20 px-1 py-px text-[9px] tabular-nums">
                              {dateLabel}
                            </span>
                          )}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Page component ───────────────────────────────────────────────────────────

export default function SchedulePage() {
  const { events }     = useEvents()
  const { categories } = useCategories()
  const today = new Date()

  const [view,          setView]          = useState<ViewMode>("calendar")
  const [calMode,       setCalMode]       = useState<CalendarMode>("month")
  const [year,          setYear]          = useState(today.getFullYear())
  const [month,         setMonth]         = useState(today.getMonth())
  const [weekStart,     setWeekStart]     = useState<Date>(() => getWeekStart(today))
  const [dayDate,       setDayDate]       = useState<Date>(() => new Date(today))
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null)

  // ── Mode switching with date sync ─────────────────────────────────────────

  function handleSetMode(mode: CalendarMode) {
    if (mode === calMode) return
    if (mode === "week") {
      setWeekStart(calMode === "day" ? getWeekStart(dayDate) : getWeekStart(new Date(year, month, 1)))
    } else if (mode === "day") {
      setDayDate(calMode === "week" ? new Date(weekStart) : new Date(year, month, 1))
    } else {
      const ref = calMode === "week" ? weekStart : dayDate
      setYear(ref.getFullYear())
      setMonth(ref.getMonth())
    }
    setCalMode(mode)
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  function goPrev() {
    if (calMode === "month" || view === "timeline") {
      if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1)
    } else if (calMode === "week") {
      setWeekStart(d => addDays(d, -7))
    } else {
      setDayDate(d => addDays(d, -1))
    }
  }

  function goNext() {
    if (calMode === "month" || view === "timeline") {
      if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1)
    } else if (calMode === "week") {
      setWeekStart(d => addDays(d, 7))
    } else {
      setDayDate(d => addDays(d, 1))
    }
  }

  // ── Derived values ────────────────────────────────────────────────────────

  const navLabel = view === "timeline" || calMode === "month"
    ? `${MONTH_NAMES[month]} ${year}`
    : calMode === "week"
    ? weekRangeLabel(weekStart)
    : dayLabel(dayDate)

  const totalDays     = daysInMonth(year, month)
  const firstDay      = firstWeekdayOfMonth(year, month)
  const trailingCells = (7 - ((firstDay + totalDays) % 7)) % 7
  const weekDays      = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      <PageSetup title="Terminarz" icon={Calendar01Icon} />

      <div className="flex flex-col gap-4 p-8">

        {/* ── Toolbar ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 items-center">

          <div className="flex items-center">
            {view === "calendar" && (
              <div className="flex h-9 items-stretch gap-0.5 rounded-lg border border-border bg-card p-0.5">
                {(["month", "week", "day"] as CalendarMode[]).map(m => (
                  <button
                    key={m}
                    onClick={() => handleSetMode(m)}
                    className={cn(
                      "rounded-md px-3 text-xs font-medium capitalize transition-colors",
                      calMode === m ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {CAL_MODE_LABEL[m]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-1">
            <button onClick={goPrev} className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              <HugeiconsIcon icon={ArrowLeft01Icon} size={15} />
            </button>
            <span className="min-w-[160px] text-center text-sm font-medium">{navLabel}</span>
            <button onClick={goNext} className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              <HugeiconsIcon icon={ArrowRight01Icon} size={15} />
            </button>
          </div>

          <div className="flex items-center justify-end gap-2">
            <div className="flex h-9 items-stretch gap-0.5 rounded-lg border border-border bg-card p-0.5">
              {([
                { id: "calendar", label: "Kalendarz", icon: Calendar01Icon },
                { id: "timeline", label: "Oś czasu",  icon: BarChartHorizontalIcon },
              ] as const).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setView(tab.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 text-xs font-medium transition-colors",
                    view === tab.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <HugeiconsIcon icon={tab.icon} size={14} />
                  {tab.label}
                </button>
              ))}
            </div>
            <AddEventDialog />
          </div>
        </div>

        {/* ── Calendar – Month ─────────────────────────────────────────────── */}
        {view === "calendar" && calMode === "month" && (
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="grid grid-cols-7 border-b border-border">
              {DAY_NAMES.map(d => (
                <div key={d} className="py-2.5 text-center text-xs font-medium text-muted-foreground">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`l-${i}`} className="min-h-[108px] border-b border-r border-border/40 bg-muted/[0.03]" />
              ))}
              {Array.from({ length: totalDays }).map((_, i) => {
                const day       = i + 1
                const dayEvents = events.filter(e => e.date === toISO(year, month, day))
                const todayCell = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
                const isLastCol = (firstDay + i) % 7 === 6
                return (
                  <div key={day} className={cn("group flex min-h-[108px] flex-col gap-1 border-b border-border/40 p-2 transition-colors hover:bg-muted/[0.04]", !isLastCol && "border-r")}>
                    <span className={cn("flex size-6 items-center justify-center self-start rounded-full text-xs font-medium", todayCell ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>
                      {day}
                    </span>
                    {dayEvents.slice(0, 3).map(ev => (
                      <div
                        key={ev.id}
                        onClick={() => setSelectedEvent(ev)}
                        className={cn(
                          "cursor-pointer truncate rounded-md border px-1.5 py-0.5 text-[11px] font-medium transition-opacity hover:opacity-75",
                          categories.find(c => c.value === ev.type)?.color ?? EVENT_COLORS[ev.type as EventType] ?? "bg-zinc-500/15 text-zinc-400 border-zinc-500/25"
                        )}
                      >
                        <span className="mr-1 opacity-60">{ev.time}</span>{ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && <span className="px-1 text-[10px] text-muted-foreground">+{dayEvents.length - 3} więcej</span>}
                  </div>
                )
              })}
              {Array.from({ length: trailingCells }).map((_, i) => (
                <div key={`t-${i}`} className={cn("min-h-[108px] border-b border-border/40 bg-muted/[0.03]", i < trailingCells - 1 && "border-r")} />
              ))}
            </div>
          </div>
        )}

        {/* ── Calendar – Week ──────────────────────────────────────────────── */}
        {view === "calendar" && calMode === "week" && (
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <DayHeaders days={weekDays} />
            <TimeGrid days={weekDays} onEventClick={setSelectedEvent} />
          </div>
        )}

        {/* ── Calendar – Day ───────────────────────────────────────────────── */}
        {view === "calendar" && calMode === "day" && (
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <DayHeaders days={[dayDate]} />
            <TimeGrid days={[dayDate]} onEventClick={setSelectedEvent} />
          </div>
        )}

        {/* ── Timeline ─────────────────────────────────────────────────────── */}
        {view === "timeline" && <TimelineView year={year} month={month} />}

        {/* ── Legend ──────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-5">
          {categories.map((cat) => (
            <div key={cat.value} className="flex items-center gap-1.5">
              <div className={cn("size-2 rounded-full", cat.dot)} />
              <span className="text-xs text-muted-foreground">{cat.label}</span>
            </div>
          ))}
        </div>

      </div>

      {/* ── Event detail dialog ──────────────────────────────────────────── */}
      <Dialog open={!!selectedEvent} onOpenChange={(open) => { if (!open) setSelectedEvent(null) }}>
        {selectedEvent && (
          <EventDetailDialog event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        )}
      </Dialog>
    </>
  )
}
