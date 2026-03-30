"use client"

import { useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { HugeiconsIcon } from "@hugeicons/react"
import { Add01Icon, Calendar01Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useCustomers } from "@/components/CustomersContext"
import { useOffers, type OfferStatus } from "@/components/OffersContext"

// ─── Options ──────────────────────────────────────────────────────────────────

const OFFER_STATUSES: { value: OfferStatus; label: string }[] = [
  { value: "Do wyceny",             label: "Do wyceny"             },
  { value: "Do wysłania",           label: "Do wysłania"           },
  { value: "Oczekuje na odpowiedź", label: "Oczekuje na odpowiedź" },
]

// Matches SelectTrigger size="lg"
const inputLg = "h-9 px-3 text-sm md:text-sm"

// ─── Component ────────────────────────────────────────────────────────────────

export function AddOfferDialog() {
  const { customers }  = useCustomers()
  const { addOffer }   = useOffers()

  const [open, setOpen]               = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)

  const emptyForm = {
    customerId:  "",
    address:     "",
    status:      "Do wyceny" as OfferStatus,
    validUntil:  undefined as Date | undefined,
    description: "",
  }
  const [form, setForm]     = useState(emptyForm)
  const [errors, setErrors] = useState({ customerId: false })

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen)
    if (!isOpen) {
      setForm(emptyForm)
      setErrors({ customerId: false })
      setCalendarOpen(false)
    }
  }

  function handleCustomerChange(id: string) {
    const c = customers.find((c) => c.id === id)
    setForm((f) => ({
      ...f,
      customerId: id,
      address: c?.address ?? f.address,
    }))
    setErrors((e) => ({ ...e, customerId: false }))
  }

  function handleSubmit() {
    if (!form.customerId) {
      setErrors({ customerId: true })
      return
    }

    const customer = customers.find((c) => c.id === form.customerId)!
    const validUntil = form.validUntil
      ? form.validUntil.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
      : "—"

    addOffer({
      company:     customer.company || customer.name,
      contact:     customer.contact,
      phone:       customer.phone,
      email:       customer.email,
      address:     form.address,
      status:      form.status,
      validUntil,
      description: form.description,
    })
    handleOpenChange(false)
    toast.success("Offer added.")
  }

  const formattedDate = form.validUntil
    ? form.validUntil.toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" })
    : "Pick a date"

  return (
    <>
      <Button variant="outline" size="lg" onClick={() => setOpen(true)}>
        <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
        New offer
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>New offer</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">

            {/* Client — required */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Client <span className="text-destructive">*</span>
              </label>
              <Select value={form.customerId} onValueChange={handleCustomerChange}>
                <SelectTrigger
                  size="lg"
                  className="w-full"
                  aria-invalid={errors.customerId ? true : undefined}
                >
                  <SelectValue placeholder="Select client..." />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    {customers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.company ? `${c.company} — ${c.name}` : c.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.customerId && (
                <p className="text-[11px] text-destructive">Select a client.</p>
              )}
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Address</label>
              <Input
                className={inputLg}
                placeholder="e.g. ul. Nowa 14, Warszawa"
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              />
            </div>

            {/* Status + Valid until */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Status</label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm((f) => ({ ...f, status: v as OfferStatus }))}
                >
                  <SelectTrigger size="lg" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectGroup>
                      {OFFER_STATUSES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Valid until</label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-input/20 px-3 text-sm transition-colors",
                        "hover:bg-input/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
                        !form.validUntil && "text-muted-foreground"
                      )}
                    >
                      <span className="truncate">{formattedDate}</span>
                      <HugeiconsIcon icon={Calendar01Icon} size={14} className="shrink-0 text-muted-foreground" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={form.validUntil}
                      onSelect={(date) => {
                        setForm((f) => ({ ...f, validUntil: date }))
                        setCalendarOpen(false)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Description</label>
              <Textarea
                className="min-h-[80px] resize-none text-sm"
                placeholder="Scope of work, notes..."
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>

          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="lg">Cancel</Button>
            </DialogClose>
            <Button variant="default" size="lg" onClick={handleSubmit}>
              <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
              Add offer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
