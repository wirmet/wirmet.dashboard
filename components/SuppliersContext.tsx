"use client"

import * as React from "react"

// ─── Type palette ──────────────────────────────────────────────────────────────

export const SUPPLIER_TYPE_COLORS = [
  "#d97757",  // wirmet-orange
  "#6a9bcc",  // wirmet-blue
  "#788c5d",  // wirmet-green
  "#fb7185",  // rose
  "#f59e0b",  // amber
  "#8b5cf6",  // violet
  "#10b981",  // emerald
  "#06b6d4",  // cyan
  "#6366f1",  // indigo
  "#ec4899",  // pink
  "#64748b",  // slate
  "#a78bfa",  // purple
] as const

export interface SupplierTypeRecord {
  id: string
  name: string
  color: string
}

const initialTypes: SupplierTypeRecord[] = [
  { id: "mat-bud",    name: "Materiały budowlane", color: "#6a9bcc" },
  { id: "narzedzia",  name: "Narzędzia",           color: "#f59e0b" },
  { id: "instalacje", name: "Instalacje",           color: "#8b5cf6" },
  { id: "transport",  name: "Transport",            color: "#788c5d" },
]

// ─── Supplier ──────────────────────────────────────────────────────────────────

export interface Supplier {
  id: string
  name: string
  nip: string
  address: string
  contact: string
  phone: string
  email: string
  typeId: string   // references SupplierTypeRecord.id
}

const initialSuppliers: Supplier[] = [
  { id: "1", name: "Budmat Sp. z o.o.",  nip: "PL 7811234567", address: "ul. Fabryczna 12, Warszawa",   contact: "Tomasz Kowalski",    phone: "+48 601 234 567", email: "t.kowalski@budmat.pl",     typeId: "mat-bud"    },
  { id: "2", name: "Stalbet S.A.",        nip: "PL 5261098765", address: "ul. Hutnicza 4, Kraków",        contact: "Marcin Lewandowski", phone: "+48 602 345 678", email: "m.lewandowski@stalbet.pl", typeId: "mat-bud"    },
  { id: "3", name: "ProNarz Sp. j.",      nip: "PL 6341876543", address: "ul. Rzemieślnicza 8, Wrocław",  contact: "Anna Wiśniewska",    phone: "+48 603 456 789", email: "a.wisniewska@pronarz.pl",  typeId: "narzedzia"  },
  { id: "4", name: "InstalPro",           nip: "PL 8521654321", address: "ul. Elektryczna 3, Poznań",     contact: "Piotr Zając",        phone: "+48 604 567 890", email: "p.zajac@instalpro.pl",     typeId: "instalacje" },
  { id: "5", name: "TransBud Logistyka",  nip: "PL 9431543210", address: "ul. Spedycyjna 22, Gdańsk",     contact: "Katarzyna Nowak",    phone: "+48 605 678 901", email: "k.nowak@transbud.pl",      typeId: "transport"  },
]

// ─── Context ───────────────────────────────────────────────────────────────────

interface SuppliersContextValue {
  suppliers: Supplier[]
  addSupplier:    (data: Omit<Supplier, "id">) => void
  updateSupplier: (id: string, data: Omit<Supplier, "id">) => void
  deleteSupplier: (id: string) => void

  supplierTypes: SupplierTypeRecord[]
  addSupplierType:    (name: string, color: string) => void
  updateSupplierType: (id: string, name: string, color: string) => void
  deleteSupplierType: (id: string) => void
  getType: (typeId: string) => SupplierTypeRecord | undefined
}

const SuppliersContext = React.createContext<SuppliersContextValue | null>(null)

export function SuppliersProvider({ children }: { children: React.ReactNode }) {
  const [suppliers,     setSuppliers]     = React.useState<Supplier[]>(initialSuppliers)
  const [supplierTypes, setSupplierTypes] = React.useState<SupplierTypeRecord[]>(initialTypes)

  // ── Suppliers ───────────────────────────────────────────────────────────────

  const addSupplier = React.useCallback((data: Omit<Supplier, "id">) => {
    setSuppliers((prev) => [...prev, { id: crypto.randomUUID(), ...data }])
  }, [])

  const updateSupplier = React.useCallback((id: string, data: Omit<Supplier, "id">) => {
    setSuppliers((prev) => prev.map((s) => s.id === id ? { ...s, ...data } : s))
  }, [])

  const deleteSupplier = React.useCallback((id: string) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id))
  }, [])

  // ── Types ───────────────────────────────────────────────────────────────────

  const addSupplierType = React.useCallback((name: string, color: string) => {
    setSupplierTypes((prev) => [...prev, { id: crypto.randomUUID(), name: name.trim(), color }])
  }, [])

  const updateSupplierType = React.useCallback((id: string, name: string, color: string) => {
    setSupplierTypes((prev) =>
      prev.map((t) => t.id === id ? { ...t, name: name.trim(), color } : t)
    )
  }, [])

  const deleteSupplierType = React.useCallback((id: string) => {
    setSupplierTypes((prev) => prev.filter((t) => t.id !== id))
    // Clear typeId on any suppliers that used this type
    setSuppliers((prev) => prev.map((s) => s.typeId === id ? { ...s, typeId: "" } : s))
  }, [])

  const getType = React.useCallback((typeId: string) => {
    return supplierTypes.find((t) => t.id === typeId)
  }, [supplierTypes])

  const value = React.useMemo<SuppliersContextValue>(
    () => ({
      suppliers, addSupplier, updateSupplier, deleteSupplier,
      supplierTypes, addSupplierType, updateSupplierType, deleteSupplierType, getType,
    }),
    [suppliers, addSupplier, updateSupplier, deleteSupplier,
     supplierTypes, addSupplierType, updateSupplierType, deleteSupplierType, getType],
  )

  return <SuppliersContext.Provider value={value}>{children}</SuppliersContext.Provider>
}

export function useSuppliers(): SuppliersContextValue {
  const ctx = React.useContext(SuppliersContext)
  if (!ctx) throw new Error("useSuppliers must be used within SuppliersProvider")
  return ctx
}
