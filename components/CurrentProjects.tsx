"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"
import {
  Cancel01Icon,
  PencilEdit01Icon,
  Delete01Icon,
  ArrowRight01Icon,
  CheckmarkCircle01Icon,
  Folder01Icon,
  Calendar01Icon,
  CreditCardIcon,
  DeliveryTruck01Icon,
  Flag01Icon,
  Building01Icon,
  HashtagIcon,
  Location01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useProjects, type ProjectStatus, type Project } from "@/components/ProjectsContext"
import { AddProjectDialog } from "@/components/AddProjectDialog"

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatPrice(n: number): string {
  return n.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function projectTotal(p: Project): number {
  return p.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0)
}

function parseDeadline(deadline: string): number {
  return new Date(deadline.replace("Termin: ", "")).getTime()
}

// ─── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "shrink-0 text-[11px]",
        status === "Opłacone"
          ? "bg-wirmet-green/10 text-wirmet-green border-wirmet-green/20"
          : "bg-wirmet-blue/10  text-wirmet-blue  border-wirmet-blue/20"
      )}
    >
      {status === "Opłacone" ? "Opłacone" : "W toku"}
    </Badge>
  )
}

// ─── Type badge ────────────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "shrink-0 text-[11px]",
        type === "Montaż" || type === "Installation"
          ? "bg-wirmet-orange/10 text-wirmet-orange border-wirmet-orange/20"
          : "bg-wirmet-blue/10 text-wirmet-blue border-wirmet-blue/20"
      )}
    >
      {type === "Installation" ? "Montaż" : type === "Delivery" ? "Dostawa" : type}
    </Badge>
  )
}

// ─── Type accent strip ─────────────────────────────────────────────────────────

const typeAccent: Record<string, string> = {
  "Montaż":       "bg-wirmet-orange",
  "Installation": "bg-wirmet-orange",
  "Dostawa":      "bg-wirmet-blue",
  "Delivery":     "bg-wirmet-blue",
}

// ─── IconRow ───────────────────────────────────────────────────────────────────

function IconRow({ icon, label, children }: {
  icon: IconSvgElement
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2.5">
        <HugeiconsIcon icon={icon} size={14} className="shrink-0 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="text-sm font-medium text-foreground">{children}</div>
    </div>
  )
}

// ─── Project detail dialog ─────────────────────────────────────────────────────

