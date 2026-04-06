"use client"

import { useState, useEffect } from "react"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { PageSetup } from "@/components/PageSetup"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogClose,
  DialogContent,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"
import {
  Folder01Icon,
  Wrench01Icon,
  CheckmarkCircle01Icon,
  DeliveryTruck01Icon,
  Invoice01Icon,
  Building01Icon,
  HashtagIcon,
  Location01Icon,
  Calendar01Icon,
  CreditCardIcon,
  Flag01Icon,
  Cancel01Icon,
  PencilEdit01Icon,
  Delete01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  Search01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { useProjects, type Project, type ProjectStatus } from "@/components/ProjectsContext"
import { AddProjectDialog } from "@/components/AddProjectDialog"

// ─── Helpers ────────────────────────────────────────────────────────────────────

type SortDir = "asc" | "desc"
type Accent = "orange" | "green" | "blue"

function formatPrice(n: number): string {
  return n.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function projectTotal(p: Project): number {
  return p.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0)
}

function parseDeadline(deadline: string): number {
  return new Date(deadline.replace("Due ", "")).getTime()
}

// ─── Accent maps (stat card pattern) ────────────────────────────────────────────

const accentBar: Record<Accent, string> = {
  orange: "bg-gradient-to-r from-wirmet-orange to-wirmet-orange/0",
  green:  "bg-gradient-to-r from-wirmet-green  to-wirmet-green/0",
  blue:   "bg-gradient-to-r from-wirmet-blue   to-wirmet-blue/0",
}
const accentIcon: Record<Accent, string> = {
  orange: "text-wirmet-orange",
  green:  "text-wirmet-green",
  blue:   "text-wirmet-blue",
}

// ─── StatCard ───────────────────────────────────────────────────────────────────

function StatCard({ title, value, note, icon, accent }: {
  title: string; value: string; note: string; icon: IconSvgElement; accent: Accent
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className={cn("h-[2px] shrink-0", accentBar[accent])} />
      <div className="flex flex-col gap-3 px-5 pb-5 pt-4">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
          <HugeiconsIcon icon={icon} size={14} className={cn("shrink-0", accentIcon[accent])} />
        </div>
        <p className="text-4xl font-bold leading-none tabular-nums text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{note}</p>
      </div>
    </div>
  )
}

// ─── FilterDropdown ─────────────────────────────────────────────────────────────

function FilterDropdown({ label, options, value, onChange }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void
}) {
  const isActive = value !== options[0]
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("h-8 gap-1.5 text-xs", isActive && "border-wirmet-orange/40 text-wirmet-orange")}
        >
          {isActive && <span className="size-1.5 rounded-full bg-wirmet-orange" />}
          {value === options[0] ? label : value}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-36">
        {options.map(opt => (
          <DropdownMenuItem key={opt} onClick={() => onChange(opt)} className={cn(opt === value && "text-wirmet-orange")}>
            {opt === value && <HugeiconsIcon icon={Tick02Icon} size={12} strokeWidth={2} className="shrink-0" />}
            {opt}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─── Status badge ───────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <Badge variant="outline" className={cn(
      "shrink-0 text-[11px]",
      status === "Opłacone"
        ? "bg-wirmet-green/10 text-wirmet-green border-wirmet-green/20"
        : "bg-wirmet-blue/10 text-wirmet-blue border-wirmet-blue/20"
    )}>
      {status === "Opłacone" ? "Opłacone" : "W toku"}
    </Badge>
  )
}

// ─── Type badge ─────────────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: string }) {
  return (
    <Badge variant="outline" className={cn(
      "shrink-0 text-[11px]",
      type === "Installation"
        ? "bg-wirmet-orange/10 text-wirmet-orange border-wirmet-orange/20"
        : "bg-wirmet-blue/10 text-wirmet-blue border-wirmet-blue/20"
    )}>
      {type === "Installation" ? "Montaż" : "Dostawa"}
    </Badge>
  )
}

// ─── IconRow (reusable inside detail dialogs) ────────────────────────────────────

