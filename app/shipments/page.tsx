"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { PageSetup } from "@/components/PageSetup"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Search01Icon,
  DeliveryTruck01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  ArrowDown02Icon,
  MoreVerticalIcon,
  EyeIcon,
  PencilEdit01Icon,
  Delete01Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { useShipments, type Shipment, type ShipmentStatus } from "@/components/ShipmentsContext"
import { ScheduleTransportDialog } from "@/components/ScheduleTransportDialog"
import { toast } from "sonner"

const PAGE_SIZE = 16

type SortDirection = "asc" | "desc"
type SortColumn = "id" | "client" | "destination" | "carrier" | "date" | "status"

const ALL_STATUSES: ShipmentStatus[] = [
  "Nowe", "Przygotowywane", "Do wysłania", "Oczekująca", "W transporcie", "Wstrzymane", "Dostarczone",
]
const STATUS_LABELS: Record<ShipmentStatus, string> = {
  "Nowe": "Nowe", "Przygotowywane": "Przygotowywane", "Do wysłania": "Do wysłania",
  "Oczekująca": "Oczekująca", "W transporcie": "W transporcie", "Wstrzymane": "Wstrzymane", "Dostarczone": "Dostarczone",
}
const ALL_CARRIERS = ["DPD", "DHL", "Geodis", "InPost", "GLS"]

// Opacity-based colors — work in both light and dark mode
const statusStyle: Record<ShipmentStatus, string> = {
  "Nowe":           "bg-violet-500/10 text-violet-400 border-violet-500/20",
  "Przygotowywane": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Do wysłania":    "bg-sky-500/10 text-sky-400 border-sky-500/20",
  "Oczekująca":     "bg-zinc-500/10 text-muted-foreground border-zinc-500/20",
  "W transporcie":  "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Wstrzymane":     "bg-red-500/10 text-red-400 border-red-500/20",
  "Dostarczone":    "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
}

const accentColor: Record<ShipmentStatus, string> = {
  "Nowe":           "bg-violet-400",
  "Przygotowywane": "bg-amber-400",
  "Do wysłania":    "bg-sky-400",
  "Oczekująca":     "bg-muted-foreground/40",
  "W transporcie":  "bg-blue-400",
  "Wstrzymane":     "bg-red-400",
  "Dostarczone":    "bg-emerald-400",
}

