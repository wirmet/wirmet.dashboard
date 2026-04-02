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
  Search01Icon,
  Store01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  ArrowDown02Icon,
  MoreVerticalIcon,
  PencilEdit01Icon,
  Delete01Icon,
  Settings01Icon,
  Add01Icon,
} from "@hugeicons/core-free-icons"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import { useSuppliers, type Supplier } from "@/components/SuppliersContext"
import { AddSupplierDialog } from "@/components/AddSupplierDialog"
import { EditSupplierDialog } from "@/components/EditSupplierDialog"
import { SupplierTypesModal } from "@/components/SupplierTypesModal"
import { toast } from "sonner"

type SortDirection = "asc" | "desc"
type SortColumn = "name" | "nip" | "address" | "contact" | "phone"

const PAGE_SIZE = 16

const columns: { key: SortColumn; label: string }[] = [
  { key: "name",    label: "Firma" },
  { key: "nip",     label: "NIP" },
  { key: "address", label: "Adres" },
  { key: "contact", label: "Kontakt" },
  { key: "phone",   label: "Telefon" },
]

function SortIcon({ column, sortColumn, sortDirection }: {
  column: SortColumn
  sortColumn: SortColumn | null
  sortDirection: SortDirection
}) {
  const isActive = sortColumn === column
  return (
    <span className="flex flex-col gap-px">
      <HugeiconsIcon icon={ArrowUp01Icon}   size={10} className={isActive && sortDirection === "asc"  ? "text-foreground" : "text-muted-foreground/40"} />
      <HugeiconsIcon icon={ArrowDown01Icon} size={10} className={isActive && sortDirection === "desc" ? "text-foreground" : "text-muted-foreground/40"} />
    </span>
  )
}

