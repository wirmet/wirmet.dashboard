import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

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

const typeStyle: Record<EventType, string> = {
  "Montaż":   "bg-blue-50 text-blue-700 border-blue-200",
  "Dostawa":  "bg-amber-50 text-amber-700 border-amber-200",
  "Spotkanie":"bg-purple-50 text-purple-700 border-purple-200",
  "Odbiór":   "bg-green-50 text-green-700 border-green-200",
}

const dotColor: Record<EventType, string> = {
  "Montaż":   "bg-blue-400",
  "Dostawa":  "bg-amber-400",
  "Spotkanie":"bg-purple-400",
  "Odbiór":   "bg-green-400",
}

// Group events by date
const grouped = events.reduce<Record<string, ScheduleEvent[]>>((acc, event) => {
  if (!acc[event.date]) acc[event.date] = []
  acc[event.date].push(event)
  return acc
}, {})

export function ScheduleTimeline() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
      <div className="flex divide-x divide-zinc-100">
        {Object.entries(grouped).map(([date, dayEvents], groupIndex) => (
          <div key={date} className="flex-1 min-w-0">
            {/* Day header */}
            <div className="px-4 py-2 border-b border-zinc-100 bg-zinc-50">
              <p className="text-xs font-semibold text-zinc-900">{date}</p>
              <p className="text-[11px] text-zinc-400">
                {groupIndex === 0 ? "Dzisiaj" : "Jutro"}
              </p>
            </div>

            {/* Events */}
            <div>
              {dayEvents.map((event, i) => (
                <div key={i}>
                  <div className="flex items-start gap-3 px-4 py-3">
                    {/* Time */}
                    <span className="w-10 shrink-0 text-xs font-medium text-zinc-400 pt-0.5">
                      {event.time}
                    </span>

                    {/* Dot + line */}
                    <div className="flex flex-col items-center pt-1.5 shrink-0">
                      <div className={cn("size-2 rounded-full shrink-0", dotColor[event.type])} />
                      {i < dayEvents.length - 1 && (
                        <div className="w-px flex-1 bg-zinc-100 mt-1" style={{ minHeight: "1.5rem" }} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1 flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-zinc-900 truncate">{event.title}</p>
                        <p className="text-xs text-zinc-400 truncate">{event.client}</p>
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
                    <Separator className="bg-zinc-50 ml-4" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
