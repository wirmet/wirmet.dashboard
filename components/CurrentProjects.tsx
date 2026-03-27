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
  Add01Icon,
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

type Status = "Ordered" | "Paid"

interface OrderItem {
  name: string
  quantity: number
  unit: string
  unitPrice: number
}

interface Project {
  client: string
  deadline: string
  status: Status
  type: string
  address: string
  offerNumber: string
  companyName: string
  nip: string
  companyAddress: string
  orderDate: string
  paymentDue: string
  deliveryDate: string
  completionDate: string
  items: OrderItem[]
}

const projects: Project[] = [
  {
    client: "Marek Wiśniewski",
    deadline: "Due 20 Mar 2025",
    status: "Ordered",
    type: "Installation",
    address: "ul. Różana 12, 30-001 Kraków",
    offerNumber: "Offer #2603001",
    companyName: "Wiśniewski Budownictwo",
    nip: "PL 6782345678",
    companyAddress: "ul. Różana 12, 30-001 Kraków",
    orderDate: "3 Mar 2025",
    paymentDue: "17 Mar 2025",
    deliveryDate: "18 Mar 2025",
    completionDate: "20 Mar 2025",
    items: [
      { name: "Steel railing system", quantity: 12, unit: "m", unitPrice: 185 },
      { name: "Mounting brackets", quantity: 24, unit: "pcs", unitPrice: 18 },
      { name: "Installation labour", quantity: 8, unit: "h", unitPrice: 120 },
    ],
  },
  {
    client: "Budmax Sp. z o.o.",
    deadline: "Due 25 Mar 2025",
    status: "Paid",
    type: "Delivery",
    address: "ul. Przemysłowa 8, 00-450 Warszawa",
    offerNumber: "Offer #2603002",
    companyName: "Budmax Sp. z o.o.",
    nip: "PL 5252345678",
    companyAddress: "ul. Fabryczna 4, 00-446 Warszawa",
    orderDate: "8 Mar 2025",
    paymentDue: "22 Mar 2025",
    deliveryDate: "25 Mar 2025",
    completionDate: "25 Mar 2025",
    items: [
      { name: "Concrete blocks B20", quantity: 400, unit: "pcs", unitPrice: 4.5 },
      { name: "Sand bags 25kg", quantity: 60, unit: "bags", unitPrice: 12 },
      { name: "Delivery fee", quantity: 1, unit: "flat", unitPrice: 350 },
    ],
  },
  {
    client: "Anna Kowalczyk",
    deadline: "Due 1 Apr 2025",
    status: "Ordered",
    type: "Installation",
    address: "ul. Słoneczna 3, 50-100 Wrocław",
    offerNumber: "Offer #2603003",
    companyName: "Anna Kowalczyk — prywatny",
    nip: "—",
    companyAddress: "ul. Słoneczna 3, 50-100 Wrocław",
    orderDate: "12 Mar 2025",
    paymentDue: "28 Mar 2025",
    deliveryDate: "30 Mar 2025",
    completionDate: "1 Apr 2025",
    items: [
      { name: "Window frame 140×120", quantity: 3, unit: "pcs", unitPrice: 640 },
      { name: "Insulation foam", quantity: 6, unit: "cans", unitPrice: 22 },
      { name: "Installation labour", quantity: 6, unit: "h", unitPrice: 120 },
    ],
  },
]

function StatusBadge({ status }: { status: Status }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        status === "Paid"
          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
          : "bg-blue-500/10 text-blue-400 border-blue-500/20"
      )}
    >
      {status}
    </Badge>
  )
}

