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
  {
    time: "08:00",
    date: "Pon, 17 Mar",
    title: "Montaż balustrad",
    client: "Marek Wiśniewski",
    type: "Montaż",
    isToday: true,
  },
  {
    time: "10:30",
    date: "Pon, 17 Mar",
    title: "Dostawa materiałów",
    client: "Budmax Sp. z o.o.",
    type: "Dostawa",
    isToday: true,
  },
  {
    time: "14:00",
    date: "Pon, 17 Mar",
    title: "Spotkanie z klientem",
    client: "Anna Kowalczyk",
    type: "Spotkanie",
    isToday: true,
  },
  {
    time: "09:00",
    date: "Wt, 18 Mar",
    title: "Odbiór towaru",
    client: "Firma Rem-Bud",
    type: "Odbiór",
  },
  {
    time: "11:00",
    date: "Wt, 18 Mar",
    title: "Instalacja okien",
    client: "Piotr Jabłoński",
    type: "Montaż",
  },
]

// Opacity-based badge colors — work in both light and dark
const typeStyle: Record<EventType, string> = {
  "Montaż":    "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Dostawa":   "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Spotkanie": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Odbiór":    "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
}

// Opacity-based dot colors — avoids raw color values (Rule 10)
const dotColor: Record<EventType, string> = {
  "Montaż":    "bg-blue-500/70",
  "Dostawa":   "bg-amber-500/70",
  "Spotkanie": "bg-purple-500/70",
  "Odbiór":    "bg-emerald-500/70",
}

// Group events by date
const grouped = events.reduce<Record<string, ScheduleEvent[]>>((acc, event) => {
  if (!acc[event.date]) acc[event.date] = []
  acc[event.date].push(event)
  return acc
}, {})

export function ScheduleTimeline() {
  return (
    <div className="rounded-2xl bg-background border border-border overflow-hidden">
      <div className="flex items-center justify-between px-3 pt-3 pb-3">
        <p className="text-sm text-muted-foreground">Schedule</p>
        <Link
          href="/schedule"
          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          View all
          <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
        </Link>
      </div>

      <div className="mx-3 mb-3 rounded-xl bg-card overflow-hidden">
        <div className="flex flex-col divide-y divide-border sm:flex-row sm:divide-x sm:divide-y-0">
        {Object.entries(grouped).map(([date, dayEvents], groupIndex) => (
          <div key={date} className="flex-1 min-w-0">
            {/* Day header */}
            <div className="px-4 py-2 border-b border-border bg-muted/40">
              <p className="text-xs font-semibold text-foreground">{date}</p>
              <p className="text-[11px] text-muted-foreground">
                {groupIndex === 0 ? "Today" : "Tomorrow"}
              </p>
            </div>

            {/* Events */}
            <div>
              {dayEvents.map((event, i) => (
                <div key={i}>
                  <div className="flex items-start gap-3 px-4 py-3">
                    {/* Time */}
                    <span className="w-10 shrink-0 text-xs font-medium text-muted-foreground pt-0.5">
                      {event.time}
                    </span>

                    {/* Dot + connector line */}
                    <div className="flex flex-col items-center pt-1.5 shrink-0">
                      <div className={cn("size-2 rounded-full shrink-0", dotColor[event.type])} />
                      {i < dayEvents.length - 1 && (
                        <div className="w-px flex-1 bg-border mt-1" style={{ minHeight: "1.5rem" }} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1 flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{event.title}</p>
                        <p className="truncate text-xs text-muted-foreground">{event.client}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn("shrink-0 text-[11px]", typeStyle[event.type])}
                      >
                        {event.type}
                      </Badge>
                    </div>
                  </div>
                  {i < dayEvents.length - 1 && (
                    <div className="border-b border-border/50 ml-4" />
                  )}
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
