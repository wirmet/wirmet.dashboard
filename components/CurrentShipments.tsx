"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon, DeliveryTruck01Icon } from "@hugeicons/core-free-icons"
import Link from "next/link"
import { useShipments, type ShipmentStatus } from "@/components/ShipmentsContext"

// ─── Status colors ─────────────────────────────────────────────────────────────

const dotColor: Record<ShipmentStatus, string> = {
  "Nowe":           "bg-wirmet-blue/70",
  "Przygotowywane": "bg-amber-500/70",
  "Do wysłania":    "bg-wirmet-orange/70",
  "Pending":        "bg-muted-foreground/30",
  "In transit":     "bg-wirmet-blue/70",
  "Wstrzymane":     "bg-red-500/70",
  "Delivered":      "bg-wirmet-green/70",
}

const badgeClass: Record<ShipmentStatus, string> = {
  "Nowe":           "bg-wirmet-blue/10  text-wirmet-blue  border-wirmet-blue/20",
  "Przygotowywane": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Do wysłania":    "bg-wirmet-orange/10 text-wirmet-orange border-wirmet-orange/20",
  "Pending":        "bg-zinc-500/10 text-muted-foreground border-zinc-500/20",
  "In transit":     "bg-wirmet-blue/10  text-wirmet-blue  border-wirmet-blue/20",
  "Wstrzymane":     "bg-red-500/10 text-red-400 border-red-500/20",
  "Delivered":      "bg-wirmet-green/10 text-wirmet-green border-wirmet-green/20",
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

// Extract city from "ul. Gdańska 11, Gdańsk" → "Gdańsk"
function extractCity(destination: string): string {
  const parts = destination.split(", ")
  return parts[parts.length - 1] ?? destination
}

// ─── CurrentShipments ──────────────────────────────────────────────────────────

export function CurrentShipments() {
  const { shipments } = useShipments()
  const recent = shipments.slice(0, 4)

  return (
    <div>
      {/* Blue 2px gradient bar — same language as stat cards, identifies this as "shipments" section */}
      <div className="h-[2px] bg-gradient-to-r from-wirmet-blue to-wirmet-blue/0" />

      {/* Header — truck icon tinted blue reinforces the section identity */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={DeliveryTruck01Icon} size={14} className="shrink-0 text-wirmet-blue" />
          <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-foreground">
            Wysyłki
          </p>
        </div>
        <Link
          href="/shipments"
          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Wszystkie
          <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
        </Link>
      </div>

      <div className="divide-y divide-border">
        {recent.map((s) => (
          <div key={s.id} className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-muted/20">
            <div className={cn("size-2 shrink-0 rounded-full", dotColor[s.status])} />
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{s.client}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {/* Carrier pill — branded, instantly recognisable for logistics context */}
                <span className="shrink-0 rounded px-1.5 py-px text-[10px] font-semibold bg-wirmet-blue/10 text-wirmet-blue">
                  {s.carrier}
                </span>
                <span className="text-muted-foreground/40 text-xs">·</span>
                <span className="truncate text-xs text-muted-foreground">{extractCity(s.destination)}</span>
              </div>
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
