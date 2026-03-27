"use client"

import * as React from "react"

export interface Customer {
  id: string
  name: string
  company: string
  nip: string
  address: string
  contact: string
  phone: string
  email: string
}

const initialCustomers: Customer[] = [
  { id: "1", name: "Marek Wiśniewski",   company: "MW Budownictwo Sp. z o.o.", nip: "PL 7811234567", address: "ul. Nowa 14, Warszawa",      contact: "Marek Wiśniewski",   phone: "+48 601 234 567", email: "marek@mwbudownictwo.pl"          },
  { id: "2", name: "Agnieszka Kowalska", company: "AK Nieruchomości",           nip: "PL 5261098765", address: "ul. Krakowska 3, Kraków",    contact: "Agnieszka Kowalska", phone: "+48 602 345 678", email: "a.kowalska@aknieruchomosci.pl"   },
  { id: "3", name: "Piotr Zając",        company: "Zając Inwestycje",           nip: "PL 6341876543", address: "ul. Wrocławska 7, Wrocław",  contact: "Piotr Zając",        phone: "+48 603 456 789", email: "piotr@zajac-inwestycje.pl"       },
  { id: "4", name: "Katarzyna Nowak",    company: "Nowak & Syn Budowa",         nip: "PL 8521654321", address: "ul. Poznańska 22, Poznań",   contact: "Katarzyna Nowak",    phone: "+48 604 567 890", email: "k.nowak@nowaksyn.pl"             },
  { id: "5", name: "Tomasz Dąbrowski",   company: "TechBuild S.A.",             nip: "PL 9431543210", address: "ul. Gdańska 11, Gdańsk",     contact: "Tomasz Dąbrowski",   phone: "+48 605 678 901", email: "t.dabrowski@techbuild.pl"        },
  { id: "6", name: "Joanna Lewandowska", company: "Lewandowska Consulting",     nip: "PL 7123456789", address: "ul. Łódzka 5, Łódź",         contact: "Joanna Lewandowska", phone: "+48 606 789 012", email: "joanna@lewandowska.pl"           },
]

interface CustomersContextValue {
  customers: Customer[]
  addCustomer: (data: Omit<Customer, "id">) => void
  updateCustomer: (id: string, data: Omit<Customer, "id">) => void
  deleteCustomer: (id: string) => void
}

const CustomersContext = React.createContext<CustomersContextValue | null>(null)

export function CustomersProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = React.useState<Customer[]>(initialCustomers)

  const addCustomer = React.useCallback((data: Omit<Customer, "id">) => {
    setCustomers((prev) => [...prev, { id: crypto.randomUUID(), ...data }])
  }, [])

  const updateCustomer = React.useCallback((id: string, data: Omit<Customer, "id">) => {
    setCustomers((prev) => prev.map((c) => c.id === id ? { ...c, ...data } : c))
  }, [])

  const deleteCustomer = React.useCallback((id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const value = React.useMemo<CustomersContextValue>(
    () => ({ customers, addCustomer, updateCustomer, deleteCustomer }),
    [customers, addCustomer, updateCustomer, deleteCustomer]
  )

  return <CustomersContext.Provider value={value}>{children}</CustomersContext.Provider>
}

export function useCustomers(): CustomersContextValue {
  const ctx = React.useContext(CustomersContext)
  if (!ctx) throw new Error("useCustomers must be used within CustomersProvider")
  return ctx
}
