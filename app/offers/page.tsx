"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { PageSetup } from "@/components/PageSetup"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  Invoice01Icon,
  CheckmarkCircle01Icon,
  MailSend01Icon,
  Building01Icon,
  UserIcon,
  SmartPhone01Icon,
  Mail01Icon,
  Location01Icon,
  Calendar01Icon,
  Cancel01Icon,
  PencilEdit01Icon,
  Delete01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  Search01Icon,
  Tick02Icon,
  AlarmClockIcon,
  File01Icon,
  MessageMultiple01Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { useOffers, type PendingOffer, type OfferStatus } from "@/components/OffersContext"
import { AddOfferDialog } from "@/components/AddOfferDialog"

// ─── Helpers ────────────────────────────────────────────────────────────────────

type SortDir = "asc" | "desc"

function formatPrice(n: number): string {
  return n.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function offerTotal(offer: PendingOffer): number {
  return offer.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0)
}

function offerSeq(number: string): number {
  // "#OF-0441" → 441; higher = newer
  return parseInt(number.replace("#OF-", ""), 10) || 0
}

// ─── Status maps ─────────────────────────────────────────────────────────────────

const dotColor: Record<OfferStatus, string> = {
  "Do wyceny":             "bg-wirmet-orange/70",
  "Do wysłania":           "bg-wirmet-blue/70",
  "Wysłana":               "bg-wirmet-green/70",
  "Oczekuje na odpowiedź": "bg-amber-400/60",
  "Follow-up":             "bg-rose-400/70",
  "Odrzucona":             "bg-muted-foreground/30",
}

const badgeClass: Record<OfferStatus, string> = {
  "Do wyceny":             "bg-wirmet-orange/10 text-wirmet-orange border-wirmet-orange/20",
  "Do wysłania":           "bg-wirmet-blue/10 text-wirmet-blue border-wirmet-blue/20",
  "Wysłana":               "bg-wirmet-green/10 text-wirmet-green border-wirmet-green/20",
  "Oczekuje na odpowiedź": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Follow-up":             "bg-rose-500/10 text-rose-400 border-rose-500/20",
  "Odrzucona":             "bg-zinc-500/10 text-muted-foreground border-zinc-500/20",
}

// ─── Stats overview ──────────────────────────────────────────────────────────────
// Left: "do podbicia" hero (Follow-up count — the most actionable metric)
// Right: three compact chips — do wyceny / do wysłania / łącznie

