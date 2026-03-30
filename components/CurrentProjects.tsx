"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"
import {
  Cancel01Icon,
  PencilEdit01Icon,
  ArrowRight01Icon,
  CheckmarkCircle01Icon,
  Folder01Icon,
  Invoice01Icon,
  Wrench01Icon,
  Calendar01Icon,
  CreditCardIcon,
  DeliveryTruck01Icon,
  Flag01Icon,
  Building01Icon,
  HashtagIcon,
  Location01Icon,
  MoreHorizontalIcon,
  Share01Icon,
  Download01Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { useState } from "react"
import Link from "next/link"
import { useProjects, type ProjectStatus, type Project } from "@/components/ProjectsContext"
import { AddProjectDialog } from "@/components/AddProjectDialog"

// ─── Status badge ──────────────────────────────────────────────────────────────
// Paid → wirmet-green (positive), Ordered → wirmet-blue (in progress)

function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[11px]",
        status === "Paid"
          ? "bg-wirmet-green/10 text-wirmet-green border-wirmet-green/20"
          : "bg-wirmet-blue/10  text-wirmet-blue  border-wirmet-blue/20"
      )}
    >
      {status}
    </Badge>
  )
}

// ─── Type accent strip ─────────────────────────────────────────────────────────
// Left vertical bar on each project row — colored by work type, mirrors stat-card gradient bars

const typeAccent: Record<string, string> = {
  "Installation": "bg-wirmet-orange",
  "Delivery":     "bg-wirmet-blue",
}

// ─── Icon row (detail dialog) ──────────────────────────────────────────────────

function IconRow({
  icon,
  label,
  children,
  className,
}: {
  icon: IconSvgElement
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex items-center justify-between px-4 py-3", className)}>
      <div className="flex items-center gap-2.5">
        <HugeiconsIcon icon={icon} size={14} className="shrink-0 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="text-sm font-medium text-foreground">{children}</div>
    </div>
  )
}

// ─── Project detail dialog ─────────────────────────────────────────────────────

function ProjectDialog({ project }: { project: Project }) {
  const total = project.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const totalFixed = total.toFixed(2)
  const [whole, cents] = totalFixed.split(".")
  const wholeFormatted = Number(whole).toLocaleString("pl-PL")

  return (
    <DialogContent
      showCloseButton={false}
      className="flex max-h-[90vh] flex-col overflow-hidden bg-background p-0 border border-border sm:max-w-md"
    >
      <DialogTitle className="sr-only">{project.client} — szczegóły realizacji</DialogTitle>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <p className="text-sm font-semibold text-foreground">Szczegóły realizacji</p>
        <DialogClose asChild>
          <Button variant="ghost" size="icon-sm">
            <HugeiconsIcon icon={Cancel01Icon} data-icon strokeWidth={2} />
          </Button>
        </DialogClose>
      </div>

      {/* Scrollable body */}
      <div className="flex flex-col gap-3 overflow-y-auto px-4 pb-4">

        {/* Hero — total order value */}
        <div className="rounded-xl bg-card px-5 py-4">
          <p className="mb-1.5 text-xs text-muted-foreground">Wartość zamówienia</p>
          <p className="text-2xl font-semibold text-muted-foreground">
            {wholeFormatted},{cents} zł
          </p>
        </div>

        {/* Offer info + status */}
        <div className="overflow-hidden rounded-xl bg-card">
          <IconRow icon={Invoice01Icon} label="Numer oferty">{project.offerNumber}</IconRow>
          <IconRow icon={CheckmarkCircle01Icon} label="Status" className="border-t border-border">
            <StatusBadge status={project.status} />
          </IconRow>
          <IconRow icon={Wrench01Icon} label="Rodzaj prac" className="border-t border-border">{project.type}</IconRow>
        </div>

        {/* Dates */}
        <div className="overflow-hidden rounded-xl bg-card divide-y divide-border">
          <IconRow icon={Calendar01Icon} label="Data zamówienia">{project.orderDate}</IconRow>
          <IconRow icon={CreditCardIcon} label="Termin płatności" className="pb-5">{project.paymentDue}</IconRow>
          <IconRow icon={DeliveryTruck01Icon} label="Data dostawy">{project.deliveryDate}</IconRow>
          <IconRow icon={Flag01Icon} label="Data realizacji">{project.completionDate}</IconRow>
        </div>

        {/* Company + addresses */}
        <div className="overflow-hidden rounded-xl bg-card divide-y divide-border">
          <IconRow icon={Building01Icon} label="Firma">{project.companyName}</IconRow>
          <IconRow icon={HashtagIcon} label="NIP" className="pb-5">{project.nip}</IconRow>
          <IconRow icon={Location01Icon} label="Adres firmy">{project.companyAddress}</IconRow>
          <IconRow icon={Location01Icon} label="Adres montażu">{project.address}</IconRow>
        </div>

        {/* Items & services */}
        <div className="flex flex-col gap-2">
          <p className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Pozycje i usługi
          </p>
          <div className="overflow-hidden rounded-xl bg-card divide-y divide-border">
            {project.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} {item.unit} × {item.unitPrice.toFixed(2)} zł
                  </p>
                </div>
                <p className="shrink-0 pl-4 text-sm font-semibold text-foreground">
                  {(item.quantity * item.unitPrice).toFixed(2)} zł
                </p>
              </div>
            ))}
            <div className="flex items-center justify-between px-4 py-3">
              <p className="text-sm font-semibold text-foreground">Razem</p>
              <p className="text-sm font-bold text-foreground">{totalFixed} zł</p>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border px-5 py-4">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm">
            <HugeiconsIcon icon={MoreHorizontalIcon} data-icon />
          </Button>
          <Button variant="ghost" size="icon-sm">
            <HugeiconsIcon icon={Share01Icon} data-icon />
          </Button>
          <Button variant="ghost" size="icon-sm">
            <HugeiconsIcon icon={Download01Icon} data-icon />
          </Button>
        </div>
        <Button variant="outline" size="lg">
          <HugeiconsIcon icon={PencilEdit01Icon} data-icon="inline-start" />
          Edytuj
        </Button>
      </div>
    </DialogContent>
  )
}

