"use client"

import { useState, useMemo, useEffect } from "react"
import { PageSetup } from "@/components/PageSetup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Search01Icon,
  UserIcon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  ArrowDown02Icon,
  MoreVerticalIcon,
  EyeIcon,
  PencilEdit01Icon,
  Delete01Icon,
  Mail01Icon,
  SmartPhone01Icon,
  Location01Icon,
  Building01Icon,
  Invoice01Icon,
  DeliveryTruck01Icon,
  Briefcase01Icon,
  Cancel01Icon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { useCustomers, type Customer } from "@/components/CustomersContext"
import { AddCustomerDialog } from "@/components/AddCustomerDialog"
import { toast } from "sonner"

type SortDirection = "asc" | "desc"
type SortColumn = "name" | "company" | "nip" | "contact" | "phone" | "email"

// — Mock relational data —

interface CustomerProject { id: string; customerId: string; name: string; status: "In progress" | "Completed" | "On hold"; value: string; date: string }
interface CustomerOffer   { id: string; customerId: string; name: string; status: "Sent" | "Accepted" | "Pending" | "Rejected"; value: string; date: string }
interface CustomerShipment{ id: string; customerId: string; label: string; status: "Delivered" | "In transit" | "Pending"; date: string }

const mockProjects: CustomerProject[] = [
  { id: "p1",  customerId: "1", name: "Remont biurowca — ul. Marszałkowska 12",      status: "In progress", value: "84 500 PLN",  date: "2025-01-10" },
  { id: "p2",  customerId: "1", name: "Fundamenty hali magazynowej — Piaseczno",     status: "Completed",   value: "32 000 PLN",  date: "2024-09-03" },
  { id: "p3",  customerId: "1", name: "Instalacja HVAC — budynek administracyjny",   status: "On hold",     value: "18 200 PLN",  date: "2025-03-02" },
  { id: "p4",  customerId: "2", name: "Wykończenie wnętrz — apartament 4B",          status: "In progress", value: "21 000 PLN",  date: "2025-02-20" },
  { id: "p5",  customerId: "2", name: "Malowanie klatki schodowej — blok nr 7",      status: "Completed",   value: "4 800 PLN",   date: "2025-01-05" },
  { id: "p6",  customerId: "3", name: "Pokrycie dachowe — hala przemysłowa Tychy",   status: "On hold",     value: "57 200 PLN",  date: "2025-03-01" },
  { id: "p7",  customerId: "3", name: "Termomodernizacja — budynek mieszkalny",      status: "Completed",   value: "29 600 PLN",  date: "2024-10-18" },
  { id: "p8",  customerId: "4", name: "Instalacja elektryczna — segment B",          status: "Completed",   value: "14 800 PLN",  date: "2024-11-15" },
  { id: "p9",  customerId: "4", name: "Montaż stolarki okiennej — 24 szt.",         status: "In progress", value: "22 400 PLN",  date: "2025-02-28" },
  { id: "p10", customerId: "5", name: "Konstrukcja stalowa — zakład produkcyjny",    status: "In progress", value: "120 000 PLN", date: "2025-02-01" },
  { id: "p11", customerId: "5", name: "Posadzki przemysłowe — hala nr 3",            status: "In progress", value: "38 500 PLN",  date: "2025-02-14" },
  { id: "p12", customerId: "6", name: "Audyt budowlany — kompleks magazynowy",       status: "Completed",   value: "6 000 PLN",   date: "2025-01-22" },
]

