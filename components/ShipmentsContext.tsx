"use client"

import * as React from "react"

export type ShipmentStatus =
  | "Nowe"
  | "Przygotowywane"
  | "Do wysłania"
  | "W transporcie"
  | "Wstrzymane"
  | "Dostarczone"
  | "Oczekująca"

export interface Shipment {
  id: string
  client: string
  destination: string
  carrier: string
  date: string
  status: ShipmentStatus
  offerNumber?: string
  trackingId?: string
}

const initialShipments: Shipment[] = [
  { id: "#SHP-0321", client: "Marek Wiśniewski",   destination: "ul. Marszałkowska 12, Warszawa",    carrier: "DPD",    date: "2025-03-18", status: "Oczekująca"    },
  { id: "#SHP-0319", client: "TechBuild S.A.",      destination: "ul. Gdańska 11, Gdańsk",            carrier: "DHL",    date: "2025-03-16", status: "W transporcie" },
  { id: "#SHP-0317", client: "Nowak & Syn Budowa",  destination: "ul. Poznańska 22, Poznań",          carrier: "DPD",    date: "2025-03-15", status: "Oczekująca"    },
  { id: "#SHP-0315", client: "Piotr Zając",         destination: "ul. Wrocławska 7, Wrocław",         carrier: "GLS",    date: "2025-03-14", status: "W transporcie" },
  { id: "#SHP-0312", client: "Marek Wiśniewski",   destination: "ul. Fabryczna 3, Piaseczno",        carrier: "DPD",    date: "2025-03-12", status: "W transporcie" },
  { id: "#SHP-0309", client: "Agnieszka Kowalska", destination: "ul. Krakowska 3, Kraków",           carrier: "InPost", date: "2025-03-10", status: "Dostarczone"   },
  { id: "#SHP-0306", client: "TechBuild S.A.",      destination: "ul. Stalowa 18, Gdańsk",            carrier: "DHL",    date: "2025-03-08", status: "Dostarczone"   },
  { id: "#SHP-0303", client: "Joanna Lewandowska", destination: "ul. Łódzka 5, Łódź",               carrier: "GLS",    date: "2025-03-06", status: "Dostarczone"   },
  { id: "#SHP-0298", client: "Piotr Zając",         destination: "ul. Hutnicza 9, Tychy",             carrier: "InPost", date: "2025-03-03", status: "Dostarczone"   },
  { id: "#SHP-0294", client: "Nowak & Syn Budowa",  destination: "ul. Wały Jagiellońskie 1, Gdańsk",  carrier: "DPD",    date: "2025-02-28", status: "Dostarczone"   },
  { id: "#SHP-0291", client: "Agnieszka Kowalska", destination: "ul. Różana 12, Kraków",             carrier: "DHL",    date: "2025-02-25", status: "Dostarczone"   },
  { id: "#SHP-0287", client: "Marek Wiśniewski",   destination: "ul. Marszałkowska 12, Warszawa",    carrier: "DPD",    date: "2025-02-20", status: "Dostarczone"   },
  { id: "#SHP-0283", client: "TechBuild S.A.",      destination: "ul. Przemysłowa 44, Gdańsk",        carrier: "GLS",    date: "2025-02-14", status: "Dostarczone"   },
  { id: "#SHP-0279", client: "Joanna Lewandowska", destination: "ul. Piotrkowska 120, Łódź",        carrier: "InPost", date: "2025-02-08", status: "Dostarczone"   },
]

interface ShipmentsContextValue {
  shipments: Shipment[]
  addShipment: (data: Omit<Shipment, "id">) => void
  updateShipment: (id: string, updates: Partial<Shipment>) => void
  deleteShipment: (id: string) => void
}

const ShipmentsContext = React.createContext<ShipmentsContextValue | null>(null)

export function ShipmentsProvider({ children }: { children: React.ReactNode }) {
  const [shipments, setShipments] = React.useState<Shipment[]>(initialShipments)

  const addShipment = React.useCallback((data: Omit<Shipment, "id">) => {
    setShipments((prev) => {
      const maxNum = Math.max(...prev.map((s) => parseInt(s.id.replace("#SHP-", ""))))
      const id = `#SHP-${String(maxNum + 1).padStart(4, "0")}`
      return [{ id, ...data }, ...prev]
    })
  }, [])

  const updateShipment = React.useCallback((id: string, updates: Partial<Shipment>) => {
    setShipments((prev) => prev.map((s) => s.id === id ? { ...s, ...updates } : s))
  }, [])

  const deleteShipment = React.useCallback((id: string) => {
    setShipments((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const value = React.useMemo<ShipmentsContextValue>(
    () => ({ shipments, addShipment, updateShipment, deleteShipment }),
    [shipments, addShipment, updateShipment, deleteShipment]
  )

  return <ShipmentsContext.Provider value={value}>{children}</ShipmentsContext.Provider>
}

export function useShipments(): ShipmentsContextValue {
  const ctx = React.useContext(ShipmentsContext)
  if (!ctx) throw new Error("useShipments must be used within ShipmentsProvider")
  return ctx
}
