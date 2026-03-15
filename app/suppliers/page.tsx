import { PageSetup } from "@/components/PageSetup"
import { Badge } from "@/components/ui/badge"
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
import { Add01Icon, Search01Icon, UserGroupIcon } from "@hugeicons/core-free-icons"

type SupplierType = "Materiały budowlane" | "Narzędzia" | "Instalacje" | "Transport"

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

export default function SuppliersPage() {
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

            <button className="flex h-9 items-center gap-1.5 rounded-md bg-amber-500 px-3 text-sm font-medium text-white hover:bg-amber-600 transition-colors">
              <HugeiconsIcon icon={Add01Icon} size={14} />
              Add Supplier
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-100 hover:bg-transparent">
                <TableHead className="pl-5 text-zinc-400 font-medium text-[11px] uppercase tracking-wide">Firma</TableHead>
                <TableHead className="text-zinc-400 font-medium text-[11px] uppercase tracking-wide">NIP</TableHead>
                <TableHead className="text-zinc-400 font-medium text-[11px] uppercase tracking-wide">Adres</TableHead>
                <TableHead className="text-zinc-400 font-medium text-[11px] uppercase tracking-wide">Kontakt</TableHead>
                <TableHead className="text-zinc-400 font-medium text-[11px] uppercase tracking-wide">Telefon</TableHead>
                <TableHead className="text-zinc-400 font-medium text-[11px] uppercase tracking-wide">Typ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((s) => (
                <TableRow key={s.nip} className="border-zinc-100 hover:bg-zinc-50 cursor-pointer">
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