const mockOffers: CustomerOffer[] = [
  { id: "o1",  customerId: "1", name: "Oferta #2024/087 — Remont biurowca",          status: "Accepted", value: "84 500 PLN",  date: "2024-12-20" },
  { id: "o2",  customerId: "1", name: "Oferta #2025/012 — Rozbudowa skrzydła B",     status: "Pending",  value: "46 000 PLN",  date: "2025-02-28" },
  { id: "o3",  customerId: "1", name: "Oferta #2025/031 — Instalacja HVAC",          status: "Sent",     value: "18 200 PLN",  date: "2025-03-01" },
  { id: "o4",  customerId: "2", name: "Oferta #2025/003 — Wykończenie wnętrz",       status: "Accepted", value: "21 000 PLN",  date: "2025-01-15" },
  { id: "o5",  customerId: "2", name: "Oferta #2025/019 — Łazienka i kuchnia",       status: "Pending",  value: "9 300 PLN",   date: "2025-03-05" },
  { id: "o6",  customerId: "3", name: "Oferta #2025/018 — Pokrycie dachu",           status: "Sent",     value: "57 200 PLN",  date: "2025-02-10" },
  { id: "o7",  customerId: "3", name: "Oferta #2024/061 — Roboty ziemne",            status: "Rejected", value: "18 500 PLN",  date: "2024-10-05" },
  { id: "o8",  customerId: "4", name: "Oferta #2024/099 — Instalacja elektryczna",   status: "Accepted", value: "14 800 PLN",  date: "2024-10-22" },
  { id: "o9",  customerId: "4", name: "Oferta #2025/024 — Stolarka okienna",         status: "Accepted", value: "22 400 PLN",  date: "2025-02-10" },
  { id: "o10", customerId: "5", name: "Oferta #2025/021 — Konstrukcja stalowa",      status: "Accepted", value: "120 000 PLN", date: "2025-01-28" },
  { id: "o11", customerId: "5", name: "Oferta #2025/028 — Posadzki przemysłowe",     status: "Accepted", value: "38 500 PLN",  date: "2025-02-03" },
  { id: "o12", customerId: "6", name: "Oferta #2025/009 — Audyt budowlany",          status: "Sent",     value: "8 000 PLN",   date: "2025-02-05" },
]

const mockShipments: CustomerShipment[] = [
  { id: "sh1",  customerId: "1", label: "Belki stalowe HEA 200 — 2,4 t",            status: "Delivered",  date: "2025-01-18" },
  { id: "sh2",  customerId: "1", label: "Cement portlandzki CEM I — 50 worków",     status: "In transit", date: "2025-03-10" },
  { id: "sh3",  customerId: "1", label: "Cegła klinkierowa — 1 200 szt.",           status: "Pending",    date: "2025-03-18" },
  { id: "sh4",  customerId: "2", label: "Płyty gipsowo-kartonowe — 80 szt.",        status: "Delivered",  date: "2025-02-25" },
  { id: "sh5",  customerId: "2", label: "Farba elewacyjna — 40 wiader",             status: "Delivered",  date: "2025-01-08" },
  { id: "sh6",  customerId: "3", label: "Dachówka ceramiczna — 1 paleta",           status: "Pending",    date: "2025-03-15" },
  { id: "sh7",  customerId: "3", label: "Membrana dachowa — 500 m²",               status: "In transit", date: "2025-03-12" },
  { id: "sh8",  customerId: "4", label: "Kabel elektryczny YKY 3×4 — 300 m",       status: "Delivered",  date: "2024-11-20" },
  { id: "sh9",  customerId: "4", label: "Okna PVC 3-szybowe — 24 szt.",            status: "In transit", date: "2025-03-06" },
  { id: "sh10", customerId: "5", label: "Profile stalowe RHS 100×100 — 5 t",       status: "In transit", date: "2025-03-08" },
  { id: "sh11", customerId: "5", label: "Śruby konstrukcyjne M20 — komplet",       status: "Delivered",  date: "2025-02-12" },
  { id: "sh12", customerId: "6", label: "Sprzęt pomiarowy — wypożyczenie",         status: "Delivered",  date: "2025-01-24" },
]