export default function SuppliersPage() {
  const { suppliers, supplierTypes, deleteSupplier, getType } = useSuppliers()

  const [sortColumn,     setSortColumn]     = useState<SortColumn | null>(null)
  const [sortDirection,  setSortDirection]  = useState<SortDirection>("asc")
  const [typeFilters,    setTypeFilters]    = useState<string[]>([])   // type ids
  const [search,         setSearch]         = useState("")
  const [page,           setPage]           = useState(1)
  const [typesModalOpen,  setTypesModalOpen]  = useState(false)
  const [editSupplier,    setEditSupplier]    = useState<Supplier | null>(null)
  const [deleteCandidate, setDeleteCandidate] = useState<Supplier | null>(null)

  useEffect(() => { setPage(1) }, [typeFilters, search, sortColumn, sortDirection])

  // Drop stale filters when types are deleted
  useEffect(() => {
    const validIds = new Set(supplierTypes.map((t) => t.id))
    setTypeFilters((prev) => prev.filter((id) => validIds.has(id)))
  }, [supplierTypes])

  function handleSort(column: SortColumn) {
    if (sortColumn === column) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  function toggleType(id: string) {
    setTypeFilters((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    )
  }

  function confirmDelete() {
    if (!deleteCandidate) return
    deleteSupplier(deleteCandidate.id)
    toast.success(`Usunięto dostawcę: ${deleteCandidate.name}`)
    setDeleteCandidate(null)
  }

  const filtered = useMemo(() => {
    let rows = suppliers
    if (typeFilters.length > 0) rows = rows.filter((s) => typeFilters.includes(s.typeId))
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
      const valA = (a[sortColumn] ?? "").toLowerCase()
      const valB = (b[sortColumn] ?? "").toLowerCase()
      if (valA < valB) return sortDirection === "asc" ? -1 : 1
      if (valA > valB) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [suppliers, typeFilters, search, sortColumn, sortDirection])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <>
      <PageSetup title="Dostawcy" icon={Store01Icon} />

      <div className="flex flex-col gap-4 p-8">

        {/* Pasek filtrów */}
        <div className="flex shrink-0 items-center gap-2">

          {/* Filtr typów — z opcją zarządzania */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="lg">
                Typ
                {typeFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-1 rounded-full px-1.5 text-[10px]">
                    {typeFilters.length}
                  </Badge>
                )}
                <HugeiconsIcon icon={ArrowDown02Icon} data-icon="inline-end" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              {supplierTypes.length === 0 ? (
                <DropdownMenuItem
                  onClick={() => setTypesModalOpen(true)}
                  className="flex items-center gap-2 text-wirmet-orange focus:text-wirmet-orange"
                >
                  <HugeiconsIcon icon={Add01Icon} size={13} />
                  Dodaj pierwszy typ…
                </DropdownMenuItem>
              ) : (
                <>
                  {supplierTypes.map((t) => (
                    <DropdownMenuCheckboxItem
                      key={t.id}
                      checked={typeFilters.includes(t.id)}
                      onCheckedChange={() => toggleType(t.id)}
                    >
                      <span className="flex items-center gap-2">
                        <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: t.color }} />
                        {t.name}
                      </span>
                    </DropdownMenuCheckboxItem>
                  ))}
                  {typeFilters.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setTypeFilters([])}>
                        Wyczyść filtr
                      </DropdownMenuItem>
                    </>
                  )}
                </>
              )}
              <DropdownMenuSeparator />
              {/* Zarządzaj typami — opens the modal */}
              <DropdownMenuItem
                onClick={() => setTypesModalOpen(true)}
                className="text-muted-foreground"
              >
                <HugeiconsIcon icon={Settings01Icon} size={13} />
                Zarządzaj typami…
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Wyszukiwarka */}
          <InputGroup className="h-8 w-56">
            <InputGroupAddon align="inline-start">
              <HugeiconsIcon icon={Search01Icon} />
            </InputGroupAddon>
            <InputGroupInput
              type="search"
              placeholder="Szukaj dostawcy…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>

          {/* Edytuj typy + dodaj — prawa strona */}
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="lg" onClick={() => setTypesModalOpen(true)}>
              <HugeiconsIcon icon={Settings01Icon} data-icon="inline-start" />
              Edytuj typy
            </Button>

            <AddSupplierDialog />
          </div>
        </div>

        {/* Tabela */}
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
                <TableHead>Typ</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 2} className="py-12 text-center text-sm text-muted-foreground">
                    Brak dostawców.
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((s) => {
                  const type = getType(s.typeId)
                  return (
                    <TableRow key={s.id} className="cursor-pointer">
                      <TableCell className="pl-5 font-medium text-foreground">{s.name}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{s.nip || "—"}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[180px] truncate">{s.address || "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{s.contact || "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{s.phone || "—"}</TableCell>
                      <TableCell>
                        {type ? (
                          <Badge
                            variant="outline"
                            className="text-[11px]"
                            style={{
                              backgroundColor: `${type.color}1a`,
                              color: type.color,
                              borderColor: `${type.color}33`,
                            }}
                          >
                            {type.name}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground/40">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right pr-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                              <HugeiconsIcon icon={MoreVerticalIcon} size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuItem onClick={() => setEditSupplier(s)}>
                              <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
                              Edytuj
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive" onClick={() => setDeleteCandidate(s)}>
                              <HugeiconsIcon icon={Delete01Icon} size={14} />
                              Usuń
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Paginacja */}
        <div className="flex shrink-0 items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {filtered.length === 0
              ? "Brak wyników"
              : <>Wyświetlono <span className="font-medium text-foreground">{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}</span> z <span className="font-medium text-foreground">{filtered.length}</span> dostawców</>
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
                  Strona {page} z {totalPages}
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

      {/* Types management modal */}
      <SupplierTypesModal open={typesModalOpen} onOpenChange={setTypesModalOpen} />

      <EditSupplierDialog
        supplier={editSupplier}
        open={editSupplier !== null}
        onOpenChange={(open) => { if (!open) setEditSupplier(null) }}
      />

      {/* Potwierdzenie usunięcia */}
      <AlertDialog open={deleteCandidate !== null} onOpenChange={(open) => { if (!open) setDeleteCandidate(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usunąć dostawcę?</AlertDialogTitle>
            <AlertDialogDescription>
              Czy na pewno chcesz usunąć <span className="font-medium text-foreground">{deleteCandidate?.name}</span>? Tej operacji nie można cofnąć.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Usuń
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
