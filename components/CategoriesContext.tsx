"use client"

import * as React from "react"

export interface Category {
  value: string
  label: string
  color: string  // Tailwind classes for badge bg/text/border
  dot: string    // Tailwind class for dot bg
}

const initialCategories: Category[] = [
  { value: "spotkanie",      label: "Spotkanie",      color: "bg-violet-500/15  text-violet-400  border-violet-500/25", dot: "bg-violet-400"  },
  { value: "montaz",         label: "Montaż",          color: "bg-amber-500/15   text-amber-400   border-amber-500/25",  dot: "bg-amber-400"   },
  { value: "wizja lokalna",  label: "Wizja lokalna",   color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",dot: "bg-emerald-400" },
  { value: "przeglad",       label: "Przegląd",        color: "bg-sky-500/15     text-sky-400     border-sky-500/25",    dot: "bg-sky-400"     },
]

interface CategoriesContextValue {
  categories: Category[]
  addCategory: (cat: Category) => void
  removeCategory: (value: string) => void
}

const CategoriesContext = React.createContext<CategoriesContextValue | null>(null)

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = React.useState<Category[]>(initialCategories)

  const addCategory = React.useCallback((cat: Category) => {
    setCategories(prev => prev.some(c => c.value === cat.value) ? prev : [...prev, cat])
  }, [])

  const removeCategory = React.useCallback((value: string) => {
    setCategories(prev => prev.filter(c => c.value !== value))
  }, [])

  const value = React.useMemo(() => ({ categories, addCategory, removeCategory }), [categories, addCategory, removeCategory])

  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>
}

export function useCategories(): CategoriesContextValue {
  const ctx = React.useContext(CategoriesContext)
  if (!ctx) throw new Error("useCategories must be used within CategoriesProvider")
  return ctx
}
