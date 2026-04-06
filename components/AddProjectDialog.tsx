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
import { HugeiconsIcon } from "@hugeicons/react"
import { Add01Icon, Calendar01Icon, Location01Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useCustomers } from "@/components/CustomersContext"
import { useProjects, type ProjectStatus } from "@/components/ProjectsContext"

// ─── Options ──────────────────────────────────────────────────────────────────

const WORK_TYPES = [
  { value: "Installation", label: "Installation" },
  { value: "Delivery",     label: "Delivery"     },
]

const PROJECT_STATUSES: { value: ProjectStatus; label: string }[] = [
  { value: "Zamówione", label: "Zamówione" },
  { value: "Opłacone",  label: "Opłacone"  },
]

// Matches SelectTrigger size="lg"
const inputLg = "h-9 px-3 text-sm md:text-sm"

// ─── Component ────────────────────────────────────────────────────────────────

export function AddProjectDialog() {
  const { customers }    = useCustomers()
  const { addProject }   = useProjects()

  const [open, setOpen]                 = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)

  const emptyForm = {
    customerId:       "",
    address:          "",       // installation address
    type:             "",
    status:           "Zamówione" as ProjectStatus,
    completionDate:   undefined as Date | undefined,
    offerNumber:      "",
  }
  const [form, setForm]     = useState(emptyForm)
  const [errors, setErrors] = useState({ customerId: false, type: false })

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen)
    if (!isOpen) {
      setForm(emptyForm)
      setErrors({ customerId: false, type: false })
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
    const newErrors = {
      customerId: !form.customerId,
      type:       !form.type,
    }
    setErrors(newErrors)
    if (newErrors.customerId || newErrors.type) return

    const customer = customers.find((c) => c.id === form.customerId)!
    const completionDate = form.completionDate
      ? form.completionDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
      : "—"

    addProject({
      client:         customer.name,
      companyName:    customer.company || customer.name,
      nip:            customer.nip || "—",
      companyAddress: customer.address,
      address:        form.address,
      type:           form.type,
      status:         form.status,
      completionDate,
      offerNumber:    form.offerNumber,
    })
    handleOpenChange(false)
    toast.success("Project added.")
  }

  const formattedDate = form.completionDate
    ? form.completionDate.toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" })
    : "Pick a date"

  return (
    <>
      <Button variant="outline" size="lg" onClick={() => setOpen(true)}>
        <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
        New project
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>New project</DialogTitle>
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

            {/* Installation address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Installation address</label>
              <div className="relative">
                <Input
                  className={cn(inputLg, "pr-8")}
                  placeholder="e.g. ul. Różana 12, Kraków"
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                />
                <HugeiconsIcon
                  icon={Location01Icon}
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
              </div>
            </div>

            {/* Work type + Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Work type <span className="text-destructive">*</span>
                </label>
                <Select
                  value={form.type}
                  onValueChange={(v) => {
                    setForm((f) => ({ ...f, type: v }))
                    setErrors((e) => ({ ...e, type: false }))
                  }}
                >
                  <SelectTrigger
                    size="lg"
                    className="w-full"
                    aria-invalid={errors.type ? true : undefined}
                  >
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectGroup>
                      {WORK_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-[11px] text-destructive">Select work type.</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Status</label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm((f) => ({ ...f, status: v as ProjectStatus }))}
                >
                  <SelectTrigger size="lg" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectGroup>
                      {PROJECT_STATUSES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Completion date + Offer number */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Completion date</label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-input/20 px-3 text-sm transition-colors",
                        "hover:bg-input/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
                        !form.completionDate && "text-muted-foreground"
                      )}
                    >
                      <span className="truncate">{formattedDate}</span>
                      <HugeiconsIcon icon={Calendar01Icon} size={14} className="shrink-0 text-muted-foreground" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={form.completionDate}
                      onSelect={(date) => {
                        setForm((f) => ({ ...f, completionDate: date }))
                        setCalendarOpen(false)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Offer number</label>
                <Input
                  className={inputLg}
                  placeholder="Auto-generated"
                  value={form.offerNumber}
                  onChange={(e) => setForm((f) => ({ ...f, offerNumber: e.target.value }))}
                />
              </div>
            </div>

          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="lg">Cancel</Button>
            </DialogClose>
            <Button variant="default" size="lg" onClick={handleSubmit}>
              <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
              Add project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