function ProjectDetailDialog({ project, open, onOpenChange, onEdit, onDelete }: {
  project: Project
  open: boolean
  onOpenChange: (v: boolean) => void
  onEdit: () => void
  onDelete: () => void
}) {
  const total    = projectTotal(project)
  const hasItems = project.items.length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[90vh] flex-col overflow-hidden bg-background p-0 border border-border sm:max-w-md"
      >
        <DialogTitle className="sr-only">{project.client} — szczegóły realizacji</DialogTitle>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Realizacja
          </p>
          <DialogClose asChild>
            <Button variant="ghost" size="icon-sm">
              <HugeiconsIcon icon={Cancel01Icon} data-icon strokeWidth={2} />
            </Button>
          </DialogClose>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-3 overflow-y-auto px-4 pb-4">

          {/* Hero — client + offer number + status */}
          <div className="overflow-hidden rounded-xl bg-card">
            <div className="h-[2px] bg-gradient-to-r from-wirmet-green to-wirmet-green/0" />
            <div className="px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <p className="font-[family-name:var(--font-display)] text-lg font-bold leading-snug text-foreground">
                  {project.client}
                </p>
                <StatusBadge status={project.status} />
              </div>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{project.offerNumber}</p>
              <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                <span>Termin: {project.completionDate}</span>
                <span className="text-muted-foreground/30">·</span>
                <span>{project.type}</span>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="overflow-hidden rounded-xl bg-card divide-y divide-border">
            <IconRow icon={Calendar01Icon} label="Data zamówienia">{project.orderDate}</IconRow>
            <IconRow icon={CreditCardIcon} label="Termin płatności">{project.paymentDue}</IconRow>
            <IconRow icon={DeliveryTruck01Icon} label="Data dostawy">{project.deliveryDate}</IconRow>
            <IconRow icon={Flag01Icon} label="Data realizacji">{project.completionDate}</IconRow>
          </div>

          {/* Company */}
          <div className="overflow-hidden rounded-xl bg-card divide-y divide-border">
            <IconRow icon={Building01Icon} label="Firma">{project.companyName}</IconRow>
            <IconRow icon={HashtagIcon} label="NIP">{project.nip}</IconRow>
            <IconRow icon={Location01Icon} label="Adres firmy">{project.companyAddress}</IconRow>
            <IconRow icon={Location01Icon} label="Adres montażu">{project.address}</IconRow>
          </div>

          {/* Items */}
          {hasItems && (
            <div className="flex flex-col gap-2">
              <p className="px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Pozycje i usługi
              </p>
              <div className="overflow-hidden rounded-xl bg-card divide-y divide-border">
                {project.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3">
                    <div className="min-w-0 flex-1 pr-4">
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} {item.unit} × {item.unitPrice.toFixed(2)} zł
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                      {(item.quantity * item.unitPrice).toFixed(2)} zł
                    </p>
                  </div>
                ))}
                <div className="flex items-center justify-between bg-muted/20 px-4 py-3">
                  <p className="text-sm font-semibold text-foreground">Razem</p>
                  <p className="text-sm font-bold tabular-nums text-foreground">{formatPrice(total)} zł</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-5 py-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-400 hover:bg-red-400/10"
            onClick={() => { onOpenChange(false); onDelete() }}
          >
            <HugeiconsIcon icon={Delete01Icon} data-icon="inline-start" />
            Usuń
          </Button>
          <Button variant="outline" size="lg" onClick={() => { onOpenChange(false); onEdit() }}>
            <HugeiconsIcon icon={PencilEdit01Icon} data-icon="inline-start" />
            Edytuj
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Edit dialog ───────────────────────────────────────────────────────────────

