"use client"

import * as React from "react"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface Category {
  id: string
  name: string
  color: string // Tailwind text class, e.g. "text-wirmet-orange"
}

export interface Product {
  id: string
  name: string
  description: string
  category: string    // category id
  imageUrl?: string
  buyPrice: number
  sellPriceNet: number
  sellPriceGross: number
  stock: number
  unit: string
}

export interface ProductForm {
  name: string
  description: string
  category: string
  imageUrl: string
  buyPrice: string
  sellPriceNet: string
  sellPriceGross: string
  stock: string
  unit: string
}

// ─── Initial data ────────────────────────────────────────────────────────────

function g(net: number) { return Math.round(net * 1.23 * 100) / 100 }

const initialCategories: Category[] = [
  { id: "steel",       name: "Stal i profile",       color: "text-wirmet-orange" },
  { id: "fasteners",   name: "Elementy złączne",      color: "text-wirmet-blue"   },
  { id: "paint",       name: "Farby i lakiery",       color: "text-wirmet-green"  },
  { id: "tools",       name: "Narzędzia",             color: "text-rose-400"      },
  { id: "accessories", name: "Akcesoria montażowe",   color: "text-wirmet-blue"   },
]

const initialProducts: Product[] = [
  { id: "p1",  name: "Balustrada stalowa prosta",      description: "Ocynkowana balustrada prosta, grubość rury 40mm, malowana proszkowo.",      category: "steel",       buyPrice: 480,  sellPriceNet: 720,  sellPriceGross: g(720),  stock: 12,  unit: "mb"   },
  { id: "p2",  name: "Profil stalowy 60×40",           description: "Profil zamknięty ze stali S235, cięty na wymiar, ocynk ogniowy.",            category: "steel",       buyPrice: 28,   sellPriceNet: 42,   sellPriceGross: g(42),   stock: 340, unit: "mb"   },
  { id: "p3",  name: "Śruby M8×60 (op. 100 szt.)",    description: "Śruby sześciokątne ocynkowane, klasa 8.8, opakowanie 100 sztuk.",            category: "fasteners",   buyPrice: 18,   sellPriceNet: 28,   sellPriceGross: g(28),   stock: 85,  unit: "op."  },
  { id: "p4",  name: "Kotwy rozporowe M10 (op. 50)",   description: "Kotwy mechaniczne do betonu i cegły, M10×80, opakowanie 50 szt.",            category: "fasteners",   buyPrice: 24,   sellPriceNet: 38,   sellPriceGross: g(38),   stock: 120, unit: "op."  },
  { id: "p5",  name: "Farba antykorozyjna szara 1L",   description: "Farba podkładowa antykorozyjna, szybkoschnąca, odporna na UV.",              category: "paint",       buyPrice: 32,   sellPriceNet: 52,   sellPriceGross: g(52),   stock: 28,  unit: "szt." },
  { id: "p6",  name: "Grunt epoksydowy 5L",            description: "Dwuskładnikowy grunt epoksydowy do metalu, do zastosowań przemysłowych.",    category: "paint",       buyPrice: 145,  sellPriceNet: 220,  sellPriceGross: g(220),  stock: 8,   unit: "szt." },
  { id: "p7",  name: "Tarcza szlifierska 125mm",       description: "Tarcza fibrowa do szlifowania stali i żeliwa, ziarno P80.",                  category: "tools",       buyPrice: 8,    sellPriceNet: 14,   sellPriceGross: g(14),   stock: 200, unit: "szt." },
  { id: "p8",  name: "Kołek rozporowy 8×80 (op. 100)", description: "Kołki nylonowe z wkrętem, do betonu i pustaków, op. 100 szt.",              category: "accessories", buyPrice: 12,   sellPriceNet: 19,   sellPriceGross: g(19),   stock: 160, unit: "op."  },
  { id: "p9",  name: "Uszczelka EPDM 10mm",            description: "Taśma uszczelniająca z gumy EPDM, odporna na temp. -40°C do +120°C.",       category: "accessories", buyPrice: 3.5,  sellPriceNet: 6,    sellPriceGross: g(6),    stock: 500, unit: "mb"   },
]

// ─── Context ─────────────────────────────────────────────────────────────────

interface ProductsContextValue {
  products: Product[]
  categories: Category[]
  updateStock: (id: string, stock: number) => void
  saveProduct: (form: ProductForm, editingId?: string) => void
  duplicateProduct: (id: string) => void
  deleteProduct: (id: string) => void
  addCategory: (name: string, color: string) => void
}

const ProductsContext = React.createContext<ProductsContextValue | null>(null)

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products,   setProducts]   = React.useState<Product[]>(initialProducts)
  const [categories, setCategories] = React.useState<Category[]>(initialCategories)

  const updateStock = React.useCallback((id: string, stock: number) => {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, stock } : p))
  }, [])

  const saveProduct = React.useCallback((form: ProductForm, editingId?: string) => {
    const next: Product = {
      id: editingId ?? `p-${Date.now()}`,
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      imageUrl: form.imageUrl || undefined,
      buyPrice: parseFloat(form.buyPrice) || 0,
      sellPriceNet: parseFloat(form.sellPriceNet) || 0,
      sellPriceGross: parseFloat(form.sellPriceGross) || 0,
      stock: parseInt(form.stock) || 0,
      unit: form.unit,
    }
    setProducts((prev) =>
      editingId
        ? prev.map((p) => p.id === editingId ? next : p)
        : [next, ...prev]
    )
  }, [])

  const duplicateProduct = React.useCallback((id: string) => {
    setProducts((prev) => {
      const i = prev.findIndex((p) => p.id === id)
      if (i === -1) return prev
      const copy: Product = { ...prev[i], id: `p-${Date.now()}`, name: `${prev[i].name} — kopia` }
      const next = [...prev]
      next.splice(i + 1, 0, copy)
      return next
    })
  }, [])

  const deleteProduct = React.useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const addCategory = React.useCallback((name: string, color: string) => {
    setCategories((prev) => [...prev, { id: `cat-${Date.now()}`, name, color }])
  }, [])

  const value = React.useMemo<ProductsContextValue>(
    () => ({ products, categories, updateStock, saveProduct, duplicateProduct, deleteProduct, addCategory }),
    [products, categories, updateStock, saveProduct, duplicateProduct, deleteProduct, addCategory]
  )

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

export function useProducts(): ProductsContextValue {
  const ctx = React.useContext(ProductsContext)
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider")
  return ctx
}
