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

type OfferStatus = "Do wyceny" | "Do wysłania" | "Oczekuje na odpowiedź"

interface OfferItem {
  name: string
  quantity: number
  unit: string
  unitPrice: number
}

interface PendingOffer {
  number: string
  company: string
  created: string
  status: OfferStatus
  // Detail fields shown in the modal
  contact: string
  phone: string
  email: string
  address: string
  validUntil: string
  description: string
  items: OfferItem[]
}

const offers: PendingOffer[] = [
  {
    number: "#OF-0441",
    company: "TechBuild Sp. z o.o.",
    created: "10 Mar 2025",
    status: "Do wyceny",
    contact: "Tomasz Dąbrowski",
    phone: "+48 605 678 901",
    email: "t.dabrowski@techbuild.pl",
    address: "ul. Gdańska 11, Gdańsk",
    validUntil: "—",
    description: "Wycena systemu balustrad stalowych na obiekcie przemysłowym.",
    items: [],
  },
  {
    number: "#OF-0438",
    company: "Konstrukt S.A.",
    created: "8 Mar 2025",
    status: "Do wysłania",
    contact: "Anna Kowalczyk",
    phone: "+48 612 345 678",
    email: "a.kowalczyk@konstrukt.pl",
    address: "ul. Przemysłowa 4, Kraków",
    validUntil: "7 Apr 2025",
    description: "Oferta na montaż stolarki okiennej — 18 szt.",
    items: [
      { name: "Okno PVC 140×120", quantity: 18, unit: "szt", unitPrice: 640 },
      { name: "Piana izolacyjna", quantity: 36, unit: "szt", unitPrice: 22 },
      { name: "Robocizna montażowa", quantity: 12, unit: "h", unitPrice: 120 },
    ],
  },
  {
    number: "#OF-0435",
    company: "Rem-Bud Usługi",
    created: "5 Mar 2025",
    status: "Oczekuje na odpowiedź",
    contact: "Piotr Rem",
    phone: "+48 603 211 987",
    email: "biuro@rem-bud.pl",
    address: "ul. Lipowa 21, Gdańsk",
    validUntil: "4 Apr 2025",
    description: "Oferta na dostawę materiałów budowlanych — etap II.",
    items: [
      { name: "Bloczki betonowe B20", quantity: 600, unit: "szt", unitPrice: 4.5 },
      { name: "Zaprawa murarska", quantity: 40, unit: "worki", unitPrice: 18 },
      { name: "Opłata za dostawę", quantity: 1, unit: "ryczałt", unitPrice: 350 },
    ],
  },
  {
    number: "#OF-0431",
    company: "Piotr Jabłoński",
    created: "3 Mar 2025",
    status: "Do wyceny",
    contact: "Piotr Jabłoński",
    phone: "+48 601 000 111",
    email: "p.jablonski@gmail.com",
    address: "ul. Słoneczna 8, Wrocław",
    validUntil: "—",
    description: "Wycena remontu łazienki i kuchni — mieszkanie 60 m².",
    items: [],
  },
]

const dotColor: Record<OfferStatus, string> = {
  "Do wyceny":             "bg-amber-500/70",
  "Do wysłania":           "bg-blue-500/70",
  "Oczekuje na odpowiedź": "bg-muted-foreground/40",
}

const badgeClass: Record<OfferStatus, string> = {
  "Do wyceny":             "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Do wysłania":           "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Oczekuje na odpowiedź": "bg-zinc-500/10 text-muted-foreground border-zinc-500/20",
}

// Icon + label on the left, value right-aligned — same pattern as ProjectDialog
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

function OfferDialog({ offer }: { offer: PendingOffer }) {
  const total = offer.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const hasItems = offer.items.length > 0

  return (
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

      {/* Scrollable body */}
      <div className="flex flex-col gap-3 overflow-y-auto px-4 pb-2">

        {/* Hero — offer number large */}
        <div className="rounded-xl bg-card px-5 py-4">
          <p className="mb-1.5 text-xs text-muted-foreground">Numer oferty</p>
          <p className="text-2xl font-semibold text-muted-foreground">{offer.number}</p>
        </div>

        {/* Offer info + status */}
        <div className="overflow-hidden rounded-xl bg-card">
          <IconRow icon={Invoice01Icon} label="Data utworzenia">{offer.created}</IconRow>
          <IconRow icon={Calendar01Icon} label="Termin ważności" className="border-t border-border">{offer.validUntil}</IconRow>
          <IconRow icon={CheckmarkCircle01Icon} label="Status" className="border-t border-border pb-2">
            <Badge variant="outline" className={cn("text-[11px]", badgeClass[offer.status])}>
              {offer.status}
            </Badge>
          </IconRow>
        </div>

        {/* Contact details */}
        <div className="overflow-hidden rounded-xl bg-card divide-y divide-border">
          <IconRow icon={Building01Icon} label="Firma">{offer.company}</IconRow>
          <IconRow icon={UserIcon} label="Osoba kontaktowa">{offer.contact}</IconRow>
          <IconRow icon={SmartPhone01Icon} label="Telefon">{offer.phone}</IconRow>
          <IconRow icon={Mail01Icon} label="E-mail">{offer.email}</IconRow>
          <IconRow icon={Location01Icon} label="Adres" className="pb-2">{offer.address}</IconRow>
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

        {/* Items — only shown when priced */}
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
                <p className="text-sm font-bold text-foreground">
                  {total.toFixed(2)} zł
                </p>
              </div>
            </div>
          </div>
        )}

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

// Each offer row owns its own Dialog state — no shared selected state
function OfferRow({ offer }: { offer: PendingOffer }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 cursor-pointer transition-colors hover:bg-muted/30"
      >
        <div className={cn("size-2 shrink-0 rounded-full", dotColor[offer.status])} />
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{offer.company}</p>
          <p className="text-xs text-muted-foreground">{offer.number} · {offer.created}</p>
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

export function PendingOffers() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-foreground">Oferty w toku</p>
        <Link
          href="/offers"
          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Wszystkie
          <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {offers.map((offer) => (
          <OfferRow key={offer.number} offer={offer} />
        ))}
      </div>
    </div>
  )
}
