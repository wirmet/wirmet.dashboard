import { CurrentProjects } from "@/components/CurrentProjects"
import { CurrentShipments } from "@/components/CurrentShipments"
import { PendingOffers } from "@/components/PendingOffers"
import { ScheduleTimeline } from "@/components/ScheduleTimeline"
import { DashboardStats } from "@/components/DashboardStats"
import { PageSetup } from "@/components/PageSetup"
import { HugeiconsIcon } from "@hugeicons/react"
import { Home01Icon } from "@hugeicons/core-free-icons"
import { ScheduleTransportDialog } from "@/components/ScheduleTransportDialog"
import { AddCustomerDialog } from "@/components/AddCustomerDialog"

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Page() {
  // Server-side date — shown in the header as context
  const today = new Date()
  const dateLabel = today.toLocaleDateString("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  return (
    <div className="flex h-full flex-col gap-6 p-4 md:gap-8 md:p-8">
      <PageSetup title="Pulpit" icon={Home01Icon} />

      {/* ── Welcome header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium text-muted-foreground">{dateLabel}</p>
          {/* Poppins display font for the greeting — brand-level heading */}
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
            Dzień dobry, Jan.
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Oto co dzieje się w Twojej firmie dzisiaj.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ScheduleTransportDialog />
          <AddCustomerDialog />
        </div>
      </div>

      {/* ── Stats — each card color matches its section below ──────────────── */}
      <DashboardStats />

      {/* ── Main content: projects left (wider) + offers/shipments right ──── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[3fr_2fr]">
        {/* Left — card wrapper gives consistent frame for the projects list */}
        <div className="flex flex-col rounded-2xl border border-border bg-card overflow-hidden">
          <CurrentProjects />
        </div>

        {/* Right — two stacked section cards aligned at same visual weight */}
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <PendingOffers />
          </div>
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <CurrentShipments />
          </div>
        </div>
      </div>

      {/* ── Schedule ───────────────────────────────────────────────────────── */}
      <ScheduleTimeline />
    </div>
  )
}
