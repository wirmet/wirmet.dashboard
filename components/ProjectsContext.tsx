"use client"

import * as React from "react"

export type ProjectStatus = "Ordered" | "Paid"

export interface OrderItem {
  name: string
  quantity: number
  unit: string
  unitPrice: number
}

export interface Project {
  client: string
  deadline: string      // "Due DD Mon YYYY"
  status: ProjectStatus
  type: string
  address: string       // installation address
  offerNumber: string
  companyName: string
  nip: string
  companyAddress: string
  orderDate: string
  paymentDue: string
  deliveryDate: string
  completionDate: string
  items: OrderItem[]
}

// Seed data — moved here from CurrentProjects.tsx static array
const initialProjects: Project[] = [
  {
    client: "Marek Wiśniewski",
    deadline: "Due 20 Mar 2025",
    status: "Ordered",
    type: "Installation",
    address: "ul. Różana 12, 30-001 Kraków",
    offerNumber: "Offer #2603001",
    companyName: "Wiśniewski Budownictwo",
    nip: "PL 6782345678",
    companyAddress: "ul. Różana 12, 30-001 Kraków",
    orderDate: "3 Mar 2025",
    paymentDue: "17 Mar 2025",
    deliveryDate: "18 Mar 2025",
    completionDate: "20 Mar 2025",
    items: [
      { name: "System balustrad stalowych", quantity: 12, unit: "m", unitPrice: 185 },
      { name: "Wsporniki montażowe", quantity: 24, unit: "szt", unitPrice: 18 },
      { name: "Robocizna montażowa", quantity: 8, unit: "h", unitPrice: 120 },
    ],
  },
  {
    client: "Budmax Sp. z o.o.",
    deadline: "Due 25 Mar 2025",
    status: "Paid",
    type: "Delivery",
    address: "ul. Przemysłowa 8, 00-450 Warszawa",
    offerNumber: "Offer #2603002",
    companyName: "Budmax Sp. z o.o.",
    nip: "PL 5252345678",
    companyAddress: "ul. Fabryczna 4, 00-446 Warszawa",
    orderDate: "8 Mar 2025",
    paymentDue: "22 Mar 2025",
    deliveryDate: "25 Mar 2025",
    completionDate: "25 Mar 2025",
    items: [
      { name: "Bloczki betonowe B20", quantity: 400, unit: "szt", unitPrice: 4.5 },
      { name: "Worki z piaskiem 25 kg", quantity: 60, unit: "szt", unitPrice: 12 },
      { name: "Opłata za dostawę", quantity: 1, unit: "ryczałt", unitPrice: 350 },
    ],
  },
  {
    client: "Anna Kowalczyk",
    deadline: "Due 1 Apr 2025",
    status: "Ordered",
    type: "Installation",
    address: "ul. Słoneczna 3, 50-100 Wrocław",
    offerNumber: "Offer #2603003",
    companyName: "Anna Kowalczyk — prywatny",
    nip: "—",
    companyAddress: "ul. Słoneczna 3, 50-100 Wrocław",
    orderDate: "12 Mar 2025",
    paymentDue: "28 Mar 2025",
    deliveryDate: "30 Mar 2025",
    completionDate: "1 Apr 2025",
    items: [
      { name: "Rama okienna 140×120", quantity: 3, unit: "szt", unitPrice: 640 },
      { name: "Piana izolacyjna", quantity: 6, unit: "szt", unitPrice: 22 },
      { name: "Robocizna montażowa", quantity: 6, unit: "h", unitPrice: 120 },
    ],
  },
]

interface AddProjectData {
  client: string
  companyName: string
  nip: string
  companyAddress: string
  address: string         // installation address
  type: string
  status: ProjectStatus
  completionDate: string  // pre-formatted "20 Apr 2026"
  offerNumber?: string    // auto-generated if omitted
}

interface ProjectsContextValue {
  projects: Project[]
  addProject: (data: AddProjectData) => void
}

const ProjectsContext = React.createContext<ProjectsContextValue | null>(null)

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = React.useState<Project[]>(initialProjects)
  // Starts at 4 — next sequential number after the 3 seed projects
  const counterRef = React.useRef(4)

  const addProject = React.useCallback((data: AddProjectData) => {
    const now = new Date()
    const fmt = (d: Date) =>
      d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })

    const orderDate = fmt(now)
    const paymentDueDate = new Date(now)
    paymentDueDate.setDate(paymentDueDate.getDate() + 14)
    const paymentDue = fmt(paymentDueDate)

    const yr  = String(now.getFullYear()).slice(2)
    const mo  = String(now.getMonth() + 1).padStart(2, "0")
    const seq = String(counterRef.current++).padStart(3, "0")
    const offerNumber = data.offerNumber?.trim() || `Offer #${yr}${mo}${seq}`

    setProjects((prev) => [
      ...prev,
      {
        client:        data.client,
        deadline:      `Due ${data.completionDate}`,
        status:        data.status,
        type:          data.type,
        address:       data.address,
        offerNumber,
        companyName:   data.companyName,
        nip:           data.nip,
        companyAddress: data.companyAddress,
        orderDate,
        paymentDue,
        deliveryDate:  data.completionDate,
        completionDate: data.completionDate,
        items: [],
      },
    ])
  }, [])

  const value = React.useMemo<ProjectsContextValue>(
    () => ({ projects, addProject }),
    [projects, addProject]
  )

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>
}

export function useProjects(): ProjectsContextValue {
  const ctx = React.useContext(ProjectsContext)
  if (!ctx) throw new Error("useProjects must be used within ProjectsProvider")
  return ctx
}
