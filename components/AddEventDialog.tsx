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
import {
  CalendarAdd01Icon,
  Calendar01Icon,
  Location01Icon,
} from "@hugeicons/core-free-icons"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useCustomers } from "@/components/CustomersContext"
import { useEvents, type EventType } from "@/components/EventsContext"

// ─── Options ──────────────────────────────────────────────────────────────────

const EVENT_TYPES = [
  { value: "spotkanie",      label: "Spotkanie"      },
  { value: "montaz",         label: "Montaż"         },
  { value: "wizja lokalna",  label: "Wizja lokalna"  },
  { value: "przeglad",       label: "Przegląd"       },
] as const

const EVENT_STATUSES = [
  { value: "zaplanowane", label: "Zaplanowane" },
  { value: "w_trakcie",   label: "W trakcie"   },
  { value: "zakonczone",  label: "Zakończone"  },
  { value: "anulowane",   label: "Anulowane"   },
] as const

const TEAM_MEMBERS = [
  "Adam Wiśniewski",
  "Piotr Kowalski",
  "Marek Jabłoński",
  "Tomasz Nowak",
  "Rafał Zając",
]

// Matches SelectTrigger size="lg"
const inputLg = "h-9 px-3 text-sm md:text-sm"

// ─── Component ────────────────────────────────────────────────────────────────

// Converts "HH:MM" (from <input type="time">) → "9:00am" format used by the calendar
function convertTime(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(":")
  const h = parseInt(hStr, 10)
  const m = parseInt(mStr, 10)
  const suffix = h < 12 ? "am" : "pm"
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${hour12}:${String(m).padStart(2, "0")}${suffix}`
}

function dateToISO(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

export function AddEventDialog() {
  const { customers } = useCustomers()
  const { addEvent }  = useEvents()

  const [open, setOpen] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)

  const emptyForm = {
    title:      "",
    customerId: "",
    address:    "",
    date:       new Date() as Date | undefined,
    time:       "09:00",
    type:       "",
    status:     "zaplanowane",
    assignee:   "",
  }
  const [form, setForm] = useState(emptyForm)

  // Validation errors
  const [errors, setErrors] = useState({ title: false, customerId: false, type: false })

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen)
    if (!isOpen) {
      setForm(emptyForm)
      setErrors({ title: false, customerId: false, type: false })
      setCalendarOpen(false)
    }
  }

  function handleCustomerChange(id: string) {
    const customer = customers.find((c) => c.id === id)
    setForm((f) => ({
      ...f,
      customerId: id,
      // Auto-fill address from customer record, user can still edit it
      address: customer?.address ?? f.address,
    }))
    setErrors((e) => ({ ...e, customerId: false }))
  }

  function handleSubmit() {
    const newErrors = {
      title:      !form.title.trim(),
      customerId: !form.customerId,
      type:       !form.type,
    }
    setErrors(newErrors)
    if (newErrors.title || newErrors.customerId || newErrors.type) return

    const customer = customers.find((c) => c.id === form.customerId)
    addEvent({
      title:        form.title.trim(),
      date:         form.date ? dateToISO(form.date) : dateToISO(new Date()),
      time:         convertTime(form.time),
      duration:     60,
      type:         form.type as EventType,
      customerName: customer?.name,
    })
    handleOpenChange(false)
    toast.success("Wydarzenie zostało dodane.")
  }

  const formattedDate = form.date
    ? form.date.toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" })
    : "Wybierz datę"

  return (
    <>
      <Button variant="default" size="lg" onClick={() => setOpen(true)}>
        <HugeiconsIcon icon={CalendarAdd01Icon} data-icon="inline-start" />
        Add event
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Dodaj wydarzenie</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">

            {/* Nazwa wydarzenia — required */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Event name <span className="text-destructive">*</span>
              </label>
              <Input
                className={inputLg}
                placeholder="e.g. Foundation inspection"
                value={form.title}
                onChange={(e) => {
                  setForm((f) => ({ ...f, title: e.target.value }))
                  setErrors((er) => ({ ...er, title: false }))
                }}
                aria-invalid={errors.title ? true : undefined}
              />
              {errors.title && (
                <p className="text-[11px] text-destructive">Enter an event name.</p>
              )}
            </div>

            {/* Klient — required */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Klient <span className="text-destructive">*</span>
              </label>
              <Select
                value={form.customerId}
                onValueChange={handleCustomerChange}
              >
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
                        {c.name}{c.company ? ` — ${c.company}` : ""}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.customerId && (
                <p className="text-[11px] text-destructive">Wybierz klienta.</p>
              )}
            </div>

            {/* Adres */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Adres
              </label>
              <div className="relative">
                <Input
                  className={cn(inputLg, "pr-8")}
                  placeholder="np. ul. Nowa 14, Warszawa"
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

            {/* Data + Godzina */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Data</label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-input/20 px-3 text-sm transition-colors",
                        "hover:bg-input/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
                        !form.date && "text-muted-foreground"
                      )}
                    >
                      <span className="truncate">{formattedDate}</span>
                      <HugeiconsIcon icon={Calendar01Icon} size={14} className="shrink-0 text-muted-foreground" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={form.date}
                      onSelect={(date) => {
                        setForm((f) => ({ ...f, date }))
                        setCalendarOpen(false)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Godzina</label>
                <Input
                  type="time"
                  className={inputLg}
                  value={form.time}
                  onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                />
              </div>
            </div>

            {/* Kategoria + Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Kategoria <span className="text-destructive">*</span>
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
                    <SelectValue placeholder="Wybierz..." />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectGroup>
                      {EVENT_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-[11px] text-destructive">Wybierz kategorię.</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Status</label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}
                >
                  <SelectTrigger size="lg" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectGroup>
                      {EVENT_STATUSES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Kto jedzie */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Kto jedzie</label>
              <Select
                value={form.assignee}
                onValueChange={(v) => setForm((f) => ({ ...f, assignee: v }))}
              >
                <SelectTrigger size="lg" className="w-full">
                  <SelectValue placeholder="Wybierz pracownika..." />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    {TEAM_MEMBERS.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="lg">Anuluj</Button>
            </DialogClose>
            <Button variant="default" size="lg" onClick={handleSubmit}>
              <HugeiconsIcon icon={CalendarAdd01Icon} data-icon="inline-start" />
              Dodaj
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
