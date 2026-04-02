"use client"

import { useState, useRef, useEffect } from "react"
import { PageSetup } from "@/components/PageSetup"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"
import {
  Package01Icon,
  Tag01Icon,
  Add01Icon,
  MoreHorizontalIcon,
  Delete01Icon,
  PencilEdit01Icon,
  Copy01Icon,
  GridViewIcon,
  ListViewIcon,
  Cancel01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  Upload01Icon,
  ShoppingCart01Icon,
  Search01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { useProducts, type Category, type Product, type ProductForm } from "@/components/ProductsContext"

const UNITS = ["szt.", "mb", "kg", "m²", "op.", "kpl.", "l"]

// ─── Helpers ───────────────────────────────────────────────────────────────────

const VAT = 1.23

function formatPrice(n: number): string {
  return n.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function round2(n: number) { return Math.round(n * 100) / 100 }

// Maps category.color (text class) to Badge bg/text/border classes
const colorBadgeClass: Record<string, string> = {
  "text-wirmet-orange": "bg-wirmet-orange/10 text-wirmet-orange border-wirmet-orange/20",
  "text-wirmet-blue":   "bg-wirmet-blue/10   text-wirmet-blue   border-wirmet-blue/20",
  "text-wirmet-green":  "bg-wirmet-green/10  text-wirmet-green  border-wirmet-green/20",
  "text-rose-400":      "bg-rose-400/10      text-rose-400      border-rose-400/20",
}

// Maps category.color to solid bg for color pickers
const colorBgClass: Record<string, string> = {
  "text-wirmet-orange": "bg-wirmet-orange",
  "text-wirmet-blue":   "bg-wirmet-blue",
  "text-wirmet-green":  "bg-wirmet-green",
  "text-rose-400":      "bg-rose-400",
}

const COLOR_OPTIONS = [
  { color: "text-wirmet-orange", label: "Pomarańczowy" },
  { color: "text-wirmet-blue",   label: "Niebieski"    },
  { color: "text-wirmet-green",  label: "Zielony"      },
  { color: "text-rose-400",      label: "Różowy"       },
]

// ─── StatCard ──────────────────────────────────────────────────────────────────

type Accent = "orange" | "green" | "blue"
const accentFrom: Record<Accent, string> = {
  orange: "from-wirmet-orange",
  green:  "from-wirmet-green",
  blue:   "from-wirmet-blue",
}
const accentText: Record<Accent, string> = {
  orange: "text-wirmet-orange",
  green:  "text-wirmet-green",
  blue:   "text-wirmet-blue",
}

function StatCard({ label, value, note, accent, icon }: {
  label: string; value: string; note: string; accent: Accent; icon: IconSvgElement
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className={cn("h-[2px] shrink-0 bg-gradient-to-r to-transparent", accentFrom[accent])} />
      <div className="flex flex-col gap-3 px-5 pb-5 pt-4">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
          <HugeiconsIcon icon={icon} size={14} className={accentText[accent]} />
        </div>
        <p className="text-4xl font-bold leading-none tabular-nums text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{note}</p>
      </div>
    </div>
  )
}

// ─── FilterDropdown (controlled, orange dot when active) ───────────────────────

function FilterDropdown({ label, options, value, onChange }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void
}) {
  const isActive = value !== options[0]
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm"
          className={cn("h-8 gap-1.5 text-xs font-medium transition-colors",
            isActive ? "border-wirmet-orange/40 bg-wirmet-orange/5 text-foreground" : "text-muted-foreground hover:text-foreground")}>
          {isActive && <span className="size-1.5 shrink-0 rounded-full bg-wirmet-orange" />}
          {isActive ? value : label}
          <HugeiconsIcon icon={ArrowDown01Icon} size={12} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52 border border-border">
        {options.map((opt) => (
          <DropdownMenuItem key={opt} onClick={() => onChange(opt)}
            className={cn("gap-2", opt === value && "font-medium")}>
            {opt === value && <span className="size-1.5 rounded-full bg-wirmet-orange shrink-0" />}
            {opt}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─── ViewToggle ────────────────────────────────────────────────────────────────

function ViewToggle({ view, setView }: { view: "grid" | "list"; setView: (v: "grid" | "list") => void }) {
  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-border p-0.5">
      {(["list", "grid"] as const).map((v) => (
        <button key={v} onClick={() => setView(v)}
          className={cn("rounded-md p-1.5 transition-colors",
            view === v ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")}>
          <HugeiconsIcon icon={v === "list" ? ListViewIcon : GridViewIcon} size={15} />
        </button>
      ))}
    </div>
  )
}

// ─── ItemMenu ─────────────────────────────────────────────────────────────────

function ItemMenu({ onEdit, onCopy, onDelete }: {
  onEdit: () => void; onCopy: () => void; onDelete: () => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted/40 hover:text-foreground group-hover:opacity-100"
        >
          <HugeiconsIcon icon={MoreHorizontalIcon} size={14} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 border border-border">
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit() }}>
          <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
          Edytuj
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onCopy() }}>
          <HugeiconsIcon icon={Copy01Icon} size={14} />
          Duplikuj
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={(e) => { e.stopPropagation(); onDelete() }}>
          <HugeiconsIcon icon={Delete01Icon} size={14} />
          Usuń
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─── Delete confirmation ───────────────────────────────────────────────────────

function DeleteConfirmDialog({ open, name, onConfirm, onCancel }: {
  open: boolean; name: string; onConfirm: () => void; onCancel: () => void
}) {
  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Usuń produkt</AlertDialogTitle>
          <AlertDialogDescription>
            Czy na pewno chcesz usunąć <span className="font-medium text-foreground">„{name}"</span>?
            Tej operacji nie można cofnąć.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Anuluj</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Usuń</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ─── Add category dialog ───────────────────────────────────────────────────────

function AddCategoryDialog({ open, onOpenChange, onConfirm }: {
  open: boolean; onOpenChange: (v: boolean) => void; onConfirm: (name: string, color: string) => void
}) {
  const [name, setName] = useState("")
  const [color, setColor] = useState("text-wirmet-orange")

  function handleSubmit() {
    const t = name.trim(); if (!t) return
    onConfirm(t, color); setName(""); setColor("text-wirmet-orange"); onOpenChange(false)
  }
  function handleClose(v: boolean) { if (!v) { setName(""); setColor("text-wirmet-orange") }; onOpenChange(v) }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>Nowa kategoria</DialogTitle>
          <DialogDescription>Podaj nazwę i wybierz kolor kategorii.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <Input placeholder="np. Chemia budowlana" value={name} onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()} autoFocus />
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-muted-foreground">Kolor</p>
            <div className="flex items-center gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button key={c.color} title={c.label} onClick={() => setColor(c.color)}
                  className={cn("size-7 rounded-full transition-all", colorBgClass[c.color],
                    color === c.color ? "ring-2 ring-offset-2 ring-offset-background ring-current scale-110" : "opacity-50 hover:opacity-80")}
                />
              ))}
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" size="lg" onClick={() => handleClose(false)}>Anuluj</Button>
          <Button variant="default" size="lg" onClick={handleSubmit} disabled={!name.trim()}>Utwórz</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Add / Edit product dialog ─────────────────────────────────────────────────

const emptyForm: ProductForm = {
  name: "", description: "", category: "", imageUrl: "",
  buyPrice: "", sellPriceNet: "", sellPriceGross: "", stock: "", unit: "szt.",
}

function productToForm(p: Product): ProductForm {
  return {
    name: p.name, description: p.description, category: p.category,
    imageUrl: p.imageUrl ?? "",
    buyPrice: String(p.buyPrice),
    sellPriceNet: String(p.sellPriceNet),
    sellPriceGross: String(p.sellPriceGross),
    stock: String(p.stock),
    unit: p.unit,
  }
}

function ProductDialog({
  open, onOpenChange, editProduct, categories, onConfirm, onAddCategory,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  editProduct: Product | null
  categories: Category[]
  onConfirm: (form: ProductForm) => void
  onAddCategory: () => void
}) {
  const isEdit = !!editProduct
  const [form, setForm] = useState<ProductForm>(emptyForm)
  const imgRef = useRef<HTMLInputElement>(null)

  // Sync form when dialog opens
  const lastOpen = useRef(false)
  if (open && !lastOpen.current) {
    const next = isEdit ? productToForm(editProduct) : emptyForm
    Promise.resolve().then(() => setForm(next))
    lastOpen.current = true
  }
  if (!open) lastOpen.current = false

  function set(key: keyof ProductForm, val: string) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  function handleNetChange(val: string) {
    const n = parseFloat(val)
    setForm((f) => ({
      ...f,
      sellPriceNet: val,
      sellPriceGross: isNaN(n) ? "" : String(round2(n * VAT)),
    }))
  }

  function handleGrossChange(val: string) {
    const n = parseFloat(val)
    setForm((f) => ({
      ...f,
      sellPriceGross: val,
      sellPriceNet: isNaN(n) ? "" : String(round2(n / VAT)),
    }))
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => set("imageUrl", ev.target?.result as string)
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  function handleSubmit() {
    if (!form.name.trim() || !form.category) return
    onConfirm(form)
    setForm(emptyForm)
    onOpenChange(false)
  }

  function handleClose(v: boolean) {
    if (!v) setForm(emptyForm)
    onOpenChange(v)
  }

  const canSubmit = form.name.trim() && form.category

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      {/*
        Large centered modal — w-[900px] h-[620px], two-column layout, no scroll.
        Using style prop to reliably override shadcn base classes (grid, gap, padding, max-w, border-radius).
      */}
      <DialogContent
        showCloseButton={false}
        className="overflow-hidden border border-border p-0 ring-0 shadow-2xl"
        style={{
          width: "min(900px, 95vw)",
          height: "min(640px, 95vh)",
          maxWidth: "none",
          display: "flex",
          gap: 0,
          padding: 0,
          borderRadius: "16px",
        }}
      >
        <DialogTitle className="sr-only">{isEdit ? "Edytuj produkt" : "Dodaj produkt"}</DialogTitle>
        <DialogDescription className="sr-only">Uzupełnij dane produktu.</DialogDescription>

        {/* ── LEFT PANEL: photo + categories ─────────────────────────────────── */}
        <div className="flex w-64 shrink-0 flex-col border-r border-border bg-card rounded-l-2xl overflow-hidden">

          {/* Photo upload */}
          <div className="flex flex-col gap-3 p-5 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Zdjęcie
            </p>
            <div
              onClick={() => !form.imageUrl && imgRef.current?.click()}
              className={cn(
                "relative flex-1 overflow-hidden rounded-xl border border-dashed border-border transition-colors",
                !form.imageUrl && "cursor-pointer hover:border-wirmet-orange/40 hover:bg-muted/10"
              )}
            >
              {form.imageUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.imageUrl} alt="Podgląd" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity hover:opacity-100">
                    <Button variant="outline" size="sm"
                      className="h-7 text-xs border-white/20 bg-black/40 text-white hover:bg-black/60"
                      onClick={(e) => { e.stopPropagation(); imgRef.current?.click() }}>
                      Zmień
                    </Button>
                    <Button variant="outline" size="sm"
                      className="h-7 text-xs border-white/20 bg-black/40 text-white hover:bg-black/60"
                      onClick={(e) => { e.stopPropagation(); set("imageUrl", "") }}>
                      Usuń
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-center p-4">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-muted/40">
                    <HugeiconsIcon icon={Upload01Icon} size={18} className="text-muted-foreground/40" />
                  </div>
                  <p className="text-[11px] text-muted-foreground/50 leading-relaxed">
                    Kliknij aby<br />dodać zdjęcie
                  </p>
                </div>
              )}
            </div>
            <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>

          {/* Category picker */}
          <div className="border-t border-border p-4">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Kategoria
              </p>
              {!form.category && (
                <span className="text-[10px] text-destructive">wymagana</span>
              )}
            </div>
            <div className="flex flex-col gap-0.5">
              {categories.map((cat) => (
                <button key={cat.id} onClick={() => set("category", cat.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors text-left",
                    form.category === cat.id
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  )}>
                  <span className={cn("size-1.5 shrink-0 rounded-full", colorBgClass[cat.color])} />
                  <span className="flex-1 truncate">{cat.name}</span>
                  {form.category === cat.id && (
                    <HugeiconsIcon icon={Tick02Icon} size={11} className="shrink-0 text-wirmet-orange" />
                  )}
                </button>
              ))}
              <button
                onClick={(e) => { e.preventDefault(); onAddCategory() }}
                className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] text-muted-foreground/40 hover:text-muted-foreground transition-colors mt-0.5"
              >
                <HugeiconsIcon icon={Add01Icon} size={12} />
                Dodaj kategorię
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL: form fields ────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col min-w-0 rounded-r-2xl overflow-hidden bg-background">

          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-border px-7 py-4">
            <div>
              <p className="font-[family-name:var(--font-display)] text-base font-semibold text-foreground">
                {isEdit ? "Edytuj produkt" : "Nowy produkt"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isEdit ? "Zaktualizuj dane istniejącego produktu." : "Uzupełnij dane nowego produktu."}
              </p>
            </div>
            <button
              onClick={() => handleClose(false)}
              className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={15} />
            </button>
          </div>

          {/* Form — all fields fit without scroll at 640px height */}
          <div className="flex flex-1 flex-col gap-5 px-7 py-5">

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Nazwa produktu <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="np. Balustrada stalowa prosta"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="h-9 text-sm"
                autoFocus
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Opis</label>
              <Textarea
                placeholder="Krótki opis — wymiary, materiał, właściwości..."
                rows={2}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                className="resize-none text-sm"
              />
            </div>

            {/* Prices */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-muted-foreground">Ceny</label>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] text-muted-foreground/60">Cena zakupu</span>
                  <div className="relative">
                    <Input type="number" min="0" step="0.01" placeholder="0,00"
                      value={form.buyPrice} onChange={(e) => set("buyPrice", e.target.value)}
                      className="h-9 pr-7 text-sm" />
                    <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">zł</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] text-muted-foreground/60">Sprzedaż netto</span>
                  <div className="relative">
                    <Input type="number" min="0" step="0.01" placeholder="0,00"
                      value={form.sellPriceNet} onChange={(e) => handleNetChange(e.target.value)}
                      className="h-9 pr-7 text-sm" />
                    <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">zł</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] text-muted-foreground/60">Sprzedaż brutto</span>
                  <div className="relative">
                    <Input type="number" min="0" step="0.01" placeholder="0,00"
                      value={form.sellPriceGross} onChange={(e) => handleGrossChange(e.target.value)}
                      className="h-9 pr-7 text-sm" />
                    <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">zł</span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground/40">
                VAT 23% przeliczany automatycznie między ceną netto a brutto.
              </p>
            </div>

            {/* Stock + Unit */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Ilość w magazynie</label>
                <Input type="number" min="0" placeholder="0"
                  value={form.stock} onChange={(e) => set("stock", e.target.value)}
                  className="h-9 text-sm" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Jednostka</label>
                <Select value={form.unit} onValueChange={(v) => set("unit", v)}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="flex shrink-0 items-center justify-end gap-2.5 border-t border-border px-7 py-4">
            <Button variant="outline" size="lg" onClick={() => handleClose(false)}>Anuluj</Button>
            <Button variant="default" size="lg" onClick={handleSubmit} disabled={!canSubmit}>
              <HugeiconsIcon icon={isEdit ? Tick02Icon : Add01Icon} data-icon="inline-start" />
              {isEdit ? "Zapisz zmiany" : "Dodaj produkt"}
            </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Stock stepper ─────────────────────────────────────────────────────────────
// Always-visible inline stepper: [−] [input] [+] [unit]
// Input looks like plain text when unfocused; highlights on focus.
// No hover tricks — always interactive, no layout shifts.

function StockStepper({ stock, unit, onCommit }: {
  stock: number
  unit: string
  onCommit: (next: number) => void
}) {
  const [draft, setDraft] = useState(String(stock))
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync when external stock prop changes (e.g. after ± button commit)
  useEffect(() => { setDraft(String(stock)) }, [stock])

  function commit() {
    const n = parseInt(draft, 10)
    if (!isNaN(n) && n >= 0) { onCommit(n) }
    else { setDraft(String(stock)) }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter")  { inputRef.current?.blur() }
    if (e.key === "Escape") { setDraft(String(stock)); inputRef.current?.blur() }
  }

  function step(delta: number, e: React.MouseEvent) {
    e.stopPropagation()
    onCommit(Math.max(0, stock + delta))
  }

  return (
    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
      {/* − */}
      <button
        onMouseDown={(e) => { e.preventDefault(); step(-1, e) }}
        className="flex size-5 shrink-0 items-center justify-center rounded text-sm text-muted-foreground/50 transition-colors hover:bg-muted hover:text-foreground"
      >−</button>

      {/* number input — looks like text, highlights on focus */}
      <input
        ref={inputRef}
        type="number"
        min="0"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onFocus={(e) => e.target.select()}
        onBlur={commit}
        onKeyDown={handleKey}
        className={cn(
          "w-10 bg-transparent text-center text-xs font-semibold tabular-nums text-foreground",
          "rounded border border-transparent transition-colors outline-none",
          "hover:border-border focus:border-wirmet-orange/50 focus:bg-wirmet-orange/5 focus:ring-1 focus:ring-wirmet-orange/20",
          // hide spinner arrows
          "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
        )}
      />

      {/* + */}
      <button
        onMouseDown={(e) => { e.preventDefault(); step(+1, e) }}
        className="flex size-5 shrink-0 items-center justify-center rounded text-sm text-muted-foreground/50 transition-colors hover:bg-muted hover:text-foreground"
      >+</button>

      <span className="text-[11px] text-muted-foreground">{unit}</span>
    </div>
  )
}

// ─── Product grid card ─────────────────────────────────────────────────────────

function ProductCard({ product, category, onEdit, onCopy, onDelete, onStockChange }: {
  product: Product; category: Category | undefined
  onEdit: () => void; onCopy: () => void; onDelete: () => void
  onStockChange: (id: string, stock: number) => void
}) {
  const badgeClass = category ? (colorBadgeClass[category.color] ?? "bg-zinc-500/10 text-muted-foreground border-zinc-500/20") : "bg-zinc-500/10 text-muted-foreground border-zinc-500/20"

  return (
    <div className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:bg-muted/10">
      {/* Image area */}
      <div className="relative h-36 w-full overflow-hidden bg-muted/20">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <HugeiconsIcon icon={Package01Icon} size={32} className="text-muted-foreground/15" />
          </div>
        )}
        <div className="absolute right-2 top-2">
          <ItemMenu onEdit={onEdit} onCopy={onCopy} onDelete={onDelete} />
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5 p-3.5">
        {category && (
          <Badge variant="outline" className={cn("self-start text-[10px]", badgeClass)}>
            {category.name}
          </Badge>
        )}
        <p className="text-sm font-semibold leading-tight text-foreground">{product.name}</p>
        <p className="line-clamp-2 text-xs text-muted-foreground">{product.description}</p>

        {/* Prices */}
        <div className="mt-1.5 flex items-end justify-between border-t border-border pt-2.5">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Zakup</p>
            <p className="text-xs font-semibold tabular-nums text-foreground">{formatPrice(product.buyPrice)} zł</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Netto</p>
            <p className="text-sm font-bold tabular-nums text-wirmet-green">{formatPrice(product.sellPriceNet)} zł</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <StockStepper
            stock={product.stock}
            unit={product.unit}
            onCommit={(next) => onStockChange(product.id, next)}
          />
          <p className="text-xs tabular-nums text-muted-foreground">brutto {formatPrice(product.sellPriceGross)} zł</p>
        </div>
      </div>
    </div>
  )
}

// ─── Product list row ──────────────────────────────────────────────────────────

function ProductRow({ product, category, onEdit, onCopy, onDelete, onStockChange }: {
  product: Product; category: Category | undefined
  onEdit: () => void; onCopy: () => void; onDelete: () => void
  onStockChange: (id: string, stock: number) => void
}) {
  const badgeClass = category ? (colorBadgeClass[category.color] ?? "bg-zinc-500/10 text-muted-foreground border-zinc-500/20") : "bg-zinc-500/10 text-muted-foreground border-zinc-500/20"

  return (
    <div className="group flex cursor-pointer items-center gap-4 px-5 py-3 transition-colors hover:bg-muted/20">
      {/* Thumbnail */}
      <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted/30">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <HugeiconsIcon icon={Package01Icon} size={16} className="text-muted-foreground/30" />
        )}
      </div>

      {/* Name + description */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
        <p className="truncate text-xs text-muted-foreground">{product.description}</p>
      </div>

      {/* Category */}
      {category && (
        <Badge variant="outline" className={cn("shrink-0 text-[10px]", badgeClass)}>{category.name}</Badge>
      )}

      {/* Stock — inline stepper */}
      <div className="w-32 shrink-0 flex justify-end">
        <StockStepper
          stock={product.stock}
          unit={product.unit}
          onCommit={(next) => onStockChange(product.id, next)}
        />
      </div>

      {/* Buy price */}
      <div className="w-24 shrink-0 text-right">
        <p className="text-[10px] text-muted-foreground">Zakup</p>
        <p className="text-xs font-medium tabular-nums text-foreground">{formatPrice(product.buyPrice)} zł</p>
      </div>

      {/* Net price */}
      <div className="w-24 shrink-0 text-right">
        <p className="text-[10px] text-muted-foreground">Netto</p>
        <p className="text-sm font-semibold tabular-nums text-wirmet-green">{formatPrice(product.sellPriceNet)} zł</p>
      </div>

      {/* Gross price */}
      <div className="w-24 shrink-0 text-right">
        <p className="text-[10px] text-muted-foreground">Brutto</p>
        <p className="text-xs tabular-nums text-muted-foreground">{formatPrice(product.sellPriceGross)} zł</p>
      </div>

      <ItemMenu onEdit={onEdit} onCopy={onCopy} onDelete={onDelete} />
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function InventoryPage() {
  const { products, categories, updateStock, saveProduct, duplicateProduct, deleteProduct, addCategory } = useProducts()

  // UI state
  const [view,           setView]           = useState<"grid" | "list">("grid")
  const [search,         setSearch]         = useState("")
  const [categoryFilter, setCategoryFilter] = useState("Wszystkie")
  const [sortDir,        setSortDir]        = useState<"asc" | "desc">("asc")

  // Dialogs
  const [productDialogOpen,  setProductDialogOpen]  = useState(false)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [editingProduct,     setEditingProduct]      = useState<Product | null>(null)
  const [deleteTarget,       setDeleteTarget]        = useState<{ id: string; name: string } | null>(null)

  // Derived stats
  const warehouseValue = products.reduce((s, p) => s + p.buyPrice * p.stock, 0)

  // Filtering + sorting
  const categoryFilterId = categoryFilter === "Wszystkie"
    ? null
    : categories.find((c) => c.name === categoryFilter)?.id ?? null

  const filtered = products
    .filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
      if (categoryFilterId && p.category !== categoryFilterId) return false
      return true
    })
    .sort((a, b) => sortDir === "asc"
      ? a.name.localeCompare(b.name, "pl")
      : b.name.localeCompare(a.name, "pl")
    )

  // Handlers
  function handleOpenAdd() { setEditingProduct(null); setProductDialogOpen(true) }
  function handleOpenEdit(p: Product) { setEditingProduct(p); setProductDialogOpen(true) }

  function handleConfirmProduct(form: ProductForm) {
    saveProduct(form, editingProduct?.id)
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return
    deleteProduct(deleteTarget.id)
    setDeleteTarget(null)
  }

  const categoryOptions = ["Wszystkie", ...categories.map((c) => c.name)]

  return (
    <>
      <PageSetup title="Spis towaru" icon={Package01Icon} />

      {/* Dialogs */}
      <ProductDialog
        open={productDialogOpen}
        onOpenChange={setProductDialogOpen}
        editProduct={editingProduct}
        categories={categories}
        onConfirm={handleConfirmProduct}
        onAddCategory={() => { setCategoryDialogOpen(true) }}
      />
      <AddCategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        onConfirm={addCategory}
      />
      <DeleteConfirmDialog
        open={!!deleteTarget}
        name={deleteTarget?.name ?? ""}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="flex flex-col gap-6 p-4 md:p-8">

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left: search + filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <HugeiconsIcon icon={Search01Icon} size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Szukaj produktu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 w-56 pl-8 text-xs"
              />
            </div>

            {/* Category filter */}
            <FilterDropdown
              label="Kategoria"
              options={categoryOptions}
              value={categoryFilter}
              onChange={setCategoryFilter}
            />

            {/* Sort */}
            <Button variant="outline" size="sm"
              className="h-8 gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setSortDir((d) => d === "asc" ? "desc" : "asc")}>
              <HugeiconsIcon icon={ArrowDown01Icon} size={12} />
              Nazwa
              <HugeiconsIcon icon={sortDir === "asc" ? ArrowUp01Icon : ArrowDown01Icon} size={11} />
            </Button>
          </div>

          {/* Right: view toggle + add */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setCategoryDialogOpen(true)}>
              <HugeiconsIcon icon={Tag01Icon} size={13} />
              Kategorie
            </Button>
            <ViewToggle view={view} setView={setView} />
            <Button variant="default" size="lg" onClick={handleOpenAdd}>
              <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
              Dodaj produkt
            </Button>
          </div>
        </div>

        {/* Product section */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          {/* Section header */}
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-foreground">
              Produkty
            </p>
            <p className="text-xs text-muted-foreground tabular-nums">
              {filtered.length} {filtered.length === 1 ? "produkt" : filtered.length < 5 ? "produkty" : "produktów"}
            </p>
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <HugeiconsIcon icon={Package01Icon} size={28} className="text-muted-foreground/20" />
              <p className="text-sm text-muted-foreground/50">
                {search || categoryFilter !== "Wszystkie" ? "Brak wyników dla wybranych filtrów" : "Brak produktów"}
              </p>
              {!search && categoryFilter === "Wszystkie" && (
                <Button variant="outline" size="lg" onClick={handleOpenAdd}>
                  <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
                  Dodaj pierwszy produkt
                </Button>
              )}
            </div>
          )}

          {/* Grid view */}
          {filtered.length > 0 && view === "grid" && (
            <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((p) => {
                const cat = categories.find((c) => c.id === p.category)
                return (
                  <ProductCard key={p.id} product={p} category={cat}
                    onEdit={() => handleOpenEdit(p)}
                    onCopy={() => duplicateProduct(p.id)}
                    onDelete={() => setDeleteTarget({ id: p.id, name: p.name })}
                    onStockChange={updateStock}
                  />
                )
              })}
            </div>
          )}

          {/* List view */}
          {filtered.length > 0 && view === "list" && (
            <div className="divide-y divide-border">
              {/* Column headers */}
              <div className="flex items-center gap-4 px-5 py-2">
                <div className="size-11 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Produkt</p>
                </div>
                <div className="w-28 shrink-0" /> {/* category badge */}
                <p className="w-32 shrink-0 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Stan magazynu</p>
                <p className="w-24 shrink-0 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Zakup</p>
                <p className="w-24 shrink-0 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Netto</p>
                <p className="w-24 shrink-0 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Brutto</p>
                <div className="w-7 shrink-0" />
              </div>
              {filtered.map((p) => {
                const cat = categories.find((c) => c.id === p.category)
                return (
                  <ProductRow key={p.id} product={p} category={cat}
                    onEdit={() => handleOpenEdit(p)}
                    onCopy={() => duplicateProduct(p.id)}
                    onDelete={() => setDeleteTarget({ id: p.id, name: p.name })}
                    onStockChange={updateStock}
                  />
                )
              })}
            </div>
          )}
        </div>

      </div>
    </>
  )
}