function EditProjectDialog({ project, open, onOpenChange, onSave }: {
  project: Project
  open: boolean
  onOpenChange: (v: boolean) => void
  onSave: (updates: Partial<Project>) => void
}) {
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [form, setForm] = useState({
    status:         "Zamówione" as ProjectStatus,
    type:           "Montaż",
    address:        "",
    completionDate: undefined as Date | undefined,
  })

  useEffect(() => {
    if (open) {
      setCalendarOpen(false)
      setForm({
        status:   project.status,
        type:     project.type,
        address:  project.address,
        completionDate:
          project.completionDate && project.completionDate !== "—"
            ? new Date(project.completionDate)
            : undefined,
      })
    }
  }, [open, project.status, project.type, project.address, project.completionDate])

  function handleSave() {
    const completionDate = form.completionDate
      ? form.completionDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
      : project.completionDate
    onSave({
      status:         form.status,
      type:           form.type,
      address:        form.address,
      completionDate,
      deliveryDate:   completionDate,
      deadline:       `Termin: ${completionDate}`,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Edytuj realizację</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          {/* Status + Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Status</label>
              <Select
                value={form.status}
                onValueChange={v => setForm(f => ({ ...f, status: v as ProjectStatus }))}
              >
                <SelectTrigger size="lg" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    <SelectItem value="Zamówione">W toku</SelectItem>
                    <SelectItem value="Opłacone">Opłacone</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Rodzaj prac</label>
              <Select
                value={form.type}
                onValueChange={v => setForm(f => ({ ...f, type: v }))}
              >
                <SelectTrigger size="lg" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    <SelectItem value="Montaż">Montaż</SelectItem>
                    <SelectItem value="Dostawa">Dostawa</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Address */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Adres montażu</label>
            <div className="relative">
              <Input
                className="h-9 px-3 pr-8 text-sm"
                value={form.address}
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              />
              <HugeiconsIcon
                icon={Location01Icon}
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </div>
          </div>

          {/* Completion date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Data realizacji</label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-input/20 px-3 text-sm transition-colors",
                    "hover:bg-input/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
                    !form.completionDate && "text-muted-foreground"
                  )}
                >
                  <span className="truncate">
                    {form.completionDate
                      ? form.completionDate.toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" })
                      : "Wybierz datę"}
                  </span>
                  <HugeiconsIcon icon={Calendar01Icon} size={14} className="shrink-0 text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={form.completionDate}
                  onSelect={date => {
                    setForm(f => ({ ...f, completionDate: date }))
                    setCalendarOpen(false)
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="lg" onClick={() => onOpenChange(false)}>Anuluj</Button>
          <Button variant="default" size="lg" onClick={handleSave}>
            <HugeiconsIcon icon={Tick02Icon} data-icon="inline-start" />
            Zapisz zmiany
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Delete confirm dialog ─────────────────────────────────────────────────────

function DeleteConfirmDialog({ open, onOpenChange, onConfirm, description }: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onConfirm: () => void
  description: string
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Usunąć realizację?</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={onConfirm}
          >
            Usuń
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ─── Project row ───────────────────────────────────────────────────────────────

function ProjectRow({ project, onClick }: { project: Project; onClick: () => void }) {
  const total  = projectTotal(project)
  const accent = typeAccent[project.type] ?? "bg-muted-foreground/30"

  return (
    <div
      onClick={onClick}
      style={{ flex: 1 }}
      className="relative flex flex-col justify-center gap-2 py-3 pl-9 pr-5 cursor-pointer transition-colors hover:bg-muted/20"
    >
      {/* Left accent strip */}
      <div className={cn("absolute left-5 top-1/4 bottom-1/4 w-[3px] rounded-full", accent)} />

      {/* Type label + status badge */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {project.type === "Installation" ? "Montaż" : project.type === "Delivery" ? "Dostawa" : project.type}
        </span>
        <StatusBadge status={project.status} />
      </div>

      {/* Client */}
      <p className="text-sm font-semibold leading-tight text-foreground">{project.client}</p>

      {/* Meta */}
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
  const { projects, updateProject, deleteProject } = useProjects()

  const [selected,    setSelected]    = useState<Project | null>(null)
  const [detailOpen,  setDetailOpen]  = useState(false)
  const [editOpen,    setEditOpen]    = useState(false)
  const [deleteOpen,  setDeleteOpen]  = useState(false)

  // Clear selected after all dialogs close (300 ms = animation duration)
  useEffect(() => {
    if (!detailOpen && !editOpen && !deleteOpen) {
      const t = setTimeout(() => setSelected(null), 300)
      return () => clearTimeout(t)
    }
  }, [detailOpen, editOpen, deleteOpen])

  const visible = [...projects]
    .sort((a, b) => parseDeadline(a.deadline) - parseDeadline(b.deadline))
    .slice(0, 5)

  const emptySlots = Math.max(0, 5 - visible.length)

  function openDetail(project: Project) {
    setSelected(project)
    setDetailOpen(true)
  }

  return (
    <>
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Green gradient bar */}
        <div className="h-[2px] bg-gradient-to-r from-wirmet-green to-wirmet-green/0" />

        {/* Section header */}
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

        {/* Rows */}
        <div className="flex flex-1 flex-col divide-y divide-border overflow-hidden">
          {visible.map((project) => (
            <ProjectRow
              key={project.offerNumber}
              project={project}
              onClick={() => openDetail(project)}
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

      {/* Dialogs */}
      {selected && (
        <>
          <ProjectDetailDialog
            project={selected}
            open={detailOpen}
            onOpenChange={setDetailOpen}
            onEdit={() => setEditOpen(true)}
            onDelete={() => setDeleteOpen(true)}
          />
          <EditProjectDialog
            project={selected}
            open={editOpen}
            onOpenChange={setEditOpen}
            onSave={updates => updateProject(selected.offerNumber, updates)}
          />
          <DeleteConfirmDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            onConfirm={() => {
              deleteProject(selected.offerNumber)
              setDeleteOpen(false)
            }}
            description={`Realizacja klienta "${selected.client}" zostanie trwale usunięta. Tej operacji nie można cofnąć.`}
          />
        </>
      )}
    </>
  )
}