const columns: { key: SortColumn; label: string }[] = [
  { key: "id",          label: "Shipment ID" },
  { key: "client",      label: "Client" },
  { key: "destination", label: "Destination" },
  { key: "carrier",     label: "Carrier" },
  { key: "date",        label: "Date" },
  { key: "status",      label: "Status" },
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

function ShipmentsPageInner() {
  const { shipments, deleteShipment } = useShipments()
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [statusFilters, setStatusFilters] = useState<ShipmentStatus[]>([])
  const [carrierFilters, setCarrierFilters] = useState<string[]>([])
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "")
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<Shipment | null>(null)

  useEffect(() => { setPage(1) }, [statusFilters, carrierFilters, search, sortColumn, sortDirection])

  function handleSort(column: SortColumn) {
    if (sortColumn === column) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  function toggleStatus(status: ShipmentStatus) {
    setStatusFilters((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    )
  }

  function toggleCarrier(carrier: string) {
    setCarrierFilters((prev) =>
      prev.includes(carrier) ? prev.filter((c) => c !== carrier) : [...prev, carrier]
    )
  }

  const filtered = useMemo(() => {
    let rows = shipments
    if (statusFilters.length > 0) rows = rows.filter((s) => statusFilters.includes(s.status))
    if (carrierFilters.length > 0) rows = rows.filter((s) => carrierFilters.includes(s.carrier))
    if (search) {
      const q = search.toLowerCase()
      rows = rows.filter(
        (s) =>
          s.id.toLowerCase().includes(q) ||
          s.client.toLowerCase().includes(q) ||
          s.destination.toLowerCase().includes(q)
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
  }, [shipments, statusFilters, carrierFilters, search, sortColumn, sortDirection])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <>
      <PageSetup title="Shipments" icon={DeliveryTruck01Icon} />

      <div className="flex flex-col gap-4 p-8">

        {/* Filter bar */}
        <div className="flex shrink-0 items-center gap-2">

          {/* Status multi-select */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="lg">
                Status
                {statusFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-1 rounded-full px-1.5 text-[10px]">
                    {statusFilters.length}
                  </Badge>
                )}
                <HugeiconsIcon icon={ArrowDown02Icon} data-icon="inline-end" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44">
              {ALL_STATUSES.map((s) => (
                <DropdownMenuCheckboxItem
                  key={s}
                  checked={statusFilters.includes(s)}
                  onCheckedChange={() => toggleStatus(s)}
                >
                  {STATUS_LABELS[s]}
                </DropdownMenuCheckboxItem>
              ))}
              {statusFilters.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStatusFilters([])}>
                    Clear filter
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Carrier multi-select */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="lg">
                Carrier
                {carrierFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-1 rounded-full px-1.5 text-[10px]">
                    {carrierFilters.length}
                  </Badge>
                )}
                <HugeiconsIcon icon={ArrowDown02Icon} data-icon="inline-end" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-36">
              {ALL_CARRIERS.map((c) => (
                <DropdownMenuCheckboxItem
                  key={c}
                  checked={carrierFilters.includes(c)}
                  onCheckedChange={() => toggleCarrier(c)}
                >
                  {c}
                </DropdownMenuCheckboxItem>
              ))}
              {carrierFilters.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setCarrierFilters([])}>
                    Clear filter
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search — InputGroup matches h-9 button height */}
          <div className="ml-auto">
            <InputGroup className="h-8 w-56">
              <InputGroupAddon align="inline-start">
                <HugeiconsIcon icon={Search01Icon} />
              </InputGroupAddon>
              <InputGroupInput
                type="search"
                placeholder="Search shipments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>
          </div>

          <ScheduleTransportDialog />
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden [&_[data-slot=table-container]]:overflow-x-visible">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-3 p-0" />
                {columns.map((col) => (
                  <TableHead
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="cursor-pointer select-none hover:text-foreground transition-colors"
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
                  <TableCell colSpan={columns.length + 2} className="py-12 text-center text-sm text-muted-foreground">
                    Brak transportów.
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((s) => (
                  <TableRow key={s.id} className="cursor-pointer">
                    <TableCell className="p-0 w-3">
                      <div className={cn("h-full w-[3px] min-h-[44px] rounded-r-full", accentColor[s.status])} />
                    </TableCell>
                    <TableCell className="font-mono text-xs font-medium text-muted-foreground">{s.id}</TableCell>
                    <TableCell className="font-medium text-foreground">{s.client}</TableCell>
                    <TableCell className="text-muted-foreground max-w-[200px] truncate">{s.destination}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[11px]">
                        {s.carrier}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{s.date}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-[11px]", statusStyle[s.status])}>
                        {STATUS_LABELS[s.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <HugeiconsIcon icon={MoreVerticalIcon} size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                          <DropdownMenuItem>
                            <HugeiconsIcon icon={EyeIcon} size={14} />
                            Podgląd
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
                            Edytuj
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => setDeleteTarget(s)}
                          >
                            <HugeiconsIcon icon={Delete01Icon} size={14} />
                            Usuń
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
              ? "Brak wyników"
              : <>Wyświetlono <span className="font-medium text-foreground">{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}</span> z <span className="font-medium text-foreground">{filtered.length}</span> transportów</>
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

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <HugeiconsIcon icon={Delete01Icon} size={16} />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete shipment?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The shipment will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                deleteShipment(deleteTarget!.id)
                setDeleteTarget(null)
                toast.success("Przesyłka została usunięta.")
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </>
  )
}

export default function ShipmentsPage() {
  return <Suspense><ShipmentsPageInner /></Suspense>
}
