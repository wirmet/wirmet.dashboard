"use client"

import { useState, useRef, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Delete01Icon,
  Add01Icon,
  Tick02Icon,
  Tag01Icon,
} from "@hugeicons/core-free-icons"
import { toast } from "sonner"
import { useSuppliers, SUPPLIER_TYPE_COLORS, type SupplierTypeRecord } from "@/components/SuppliersContext"
import { cn } from "@/lib/utils"

// ─── Color swatch picker (popover) ─────────────────────────────────────────────

function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="size-6 shrink-0 rounded-full border-2 border-white/20 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-wirmet-orange"
          style={{ backgroundColor: value }}
          aria-label="Zmień kolor"
        />
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-2"
        align="start"
        side="bottom"
        style={{
          "--popover": "oklch(0.19 0.003 80)",
          "--popover-foreground": "oklch(0.95 0 0)",
          "--border": "oklch(0.28 0 0)",
        } as React.CSSProperties}
      >
        <div className="grid grid-cols-6 gap-1.5">
          {SUPPLIER_TYPE_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              className={cn(
                "size-6 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none",
                value === color ? "border-white/80 scale-110" : "border-transparent",
              )}
              style={{ backgroundColor: color }}
              aria-label={color}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

// ─── Single editable type row ───────────────────────────────────────────────────

function TypeRow({
  type,
  usedCount,
  onUpdate,
  onDelete,
}: {
  type: SupplierTypeRecord
  usedCount: number
  onUpdate: (name: string, color: string) => void
  onDelete: () => void
}) {
  const [name,    setName]    = useState(type.name)
  const [color,   setColor]   = useState(type.color)
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync external prop changes (e.g. after optimistic updates)
  useEffect(() => { setName(type.name);  }, [type.name])
  useEffect(() => { setColor(type.color) }, [type.color])

  function commitName() {
    const trimmed = name.trim()
    if (!trimmed) { setName(type.name); setEditing(false); return }
    if (trimmed !== type.name) onUpdate(trimmed, color)
    setEditing(false)
  }

  function handleColorChange(c: string) {
    setColor(c)
    onUpdate(name.trim() || type.name, c)
  }

  return (
    <div className="group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/20">
      {/* Color swatch */}
      <ColorPicker value={color} onChange={handleColorChange} />

      {/* Name — inline editable */}
      {editing ? (
        <input
          ref={inputRef}
          className="flex-1 bg-transparent text-sm text-foreground outline-none border-b border-wirmet-orange/50 pb-px focus:border-wirmet-orange"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={commitName}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitName()
            if (e.key === "Escape") { setName(type.name); setEditing(false) }
          }}
          autoFocus
          maxLength={32}
        />
      ) : (
        <button
          type="button"
          className="flex-1 text-left text-sm text-foreground hover:text-wirmet-orange transition-colors"
          onClick={() => { setEditing(true); setTimeout(() => inputRef.current?.select(), 0) }}
          title="Kliknij, żeby zmienić nazwę"
        >
          {name}
        </button>
      )}

      {/* Usage count — informational only */}
      {usedCount > 0 && (
        <span className="shrink-0 text-[11px] text-muted-foreground/60">
          {usedCount} {usedCount === 1 ? "dostawca" : "dostawców"}
        </span>
      )}

      {/* Delete — always enabled, clears typeId on affected suppliers */}
      <button
        type="button"
        onClick={onDelete}
        title="Usuń typ"
        className="shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
      >
        <HugeiconsIcon icon={Delete01Icon} size={14} />
      </button>
    </div>
  )
}

// ─── New type form ──────────────────────────────────────────────────────────────

function NewTypeRow({ onAdd }: { onAdd: (name: string, color: string) => void }) {
  const [name,  setName]  = useState("")
  const [color, setColor] = useState<string>(SUPPLIER_TYPE_COLORS[0])

  function handleAdd() {
    if (!name.trim()) return
    onAdd(name.trim(), color)
    setName("")
    setColor(SUPPLIER_TYPE_COLORS[0])
  }

  return (
    <div className="flex items-center gap-3 border-t border-border bg-muted/10 px-5 py-3">
      <ColorPicker value={color} onChange={setColor} />
      <Input
        className="h-8 flex-1 text-sm"
        placeholder="Nazwa nowego typu…"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") handleAdd() }}
        maxLength={32}
      />
      <Button
        size="sm"
        variant="default"
        onClick={handleAdd}
        disabled={!name.trim()}
        className="shrink-0 h-8 px-3"
      >
        <HugeiconsIcon icon={Add01Icon} size={14} />
        Dodaj
      </Button>
    </div>
  )
}

// ─── Modal ─────────────────────────────────────────────────────────────────────

export function SupplierTypesModal({ open, onOpenChange }: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { supplierTypes, suppliers, addSupplierType, updateSupplierType, deleteSupplierType } = useSuppliers()

  // Count how many suppliers use each type
  const usageCount = (typeId: string) => suppliers.filter((s) => s.typeId === typeId).length

  function handleUpdate(id: string, name: string, color: string) {
    updateSupplierType(id, name, color)
  }

  function handleDelete(type: SupplierTypeRecord) {
    deleteSupplierType(type.id)
    toast.success(`Usunięto typ: ${type.name}`)
  }

  function handleAdd(name: string, color: string) {
    addSupplierType(name, color)
    toast.success(`Dodano typ: ${name}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm p-0 gap-0 overflow-hidden" showCloseButton={false}>

        {/* 2px accent bar — orange, matches the Wirmet section card pattern */}
        <div className="h-[2px] shrink-0 bg-gradient-to-r from-wirmet-orange to-transparent" />

        <DialogHeader className="flex-row items-center gap-3 border-b border-border px-5 py-4">
          <div className="flex size-8 items-center justify-center rounded-lg bg-wirmet-orange/10">
            <HugeiconsIcon icon={Tag01Icon} size={14} className="text-wirmet-orange" />
          </div>
          <DialogTitle className="font-[family-name:var(--font-display)] text-sm font-semibold">
            Typy dostawców
          </DialogTitle>
        </DialogHeader>

        {/* Type list */}
        <div className="flex flex-col divide-y divide-border max-h-72 overflow-y-auto">
          {supplierTypes.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-muted-foreground">
              Brak typów. Dodaj pierwszy poniżej.
            </p>
          ) : (
            supplierTypes.map((type) => (
              <TypeRow
                key={type.id}
                type={type}
                usedCount={usageCount(type.id)}
                onUpdate={(name, color) => handleUpdate(type.id, name, color)}
                onDelete={() => handleDelete(type)}
              />
            ))
          )}
        </div>

        {/* Add new type */}
        <NewTypeRow onAdd={handleAdd} />

        <DialogFooter className="border-t border-border px-5 py-3">
          <p className="flex-1 text-[11px] text-muted-foreground/60">
            Kliknij nazwę, żeby ją zmienić.
          </p>
          <DialogClose asChild>
            <Button variant="outline" size="sm" className="h-8">
              <HugeiconsIcon icon={Tick02Icon} size={13} data-icon="inline-start" />
              Gotowe
            </Button>
          </DialogClose>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}
