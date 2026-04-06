"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import Link from "next/link"
import { useEvents } from "@/components/EventsContext"
import { useCategories } from "@/components/CategoriesContext"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isoToday(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function addDaysISO(iso: string, n: number): string {
  const d = new Date(iso + "T00:00:00")
  d.setDate(d.getDate() + n)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

const MONTH_SHORT = ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru"]
const DAY_SHORT   = ["Nd", "Pon", "Wt", "Śr", "Czw", "Pt", "Sob"]

function formatDateHeading(iso: string): string {
  const d = new Date(iso + "T00:00:00")
  return `${DAY_SHORT[d.getDay()]}, ${d.getDate()} ${MONTH_SHORT[d.getMonth()]}`
}

function groupLabel(iso: string, todayISO: string): string {
  if (iso === todayISO) return "Dzisiaj"
  if (iso === addDaysISO(todayISO, 1)) return "Jutro"
  return formatDateHeading(iso)
}

// ─── ScheduleTimeline ─────────────────────────────────────────────────────────

export function ScheduleTimeline() {
  const { events }     = useEvents()
  const { categories } = useCategories()

  const todayISO = isoToday()

  // Upcoming events: today and beyond, sorted by date then time string
  const upcoming = [...events]
    .filter(ev => ev.date >= todayISO)
    .sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date)
      return a.time.localeCompare(b.time)
    })

  // Group into at most 2 distinct date buckets
  const grouped: Record<string, typeof events> = {}
  for (const ev of upcoming) {
    if (Object.keys(grouped).length === 2 && !grouped[ev.date]) break
    if (!grouped[ev.date]) grouped[ev.date] = []
    grouped[ev.date].push(ev)
  }

  const dateKeys = Object.keys(grouped)
  const isEmpty  = dateKeys.length === 0

  return (
    <div>
      {/* Section header */}
      <div className="mb-4 flex items-center justify-between">
        <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-foreground">Terminarz</p>
        <Link
          href="/schedule"
          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Wszystkie
          <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10">
            <p className="text-sm text-muted-foreground">Brak nadchodzących wydarzeń</p>
            <Link href="/schedule" className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors">
              Przejdź do terminarza
            </Link>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-border sm:flex-row sm:divide-x sm:divide-y-0">
            {dateKeys.map((iso, groupIndex) => {
              const dayEvents = grouped[iso]
              const cat0 = categories.find(c => c.value === dayEvents[0]?.type)
              return (
                <div key={iso} className="flex-1 min-w-0">

                  {/* Day header */}
                  <div className="border-b border-border bg-muted/30 px-4 py-2.5">
                    <p className="text-xs font-semibold text-foreground">{formatDateHeading(iso)}</p>
                    <p className="text-[11px] text-muted-foreground">{groupLabel(iso, todayISO)}</p>
                  </div>

                  {/* Events */}
                  <div className="divide-y divide-border/50">
                    {dayEvents.map((ev, i) => {
                      const cat       = categories.find(c => c.value === ev.type)
                      const dotClass  = cat?.dot  ?? "bg-zinc-400/70"
                      const badgeCls  = cat?.color ?? "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                      const typeLabel = cat?.label ?? ev.type

                      return (
                        <div key={ev.id} className="flex items-start gap-3 px-4 py-3">
                          {/* Time */}
                          <span className="w-10 shrink-0 pt-0.5 text-xs font-medium tabular-nums text-muted-foreground">
                            {ev.time}
                          </span>

                          {/* Dot + connector */}
                          <div className="flex shrink-0 flex-col items-center pt-1.5">
                            <div className={cn("size-2 shrink-0 rounded-full", dotClass)} />
                            {i < dayEvents.length - 1 && (
                              <div className="mt-1 w-px flex-1 bg-border" style={{ minHeight: "1.5rem" }} />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex min-w-0 flex-1 items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-foreground">{ev.title}</p>
                              <p className="truncate text-xs text-muted-foreground">
                                {ev.customerName ?? ev.assignee ?? "—"}
                              </p>
                            </div>
                            <Badge variant="outline" className={cn("shrink-0 text-[11px]", badgeCls)}>
                              {typeLabel}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
