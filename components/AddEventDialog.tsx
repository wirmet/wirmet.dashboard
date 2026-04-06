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
  Settings01Icon,
  UserAdd01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useCustomers } from "@/components/CustomersContext"
import { useEvents, type EventType } from "@/components/EventsContext"
import { useTeamMembers } from "@/components/TeamMembersContext"
import { useCategories } from "@/components/CategoriesContext"

// ─── Options ──────────────────────────────────────────────────────────────────

const EVENT_STATUSES = [
  { value: "zaplanowane", label: "Zaplanowane" },
  { value: "w_trakcie",   label: "W trakcie"   },
  { value: "zakonczone",  label: "Zakończone"  },
  { value: "anulowane",   label: "Anulowane"   },
] as const

// Color palette available when creating custom categories
const COLOR_OPTIONS = [
  { name: "rose",   bg: "bg-rose-400",   color: "bg-rose-500/15 text-rose-400 border-rose-500/25",     dot: "bg-rose-400"   },
  { name: "orange", bg: "bg-orange-400", color: "bg-orange-500/15 text-orange-400 border-orange-500/25", dot: "bg-orange-400" },
  { name: "teal",   bg: "bg-teal-400",   color: "bg-teal-500/15 text-teal-400 border-teal-500/25",     dot: "bg-teal-400"   },
  { name: "indigo", bg: "bg-indigo-400", color: "bg-indigo-500/15 text-indigo-400 border-indigo-500/25", dot: "bg-indigo-400" },
  { name: "pink",   bg: "bg-pink-400",   color: "bg-pink-500/15 text-pink-400 border-pink-500/25",     dot: "bg-pink-400"   },
  { name: "lime",   bg: "bg-lime-400",   color: "bg-lime-500/15 text-lime-400 border-lime-500/25",     dot: "bg-lime-400"   },
]

// Seed category values that cannot be deleted
const SEED_CATEGORIES = ["spotkanie", "montaz", "wizja lokalna", "przeglad"]

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
  const { customers }            = useCustomers()
  const { addEvent }             = useEvents()
  const { members, addMember, removeMember } = useTeamMembers()
  const { categories, addCategory, removeCategory } = useCategories()

  const [open, setOpen] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)

  // Category management panel state
  const [managingCategories, setManagingCategories] = useState(false)
  const [newCatLabel, setNewCatLabel] = useState("")
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0])

  // Team member management panel state
  const [managingMembers, setManagingMembers] = useState(false)
  const [newMemberName, setNewMemberName] = useState("")

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
      setManagingCategories(false)
      setManagingMembers(false)
      setNewCatLabel("")
      setNewMemberName("")
      setSelectedColor(COLOR_OPTIONS[0])
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

  function handleAddCategory() {
    const label = newCatLabel.trim()
    if (!label) return
    // Use a slug-like value derived from the label
    const value = label.toLowerCase().replace(/\s+/g, "_")
    addCategory({ value, label, color: selectedColor.color, dot: selectedColor.dot })
    setNewCatLabel("")
  }

  function handleAddMember() {
    const name = newMemberName.trim()
    if (!name) return
    addMember(name)
    setNewMemberName("")
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
      address:      form.address.trim() || undefined,
      assignee:     form.assignee || undefined,
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
        Dodaj wydarzenie
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
                Nazwa wydarzenia <span className="text-destructive">*</span>
              </label>
              <Input
                className={inputLg}
                placeholder="np. Inspekcja fundamentów"
                value={form.title}
                onChange={(e) => {
                  setForm((f) => ({ ...f, title: e.target.value }))
                  setErrors((er) => ({ ...er, title: false }))
                }}
                aria-invalid={errors.title ? true : undefined}
              />
              {errors.title && (
                <p className="text-[11px] text-destructive">Podaj nazwę wydarzenia.</p>
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
                {/* Label row with manage toggle */}
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-muted-foreground">
                    Kategoria <span className="text-destructive">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setManagingCategories(v => !v)}
                    className={cn(
                      "flex items-center gap-1 text-[10px] text-muted-foreground transition-colors hover:text-foreground",
                      managingCategories && "text-foreground"
                    )}
                  >
                    <HugeiconsIcon icon={Settings01Icon} size={11} />
                    Zarządzaj
                  </button>
                </div>

                {/* Inline category management panel */}
                {managingCategories && (
                  <div className="rounded-lg border border-border bg-muted/30 p-3 flex flex-col gap-2">
                    {/* Existing categories list */}
                    <div className="flex flex-col gap-1">
                      {categories.map(cat => (
                        <div key={cat.value} className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted/40">
                          <div className={cn("size-2 rounded-full shrink-0", cat.dot)} />
                          <span className="flex-1 text-xs text-foreground">{cat.label}</span>
                          {/* Seed categories cannot be removed */}
                          {!SEED_CATEGORIES.includes(cat.value) && (
                            <button
                              type="button"
                              onClick={() => removeCategory(cat.value)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <HugeiconsIcon icon={Cancel01Icon} size={12} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {/* Add new category form */}
                    <div className="border-t border-border pt-2 flex flex-col gap-2">
                      <Input
                        placeholder="Nazwa kategorii"
                        value={newCatLabel}
                        onChange={(e) => setNewCatLabel(e.target.value)}
                        className="h-7 text-xs px-2"
                      />
                      {/* Color picker */}
                      <div className="flex gap-1.5">
                        {COLOR_OPTIONS.map(opt => (
                          <button
                            key={opt.name}
                            type="button"
                            onClick={() => setSelectedColor(opt)}
                            className={cn(
                              "size-5 rounded-full transition-transform hover:scale-110",
                              opt.bg,
                              selectedColor.name === opt.name && "ring-2 ring-offset-1 ring-foreground/30"
                            )}
                          />
                        ))}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        type="button"
                        onClick={handleAddCategory}
                        className="h-7 text-xs"
                      >
                        Dodaj
                      </Button>
                    </div>
                  </div>
                )}

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
                      {categories.map((t) => (
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
              {/* Label row with manage toggle */}
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground">Kto jedzie</label>
                <button
                  type="button"
                  onClick={() => setManagingMembers(v => !v)}
                  className={cn(
                    "flex items-center gap-1 text-[10px] text-muted-foreground transition-colors hover:text-foreground",
                    managingMembers && "text-foreground"
                  )}
                >
                  <HugeiconsIcon icon={UserAdd01Icon} size={11} />
                  Zarządzaj
                </button>
              </div>

              {/* Inline member management panel */}
              {managingMembers && (
                <div className="rounded-lg border border-border bg-muted/30 p-3 flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    {members.map(m => (
                      <div key={m} className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted/40">
                        <span className="flex-1 text-xs text-foreground">{m}</span>
                        <button
                          type="button"
                          onClick={() => removeMember(m)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <HugeiconsIcon icon={Cancel01Icon} size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border pt-2 flex gap-2">
                    <Input
                      placeholder="Imię i nazwisko"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      className="h-7 text-xs px-2 flex-1"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      type="button"
                      onClick={handleAddMember}
                      className="h-7 text-xs px-2"
                    >
                      Dodaj
                    </Button>
                  </div>
                </div>
              )}

              <Select
                value={form.assignee}
                onValueChange={(v) => setForm((f) => ({ ...f, assignee: v }))}
              >
                <SelectTrigger size="lg" className="w-full">
                  <SelectValue placeholder="Wybierz pracownika..." />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    {members.map((m) => (
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
