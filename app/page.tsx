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
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { ScheduleTransportDialog } from "@/components/ScheduleTransportDialog"
import { AddCustomerDialog } from "@/components/AddCustomerDialog"
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
    <div className="flex h-full flex-col gap-6 p-4 md:gap-8 md:p-8">
      <PageSetup title="Dashboard" icon={Home01Icon} />

      {/* Welcome header — stacks vertically on mobile */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dzień dobry, Jan!</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Oto co dzieje się dziś w Twojej firmie.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <AddCustomerDialog />
          <ScheduleTransportDialog />
        </div>
      </div>

      {/* Stats row — 1 col on xs, 2 on sm, 4 on lg */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ActiveProjectsCard />
        {stats.slice(1).map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Projects left (wider), Offers + Shipments stacked on the right.
          Stacks vertically on tablet and below, side-by-side on desktop. */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr] lg:gap-8">
        <div className="flex flex-col">
          <CurrentProjects />
        </div>
        <div className="flex flex-col gap-6 lg:gap-8">
          <PendingOffers />
          <CurrentShipments />
        </div>
      </div>

      {/* Schedule */}
      <ScheduleTimeline />
    </div>
  )
}
