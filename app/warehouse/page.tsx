"use client"

import { useState, useRef, useEffect } from "react"
import { PageSetup } from "@/components/PageSetup"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"
import {
  WarehouseIcon,
  Package01Icon,
  Tag01Icon,
  SortByDown01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { useProducts, type Category, type Product } from "@/components/ProductsContext"

// Dot color for warehouse categories (derived from text color class)
const dotClass: Record<string, string> = {
  "text-wirmet-orange": "bg-wirmet-orange",
  "text-wirmet-blue":   "bg-wirmet-blue",
  "text-wirmet-green":  "bg-wirmet-green",
  "text-rose-400":      "bg-rose-400",
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatPrice(n: number): string {
  return n.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatQty(n: number): string {
  return n.toLocaleString("pl-PL")
}

const colorBadgeClass: Record<string, string> = {
  "text-wirmet-orange": "bg-wirmet-orange/10 text-wirmet-orange border-wirmet-orange/20",
  "text-wirmet-blue":   "bg-wirmet-blue/10   text-wirmet-blue   border-wirmet-blue/20",
  "text-wirmet-green":  "bg-wirmet-green/10  text-wirmet-green  border-wirmet-green/20",
  "text-rose-400":      "bg-rose-400/10      text-rose-400      border-rose-400/20",
}

// ─── Stat card ─────────────────────────────────────────────────────────────────

type Accent = "orange" | "blue" | "green"
const accentFrom: Record<Accent, string> = {
  orange: "from-wirmet-orange",
  blue:   "from-wirmet-blue",
  green:  "from-wirmet-green",
}
const accentText: Record<Accent, string> = {
  orange: "text-wirmet-orange",
  blue:   "text-wirmet-blue",
  green:  "text-wirmet-green",
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

// ─── Filter dropdown ───────────────────────────────────────────────────────────

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

// ─── Stock stepper ─────────────────────────────────────────────────────────────
// Always-visible inline control: [−] [input] [+] [unit]
// Input looks like plain text when unfocused, highlights on focus.

function StockStepper({ stock, unit, onCommit }: {
  stock: number
  unit: string
  onCommit: (next: number) => void
}) {
  const [draft, setDraft] = useState(String(stock))
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setDraft(String(stock)) }, [stock])

  function commit() {
    const n = parseInt(draft, 10)
    if (!isNaN(n) && n >= 0) onCommit(n)
    else setDraft(String(stock))
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter")  inputRef.current?.blur()
    if (e.key === "Escape") { setDraft(String(stock)); inputRef.current?.blur() }
  }

  function step(delta: number, e: React.MouseEvent) {
    e.stopPropagation()
    onCommit(Math.max(0, stock + delta))
  }

  return (
    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
      <button
        onMouseDown={(e) => { e.preventDefault(); step(-1, e) }}
        className="flex size-5 shrink-0 items-center justify-center rounded text-sm text-muted-foreground/40 transition-colors hover:bg-muted hover:text-foreground"
      >−</button>
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
          "w-12 bg-transparent text-center text-sm font-semibold tabular-nums text-foreground",
          "rounded border border-transparent outline-none transition-colors",
          "hover:border-border",
          "focus:border-wirmet-orange/50 focus:bg-wirmet-orange/5 focus:ring-1 focus:ring-wirmet-orange/20",
          "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
        )}
      />
      <button
        onMouseDown={(e) => { e.preventDefault(); step(+1, e) }}
        className="flex size-5 shrink-0 items-center justify-center rounded text-sm text-muted-foreground/40 transition-colors hover:bg-muted hover:text-foreground"
      >+</button>
      <span className="text-xs text-muted-foreground">{unit}</span>
    </div>
  )
}

// ─── Product row ───────────────────────────────────────────────────────────────

