"use client"

import * as React from "react"
import { useSettings } from "@/components/SettingsContext"

export type OfferStatus =
  | "Do wyceny"
  | "Do wysłania"
  | "Wysłana"
  | "Oczekuje na odpowiedź"
  | "Follow-up"
  | "Odrzucona"

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
  attachmentName?: string
  attachmentData?: string  // base64 data URL for client-side preview/download
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
  {
    number: "#OF-0428",
    company: "Stalmet Sp. z o.o.",
    created: "28 Feb 2025",
    status: "Wysłana",
    contact: "Krzysztof Nowak",
    phone: "+48 609 123 456",
    email: "k.nowak@stalmet.pl",
    address: "ul. Stalowa 3, Katowice",
    validUntil: "28 Mar 2025",
    description: "Oferta na dostawę i montaż ogrodzeń przemysłowych.",
    items: [
      { name: "Panel ogrodzeniowy 2m", quantity: 40, unit: "szt", unitPrice: 85 },
      { name: "Słupek stalowy", quantity: 42, unit: "szt", unitPrice: 35 },
      { name: "Robocizna montażowa", quantity: 16, unit: "h", unitPrice: 120 },
    ],
  },
  {
    number: "#OF-0425",
    company: "Budowa Express Sp. j.",
    created: "25 Feb 2025",
    status: "Follow-up",
    contact: "Marta Zielińska",
    phone: "+48 602 987 654",
    email: "marta@budowaexpress.pl",
    address: "ul. Budowlana 22, Łódź",
    validUntil: "25 Mar 2025",
    description: "Oferta na kompleksowy remont dachu — obiekt biurowy.",
    items: [
      { name: "Papa termozgrzewalna", quantity: 200, unit: "m²", unitPrice: 28 },
      { name: "Ocieplenie mineralne 12cm", quantity: 200, unit: "m²", unitPrice: 35 },
      { name: "Robocizna", quantity: 40, unit: "h", unitPrice: 110 },
    ],
  },
  {
    number: "#OF-0422",
    company: "Dom i Ogród Wiśniak",
    created: "20 Feb 2025",
    status: "Odrzucona",
    contact: "Tomasz Wiśniak",
    phone: "+48 600 111 222",
    email: "t.wisniak@domogrod.pl",
    address: "ul. Ogrodowa 5, Poznań",
    validUntil: "20 Mar 2025",
    description: "Oferta na budowę tarasu drewnianego — 35 m².",
    items: [
      { name: "Deska tarasowa modrzew", quantity: 35, unit: "m²", unitPrice: 180 },
      { name: "Konstrukcja stalowa", quantity: 1, unit: "kpl", unitPrice: 2400 },
      { name: "Robocizna montażowa", quantity: 24, unit: "h", unitPrice: 120 },
    ],
  },
]

interface OffersContextValue {
  offers: PendingOffer[]
  addOffer: (data: Omit<PendingOffer, "number" | "created" | "items">, offerNumber?: string) => void
  deleteOffer: (number: string) => void
  updateOffer: (number: string, updates: Partial<PendingOffer>) => void
  previewNextNumber: () => string
}

const OffersContext = React.createContext<OffersContextValue | null>(null)

export function OffersProvider({ children }: { children: React.ReactNode }) {
  const [offers, setOffers] = React.useState<PendingOffer[]>(initialOffers)
  const { numbering, buildOfferNumber } = useSettings()

  // Counter initialized from settings.startNumber; resets whenever startNumber changes
  const counterRef = React.useRef(numbering.startNumber)
  React.useEffect(() => {
    counterRef.current = numbering.startNumber
  }, [numbering.startNumber])

  const addOffer = React.useCallback((
    data: Omit<PendingOffer, "number" | "created" | "items">,
    offerNumber?: string
  ) => {
    const now = new Date()
    const created = now.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    // Counter always increments — keeps the auto-sequence monotonic even when a custom number is used
    const autoNumber = buildOfferNumber(counterRef.current++)
    const number = offerNumber?.trim() || autoNumber
    setOffers((prev) => [...prev, { number, created, items: [], ...data }])
  }, [buildOfferNumber])

  // Read the next auto-number without incrementing — used by AddOfferDialog's "Generuj" button
  const previewNextNumber = React.useCallback(() => {
    return buildOfferNumber(counterRef.current)
  }, [buildOfferNumber])

  const deleteOffer = React.useCallback((number: string) => {
    setOffers(prev => prev.filter(o => o.number !== number))
  }, [])

  const updateOffer = React.useCallback((number: string, updates: Partial<PendingOffer>) => {
    setOffers(prev => prev.map(o => o.number === number ? { ...o, ...updates } : o))
  }, [])

  const value = React.useMemo<OffersContextValue>(
    () => ({ offers, addOffer, deleteOffer, updateOffer, previewNextNumber }),
    [offers, addOffer, deleteOffer, updateOffer, previewNextNumber]
  )

  return <OffersContext.Provider value={value}>{children}</OffersContext.Provider>
}

export function useOffers(): OffersContextValue {
  const ctx = React.useContext(OffersContext)
  if (!ctx) throw new Error("useOffers must be used within OffersProvider")
  return ctx
}
