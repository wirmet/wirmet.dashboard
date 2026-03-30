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
  DeliveryTruck01Icon,
  Wrench01Icon,
} from "@hugeicons/core-free-icons"
import { ScheduleTransportDialog } from "@/components/ScheduleTransportDialog"
import { AddCustomerDialog } from "@/components/AddCustomerDialog"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

// Wirmet brand palette: orange / green / blue + rose as fourth warm accent
type Accent = "orange" | "green" | "blue" | "rose"

// ─── Accent tokens ────────────────────────────────────────────────────────────

// Gradient bar: solid on left, fades to transparent — gives each card its own identity
const accentBar: Record<Accent, string> = {
  orange: "bg-gradient-to-r from-wirmet-orange to-wirmet-orange/0",
  green:  "bg-gradient-to-r from-wirmet-green  to-wirmet-green/0",
  blue:   "bg-gradient-to-r from-wirmet-blue   to-wirmet-blue/0",
  rose:   "bg-gradient-to-r from-rose-400      to-rose-400/0",
}

const accentIcon: Record<Accent, string> = {
  orange: "text-wirmet-orange",
  green:  "text-wirmet-green",
  blue:   "text-wirmet-blue",
  rose:   "text-rose-400",
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string
  value: string
  note: string
  // true = emerald, false = red, null = muted-foreground
  notePositive?: boolean | null
  icon: IconSvgElement
  accent: Accent
}

function StatCard({ title, value, note, notePositive, icon, accent }: StatCardProps) {
  const noteColor =
    notePositive === true  ? "text-emerald-500" :
    notePositive === false ? "text-red-500"      :
    "text-muted-foreground"

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      {/* 2 px gradient accent bar */}
      <div className={cn("h-[2px] shrink-0", accentBar[accent])} />

      <div className="flex flex-col gap-3 px-5 pb-5 pt-4">
        {/* Label + icon */}
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <HugeiconsIcon icon={icon} size={14} className={cn("shrink-0", accentIcon[accent])} />
        </div>

        {/* Big number */}
        <p className="text-4xl font-bold leading-none tabular-nums text-foreground">
          {value}
        </p>

        {/* Trend note */}
        <p className={cn("text-xs", noteColor)}>{note}</p>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Page() {
  // Server-side date — shown in the header as context
  const today = new Date()
  const dateLabel = today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  return (
    <div className="flex h-full flex-col gap-6 p-4 md:gap-8 md:p-8">
      <PageSetup title="Dashboard" icon={Home01Icon} />

      {/* ── Welcome header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium text-muted-foreground">{dateLabel}</p>
          {/* Poppins display font for the greeting — brand-level heading */}
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
            Good morning, Jan.
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening in your company today.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ScheduleTransportDialog />
          <AddCustomerDialog />
        </div>
      </div>

      {/* ── Stats — each card color matches its section below ──────────────── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* green = Realizacje → matches CurrentProjects section */}
        <StatCard
          title="Realizacje w toku"
          value="3"
          note="+1 w tym tygodniu"
          notePositive={true}
          icon={Folder01Icon}
          accent="green"
        />
        {/* orange = Oferty → matches PendingOffers section */}
        <StatCard
          title="Oferty do zrobienia"
          value="4"
          note="2 czekają na wycenę"
          notePositive={null}
          icon={Invoice01Icon}
          accent="orange"
        />
        {/* blue = Wysyłki → matches CurrentShipments section */}
        <StatCard
          title="Zaplanowane wysyłki"
          value="5"
          note="Następna: dziś 08:00"
          notePositive={null}
          icon={DeliveryTruck01Icon}
          accent="blue"
        />
        {/* rose = Montaże → standalone, links to schedule */}
        <StatCard
          title="Montaże w tym tygodniu"
          value="3"
          note="2 zaplanowane jutro"
          notePositive={null}
          icon={Wrench01Icon}
          accent="rose"
        />
      </div>

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