// Opacity-based colors — work in both light and dark mode
const offerStatusStyle: Record<CustomerOffer["status"], string> = {
  Accepted: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Sent:     "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Pending:  "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Rejected: "bg-red-500/10 text-red-400 border-red-500/20",
}
const offerAccentColor: Record<CustomerOffer["status"], string> = {
  Accepted: "bg-emerald-400",
  Sent:     "bg-blue-400",
  Pending:  "bg-amber-400",
  Rejected: "bg-red-400",
}
const projectStatusStyle: Record<CustomerProject["status"], string> = {
  "In progress": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Completed":   "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  "On hold":     "bg-zinc-500/10 text-muted-foreground border-zinc-500/20",
}
const shipmentStatusStyle: Record<CustomerShipment["status"], string> = {
  Delivered:    "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  "In transit": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Pending:      "bg-zinc-500/10 text-muted-foreground border-zinc-500/20",
}
const shipmentAccentColor: Record<CustomerShipment["status"], string> = {
  Delivered:    "bg-emerald-400",
  "In transit": "bg-blue-400",
  Pending:      "bg-muted-foreground/40",
}

// Deterministic soft avatar color based on first character
const avatarColors = [
  "bg-blue-500/10 text-blue-400",
  "bg-violet-500/10 text-violet-400",
  "bg-amber-500/10 text-amber-400",
  "bg-emerald-500/10 text-emerald-500",
  "bg-rose-500/10 text-rose-400",
  "bg-cyan-500/10 text-cyan-400",
]
function avatarColor(name: string) {
  return avatarColors[name.charCodeAt(0) % avatarColors.length]
}

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()
}

const PAGE_SIZE = 16

