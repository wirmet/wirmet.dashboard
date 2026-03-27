import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import Link from "next/link"

type ShipmentStatus = "In transit" | "Delivered" | "Pending"

interface Shipment {
  id: string
  client: string
  destination: string
  carrier: string
  date: string
  status: ShipmentStatus
}

const shipments: Shipment[] = [
  {
    id: "#SHP-0312",
    client: "Marek Wiśniewski",
    destination: "ul. Różana 12, Kraków",
    carrier: "DPD",
    date: "12 Mar 2025",
    status: "In transit",
  },
  {
    id: "#SHP-0298",
    client: "Budmax Sp. z o.o.",
    destination: "ul. Przemysłowa 8, Warszawa",
    carrier: "InPost",
    date: "10 Mar 2025",
    status: "Delivered",
  },
  {
    id: "#SHP-0305",
    client: "Anna Kowalczyk",
    destination: "ul. Słoneczna 3, Wrocław",
    carrier: "DHL",
    date: "14 Mar 2025",
    status: "Pending",
  },
  {
    id: "#SHP-0317",
    client: "Firma Rem-Bud",
    destination: "ul. Lipowa 21, Gdańsk",
    carrier: "DPD",
    date: "15 Mar 2025",
    status: "Pending",
  },
]

// Small status dot color
const dotColor: Record<ShipmentStatus, string> = {
  "In transit": "bg-blue-400",
  "Delivered":  "bg-emerald-400",
  "Pending":    "bg-muted-foreground/40",
}

// Opacity-based badge colors — work in both light and dark
const badgeClass: Record<ShipmentStatus, string> = {
  "In transit": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Delivered":  "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  "Pending":    "bg-zinc-500/10 text-muted-foreground border-zinc-500/20",
}

export function CurrentShipments() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-foreground">Wysyłki</p>
        <Button variant="outline" size="sm" asChild className="rounded-full">
          <Link href="/shipments">
            Wszystkie
            <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" />
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {shipments.map((s) => (
          <div key={s.id} className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
            <div className={cn("size-2 shrink-0 rounded-full", dotColor[s.status])} />
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{s.client}</p>
              <p className="text-xs text-muted-foreground">{s.id} · {s.carrier}</p>
            </div>
            <Badge variant="outline" className={cn("shrink-0 text-[11px]", badgeClass[s.status])}>
              {s.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  )
}
