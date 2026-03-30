"use client"

import { useState } from "react"
import { PageSetup } from "@/components/PageSetup"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Calendar01Icon,
  BarChartHorizontalIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"
import { AddEventDialog } from "@/components/AddEventDialog"
import { useEvents, type ScheduleEvent, type EventType } from "@/components/EventsContext"
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

// ─── Static data ─────────────────────────────────────────────────────────────

// Timeline entries — multi-day events grouped by construction site
const TIMELINE_ENTRIES: TimelineEntry[] = [
  // Kowalski Residence
  { id: "t1",  site: "Kowalski Residence", title: "Foundation work",       startDate: "2026-03-01", endDate: "2026-03-08", type: "montaz"        },
  { id: "t2",  site: "Kowalski Residence", title: "Material delivery",     startDate: "2026-03-09", endDate: "2026-03-10", type: "przeglad"      },
  { id: "t3",  site: "Kowalski Residence", title: "Concrete pour",         startDate: "2026-03-18", endDate: "2026-03-22", type: "montaz"        },
  // Nowak Building
  { id: "t4",  site: "Nowak Building",     title: "Steel frame install",   startDate: "2026-03-04", endDate: "2026-03-13", type: "montaz"        },
  { id: "t5",  site: "Nowak Building",     title: "Safety inspection",     startDate: "2026-03-20", endDate: "2026-03-21", type: "przeglad"      },
  { id: "t6",  site: "Nowak Building",     title: "Roofing work",          startDate: "2026-03-25", endDate: "2026-03-31", type: "wizja lokalna" },
  // Office Renovation
  { id: "t7",  site: "Office Renovation",  title: "Design review",         startDate: "2026-03-01", endDate: "2026-03-05", type: "spotkanie"     },
  { id: "t8",  site: "Office Renovation",  title: "Window delivery",       startDate: "2026-03-12", endDate: "2026-03-13", type: "montaz"        },
  { id: "t9",  site: "Office Renovation",  title: "Interior framing",      startDate: "2026-03-16", endDate: "2026-03-28", type: "montaz"        },
  // Warehouse Project
  { id: "t10", site: "Warehouse Project",  title: "Client meeting",        startDate: "2026-03-03", endDate: "2026-03-03", type: "spotkanie"     },
  { id: "t11", site: "Warehouse Project",  title: "Foundation inspection", startDate: "2026-03-10", endDate: "2026-03-11", type: "przeglad"      },
  { id: "t12", site: "Warehouse Project",  title: "Steel delivery",        startDate: "2026-03-17", endDate: "2026-03-19", type: "montaz"        },
  // Villa Wiśniewski
  { id: "t13", site: "Villa Wiśniewski",   title: "Electrical planning",   startDate: "2026-03-06", endDate: "2026-03-10", type: "spotkanie"     },
  { id: "t14", site: "Villa Wiśniewski",   title: "Plumbing work",         startDate: "2026-03-14", endDate: "2026-03-26", type: "wizja lokalna" },
  // Parking Lot
  { id: "t15", site: "Parking Lot",        title: "Site survey",           startDate: "2026-03-02", endDate: "2026-03-04", type: "wizja lokalna" },
  { id: "t16", site: "Parking Lot",        title: "Material order",        startDate: "2026-03-20", endDate: "2026-03-23", type: "montaz"        },
]

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
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]
const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const DAY_NAMES   = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

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
  if (h === 0)  return "12am"
  if (h < 12)  return `${h}am`
  if (h === 12) return "12pm"
  return `${h - 12}pm`
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

// ─── TimeGrid — shared by week + day views ────────────────────────────────────

