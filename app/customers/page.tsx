"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
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
  Add01Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { useCustomers, type Customer } from "@/components/CustomersContext"
import { AddCustomerDialog } from "@/components/AddCustomerDialog"
import { toast } from "sonner"

type SortDirection = "asc" | "desc"
type SortColumn = "company" | "nip" | "contact" | "phone" | "email"

// Matches SelectTrigger size="lg" — h-9 px-3 text-sm
const inputLg = "h-9 px-3 text-sm md:text-sm"

// — Mock relational data —

interface CustomerProject { id: string; customerId: string; name: string; status: "W toku" | "Zakończono" | "Wstrzymano"; value: string; date: string }
interface CustomerOffer   { id: string; customerId: string; name: string; status: "Wysłana" | "Zaakceptowana" | "Oczekująca" | "Odrzucona"; value: string; date: string }
interface CustomerShipment{ id: string; customerId: string; label: string; status: "Dostarczone" | "W drodze" | "Oczekujące"; date: string }

const mockProjects: CustomerProject[] = [
  { id: "p1",  customerId: "1", name: "Remont biurowca — ul. Marszałkowska 12",      status: "W toku",      value: "84 500 PLN",  date: "2025-01-10" },
  { id: "p2",  customerId: "1", name: "Fundamenty hali magazynowej — Piaseczno",     status: "Zakończono",  value: "32 000 PLN",  date: "2024-09-03" },
  { id: "p3",  customerId: "1", name: "Instalacja HVAC — budynek administracyjny",   status: "Wstrzymano",  value: "18 200 PLN",  date: "2025-03-02" },
  { id: "p4",  customerId: "2", name: "Wykończenie wnętrz — apartament 4B",          status: "W toku",      value: "21 000 PLN",  date: "2025-02-20" },
  { id: "p5",  customerId: "2", name: "Malowanie klatki schodowej — blok nr 7",      status: "Zakończono",  value: "4 800 PLN",   date: "2025-01-05" },
  { id: "p6",  customerId: "3", name: "Pokrycie dachowe — hala przemysłowa Tychy",   status: "Wstrzymano",  value: "57 200 PLN",  date: "2025-03-01" },
  { id: "p7",  customerId: "3", name: "Termomodernizacja — budynek mieszkalny",      status: "Zakończono",  value: "29 600 PLN",  date: "2024-10-18" },
  { id: "p8",  customerId: "4", name: "Instalacja elektryczna — segment B",          status: "Zakończono",  value: "14 800 PLN",  date: "2024-11-15" },
  { id: "p9",  customerId: "4", name: "Montaż stolarki okiennej — 24 szt.",         status: "W toku",      value: "22 400 PLN",  date: "2025-02-28" },
  { id: "p10", customerId: "5", name: "Konstrukcja stalowa — zakład produkcyjny",    status: "W toku",      value: "120 000 PLN", date: "2025-02-01" },
  { id: "p11", customerId: "5", name: "Posadzki przemysłowe — hala nr 3",            status: "W toku",      value: "38 500 PLN",  date: "2025-02-14" },
  { id: "p12", customerId: "6", name: "Audyt budowlany — kompleks magazynowy",       status: "Zakończono",  value: "6 000 PLN",   date: "2025-01-22" },
]

