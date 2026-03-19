"use client"

import { useState, useMemo } from "react"
import { PageSetup } from "@/components/PageSetup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  DropdownMenu,
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
  Add01Icon,
  Search01Icon,
  UserIcon,
  ArrowUp01Icon,
  ArrowDown01Icon,
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

type SortDirection = "asc" | "desc"
type SortColumn = "name" | "company" | "nip" | "address" | "contact" | "phone" | "email"

interface Customer {
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
  { id: "1", name: "Marek Wiśniewski", company: "MW Budownictwo Sp. z o.o.", nip: "PL 7811234567", address: "ul. Nowa 14, Warszawa", contact: "Marek Wiśniewski", phone: "+48 601 234 567", email: "marek@mwbudownictwo.pl" },
  { id: "2", name: "Agnieszka Kowalska", company: "AK Nieruchomości", nip: "PL 5261098765", address: "ul. Krakowska 3, Kraków", contact: "Agnieszka Kowalska", phone: "+48 602 345 678", email: "a.kowalska@aknieruchomosci.pl" },
  { id: "3", name: "Piotr Zając", company: "Zając Inwestycje", nip: "PL 6341876543", address: "ul. Wrocławska 7, Wrocław", contact: "Piotr Zając", phone: "+48 603 456 789", email: "piotr@zajac-inwestycje.pl" },
  { id: "4", name: "Katarzyna Nowak", company: "Nowak & Syn Budowa", nip: "PL 8521654321", address: "ul. Poznańska 22, Poznań", contact: "Katarzyna Nowak", phone: "+48 604 567 890", email: "k.nowak@nowaksyn.pl" },
  { id: "5", name: "Tomasz Dąbrowski", company: "TechBuild S.A.", nip: "PL 9431543210", address: "ul. Gdańska 11, Gdańsk", contact: "Tomasz Dąbrowski", phone: "+48 605 678 901", email: "t.dabrowski@techbuild.pl" },
  { id: "6", name: "Joanna Lewandowska", company: "Lewandowska Consulting", nip: "PL 7123456789", address: "ul. Łódzka 5, Łódź", contact: "Joanna Lewandowska", phone: "+48 606 789 012", email: "joanna@lewandowska.pl" },
]

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

