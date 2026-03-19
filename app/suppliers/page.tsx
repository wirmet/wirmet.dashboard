"use client"

import { useState, useMemo } from "react"
import { PageSetup } from "@/components/PageSetup"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  Search01Icon,
  UserGroupIcon,
  ArrowUp01Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

type SupplierType = "Materiały budowlane" | "Narzędzia" | "Instalacje" | "Transport"
type SortDirection = "asc" | "desc"
type SortColumn = "name" | "nip" | "address" | "contact" | "phone" | "type"

interface Supplier {
  name: string
  nip: string
  address: string
  contact: string
  phone: string
  type: SupplierType
}

const suppliers: Supplier[] = [
  {
    name: "Budmat Sp. z o.o.",
    nip: "PL 7811234567",
    address: "ul. Fabryczna 12, Warszawa",
    contact: "Tomasz Kowalski",
    phone: "+48 601 234 567",
    type: "Materiały budowlane",
  },
  {
    name: "Stalbet S.A.",
    nip: "PL 5261098765",
    address: "ul. Hutnicza 4, Kraków",
    contact: "Marcin Lewandowski",
    phone: "+48 602 345 678",
    type: "Materiały budowlane",
  },
  {
    name: "ProNarz Sp. j.",
    nip: "PL 6341876543",
    address: "ul. Rzemieślnicza 8, Wrocław",
    contact: "Anna Wiśniewska",
    phone: "+48 603 456 789",
    type: "Narzędzia",
  },
  {
    name: "InstalPro",
    nip: "PL 8521654321",
    address: "ul. Elektryczna 3, Poznań",
    contact: "Piotr Zając",
    phone: "+48 604 567 890",
    type: "Instalacje",
  },
  {
    name: "TransBud Logistyka",
    nip: "PL 9431543210",
    address: "ul. Spedycyjna 22, Gdańsk",
    contact: "Katarzyna Nowak",
    phone: "+48 605 678 901",
    type: "Transport",
  },
]

const typeStyle: Record<SupplierType, string> = {
  "Materiały budowlane": "bg-blue-50 text-blue-700 border-blue-200",
  "Narzędzia":           "bg-amber-50 text-amber-700 border-amber-200",
  "Instalacje":          "bg-purple-50 text-purple-700 border-purple-200",
  "Transport":           "bg-green-50 text-green-700 border-green-200",
}

function SortIcon({ column, sortColumn, sortDirection }: {
  column: SortColumn
  sortColumn: SortColumn | null
  sortDirection: SortDirection
}) {
  const isActive = sortColumn === column
  return (
    <span className="flex flex-col gap-px">
      <HugeiconsIcon
        icon={ArrowUp01Icon}
        size={10}
        className={isActive && sortDirection === "asc" ? "text-zinc-700" : "text-zinc-400"}
      />
      <HugeiconsIcon
        icon={ArrowDown01Icon}
        size={10}
        className={isActive && sortDirection === "desc" ? "text-zinc-700" : "text-zinc-400"}
      />
    </span>
  )
}

const columns: { key: SortColumn; label: string }[] = [
  { key: "name",    label: "Firma" },
  { key: "nip",     label: "NIP" },
  { key: "address", label: "Adres" },
  { key: "contact", label: "Kontakt" },
  { key: "phone",   label: "Telefon" },
  { key: "type",    label: "Typ" },
]

export default function SuppliersPage() {
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  function handleSort(column: SortColumn) {
    if (sortColumn === column) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const sorted = useMemo(() => {
    if (!sortColumn) return suppliers
    return [...suppliers].sort((a, b) => {
      const valA = a[sortColumn].toLowerCase()
      const valB = b[sortColumn].toLowerCase()
      if (valA < valB) return sortDirection === "asc" ? -1 : 1
      if (valA > valB) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [sortColumn, sortDirection])

  return (
    <>
      <PageSetup title="Suppliers" icon={UserGroupIcon} />

      <div className="p-8">
        {/* Filter bar */}
        <div className="mb-4 flex items-center gap-2">
          {/* Left: dropdowns */}
          <select defaultValue="" className="h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-600 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-200 appearance-none pr-8 cursor-pointer"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}
          >
            <option value="" disabled>Document Type</option>
            <option>Materiały budowlane</option>
            <option>Narzędzia</option>
            <option>Instalacje</option>
            <option>Transport</option>
          </select>

          <select defaultValue="" className="h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-600 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-200 appearance-none pr-8 cursor-pointer"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}
          >
            <option value="" disabled>Date Added</option>
            <option>Newest first</option>
            <option>Oldest first</option>
          </select>

          {/* Right: search + add button */}
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <HugeiconsIcon icon={Search01Icon} size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              <Input
                type="search"
                placeholder="Search Suppliers..."
                className="h-9 w-56 rounded-md border border-zinc-200 bg-white pl-8 pr-3 text-sm text-zinc-600 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              />
            </div>

            <Button variant="brand" size="lg">
              <HugeiconsIcon icon={Add01Icon} size={14} />
              Add Supplier
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col, i) => (
                  <TableHead
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className={cn(
                      "cursor-pointer select-none hover:text-zinc-600 transition-colors",
                      i === 0 && "pl-5"
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      {col.label}
                      <SortIcon column={col.key} sortColumn={sortColumn} sortDirection={sortDirection} />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((s) => (
                <TableRow key={s.nip} className="cursor-pointer">
                  <TableCell className="pl-5 font-medium text-zinc-900">{s.name}</TableCell>
                  <TableCell className="font-mono text-zinc-400">{s.nip}</TableCell>
                  <TableCell className="text-zinc-500">{s.address}</TableCell>
                  <TableCell className="text-zinc-500">{s.contact}</TableCell>
                  <TableCell className="text-zinc-500">{s.phone}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[11px] ${typeStyle[s.type]}`}>
                      {s.type}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
}