function StatsOverview({
  total, doWyceny, doWyslania, followUp,
}: {
  total: number; doWyceny: number; doWyslania: number; followUp: number
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-5">

      {/* ── Left: Follow-up hero card ──────────────────────────────────────── */}
      <div className="md:col-span-2 flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
        {/* Rose accent bar — follow-up uses rose-400 */}
        <div className="h-[2px] shrink-0 bg-gradient-to-r from-rose-400 to-rose-400/0" />

        <div className="flex flex-1 items-center justify-between gap-4 px-6 py-5">
          <div className="flex flex-col gap-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Do podbicia
            </p>
            <p className="font-[family-name:var(--font-display)] text-5xl font-bold tabular-nums text-foreground leading-none">
              {followUp}
            </p>
            <p className="text-xs text-muted-foreground">
              {followUp === 1 ? "oferta wymaga follow-upu" : "oferty wymagają follow-upu"}
            </p>
          </div>
          {/* Icon in rounded box */}
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-rose-400/10">
            <HugeiconsIcon icon={MessageMultiple01Icon} size={24} className="text-rose-400" />
          </div>
        </div>
      </div>

      {/* ── Right: three compact chips stacked ────────────────────────────── */}
      <div className="md:col-span-3 grid grid-cols-3 gap-4">

        {/* Do wyceny */}
        <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
          <div className="h-[2px] shrink-0 bg-gradient-to-r from-wirmet-orange to-wirmet-orange/0" />
          <div className="flex flex-1 flex-col justify-between px-5 py-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Do wyceny
              </p>
              <HugeiconsIcon icon={AlarmClockIcon} size={13} className="text-wirmet-orange/60" />
            </div>
            <p className="mt-3 text-3xl font-bold tabular-nums text-foreground leading-none">{doWyceny}</p>
            <p className="mt-1.5 text-[11px] text-muted-foreground">Czeka na wycenę</p>
          </div>
        </div>

        {/* Do wysłania */}
        <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
          <div className="h-[2px] shrink-0 bg-gradient-to-r from-wirmet-blue to-wirmet-blue/0" />
          <div className="flex flex-1 flex-col justify-between px-5 py-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Do wysłania
              </p>
              <HugeiconsIcon icon={MailSend01Icon} size={13} className="text-wirmet-blue/60" />
            </div>
            <p className="mt-3 text-3xl font-bold tabular-nums text-foreground leading-none">{doWyslania}</p>
            <p className="mt-1.5 text-[11px] text-muted-foreground">Gotowe do wysłania</p>
          </div>
        </div>

        {/* Łącznie */}
        <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
          <div className="h-[2px] shrink-0 bg-gradient-to-r from-wirmet-green to-wirmet-green/0" />
          <div className="flex flex-1 flex-col justify-between px-5 py-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Łącznie
              </p>
              <HugeiconsIcon icon={Invoice01Icon} size={13} className="text-wirmet-green/60" />
            </div>
            <p className="mt-3 text-3xl font-bold tabular-nums text-foreground leading-none">{total}</p>
            <p className="mt-1.5 text-[11px] text-muted-foreground">Wszystkich ofert</p>
          </div>
        </div>

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
      <DropdownMenuContent align="start" className="min-w-40">
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

// ─── IconRow (detail dialog) ─────────────────────────────────────────────────────

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

// ─── Offer detail dialog ─────────────────────────────────────────────────────────

function OfferDetailDialog({ offer, open, onOpenChange, onEdit, onDelete }: {
  offer: PendingOffer
  open: boolean
  onOpenChange: (v: boolean) => void
  onEdit: () => void
  onDelete: () => void
}) {
  const total    = offerTotal(offer)
  const hasItems = offer.items.length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[90vh] flex-col overflow-hidden bg-background p-0 border border-border sm:max-w-md"
      >
        <DialogTitle className="sr-only">{offer.company} — szczegóły oferty</DialogTitle>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <p className="text-sm font-semibold text-foreground">Szczegóły oferty</p>
          <DialogClose asChild>
            <Button variant="ghost" size="icon-sm">
              <HugeiconsIcon icon={Cancel01Icon} data-icon strokeWidth={2} />
            </Button>
          </DialogClose>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-3 overflow-y-auto px-4 pb-4">

          {/* Offer number hero */}
          <div className="rounded-xl bg-card px-5 py-4">
            <p className="mb-1.5 text-xs text-muted-foreground">Numer oferty</p>
            <p className="text-2xl font-semibold text-muted-foreground">{offer.number}</p>
          </div>

          {/* Status + dates */}
          <div className="overflow-hidden rounded-xl bg-card divide-y divide-border">
            <IconRow icon={Invoice01Icon} label="Data utworzenia">{offer.created}</IconRow>
            <IconRow icon={Calendar01Icon} label="Ważna do">{offer.validUntil}</IconRow>
            <IconRow icon={CheckmarkCircle01Icon} label="Status">
              <Badge variant="outline" className={cn("text-[11px]", badgeClass[offer.status])}>
                {offer.status}
              </Badge>
            </IconRow>
          </div>

          {/* Contact */}
          <div className="overflow-hidden rounded-xl bg-card divide-y divide-border">
            <IconRow icon={Building01Icon} label="Firma">{offer.company}</IconRow>
            <IconRow icon={UserIcon} label="Osoba kontaktowa">{offer.contact}</IconRow>
            <IconRow icon={SmartPhone01Icon} label="Telefon">{offer.phone}</IconRow>
            <IconRow icon={Mail01Icon} label="E-mail">{offer.email}</IconRow>
            <IconRow icon={Location01Icon} label="Adres">{offer.address}</IconRow>
          </div>

          {/* Description */}
          {offer.description && (
            <div className="flex flex-col gap-2">
              <p className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Opis</p>
              <div className="rounded-xl bg-card px-4 py-3">
                <p className="text-sm text-muted-foreground">{offer.description}</p>
              </div>
            </div>
          )}

          {/* Items */}
          {hasItems && (
            <div className="flex flex-col gap-2">
              <p className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Pozycje i usługi
              </p>
              <div className="overflow-hidden rounded-xl bg-card divide-y divide-border">
                {offer.items.map((item, i) => (
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
                  <p className="text-sm font-bold text-foreground">{formatPrice(total)} zł</p>
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

// ─── Edit offer dialog ───────────────────────────────────────────────────────────

function EditOfferDialog({ offer, open, onOpenChange, onSave }: {
  offer: PendingOffer
  open: boolean
  onOpenChange: (v: boolean) => void
  onSave: (updates: Partial<PendingOffer>) => void
}) {
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [form, setForm] = useState({
    status:      "Do wyceny" as OfferStatus,
    address:     "",
    validUntil:  undefined as Date | undefined,
    description: "",
  })

  useEffect(() => {
    if (open) {
      setCalendarOpen(false)
      setForm({
        status:      offer.status,
        address:     offer.address,
        validUntil:  offer.validUntil && offer.validUntil !== "—" ? new Date(offer.validUntil) : undefined,
        description: offer.description,
      })
    }
  }, [open, offer.status, offer.address, offer.validUntil, offer.description])

  function handleSave() {
    const validUntil = form.validUntil
      ? form.validUntil.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
      : offer.validUntil
    onSave({ status: form.status, address: form.address, validUntil, description: form.description })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Edytuj ofertę</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Status</label>
            <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v as OfferStatus }))}>
              <SelectTrigger size="lg" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  <SelectItem value="Do wyceny">Do wyceny</SelectItem>
                  <SelectItem value="Do wysłania">Do wysłania</SelectItem>
                  <SelectItem value="Wysłana">Wysłana</SelectItem>
                  <SelectItem value="Oczekuje na odpowiedź">Oczekuje na odpowiedź</SelectItem>
                  <SelectItem value="Follow-up">Follow-up</SelectItem>
                  <SelectItem value="Odrzucona">Odrzucona</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Valid until + Address */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Ważna do</label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-input/20 px-3 text-sm transition-colors",
                      "hover:bg-input/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
                      !form.validUntil && "text-muted-foreground"
                    )}
                  >
                    <span className="truncate">
                      {form.validUntil
                        ? form.validUntil.toLocaleDateString("pl-PL", { day: "numeric", month: "short", year: "numeric" })
                        : "Wybierz datę"}
                    </span>
                    <HugeiconsIcon icon={Calendar01Icon} size={14} className="shrink-0 text-muted-foreground" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.validUntil}
                    onSelect={date => {
                      setForm(f => ({ ...f, validUntil: date }))
                      setCalendarOpen(false)
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Adres</label>
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
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Opis</label>
            <Textarea
              className="min-h-[80px] resize-none text-sm"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Zakres prac, uwagi..."
            />
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
          <AlertDialogTitle>Usunąć ofertę?</AlertDialogTitle>
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

// ─── Offer row ───────────────────────────────────────────────────────────────────

function OfferRow({ offer, onClick }: { offer: PendingOffer; onClick: () => void }) {
  const total    = offerTotal(offer)
  const hasItems = offer.items.length > 0

  return (
    <div
      onClick={onClick}
      className="group flex items-center gap-4 px-5 py-3.5 cursor-pointer transition-colors hover:bg-muted/20"
    >
      {/* Status dot */}
      <div className={cn("size-2 shrink-0 rounded-full", dotColor[offer.status])} />

      {/* Offer number — first column */}
      <div className="w-28 shrink-0">
        <p className="font-mono text-xs font-semibold tabular-nums text-foreground">{offer.number}</p>
      </div>

      {/* Company + contact */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{offer.company}</p>
        <p className="truncate text-xs text-muted-foreground">{offer.contact}</p>
      </div>

      {/* Attachment indicator */}
      <div className="w-5 shrink-0 flex justify-center">
        {offer.attachmentName && (
          <HugeiconsIcon
            icon={File01Icon}
            size={13}
            className="text-wirmet-blue/60"
          />
        )}
      </div>

      {/* Status badge */}
      <div className="w-40 shrink-0">
        <Badge variant="outline" className={cn("text-[11px]", badgeClass[offer.status])}>
          {offer.status}
        </Badge>
      </div>

      {/* Valid until */}
      <div className="w-28 shrink-0 text-right">
        <p className="text-xs tabular-nums text-muted-foreground">{offer.validUntil}</p>
      </div>

      {/* Total value */}
      <div className="w-28 shrink-0 text-right">
        {hasItems
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
    <div className="flex items-center gap-4 border-b border-border px-5 py-2">
      <div className="size-2 shrink-0" /> {/* dot spacer */}
      <p className="w-28 shrink-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Nr oferty</p>
      <p className="flex-1 min-w-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Firma</p>
      <div className="w-5 shrink-0" /> {/* attachment icon spacer */}
      <p className="w-40 shrink-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Status</p>
      <p className="w-28 shrink-0 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Ważna do</p>
      <p className="w-28 shrink-0 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Wartość</p>
    </div>
  )
}

// ─── Empty state ─────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <HugeiconsIcon icon={Invoice01Icon} size={28} className="text-muted-foreground/20" />
      <p className="text-sm text-muted-foreground/50">Brak ofert dla wybranych filtrów</p>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────────

export default function OffertyPage() {
  const { offers, deleteOffer, updateOffer } = useOffers()
  const searchParams = useSearchParams()

  const [search, setSearch]             = useState(() => searchParams.get("q") ?? "")
  const [statusFilter, setStatusFilter] = useState("Wszystkie")
  const [sortDir, setSortDir]           = useState<SortDir>("desc") // newest first

  // Dialog state
  const [selected, setSelected]     = useState<PendingOffer | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [editOpen, setEditOpen]     = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  // Clear selected after all dialogs close
  useEffect(() => {
    if (!detailOpen && !editOpen && !deleteOpen) {
      const t = setTimeout(() => setSelected(null), 300)
      return () => clearTimeout(t)
    }
  }, [detailOpen, editOpen, deleteOpen])

  // ── Stats ────────────────────────────────────────────────────────────────────
  const total      = offers.length
  const doWyceny   = offers.filter(o => o.status === "Do wyceny").length
  const doWyslania = offers.filter(o => o.status === "Do wysłania").length
  const followUp   = offers.filter(o => o.status === "Follow-up").length

  // ── Filtering ────────────────────────────────────────────────────────────────
  const filtered = offers.filter(o => {
    const q = search.toLowerCase()
    if (q && !o.company.toLowerCase().includes(q) && !o.number.toLowerCase().includes(q)) return false
    if (statusFilter !== "Wszystkie" && o.status !== statusFilter) return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    const diff = offerSeq(a.number) - offerSeq(b.number)
    return sortDir === "desc" ? -diff : diff
  })

  function openDetail(offer: PendingOffer) {
    setSelected(offer)
    setDetailOpen(true)
  }

  function handleDelete() {
    if (!selected) return
    deleteOffer(selected.number)
    setDeleteOpen(false)
  }

  function handleSaveEdit(updates: Partial<PendingOffer>) {
    if (!selected) return
    updateOffer(selected.number, updates)
    setEditOpen(false)
  }

  return (
    <div className="flex h-full flex-col gap-6 p-4 md:gap-8 md:p-8">
      <PageSetup title="Oferty" icon={Invoice01Icon} />

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
            Oferty
          </h1>
          <p className="text-sm text-muted-foreground">
            Zarządzaj i śledź wszystkie oferty dla klientów.
          </p>
        </div>
        <div className="shrink-0">
          <AddOfferDialog />
        </div>
      </div>

      {/* ── Stats overview ──────────────────────────────────────────────────── */}
      <StatsOverview
        total={total}
        doWyceny={doWyceny}
        doWyslania={doWyslania}
        followUp={followUp}
      />

      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative">
          <HugeiconsIcon
            icon={Search01Icon}
            size={14}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Szukaj firmy lub nr oferty..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-8 w-56 pl-8 text-xs"
          />
        </div>

        <FilterDropdown
          label="Status"
          options={["Wszystkie", "Do wyceny", "Do wysłania", "Wysłana", "Oczekuje na odpowiedź", "Follow-up", "Odrzucona"]}
          value={statusFilter}
          onChange={setStatusFilter}
        />

        {/* Sort */}
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs"
          onClick={() => setSortDir(d => d === "desc" ? "asc" : "desc")}
        >
          <HugeiconsIcon icon={sortDir === "desc" ? ArrowDown01Icon : ArrowUp01Icon} size={12} />
          {sortDir === "desc" ? "Najnowsze" : "Najstarsze"}
        </Button>
      </div>

      {/* ── List ────────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-foreground">
            Wszystkie oferty
          </p>
          <span className="text-xs text-muted-foreground">{sorted.length} pozycji</span>
        </div>

        {sorted.length > 0 ? (
          <>
            <ColumnHeaders />
            <div className="divide-y divide-border">
              {sorted.map(o => (
                <OfferRow key={o.number} offer={o} onClick={() => openDetail(o)} />
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
          <OfferDetailDialog
            offer={selected}
            open={detailOpen}
            onOpenChange={setDetailOpen}
            onEdit={() => setEditOpen(true)}
            onDelete={() => setDeleteOpen(true)}
          />
          <EditOfferDialog
            offer={selected}
            open={editOpen}
            onOpenChange={setEditOpen}
            onSave={handleSaveEdit}
          />
          <DeleteConfirmDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            onConfirm={handleDelete}
            description={`Oferta ${selected.number} dla firmy "${selected.company}" zostanie trwale usunięta. Tej operacji nie można cofnąć.`}
          />
        </>
      )}
    </div>
  )
}
