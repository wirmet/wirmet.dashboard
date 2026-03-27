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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
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
  Add01Icon,
  Search01Icon,
  DeliveryTruck01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  MoreVerticalIcon,
  EyeIcon,
  PencilEdit01Icon,
  Delete01Icon,
  Upload01Icon,
  Cancel01Icon,
  File01Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

type ShipmentStatus = "In transit" | "Delivered" | "Pending"
type SortDirection = "asc" | "desc"
type SortColumn = "id" | "client" | "destination" | "carrier" | "date" | "status"

interface Shipment {
  id: string
  client: string
  destination: string
  carrier: string
  date: string
  status: ShipmentStatus
}

const initialShipments: Shipment[] = [
  { id: "#SHP-0321", client: "Marek Wiśniewski",     destination: "ul. Marszałkowska 12, Warszawa",  carrier: "DPD",    date: "2025-03-18", status: "Pending"    },
  { id: "#SHP-0319", client: "TechBuild S.A.",        destination: "ul. Gdańska 11, Gdańsk",          carrier: "DHL",    date: "2025-03-16", status: "In transit" },
  { id: "#SHP-0317", client: "Nowak & Syn Budowa",    destination: "ul. Poznańska 22, Poznań",        carrier: "DPD",    date: "2025-03-15", status: "Pending"    },
  { id: "#SHP-0315", client: "Piotr Zając",           destination: "ul. Wrocławska 7, Wrocław",       carrier: "GLS",    date: "2025-03-14", status: "In transit" },
  { id: "#SHP-0312", client: "Marek Wiśniewski",     destination: "ul. Fabryczna 3, Piaseczno",      carrier: "DPD",    date: "2025-03-12", status: "In transit" },
  { id: "#SHP-0309", client: "Agnieszka Kowalska",   destination: "ul. Krakowska 3, Kraków",         carrier: "InPost", date: "2025-03-10", status: "Delivered"  },
  { id: "#SHP-0306", client: "TechBuild S.A.",        destination: "ul. Stalowa 18, Gdańsk",          carrier: "DHL",    date: "2025-03-08", status: "Delivered"  },
  { id: "#SHP-0303", client: "Joanna Lewandowska",   destination: "ul. Łódzka 5, Łódź",             carrier: "GLS",    date: "2025-03-06", status: "Delivered"  },
  { id: "#SHP-0298", client: "Piotr Zając",           destination: "ul. Hutnicza 9, Tychy",           carrier: "InPost", date: "2025-03-03", status: "Delivered"  },
  { id: "#SHP-0294", client: "Nowak & Syn Budowa",    destination: "ul. Wały Jagiellońskie 1, Gdańsk",carrier: "DPD",    date: "2025-02-28", status: "Delivered"  },
  { id: "#SHP-0291", client: "Agnieszka Kowalska",   destination: "ul. Różana 12, Kraków",           carrier: "DHL",    date: "2025-02-25", status: "Delivered"  },
  { id: "#SHP-0287", client: "Marek Wiśniewski",     destination: "ul. Marszałkowska 12, Warszawa",  carrier: "DPD",    date: "2025-02-20", status: "Delivered"  },
  { id: "#SHP-0283", client: "TechBuild S.A.",        destination: "ul. Przemysłowa 44, Gdańsk",      carrier: "GLS",    date: "2025-02-14", status: "Delivered"  },
  { id: "#SHP-0279", client: "Joanna Lewandowska",   destination: "ul. Piotrkowska 120, Łódź",      carrier: "InPost", date: "2025-02-08", status: "Delivered"  },
]

const statusStyle: Record<ShipmentStatus, string> = {
  "In transit": "bg-blue-50 text-blue-700 border-blue-200",
  "Delivered":  "bg-green-50 text-green-700 border-green-200",
  "Pending":    "bg-zinc-100 text-zinc-500 border-zinc-200",
}