function TimeGrid({ days }: { days: Date[] }) {
  const { events } = useEvents()
  const today = new Date()
  const todayInView = days.some(d => isSameDay(d, today))
  const nowTop = todayInView
    ? (today.getHours() - HOUR_START) * HOUR_H + (today.getMinutes() / 60) * HOUR_H
    : null

  return (
    <div className="overflow-y-auto" style={{ maxHeight: 600 }}>
      <div className="flex" style={{ height: GRID_H }}>
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

        <div className="relative flex flex-1">
          {days.map((day, colIdx) => {
            const iso       = dateToISO(day)
            const dayEvents = events.filter(e => e.date === iso)
            const isTodayCol = isSameDay(day, today)

            return (
              <div
                key={colIdx}
                className={cn("relative flex-1", colIdx > 0 && "border-l border-border/20", isTodayCol && "bg-primary/[0.025]")}
              >
                {HOURS.map((_, i) => (
                  <div
                    key={i}
                    className={cn("absolute left-0 right-0 border-t", i === 0 ? "border-border/30" : "border-border/15")}
                    style={{ top: i * HOUR_H }}
                  />
                ))}
                {dayEvents.map(ev => {
                  const { hour, minute } = parseTime(ev.time)
                  if (hour < HOUR_START || hour >= HOUR_END) return null
                  const top    = (hour - HOUR_START) * HOUR_H + (minute / 60) * HOUR_H
                  const height = Math.max((ev.duration / 60) * HOUR_H - 4, 22)
                  return (
                    <div
                      key={ev.id}
                      className={cn("absolute left-1 right-1 cursor-pointer overflow-hidden rounded-md border px-1.5 py-0.5 transition-opacity hover:opacity-75", EVENT_COLORS[ev.type])}
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
  const { events } = useEvents()
  const today = new Date()
  const days  = daysInMonth(year, month)

  // New calendar events appear as single-day bars; site label = customer name or title
  const dynamicEntries: TimelineEntry[] = events.map(ev => ({
    id:        `dyn-${ev.id}`,
    site:      ev.customerName ?? ev.title,
    title:     ev.title,
    startDate: ev.date,
    endDate:   ev.date,
    type:      ev.type,
  }))
  const allEntries = [...TIMELINE_ENTRIES, ...dynamicEntries]

  // Unique site names preserve insertion order
  const sites = Array.from(new Set(allEntries.map(e => e.site)))

  // Today's vertical offset (only if today is within the displayed month)
  const todayOffset =
    today.getFullYear() === year && today.getMonth() === month
      ? (today.getDate() - 1) * DAY_W + DAY_W / 2
      : null

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <div style={{ minWidth: LABEL_W + days * DAY_W }}>

          {/* Header row: label spacer + day numbers */}
          <div className="sticky top-0 z-10 flex border-b border-border bg-card">
            <div
              className="shrink-0 border-r border-border px-4 py-2.5 text-xs font-medium text-muted-foreground"
              style={{ width: LABEL_W }}
            >
              Site
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

                  {/* Event bars */}
                  {entries.map(entry => {
                    const bar = calcBar(entry, year, month, days)
                    if (!bar) return null
                    return (
                      <div
                        key={entry.id}
                        className={cn(
                          "absolute top-1/2 -translate-y-1/2 cursor-pointer overflow-hidden rounded-md px-2.5 transition-opacity hover:opacity-80",
                          BAR_STYLE[entry.type]
                        )}
                        style={{ left: bar.left + 3, width: bar.width - 6, height: 28 }}
                      >
                        <span className="flex h-full items-center truncate text-[11px] font-medium">
                          {entry.title}
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
  const { events } = useEvents()
  const today = new Date()

  const [view,      setView]      = useState<ViewMode>("calendar")
  const [calMode,   setCalMode]   = useState<CalendarMode>("month")
  const [year,      setYear]      = useState(today.getFullYear())
  const [month,     setMonth]     = useState(today.getMonth())
  const [weekStart, setWeekStart] = useState<Date>(() => getWeekStart(today))
  const [dayDate,   setDayDate]   = useState<Date>(() => new Date(today))

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
      <PageSetup title="Schedule" icon={Calendar01Icon} />

      <div className="flex flex-col gap-4 p-8">

        {/* ── Toolbar ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 items-center">

          <div className="flex items-center">
            {view === "calendar" && (
              <div className="flex h-8 items-stretch gap-0.5 rounded-lg border border-border bg-card p-0.5">
                {(["month", "week", "day"] as CalendarMode[]).map(m => (
                  <button
                    key={m}
                    onClick={() => handleSetMode(m)}
                    className={cn(
                      "rounded-md px-3 text-xs font-medium capitalize transition-colors",
                      calMode === m ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {m.charAt(0).toUpperCase() + m.slice(1)}
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
            <div className="flex h-8 items-stretch gap-0.5 rounded-lg border border-border bg-card p-0.5">
              {([
                { id: "calendar", label: "Calendar", icon: Calendar01Icon },
                { id: "timeline", label: "Timeline",  icon: BarChartHorizontalIcon },
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
                      <div key={ev.id} className={cn("cursor-pointer truncate rounded-md border px-1.5 py-0.5 text-[11px] font-medium transition-opacity hover:opacity-75", EVENT_COLORS[ev.type])}>
                        <span className="mr-1 opacity-60">{ev.time}</span>{ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && <span className="px-1 text-[10px] text-muted-foreground">+{dayEvents.length - 3} more</span>}
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
            <TimeGrid days={weekDays} />
          </div>
        )}

        {/* ── Calendar – Day ───────────────────────────────────────────────── */}
        {view === "calendar" && calMode === "day" && (
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <DayHeaders days={[dayDate]} />
            <TimeGrid days={[dayDate]} />
          </div>
        )}

        {/* ── Timeline ─────────────────────────────────────────────────────── */}
        {view === "timeline" && <TimelineView year={year} month={month} />}

        {/* ── Legend ──────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-5">
          {(Object.entries(EVENT_DOT) as [EventType, string][]).map(([type, dot]) => (
            <div key={type} className="flex items-center gap-1.5">
              <div className={cn("size-2 rounded-full", dot)} />
              <span className="text-xs text-muted-foreground">{TYPE_LABEL[type]}</span>
            </div>
          ))}
        </div>

      </div>
    </>
  )
}