// Icon + label on the left, value right-aligned — inspired by "Transaction details" rows
function IconRow({
  icon,
  label,
  children,
}: {
  icon: IconSvgElement
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="flex w-40 shrink-0 items-center gap-2.5">
        <HugeiconsIcon icon={icon} size={14} className="shrink-0 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="flex flex-1 justify-end text-sm font-medium text-foreground">
        {children}
      </div>
    </div>
  )
}

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
            <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={2} />
          </Button>
        </DialogClose>
      </div>

      {/* Scrollable body */}
      <div className="flex flex-col gap-3 overflow-y-auto px-4 pb-4">

        {/* Hero — total order value */}
        <div className="rounded-xl bg-card px-5 py-4">
          <p className="mb-1.5 text-xs text-muted-foreground">Wartość zamówienia</p>
          <p className="text-4xl font-bold tracking-tight text-foreground">
            {wholeFormatted}
            <span className="text-2xl font-semibold text-muted-foreground">,{cents} zł</span>
          </p>
        </div>

        {/* Project details — icon rows */}
        <div className="overflow-hidden rounded-xl bg-card divide-y divide-border">
          <IconRow icon={Invoice01Icon} label="Numer oferty">{project.offerNumber}</IconRow>
          <IconRow icon={Wrench01Icon} label="Rodzaj prac">{project.type}</IconRow>
          <IconRow icon={CheckmarkCircle01Icon} label="Status">
            <StatusBadge status={project.status} />
          </IconRow>
          <IconRow icon={Calendar01Icon} label="Data zamówienia">{project.orderDate}</IconRow>
          <IconRow icon={CreditCardIcon} label="Termin płatności">{project.paymentDue}</IconRow>
          <IconRow icon={DeliveryTruck01Icon} label="Data dostawy">{project.deliveryDate}</IconRow>
          <IconRow icon={Flag01Icon} label="Data realizacji">{project.completionDate}</IconRow>
        </div>

        {/* Company + addresses */}
        <div className="overflow-hidden rounded-xl bg-card divide-y divide-border">
          <IconRow icon={Building01Icon} label="Firma">{project.companyName}</IconRow>
          <IconRow icon={HashtagIcon} label="NIP">{project.nip}</IconRow>
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
            {/* Total row */}
            <div className="flex items-center justify-between px-4 py-3">
              <p className="text-sm font-semibold text-foreground">Razem</p>
              <p className="text-sm font-bold text-foreground">{totalFixed} zł</p>
            </div>
          </div>
        </div>

      </div>

      {/* Footer — actions */}
      <div className="flex items-center justify-between border-t border-border px-5 py-4">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm">
            <HugeiconsIcon icon={MoreHorizontalIcon} size={15} />
          </Button>
          <Button variant="ghost" size="icon-sm">
            <HugeiconsIcon icon={Share01Icon} size={15} />
          </Button>
          <Button variant="ghost" size="icon-sm">
            <HugeiconsIcon icon={Download01Icon} size={15} />
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

export function CurrentProjects() {
  const [selected, setSelected] = useState<Project | null>(null)

  return (
    <>
      <div className="flex-1 flex flex-col">
        {/* Section header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-base font-semibold text-foreground">Aktualne realizacje</p>
          <Link
            href="/projects"
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Wszystkie
            <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
          </Link>
        </div>

        {/* Vertical list of project cards */}
        <div className="flex flex-col gap-3 flex-1">
          {projects.map((project) => (
            <div
              key={project.client}
              onClick={() => setSelected(project)}
              className="rounded-xl border border-border bg-card p-4 cursor-pointer transition-colors hover:bg-muted/30 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">{project.deadline}</span>
                <StatusBadge status={project.status} />
              </div>
              <p className="text-sm font-semibold text-foreground">{project.client}</p>
              <div className="flex items-center gap-2 min-w-0">
                <Badge variant="outline" className="text-[11px] shrink-0">{project.type}</Badge>
                <span className="text-xs text-muted-foreground shrink-0">{project.offerNumber}</span>
                <span className="text-xs text-muted-foreground shrink-0">·</span>
                <span className="truncate text-xs text-muted-foreground">{project.address}</span>
              </div>
            </div>
          ))}

          {/* End-of-list indicator — fills remaining height */}
          <div className="flex-1 flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border min-h-[80px]">
            <div className="flex flex-col items-center gap-2">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={22} className="text-muted-foreground" />
              <p className="text-xs text-muted-foreground/50">Brak więcej aktualnych realizacji</p>
            </div>
            <Button variant="outline" size="lg">
              <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" className="text-white" />
              Nowa realizacja
            </Button>
          </div>
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
