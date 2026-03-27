"use client"

import { useState, useMemo, useEffect } from "react"
import { PageSetup } from "@/components/PageSetup"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
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
  ArrowDown02Icon,
  MoreVerticalIcon,
  EyeIcon,
  PencilEdit01Icon,
  Delete01Icon,
} from "@hugeicons/core-free-icons"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  { name: "Budmat Sp. z o.o.",    nip: "PL 7811234567", address: "ul. Fabryczna 12, Warszawa",     contact: "Tomasz Kowalski",      phone: "+48 601 234 567", type: "Materiały budowlane" },
  { name: "Stalbet S.A.",         nip: "PL 5261098765", address: "ul. Hutnicza 4, Kraków",          contact: "Marcin Lewandowski",   phone: "+48 602 345 678", type: "Materiały budowlane" },
  { name: "ProNarz Sp. j.",       nip: "PL 6341876543", address: "ul. Rzemieślnicza 8, Wrocław",    contact: "Anna Wiśniewska",      phone: "+48 603 456 789", type: "Narzędzia" },
  { name: "InstalPro",            nip: "PL 8521654321", address: "ul. Elektryczna 3, Poznań",       contact: "Piotr Zając",          phone: "+48 604 567 890", type: "Instalacje" },
  { name: "TransBud Logistyka",   nip: "PL 9431543210", address: "ul. Spedycyjna 22, Gdańsk",       contact: "Katarzyna Nowak",      phone: "+48 605 678 901", type: "Transport" },
]

const ALL_TYPES: SupplierType[] = ["Materiały budowlane", "Narzędzia", "Instalacje", "Transport"]

// Opacity-based colors — work in both light and dark mode
const typeStyle: Record<SupplierType, string> = {
  "Materiały budowlane": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Narzędzia":           "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Instalacje":          "bg-violet-500/10 text-violet-400 border-violet-500/20",
  "Transport":           "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
}

const PAGE_SIZE = 16

const columns: { key: SortColumn; label: string }[] = [
  { key: "name",    label: "Firma" },
  { key: "nip",     label: "NIP" },
  { key: "address", label: "Adres" },
  { key: "contact", label: "Kontakt" },
  { key: "phone",   label: "Telefon" },
  { key: "type",    label: "Typ" },
]

function SortIcon({ column, sortColumn, sortDirection }: {
  column: SortColumn
  sortColumn: SortColumn | null
  sortDirection: SortDirection
}) {
  const isActive = sortColumn === column
  return (
    <span className="flex flex-col gap-px">
      <HugeiconsIcon icon={ArrowUp01Icon} size={10} className={isActive && sortDirection === "asc" ? "text-foreground" : "text-muted-foreground/40"} />
      <HugeiconsIcon icon={ArrowDown01Icon} size={10} className={isActive && sortDirection === "desc" ? "text-foreground" : "text-muted-foreground/40"} />
    </span>
  )
}

export default function SuppliersPage() {
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [typeFilters, setTypeFilters] = useState<SupplierType[]>([])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  useEffect(() => { setPage(1) }, [typeFilters, search, sortColumn, sortDirection])

  function handleSort(column: SortColumn) {
    if (sortColumn === column) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  function toggleType(type: SupplierType) {
    setTypeFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  const filtered = useMemo(() => {
    let rows = suppliers
    if (typeFilters.length > 0) rows = rows.filter((s) => typeFilters.includes(s.type))
    if (search) {
      const q = search.toLowerCase()
      rows = rows.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.contact.toLowerCase().includes(q) ||
          s.nip.toLowerCase().includes(q)
      )
    }
    if (!sortColumn) return rows
    return [...rows].sort((a, b) => {
      const valA = a[sortColumn].toLowerCase()
      const valB = b[sortColumn].toLowerCase()
      if (valA < valB) return sortDirection === "asc" ? -1 : 1
      if (valA > valB) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [typeFilters, search, sortColumn, sortDirection])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <>
      <PageSetup title="Suppliers" icon={UserGroupIcon} />

      <div className="flex flex-col gap-4 p-8">

        {/* Filter bar */}
        <div className="flex shrink-0 items-center gap-2">

          {/* Type multi-select */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="lg">
                Type
                {typeFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-1 rounded-full px-1.5 text-[10px]">
                    {typeFilters.length}
                  </Badge>
                )}
                <HugeiconsIcon icon={ArrowDown02Icon} data-icon="inline-end" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {ALL_TYPES.map((t) => (
                <DropdownMenuCheckboxItem
                  key={t}
                  checked={typeFilters.includes(t)}
                  onCheckedChange={() => toggleType(t)}
                >
                  {t}
                </DropdownMenuCheckboxItem>
              ))}
              {typeFilters.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setTypeFilters([])}>Clear filter</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search + add */}
          <div className="ml-auto flex items-center gap-2">
            <InputGroup className="h-8 w-56">
              <InputGroupAddon align="inline-start">
                <HugeiconsIcon icon={Search01Icon} />
              </InputGroupAddon>
              <InputGroupInput
                type="search"
                placeholder="Search suppliers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>

            <Button variant="default" size="lg">
              <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
              Add Supplier
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden [&_[data-slot=table-container]]:overflow-x-visible">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col, i) => (
                  <TableHead
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className={cn(
                      "cursor-pointer select-none hover:text-foreground transition-colors",
                      i === 0 && "pl-5"
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      {col.label}
                      <SortIcon column={col.key} sortColumn={sortColumn} sortDirection={sortDirection} />
                    </div>
                  </TableHead>
                ))}
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="py-12 text-center text-sm text-muted-foreground">
                    No suppliers found.
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((s) => (
                  <TableRow key={s.nip} className="cursor-pointer">
                    <TableCell className="pl-5 font-medium text-foreground">{s.name}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{s.nip}</TableCell>
                    <TableCell className="text-muted-foreground max-w-[200px] truncate">{s.address}</TableCell>
                    <TableCell className="text-muted-foreground">{s.contact}</TableCell>
                    <TableCell className="text-muted-foreground">{s.phone}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-[11px]", typeStyle[s.type])}>
                        {s.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                            <HugeiconsIcon icon={MoreVerticalIcon} size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                          <DropdownMenuItem>
                            <HugeiconsIcon icon={EyeIcon} size={14} />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem variant="destructive">
                            <HugeiconsIcon icon={Delete01Icon} size={14} />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex shrink-0 items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {filtered.length === 0
              ? "No results"
              : <>Showing <span className="font-medium text-foreground">{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}</span> of <span className="font-medium text-foreground">{filtered.length}</span> suppliers</>
            }
          </p>
          <Pagination className="w-auto mx-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)) }}
                  className={cn(page === 1 && "pointer-events-none opacity-40")}
                />
              </PaginationItem>
              <PaginationItem>
                <span className="px-3 text-xs text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)) }}
                  className={cn(page === totalPages && "pointer-events-none opacity-40")}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

      </div>
    </>
  )
}
