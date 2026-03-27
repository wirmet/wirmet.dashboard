"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import Link from "next/link"
import { useShipments, type ShipmentStatus } from "@/components/ShipmentsContext"

// Small status dot color — opacity-based to avoid raw color values (Rule 10)
const dotColor: Record<ShipmentStatus, string> = {
  "Nowe":           "bg-violet-500/70",
  "Przygotowywane": "bg-amber-500/70",
  "Do wysłania":    "bg-sky-500/70",
  "Pending":        "bg-muted-foreground/40",
  "In transit":     "bg-blue-500/70",
  "Wstrzymane":     "bg-red-500/70",
  "Delivered":      "bg-emerald-500/70",
}

// Opacity-based badge colors — work in both light and dark
const badgeClass: Record<ShipmentStatus, string> = {
  "Nowe":           "bg-violet-500/10 text-violet-400 border-violet-500/20",
  "Przygotowywane": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Do wysłania":    "bg-sky-500/10 text-sky-400 border-sky-500/20",
  "Pending":        "bg-zinc-500/10 text-muted-foreground border-zinc-500/20",
  "In transit":     "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Wstrzymane":     "bg-red-500/10 text-red-400 border-red-500/20",
  "Delivered":      "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
}

export function CurrentShipments() {
  const { shipments } = useShipments()
  // Show the 4 most recent — new shipments are prepended so slice(0,4) always gives latest
  const recent = shipments.slice(0, 4)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-foreground">Wysyłki</p>
        <Link
          href="/shipments"
          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Wszystkie
          <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {recent.map((s) => (
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
