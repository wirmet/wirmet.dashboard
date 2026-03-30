import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import Link from "next/link"

type EventType = "Montaż" | "Dostawa" | "Spotkanie" | "Odbiór"

interface ScheduleEvent {
  time: string
  date: string
  title: string
  client: string
  type: EventType
  isToday?: boolean
}

const events: ScheduleEvent[] = [
  { time: "08:00", date: "Mon, 17 Mar", title: "Montaż balustrad",       client: "Marek Wiśniewski",  type: "Montaż",    isToday: true  },
  { time: "10:30", date: "Mon, 17 Mar", title: "Dostawa materiałów",     client: "Budmax Sp. z o.o.", type: "Dostawa",   isToday: true  },
  { time: "14:00", date: "Mon, 17 Mar", title: "Spotkanie z klientem",   client: "Anna Kowalczyk",    type: "Spotkanie", isToday: true  },
  { time: "09:00", date: "Tue, 18 Mar", title: "Odbiór towaru",          client: "Firma Rem-Bud",     type: "Odbiór"                   },
  { time: "11:00", date: "Tue, 18 Mar", title: "Instalacja okien",       client: "Piotr Jabłoński",   type: "Montaż"                   },
]

// Opacity-based badge colors — work in both light and dark
const typeStyle: Record<EventType, string> = {
  "Montaż":    "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Dostawa":   "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Spotkanie": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Odbiór":    "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
}

const dotColor: Record<EventType, string> = {
  "Montaż":    "bg-blue-500/70",
  "Dostawa":   "bg-amber-500/70",
  "Spotkanie": "bg-purple-500/70",
  "Odbiór":    "bg-emerald-500/70",
}

// Group events by date preserving insertion order
const grouped = events.reduce<Record<string, ScheduleEvent[]>>((acc, ev) => {
  if (!acc[ev.date]) acc[ev.date] = []
  acc[ev.date].push(ev)
  return acc
}, {})

export function ScheduleTimeline() {
  const groups = Object.entries(grouped)

  return (
    <div>
      {/* Section header — consistent with all other dashboard sections */}
      <div className="mb-4 flex items-center justify-between">
        <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-foreground">Schedule</p>
        <Link
          href="/schedule"
          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          View all
          <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
        </Link>
      </div>

      {/* Day columns */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex flex-col divide-y divide-border sm:flex-row sm:divide-x sm:divide-y-0">
          {groups.map(([date, dayEvents], groupIndex) => (
            <div key={date} className="flex-1 min-w-0">

              {/* Day header */}
              <div className="border-b border-border bg-muted/30 px-4 py-2.5">
                <p className="text-xs font-semibold text-foreground">{date}</p>
                <p className="text-[11px] text-muted-foreground">
                  {groupIndex === 0 ? "Today" : "Tomorrow"}
                </p>
              </div>

              {/* Events */}
              <div className="divide-y divide-border/50">
                {dayEvents.map((ev, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3">
                    {/* Time */}
                    <span className="w-10 shrink-0 pt-0.5 text-xs font-medium tabular-nums text-muted-foreground">
                      {ev.time}
                    </span>

                    {/* Dot + connector */}
                    <div className="flex shrink-0 flex-col items-center pt-1.5">
                      <div className={cn("size-2 shrink-0 rounded-full", dotColor[ev.type])} />
                      {i < dayEvents.length - 1 && (
                        <div className="mt-1 w-px flex-1 bg-border" style={{ minHeight: "1.5rem" }} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex min-w-0 flex-1 items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{ev.title}</p>
                        <p className="truncate text-xs text-muted-foreground">{ev.client}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn("shrink-0 text-[11px]", typeStyle[ev.type])}
                      >
                        {ev.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
