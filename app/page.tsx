import { CurrentProjects } from "@/components/CurrentProjects"
import { CurrentShipments } from "@/components/CurrentShipments"
import { PendingOffers } from "@/components/PendingOffers"
import { ScheduleTimeline } from "@/components/ScheduleTimeline"
import { PageSetup } from "@/components/PageSetup"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"
import {
  Home01Icon,
  Folder01Icon,
  Invoice01Icon,
  ShoppingCart01Icon,
  Calendar01Icon,
  UserAdd01Icon,
  DeliveryTruck01Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const stats: { title: string; value: string; note: string; icon: IconSvgElement }[] = [
  { title: "Aktualne realizacje", value: "3", note: "+1 w tym tygodniu", icon: Folder01Icon },
  { title: "Przychód miesięczny", value: "14 200 zł", note: "↑ 12% vs poprzedni miesiąc", icon: Invoice01Icon },
  { title: "Oferty w toku", value: "4", note: "2 oczekują na wycenę", icon: ShoppingCart01Icon },
  { title: "Zaplanowane montaże", value: "5", note: "Następne: dziś 08:00", icon: Calendar01Icon },
]

// Returns a color class based on note prefix — positive green, negative red, neutral muted
function noteClass(note: string) {
  if (note.startsWith("+") || note.startsWith("↑")) return "text-emerald-500"
  if (note.startsWith("-") || note.startsWith("↓")) return "text-red-500"
  return "text-muted-foreground"
}

function ActiveProjectsCard() {
  return (
    <div className="rounded-2xl bg-background border border-border overflow-hidden">
      <div className="flex items-center justify-between px-3 pt-3 pb-3">
        <p className="text-sm text-muted-foreground">Aktualne realizacje</p>
        <HugeiconsIcon icon={Folder01Icon} size={15} className="text-muted-foreground" />
      </div>
      <div className="mx-3 mb-2 rounded-xl bg-card p-3">
        <p className="text-2xl font-bold text-foreground">3</p>
        <p className={cn("mt-1 text-xs", noteClass("+1 w tym tygodniu"))}>+1 w tym tygodniu</p>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  note,
  icon,
}: {
  title: string
  value: string
  note: string
  icon: IconSvgElement
}) {
  return (
    <div className="rounded-2xl bg-background border border-border overflow-hidden">
      <div className="flex items-center justify-between px-3 pt-3 pb-3">
        <p className="text-sm text-muted-foreground">{title}</p>
        <HugeiconsIcon icon={icon} size={15} className="text-muted-foreground" />
      </div>
      <div className="mx-3 mb-2 rounded-xl bg-card p-3">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className={cn("mt-1 text-xs", noteClass(note))}>{note}</p>
      </div>
    </div>
  )
}


export default function Page() {
  return (
    <div className="flex h-full flex-col gap-8 p-8">
      <PageSetup title="Dashboard" icon={Home01Icon} />

      {/* Welcome header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dzień dobry, Jan!</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Oto co dzieje się dziś w Twojej firmie.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="lg">
            <HugeiconsIcon icon={UserAdd01Icon} data-icon="inline-start" />
            Dodaj klienta
          </Button>
          <Button variant="default" size="lg">
            <HugeiconsIcon icon={DeliveryTruck01Icon} data-icon="inline-start" />
            Zaplanuj transport
          </Button>
        </div>
      </div>

      {/* Stats row — first card uses Minto-style redesign, rest use standard StatCard */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <ActiveProjectsCard />
        {stats.slice(1).map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Projects left (wider), Offers + Shipments stacked on the right.
          Grid stretches both columns to equal height — the end-of-list
          indicator in CurrentProjects fills whatever space remains. */}
      <div className="grid grid-cols-[3fr_2fr] gap-8">
        <div className="flex flex-col">
          <CurrentProjects />
        </div>
        <div className="flex flex-col gap-8">
          <PendingOffers />
          <CurrentShipments />
        </div>
      </div>

      {/* Schedule */}
      <ScheduleTimeline />
    </div>
  )
}