const accentColor: Record<ShipmentStatus, string> = {
  "In transit": "bg-blue-400",
  "Delivered":  "bg-green-400",
  "Pending":    "bg-zinc-300",
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
  const [shipments, setShipments] = useState<Shipment[]>(initialShipments)
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

  // — Add Shipment modal —
  const emptyForm = { client: "", destination: "", carrier: "", date: "", status: "Pending" as ShipmentStatus }
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [clientError, setClientError] = useState(false)
  const [labelFile, setLabelFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleOpenChange(open: boolean) {
    setAddOpen(open)
    if (!open) { setForm(emptyForm); setClientError(false); setLabelFile(null) }
  }

  function handleSubmit() {
    if (!form.client.trim()) { setClientError(true); return }
    const nextNum = String(Math.max(...shipments.map((s) => parseInt(s.id.replace("#SHP-", "")))) + 1).padStart(4, "0")
    setShipments((prev) => [{ id: `#SHP-${nextNum}`, ...form }, ...prev])
    handleOpenChange(false)
  }

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
            <option value="In transit">In transit</option>
            <option value="Delivered">Delivered</option>
            <option value="Pending">Pending</option>
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
            <Button variant="default" size="lg" onClick={() => setAddOpen(true)}>
              <HugeiconsIcon icon={Add01Icon} size={14} />
              Add Shipment
            </Button>
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
                setShipments((prev) => prev.filter((x) => x.id !== deleteTarget!.id))
                setDeleteTarget(null)
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Shipment modal */}
      <Dialog open={addOpen} onOpenChange={handleOpenChange}>
        <DialogContent
          className="sm:max-w-lg bg-white text-zinc-900"
          style={{
            "--ring": "oklch(0.922 0 0)",
            "--border": "oklch(0.922 0 0)",
            "--muted-foreground": "oklch(0.556 0 0)",
          } as React.CSSProperties}
        >
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-zinc-900">New Shipment</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-x-4 gap-y-4 py-2">

            {/* Client — required */}
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-600">
                Client <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Marek Wiśniewski"
                value={form.client}
                onChange={(e) => { setForm((f) => ({ ...f, client: e.target.value })); setClientError(false) }}
                className={cn("h-9 bg-white text-sm text-zinc-900 placeholder:text-zinc-400", clientError ? "border-red-400" : "border-zinc-200")}
              />
              {clientError
                ? <p className="text-[11px] text-red-500">Client name is required.</p>
                : <p className="text-[11px] text-zinc-400">Full name or company of the recipient.</p>
              }
            </div>

            {/* Destination */}
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-600">Destination address</label>
              <Input
                placeholder="ul. Przykładowa 1, Warszawa"
                value={form.destination}
                onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))}
                className="h-9 border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400"
              />
            </div>

            {/* Carrier */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-600">Carrier</label>
              <select
                value={form.carrier}
                onChange={(e) => setForm((f) => ({ ...f, carrier: e.target.value }))}
                className={cn(selectClass, "w-full")}
                style={selectChevron}
              >
                <option value="">Select carrier</option>
                <option>DPD</option>
                <option>DHL</option>
                <option>InPost</option>
                <option>GLS</option>
              </select>
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-600">Shipping date</label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="h-9 border-zinc-200 bg-white text-sm text-zinc-900"
              />
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-600">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as ShipmentStatus }))}
                className={cn(selectClass, "w-full")}
                style={selectChevron}
              >
                <option value="Pending">Pending</option>
                <option value="In transit">In transit</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            {/* Shipping label attachment */}
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-600">Shipping label</label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.zpl"
                className="hidden"
                onChange={(e) => setLabelFile(e.target.files?.[0] ?? null)}
              />
              {labelFile ? (
                <div className="flex items-center gap-3 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2">
                  <HugeiconsIcon icon={File01Icon} size={16} className="shrink-0 text-zinc-400" />
                  <span className="flex-1 truncate text-xs text-zinc-700">{labelFile.name}</span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="shrink-0 text-zinc-400 hover:text-zinc-600"
                    onClick={() => { setLabelFile(null); if (fileInputRef.current) fileInputRef.current.value = "" }}
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={14} />
                  </Button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-20 w-full flex-col items-center justify-center gap-1.5 rounded-md border border-dashed border-zinc-300 bg-zinc-50 text-zinc-400 transition-colors hover:border-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
                >
                  <HugeiconsIcon icon={Upload01Icon} size={18} />
                  <span className="text-xs font-medium">Click to upload label</span>
                  <span className="text-[11px]">PDF, PNG, JPG, ZPL</span>
                </button>
              )}
              <p className="text-[11px] text-zinc-400">Attach the shipping label to be printed or sent to the carrier.</p>
            </div>

          </div>

          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline" size="lg">Cancel</Button>
            </DialogClose>
            <Button variant="default" size="lg" onClick={handleSubmit}>
              Add Shipment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
