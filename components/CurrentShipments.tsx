"use client"

import { useState } from "react"
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
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  DeliveryTruck01Icon,
  Cancel01Icon,
  Delete01Icon,
  Tick02Icon,
  Location01Icon,
  Calendar01Icon,
  Invoice01Icon,
  Package01Icon,
} from "@hugeicons/core-free-icons"
import Link from "next/link"
import { useShipments, type ShipmentStatus, type Shipment } from "@/components/ShipmentsContext"

// ─── Status colors ─────────────────────────────────────────────────────────────

const dotColor: Record<ShipmentStatus, string> = {
  "Nowe":           "bg-wirmet-blue/70",
  "Przygotowywane": "bg-amber-500/70",
  "Do wysłania":    "bg-wirmet-orange/70",
  "Oczekująca":     "bg-muted-foreground/30",
  "W transporcie":  "bg-wirmet-blue/70",
  "Wstrzymane":     "bg-red-500/70",
  "Dostarczone":    "bg-wirmet-green/70",
}

const badgeClass: Record<ShipmentStatus, string> = {
  "Nowe":           "bg-wirmet-blue/10  text-wirmet-blue  border-wirmet-blue/20",
  "Przygotowywane": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Do wysłania":    "bg-wirmet-orange/10 text-wirmet-orange border-wirmet-orange/20",
  "Oczekująca":     "bg-zinc-500/10 text-muted-foreground border-zinc-500/20",
  "W transporcie":  "bg-wirmet-blue/10  text-wirmet-blue  border-wirmet-blue/20",
  "Wstrzymane":     "bg-red-500/10 text-red-400 border-red-500/20",
  "Dostarczone":    "bg-wirmet-green/10 text-wirmet-green border-wirmet-green/20",
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function extractCity(destination: string): string {
  const parts = destination.split(", ")
  return parts[parts.length - 1] ?? destination
}

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00")
  return d.toLocaleDateString("pl-PL", { day: "numeric", month: "short", year: "numeric" })
}

// ─── Shipment detail dialog ────────────────────────────────────────────────────

