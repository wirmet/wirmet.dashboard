"use client"

import { useState, useMemo, useEffect, useRef } from "react"
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
import {
  DropdownMenu,
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
  MoreVerticalIcon,
  EyeIcon,
  PencilEdit01Icon,
  Delete01Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { useShipments, type Shipment, type ShipmentStatus } from "@/components/ShipmentsContext"
import { ScheduleTransportDialog } from "@/components/ScheduleTransportDialog"

type SortDirection = "asc" | "desc"
type SortColumn = "id" | "client" | "destination" | "carrier" | "date" | "status"

const statusStyle: Record<ShipmentStatus, string> = {
  "Nowe":           "bg-violet-50 text-violet-700 border-violet-200",
  "Przygotowywane": "bg-amber-50 text-amber-700 border-amber-200",
  "Do wysłania":    "bg-sky-50 text-sky-700 border-sky-200",
  "Pending":        "bg-zinc-100 text-zinc-500 border-zinc-200",
  "In transit":     "bg-blue-50 text-blue-700 border-blue-200",
  "Wstrzymane":     "bg-red-50 text-red-700 border-red-200",
  "Delivered":      "bg-green-50 text-green-700 border-green-200",
}

const accentColor: Record<ShipmentStatus, string> = {
  "Nowe":           "bg-violet-400",
  "Przygotowywane": "bg-amber-400",
  "Do wysłania":    "bg-sky-400",
  "Pending":        "bg-zinc-300",
  "In transit":     "bg-blue-400",
  "Wstrzymane":     "bg-red-400",
  "Delivered":      "bg-green-400",
}

const columns: { key: SortColumn; label: string }[] = [
  { key: "id",          label: "Shipment ID" },
  { key: "client",      label: "Client" },
  { key: "destination", label: "Destination" },
  { key: "carrier",     label: "Carrier" },
  { key: "date",        label: "Date" },
  { key: "status",      label: "Status" },
]

const selectClass = "h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-600 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-200 appearance-none pr-8 cursor-pointer"
const selectChevron = {
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat" as const,
  backgroundPosition: "right 10px center",
}

function SortIcon({ column, sortColumn, sortDirection }: {
  column: SortColumn
  sortColumn: SortColumn | null
  sortDirection: SortDirection
}) {
  const isActive = sortColumn === column
  return (
    <span className="flex flex-col gap-px">
      <HugeiconsIcon icon={ArrowUp01Icon} size={10} className={isActive && sortDirection === "asc" ? "text-zinc-700" : "text-zinc-400"} />
      <HugeiconsIcon icon={ArrowDown01Icon} size={10} className={isActive && sortDirection === "desc" ? "text-zinc-700" : "text-zinc-400"} />
    </span>
  )
}

const TABLE_HEADER_HEIGHT = 41 // px — approximate height of the <thead> row
const ROW_HEIGHT = 45           // px — approximate height of each <tbody> row

export default function ShipmentsPage() {
  const { shipments, addShipment, deleteShipment } = useShipments()
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [statusFilter, setStatusFilter] = useState("")
  const [carrierFilter, setCarrierFilter] = useState("")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [rowHeight, setRowHeight] = useState(ROW_HEIGHT)
  const tableWrapperRef = useRef<HTMLDivElement>(null)
  const [deleteTarget, setDeleteTarget] = useState<Shipment | null>(null)

  // Dynamically calculate how many rows fit and lock in that row height
  useEffect(() => {
    const el = tableWrapperRef.current
    if (!el) return
    const calculate = () => {
      const available = el.clientHeight - TABLE_HEADER_HEIGHT
      const rows = Math.max(1, Math.floor(available / ROW_HEIGHT))
      setPageSize(rows)
      setRowHeight(Math.floor(available / rows)) // exact height so rows fill the container
    }
    const observer = new ResizeObserver(calculate)
    observer.observe(el)
    calculate()
    return () => observer.disconnect()
  }, [])

  // Reset to first page whenever filters or page size change
  useEffect(() => { setPage(1) }, [statusFilter, carrierFilter, search, sortColumn, sortDirection, pageSize])

  function handleSort(column: SortColumn) {
    if (sortColumn === column) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const filtered = useMemo(() => {
    let rows = shipments
    if (statusFilter) rows = rows.filter((s) => s.status === statusFilter)
    if (carrierFilter) rows = rows.filter((s) => s.carrier === carrierFilter)
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
  }, [shipments, statusFilter, carrierFilter, search, sortColumn, sortDirection])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <>
      <PageSetup title="Shipments" icon={DeliveryTruck01Icon} />

      <div className="flex h-full flex-col gap-4 p-8">

        {/* Filter bar — fixed height */}
        <div className="flex shrink-0 items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={selectClass}
            style={selectChevron}
          >
            <option value="">All statuses</option>
            <option value="Nowe">Nowe</option>
            <option value="Przygotowywane">Przygotowywane</option>
            <option value="Do wysłania">Do wysłania</option>
            <option value="Pending">Oczekuje</option>
            <option value="In transit">W drodze</option>
            <option value="Wstrzymane">Wstrzymane</option>
            <option value="Delivered">Dostarczone</option>
          </select>

          <select
            value={carrierFilter}
            onChange={(e) => setCarrierFilter(e.target.value)}
            className={selectClass}
            style={selectChevron}
          >
            <option value="">All carriers</option>
            <option>DPD</option>
            <option>DHL</option>
            <option>InPost</option>
            <option>GLS</option>
          </select>

          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <HugeiconsIcon
                icon={Search01Icon}
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
              />
              <Input
                type="search"
                placeholder="Search shipments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-56 rounded-md border border-zinc-200 bg-white pl-8 pr-3 text-sm text-zinc-600 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              />
            </div>
            <ScheduleTransportDialog />
          </div>
        </div>

        {/* Table — fills remaining height; fixed row height consistent across pages */}
        <div ref={tableWrapperRef} className="flex-1 min-h-0 rounded-xl border border-zinc-200 bg-white overflow-hidden [&_[data-slot=table-container]]:overflow-x-visible">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-3 p-0" />
                {columns.map((col) => (
                  <TableHead
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="cursor-pointer select-none hover:text-zinc-600 transition-colors"
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
                  <TableCell colSpan={columns.length + 2} className="py-12 text-center text-sm text-zinc-400">
                    No shipments found.
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((s) => (
                  <TableRow key={s.id} style={{ height: rowHeight }} className="cursor-pointer">
                    <TableCell className="p-0 w-3">
                      <div className={cn("h-full w-[3px] min-h-[44px] rounded-r-full", accentColor[s.status])} />
                    </TableCell>
                    <TableCell className="font-mono text-xs font-medium text-zinc-700">{s.id}</TableCell>
                    <TableCell className="font-medium text-zinc-900">{s.client}</TableCell>
                    <TableCell className="text-zinc-500 max-w-[200px] truncate">{s.destination}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-600">
                        {s.carrier}
                      </span>
                    </TableCell>
                    <TableCell className="text-zinc-500">{s.date}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-[11px]", statusStyle[s.status])}>
                        {s.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-zinc-400 hover:text-zinc-600"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <HugeiconsIcon icon={MoreVerticalIcon} size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-36 border border-zinc-200"
                          style={{
                            "--popover": "oklch(1 0 0)",
                            "--popover-foreground": "oklch(0.145 0 0)",
                            "--accent": "oklch(0.97 0 0)",
                            "--accent-foreground": "oklch(0.205 0 0)",
                            "--border": "oklch(0.922 0 0)",
                          } as React.CSSProperties}
                        >
                          <DropdownMenuItem>
                            <HugeiconsIcon icon={EyeIcon} size={14} />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => setDeleteTarget(s)}
                          >
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

        {/* Pagination bar — pinned at bottom */}
        <div className="flex shrink-0 items-center justify-between">
          <p className="text-xs text-zinc-400">
            {filtered.length === 0
              ? "No results"
              : <>Showing <span className="font-medium text-zinc-600">{(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)}</span> of <span className="font-medium text-zinc-600">{filtered.length}</span> shipments</>
            }
          </p>
          <Pagination className="w-auto mx-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)) }}
                  className={cn(
                    "rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50 transition-colors",
                    page === 1 && "pointer-events-none opacity-40"
                  )}
                />
              </PaginationItem>
              <PaginationItem>
                <span className="px-3 text-xs text-zinc-500">
                  Page {page} of {totalPages}
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)) }}
                  className={cn(
                    "rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50 transition-colors",
                    page === totalPages && "pointer-events-none opacity-40"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

      </div>

      {/* Delete Shipment confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
      >
        <AlertDialogContent size="sm" style={{ "--background": "oklch(1 0 0)", "--foreground": "oklch(0.145 0 0)", "--muted-foreground": "oklch(0.556 0 0)", "--border": "oklch(0.922 0 0)" } as React.CSSProperties}>
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