const offerStatusStyle: Record<CustomerOffer["status"], string> = {
  Accepted: "bg-green-50 text-green-700 border-green-200",
  Sent:     "bg-blue-50 text-blue-700 border-blue-200",
  Pending:  "bg-amber-50 text-amber-700 border-amber-200",
  Rejected: "bg-red-50 text-red-600 border-red-200",
}
const offerAccentColor: Record<CustomerOffer["status"], string> = {
  Accepted: "bg-green-400",
  Sent:     "bg-blue-400",
  Pending:  "bg-amber-400",
  Rejected: "bg-red-300",
}
const projectStatusStyle: Record<CustomerProject["status"], string> = {
  "In progress": "bg-blue-50 text-blue-700 border-blue-200",
  "Completed":   "bg-green-50 text-green-700 border-green-200",
  "On hold":     "bg-zinc-100 text-zinc-500 border-zinc-200",
}
const shipmentStatusStyle: Record<CustomerShipment["status"], string> = {
  Delivered:   "bg-green-50 text-green-700 border-green-200",
  "In transit":"bg-blue-50 text-blue-700 border-blue-200",
  Pending:     "bg-zinc-100 text-zinc-500 border-zinc-200",
}
const shipmentAccentColor: Record<CustomerShipment["status"], string> = {
  Delivered:   "bg-green-400",
  "In transit":"bg-blue-400",
  Pending:     "bg-zinc-300",
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

// Deterministic soft background for each avatar based on name
const avatarColors = [
  "bg-blue-100 text-blue-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-green-100 text-green-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
]
function avatarColor(name: string) {
  const idx = name.charCodeAt(0) % avatarColors.length
  return avatarColors[idx]
}

const columns: { key: SortColumn; label: string }[] = [
  { key: "name",    label: "Client" },
  { key: "company", label: "Company" },
  { key: "nip",     label: "NIP" },
  { key: "address", label: "Address" },
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

const selectClass = "h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-600 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-200 appearance-none pr-8 cursor-pointer"
const selectChevron = {
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat" as const,
  backgroundPosition: "right 10px center",
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers)
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [addOpen, setAddOpen] = useState(false)
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null)
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null)

  const emptyForm = { name: "", company: "", nip: "", address: "", contact: "", phone: "", email: "" }
  const [form, setForm] = useState(emptyForm)
  const [nameError, setNameError] = useState(false)
  const [editForm, setEditForm] = useState(emptyForm)
  const [editNameError, setEditNameError] = useState(false)

  function handleOpenChange(open: boolean) {
    setAddOpen(open)
    if (!open) {
      setForm(emptyForm)
      setNameError(false)
    }
  }

  function handleSubmit() {
    if (!form.name.trim()) {
      setNameError(true)
      return
    }
    setCustomers((prev) => [...prev, { id: crypto.randomUUID(), ...form }])
    handleOpenChange(false)
  }

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
    if (!editForm.name.trim()) {
      setEditNameError(true)
      return
    }
    setCustomers((prev) => prev.map((c) => c.id === editCustomer!.id ? { ...c, ...editForm } : c))
    handleEditOpenChange(false)
    setEditCustomer(null)
  }

  function handleSort(column: SortColumn) {
    if (sortColumn === column) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const sorted = useMemo(() => {
    if (!sortColumn) return customers
    return [...customers].sort((a, b) => {
      const valA = a[sortColumn].toLowerCase()
      const valB = b[sortColumn].toLowerCase()
      if (valA < valB) return sortDirection === "asc" ? -1 : 1
      if (valA > valB) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [customers, sortColumn, sortDirection])

  // — Customer detail full-width view —
  if (viewCustomer) {
    const projects  = mockProjects.filter((p) => p.customerId === viewCustomer.id)
    const offers    = mockOffers.filter((o) => o.customerId === viewCustomer.id)
    const shipments = mockShipments.filter((s) => s.customerId === viewCustomer.id)

    return (
      <>
        <PageSetup title={viewCustomer.name} icon={UserIcon} />

        <div className="p-8 space-y-6">

          {/* Back link */}
          <Button
            variant="ghost"
            size="md"
            onClick={() => setViewCustomer(null)}
            className="px-0 text-zinc-400 hover:bg-transparent hover:text-zinc-700"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
            Customers
          </Button>

          {/* Main grid: left card + projects */}
          <div className="grid grid-cols-3 gap-6 items-stretch">

            {/* Left card: identity + contact details */}
            <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden [&_[data-slot=table-container]]:overflow-x-visible">

              {/* Avatar + name + edit button */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-100">
                <Avatar className="size-10 shrink-0">
                  <AvatarFallback className={cn("text-sm font-medium", avatarColor(viewCustomer.name))}>
                    {initials(viewCustomer.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-zinc-900 truncate">{viewCustomer.name}</p>
                  {viewCustomer.company && <p className="text-xs text-zinc-400 truncate mt-0.5">{viewCustomer.company}</p>}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => { setViewCustomer(null); handleEditOpen(viewCustomer) }}
                  >
                    <HugeiconsIcon icon={PencilEdit01Icon} size={12} />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="md"
                    onClick={() => setDeleteTarget(viewCustomer)}
                  >
                    <HugeiconsIcon icon={Delete01Icon} size={12} />
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
                        <HugeiconsIcon icon={r.icon} size={14} className="text-zinc-300" />
                      </TableCell>
                      <TableCell className="w-28 text-xs text-zinc-400 font-medium">{r.label}</TableCell>
                      <TableCell className={cn("text-xs text-zinc-800 break-all", r.mono && "font-mono")}>
                        {r.value || <span className="text-zinc-300">—</span>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Projects — col-span-2 */}
            <Card className="col-span-2 rounded-xl border border-zinc-200 bg-white ring-0 gap-0 py-0 overflow-hidden">
              <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-3">
                <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">Projects</span>
                <Button variant="ghost" size="sm" className="text-zinc-400 hover:bg-transparent hover:text-zinc-700">View all</Button>
              </div>
              {projects.length === 0
                ? <p className="px-5 py-8 text-center text-sm text-zinc-400">No projects yet.</p>
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
                          <TableCell className="pl-5 font-medium text-zinc-900 truncate">{p.name}</TableCell>
                          <TableCell className="text-zinc-500">{p.date}</TableCell>
                          <TableCell className="text-zinc-700 font-medium">{p.value}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`text-[11px] ${projectStatusStyle[p.status]}`}>{p.status}</Badge>
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
            <Card className="rounded-xl border border-zinc-200 bg-white ring-0 gap-0 py-0 overflow-hidden">
              <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-3">
                <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">Offers</span>
                <Button variant="ghost" size="sm" className="text-zinc-400 hover:bg-transparent hover:text-zinc-700">View all</Button>
              </div>
              {offers.length === 0
                ? <p className="px-5 py-8 text-center text-sm text-zinc-400">No offers yet.</p>
                : <div>
                    {offers.map((o, i) => (
                      <div
                        key={o.id}
                        className={cn(
                          "flex items-center gap-4 px-4 py-3 hover:bg-zinc-50 transition-colors",
                          i !== offers.length - 1 && "border-b border-zinc-100"
                        )}
                      >
                        {/* Status accent bar */}
                        <div className={cn("h-8 w-1 shrink-0 rounded-full", offerAccentColor[o.status])} />

                        {/* Name + date */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-zinc-900 truncate">{o.name}</p>
                          <p className="text-xs text-zinc-400 mt-0.5">{o.date}</p>
                        </div>

                        {/* Value + badge */}
                        <div className="shrink-0 flex items-center gap-2.5">
                          <span className="text-xs font-medium text-zinc-600">{o.value}</span>
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
            <Card className="rounded-xl border border-zinc-200 bg-white ring-0 gap-0 py-0 overflow-hidden">
              <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-3">
                <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">Shipments</span>
                <Button variant="ghost" size="sm" className="text-zinc-400 hover:bg-transparent hover:text-zinc-700">View all</Button>
              </div>
              {shipments.length === 0
                ? <p className="px-5 py-8 text-center text-sm text-zinc-400">No shipments yet.</p>
                : <div>
                    {shipments.map((s, i) => (
                      <div
                        key={s.id}
                        className={cn(
                          "flex items-center gap-4 px-4 py-3 hover:bg-zinc-50 transition-colors",
                          i !== shipments.length - 1 && "border-b border-zinc-100"
                        )}
                      >
                        {/* Status accent bar */}
                        <div className={cn("h-8 w-1 shrink-0 rounded-full", shipmentAccentColor[s.status])} />

                        {/* Label + date */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-zinc-900 truncate">{s.label}</p>
                          <p className="text-xs text-zinc-400 mt-0.5">{s.date}</p>
                        </div>

                        {/* Badge */}
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

        {/* Delete Customer confirmation (detail view) */}
        <AlertDialog
          open={!!deleteTarget}
          onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        >
          <AlertDialogContent size="sm" style={{ "--background": "oklch(1 0 0)", "--foreground": "oklch(0.145 0 0)", "--muted-foreground": "oklch(0.556 0 0)", "--border": "oklch(0.922 0 0)" } as React.CSSProperties}>
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
                  setCustomers((prev) => prev.filter((x) => x.id !== deleteTarget!.id))
                  setDeleteTarget(null)
                  setViewCustomer(null)
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Edit modal available from detail view too */}
        <Dialog open={!!editCustomer} onOpenChange={handleEditOpenChange}>
          <DialogContent className="sm:max-w-lg bg-white text-zinc-900" style={{ "--ring": "oklch(0.922 0 0)", "--border": "oklch(0.922 0 0)", "--muted-foreground": "oklch(0.556 0 0)" } as React.CSSProperties}>
            <DialogHeader>
              <DialogTitle className="text-base font-semibold text-zinc-900">Edit Customer</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4 py-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-600">Full Name <span className="text-red-500">*</span></label>
                <Input placeholder="John Smith" value={editForm.name} onChange={(e) => { setEditForm((f) => ({ ...f, name: e.target.value })); setEditNameError(false) }} className={cn("h-9 bg-white text-sm text-zinc-900 placeholder:text-zinc-400", editNameError ? "border-red-400" : "border-zinc-200")} />
                {editNameError && <p className="text-[11px] text-red-500">Full name is required.</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-600">Company Name</label>
                <Input placeholder="Acme Ltd." value={editForm.company} onChange={(e) => setEditForm((f) => ({ ...f, company: e.target.value }))} className="h-9 border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400" />
              </div>
              <div className="col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-600">Tax ID (NIP)</label>
                <Input placeholder="PL 0000000000" value={editForm.nip} onChange={(e) => setEditForm((f) => ({ ...f, nip: e.target.value }))} className="h-9 border-zinc-200 bg-white text-sm text-zinc-900 font-mono placeholder:text-zinc-400" />
              </div>
              <div className="col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-600">Address</label>
                <Input placeholder="123 Main St, Warsaw" value={editForm.address} onChange={(e) => setEditForm((f) => ({ ...f, address: e.target.value }))} className="h-9 border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-600">Contact Person</label>
                <Input placeholder="John Smith" value={editForm.contact} onChange={(e) => setEditForm((f) => ({ ...f, contact: e.target.value }))} className="h-9 border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-600">Phone</label>
                <Input placeholder="+48 600 000 000" value={editForm.phone} onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))} className="h-9 border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400" />
              </div>
              <div className="col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-600">Email</label>
                <Input type="email" placeholder="john@company.com" value={editForm.email} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} className="h-9 border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400" />
              </div>
            </div>
            <DialogFooter className="pt-2">
              <DialogClose asChild>
                <Button variant="outline" size="lg">Cancel</Button>
              </DialogClose>
              <Button variant="brand" size="lg" onClick={handleEditSubmit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <>
      <PageSetup title="Customers" icon={UserIcon} />

      <div className="p-8">
        {/* Filter bar */}
        <div className="mb-4 flex items-center gap-2">
          <select defaultValue="" className={selectClass} style={selectChevron}>
            <option value="" disabled>Date Added</option>
            <option>Newest first</option>
            <option>Oldest first</option>
          </select>

          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <HugeiconsIcon icon={Search01Icon} size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              <Input
                type="search"
                placeholder="Search Customers..."
                className="h-9 w-56 rounded-md border border-zinc-200 bg-white pl-8 pr-3 text-sm text-zinc-600 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              />
            </div>

            <Button variant="brand" size="lg" onClick={() => setAddOpen(true)}>
              <HugeiconsIcon icon={Add01Icon} size={14} />
              Add Customer
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden [&_[data-slot=table-container]]:overflow-x-visible">
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
                {/* Actions column — not sortable */}
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((c) => (
                <TableRow key={c.id} className="cursor-pointer">
                  {/* Client name with avatar */}
                  <TableCell className="pl-5">
                    <div className="flex items-center gap-2.5">
                      <Avatar className={cn("size-7 text-xs font-medium", avatarColor(c.name))}>
                        <AvatarFallback className={cn("text-xs font-medium", avatarColor(c.name))}>
                          {initials(c.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-zinc-900">{c.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-600">{c.company}</TableCell>
                  <TableCell className="font-mono text-zinc-400">{c.nip}</TableCell>
                  <TableCell className="text-zinc-500">{c.address}</TableCell>
                  <TableCell className="text-zinc-500">{c.contact}</TableCell>
                  <TableCell className="text-zinc-500">{c.phone}</TableCell>
                  <TableCell className="text-zinc-500">{c.email}</TableCell>
                  {/* Actions */}
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
                        <DropdownMenuItem onClick={() => setViewCustomer(c)}>
                          <HugeiconsIcon icon={EyeIcon} size={14} />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditOpen(c)}>
                          <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(c)}>
                          <HugeiconsIcon icon={Delete01Icon} size={14} />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add Customer modal */}
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
            <DialogTitle className="text-base font-semibold text-zinc-900">
              New Customer
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-x-4 gap-y-4 py-2">
            {/* Client Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-600">Full Name <span className="text-red-500">*</span></label>
              <Input
                placeholder="John Smith"
                value={form.name}
                onChange={(e) => { setForm((f) => ({ ...f, name: e.target.value })); setNameError(false) }}
                className={cn("h-9 bg-white text-sm text-zinc-900 placeholder:text-zinc-400", nameError ? "border-red-400 focus:ring-red-200" : "border-zinc-200")}
              />
              {nameError
                ? <p className="text-[11px] text-red-500">Full name is required.</p>
                : <p className="text-[11px] text-zinc-400">First and last name of the client.</p>
              }
            </div>

            {/* Company */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-600">Company Name</label>
              <Input placeholder="Acme Ltd." value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} className="h-9 border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400" />
              <p className="text-[11px] text-zinc-400">Leave blank for individual clients.</p>
            </div>

            {/* NIP — full width with GUS button */}
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-600">Tax ID (NIP)</label>
              <div className="flex gap-2">
                <Input placeholder="PL 0000000000" value={form.nip} onChange={(e) => setForm((f) => ({ ...f, nip: e.target.value }))} className="h-9 border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 font-mono" />
                <Button variant="outline" size="lg" className="shrink-0">
                  Fetch from GUS
                </Button>
              </div>
              <p className="text-[11px] text-zinc-400">Enter a NIP and click "Fetch from GUS" to auto-fill company details.</p>
            </div>

            {/* Address — full width */}
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-600">Address</label>
              <Input placeholder="123 Main St, Warsaw" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} className="h-9 border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400" />
            </div>

            {/* Contact */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-600">Contact Person</label>
              <Input placeholder="John Smith" value={form.contact} onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))} className="h-9 border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400" />
              <p className="text-[11px] text-zinc-400">Who to reach out to at this company.</p>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-600">Phone</label>
              <Input placeholder="+48 600 000 000" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="h-9 border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400" />
              <p className="text-[11px] text-zinc-400">Include country code, e.g. +48.</p>
            </div>

            {/* Email — full width */}
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-600">Email</label>
              <Input type="email" placeholder="john@company.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="h-9 border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400" />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline" size="lg">Cancel</Button>
            </DialogClose>
            <Button variant="brand" size="lg" onClick={handleSubmit}>
              Add Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>



      {/* Edit Customer modal */}
      <Dialog open={!!editCustomer} onOpenChange={handleEditOpenChange}>
        <DialogContent
          className="sm:max-w-lg bg-white text-zinc-900"
          style={{
            "--ring": "oklch(0.922 0 0)",
            "--border": "oklch(0.922 0 0)",
            "--muted-foreground": "oklch(0.556 0 0)",
          } as React.CSSProperties}
        >
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-zinc-900">Edit Customer</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-x-4 gap-y-4 py-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-600">Full Name <span className="text-red-500">*</span></label>
              <Input
                placeholder="John Smith"
                value={editForm.name}
                onChange={(e) => { setEditForm((f) => ({ ...f, name: e.target.value })); setEditNameError(false) }}
                className={cn("h-9 bg-white text-sm text-zinc-900 placeholder:text-zinc-400", editNameError ? "border-red-400 focus:ring-red-200" : "border-zinc-200")}
              />
              {editNameError && <p className="text-[11px] text-red-500">Full name is required.</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-600">Company Name</label>
              <Input placeholder="Acme Ltd." value={editForm.company} onChange={(e) => setEditForm((f) => ({ ...f, company: e.target.value }))} className="h-9 border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400" />
            </div>

            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-600">Tax ID (NIP)</label>
              <div className="flex gap-2">
                <Input placeholder="PL 0000000000" value={editForm.nip} onChange={(e) => setEditForm((f) => ({ ...f, nip: e.target.value }))} className="h-9 border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 font-mono" />
                <Button variant="outline" size="lg" className="shrink-0">
                  Fetch from GUS
                </Button>
              </div>
            </div>

            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-600">Address</label>
              <Input placeholder="123 Main St, Warsaw" value={editForm.address} onChange={(e) => setEditForm((f) => ({ ...f, address: e.target.value }))} className="h-9 border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-600">Contact Person</label>
              <Input placeholder="John Smith" value={editForm.contact} onChange={(e) => setEditForm((f) => ({ ...f, contact: e.target.value }))} className="h-9 border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-600">Phone</label>
              <Input placeholder="+48 600 000 000" value={editForm.phone} onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))} className="h-9 border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400" />
            </div>

            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-600">Email</label>
              <Input type="email" placeholder="john@company.com" value={editForm.email} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} className="h-9 border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400" />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline" size="lg">Cancel</Button>
            </DialogClose>
            <Button variant="brand" size="lg" onClick={handleEditSubmit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Customer confirmation (list view) */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
      >
        <AlertDialogContent size="sm" style={{ "--background": "oklch(1 0 0)", "--foreground": "oklch(0.145 0 0)", "--muted-foreground": "oklch(0.556 0 0)", "--border": "oklch(0.922 0 0)" } as React.CSSProperties}>
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
                setCustomers((prev) => prev.filter((x) => x.id !== deleteTarget!.id))
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