function ProductRow({ product, category, showBadge, onStockChange }: {
  product: Product
  category: Category | undefined
  showBadge?: boolean
  onStockChange: (id: string, stock: number) => void
}) {
  const totalValue = product.stock * product.sellPriceNet

  return (
    <div className="group flex cursor-default items-center gap-4 px-5 py-3 transition-colors hover:bg-muted/20">
      {/* Category color dot */}
      <div className={cn("size-2 shrink-0 rounded-full opacity-60", dotClass[category?.color ?? ""] ?? "bg-muted-foreground")} />

      {/* Name */}
      <p className="flex-1 truncate text-sm font-medium text-foreground">{product.name}</p>

      {/* Category badge — only in list mode */}
      {showBadge && category && (
        <Badge variant="outline"
          className={cn("shrink-0 text-[10px]", colorBadgeClass[category.color] ?? "bg-zinc-500/10 text-muted-foreground border-zinc-500/20")}>
          {category.name}
        </Badge>
      )}

      {/* Stock stepper */}
      <div className="w-36 shrink-0 flex justify-end">
        <StockStepper
          stock={product.stock}
          unit={product.unit}
          onCommit={(next) => onStockChange(product.id, next)}
        />
      </div>

      {/* Unit price */}
      <div className="w-28 shrink-0 text-right">
        <p className="text-[10px] text-muted-foreground">Cena jedn.</p>
        <p className="text-xs tabular-nums text-muted-foreground">{formatPrice(product.sellPriceNet)} zł</p>
      </div>

      {/* Total net value — updates reactively when stock changes */}
      <div className="w-32 shrink-0 text-right">
        <p className="text-[10px] text-muted-foreground">Wartość netto</p>
        <p className="text-sm font-bold tabular-nums text-wirmet-green">{formatPrice(totalValue)} zł</p>
      </div>
    </div>
  )
}

// ─── Column headers (list mode only) ──────────────────────────────────────────

function ColumnHeaders({ showBadge }: { showBadge?: boolean }) {
  return (
    <div className="flex items-center gap-4 border-b border-border px-5 py-2">
      <div className="size-2 shrink-0" />
      <p className="flex-1 min-w-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Produkt</p>
      {showBadge && <div className="w-28 shrink-0" />}
      <p className="w-36 shrink-0 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Stan magazynu</p>
      <p className="w-28 shrink-0 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Cena jedn.</p>
      <p className="w-32 shrink-0 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Wartość netto</p>
    </div>
  )
}

// ─── Category section card ─────────────────────────────────────────────────────