function ShipmentDetailDialog({ shipment, open, onOpenChange, onEdit, onDelete }: {
  shipment: Shipment
  open: boolean
  onOpenChange: (v: boolean) => void
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[90vh] flex-col overflow-hidden bg-background p-0 border border-border sm:max-w-md"
      >
        <DialogTitle className="sr-only">{shipment.id} — szczegóły wysyłki</DialogTitle>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Wysyłka
          </p>
          <DialogClose asChild>
            <Button variant="ghost" size="icon-sm">
              <HugeiconsIcon icon={Cancel01Icon} data-icon strokeWidth={2} />
            </Button>
          </DialogClose>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-3 overflow-y-auto px-4 pb-4">

          {/* Hero — ID + carrier + client + status */}
          <div className="overflow-hidden rounded-xl bg-card">
            <div className="h-[2px] bg-gradient-to-r from-wirmet-blue to-wirmet-blue/0" />
            <div className="px-5 py-4">
              <div className="flex items-center gap-2 mb-2">
                {/* Carrier pill */}
                <span className="rounded px-2 py-0.5 text-[11px] font-bold tracking-wide bg-wirmet-blue/15 text-wirmet-blue">
                  {shipment.carrier}
                </span>
                {/* Status badge */}
                <Badge variant="outline" className={cn("text-[11px]", badgeClass[shipment.status])}>
                  {shipment.status}
                </Badge>
              </div>
              <p className="font-[family-name:var(--font-display)] text-lg font-bold leading-snug text-foreground">
                {shipment.client}
              </p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{shipment.id}</p>
            </div>
          </div>

          {/* Destination card */}
          <div className="overflow-hidden rounded-xl bg-card">
            <div className="flex items-start gap-3 px-4 py-3.5">
              <div className="mt-0.5 flex shrink-0 flex-col items-center gap-1">
                <div className="size-2 rounded-full bg-wirmet-blue/60" />
                <div className="w-px flex-1 bg-border" style={{ minHeight: "1rem" }} />
                <HugeiconsIcon icon={Location01Icon} size={13} className="text-wirmet-blue" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">
                  Miejsce dostawy
                </p>
                <p className="text-sm font-medium text-foreground leading-snug">
                  {shipment.destination}
                </p>
              </div>
            </div>
          </div>

          {/* Meta details */}
          <div className="overflow-hidden rounded-xl bg-card divide-y divide-border">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2.5">
                <HugeiconsIcon icon={Calendar01Icon} size={14} className="shrink-0 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Data wysyłki</span>
              </div>
              <span className="text-sm font-medium text-foreground tabular-nums">
                {formatDate(shipment.date)}
              </span>
            </div>
            {shipment.offerNumber && (
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <HugeiconsIcon icon={Invoice01Icon} size={14} className="shrink-0 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Nr oferty</span>
                </div>
                <span className="font-mono text-sm font-medium text-foreground">{shipment.offerNumber}</span>
              </div>
            )}
            {shipment.trackingId && (
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <HugeiconsIcon icon={Package01Icon} size={14} className="shrink-0 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Tracking</span>
                </div>
                <span className="font-mono text-sm font-medium text-foreground">{shipment.trackingId}</span>
              </div>
            )}
          </div>
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
            <HugeiconsIcon icon={DeliveryTruck01Icon} data-icon="inline-start" />
            Zmień status
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Edit status dialog ────────────────────────────────────────────────────────

function EditStatusDialog({ shipment, open, onOpenChange, onSave }: {
  shipment: Shipment
  open: boolean
  onOpenChange: (v: boolean) => void
  onSave: (status: ShipmentStatus) => void
}) {
  const [status, setStatus] = useState<ShipmentStatus>(shipment.status)

  // Sync when dialog opens
  useState(() => { setStatus(shipment.status) })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Zmień status wysyłki</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          <p className="text-xs text-muted-foreground font-mono">{shipment.id} · {shipment.client}</p>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Nowy status</label>
            <Select value={status} onValueChange={v => setStatus(v as ShipmentStatus)}>
              <SelectTrigger size="lg" className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  <SelectItem value="Nowe">Nowe</SelectItem>
                  <SelectItem value="Przygotowywane">Przygotowywane</SelectItem>
                  <SelectItem value="Do wysłania">Do wysłania</SelectItem>
                  <SelectItem value="Oczekująca">Oczekująca</SelectItem>
                  <SelectItem value="W transporcie">W transporcie</SelectItem>
                  <SelectItem value="Wstrzymane">Wstrzymane</SelectItem>
                  <SelectItem value="Dostarczone">Dostarczone</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="lg" onClick={() => onOpenChange(false)}>Anuluj</Button>
          <Button variant="default" size="lg" onClick={() => { onSave(status); onOpenChange(false) }}>
            <HugeiconsIcon icon={Tick02Icon} data-icon="inline-start" />
            Zapisz
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
          <AlertDialogTitle>Usunąć wysyłkę?</AlertDialogTitle>
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

// ─── Shipment row ──────────────────────────────────────────────────────────────

function ShipmentRow({ shipment }: { shipment: Shipment }) {
  const { updateShipment, deleteShipment } = useShipments()
  const [detailOpen, setDetailOpen] = useState(false)
  const [editOpen,   setEditOpen]   = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      <div
        onClick={() => setDetailOpen(true)}
        className="flex items-center gap-3 px-5 py-3.5 cursor-pointer transition-colors hover:bg-muted/20"
      >
        <div className={cn("size-2 shrink-0 rounded-full", dotColor[shipment.status])} />
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{shipment.client}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="shrink-0 rounded px-1.5 py-px text-[10px] font-semibold bg-wirmet-blue/10 text-wirmet-blue">
              {shipment.carrier}
            </span>
            <span className="text-muted-foreground/40 text-xs">·</span>
            <span className="truncate text-xs text-muted-foreground">{extractCity(shipment.destination)}</span>
          </div>
        </div>
        <Badge variant="outline" className={cn("shrink-0 text-[11px]", badgeClass[shipment.status])}>
          {shipment.status}
        </Badge>
      </div>

      <ShipmentDetailDialog shipment={shipment} open={detailOpen} onOpenChange={setDetailOpen}
        onEdit={() => setEditOpen(true)} onDelete={() => setDeleteOpen(true)} />
      <EditStatusDialog shipment={shipment} open={editOpen} onOpenChange={setEditOpen}
        onSave={status => updateShipment(shipment.id, { status })} />
      <DeleteConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen}
        onConfirm={() => { deleteShipment(shipment.id); setDeleteOpen(false) }}
        description={`Wysyłka ${shipment.id} do "${shipment.client}" zostanie trwale usunięta.`} />
    </>
  )
}

// ─── CurrentShipments ──────────────────────────────────────────────────────────

export function CurrentShipments() {
  const { shipments } = useShipments()

  const STATUS_ORDER: ShipmentStatus[] = [
    "W transporcie", "Do wysłania", "Przygotowywane", "Nowe", "Oczekująca", "Wstrzymane",
  ]
  const recent = shipments
    .filter(s => s.status !== "Dostarczone")
    .sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status))
    .slice(0, 4)

  return (
    <div>
      <div className="h-[2px] bg-gradient-to-r from-wirmet-blue to-wirmet-blue/0" />

      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={DeliveryTruck01Icon} size={14} className="shrink-0 text-wirmet-blue" />
          <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-foreground">
            Wysyłki
          </p>
        </div>
        <Link href="/shipments"
          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground">
          Wszystkie
          <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
        </Link>
      </div>

      <div className="divide-y divide-border">
        {recent.map((s) => (
          <ShipmentRow key={s.id} shipment={s} />
        ))}
      </div>
    </div>
  )
}