// ─── Deadline sort helper ──────────────────────────────────────────────────────
// Parses "Due 20 Mar 2025" → Date so we can sort ascending (most urgent first)

function parseDeadline(deadline: string): number {
  return new Date(deadline.replace("Due ", "")).getTime()
}

// ─── Project row ───────────────────────────────────────────────────────────────
// flex:1 on each row so they fill the container equally — height stays fixed
// regardless of how many projects are shown (container height driven by right column)

function ProjectRow({
  project,
  onClick,
}: {
  project: Project
  onClick: () => void
}) {
  const total = project.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const accent = typeAccent[project.type] ?? "bg-muted-foreground/30"

  return (
    <div
      onClick={onClick}
      // flex:1 makes every row the same height; justify-center keeps content centred
      // vertically when the row is taller (fewer than 5 projects)
      style={{ flex: 1 }}
      className="relative flex flex-col justify-center gap-2 py-3 pl-9 pr-5 cursor-pointer transition-colors hover:bg-muted/20"
    >
      {/* Left accent strip — mirrors the horizontal gradient bar on stat cards */}
      <div className={cn("absolute left-5 top-1/4 bottom-1/4 w-[3px] rounded-full", accent)} />

      {/* Top row: work type label + status badge */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {project.type}
        </span>
        <StatusBadge status={project.status} />
      </div>

      {/* Client name — primary identifier */}
      <p className="text-sm font-semibold leading-tight text-foreground">{project.client}</p>

      {/* Meta row: offer number · deadline · value */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
          <span className="shrink-0">{project.offerNumber}</span>
          <span className="text-muted-foreground/40">·</span>
          <span className="truncate">{project.deadline}</span>
        </div>
        {total > 0 && (
          <span className="shrink-0 text-xs font-semibold tabular-nums text-foreground">
            {total.toLocaleString("pl-PL")} zł
          </span>
        )}
      </div>
    </div>
  )
}

// ─── CurrentProjects ───────────────────────────────────────────────────────────

export function CurrentProjects() {
  const { projects } = useProjects()
  const [selected, setSelected] = useState<Project | null>(null)

  // Sort ascending by deadline (nearest = most urgent first), cap at 5
  const visible = [...projects]
    .sort((a, b) => parseDeadline(a.deadline) - parseDeadline(b.deadline))
    .slice(0, 5)

  // Empty slots fill the remaining space so the component is always the same height
  const emptySlots = Math.max(0, 5 - visible.length)

  return (
    <>
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Green 2px gradient bar — same language as stat cards, links this section to "Realizacje w toku" */}
        <div className="h-[2px] bg-gradient-to-r from-wirmet-green to-wirmet-green/0" />

        {/* Section header — folder icon tinted green mirrors the stat card above */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Folder01Icon} size={14} className="shrink-0 text-wirmet-green" />
            <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-foreground">
              Realizacje w toku
            </p>
          </div>
          <Link
            href="/orders"
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Wszystkie
            <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
          </Link>
        </div>

        {/* Project rows + empty state — flex-1 on each row keeps them equal height.
            Empty state gets flex = number of missing slots so the visual weight matches. */}
        <div className="flex flex-1 flex-col divide-y divide-border overflow-hidden">
          {visible.map((project) => (
            <ProjectRow
              key={project.offerNumber}
              project={project}
              onClick={() => setSelected(project)}
            />
          ))}

          {emptySlots > 0 && (
            <div
              style={{ flex: emptySlots }}
              className="flex flex-col items-center justify-center gap-3 px-5 py-4"
            >
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={20} className="text-muted-foreground/30" />
              <p className="text-xs text-muted-foreground/40">Brak więcej aktualnych realizacji</p>
              <AddProjectDialog />
            </div>
          )}
        </div>
      </div>

      <Dialog
        open={selected !== null}
        onOpenChange={(open) => { if (!open) setSelected(null) }}
      >
        {selected && <ProjectDialog project={selected} />}
      </Dialog>
    </>
  )
}