function CategorySection({ category, products, sortDir, onStockChange }: {
  category: Category
  products: Product[]
  sortDir: "asc" | "desc"
  onStockChange: (id: string, stock: number) => void
}) {
  const sorted = [...products].sort((a, b) =>
    sortDir === "asc" ? a.name.localeCompare(b.name, "pl") : b.name.localeCompare(a.name, "pl")
  )

  const totalValue = products.reduce((s, p) => s + p.stock * p.sellPriceNet, 0)
  const units = [...new Set(products.map((p) => p.unit))]
  const totalStockLabel = units.length === 1
    ? `${formatQty(products.reduce((s, p) => s + p.stock, 0))} ${units[0]}`
    : `${products.length} ${products.length === 1 ? "pozycja" : products.length < 5 ? "pozycje" : "pozycji"}`

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className={cn("size-2 shrink-0 rounded-full", dotClass[category.color] ?? "bg-muted-foreground")} />
          <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-foreground">
            {category.name}
          </p>
          <span className="text-xs text-muted-foreground">
            {products.length} {products.length === 1 ? "pozycja" : products.length < 5 ? "pozycje" : "pozycji"}
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Łączna ilość</p>
            <p className="text-sm font-semibold tabular-nums text-foreground">{totalStockLabel}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Wartość netto</p>
            <p className="text-sm font-bold tabular-nums text-wirmet-green">{formatPrice(totalValue)} zł</p>
          </div>
        </div>
      </div>
      <div className="divide-y divide-border">
        {sorted.map((p) => (
          <ProductRow key={p.id} product={p} category={category} showBadge={false} onStockChange={onStockChange} />
        ))}
      </div>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function WarehousePage() {
  const { products, categories, updateStock } = useProducts()

  const [mode,           setMode]           = useState<"categories" | "list">("categories")
  const [search,         setSearch]         = useState("")
  const [categoryFilter, setCategoryFilter] = useState("Wszystkie")
  const [sortDir,        setSortDir]        = useState<"asc" | "desc">("asc")

  // ── Derived stats (always from full dataset) ──
  const totalStock = products.reduce((s, p) => s + p.stock, 0)
  const totalValue = products.reduce((s, p) => s + p.stock * p.sellPriceNet, 0)

  // ── Filtering ──
  const categoryFilterId = categoryFilter === "Wszystkie"
    ? null
    : categories.find((c) => c.name === categoryFilter)?.id ?? null

  const filtered = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    if (categoryFilterId && p.category !== categoryFilterId) return false
    return true
  })

  const sortedFiltered = [...filtered].sort((a, b) =>
    sortDir === "asc" ? a.name.localeCompare(b.name, "pl") : b.name.localeCompare(a.name, "pl")
  )

  const categoryOptions = ["Wszystkie", ...categories.map((c) => c.name)]

  const totalEmpty = filtered.length === 0

  return (
    <>
      <PageSetup title="Magazyn" icon={WarehouseIcon} />

      <div className="flex flex-col gap-6 p-4 md:p-8">

        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Pozycje"
            value={String(products.length)}
            note={`${filtered.length} widocznych po filtrach`}
            accent="orange"
            icon={Package01Icon}
          />
          <StatCard
            label="Łączna ilość"
            value={formatQty(totalStock)}
            note="Suma wszystkich stanów magazynowych"
            accent="blue"
            icon={Tag01Icon}
          />
          <StatCard
            label="Wartość netto"
            value={`${formatPrice(totalValue)} zł`}
            note="Suma wartości sprzedażowej netto"
            accent="green"
            icon={WarehouseIcon}
          />
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left: search + filters + sort */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <HugeiconsIcon icon={Search01Icon} size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Szukaj produktu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 w-52 pl-8 text-xs"
              />
            </div>

            <FilterDropdown
              label="Kategoria"
              options={categoryOptions}
              value={categoryFilter}
              onChange={setCategoryFilter}
            />

            <Button variant="outline" size="sm"
              className="h-8 gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setSortDir((d) => d === "asc" ? "desc" : "asc")}>
              <HugeiconsIcon icon={SortByDown01Icon} size={12} />
              Nazwa
              <HugeiconsIcon icon={sortDir === "asc" ? ArrowUp01Icon : ArrowDown01Icon} size={11} />
            </Button>
          </div>

          {/* Right: mode toggle */}
          <div className="flex items-center gap-0.5 rounded-lg border border-border p-0.5">
            <Button variant="ghost" size="sm"
              onClick={() => setMode("categories")}
              className={cn("h-7 px-3 text-xs transition-colors",
                mode === "categories" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")}>
              Kategorie
            </Button>
            <Button variant="ghost" size="sm"
              onClick={() => setMode("list")}
              className={cn("h-7 px-3 text-xs transition-colors",
                mode === "list" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")}>
              Lista
            </Button>
          </div>
        </div>

        {/* ── Category mode ── */}
        {mode === "categories" && (
          <div className="flex flex-col gap-4">
            {totalEmpty ? (
              <EmptyState />
            ) : (
              categories.map((cat) => {
                // in category mode, also respect the category filter
                if (categoryFilterId && cat.id !== categoryFilterId) return null
                const catProducts = filtered.filter((p) => p.category === cat.id)
                if (catProducts.length === 0) return null
                return (
                  <CategorySection
                    key={cat.id}
                    category={cat}
                    products={catProducts}
                    sortDir={sortDir}
                    onStockChange={updateStock}
                  />
                )
              })
            )}
          </div>
        )}

        {/* ── List mode ── */}
        {mode === "list" && (
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            {/* Section header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-foreground">
                Wszystkie produkty
              </p>
              <p className="text-xs tabular-nums text-muted-foreground">
                {filtered.length} {filtered.length === 1 ? "pozycja" : filtered.length < 5 ? "pozycje" : "pozycji"}
              </p>
            </div>

            {totalEmpty ? (
              <EmptyState />
            ) : (
              <>
                <ColumnHeaders showBadge />
                <div className="divide-y divide-border">
                  {sortedFiltered.map((p) => {
                    const cat = categories.find((c) => c.id === p.category)
                    return <ProductRow key={p.id} product={p} category={cat} showBadge onStockChange={updateStock} />
                  })}
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card py-16">
      <HugeiconsIcon icon={WarehouseIcon} size={28} className="text-muted-foreground/20" />
      <p className="text-sm text-muted-foreground/50">Brak produktów dla wybranych filtrów</p>
    </div>
  )
}