const mockOffers: CustomerOffer[] = [
  { id: "o1",  customerId: "1", name: "Oferta #2024/087 — Remont biurowca",          status: "Zaakceptowana", value: "84 500 PLN",  date: "2024-12-20" },
  { id: "o2",  customerId: "1", name: "Oferta #2025/012 — Rozbudowa skrzydła B",     status: "Oczekująca",    value: "46 000 PLN",  date: "2025-02-28" },
  { id: "o3",  customerId: "1", name: "Oferta #2025/031 — Instalacja HVAC",          status: "Wysłana",       value: "18 200 PLN",  date: "2025-03-01" },
  { id: "o4",  customerId: "2", name: "Oferta #2025/003 — Wykończenie wnętrz",       status: "Zaakceptowana", value: "21 000 PLN",  date: "2025-01-15" },
  { id: "o5",  customerId: "2", name: "Oferta #2025/019 — Łazienka i kuchnia",       status: "Oczekująca",    value: "9 300 PLN",   date: "2025-03-05" },
  { id: "o6",  customerId: "3", name: "Oferta #2025/018 — Pokrycie dachu",           status: "Wysłana",       value: "57 200 PLN",  date: "2025-02-10" },
  { id: "o7",  customerId: "3", name: "Oferta #2024/061 — Roboty ziemne",            status: "Odrzucona",     value: "18 500 PLN",  date: "2024-10-05" },
  { id: "o8",  customerId: "4", name: "Oferta #2024/099 — Instalacja elektryczna",   status: "Zaakceptowana", value: "14 800 PLN",  date: "2024-10-22" },
  { id: "o9",  customerId: "4", name: "Oferta #2025/024 — Stolarka okienna",         status: "Zaakceptowana", value: "22 400 PLN",  date: "2025-02-10" },
  { id: "o10", customerId: "5", name: "Oferta #2025/021 — Konstrukcja stalowa",      status: "Zaakceptowana", value: "120 000 PLN", date: "2025-01-28" },
  { id: "o11", customerId: "5", name: "Oferta #2025/028 — Posadzki przemysłowe",     status: "Zaakceptowana", value: "38 500 PLN",  date: "2025-02-03" },
  { id: "o12", customerId: "6", name: "Oferta #2025/009 — Audyt budowlany",          status: "Wysłana",       value: "8 000 PLN",   date: "2025-02-05" },
]

const mockShipments: CustomerShipment[] = [
  { id: "sh1",  customerId: "1", label: "Belki stalowe HEA 200 — 2,4 t",            status: "Dostarczone", date: "2025-01-18" },
  { id: "sh2",  customerId: "1", label: "Cement portlandzki CEM I — 50 worków",     status: "W drodze",    date: "2025-03-10" },
  { id: "sh3",  customerId: "1", label: "Cegła klinkierowa — 1 200 szt.",           status: "Oczekujące",  date: "2025-03-18" },
  { id: "sh4",  customerId: "2", label: "Płyty gipsowo-kartonowe — 80 szt.",        status: "Dostarczone", date: "2025-02-25" },
  { id: "sh5",  customerId: "2", label: "Farba elewacyjna — 40 wiader",             status: "Dostarczone", date: "2025-01-08" },
  { id: "sh6",  customerId: "3", label: "Dachówka ceramiczna — 1 paleta",           status: "Oczekujące",  date: "2025-03-15" },
  { id: "sh7",  customerId: "3", label: "Membrana dachowa — 500 m²",               status: "W drodze",    date: "2025-03-12" },
  { id: "sh8",  customerId: "4", label: "Kabel elektryczny YKY 3×4 — 300 m",       status: "Dostarczone", date: "2024-11-20" },
  { id: "sh9",  customerId: "4", label: "Okna PVC 3-szybowe — 24 szt.",            status: "W drodze",    date: "2025-03-06" },
  { id: "sh10", customerId: "5", label: "Profile stalowe RHS 100×100 — 5 t",       status: "W drodze",    date: "2025-03-08" },
  { id: "sh11", customerId: "5", label: "Śruby konstrukcyjne M20 — komplet",       status: "Dostarczone", date: "2025-02-12" },
  { id: "sh12", customerId: "6", label: "Sprzęt pomiarowy — wypożyczenie",         status: "Dostarczone", date: "2025-01-24" },
]