function IconRow({ icon, label, children, className }: {
  icon: IconSvgElement; label: string; children: React.ReactNode; className?: string
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

// ─── Project detail dialog ───────────────────────────────────────────────────────

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

// ─── Edit project dialog ─────────────────────────────────────────────────────────

function EditProjectDialog({ project, open, onOpenChange, onSave }: {
  project: Project
  open: boolean
  onOpenChange: (v: boolean) => void
  onSave: (updates: Partial<Project>) => void
}) {
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [form, setForm] = useState({
    status:         "Zamówione" as ProjectStatus,
    type:           "Installation",
    address:        "",
    completionDate: undefined as Date | undefined,
  })

  // Sync form with selected project whenever dialog opens
  useEffect(() => {
    if (open) {
      setCalendarOpen(false)
      setForm({
        status:         project.status,
        type:           project.type,
        address:        project.address,
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
      deadline:       `Due ${completionDate}`,
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
              <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v as ProjectStatus }))}>
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
              <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
                <SelectTrigger size="lg" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    <SelectItem value="Installation">Montaż</SelectItem>
                    <SelectItem value="Delivery">Dostawa</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Installation address */}
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

// ─── Delete confirm dialog ───────────────────────────────────────────────────────

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

// ─── Project row ─────────────────────────────────────────────────────────────────

function ProjectRow({ project, onClick }: { project: Project; onClick: () => void }) {
  const total  = projectTotal(project)
  const accent = project.type === "Installation" ? "bg-wirmet-orange" : "bg-wirmet-blue"

  return (
    <div
      onClick={onClick}
      className="group relative flex items-center gap-4 py-3.5 pl-9 pr-5 cursor-pointer transition-colors hover:bg-muted/20"
    >
      {/* Left accent strip — type-coded, mirrors horizontal stat-card gradient bars */}
      <div className={cn("absolute left-5 top-3 bottom-3 w-[3px] rounded-full", accent)} />

      {/* Client + company */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{project.client}</p>
        <p className="truncate text-xs text-muted-foreground">{project.offerNumber} · {project.companyName}</p>
      </div>

      {/* Type */}
      <div className="w-24 shrink-0">
        <TypeBadge type={project.type} />
      </div>

      {/* Status */}
      <div className="w-24 shrink-0">
        <StatusBadge status={project.status} />
      </div>

      {/* Completion date */}
      <div className="w-28 shrink-0 text-right">
        <p className="text-xs tabular-nums text-muted-foreground">{project.completionDate}</p>
      </div>

      {/* Value */}
      <div className="w-28 shrink-0 text-right">
        {total > 0
          ? <p className="text-sm font-semibold tabular-nums text-foreground">{formatPrice(total)} zł</p>
          : <p className="text-xs text-muted-foreground">—</p>
        }
      </div>
    </div>
  )
}

// ─── Column headers ──────────────────────────────────────────────────────────────

function ColumnHeaders() {
  return (
    <div className="flex items-center gap-4 border-b border-border pl-9 pr-5 py-2">
      <p className="flex-1 min-w-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Klient</p>
      <p className="w-24 shrink-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Rodzaj</p>
      <p className="w-24 shrink-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Status</p>
      <p className="w-28 shrink-0 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Termin</p>
      <p className="w-28 shrink-0 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Wartość</p>
    </div>
  )
}

// ─── Empty state ─────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <HugeiconsIcon icon={Folder01Icon} size={28} className="text-muted-foreground/20" />
      <p className="text-sm text-muted-foreground/50">Brak realizacji dla wybranych filtrów</p>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────────

function RealizacjePageInner() {
  const { projects, deleteProject, updateProject } = useProjects()

  const searchParams = useSearchParams()
  const [search, setSearch]             = useState(() => searchParams.get("q") ?? "")
  const [statusFilter, setStatusFilter] = useState("Wszystkie")
  const [typeFilter, setTypeFilter]     = useState("Wszystkie")
  const [sortDir, setSortDir]           = useState<SortDir>("asc")

  // Three dialogs share the same selected project
  const [selected, setSelected]     = useState<Project | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [editOpen, setEditOpen]     = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  // Clear selected after all dialogs close (300 ms = animation duration)
  useEffect(() => {
    if (!detailOpen && !editOpen && !deleteOpen) {
      const t = setTimeout(() => setSelected(null), 300)
      return () => clearTimeout(t)
    }
  }, [detailOpen, editOpen, deleteOpen])

  // ── Stats ────────────────────────────────────────────────────────────────────
  const total      = projects.length
  const inProgress = projects.filter(p => p.status === "Zamówione").length
  const paid       = projects.filter(p => p.status === "Opłacone").length

  // ── Filtering ────────────────────────────────────────────────────────────────
  const filtered = projects.filter(p => {
    const q = search.toLowerCase()
    if (q && !p.client.toLowerCase().includes(q) && !p.companyName.toLowerCase().includes(q)) return false
    if (statusFilter === "W toku"   && p.status !== "Zamówione") return false
    if (statusFilter === "Opłacone" && p.status !== "Opłacone")  return false
    if (typeFilter   === "Montaż"   && p.type !== "Installation") return false
    if (typeFilter   === "Dostawa"  && p.type !== "Delivery")     return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    const diff = parseDeadline(a.deadline) - parseDeadline(b.deadline)
    return sortDir === "asc" ? diff : -diff
  })

  function openDetail(project: Project) {
    setSelected(project)
    setDetailOpen(true)
  }

  function handleDelete() {
    if (!selected) return
    deleteProject(selected.offerNumber)
    setDeleteOpen(false)
  }

  function handleSaveEdit(updates: Partial<Project>) {
    if (!selected) return
    updateProject(selected.offerNumber, updates)
    setEditOpen(false)
  }

  return (
    <div className="flex h-full flex-col gap-6 p-4 md:gap-8 md:p-8">
      <PageSetup title="Realizacje" icon={Folder01Icon} />

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
            Realizacje
          </h1>
          <p className="text-sm text-muted-foreground">
            Wszystkie aktywne i zakończone realizacje budowlane.
          </p>
        </div>
        <div className="shrink-0">
          <AddProjectDialog />
        </div>
      </div>

      {/* ── Stats ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Wszystkie realizacje"
          value={String(total)}
          note={`${total} realizacji łącznie`}
          icon={Folder01Icon}
          accent="green"
        />
        <StatCard
          title="W toku"
          value={String(inProgress)}
          note="Aktywne realizacje"
          icon={Wrench01Icon}
          accent="blue"
        />
        <StatCard
          title="Opłacone"
          value={String(paid)}
          note="Zrealizowane i rozliczone"
          icon={CheckmarkCircle01Icon}
          accent="orange"
        />
      </div>

      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <HugeiconsIcon
            icon={Search01Icon}
            size={14}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Szukaj klienta..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-8 w-52 pl-8 text-xs"
          />
        </div>

        <FilterDropdown
          label="Status"
          options={["Wszystkie", "W toku", "Opłacone"]}
          value={statusFilter}
          onChange={setStatusFilter}
        />
        <FilterDropdown
          label="Rodzaj"
          options={["Wszystkie", "Montaż", "Dostawa"]}
          value={typeFilter}
          onChange={setTypeFilter}
        />

        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs"
          onClick={() => setSortDir(d => d === "asc" ? "desc" : "asc")}
        >
          <HugeiconsIcon icon={sortDir === "asc" ? ArrowUp01Icon : ArrowDown01Icon} size={12} />
          Termin {sortDir === "asc" ? "rosnąco" : "malejąco"}
        </Button>
      </div>

      {/* ── List ────────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-foreground">
            Wszystkie realizacje
          </p>
          <span className="text-xs text-muted-foreground">{sorted.length} pozycji</span>
        </div>

        {sorted.length > 0 ? (
          <>
            <ColumnHeaders />
            <div className="divide-y divide-border">
              {sorted.map(p => (
                <ProjectRow key={p.offerNumber} project={p} onClick={() => openDetail(p)} />
              ))}
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* ── Dialogs ─────────────────────────────────────────────────────────── */}
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
            onSave={handleSaveEdit}
          />
          <DeleteConfirmDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            onConfirm={handleDelete}
            description={`Realizacja klienta "${selected.client}" zostanie trwale usunięta. Tej operacji nie można cofnąć.`}
          />
        </>
      )}
    </div>
  )
}

export default function RealizacjePage() {
  return <Suspense><RealizacjePageInner /></Suspense>
}
