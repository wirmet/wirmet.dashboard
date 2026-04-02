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
import { Add01Icon, Calendar01Icon, Upload01Icon, Cancel01Icon, File01Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useCustomers } from "@/components/CustomersContext"
import { useOffers, type OfferStatus } from "@/components/OffersContext"

// ─── Options ──────────────────────────────────────────────────────────────────

const OFFER_STATUSES: { value: OfferStatus; label: string }[] = [
  { value: "Do wyceny",             label: "Do wyceny"             },
  { value: "Do wysłania",           label: "Do wysłania"           },
  { value: "Wysłana",               label: "Wysłana"               },
  { value: "Oczekuje na odpowiedź", label: "Oczekuje na odpowiedź" },
  { value: "Follow-up",             label: "Follow-up"             },
  { value: "Odrzucona",             label: "Odrzucona"             },
]

// Matches SelectTrigger size="lg"
const inputLg = "h-9 px-3 text-sm md:text-sm"

// ─── Component ────────────────────────────────────────────────────────────────

export function AddOfferDialog() {
  const { customers }                   = useCustomers()
  const { addOffer, previewNextNumber } = useOffers()

  const [open, setOpen]               = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)

  const emptyForm = {
    customerId:      "",
    offerNumber:     "",
    status:          "Do wyceny" as OfferStatus,
    validUntil:      undefined as Date | undefined,
    description:     "",
    attachmentName:  undefined as string | undefined,
    attachmentData:  undefined as string | undefined,
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
    setForm((f) => ({ ...f, customerId: id }))
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
      company:        customer.company || customer.name,
      contact:        customer.contact,
      phone:          customer.phone,
      email:          customer.email,
      address:        customer.address ?? "",
      status:         form.status,
      validUntil,
      description:    form.description,
      attachmentName: form.attachmentName,
      attachmentData: form.attachmentData,
    }, form.offerNumber || undefined)
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
        Nowa oferta
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Nowa oferta</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">

            {/* Client — required */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Klient <span className="text-destructive">*</span>
              </label>
              <Select value={form.customerId} onValueChange={handleCustomerChange}>
                <SelectTrigger
                  size="lg"
                  className="w-full"
                  aria-invalid={errors.customerId ? true : undefined}
                >
                  <SelectValue placeholder="Wybierz klienta..." />
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
                <p className="text-[11px] text-destructive">Wybierz klienta.</p>
              )}
            </div>

            {/* Offer number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Numer oferty</label>
              <div className="flex gap-2">
                <Input
                  className={cn(inputLg, "flex-1")}
                  placeholder={`np. ${previewNextNumber()}`}
                  value={form.offerNumber}
                  onChange={(e) => setForm((f) => ({ ...f, offerNumber: e.target.value }))}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="shrink-0"
                  onClick={() => setForm((f) => ({ ...f, offerNumber: previewNextNumber() }))}
                >
                  Generuj
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Zostaw puste — numer zostanie wygenerowany automatycznie.
              </p>
            </div>

            {/* Status + Valid until */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Status oferty</label>
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
                <label className="text-xs font-medium text-muted-foreground">Ważna do</label>
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
                      <span className="truncate">{form.validUntil ? form.validUntil.toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" }) : "Wybierz datę"}</span>
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

            {/* Attachment */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Załącznik</label>
              {form.attachmentName ? (
                // Preview of chosen file
                <div className="flex items-center gap-2 rounded-md border border-input bg-input/20 px-3 py-2">
                  <HugeiconsIcon icon={File01Icon} size={14} className="shrink-0 text-wirmet-blue" />
                  <span className="flex-1 truncate text-sm text-foreground">{form.attachmentName}</span>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, attachmentName: undefined, attachmentData: undefined }))}
                    className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={14} />
                  </button>
                </div>
              ) : (
                // Drop zone / file input trigger
                <label className="flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-input bg-input/10 px-3 text-sm text-muted-foreground transition-colors hover:bg-input/20 hover:text-foreground">
                  <HugeiconsIcon icon={Upload01Icon} size={14} className="shrink-0" />
                  <span>Wybierz plik z komputera</span>
                  <input
                    type="file"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const reader = new FileReader()
                      reader.onload = () => {
                        setForm((f) => ({
                          ...f,
                          attachmentName: file.name,
                          attachmentData: reader.result as string,
                        }))
                      }
                      reader.readAsDataURL(file)
                      // Reset input so the same file can be re-selected if user clears and re-picks
                      e.target.value = ""
                    }}
                  />
                </label>
              )}
              <p className="text-[11px] text-muted-foreground">PDF, DOCX, XLSX, JPG — maks. 10 MB</p>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Opis</label>
              <Textarea
                className="min-h-[80px] resize-none text-sm"
                placeholder="Zakres prac, uwagi..."
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>

          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="lg">Anuluj</Button>
            </DialogClose>
            <Button variant="default" size="lg" onClick={handleSubmit}>
              <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
              Dodaj ofertę
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
