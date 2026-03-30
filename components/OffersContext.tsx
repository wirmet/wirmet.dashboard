"use client"

import * as React from "react"

export type OfferStatus = "Do wyceny" | "Do wysłania" | "Oczekuje na odpowiedź"

export interface OfferItem {
  name: string
  quantity: number
  unit: string
  unitPrice: number
}

export interface PendingOffer {
  number: string
  company: string
  created: string
  status: OfferStatus
  contact: string
  phone: string
  email: string
  address: string
  validUntil: string
  description: string
  items: OfferItem[]
}

// Seed data — moved here from PendingOffers.tsx static array
const initialOffers: PendingOffer[] = [
  {
    number: "#OF-0441",
    company: "TechBuild Sp. z o.o.",
    created: "10 Mar 2025",
    status: "Do wyceny",
    contact: "Tomasz Dąbrowski",
    phone: "+48 605 678 901",
    email: "t.dabrowski@techbuild.pl",
    address: "ul. Gdańska 11, Gdańsk",
    validUntil: "—",
    description: "Wycena systemu balustrad stalowych na obiekcie przemysłowym.",
    items: [],
  },
  {
    number: "#OF-0438",
    company: "Konstrukt S.A.",
    created: "8 Mar 2025",
    status: "Do wysłania",
    contact: "Anna Kowalczyk",
    phone: "+48 612 345 678",
    email: "a.kowalczyk@konstrukt.pl",
    address: "ul. Przemysłowa 4, Kraków",
    validUntil: "7 Apr 2025",
    description: "Oferta na montaż stolarki okiennej — 18 szt.",
    items: [
      { name: "Okno PVC 140×120", quantity: 18, unit: "szt", unitPrice: 640 },
      { name: "Piana izolacyjna", quantity: 36, unit: "szt", unitPrice: 22 },
      { name: "Robocizna montażowa", quantity: 12, unit: "h", unitPrice: 120 },
    ],
  },
  {
    number: "#OF-0435",
    company: "Rem-Bud Usługi",
    created: "5 Mar 2025",
    status: "Oczekuje na odpowiedź",
    contact: "Piotr Rem",
    phone: "+48 603 211 987",
    email: "biuro@rem-bud.pl",
    address: "ul. Lipowa 21, Gdańsk",
    validUntil: "4 Apr 2025",
    description: "Oferta na dostawę materiałów budowlanych — etap II.",
    items: [
      { name: "Bloczki betonowe B20", quantity: 600, unit: "szt", unitPrice: 4.5 },
      { name: "Zaprawa murarska", quantity: 40, unit: "worki", unitPrice: 18 },
      { name: "Opłata za dostawę", quantity: 1, unit: "ryczałt", unitPrice: 350 },
    ],
  },
  {
    number: "#OF-0431",
    company: "Piotr Jabłoński",
    created: "3 Mar 2025",
    status: "Do wyceny",
    contact: "Piotr Jabłoński",
    phone: "+48 601 000 111",
    email: "p.jablonski@gmail.com",
    address: "ul. Słoneczna 8, Wrocław",
    validUntil: "—",
    description: "Wycena remontu łazienki i kuchni — mieszkanie 60 m².",
    items: [],
  },
]

interface OffersContextValue {
  offers: PendingOffer[]
  addOffer: (data: Omit<PendingOffer, "number" | "created" | "items">) => void
}

const OffersContext = React.createContext<OffersContextValue | null>(null)

export function OffersProvider({ children }: { children: React.ReactNode }) {
  const [offers, setOffers] = React.useState<PendingOffer[]>(initialOffers)
  // Starts at 442 — one above the highest existing number (0441)
  const counterRef = React.useRef(442)

  const addOffer = React.useCallback((data: Omit<PendingOffer, "number" | "created" | "items">) => {
    const now = new Date()
    const created = now.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    const number = `#OF-${String(counterRef.current++).padStart(4, "0")}`
    setOffers((prev) => [...prev, { number, created, items: [], ...data }])
  }, [])

  const value = React.useMemo<OffersContextValue>(
    () => ({ offers, addOffer }),
    [offers, addOffer]
  )

  return <OffersContext.Provider value={value}>{children}</OffersContext.Provider>
}

export function useOffers(): OffersContextValue {
  const ctx = React.useContext(OffersContext)
  if (!ctx) throw new Error("useOffers must be used within OffersProvider")
  return ctx
}
