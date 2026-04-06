"use client"

import { useProjects } from "@/components/ProjectsContext"
import { useOffers } from "@/components/OffersContext"
import { useShipments } from "@/components/ShipmentsContext"
import { useEvents } from "@/components/EventsContext"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"
import { Folder01Icon, Invoice01Icon, DeliveryTruck01Icon, Wrench01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

// ─── Accent tokens ─────────────────────────────────────────────────────────────

type Accent = "orange" | "green" | "blue" | "rose"

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

// ─── StatCard ──────────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string
  value: string
  note: string
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
      <div className={cn("h-[2px] shrink-0", accentBar[accent])} />
      <div className="flex flex-col gap-3 px-5 pb-5 pt-4">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <HugeiconsIcon icon={icon} size={14} className={cn("shrink-0", accentIcon[accent])} />
        </div>
        <p className="text-4xl font-bold leading-none tabular-nums text-foreground">
          {value}
        </p>
        <p className={cn("text-xs", noteColor)}>{note}</p>
      </div>
    </div>
  )
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function isoToday(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function isoWeekEnd(): string {
  const d = new Date()
  // end of current ISO week (Sunday)
  const day = d.getDay() || 7
  d.setDate(d.getDate() + (7 - day))
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function addDaysISO(iso: string, n: number): string {
  const d = new Date(iso + "T00:00:00")
  d.setDate(d.getDate() + n)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

// ─── DashboardStats ────────────────────────────────────────────────────────────

export function DashboardStats() {
  const { projects }  = useProjects()
  const { offers }    = useOffers()
  const { shipments } = useShipments()
  const { events }    = useEvents()

  const today   = isoToday()
  const tomorrow = addDaysISO(today, 1)
  const weekEnd = isoWeekEnd()

  // Realizacje w toku — projects with status "Zamówione" (not yet paid/completed)
  const activeProjects = projects.filter(p => p.status === "Zamówione")
  const paidThisWeek  = projects.filter(p => p.status === "Opłacone").length

  // Oferty do zrobienia — actionable statuses (not rejected, not waiting)
  const actionableOffers = offers.filter(o =>
    o.status === "Do wyceny" || o.status === "Do wysłania" || o.status === "Follow-up"
  )
  const pendingValuation = offers.filter(o => o.status === "Do wyceny").length

  // Zaplanowane wysyłki — everything except delivered
  const activeShipments = shipments.filter(s => s.status !== "Dostarczone")
  const inTransit       = shipments.filter(s => s.status === "W transporcie").length

  // Montaże w tym tygodniu
  const montazThisWeek = events.filter(ev =>
    ev.type === "montaz" && ev.date >= today && ev.date <= weekEnd
  )
  const montazTomorrow = events.filter(ev => ev.type === "montaz" && ev.date === tomorrow).length

  // Notes
  const projectNote = paidThisWeek > 0
    ? `${paidThisWeek} opłacon${paidThisWeek === 1 ? "e" : "e"} w tym tygodniu`
    : "Brak opłaconych w tym tygodniu"

  const offersNote = pendingValuation > 0
    ? `${pendingValuation} czeka${pendingValuation === 1 ? "" : "ją"} na wycenę`
    : "Wszystkie wycenione"

  const shipmentsNote = inTransit > 0
    ? `${inTransit} w transporcie`
    : "Brak aktywnych transportów"

  const montazNote = montazTomorrow > 0
    ? `${montazTomorrow} zaplanowane jutro`
    : montazThisWeek.length > 0
    ? "Żadnych jutro"
    : "Brak w tym tygodniu"

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard
        title="Realizacje w toku"
        value={String(activeProjects.length)}
        note={projectNote}
        notePositive={paidThisWeek > 0 ? true : null}
        icon={Folder01Icon}
        accent="green"
      />
      <StatCard
        title="Oferty do zrobienia"
        value={String(actionableOffers.length)}
        note={offersNote}
        notePositive={null}
        icon={Invoice01Icon}
        accent="orange"
      />
      <StatCard
        title="Zaplanowane wysyłki"
        value={String(activeShipments.length)}
        note={shipmentsNote}
        notePositive={null}
        icon={DeliveryTruck01Icon}
        accent="blue"
      />
      <StatCard
        title="Montaże w tym tygodniu"
        value={String(montazThisWeek.length)}
        note={montazNote}
        notePositive={null}
        icon={Wrench01Icon}
        accent="rose"
      />
    </div>
  )
}
