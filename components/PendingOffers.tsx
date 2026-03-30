"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  Cancel01Icon,
  PencilEdit01Icon,
  MoreHorizontalIcon,
  Share01Icon,
  Download01Icon,
  Invoice01Icon,
  CheckmarkCircle01Icon,
  Building01Icon,
  UserIcon,
  SmartPhone01Icon,
  Mail01Icon,
  Location01Icon,
  Calendar01Icon,
} from "@hugeicons/core-free-icons"
import Link from "next/link"
import { useOffers, type OfferStatus, type PendingOffer } from "@/components/OffersContext"

// ─── Status colors ─────────────────────────────────────────────────────────────
// "Do wyceny" uses wirmet-orange — aligns with the section's orange identity

const dotColor: Record<OfferStatus, string> = {
  "Do wyceny":             "bg-wirmet-orange/70",
  "Do wysłania":           "bg-wirmet-blue/70",
  "Oczekuje na odpowiedź": "bg-muted-foreground/30",
}

const badgeClass: Record<OfferStatus, string> = {
  "Do wyceny":             "bg-wirmet-orange/10 text-wirmet-orange border-wirmet-orange/20",
  "Do wysłania":           "bg-wirmet-blue/10  text-wirmet-blue  border-wirmet-blue/20",
  "Oczekuje na odpowiedź": "bg-zinc-500/10 text-muted-foreground border-zinc-500/20",
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

// ─── Offer detail dialog ───────────────────────────────────────────────────────

function OfferDialog({ offer }: { offer: PendingOffer }) {
  const total = offer.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const hasItems = offer.items.length > 0

  return (
    <DialogContent
      showCloseButton={false}
      className="flex max-h-[90vh] flex-col overflow-hidden bg-background p-0 border border-border sm:max-w-md"
    >
      <DialogTitle className="sr-only">{offer.company} — szczegóły oferty</DialogTitle>

      <div className="flex items-center justify-between px-5 py-4">
        <p className="text-sm font-semibold text-foreground">Szczegóły oferty</p>
        <DialogClose asChild>
          <Button variant="ghost" size="icon-sm">
            <HugeiconsIcon icon={Cancel01Icon} data-icon strokeWidth={2} />
          </Button>
        </DialogClose>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto px-4 pb-2">
        <div className="rounded-xl bg-card px-5 py-4">
          <p className="mb-1.5 text-xs text-muted-foreground">Numer oferty</p>
          <p className="text-2xl font-semibold text-muted-foreground">{offer.number}</p>
        </div>

        <div className="overflow-hidden rounded-xl bg-card">
          <IconRow icon={Invoice01Icon} label="Data utworzenia">{offer.created}</IconRow>
          <IconRow icon={Calendar01Icon} label="Termin ważności" className="border-t border-border">{offer.validUntil}</IconRow>
          <IconRow icon={CheckmarkCircle01Icon} label="Status" className="border-t border-border pb-2">
            <Badge variant="outline" className={cn("text-[11px]", badgeClass[offer.status])}>
              {offer.status}
            </Badge>
          </IconRow>
        </div>

        <div className="overflow-hidden rounded-xl bg-card divide-y divide-border">
          <IconRow icon={Building01Icon} label="Firma">{offer.company}</IconRow>
          <IconRow icon={UserIcon} label="Osoba kontaktowa">{offer.contact}</IconRow>
          <IconRow icon={SmartPhone01Icon} label="Telefon">{offer.phone}</IconRow>
          <IconRow icon={Mail01Icon} label="E-mail">{offer.email}</IconRow>
          <IconRow icon={Location01Icon} label="Adres" className="pb-2">{offer.address}</IconRow>
        </div>

        {offer.description && (
          <div className="flex flex-col gap-2">
            <p className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Opis</p>
            <div className="rounded-xl bg-card px-4 py-3">
              <p className="text-sm text-muted-foreground">{offer.description}</p>
            </div>
          </div>
        )}

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
                <p className="text-sm font-bold text-foreground">{total.toFixed(2)} zł</p>
              </div>
            </div>
          </div>
        )}
      </div>

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

// ─── Offer row ─────────────────────────────────────────────────────────────────

function OfferRow({ offer }: { offer: PendingOffer }) {
  const [open, setOpen] = useState(false)
  // Show expiry date when available, otherwise fall back to creation date
  const subtext = offer.validUntil !== "—"
    ? `${offer.number} · ważna do ${offer.validUntil}`
    : `${offer.number} · ${offer.created}`

  return (
    <>
      <div
        onClick={() => setOpen(true)}
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

      <Dialog open={open} onOpenChange={setOpen}>
        <OfferDialog offer={offer} />
      </Dialog>
    </>
  )
}

// ─── PendingOffers ─────────────────────────────────────────────────────────────

export function PendingOffers() {
  const { offers } = useOffers()

  return (
    <div>
      {/* Orange 2px gradient bar — same language as stat cards, identifies this as "offers" section */}
      <div className="h-[2px] bg-gradient-to-r from-wirmet-orange to-wirmet-orange/0" />

      {/* Header — invoice icon tinted orange reinforces the section identity */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={Invoice01Icon} size={14} className="shrink-0 text-wirmet-orange" />
          <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-foreground">
            Oferty w toku
          </p>
        </div>
        <Link
          href="/offers"
          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Wszystkie
          <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
        </Link>
      </div>

      <div className="divide-y divide-border">
        {offers.map((offer) => (
          <OfferRow key={offer.number} offer={offer} />
        ))}
      </div>
    </div>
  )
}
