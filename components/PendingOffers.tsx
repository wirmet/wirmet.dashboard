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
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  Cancel01Icon,
  PencilEdit01Icon,
  Delete01Icon,
  Invoice01Icon,
  UserIcon,
  SmartPhone01Icon,
  Mail01Icon,
  Location01Icon,
  Calendar01Icon,
  Tick02Icon,
  Building04Icon,
} from "@hugeicons/core-free-icons"
import Link from "next/link"
import { useOffers, type OfferStatus, type PendingOffer } from "@/components/OffersContext"

// ─── Status colors ─────────────────────────────────────────────────────────────

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
      <div className="text-sm font-medium text-foreground text-right">{children}</div>
    </div>
  )
}

// ─── Offer detail dialog ───────────────────────────────────────────────────────

function OfferDetailDialog({ offer, open, onOpenChange, onEdit, onDelete }: {
  offer: PendingOffer
  open: boolean
  onOpenChange: (v: boolean) => void
  onEdit: () => void
  onDelete: () => void
}) {
  const total    = offer.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0)
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
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Oferta
          </p>
          <DialogClose asChild>
            <Button variant="ghost" size="icon-sm">
              <HugeiconsIcon icon={Cancel01Icon} data-icon strokeWidth={2} />
            </Button>
          </DialogClose>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-3 overflow-y-auto px-4 pb-4">

          {/* Hero — company + number + status, all in one card */}
          <div className="overflow-hidden rounded-xl bg-card">
            <div className="h-[2px] bg-gradient-to-r from-wirmet-orange to-wirmet-orange/0" />
            <div className="px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <p className="font-[family-name:var(--font-display)] text-lg font-bold leading-snug text-foreground">
                  {offer.company}
                </p>
                <Badge variant="outline" className={cn("shrink-0 mt-0.5 text-[11px]", badgeClass[offer.status])}>
                  {offer.status}
                </Badge>
              </div>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{offer.number}</p>
              <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                <span>Utworzona: {offer.created}</span>
                <span className="text-muted-foreground/30">·</span>
                <span>Ważna do: {offer.validUntil}</span>
              </div>
            </div>
          </div>

          {/* Contact details */}
          <div className="overflow-hidden rounded-xl bg-card divide-y divide-border">
            <IconRow icon={UserIcon} label="Osoba kontaktowa">{offer.contact}</IconRow>
            <IconRow icon={SmartPhone01Icon} label="Telefon">{offer.phone}</IconRow>
            <IconRow icon={Mail01Icon} label="E-mail">{offer.email}</IconRow>
            <IconRow icon={Location01Icon} label="Adres">{offer.address}</IconRow>
          </div>

          {/* Description */}
          {offer.description && (
            <div className="flex flex-col gap-2">
              <p className="px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Opis
              </p>
              <div className="rounded-xl bg-card px-4 py-3">
                <p className="text-sm text-muted-foreground">{offer.description}</p>
              </div>
            </div>
          )}

          {/* Items */}
          {hasItems && (
            <div className="flex flex-col gap-2">
              <p className="px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Pozycje i usługi
              </p>
              <div className="overflow-hidden rounded-xl bg-card divide-y divide-border">
                {offer.items.map((item, i) => (
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
                  <p className="text-sm font-bold tabular-nums text-foreground">
                    {total.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} zł
                  </p>
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

// ─── Edit offer dialog ─────────────────────────────────────────────────────────

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
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Status</label>
            <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v as OfferStatus }))}>
              <SelectTrigger size="lg" className="w-full"><SelectValue /></SelectTrigger>
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
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Ważna do</label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <button type="button" className={cn(
                    "flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-input/20 px-3 text-sm transition-colors",
                    "hover:bg-input/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
                    !form.validUntil && "text-muted-foreground"
                  )}>
                    <span className="truncate">
                      {form.validUntil
                        ? form.validUntil.toLocaleDateString("pl-PL", { day: "numeric", month: "short", year: "numeric" })
                        : "Wybierz datę"}
                    </span>
                    <HugeiconsIcon icon={Calendar01Icon} size={14} className="shrink-0 text-muted-foreground" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={form.validUntil}
                    onSelect={date => { setForm(f => ({ ...f, validUntil: date })); setCalendarOpen(false) }}
                    initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Adres</label>
              <div className="relative">
                <Input className="h-9 px-3 pr-8 text-sm" value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                <HugeiconsIcon icon={Location01Icon} size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Opis</label>
            <Textarea className="min-h-[80px] resize-none text-sm" value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Zakres prac, uwagi..." />
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

// ─── Delete confirm ────────────────────────────────────────────────────────────

function DeleteConfirmDialog({ open, onOpenChange, onConfirm, description }: {
  open: boolean; onOpenChange: (v: boolean) => void; onConfirm: () => void; description: string
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
          <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={onConfirm}>
            Usuń
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ─── Offer row ─────────────────────────────────────────────────────────────────

function OfferRow({ offer }: { offer: PendingOffer }) {
  const { updateOffer, deleteOffer } = useOffers()
  const [detailOpen, setDetailOpen] = useState(false)
  const [editOpen,   setEditOpen]   = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const subtext = offer.validUntil !== "—"
    ? `${offer.number} · ważna do ${offer.validUntil}`
    : `${offer.number} · ${offer.created}`

  return (
    <>
      <div
        onClick={() => setDetailOpen(true)}
        className="flex items-center gap-3 px-5 py-3.5 cursor-pointer transition-colors hover:bg-muted/20"
      >
        <div className={cn("size-2 shrink-0 rounded-full", dotColor[offer.status])} />
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{offer.company}</p>
          <p className="truncate text-xs text-muted-foreground">{subtext}</p>
        </div>
        <Badge variant="outline" className={cn("shrink-0 text-[11px]", badgeClass[offer.status])}>
          {offer.status}
        </Badge>
      </div>

      <OfferDetailDialog offer={offer} open={detailOpen} onOpenChange={setDetailOpen}
        onEdit={() => setEditOpen(true)} onDelete={() => setDeleteOpen(true)} />
      <EditOfferDialog offer={offer} open={editOpen} onOpenChange={setEditOpen}
        onSave={u => updateOffer(offer.number, u)} />
      <DeleteConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen}
        onConfirm={() => { deleteOffer(offer.number); setDeleteOpen(false) }}
        description={`Oferta ${offer.number} dla firmy "${offer.company}" zostanie trwale usunięta.`} />
    </>
  )
}

// ─── PendingOffers ─────────────────────────────────────────────────────────────

export function PendingOffers() {
  const { offers } = useOffers()

  const actionable = [
    ...offers.filter((o) => o.status === "Do wyceny"),
    ...offers.filter((o) => o.status === "Do wysłania"),
  ].slice(0, 4)

  return (
    <div>
      <div className="h-[2px] bg-gradient-to-r from-wirmet-orange to-wirmet-orange/0" />
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={Invoice01Icon} size={14} className="shrink-0 text-wirmet-orange" />
          <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-foreground">
            Oferty w toku
          </p>
        </div>
        <Link href="/offers"
          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground">
          Wszystkie
          <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
        </Link>
      </div>
      <div className="divide-y divide-border">
        {actionable.map((offer) => (
          <OfferRow key={offer.number} offer={offer} />
        ))}
      </div>
    </div>
  )
}
