import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

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

const accentColor: Record<ShipmentStatus, string> = {
  "In transit": "bg-blue-400",
  "Delivered":  "bg-green-400",
  "Pending":    "bg-zinc-300",
}

const badgeStyle: Record<ShipmentStatus, string> = {
  "In transit": "bg-blue-50 text-blue-700 border-blue-200",
  "Delivered":  "bg-green-50 text-green-700 border-green-200",
  "Pending":    "bg-zinc-100 text-zinc-600 border-zinc-200",
}

export function CurrentShipments() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
      {shipments.map((s, index) => (
        <div
          key={s.id}
          className={cn(
            "flex items-center gap-4 px-4 py-3",
            index !== shipments.length - 1 && "border-b border-zinc-100"
          )}
        >
          {/* Status accent bar */}
          <div className={cn("h-8 w-1 shrink-0 rounded-full", accentColor[s.status])} />

          {/* Main content */}
          <div className="flex flex-1 items-center justify-between gap-4 min-w-0">
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-900 truncate">{s.client}</p>
              <p className="text-xs text-zinc-400 truncate">{s.id} · {s.carrier} · {s.date}</p>
            </div>
            <Badge
              variant="outline"
              className={cn("shrink-0 text-[11px]", badgeStyle[s.status])}
            >
              {s.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
