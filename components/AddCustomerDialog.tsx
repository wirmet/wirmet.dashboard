"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { HugeiconsIcon } from "@hugeicons/react"
import { UserAdd01Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"
import { useCustomers } from "@/components/CustomersContext"

// Matches SelectTrigger size="lg" — h-9 px-3 text-sm, overrides Input's md:text-xs/relaxed
const inputLg = "h-9 px-3 text-sm md:text-sm"

export function AddCustomerDialog() {
  const { addCustomer } = useCustomers()
  const [open, setOpen] = useState(false)

  const emptyForm = {
    company: "",
    nip: "",
    address: "",
    contact: "",
    phone: "",
    email: "",
  }
  const [form, setForm] = useState(emptyForm)
  const [contactError, setContactError] = useState(false)

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen)
    if (!isOpen) {
      setForm(emptyForm)
      setContactError(false)
    }
  }

  function handleSubmit() {
    if (!form.contact.trim()) {
      setContactError(true)
      return
    }
    addCustomer({
      name: form.contact,      // name = display name, same as contact person
      company: form.company,
      nip: form.nip,
      address: form.address,
      contact: form.contact,
      phone: form.phone,
      email: form.email,
    })
    handleOpenChange(false)
    toast.success("Klient został dodany.")
  }

  return (
    <>
      <Button variant="default" size="lg" onClick={() => setOpen(true)}>
        <HugeiconsIcon icon={UserAdd01Icon} data-icon="inline-start" />
        Dodaj klienta
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Dodaj klienta</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">

            {/* Company + NIP */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Nazwa firmy</label>
                <Input
                  className={inputLg}
                  placeholder="np. MW Budownictwo"
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">NIP</label>
                <Input
                  className={inputLg}
                  placeholder="np. PL 7811234567"
                  value={form.nip}
                  onChange={(e) => setForm((f) => ({ ...f, nip: e.target.value }))}
                />
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Adres</label>
              <Input
                className={inputLg}
                placeholder="np. ul. Nowa 14, Warszawa"
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              />
            </div>

            {/* Contact person — required */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Osoba kontaktowa <span className="text-destructive">*</span>
              </label>
              <Input
                className={inputLg}
                placeholder="np. Marek Wiśniewski"
                value={form.contact}
                onChange={(e) => {
                  setForm((f) => ({ ...f, contact: e.target.value }))
                  setContactError(false)
                }}
                aria-invalid={contactError ? true : undefined}
              />
              {contactError && (
                <p className="text-[11px] text-destructive">Podaj osobę kontaktową.</p>
              )}
            </div>

            {/* Phone + Email */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Telefon</label>
                <Input
                  className={inputLg}
                  type="tel"
                  placeholder="+48 601 234 567"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">E-mail</label>
                <Input
                  className={inputLg}
                  type="email"
                  placeholder="kontakt@firma.pl"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
            </div>

          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="lg">Anuluj</Button>
            </DialogClose>
            <Button variant="default" size="lg" onClick={handleSubmit}>
              <HugeiconsIcon icon={UserAdd01Icon} data-icon="inline-start" />
              Dodaj klienta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
