"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { HugeiconsIcon } from "@hugeicons/react"
import { Tick02Icon, Add01Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"
import { useSuppliers, type Supplier } from "@/components/SuppliersContext"
import { SupplierTypesModal } from "@/components/SupplierTypesModal"

const inputLg = "h-9 px-3 text-sm md:text-sm"

interface Props {
  supplier: Supplier | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditSupplierDialog({ supplier, open, onOpenChange }: Props) {
  const { updateSupplier, supplierTypes } = useSuppliers()
  const [typesOpen, setTypesOpen] = useState(false)

  const [form, setForm] = useState({
    name: "", nip: "", address: "", contact: "", phone: "", email: "", typeId: "",
  })
  const [nameError, setNameError] = useState(false)
  const [typeError, setTypeError] = useState(false)

  // Sync form when supplier changes
  useEffect(() => {
    if (supplier) {
      setForm({
        name:    supplier.name,
        nip:     supplier.nip,
        address: supplier.address,
        contact: supplier.contact,
        phone:   supplier.phone,
        email:   supplier.email,
        typeId:  supplier.typeId,
      })
      setNameError(false)
      setTypeError(false)
    }
  }, [supplier])

  function set(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
    if (field === "name")   setNameError(false)
    if (field === "typeId") setTypeError(false)
  }

  function handleSubmit() {
    let valid = true
    if (!form.name.trim()) { setNameError(true); valid = false }
    if (!valid || !supplier) return

    updateSupplier(supplier.id, {
      name:    form.name.trim(),
      nip:     form.nip.trim(),
      address: form.address.trim(),
      contact: form.contact.trim(),
      phone:   form.phone.trim(),
      email:   form.email.trim(),
      typeId:  form.typeId,
    })
    onOpenChange(false)
    toast.success("Dane dostawcy zostały zaktualizowane.")
  }

  const selectedType = supplierTypes.find((t) => t.id === form.typeId)

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Edytuj dostawcę</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Nazwa firmy <span className="text-destructive">*</span>
            </label>
            <Input
              className={inputLg}
              placeholder="np. Budmat Sp. z o.o."
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              aria-invalid={nameError || undefined}
            />
            {nameError && <p className="text-[11px] text-destructive">Podaj nazwę firmy.</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">NIP</label>
              <Input
                className={inputLg + " font-mono"}
                placeholder="PL 0000000000"
                value={form.nip}
                onChange={(e) => set("nip", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Typ
              </label>
              {supplierTypes.length === 0 ? (
                <button
                  type="button"
                  onClick={() => setTypesOpen(true)}
                  className="flex h-9 w-full items-center gap-2 rounded-md border border-dashed border-input px-3 text-sm text-wirmet-orange transition-colors hover:border-wirmet-orange/50 hover:bg-wirmet-orange/5"
                >
                  <HugeiconsIcon icon={Add01Icon} size={13} />
                  Dodaj typ dostawcy…
                </button>
              ) : (
                <Select value={form.typeId} onValueChange={(v) => set("typeId", v)}>
                  <SelectTrigger size="lg" className="w-full" aria-invalid={typeError || undefined}>
                    <SelectValue placeholder="Wybierz…">
                      {selectedType && (
                        <span className="flex items-center gap-2">
                          <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: selectedType.color }} />
                          {selectedType.name}
                        </span>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent position="popper" sideOffset={4}>
                    {supplierTypes.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        <span className="flex items-center gap-2">
                          <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: t.color }} />
                          {t.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Adres</label>
            <Input
              className={inputLg}
              placeholder="np. ul. Fabryczna 12, Warszawa"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Osoba kontaktowa</label>
            <Input
              className={inputLg}
              placeholder="np. Jan Kowalski"
              value={form.contact}
              onChange={(e) => set("contact", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Telefon</label>
              <Input
                className={inputLg}
                type="tel"
                placeholder="+48 601 234 567"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">E-mail</label>
              <Input
                className={inputLg}
                type="email"
                placeholder="kontakt@firma.pl"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </div>
          </div>

        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="lg">Anuluj</Button>
          </DialogClose>
          <Button variant="default" size="lg" onClick={handleSubmit}>
            <HugeiconsIcon icon={Tick02Icon} data-icon="inline-start" />
            Zapisz zmiany
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <SupplierTypesModal open={typesOpen} onOpenChange={setTypesOpen} />
    </>
  )
}