const columns: { key: SortColumn; label: string }[] = [
  { key: "name",    label: "Client" },
  { key: "company", label: "Company" },
  { key: "nip",     label: "NIP" },
  { key: "contact", label: "Contact" },
  { key: "phone",   label: "Phone" },
  { key: "email",   label: "Email" },
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

export default function CustomersPage() {
  const { customers, updateCustomer, deleteCustomer } = useCustomers()
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null)
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null)

  const emptyForm = { name: "", company: "", nip: "", address: "", contact: "", phone: "", email: "" }
  const [editForm, setEditForm] = useState(emptyForm)
  const [editNameError, setEditNameError] = useState(false)

  useEffect(() => { setPage(1) }, [search, sortColumn, sortDirection])

  function handleEditOpen(customer: Customer) {
    setEditCustomer(customer)
    setEditForm({ name: customer.name, company: customer.company, nip: customer.nip, address: customer.address, contact: customer.contact, phone: customer.phone, email: customer.email })
    setEditNameError(false)
  }

  function handleEditOpenChange(open: boolean) {
    if (!open) {
      setEditCustomer(null)
      setEditNameError(false)
    }
  }

  function handleEditSubmit() {
    if (!editForm.name.trim()) { setEditNameError(true); return }
    updateCustomer(editCustomer!.id, editForm)
    setEditCustomer(null)
    toast.success("Dane klienta zostały zaktualizowane.")
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
    let rows = customers
    if (search) {
      const q = search.toLowerCase()
      rows = rows.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.company.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q)
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
  }, [customers, search, sortColumn, sortDirection])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // — Customer detail full-width view —
  if (viewCustomer) {
    const projects  = mockProjects.filter((p) => p.customerId === viewCustomer.id)
    const offers    = mockOffers.filter((o) => o.customerId === viewCustomer.id)
    const shipments = mockShipments.filter((s) => s.customerId === viewCustomer.id)

    return (
      <>
        <PageSetup title={viewCustomer.name} icon={UserIcon} />

        <div className="p-8 flex flex-col gap-6">

          {/* Back link */}
          <Button
            variant="ghost"
            size="lg"
            onClick={() => setViewCustomer(null)}
            className="px-0 w-fit text-muted-foreground hover:bg-transparent hover:text-foreground"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} data-icon="inline-start" />
            Customers
          </Button>

          {/* Main grid: left card + projects */}
          <div className="grid grid-cols-3 gap-6 items-stretch">

            {/* Left card: identity + contact details */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">

              {/* Avatar + name + edit button */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
                <Avatar className="size-10 shrink-0">
                  <AvatarFallback className={cn("text-sm font-medium", avatarColor(viewCustomer.name))}>
                    {initials(viewCustomer.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{viewCustomer.name}</p>
                  {viewCustomer.company && <p className="text-xs text-muted-foreground truncate mt-0.5">{viewCustomer.company}</p>}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button variant="outline" size="lg" onClick={() => { setViewCustomer(null); handleEditOpen(viewCustomer) }}>
                    <HugeiconsIcon icon={PencilEdit01Icon} data-icon="inline-start" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="lg" onClick={() => setDeleteTarget(viewCustomer)}>
                    <HugeiconsIcon icon={Delete01Icon} data-icon="inline-start" />
                    Delete
                  </Button>
                </div>
              </div>

              {/* Contact details rows */}
              <Table>
                <TableBody>
                  {[
                    { icon: Building01Icon,   label: "Company",        value: viewCustomer.company },
                    { icon: Invoice01Icon,    label: "Tax ID (NIP)",   value: viewCustomer.nip, mono: true },
                    { icon: Location01Icon,   label: "Address",        value: viewCustomer.address },
                    { icon: UserIcon,         label: "Contact Person", value: viewCustomer.contact },
                    { icon: SmartPhone01Icon, label: "Phone",          value: viewCustomer.phone },
                    { icon: Mail01Icon,       label: "Email",          value: viewCustomer.email },
                  ].map((r) => (
                    <TableRow key={r.label}>
                      <TableCell className="pl-5 w-10 pr-0">
                        <HugeiconsIcon icon={r.icon} size={14} className="text-muted-foreground/40" />
                      </TableCell>
                      <TableCell className="w-28 text-xs text-muted-foreground font-medium">{r.label}</TableCell>
                      <TableCell className={cn("text-xs text-foreground break-all", r.mono && "font-mono")}>
                        {r.value || <span className="text-muted-foreground/40">—</span>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Projects — col-span-2 */}
            <Card className="col-span-2 rounded-xl border border-border bg-card ring-0 gap-0 py-0 overflow-hidden">
              <div className="flex items-center justify-between border-b border-border px-5 py-3">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Projects</span>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-transparent hover:text-foreground">View all</Button>
              </div>
              {projects.length === 0
                ? <p className="px-5 py-8 text-center text-sm text-muted-foreground">No projects yet.</p>
                : <Table className="table-fixed">
                    <colgroup>
                      <col />
                      <col style={{ width: "7rem" }} />
                      <col style={{ width: "8rem" }} />
                      <col style={{ width: "8rem" }} />
                    </colgroup>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="pl-5">Project</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projects.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="pl-5 font-medium text-foreground truncate">{p.name}</TableCell>
                          <TableCell className="text-muted-foreground">{p.date}</TableCell>
                          <TableCell className="text-foreground font-medium">{p.value}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn("text-[11px]", projectStatusStyle[p.status])}>{p.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
              }
            </Card>
          </div>

          {/* Offers + Shipments — 2-col grid */}
          <div className="grid grid-cols-2 gap-6 items-start">

            {/* Offers */}
            <Card className="rounded-xl border border-border bg-card ring-0 gap-0 py-0 overflow-hidden">
              <div className="flex items-center justify-between border-b border-border px-5 py-3">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Offers</span>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-transparent hover:text-foreground">View all</Button>
              </div>
              {offers.length === 0
                ? <p className="px-5 py-8 text-center text-sm text-muted-foreground">No offers yet.</p>
                : <div>
                    {offers.map((o, i) => (
                      <div
                        key={o.id}
                        className={cn(
                          "flex items-center gap-4 px-4 py-3 hover:bg-muted/50 transition-colors",
                          i !== offers.length - 1 && "border-b border-border"
                        )}
                      >
                        <div className={cn("h-8 w-1 shrink-0 rounded-full", offerAccentColor[o.status])} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{o.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{o.date}</p>
                        </div>
                        <div className="shrink-0 flex items-center gap-2.5">
                          <span className="text-xs font-medium text-muted-foreground">{o.value}</span>
                          <Badge variant="outline" className={cn("text-[11px]", offerStatusStyle[o.status])}>
                            {o.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
              }
            </Card>

            {/* Shipments */}
            <Card className="rounded-xl border border-border bg-card ring-0 gap-0 py-0 overflow-hidden">
              <div className="flex items-center justify-between border-b border-border px-5 py-3">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Shipments</span>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-transparent hover:text-foreground">View all</Button>
              </div>
              {shipments.length === 0
                ? <p className="px-5 py-8 text-center text-sm text-muted-foreground">No shipments yet.</p>
                : <div>
                    {shipments.map((s, i) => (
                      <div
                        key={s.id}
                        className={cn(
                          "flex items-center gap-4 px-4 py-3 hover:bg-muted/50 transition-colors",
                          i !== shipments.length - 1 && "border-b border-border"
                        )}
                      >
                        <div className={cn("h-8 w-1 shrink-0 rounded-full", shipmentAccentColor[s.status])} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{s.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{s.date}</p>
                        </div>
                        <Badge variant="outline" className={cn("shrink-0 text-[11px]", shipmentStatusStyle[s.status])}>
                          {s.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
              }
            </Card>
          </div>

        </div>

        {/* Delete confirmation (detail view) */}
        <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogMedia className="bg-destructive/10 text-destructive">
                <HugeiconsIcon icon={Delete01Icon} size={16} />
              </AlertDialogMedia>
              <AlertDialogTitle>Delete customer?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The customer will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={() => {
                  deleteCustomer(deleteTarget!.id)
                  setDeleteTarget(null)
                  setViewCustomer(null)
                  toast.success("Klient został usunięty.")
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Edit modal (detail view) */}
        <Dialog open={!!editCustomer} onOpenChange={handleEditOpenChange}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Customer</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4 py-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Full Name <span className="text-destructive">*</span></label>
                <Input placeholder="John Smith" value={editForm.name} onChange={(e) => { setEditForm((f) => ({ ...f, name: e.target.value })); setEditNameError(false) }} aria-invalid={editNameError || undefined} />
                {editNameError && <p className="text-[11px] text-destructive">Full name is required.</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Company Name</label>
                <Input placeholder="Acme Ltd." value={editForm.company} onChange={(e) => setEditForm((f) => ({ ...f, company: e.target.value }))} />
              </div>
              <div className="col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Tax ID (NIP)</label>
                <div className="flex gap-2">
                  <Input placeholder="PL 0000000000" value={editForm.nip} onChange={(e) => setEditForm((f) => ({ ...f, nip: e.target.value }))} className="font-mono" />
                  <Button variant="outline" size="lg" className="shrink-0">Fetch from GUS</Button>
                </div>
              </div>
              <div className="col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Address</label>
                <Input placeholder="123 Main St, Warsaw" value={editForm.address} onChange={(e) => setEditForm((f) => ({ ...f, address: e.target.value }))} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Contact Person</label>
                <Input placeholder="John Smith" value={editForm.contact} onChange={(e) => setEditForm((f) => ({ ...f, contact: e.target.value }))} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Phone</label>
                <Input placeholder="+48 600 000 000" value={editForm.phone} onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))} />
              </div>
              <div className="col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Email</label>
                <Input type="email" placeholder="john@company.com" value={editForm.email} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} />
              </div>
            </div>
            <DialogFooter className="pt-2">
              <DialogClose asChild>
                <Button variant="outline" size="lg">Cancel</Button>
              </DialogClose>
              <Button variant="default" size="lg" onClick={handleEditSubmit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <>
      <PageSetup title="Customers" icon={UserIcon} />

      <div className="flex flex-col gap-4 p-8">

        {/* Filter bar */}
        <div className="flex shrink-0 items-center gap-2">

          {/* Sort dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="lg">
                Sort by
                <HugeiconsIcon icon={ArrowDown02Icon} data-icon="inline-end" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              <DropdownMenuItem onClick={() => { setSortColumn("name"); setSortDirection("asc") }}>Name A–Z</DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortColumn("name"); setSortDirection("desc") }}>Name Z–A</DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortColumn("company"); setSortDirection("asc") }}>Company A–Z</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { setSortColumn(null) }}>Clear sort</DropdownMenuItem>
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
                placeholder="Search customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>

            <AddCustomerDialog />
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
                  <TableCell colSpan={columns.length + 1} className="py-12 text-center text-sm text-muted-foreground">
                    No customers found.
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((c) => (
                  <TableRow key={c.id} className="cursor-pointer" onClick={() => setViewCustomer(c)}>
                    <TableCell className="pl-5">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="size-7">
                          <AvatarFallback className={cn("text-xs font-medium", avatarColor(c.name))}>
                            {initials(c.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground">{c.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{c.company}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{c.nip}</TableCell>
                    <TableCell className="text-muted-foreground">{c.contact}</TableCell>
                    <TableCell className="text-muted-foreground">{c.phone}</TableCell>
                    <TableCell className="text-muted-foreground">{c.email}</TableCell>
                    <TableCell className="text-right pr-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                            <HugeiconsIcon icon={MoreVerticalIcon} size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setViewCustomer(c) }}>
                            <HugeiconsIcon icon={EyeIcon} size={14} />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditOpen(c) }}>
                            <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem variant="destructive" onClick={(e) => { e.stopPropagation(); setDeleteTarget(c) }}>
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
              : <>Showing <span className="font-medium text-foreground">{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}</span> of <span className="font-medium text-foreground">{filtered.length}</span> customers</>
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

      {/* Edit Customer modal */}
      <Dialog open={!!editCustomer} onOpenChange={handleEditOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4 py-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Full Name <span className="text-destructive">*</span></label>
              <Input placeholder="John Smith" value={editForm.name} onChange={(e) => { setEditForm((f) => ({ ...f, name: e.target.value })); setEditNameError(false) }} aria-invalid={editNameError || undefined} />
              {editNameError && <p className="text-[11px] text-destructive">Full name is required.</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Company Name</label>
              <Input placeholder="Acme Ltd." value={editForm.company} onChange={(e) => setEditForm((f) => ({ ...f, company: e.target.value }))} />
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Tax ID (NIP)</label>
              <div className="flex gap-2">
                <Input placeholder="PL 0000000000" value={editForm.nip} onChange={(e) => setEditForm((f) => ({ ...f, nip: e.target.value }))} className="font-mono" />
                <Button variant="outline" size="lg" className="shrink-0">Fetch from GUS</Button>
              </div>
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Address</label>
              <Input placeholder="123 Main St, Warsaw" value={editForm.address} onChange={(e) => setEditForm((f) => ({ ...f, address: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Contact Person</label>
              <Input placeholder="John Smith" value={editForm.contact} onChange={(e) => setEditForm((f) => ({ ...f, contact: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Phone</label>
              <Input placeholder="+48 600 000 000" value={editForm.phone} onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))} />
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <Input type="email" placeholder="john@company.com" value={editForm.email} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
          </div>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline" size="lg">Cancel</Button>
            </DialogClose>
            <Button variant="default" size="lg" onClick={handleEditSubmit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Customer confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <HugeiconsIcon icon={Delete01Icon} size={16} />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete customer?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The customer will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                deleteCustomer(deleteTarget!.id)
                setDeleteTarget(null)
                toast.success("Klient został usunięty.")
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
