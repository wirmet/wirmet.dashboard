import { CurrentProjects } from "@/components/CurrentProjects"
import { CurrentShipments } from "@/components/CurrentShipments"
import { PendingOffers } from "@/components/PendingOffers"
import { ScheduleTimeline } from "@/components/ScheduleTimeline"
import { PageSetup } from "@/components/PageSetup"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon, Home01Icon } from "@hugeicons/core-free-icons"

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-sm font-medium text-zinc-500">{title}</h2>
      <a
        href={href}
        className="flex items-center gap-1 text-xs text-zinc-400 transition-colors hover:text-zinc-600"
      >
        View all
        <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
      </a>
    </div>
  )
}

export default function Page() {
  return (
    <div className="flex h-full flex-col gap-8 p-8">
      <PageSetup title="Dashboard" icon={Home01Icon} />
      {/* Row 1: Current Projects */}
      <section>
        <SectionHeader title="Current Projects" href="/projects" />
        <CurrentProjects />
      </section>

      {/* Row 2: Shipments + Pending Offers side by side */}
      <div className="grid grid-cols-2 gap-6">
        <section>
          <SectionHeader title="Current Shipments" href="/shipments" />
          <CurrentShipments />
        </section>
        <section>
          <SectionHeader title="Oferty do zrobienia" href="/offers" />
          <PendingOffers />
        </section>
      </div>

      {/* Row 3: Schedule */}
      <section>
        <SectionHeader title="Terminarz" href="/schedule" />
        <ScheduleTimeline />
      </section>
    </div>
  )
}