// Opacity-based colors — work in both light and dark mode
const offerStatusStyle: Record<CustomerOffer["status"], string> = {
  Zaakceptowana: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Wysłana:       "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Oczekująca:    "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Odrzucona:     "bg-red-500/10 text-red-400 border-red-500/20",
}
const offerAccentColor: Record<CustomerOffer["status"], string> = {
  Zaakceptowana: "bg-wirmet-green",
  Wysłana:       "bg-wirmet-blue",
  Oczekująca:    "bg-amber-400",
  Odrzucona:     "bg-rose-400",
}
const projectAccentColor: Record<CustomerProject["status"], string> = {
  "W toku":     "bg-wirmet-blue",
  "Zakończono": "bg-wirmet-green",
  "Wstrzymano": "bg-muted-foreground/30",
}
const projectStatusStyle: Record<CustomerProject["status"], string> = {
  "W toku":     "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Zakończono": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  "Wstrzymano": "bg-zinc-500/10 text-muted-foreground border-zinc-500/20",
}
const shipmentStatusStyle: Record<CustomerShipment["status"], string> = {
  Dostarczone: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  "W drodze":  "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Oczekujące:  "bg-zinc-500/10 text-muted-foreground border-zinc-500/20",
}
const shipmentAccentColor: Record<CustomerShipment["status"], string> = {
  Dostarczone: "bg-wirmet-green",
  "W drodze":  "bg-wirmet-blue",
  Oczekujące:  "bg-muted-foreground/30",
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
  { key: "company", label: "Firma" },
  { key: "nip",     label: "NIP" },
  { key: "contact", label: "Kontakt" },
  { key: "phone",   label: "Telefon" },
  { key: "email",   label: "E-mail" },
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
  const router = useRouter()
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null)
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null)

  const emptyForm = { name: "", company: "", nip: "", address: "", contact: "", phone: "", email: "" }
  const [editForm, setEditForm] = useState(emptyForm)
  const [editCompanyError, setEditCompanyError] = useState(false)

  useEffect(() => { setPage(1) }, [search, sortColumn, sortDirection])

  function handleEditOpen(customer: Customer) {
    setEditCustomer(customer)
    setEditForm({ name: customer.name, company: customer.company, nip: customer.nip, address: customer.address, contact: customer.contact, phone: customer.phone, email: customer.email })
    setEditCompanyError(false)
  }

  function handleEditOpenChange(open: boolean) {
    if (!open) {
      setEditCustomer(null)
      setEditCompanyError(false)
    }
  }

  function handleEditSubmit() {
    if (!editForm.company.trim()) { setEditCompanyError(true); return }
    updateCustomer(editCustomer!.id, {
      ...editForm,
      name: editForm.contact || editForm.company,
    })
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
    const allProjects  = mockProjects.filter((p) => p.customerId === viewCustomer.id)
    const offers       = mockOffers.filter((o) => o.customerId === viewCustomer.id)
    const allShipments = mockShipments.filter((s) => s.customerId === viewCustomer.id)

    // Najnowsze 2 — sortowane malejąco po dacie
    const projects  = [...allProjects].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 2)
    const shipments = [...allShipments].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 2)
    const displayName = viewCustomer.company || viewCustomer.name

    return (
      <>
        <PageSetup title={displayName} icon={UserIcon} />

        <div className="p-8 flex flex-col gap-5">

          {/* ── Powrót ─────────────────────────────────────────────────── */}
          <Button
            variant="ghost"
            size="lg"
            onClick={() => setViewCustomer(null)}
            className="w-fit px-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} data-icon="inline-start" />
            Klienci
          </Button>

          {/* ── Hero card ──────────────────────────────────────────────── */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="h-[2px] shrink-0 bg-gradient-to-r from-wirmet-orange to-wirmet-orange/0" />
            <div className="flex items-center gap-5 px-6 py-5">

              <Avatar className="size-14 shrink-0">
                <AvatarFallback className={cn("text-lg font-semibold", avatarColor(displayName))}>
                  {initials(displayName)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="font-[family-name:var(--font-display)] text-xl font-semibold text-foreground leading-tight truncate">
                  {displayName}
                </p>
                {(viewCustomer.contact || viewCustomer.phone) && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {viewCustomer.contact}
                    {viewCustomer.contact && viewCustomer.phone && (
                      <span className="text-muted-foreground/30 mx-2">·</span>
                    )}
                    {viewCustomer.phone}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-3">
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-wirmet-orange/70" />
                    {allProjects.length} realizacji
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-wirmet-blue/70" />
                    {offers.length} ofert
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-wirmet-green/70" />
                    {allShipments.length} transportów
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="lg" onClick={() => { setViewCustomer(null); handleEditOpen(viewCustomer) }}>
                  <HugeiconsIcon icon={PencilEdit01Icon} data-icon="inline-start" />
                  Edytuj
                </Button>
                <Button variant="destructive" size="lg" onClick={() => setDeleteTarget(viewCustomer)}>
                  <HugeiconsIcon icon={Delete01Icon} data-icon="inline-start" />
                  Usuń
                </Button>
              </div>

            </div>
          </div>

          {/* ── Dane kontaktowe | Oferty ──────────────────────────────── */}
          <div className="grid grid-cols-3 gap-5">

            {/* Dane kontaktowe */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="border-b border-border px-5 py-4">
                <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-foreground">Dane kontaktowe</p>
              </div>
              <div className="divide-y divide-border">
                {[
                  { icon: Building01Icon,   label: "Firma",            value: viewCustomer.company },
                  { icon: Invoice01Icon,    label: "NIP",              value: viewCustomer.nip,     mono: true },
                  { icon: Location01Icon,   label: "Adres",            value: viewCustomer.address },
                  { icon: UserIcon,         label: "Osoba kontaktowa", value: viewCustomer.contact },
                  { icon: SmartPhone01Icon, label: "Telefon",          value: viewCustomer.phone },
                  { icon: Mail01Icon,       label: "E-mail",           value: viewCustomer.email },
                ].map((r) => (
                  <div key={r.label} className="flex items-start gap-3 px-5 py-3">
                    <HugeiconsIcon icon={r.icon} size={13} className="text-muted-foreground/40 mt-[3px] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 mb-0.5">{r.label}</p>
                      <p className={cn("text-sm text-foreground break-words leading-snug", r.mono && "font-mono text-xs")}>
                        {r.value || <span className="text-muted-foreground/30">—</span>}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Oferty — col-span-2, więcej informacji */}
            <div className="col-span-2 rounded-2xl border border-border bg-card overflow-hidden flex flex-col">
              <div className="flex items-center justify-between border-b border-border px-5 py-4 shrink-0">
                <div className="flex items-center gap-2.5">
                  <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-foreground">Oferty</p>
                  {offers.length > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-[10px] font-semibold text-muted-foreground tabular-nums">
                      {offers.length}
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost" size="sm"
                  className="text-xs text-muted-foreground hover:text-foreground -mr-2"
                  onClick={() => router.push(`/offers?q=${encodeURIComponent(viewCustomer.company || viewCustomer.name)}`)}
                >
                  Wszystkie
                </Button>
              </div>

              {offers.length === 0 ? (
                /* Brak jakichkolwiek ofert — wyśrodkowany CTA */
                <div className="flex-1 flex flex-col items-center justify-center gap-3 px-5 py-10">
                  <p className="text-sm text-muted-foreground">Brak ofert dla tego klienta.</p>
                  <Button
                    variant="outline" size="lg"
                    onClick={() => router.push("/offers")}
                  >
                    <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
                    Nowa oferta
                  </Button>
                </div>
              ) : (
                <>
                  <div className="divide-y divide-border">
                    {offers.map((o) => (
                      <div key={o.id} className="relative flex items-center gap-4 pl-10 pr-5 py-3.5 hover:bg-muted/20 transition-colors cursor-pointer">
                        <div className={cn("absolute left-5 top-3.5 bottom-3.5 w-[3px] rounded-full", offerAccentColor[o.status])} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{o.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{o.date}</p>
                        </div>
                        <div className="shrink-0 flex items-center gap-4">
                          <span className="text-sm font-semibold text-foreground tabular-nums">{o.value}</span>
                          <Badge variant="outline" className={cn("w-28 justify-center text-[11px]", offerStatusStyle[o.status])}>{o.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer — wypełnia pozostałą przestrzeń i zachęca do nowej oferty */}
                  <div className="flex-1 flex items-center justify-center border-t border-dashed border-border/50 px-5 py-4 min-h-[64px]">
                    <button
                      onClick={() => router.push("/offers")}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground/50 hover:text-wirmet-orange transition-colors"
                    >
                      <HugeiconsIcon icon={Add01Icon} size={12} />
                      Utwórz nową ofertę
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Realizacje | Transporty ───────────────────────────────── */}
          <div className="grid grid-cols-2 gap-5">

            {/* Realizacje */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-foreground">Realizacje</p>
                  {allProjects.length > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-[10px] font-semibold text-muted-foreground tabular-nums">
                      {allProjects.length}
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost" size="sm"
                  className="text-xs text-muted-foreground hover:text-foreground -mr-2"
                  onClick={() => router.push(`/orders?q=${encodeURIComponent(viewCustomer.company || viewCustomer.name)}`)}
                >
                  Wszystkie
                </Button>
              </div>
              {projects.length === 0
                ? <p className="px-5 py-10 text-center text-sm text-muted-foreground">Brak realizacji.</p>
                : <div className="divide-y divide-border">
                    {projects.map((p) => (
                      <div key={p.id} className="relative flex items-center gap-4 pl-10 pr-5 py-3.5 hover:bg-muted/20 transition-colors cursor-pointer">
                        <div className={cn("absolute left-5 top-3.5 bottom-3.5 w-[3px] rounded-full", projectAccentColor[p.status])} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{p.date}</p>
                        </div>
                        <div className="shrink-0 flex items-center gap-3">
                          <span className="text-sm font-semibold text-foreground tabular-nums">{p.value}</span>
                          <Badge variant="outline" className={cn("text-[11px]", projectStatusStyle[p.status])}>{p.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
              }
            </div>

            {/* Transporty */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-foreground">Transporty</p>
                  {allShipments.length > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-[10px] font-semibold text-muted-foreground tabular-nums">
                      {allShipments.length}
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost" size="sm"
                  className="text-xs text-muted-foreground hover:text-foreground -mr-2"
                  onClick={() => router.push(`/shipments?q=${encodeURIComponent(viewCustomer.company || viewCustomer.name)}`)}
                >
                  Wszystkie
                </Button>
              </div>
              {shipments.length === 0
                ? <p className="px-5 py-10 text-center text-sm text-muted-foreground">Brak transportów.</p>
                : <div className="divide-y divide-border">
                    {shipments.map((s) => (
                      <div key={s.id} className="relative flex items-center gap-4 pl-10 pr-5 py-3.5 hover:bg-muted/20 transition-colors cursor-pointer">
                        <div className={cn("absolute left-5 top-3.5 bottom-3.5 w-[3px] rounded-full", shipmentAccentColor[s.status])} />
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
            </div>
          </div>

        </div>

        {/* Delete confirmation (detail view) */}
        <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogMedia className="bg-destructive/10 text-destructive">
                <HugeiconsIcon icon={Delete01Icon} size={16} />
              </AlertDialogMedia>
              <AlertDialogTitle>Usunąć klienta?</AlertDialogTitle>
              <AlertDialogDescription>
                Tej operacji nie można cofnąć. Klient zostanie trwale usunięty.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel variant="outline">Anuluj</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={() => {
                  deleteCustomer(deleteTarget!.id)
                  setDeleteTarget(null)
                  setViewCustomer(null)
                  toast.success("Klient został usunięty.")
                }}
              >
                Usuń
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Edit modal (detail view) */}
        <Dialog open={!!editCustomer} onOpenChange={handleEditOpenChange}>
          <DialogContent className="sm:max-w-md" showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>Edytuj klienta</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-2">

              {/* Firma + NIP */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Nazwa firmy <span className="text-destructive">*</span>
                  </label>
                  <Input
                    className={inputLg}
                    placeholder="np. MW Budownictwo"
                    value={editForm.company}
                    onChange={(e) => { setEditForm((f) => ({ ...f, company: e.target.value })); setEditCompanyError(false) }}
                    aria-invalid={editCompanyError || undefined}
                  />
                  {editCompanyError && <p className="text-[11px] text-destructive">Podaj nazwę firmy.</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">NIP</label>
                  <Input
                    className={inputLg}
                    placeholder="np. PL 7811234567"
                    value={editForm.nip}
                    onChange={(e) => setEditForm((f) => ({ ...f, nip: e.target.value }))}
                  />

                </div>
              </div>

              {/* Adres */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Adres</label>
                <Input
                  className={inputLg}
                  placeholder="np. ul. Nowa 14, Warszawa"
                  value={editForm.address}
                  onChange={(e) => setEditForm((f) => ({ ...f, address: e.target.value }))}
                />
              </div>

              {/* Osoba kontaktowa */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Osoba kontaktowa</label>
                <Input
                  className={inputLg}
                  placeholder="np. Marek Wiśniewski"
                  value={editForm.contact}
                  onChange={(e) => setEditForm((f) => ({ ...f, contact: e.target.value }))}
                />
              </div>

              {/* Telefon + Email */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Telefon</label>
                  <Input
                    className={inputLg}
                    type="tel"
                    placeholder="+48 601 234 567"
                    value={editForm.phone}
                    onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">E-mail</label>
                  <Input
                    className={inputLg}
                    type="email"
                    placeholder="kontakt@firma.pl"
                    value={editForm.email}
                    onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                  />
                </div>
              </div>

            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" size="lg">Anuluj</Button>
              </DialogClose>
              <Button variant="default" size="lg" onClick={handleEditSubmit}>
                <HugeiconsIcon icon={PencilEdit01Icon} data-icon="inline-start" />
                Zapisz zmiany
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <>
      <PageSetup title="Klienci" icon={UserIcon} />

      <div className="flex flex-col gap-4 p-8">

        {/* Filter bar */}
        <div className="flex shrink-0 items-center gap-2">

          {/* Sort dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="lg">
                Sortuj
                <HugeiconsIcon icon={ArrowDown02Icon} data-icon="inline-end" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              <DropdownMenuItem onClick={() => { setSortColumn("company"); setSortDirection("asc") }}>Firma A–Z</DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortColumn("company"); setSortDirection("desc") }}>Firma Z–A</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { setSortColumn(null) }}>Wyczyść sortowanie</DropdownMenuItem>
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
                placeholder="Szukaj klienta…"
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
                    Brak klientów.
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((c) => (
                  <TableRow key={c.id} className="cursor-pointer" onClick={() => setViewCustomer(c)}>
                    <TableCell className="pl-5">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="size-7">
                          <AvatarFallback className={cn("text-xs font-medium", avatarColor(c.company || c.name))}>
                            {initials(c.company || c.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground">{c.company || <span className="text-muted-foreground/40">—</span>}</span>
                      </div>
                    </TableCell>
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
                            Podgląd
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditOpen(c) }}>
                            <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
                            Edytuj
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem variant="destructive" onClick={(e) => { e.stopPropagation(); setDeleteTarget(c) }}>
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
              : <>Wyświetlono <span className="font-medium text-foreground">{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}</span> z <span className="font-medium text-foreground">{filtered.length}</span> klientów</>
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

      {/* Edit Customer modal */}
      <Dialog open={!!editCustomer} onOpenChange={handleEditOpenChange}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Edytuj klienta</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">

            {/* Firma + NIP */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Nazwa firmy <span className="text-destructive">*</span>
                </label>
                <Input
                  className={inputLg}
                  placeholder="np. MW Budownictwo"
                  value={editForm.company}
                  onChange={(e) => { setEditForm((f) => ({ ...f, company: e.target.value })); setEditCompanyError(false) }}
                  aria-invalid={editCompanyError || undefined}
                />
                {editCompanyError && <p className="text-[11px] text-destructive">Podaj nazwę firmy.</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">NIP</label>
                <Input
                  className={inputLg}
                  placeholder="np. PL 7811234567"
                  value={editForm.nip}
                  onChange={(e) => setEditForm((f) => ({ ...f, nip: e.target.value }))}
                />

              </div>
            </div>

            {/* Adres */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Adres</label>
              <Input
                className={inputLg}
                placeholder="np. ul. Nowa 14, Warszawa"
                value={editForm.address}
                onChange={(e) => setEditForm((f) => ({ ...f, address: e.target.value }))}
              />
            </div>

            {/* Osoba kontaktowa */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Osoba kontaktowa</label>
              <Input
                className={inputLg}
                placeholder="np. Marek Wiśniewski"
                value={editForm.contact}
                onChange={(e) => setEditForm((f) => ({ ...f, contact: e.target.value }))}
              />
            </div>

            {/* Telefon + Email */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Telefon</label>
                <Input
                  className={inputLg}
                  type="tel"
                  placeholder="+48 601 234 567"
                  value={editForm.phone}
                  onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">E-mail</label>
                <Input
                  className={inputLg}
                  type="email"
                  placeholder="kontakt@firma.pl"
                  value={editForm.email}
                  onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
            </div>

          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="lg">Anuluj</Button>
            </DialogClose>
            <Button variant="default" size="lg" onClick={handleEditSubmit}>
              <HugeiconsIcon icon={PencilEdit01Icon} data-icon="inline-start" />
              Zapisz zmiany
            </Button>
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
            <AlertDialogTitle>Usunąć klienta?</AlertDialogTitle>
            <AlertDialogDescription>
              Tej operacji nie można cofnąć. Klient zostanie trwale usunięty.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline">Anuluj</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                deleteCustomer(deleteTarget!.id)
                setDeleteTarget(null)
                toast.success("Klient został usunięty.")
              }}
            >
              Usuń
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
