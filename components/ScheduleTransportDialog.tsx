"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  DeliveryTruck01Icon,
  Upload01Icon,
  Cancel01Icon,
  File01Icon,
  Calendar01Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { useShipments, type ShipmentStatus } from "@/components/ShipmentsContext"

const CARRIERS = ["DPD", "DHL", "Geodis", "InPost", "GLS", "Inny", "Transport wewnętrzny", "Prywatny przewoźnik"]

const STATUSES: { value: ShipmentStatus; label: string }[] = [
  { value: "Nowe",           label: "Nowe" },
  { value: "Przygotowywane", label: "Przygotowywane" },
  { value: "Do wysłania",    label: "Do wysłania" },
  { value: "Pending",        label: "Oczekuje" },
  { value: "In transit",     label: "W drodze" },
  { value: "Wstrzymane",     label: "Wstrzymane" },
  { value: "Delivered",      label: "Dostarczone" },
]

// Mirrors the current projects — in a real app this would come from a shared store.
// Only orders with isActive: true appear in the dropdown (aktualne realizacje).
const AVAILABLE_ORDERS = [
  {
    value: "2603001",
    offerNumber: "Offer #2603001",
    client: "Marek Wiśniewski",
    destination: "ul. Różana 12, 30-001 Kraków",
    isActive: true,
  },
  {
    value: "2603002",
    offerNumber: "Offer #2603002",
    client: "Budmax Sp. z o.o.",
    destination: "ul. Przemysłowa 8, 00-450 Warszawa",
    isActive: true,
  },
  {
    value: "2603003",
    offerNumber: "Offer #2603003",
    client: "Anna Kowalczyk",
    destination: "ul. Słoneczna 3, 50-100 Wrocław",
    isActive: true,
  },
]

const activeOrders = AVAILABLE_ORDERS.filter((o) => o.isActive)

// h-9 px-3 text-sm md:text-sm — matches SelectTrigger size="lg" (overrides Input's md:text-xs/relaxed)
const inputLg = "h-9 px-3 text-sm md:text-sm"

export function ScheduleTransportDialog() {
  const { addShipment } = useShipments()
  const [open, setOpen] = useState(false)

  const emptyForm = {
    orderId: "",
    trackingId: "",
    carrier: "",
    status: "Pending" as ShipmentStatus,
  }
  const [form, setForm] = useState(emptyForm)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [orderError, setOrderError] = useState(false)
  const [carrierError, setCarrierError] = useState(false)
  const [waybillFile, setWaybillFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen)
    if (!isOpen) {
      setForm(emptyForm)
      setSelectedDate(new Date())
      setOrderError(false)
      setCarrierError(false)
      setWaybillFile(null)
    }
  }

  function handleSubmit() {
    let valid = true
    if (!form.orderId) { setOrderError(true); valid = false }
    if (!form.carrier) { setCarrierError(true); valid = false }
    if (!valid) return

    const order = AVAILABLE_ORDERS.find((o) => o.value === form.orderId)!
    const date = selectedDate
      ? selectedDate.toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)
    addShipment({
      client: order.client,
      destination: order.destination,
      carrier: form.carrier,
      date,
      status: form.status,
      offerNumber: order.offerNumber,
      trackingId: form.trackingId || undefined,
    })
    handleOpenChange(false)
  }

  // Format date for display in the trigger button (Polish locale)
  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" })
    : "Wybierz datę"

  return (
    <>
      <Button variant="default" size="lg" onClick={() => setOpen(true)}>
        <HugeiconsIcon icon={DeliveryTruck01Icon} data-icon="inline-start" />
        Zaplanuj transport
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Zaplanuj transport</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">

            {/* Order — required */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Zamówienie <span className="text-destructive">*</span>
              </label>
              <Select
                value={form.orderId}
                onValueChange={(v) => {
                  setForm((f) => ({ ...f, orderId: v }))
                  setOrderError(false)
                }}
              >
                <SelectTrigger
                  size="lg"
                  className="w-full"
                  aria-invalid={orderError ? true : undefined}
                >
                  <SelectValue placeholder="Wybierz zamówienie..." />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    {activeOrders.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.client} — {o.offerNumber}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {orderError && (
                <p className="text-[11px] text-destructive">Wybierz zamówienie.</p>
              )}
            </div>

            {/* Tracking number — optional */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Numer przesyłki
              </label>
              <Input
                className={inputLg}
                placeholder="np. 0123456789012"
                value={form.trackingId}
                onChange={(e) => setForm((f) => ({ ...f, trackingId: e.target.value }))}
              />
            </div>

            {/* Carrier — required */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Przewoźnik <span className="text-destructive">*</span>
              </label>
              <Select
                value={form.carrier}
                onValueChange={(v) => {
                  setForm((f) => ({ ...f, carrier: v }))
                  setCarrierError(false)
                }}
              >
                <SelectTrigger
                  size="lg"
                  className="w-full"
                  aria-invalid={carrierError ? true : undefined}
                >
                  <SelectValue placeholder="Wybierz przewoźnika..." />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    {CARRIERS.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {carrierError && (
                <p className="text-[11px] text-destructive">Wybierz przewoźnika.</p>
              )}
            </div>

            {/* Status + Date — side by side */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Status</label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm((f) => ({ ...f, status: v as ShipmentStatus }))}
                >
                  <SelectTrigger size="lg" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectGroup>
                      {STATUSES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Data nadania</label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-input/20 px-3 text-sm transition-colors",
                        "hover:bg-input/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <span className="truncate">{formattedDate}</span>
                      <HugeiconsIcon icon={Calendar01Icon} size={14} className="shrink-0 text-muted-foreground" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date)
                        setCalendarOpen(false)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Waybill upload — optional */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">List przewozowy</label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                onChange={(e) => setWaybillFile(e.target.files?.[0] ?? null)}
              />
              {waybillFile ? (
                <div className="flex items-center gap-3 rounded-md border border-input bg-input/20 px-3 py-2">
                  <HugeiconsIcon icon={File01Icon} size={15} className="shrink-0 text-muted-foreground" />
                  <span className="flex-1 truncate text-xs text-foreground">{waybillFile.name}</span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="shrink-0"
                    onClick={() => {
                      setWaybillFile(null)
                      if (fileInputRef.current) fileInputRef.current.value = ""
                    }}
                  >
                    <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} data-icon />
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-20 w-full flex-col items-center justify-center gap-1.5 rounded-md border border-dashed border-input text-muted-foreground transition-colors hover:border-ring hover:text-foreground"
                >
                  <HugeiconsIcon icon={Upload01Icon} size={18} />
                  <span className="text-xs font-medium">Kliknij, aby wgrać</span>
                  <span className="text-[11px]">PDF, PNG, JPG</span>
                </button>
              )}
            </div>

          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="lg">Anuluj</Button>
            </DialogClose>
            <Button variant="default" size="lg" onClick={handleSubmit}>
              <HugeiconsIcon icon={DeliveryTruck01Icon} data-icon="inline-start" />
              Zaplanuj
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
