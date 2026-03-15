"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon, PencilEdit01Icon } from "@hugeicons/core-free-icons"
import { useState } from "react"

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
      className={
        status === "Paid"
          ? "bg-green-50 text-green-700 border-green-200"
          : "bg-blue-50 text-blue-700 border-blue-200"
      }
      variant="outline"
    >
      {status}
    </Badge>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-xs">
      <span className="shrink-0 text-zinc-400">{label}</span>
      <span className="text-right font-medium text-zinc-700">{value}</span>
    </div>
  )
}

function ProjectDialog({ project }: { project: Project }) {
  const total = project.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  )

  return (
    <DialogContent
      showCloseButton={false}
      className="flex max-h-[90vh] flex-col overflow-hidden bg-white p-0 ring-0 border border-zinc-200 sm:max-w-2xl"
    >
      <DialogTitle className="sr-only">{project.client} — project details</DialogTitle>

      {/* Header */}
      <div className="relative border-b border-zinc-100 px-6 pt-6 pb-4">
        <DialogClose asChild>
          <Button variant="ghost" size="icon-sm" className="absolute top-3 right-3">
            <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={2} className="text-zinc-900" />
          </Button>
        </DialogClose>

        <p className="text-lg font-bold text-zinc-900">{project.client}</p>

        <div className="mt-2 flex items-center justify-between">
          <StatusBadge status={project.status} />
          <button className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50">
            <HugeiconsIcon icon={PencilEdit01Icon} size={13} className="text-zinc-700" />
            Edit
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="overflow-y-auto px-6 pb-6 pt-1 space-y-4">

        {/* 1. Project Info */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Project Info</p>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            <DetailRow label="Offer number" value={project.offerNumber} />
            <DetailRow label="Type of work" value={project.type} />
            <DetailRow label="Order date" value={project.orderDate} />
            <DetailRow label="Payment due" value={project.paymentDue} />
            <DetailRow label="Delivery date" value={project.deliveryDate} />
            <DetailRow label="Completion" value={project.completionDate} />
          </div>
        </div>

        <Separator className="bg-zinc-100" />

        {/* 2. Company Details */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Company Details</p>
          <div className="space-y-2">
            <DetailRow label="Company" value={project.companyName} />
            <DetailRow label="NIP" value={project.nip} />
            <DetailRow label="Address" value={project.companyAddress} />
          </div>
        </div>

        <Separator className="bg-zinc-100" />

        {/* 3. Installation Address */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Installation Address</p>
          <DetailRow label="Address" value={project.address} />
        </div>

        <Separator className="bg-zinc-100" />

        {/* 4. Items & Services */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Items & Services</p>

          <div className="grid grid-cols-[1fr_5rem_6rem_6rem] text-[11px] font-medium uppercase tracking-wide text-zinc-400">
            <span>Name</span>
            <span className="text-right">Qty</span>
            <span className="text-right">Unit price</span>
            <span className="text-right">Total</span>
          </div>

          <div className="space-y-2">
            {project.items.map((item, i) => (
              <div key={i} className="grid grid-cols-[1fr_5rem_6rem_6rem] text-xs">
                <span className="font-medium text-zinc-700">{item.name}</span>
                <span className="text-right text-zinc-500">{item.quantity} {item.unit}</span>
                <span className="text-right text-zinc-500">{item.unitPrice.toFixed(2)} zł</span>
                <span className="text-right font-medium text-zinc-900">
                  {(item.quantity * item.unitPrice).toFixed(2)} zł
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-zinc-100 pt-3 text-sm font-semibold text-zinc-900">
            <span>Total</span>
            <span>{total.toFixed(2)} zł</span>
          </div>
        </div>

      </div>
    </DialogContent>
  )
}

export function CurrentProjects() {
  const [selected, setSelected] = useState<Project | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {projects.map((project) => (
          <Card
            key={project.client}
            onClick={() => setSelected(project)}
            className="cursor-pointer rounded-xl border border-zinc-200 bg-white shadow-none ring-0 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
          >
            <CardHeader className="border-b border-zinc-100 pb-3 gap-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-sm font-semibold text-zinc-900">
                    {project.client}
                  </CardTitle>
                  <CardDescription className="mt-0.5">
                    {project.deadline}
                  </CardDescription>
                </div>
                <StatusBadge status={project.status} />
              </div>
            </CardHeader>

            <CardContent className="space-y-1.5 pt-3">
              <div className="flex gap-2 text-xs">
                <span className="w-24 shrink-0 text-zinc-400">Type</span>
                <span className="font-medium text-zinc-700">{project.type}</span>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="w-24 shrink-0 text-zinc-400">Address</span>
                <span className="font-medium text-zinc-700">{project.address}</span>
              </div>
            </CardContent>
          </Card>
        ))}
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
