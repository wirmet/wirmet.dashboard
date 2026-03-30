"use client"

import { Suspense, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { PageSetup } from "@/components/PageSetup"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"
import {
  Folder01Icon,
  FolderOpenIcon,
  Add01Icon,
  MoreHorizontalIcon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  ArrowLeft01Icon,
  GridViewIcon,
  ListViewIcon,
  File01Icon,
  Pdf01Icon,
  SortByDown01Icon,
  Invoice01Icon,
  Download01Icon,
  Copy01Icon,
  Delete01Icon,
  PencilEdit01Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

// ─── Types ─────────────────────────────────────────────────────────────────────

interface FolderItem {
  key: string
  name: string
  modified: string
  iconColor?: string
  count?: number
  isCategory?: boolean
}

interface FileItem {
  name: string
  type: string
  size: string
  modified: string
  icon: IconSvgElement
}

// ─── Data ──────────────────────────────────────────────────────────────────────

const categoryFolders: FolderItem[] = [
  { key: "offers-2026", name: "Oferty 2026",         modified: "29 mar 2026", iconColor: "text-wirmet-orange",    count: 29, isCategory: true },
  { key: "offers-2025", name: "Oferty 2025",         modified: "15 sty 2026", iconColor: "text-wirmet-orange/60", count: 67, isCategory: true },
  { key: "projects",    name: "Archiwum realizacji", modified: "20 mar 2026", iconColor: "text-wirmet-green",     count: 14, isCategory: true },
  { key: "suppliers",   name: "Dokumenty dostawców", modified: "12 mar 2026", iconColor: "text-wirmet-blue",      count: 8,  isCategory: true },
  { key: "invoices",    name: "Faktury",             modified: "28 mar 2026", iconColor: "text-rose-400",         count: 43, isCategory: true },
]

const projectFolders: FolderItem[] = [
  { key: "p-2603001", name: "2603001 Marek Wiśniewski",    modified: "21 mar 2026" },
  { key: "p-2603002", name: "2603002 Budmax Sp. z o.o.",   modified: "20 mar 2026" },
  { key: "p-2603003", name: "2603003 Anna Kowalczyk",      modified: "20 mar 2026" },
  { key: "p-2603004", name: "2603004 TechBuild Sp. z o.o.",modified: "18 mar 2026" },
  { key: "p-2603005", name: "2603005 Konstrukt S.A.",      modified: "17 mar 2026" },
  { key: "p-2603006", name: "2603006 Rem-Bud Usługi",      modified: "15 mar 2026" },
  { key: "p-2603007", name: "2603007 Piotr Jabłoński",     modified: "14 mar 2026" },
  { key: "p-2603008", name: "2603008 Nowak & Syn Budowa",  modified: "12 mar 2026" },
  { key: "p-2603009", name: "2603009 Piotr Zając",         modified: "10 mar 2026" },
  { key: "p-2603010", name: "2603010 Agnieszka Kowalska",  modified: "8 mar 2026"  },
  { key: "p-2603011", name: "2603011 Joanna Lewandowska",  modified: "6 mar 2026"  },
  { key: "p-2603012", name: "2603012 Firma Rem-Bud",       modified: "3 mar 2026"  },
]

const looseFiles: FileItem[] = [
  { name: "faktura_FV-2026-0147.pdf",         type: "PDF",  size: "124 KB", modified: "28 mar 2026", icon: Pdf01Icon     },
  { name: "oferta_OF-0441_TechBuild.pdf",     type: "PDF",  size: "89 KB",  modified: "25 mar 2026", icon: Pdf01Icon     },
  { name: "harmonogram_marzec2026.xlsx",      type: "XLSX", size: "45 KB",  modified: "22 mar 2026", icon: File01Icon    },
  { name: "protokol_odbioru_budmax.docx",     type: "DOCX", size: "67 KB",  modified: "19 mar 2026", icon: Invoice01Icon },
  { name: "zdjecia_balustrad_wisniewski.jpg", type: "JPG",  size: "3.2 MB", modified: "16 mar 2026", icon: File01Icon    },
]

// Per-folder file contents — shown when navigating into a specific folder
const folderFiles: Record<string, FileItem[]> = {
  "offers-2026": [],  // shows sub-folders (projectFolders2026)
  "offers-2025": [],  // shows sub-folders (projectFolders2025)
  "projects": [
    { name: "realizacja_2603001_wisniewski.pdf",  type: "PDF",  size: "340 KB", modified: "21 mar 2026", icon: Pdf01Icon     },
    { name: "realizacja_2603002_budmax.pdf",      type: "PDF",  size: "290 KB", modified: "20 mar 2026", icon: Pdf01Icon     },
    { name: "realizacja_2603003_kowalczyk.pdf",   type: "PDF",  size: "180 KB", modified: "20 mar 2026", icon: Pdf01Icon     },
    { name: "zdjecia_dokumentacja_mar2026.zip",   type: "ZIP",  size: "18.4 MB",modified: "19 mar 2026", icon: File01Icon    },
  ],
  "suppliers": [
    { name: "umowa_Budmax_2026.pdf",              type: "PDF",  size: "210 KB", modified: "15 mar 2026", icon: Pdf01Icon     },
    { name: "cennik_TechBuild_Q1_2026.xlsx",      type: "XLSX", size: "88 KB",  modified: "10 mar 2026", icon: File01Icon    },
    { name: "oferta_DHL_2026.pdf",                type: "PDF",  size: "95 KB",  modified: "5 mar 2026",  icon: Pdf01Icon     },
    { name: "dane_dostawcy_RemBud.docx",          type: "DOCX", size: "34 KB",  modified: "1 mar 2026",  icon: Invoice01Icon },
  ],
  "invoices": [
    { name: "FV-2026-0147.pdf", type: "PDF", size: "124 KB", modified: "28 mar 2026", icon: Pdf01Icon },
    { name: "FV-2026-0146.pdf", type: "PDF", size: "98 KB",  modified: "26 mar 2026", icon: Pdf01Icon },
    { name: "FV-2026-0145.pdf", type: "PDF", size: "112 KB", modified: "24 mar 2026", icon: Pdf01Icon },
    { name: "FV-2026-0144.pdf", type: "PDF", size: "87 KB",  modified: "22 mar 2026", icon: Pdf01Icon },
    { name: "FV-2026-0143.pdf", type: "PDF", size: "134 KB", modified: "20 mar 2026", icon: Pdf01Icon },
    { name: "FV-2026-0142.pdf", type: "PDF", size: "76 KB",  modified: "18 mar 2026", icon: Pdf01Icon },
  ],
}

// Files inside individual project folders (p-2603001 etc.)
const projectFolderFiles: Record<string, FileItem[]> = {
  "p-2603001": [
    { name: "oferta_OF-0412_Wisniewski.pdf",   type: "PDF",  size: "156 KB", modified: "21 mar 2026", icon: Pdf01Icon     },
    { name: "protokol_odbioru.pdf",            type: "PDF",  size: "89 KB",  modified: "21 mar 2026", icon: Pdf01Icon     },
    { name: "faktura_FV-2026-0139.pdf",        type: "PDF",  size: "102 KB", modified: "20 mar 2026", icon: Pdf01Icon     },
    { name: "zdjecia_montaz_balustrad.jpg",    type: "JPG",  size: "4.1 MB", modified: "20 mar 2026", icon: File01Icon    },
    { name: "notatka_spotkanie.docx",          type: "DOCX", size: "28 KB",  modified: "18 mar 2026", icon: Invoice01Icon },
  ],
  "p-2603002": [
    { name: "oferta_OF-0409_Budmax.pdf",       type: "PDF",  size: "211 KB", modified: "20 mar 2026", icon: Pdf01Icon     },
    { name: "zamowienie_bloczki.xlsx",         type: "XLSX", size: "43 KB",  modified: "19 mar 2026", icon: File01Icon    },
    { name: "faktura_FV-2026-0138.pdf",        type: "PDF",  size: "118 KB", modified: "18 mar 2026", icon: Pdf01Icon     },
  ],
  "p-2603004": [
    { name: "oferta_OF-0441_TechBuild.pdf",    type: "PDF",  size: "89 KB",  modified: "18 mar 2026", icon: Pdf01Icon     },
    { name: "specyfikacja_techniczna.docx",    type: "DOCX", size: "67 KB",  modified: "17 mar 2026", icon: Invoice01Icon },
  ],
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

const typeBadgeClass: Record<string, string> = {
  PDF:  "bg-red-500/10    text-red-400    border-red-500/20",
  XLSX: "bg-wirmet-green/10 text-wirmet-green border-wirmet-green/20",
  DOCX: "bg-wirmet-blue/10  text-wirmet-blue  border-wirmet-blue/20",
  JPG:  "bg-amber-500/10  text-amber-400  border-amber-500/20",
  ZIP:  "bg-zinc-500/10   text-muted-foreground border-zinc-500/20",
}

// ─── Shared: item dropdown ─────────────────────────────────────────────────────
// Used on both folder and file ⋯ buttons — native dark mode (no CSS overrides)

function ItemMenu({ onDelete }: { onDelete?: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted/40 hover:text-foreground group-hover:opacity-100"
        >
          <HugeiconsIcon icon={MoreHorizontalIcon} size={14} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 border border-border">
        <DropdownMenuItem>
          <HugeiconsIcon icon={Download01Icon} size={14} />
          Pobierz
        </DropdownMenuItem>
        <DropdownMenuItem>
          <HugeiconsIcon icon={Copy01Icon} size={14} />
          Kopiuj
        </DropdownMenuItem>
        <DropdownMenuItem>
          <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
          Zmień nazwę
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <HugeiconsIcon icon={Delete01Icon} size={14} />
          Usuń
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─── Filter dropdown ───────────────────────────────────────────────────────────
// Native dark mode — matches sidebar dropdown pattern (border border-border, no overrides)

function FilterDropdown({ label, options }: { label: string; options: string[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          {label}
          <HugeiconsIcon icon={ArrowDown01Icon} size={12} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-44 border border-border">
        {options.map((opt) => (
          <DropdownMenuItem key={opt}>{opt}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─── View toggle ───────────────────────────────────────────────────────────────

function ViewToggle({
  view,
  setView,
}: {
  view: "grid" | "list"
  setView: (v: "grid" | "list") => void
}) {
  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-border p-0.5">
      <button
        onClick={() => setView("list")}
        className={cn(
          "rounded-md p-1.5 transition-colors",
          view === "list" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <HugeiconsIcon icon={ListViewIcon} size={15} />
      </button>
      <button
        onClick={() => setView("grid")}
        className={cn(
          "rounded-md p-1.5 transition-colors",
          view === "grid" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <HugeiconsIcon icon={GridViewIcon} size={15} />
      </button>
    </div>
  )
}

// ─── Folder card ───────────────────────────────────────────────────────────────

function FolderCard({
  folder,
  view,
  onClick,
}: {
  folder: FolderItem
  view: "grid" | "list"
  onClick: () => void
}) {
  const iconColor = folder.iconColor ?? "text-muted-foreground"
  const FolderIcon = folder.isCategory ? FolderOpenIcon : Folder01Icon

  if (view === "list") {
    return (
      <div
        onClick={onClick}
        className="group flex cursor-pointer items-center gap-3 px-5 py-3.5 transition-colors hover:bg-muted/20"
      >
        <HugeiconsIcon icon={FolderIcon} size={16} className={cn("shrink-0", iconColor)} />
        <p className="flex-1 truncate text-sm font-medium text-foreground">{folder.name}</p>
        {folder.count !== undefined && (
          <span className="shrink-0 text-xs text-muted-foreground tabular-nums">{folder.count} elem.</span>
        )}
        <span className="shrink-0 text-xs text-muted-foreground">{folder.modified}</span>
        <ItemMenu />
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className="group flex cursor-pointer flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/30"
    >
      <div className="flex items-start justify-between">
        <HugeiconsIcon icon={FolderIcon} size={folder.isCategory ? 22 : 18} className={cn("shrink-0", iconColor)} />
        <ItemMenu />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">{folder.name}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {folder.count !== undefined ? `${folder.count} elementów` : folder.modified}
        </p>
      </div>
    </div>
  )
}

// ─── File row ──────────────────────────────────────────────────────────────────

function FileRow({ file }: { file: FileItem }) {
  return (
    <div className="group flex cursor-pointer items-center gap-3 px-5 py-3.5 transition-colors hover:bg-muted/20">
      <HugeiconsIcon icon={file.icon} size={16} className="shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
        <p className="text-xs text-muted-foreground">{file.size} · {file.modified}</p>
      </div>
      <span className={cn(
        "shrink-0 rounded border px-1.5 py-px text-[10px] font-semibold",
        typeBadgeClass[file.type] ?? "bg-zinc-500/10 text-muted-foreground border-zinc-500/20"
      )}>
        {file.type}
      </span>
      <ItemMenu />
    </div>
  )
}

// ─── Toolbar ───────────────────────────────────────────────────────────────────

function Toolbar({
  view,
  setView,
  sortDir,
  setSortDir,
  showSort,
}: {
  view: "grid" | "list"
  setView: (v: "grid" | "list") => void
  sortDir: "asc" | "desc"
  setSortDir: (d: "asc" | "desc") => void
  showSort?: boolean
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <FilterDropdown
          label="Typ elementu"
          options={["Wszystkie", "Folder", "Dokument PDF", "Arkusz XLSX", "Zdjęcie"]}
        />
        <FilterDropdown
          label="Zmodyfikowano"
          options={["Dzisiaj", "W tym tygodniu", "W tym miesiącu", "W tym roku"]}
        />
        {showSort && (
          <button
            onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
            className="flex h-8 items-center gap-1.5 rounded-md border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <HugeiconsIcon icon={SortByDown01Icon} size={12} />
            Nazwa
            <HugeiconsIcon icon={sortDir === "asc" ? ArrowUp01Icon : ArrowDown01Icon} size={11} />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <ViewToggle view={view} setView={setView} />
        <Button variant="default" size="lg">
          <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
          Nowy folder
        </Button>
      </div>
    </div>
  )
}

// ─── Section label ─────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </p>
  )
}

// ─── Folder view (folder detail) ───────────────────────────────────────────────

function FolderView({
  folderKey,
  onBack,
}: {
  folderKey: string
  onBack: () => void
}) {
  const [view, setView] = useState<"grid" | "list">("grid")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  // Determine what to show: sub-folders or files
  const isOffers2026 = folderKey === "offers-2026"
  const isOffers2025 = folderKey === "offers-2025"
  const isProjectFolder = folderKey.startsWith("p-")

  const category = categoryFolders.find((f) => f.key === folderKey)
  const project = projectFolders.find((f) => f.key === folderKey)
  const folderName = category?.name ?? project?.name ?? folderKey
  const folderIconColor = category?.iconColor

  // Sub-folders for Oferty 2026 / Oferty 2025
  const subFolders2026: FolderItem[] = projectFolders
  const subFolders2025: FolderItem[] = [
    { key: "p-2502001", name: "2502001 Adam Nowak",          modified: "20 lut 2025" },
    { key: "p-2502002", name: "2502002 Instalbet Sp. z o.o.",modified: "18 lut 2025" },
    { key: "p-2502003", name: "2502003 Jan Kowalski",        modified: "15 lut 2025" },
    { key: "p-2502004", name: "2502004 Prefbet S.A.",        modified: "12 lut 2025" },
    { key: "p-2502005", name: "2502005 Maria Wiśniewska",    modified: "10 lut 2025" },
  ]

  const subFolders =
    isOffers2026 ? subFolders2026 :
    isOffers2025 ? subFolders2025 :
    null

  const files =
    isProjectFolder
      ? (projectFolderFiles[folderKey] ?? [])
      : (folderFiles[folderKey] ?? [])

  const sortedFolders = subFolders
    ? [...subFolders].sort((a, b) =>
        sortDir === "asc"
          ? a.name.localeCompare(b.name, "pl")
          : b.name.localeCompare(a.name, "pl")
      )
    : null

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">

      {/* Breadcrumb + back */}
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
          Pliki
        </button>
        <span className="text-muted-foreground/40">/</span>
        <span className={cn("text-sm font-medium", folderIconColor ?? "text-foreground")}>
          {folderName}
        </span>
      </div>

      {/* Toolbar */}
      <Toolbar
        view={view}
        setView={setView}
        sortDir={sortDir}
        setSortDir={setSortDir}
        showSort={!!sortedFolders}
      />

      {/* Sub-folders (Oferty 2026 / 2025) */}
      {sortedFolders && (
        <div className="flex flex-col gap-3">
          <SectionLabel>Foldery projektów — {folderName}</SectionLabel>
          {view === "grid" ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {sortedFolders.map((f) => (
                <FolderCard key={f.key} folder={f} view="grid" onClick={() => {}} />
              ))}
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
              {sortedFolders.map((f) => (
                <FolderCard key={f.key} folder={f} view="list" onClick={() => {}} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Files */}
      {files.length > 0 && (
        <div className="flex flex-col gap-3">
          <SectionLabel>Pliki</SectionLabel>
          <div className="overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
            {files.map((file) => (
              <FileRow key={file.name} file={file} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!sortedFolders && files.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-16">
          <HugeiconsIcon icon={FolderOpenIcon} size={28} className="text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground/50">Folder jest pusty</p>
          <Button variant="outline" size="lg">
            <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
            Dodaj plik
          </Button>
        </div>
      )}
    </div>
  )
}

// ─── Root files view ───────────────────────────────────────────────────────────

function RootView({ onNavigate }: { onNavigate: (key: string) => void }) {
  const [view, setView] = useState<"grid" | "list">("grid")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  const sortedProjectFolders = [...projectFolders].sort((a, b) =>
    sortDir === "asc"
      ? a.name.localeCompare(b.name, "pl")
      : b.name.localeCompare(a.name, "pl")
  )

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">

      {/* Toolbar */}
      <Toolbar
        view={view}
        setView={setView}
        sortDir={sortDir}
        setSortDir={setSortDir}
        showSort={true}
      />

      {/* Kartoteki */}
      <div className="flex flex-col gap-3">
        <SectionLabel>Kartoteki</SectionLabel>
        {view === "grid" ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {categoryFolders.map((f) => (
              <FolderCard key={f.key} folder={f} view="grid" onClick={() => onNavigate(f.key)} />
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
            {categoryFolders.map((f) => (
              <FolderCard key={f.key} folder={f} view="list" onClick={() => onNavigate(f.key)} />
            ))}
          </div>
        )}
      </div>

      {/* Foldery projektów */}
      <div className="flex flex-col gap-3">
        <SectionLabel>Foldery projektów</SectionLabel>
        {view === "grid" ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {sortedProjectFolders.map((f) => (
              <FolderCard key={f.key} folder={f} view="grid" onClick={() => onNavigate(f.key)} />
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
            {sortedProjectFolders.map((f) => (
              <FolderCard key={f.key} folder={f} view="list" onClick={() => onNavigate(f.key)} />
            ))}
          </div>
        )}
      </div>

      {/* Pliki bez folderu */}
      <div className="flex flex-col gap-3">
        <SectionLabel>Pliki bez folderu</SectionLabel>
        <div className="overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
          {looseFiles.map((file) => (
            <FileRow key={file.name} file={file} />
          ))}
        </div>
      </div>

    </div>
  )
}

// ─── Inner page (reads search params) ─────────────────────────────────────────

function FilesInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const folderParam = searchParams.get("folder")

  function navigateTo(key: string) {
    router.push(`/files?folder=${key}`)
  }

  function navigateBack() {
    router.push("/files")
  }

  return folderParam ? (
    <FolderView folderKey={folderParam} onBack={navigateBack} />
  ) : (
    <RootView onNavigate={navigateTo} />
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function FilesPage() {
  return (
    <>
      <PageSetup title="Pliki" icon={Folder01Icon} />
      <Suspense>
        <FilesInner />
      </Suspense>
    </>
  )
}
