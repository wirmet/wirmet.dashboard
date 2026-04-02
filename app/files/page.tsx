"use client"

import { Suspense, useState, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { PageSetup } from "@/components/PageSetup"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { Input } from "@/components/ui/input"
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
  FolderLibraryIcon,
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
  Upload01Icon,
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
  key: string
  name: string
  type: string
  size: string
  modified: string
  icon: IconSvgElement
  fileRef?: File
}

// ─── Initial data ──────────────────────────────────────────────────────────────

const initialCategoryFolders: FolderItem[] = [
  { key: "offers-2026", name: "Oferty 2026",         modified: "29 mar 2026", iconColor: "text-wirmet-orange",    count: 29, isCategory: true },
  { key: "offers-2025", name: "Oferty 2025",         modified: "15 sty 2026", iconColor: "text-wirmet-orange/60", count: 67, isCategory: true },
  { key: "projects",    name: "Archiwum realizacji", modified: "20 mar 2026", iconColor: "text-wirmet-green",     count: 14, isCategory: true },
  { key: "suppliers",   name: "Dokumenty dostawców", modified: "12 mar 2026", iconColor: "text-wirmet-blue",      count: 8,  isCategory: true },
  { key: "invoices",    name: "Faktury",             modified: "28 mar 2026", iconColor: "text-rose-400",         count: 43, isCategory: true },
]

const initialProjectFolders: FolderItem[] = [
  { key: "p-2603001", name: "2603001 Marek Wiśniewski",     modified: "21 mar 2026" },
  { key: "p-2603002", name: "2603002 Budmax Sp. z o.o.",    modified: "20 mar 2026" },
  { key: "p-2603003", name: "2603003 Anna Kowalczyk",       modified: "20 mar 2026" },
  { key: "p-2603004", name: "2603004 TechBuild Sp. z o.o.", modified: "18 mar 2026" },
  { key: "p-2603005", name: "2603005 Konstrukt S.A.",       modified: "17 mar 2026" },
  { key: "p-2603006", name: "2603006 Rem-Bud Usługi",       modified: "15 mar 2026" },
  { key: "p-2603007", name: "2603007 Piotr Jabłoński",      modified: "14 mar 2026" },
  { key: "p-2603008", name: "2603008 Nowak & Syn Budowa",   modified: "12 mar 2026" },
  { key: "p-2603009", name: "2603009 Piotr Zając",          modified: "10 mar 2026" },
  { key: "p-2603010", name: "2603010 Agnieszka Kowalska",   modified: "8 mar 2026"  },
  { key: "p-2603011", name: "2603011 Joanna Lewandowska",   modified: "6 mar 2026"  },
  { key: "p-2603012", name: "2603012 Firma Rem-Bud",        modified: "3 mar 2026"  },
]

const initialLooseFiles: FileItem[] = [
  { key: "faktura_FV-2026-0147.pdf",         name: "faktura_FV-2026-0147.pdf",         type: "PDF",  size: "124 KB", modified: "28 mar 2026", icon: Pdf01Icon     },
  { key: "oferta_OF-0441_TechBuild.pdf",     name: "oferta_OF-0441_TechBuild.pdf",     type: "PDF",  size: "89 KB",  modified: "25 mar 2026", icon: Pdf01Icon     },
  { key: "harmonogram_marzec2026.xlsx",      name: "harmonogram_marzec2026.xlsx",      type: "XLSX", size: "45 KB",  modified: "22 mar 2026", icon: File01Icon    },
  { key: "protokol_odbioru_budmax.docx",     name: "protokol_odbioru_budmax.docx",     type: "DOCX", size: "67 KB",  modified: "19 mar 2026", icon: Invoice01Icon },
  { key: "zdjecia_balustrad_wisniewski.jpg", name: "zdjecia_balustrad_wisniewski.jpg", type: "JPG",  size: "3.2 MB", modified: "16 mar 2026", icon: File01Icon    },
]

const staticFolderFiles: Record<string, FileItem[]> = {
  "offers-2026": [],
  "offers-2025": [],
  "projects": [
    { key: "realizacja_2603001_wisniewski.pdf", name: "realizacja_2603001_wisniewski.pdf", type: "PDF", size: "340 KB",  modified: "21 mar 2026", icon: Pdf01Icon  },
    { key: "realizacja_2603002_budmax.pdf",     name: "realizacja_2603002_budmax.pdf",     type: "PDF", size: "290 KB",  modified: "20 mar 2026", icon: Pdf01Icon  },
    { key: "realizacja_2603003_kowalczyk.pdf",  name: "realizacja_2603003_kowalczyk.pdf",  type: "PDF", size: "180 KB",  modified: "20 mar 2026", icon: Pdf01Icon  },
    { key: "zdjecia_dokumentacja_mar2026.zip",  name: "zdjecia_dokumentacja_mar2026.zip",  type: "ZIP", size: "18.4 MB", modified: "19 mar 2026", icon: File01Icon },
  ],
  "suppliers": [
    { key: "umowa_Budmax_2026.pdf",         name: "umowa_Budmax_2026.pdf",         type: "PDF",  size: "210 KB", modified: "15 mar 2026", icon: Pdf01Icon     },
    { key: "cennik_TechBuild_Q1_2026.xlsx", name: "cennik_TechBuild_Q1_2026.xlsx", type: "XLSX", size: "88 KB",  modified: "10 mar 2026", icon: File01Icon    },
    { key: "oferta_DHL_2026.pdf",           name: "oferta_DHL_2026.pdf",           type: "PDF",  size: "95 KB",  modified: "5 mar 2026",  icon: Pdf01Icon     },
    { key: "dane_dostawcy_RemBud.docx",     name: "dane_dostawcy_RemBud.docx",     type: "DOCX", size: "34 KB",  modified: "1 mar 2026",  icon: Invoice01Icon },
  ],
  "invoices": [
    { key: "FV-2026-0147.pdf", name: "FV-2026-0147.pdf", type: "PDF", size: "124 KB", modified: "28 mar 2026", icon: Pdf01Icon },
    { key: "FV-2026-0146.pdf", name: "FV-2026-0146.pdf", type: "PDF", size: "98 KB",  modified: "26 mar 2026", icon: Pdf01Icon },
    { key: "FV-2026-0145.pdf", name: "FV-2026-0145.pdf", type: "PDF", size: "112 KB", modified: "24 mar 2026", icon: Pdf01Icon },
    { key: "FV-2026-0144.pdf", name: "FV-2026-0144.pdf", type: "PDF", size: "87 KB",  modified: "22 mar 2026", icon: Pdf01Icon },
    { key: "FV-2026-0143.pdf", name: "FV-2026-0143.pdf", type: "PDF", size: "134 KB", modified: "20 mar 2026", icon: Pdf01Icon },
    { key: "FV-2026-0142.pdf", name: "FV-2026-0142.pdf", type: "PDF", size: "76 KB",  modified: "18 mar 2026", icon: Pdf01Icon },
  ],
}

const staticProjectFolderFiles: Record<string, FileItem[]> = {
  "p-2603001": [
    { key: "oferta_OF-0412_Wisniewski.pdf", name: "oferta_OF-0412_Wisniewski.pdf", type: "PDF",  size: "156 KB", modified: "21 mar 2026", icon: Pdf01Icon     },
    { key: "protokol_odbioru.pdf",          name: "protokol_odbioru.pdf",          type: "PDF",  size: "89 KB",  modified: "21 mar 2026", icon: Pdf01Icon     },
    { key: "faktura_FV-2026-0139.pdf",      name: "faktura_FV-2026-0139.pdf",      type: "PDF",  size: "102 KB", modified: "20 mar 2026", icon: Pdf01Icon     },
    { key: "zdjecia_montaz_balustrad.jpg",  name: "zdjecia_montaz_balustrad.jpg",  type: "JPG",  size: "4.1 MB", modified: "20 mar 2026", icon: File01Icon    },
    { key: "notatka_spotkanie.docx",        name: "notatka_spotkanie.docx",        type: "DOCX", size: "28 KB",  modified: "18 mar 2026", icon: Invoice01Icon },
  ],
  "p-2603002": [
    { key: "oferta_OF-0409_Budmax.pdf",  name: "oferta_OF-0409_Budmax.pdf",  type: "PDF",  size: "211 KB", modified: "20 mar 2026", icon: Pdf01Icon  },
    { key: "zamowienie_bloczki.xlsx",    name: "zamowienie_bloczki.xlsx",    type: "XLSX", size: "43 KB",  modified: "19 mar 2026", icon: File01Icon },
    { key: "faktura_FV-2026-0138.pdf",   name: "faktura_FV-2026-0138.pdf",   type: "PDF",  size: "118 KB", modified: "18 mar 2026", icon: Pdf01Icon  },
  ],
  "p-2603004": [
    { key: "oferta_OF-0441_TechBuild.pdf", name: "oferta_OF-0441_TechBuild.pdf", type: "PDF",  size: "89 KB",  modified: "18 mar 2026", icon: Pdf01Icon     },
    { key: "specyfikacja_techniczna.docx", name: "specyfikacja_techniczna.docx", type: "DOCX", size: "67 KB",  modified: "17 mar 2026", icon: Invoice01Icon },
  ],
}

// ─── File type helpers ─────────────────────────────────────────────────────────

const typeBadgeClass: Record<string, string> = {
  PDF:  "bg-red-500/10      text-red-400         border-red-500/20",
  XLSX: "bg-wirmet-green/10 text-wirmet-green     border-wirmet-green/20",
  DOCX: "bg-wirmet-blue/10  text-wirmet-blue      border-wirmet-blue/20",
  JPG:  "bg-amber-500/10    text-amber-400        border-amber-500/20",
  PNG:  "bg-amber-500/10    text-amber-400        border-amber-500/20",
  ZIP:  "bg-zinc-500/10     text-muted-foreground border-zinc-500/20",
  FILE: "bg-zinc-500/10     text-muted-foreground border-zinc-500/20",
}

function extToType(ext: string): string {
  switch (ext.toLowerCase()) {
    case "pdf":               return "PDF"
    case "xlsx": case "xls":  return "XLSX"
    case "docx": case "doc":  return "DOCX"
    case "jpg":  case "jpeg": return "JPG"
    case "png":               return "PNG"
    case "zip":               return "ZIP"
    default:                  return "FILE"
  }
}

function typeToIcon(type: string): IconSvgElement {
  switch (type) {
    case "PDF":  return Pdf01Icon
    case "XLSX": return File01Icon
    case "DOCX": return Invoice01Icon
    default:     return File01Icon
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1_000_000) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1_000_000).toFixed(1)} MB`
}

// ─── Filter helpers ────────────────────────────────────────────────────────────

const POLISH_MONTHS: Record<string, number> = {
  sty: 0, lut: 1, mar: 2, kwi: 3, maj: 4, cze: 5,
  lip: 6, sie: 7, wrz: 8, paź: 9, lis: 10, gru: 11,
}

// Reference date matching the mock data (per project currentDate in CLAUDE.md)
const TODAY = new Date(2026, 2, 30)

function parseModified(str: string): Date | null {
  if (str === "dzisiaj") return TODAY
  const parts = str.trim().split(/\s+/)
  if (parts.length === 3) {
    const day   = parseInt(parts[0])
    const month = POLISH_MONTHS[parts[1]]
    const year  = parseInt(parts[2])
    if (!isNaN(day) && month !== undefined && !isNaN(year)) return new Date(year, month, day)
  }
  return null
}

function matchesDate(dateFilter: string, modified: string): boolean {
  if (dateFilter === "Wszystkie") return true
  const date = parseModified(modified)
  if (!date) return true
  switch (dateFilter) {
    case "Dzisiaj":
      return date.toDateString() === TODAY.toDateString()
    case "W tym tygodniu": {
      const weekAgo = new Date(TODAY); weekAgo.setDate(TODAY.getDate() - 7)
      return date >= weekAgo && date <= TODAY
    }
    case "W tym miesiącu":
      return date.getFullYear() === TODAY.getFullYear() && date.getMonth() === TODAY.getMonth()
    case "W tym roku":
      return date.getFullYear() === TODAY.getFullYear()
    default: return true
  }
}

function matchesFileType(typeFilter: string, fileType: string): boolean {
  switch (typeFilter) {
    case "Wszystkie":    return true
    case "Folder":       return false
    case "Dokument PDF": return fileType === "PDF"
    case "Arkusz XLSX":  return fileType === "XLSX"
    case "Zdjęcie":      return fileType === "JPG" || fileType === "PNG"
    default:             return true
  }
}

// Whether folder sections (kartoteki, project folders, sub-folders) are visible
function showFolders(typeFilter: string): boolean {
  return typeFilter === "Wszystkie" || typeFilter === "Folder"
}

// Whether file sections are visible for this type filter
function showFiles(typeFilter: string): boolean {
  return typeFilter !== "Folder"
}

// ─── Download helpers ──────────────────────────────────────────────────────────

function triggerDownload(file: FileItem) {
  const url = file.fileRef
    ? URL.createObjectURL(file.fileRef)
    : URL.createObjectURL(new Blob([`Plik demonstracyjny: ${file.name}`], { type: "text/plain" }))
  const a = document.createElement("a")
  a.href = url; a.download = file.name
  document.body.appendChild(a); a.click(); document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 100)
}

function downloadFolderManifest(folder: FolderItem) {
  const files = staticFolderFiles[folder.key] ?? staticProjectFolderFiles[folder.key] ?? []
  const lines = [
    `Folder: ${folder.name}`,
    `Data modyfikacji: ${folder.modified}`,
    folder.count !== undefined ? `Elementów: ${folder.count}` : `Plików: ${files.length}`,
    "",
    ...(files.length > 0
      ? ["Pliki:", ...files.map((f) => `  - ${f.name} (${f.size}, ${f.modified})`)]
      : ["Folder jest pusty."]),
  ]
  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement("a")
  a.href = url
  a.download = `${folder.name.replace(/[/\\?%*:|"<>]/g, "_")}.txt`
  document.body.appendChild(a); a.click(); document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 100)
}

// ─── Duplicate helpers ─────────────────────────────────────────────────────────

function duplicateFile(file: FileItem): FileItem {
  const dot = file.name.lastIndexOf(".")
  const base = dot > 0 ? file.name.slice(0, dot) : file.name
  const ext  = dot > 0 ? file.name.slice(dot)    : ""
  return { ...file, key: `${file.key}-kopia-${Date.now()}`, name: `${base} — kopia${ext}`, modified: "dzisiaj", fileRef: undefined }
}

function duplicateFolder(folder: FolderItem): FolderItem {
  return { ...folder, key: `${folder.key}-kopia-${Date.now()}`, name: `${folder.name} — kopia`, modified: "dzisiaj", count: 0 }
}

// ─── Kartoteka color options ───────────────────────────────────────────────────

const kartotekaColors = [
  { id: "orange", label: "Pomarańczowy", iconColor: "text-wirmet-orange", bgClass: "bg-wirmet-orange" },
  { id: "blue",   label: "Niebieski",    iconColor: "text-wirmet-blue",   bgClass: "bg-wirmet-blue"   },
  { id: "green",  label: "Zielony",      iconColor: "text-wirmet-green",  bgClass: "bg-wirmet-green"  },
  { id: "rose",   label: "Różowy",       iconColor: "text-rose-400",      bgClass: "bg-rose-400"      },
]

// ─── Delete confirmation dialog ────────────────────────────────────────────────

function DeleteConfirmDialog({ open, name, onConfirm, onCancel }: {
  open: boolean; name: string; onConfirm: () => void; onCancel: () => void
}) {
  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Usuń element</AlertDialogTitle>
          <AlertDialogDescription>
            Czy na pewno chcesz usunąć <span className="font-medium text-foreground">„{name}"</span>?
            Tej operacji nie można cofnąć.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Anuluj</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Usuń</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ─── Rename dialog ─────────────────────────────────────────────────────────────

function RenameDialog({ open, currentName, onConfirm, onCancel }: {
  open: boolean; currentName: string; onConfirm: (n: string) => void; onCancel: () => void
}) {
  const [value, setValue] = useState(currentName)
  const wasOpen = useRef(false)
  if (open && !wasOpen.current) { setValue(currentName); wasOpen.current = true }
  if (!open) wasOpen.current = false

  function handleSubmit() {
    const trimmed = value.trim()
    if (!trimmed || trimmed === currentName) { onCancel(); return }
    onConfirm(trimmed)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Zmień nazwę</DialogTitle>
          <DialogDescription>Wprowadź nową nazwę.</DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <Input value={value} onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()} autoFocus />
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" size="lg" onClick={onCancel}>Anuluj</Button>
          <Button variant="default" size="lg" onClick={handleSubmit} disabled={!value.trim()}>Zapisz</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── New folder dialog ─────────────────────────────────────────────────────────

function NewFolderDialog({ open, onOpenChange, onConfirm }: {
  open: boolean; onOpenChange: (v: boolean) => void; onConfirm: (name: string) => void
}) {
  const [name, setName] = useState("")
  function handleSubmit() {
    const t = name.trim(); if (!t) return
    onConfirm(t); setName(""); onOpenChange(false)
  }
  function handleOpenChange(v: boolean) { if (!v) setName(""); onOpenChange(v) }
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Nowy folder</DialogTitle>
          <DialogDescription>Podaj nazwę dla nowego folderu projektów.</DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <Input placeholder="np. 2603013 Jan Kowalski" value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()} autoFocus />
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" size="lg" onClick={() => handleOpenChange(false)}>Anuluj</Button>
          <Button variant="default" size="lg" onClick={handleSubmit} disabled={!name.trim()}>Utwórz</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── New kartoteka dialog ──────────────────────────────────────────────────────

function NewKartotekaDialog({ open, onOpenChange, onConfirm }: {
  open: boolean; onOpenChange: (v: boolean) => void; onConfirm: (name: string, iconColor: string) => void
}) {
  const [name, setName] = useState("")
  const [colorId, setColorId] = useState("orange")
  function handleSubmit() {
    const t = name.trim(); if (!t) return
    const chosen = kartotekaColors.find((c) => c.id === colorId)!
    onConfirm(t, chosen.iconColor); setName(""); setColorId("orange"); onOpenChange(false)
  }
  function handleOpenChange(v: boolean) { if (!v) { setName(""); setColorId("orange") }; onOpenChange(v) }
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Nowa kartoteka</DialogTitle>
          <DialogDescription>Podaj nazwę i wybierz kolor dla nowej kartoteki.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <Input placeholder="np. Umowy 2026" value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()} autoFocus />
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-muted-foreground">Kolor ikony</p>
            <div className="flex items-center gap-2">
              {kartotekaColors.map((c) => (
                <button key={c.id} onClick={() => setColorId(c.id)} title={c.label}
                  className={cn("size-7 rounded-full transition-all", c.bgClass,
                    colorId === c.id ? "ring-2 ring-offset-2 ring-offset-background ring-current scale-110" : "opacity-50 hover:opacity-80"
                  )} />
              ))}
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" size="lg" onClick={() => handleOpenChange(false)}>Anuluj</Button>
          <Button variant="default" size="lg" onClick={handleSubmit} disabled={!name.trim()}>Utwórz</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Item context menu ─────────────────────────────────────────────────────────

interface ItemMenuProps {
  onDelete: () => void
  onRename: () => void
  onCopy: () => void
  onDownload: () => void
}

function ItemMenu({ onDelete, onRename, onCopy, onDownload }: ItemMenuProps) {
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
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDownload() }}>
          <HugeiconsIcon icon={Download01Icon} size={14} />
          Pobierz
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onCopy() }}>
          <HugeiconsIcon icon={Copy01Icon} size={14} />
          Kopiuj
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onRename() }}>
          <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
          Zmień nazwę
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={(e) => { e.stopPropagation(); onDelete() }}>
          <HugeiconsIcon icon={Delete01Icon} size={14} />
          Usuń
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─── Filter dropdown (controlled) ─────────────────────────────────────────────

function FilterDropdown({ label, options, value, onChange }: {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  // Active = anything other than the first option ("Wszystkie")
  const isActive = value !== options[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline" size="sm"
          className={cn(
            "h-8 gap-1.5 text-xs font-medium transition-colors",
            isActive
              ? "border-wirmet-orange/40 bg-wirmet-orange/8 text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {/* Orange dot when filter is active */}
          {isActive && <span className="size-1.5 rounded-full bg-wirmet-orange shrink-0" />}
          {isActive ? value : label}
          <HugeiconsIcon icon={ArrowDown01Icon} size={12} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48 border border-border">
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt}
            onClick={() => onChange(opt)}
            className={cn(opt === value && "font-medium")}
          >
            {opt === value && <span className="size-1.5 rounded-full bg-wirmet-orange shrink-0" />}
            {opt}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─── View toggle ───────────────────────────────────────────────────────────────

function ViewToggle({ view, setView }: { view: "grid" | "list"; setView: (v: "grid" | "list") => void }) {
  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-border p-0.5">
      {(["list", "grid"] as const).map((v) => (
        <button key={v} onClick={() => setView(v)}
          className={cn("rounded-md p-1.5 transition-colors",
            view === v ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")}>
          <HugeiconsIcon icon={v === "list" ? ListViewIcon : GridViewIcon} size={15} />
        </button>
      ))}
    </div>
  )
}

// ─── Add dropdown ──────────────────────────────────────────────────────────────

function AddDropdown({ onUploadFile, onNewFolder, onNewKartoteka }: {
  onUploadFile: () => void; onNewFolder: () => void; onNewKartoteka: () => void
}) {
  const { resolvedTheme } = useTheme()
  const isLight = resolvedTheme === "light"
  const lightOverrides = isLight ? ({
    "--popover":            "oklch(1 0 0)",
    "--popover-foreground": "oklch(0.145 0 0)",
    "--accent":             "oklch(0.97 0 0)",
    "--accent-foreground":  "oklch(0.205 0 0)",
    "--border":             "oklch(0.922 0 0)",
  } as React.CSSProperties) : undefined

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" size="lg">
          <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
          Dodaj
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={cn("w-52", isLight ? "border border-zinc-200" : "border border-border")}
        style={lightOverrides}
      >
        <DropdownMenuItem onClick={onUploadFile}>
          <HugeiconsIcon icon={Upload01Icon} size={14} />
          Dodaj plik z komputera
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onNewFolder}>
          <HugeiconsIcon icon={Folder01Icon} size={14} />
          Nowy folder
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onNewKartoteka}>
          <HugeiconsIcon icon={FolderLibraryIcon} size={14} />
          Nowa kartoteka
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─── Filters row ───────────────────────────────────────────────────────────────

const TYPE_OPTIONS = ["Wszystkie", "Folder", "Dokument PDF", "Arkusz XLSX", "Zdjęcie"]
const DATE_OPTIONS = ["Wszystkie", "Dzisiaj", "W tym tygodniu", "W tym miesiącu", "W tym roku"]

function FiltersRow({ typeFilter, setTypeFilter, dateFilter, setDateFilter, sortDir, setSortDir, showSort }: {
  typeFilter: string; setTypeFilter: (v: string) => void
  dateFilter: string; setDateFilter: (v: string) => void
  sortDir: "asc" | "desc"; setSortDir: (d: "asc" | "desc") => void
  showSort?: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <FilterDropdown label="Typ elementu"  options={TYPE_OPTIONS} value={typeFilter} onChange={setTypeFilter} />
      <FilterDropdown label="Zmodyfikowano" options={DATE_OPTIONS} value={dateFilter} onChange={setDateFilter} />
      {showSort && (
        <Button variant="outline" size="sm"
          className="h-8 gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}>
          <HugeiconsIcon icon={SortByDown01Icon} size={12} />
          Nazwa
          <HugeiconsIcon icon={sortDir === "asc" ? ArrowUp01Icon : ArrowDown01Icon} size={11} />
        </Button>
      )}
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

// Empty row shown inside a section when filters produce no results
function EmptyFilterRow() {
  return (
    <div className="flex items-center justify-center px-5 py-6">
      <p className="text-xs text-muted-foreground/50">Brak wyników dla wybranych filtrów</p>
    </div>
  )
}

// ─── Folder card ───────────────────────────────────────────────────────────────

function FolderCard({ folder, view, onClick, onDelete, onRename, onCopy, onDownload }: {
  folder: FolderItem; view: "grid" | "list"; onClick: () => void
  onDelete: () => void; onRename: () => void; onCopy: () => void; onDownload: () => void
}) {
  const iconColor  = folder.iconColor ?? "text-muted-foreground"
  const FolderIcon = folder.isCategory ? FolderOpenIcon : Folder01Icon

  if (view === "list") {
    return (
      <div onClick={onClick} className="group flex cursor-pointer items-center gap-3 px-5 py-3.5 transition-colors hover:bg-muted/20">
        <HugeiconsIcon icon={FolderIcon} size={16} className={cn("shrink-0", iconColor)} />
        <p className="flex-1 truncate text-sm font-medium text-foreground">{folder.name}</p>
        {folder.count !== undefined && (
          <span className="shrink-0 text-xs text-muted-foreground tabular-nums">{folder.count} elem.</span>
        )}
        <span className="shrink-0 text-xs text-muted-foreground">{folder.modified}</span>
        <ItemMenu onDelete={onDelete} onRename={onRename} onCopy={onCopy} onDownload={onDownload} />
      </div>
    )
  }

  return (
    <div onClick={onClick} className="group flex cursor-pointer flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/30">
      <div className="flex items-start justify-between">
        <HugeiconsIcon icon={FolderIcon} size={folder.isCategory ? 22 : 18} className={cn("shrink-0", iconColor)} />
        <ItemMenu onDelete={onDelete} onRename={onRename} onCopy={onCopy} onDownload={onDownload} />
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

function FileRow({ file, onDelete, onRename, onCopy }: {
  file: FileItem; onDelete: () => void; onRename: () => void; onCopy: () => void
}) {
  return (
    <div className="group flex cursor-pointer items-center gap-3 px-5 py-3.5 transition-colors hover:bg-muted/20">
      <HugeiconsIcon icon={file.icon} size={16} className="shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
        <p className="text-xs text-muted-foreground">{file.size} · {file.modified}</p>
      </div>
      <span className={cn("shrink-0 rounded border px-1.5 py-px text-[10px] font-semibold",
        typeBadgeClass[file.type] ?? "bg-zinc-500/10 text-muted-foreground border-zinc-500/20")}>
        {file.type}
      </span>
      <ItemMenu
        onDelete={onDelete} onRename={onRename} onCopy={onCopy}
        onDownload={() => triggerDownload(file)}
      />
    </div>
  )
}

// ─── Folder view ───────────────────────────────────────────────────────────────

function FolderView({ folderKey, onBack, categoryFolders, projectFolders, onNewFolder, onNewKartoteka, fileInputRef }: {
  folderKey: string; onBack: () => void
  categoryFolders: FolderItem[]; projectFolders: FolderItem[]
  onNewFolder: () => void; onNewKartoteka: () => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
}) {
  const [view,       setView]       = useState<"grid" | "list">("grid")
  const [sortDir,    setSortDir]    = useState<"asc" | "desc">("asc")
  const [typeFilter, setTypeFilter] = useState("Wszystkie")
  const [dateFilter, setDateFilter] = useState("Wszystkie")

  const isProjectFolder = folderKey.startsWith("p-")
  const category    = categoryFolders.find((f) => f.key === folderKey)
  const project     = projectFolders.find((f)  => f.key === folderKey)
  const folderName      = category?.name ?? project?.name ?? folderKey
  const folderIconColor = category?.iconColor

  // Sub-folder state
  const staticSubs: FolderItem[] =
    folderKey === "offers-2026" ? projectFolders :
    folderKey === "offers-2025" ? [
      { key: "p-2502001", name: "2502001 Adam Nowak",           modified: "20 lut 2025" },
      { key: "p-2502002", name: "2502002 Instalbet Sp. z o.o.", modified: "18 lut 2025" },
      { key: "p-2502003", name: "2502003 Jan Kowalski",         modified: "15 lut 2025" },
      { key: "p-2502004", name: "2502004 Prefbet S.A.",         modified: "12 lut 2025" },
      { key: "p-2502005", name: "2502005 Maria Wiśniewska",     modified: "10 lut 2025" },
    ] : []

  const hasSubFolders = staticSubs.length > 0
  const [subFolders, setSubFolders] = useState<FolderItem[]>(staticSubs)
  const [files,      setFiles]      = useState<FileItem[]>(
    isProjectFolder ? (staticProjectFolderFiles[folderKey] ?? []) : (staticFolderFiles[folderKey] ?? [])
  )

  // Dialog state
  const [deleteTarget, setDeleteTarget] = useState<{ kind: "folder" | "file"; key: string; name: string } | null>(null)
  const [renameTarget, setRenameTarget] = useState<{ kind: "folder" | "file"; key: string; currentName: string } | null>(null)

  // Apply filters
  const visibleSubFolders = showFolders(typeFilter)
    ? [...subFolders]
        .filter((f) => matchesDate(dateFilter, f.modified))
        .sort((a, b) => sortDir === "asc" ? a.name.localeCompare(b.name, "pl") : b.name.localeCompare(a.name, "pl"))
    : []

  const visibleFiles = showFiles(typeFilter)
    ? files.filter((f) => matchesFileType(typeFilter, f.type) && matchesDate(dateFilter, f.modified))
    : []

  function confirmDelete() {
    if (!deleteTarget) return
    if (deleteTarget.kind === "folder") setSubFolders((p) => p.filter((f) => f.key !== deleteTarget.key))
    if (deleteTarget.kind === "file")   setFiles((p)      => p.filter((f) => f.key !== deleteTarget.key))
    setDeleteTarget(null)
  }

  function confirmRename(newName: string) {
    if (!renameTarget) return
    if (renameTarget.kind === "folder") setSubFolders((p) => p.map((f) => f.key === renameTarget.key ? { ...f, name: newName } : f))
    if (renameTarget.kind === "file")   setFiles((p)      => p.map((f) => f.key === renameTarget.key ? { ...f, name: newName } : f))
    setRenameTarget(null)
  }

  return (
    <>
      <DeleteConfirmDialog open={!!deleteTarget} name={deleteTarget?.name ?? ""}
        onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />
      <RenameDialog open={!!renameTarget} currentName={renameTarget?.currentName ?? ""}
        onConfirm={confirmRename} onCancel={() => setRenameTarget(null)} />

      <div className="flex flex-col gap-6 p-4 md:p-8">

        {/* Header row: breadcrumb left, controls right */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button onClick={onBack}
              className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
              <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
              Pliki
            </button>
            <span className="text-muted-foreground/40">/</span>
            <span className={cn("text-sm font-medium", folderIconColor ?? "text-foreground")}>{folderName}</span>
          </div>
          <div className="flex items-center gap-2">
            <ViewToggle view={view} setView={setView} />
            <AddDropdown
              onUploadFile={() => fileInputRef.current?.click()}
              onNewFolder={onNewFolder}
              onNewKartoteka={onNewKartoteka}
            />
          </div>
        </div>

        {/* Filters */}
        <FiltersRow
          typeFilter={typeFilter} setTypeFilter={setTypeFilter}
          dateFilter={dateFilter} setDateFilter={setDateFilter}
          sortDir={sortDir} setSortDir={setSortDir}
          showSort={hasSubFolders}
        />

        {/* Sub-folders */}
        {hasSubFolders && showFolders(typeFilter) && (
          <div className="flex flex-col gap-3">
            <SectionLabel>Foldery projektów — {folderName}</SectionLabel>
            {visibleSubFolders.length === 0 ? (
              <div className="overflow-hidden rounded-2xl border border-border bg-card">
                <EmptyFilterRow />
              </div>
            ) : view === "grid" ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {visibleSubFolders.map((f) => (
                  <FolderCard key={f.key} folder={f} view="grid" onClick={() => {}}
                    onDelete={() => setDeleteTarget({ kind: "folder", key: f.key, name: f.name })}
                    onRename={() => setRenameTarget({ kind: "folder", key: f.key, currentName: f.name })}
                    onCopy={() => setSubFolders((p) => { const i = p.findIndex((x) => x.key === f.key); const copy = duplicateFolder(f); const next = [...p]; next.splice(i + 1, 0, copy); return next })}
                    onDownload={() => downloadFolderManifest(f)}
                  />
                ))}
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
                {visibleSubFolders.map((f) => (
                  <FolderCard key={f.key} folder={f} view="list" onClick={() => {}}
                    onDelete={() => setDeleteTarget({ kind: "folder", key: f.key, name: f.name })}
                    onRename={() => setRenameTarget({ kind: "folder", key: f.key, currentName: f.name })}
                    onCopy={() => setSubFolders((p) => { const i = p.findIndex((x) => x.key === f.key); const copy = duplicateFolder(f); const next = [...p]; next.splice(i + 1, 0, copy); return next })}
                    onDownload={() => downloadFolderManifest(f)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Files */}
        {showFiles(typeFilter) && (files.length > 0 || (hasSubFolders && visibleFiles.length === 0 && typeFilter !== "Wszystkie" && typeFilter !== "Folder")) && (
          <div className="flex flex-col gap-3">
            <SectionLabel>Pliki</SectionLabel>
            <div className="overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
              {visibleFiles.length === 0 ? <EmptyFilterRow /> : visibleFiles.map((file) => (
                <FileRow key={file.key} file={file}
                  onDelete={() => setDeleteTarget({ kind: "file", key: file.key, name: file.name })}
                  onRename={() => setRenameTarget({ kind: "file", key: file.key, currentName: file.name })}
                  onCopy={() => setFiles((p) => [duplicateFile(file), ...p])}
                />
              ))}
            </div>
          </div>
        )}

        {/* Non-empty folder with files */}
        {!hasSubFolders && showFiles(typeFilter) && files.length > 0 && (
          <div className="flex flex-col gap-3">
            <SectionLabel>Pliki</SectionLabel>
            <div className="overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
              {visibleFiles.length === 0 ? <EmptyFilterRow /> : visibleFiles.map((file) => (
                <FileRow key={file.key} file={file}
                  onDelete={() => setDeleteTarget({ kind: "file", key: file.key, name: file.name })}
                  onRename={() => setRenameTarget({ kind: "file", key: file.key, currentName: file.name })}
                  onCopy={() => setFiles((p) => [duplicateFile(file), ...p])}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty folder (no data at all) */}
        {!hasSubFolders && files.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-16">
            <HugeiconsIcon icon={FolderOpenIcon} size={28} className="text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground/50">Folder jest pusty</p>
            <Button variant="outline" size="lg" onClick={() => fileInputRef.current?.click()}>
              <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
              Dodaj plik
            </Button>
          </div>
        )}

      </div>
    </>
  )
}

// ─── Root view ─────────────────────────────────────────────────────────────────

function RootView({
  categoryFolders, setCategoryFolders,
  projectFolders,  setProjectFolders,
  looseFiles,      setLooseFiles,
  onNavigate, onNewFolder, onNewKartoteka, fileInputRef,
}: {
  categoryFolders: FolderItem[]; setCategoryFolders: React.Dispatch<React.SetStateAction<FolderItem[]>>
  projectFolders:  FolderItem[]; setProjectFolders:  React.Dispatch<React.SetStateAction<FolderItem[]>>
  looseFiles:      FileItem[];   setLooseFiles:      React.Dispatch<React.SetStateAction<FileItem[]>>
  onNavigate: (key: string) => void
  onNewFolder: () => void; onNewKartoteka: () => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
}) {
  const [view,       setView]       = useState<"grid" | "list">("grid")
  const [sortDir,    setSortDir]    = useState<"asc" | "desc">("asc")
  const [typeFilter, setTypeFilter] = useState("Wszystkie")
  const [dateFilter, setDateFilter] = useState("Wszystkie")

  const [deleteTarget, setDeleteTarget] = useState<{
    kind: "category" | "project" | "file"; key: string; name: string
  } | null>(null)
  const [renameTarget, setRenameTarget] = useState<{
    kind: "category" | "project" | "file"; key: string; currentName: string
  } | null>(null)

  // Apply filters
  const visibleCategories = showFolders(typeFilter)
    ? categoryFolders.filter((f) => matchesDate(dateFilter, f.modified))
    : []

  const sortedProjects = [...projectFolders].sort((a, b) =>
    sortDir === "asc" ? a.name.localeCompare(b.name, "pl") : b.name.localeCompare(a.name, "pl")
  )
  const visibleProjects = showFolders(typeFilter)
    ? sortedProjects.filter((f) => matchesDate(dateFilter, f.modified))
    : []

  const visibleLooseFiles = showFiles(typeFilter)
    ? looseFiles.filter((f) => matchesFileType(typeFilter, f.type) && matchesDate(dateFilter, f.modified))
    : []

  function confirmDelete() {
    if (!deleteTarget) return
    switch (deleteTarget.kind) {
      case "category": setCategoryFolders((p) => p.filter((f) => f.key !== deleteTarget.key)); break
      case "project":  setProjectFolders((p)  => p.filter((f) => f.key !== deleteTarget.key)); break
      case "file":     setLooseFiles((p)       => p.filter((f) => f.key !== deleteTarget.key)); break
    }
    setDeleteTarget(null)
  }

  function confirmRename(newName: string) {
    if (!renameTarget) return
    switch (renameTarget.kind) {
      case "category": setCategoryFolders((p) => p.map((f) => f.key === renameTarget.key ? { ...f, name: newName } : f)); break
      case "project":  setProjectFolders((p)  => p.map((f) => f.key === renameTarget.key ? { ...f, name: newName } : f)); break
      case "file":     setLooseFiles((p)       => p.map((f) => f.key === renameTarget.key ? { ...f, name: newName } : f)); break
    }
    setRenameTarget(null)
  }

  // Helper: insert a duplicate right after the original
  function insertAfter<T extends { key: string }>(list: T[], originalKey: string, copy: T): T[] {
    const i = list.findIndex((x) => x.key === originalKey)
    const next = [...list]
    next.splice(i + 1, 0, copy)
    return next
  }

  return (
    <>
      <DeleteConfirmDialog open={!!deleteTarget} name={deleteTarget?.name ?? ""}
        onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />
      <RenameDialog open={!!renameTarget} currentName={renameTarget?.currentName ?? ""}
        onConfirm={confirmRename} onCancel={() => setRenameTarget(null)} />

      <div className="flex flex-col gap-8 p-4 md:p-8">

        {/* Toolbar: filters left, controls right */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <FiltersRow
            typeFilter={typeFilter} setTypeFilter={setTypeFilter}
            dateFilter={dateFilter} setDateFilter={setDateFilter}
            sortDir={sortDir} setSortDir={setSortDir}
            showSort
          />
          <div className="flex items-center gap-2">
            <ViewToggle view={view} setView={setView} />
            <AddDropdown
              onUploadFile={() => fileInputRef.current?.click()}
              onNewFolder={onNewFolder}
              onNewKartoteka={onNewKartoteka}
            />
          </div>
        </div>

        {/* Kartoteki — visible when type filter allows folders */}
        {showFolders(typeFilter) && (
          <div className="flex flex-col gap-3">
            <SectionLabel>Kartoteki</SectionLabel>
            {visibleCategories.length === 0 ? (
              <div className="overflow-hidden rounded-2xl border border-border bg-card">
                <EmptyFilterRow />
              </div>
            ) : view === "grid" ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {visibleCategories.map((f) => (
                  <FolderCard key={f.key} folder={f} view="grid" onClick={() => onNavigate(f.key)}
                    onDelete={() => setDeleteTarget({ kind: "category", key: f.key, name: f.name })}
                    onRename={() => setRenameTarget({ kind: "category", key: f.key, currentName: f.name })}
                    onCopy={() => setCategoryFolders((p) => insertAfter(p, f.key, duplicateFolder(f)))}
                    onDownload={() => downloadFolderManifest(f)}
                  />
                ))}
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
                {visibleCategories.map((f) => (
                  <FolderCard key={f.key} folder={f} view="list" onClick={() => onNavigate(f.key)}
                    onDelete={() => setDeleteTarget({ kind: "category", key: f.key, name: f.name })}
                    onRename={() => setRenameTarget({ kind: "category", key: f.key, currentName: f.name })}
                    onCopy={() => setCategoryFolders((p) => insertAfter(p, f.key, duplicateFolder(f)))}
                    onDownload={() => downloadFolderManifest(f)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Foldery projektów — visible when type filter allows folders */}
        {showFolders(typeFilter) && (
          <div className="flex flex-col gap-3">
            <SectionLabel>Foldery projektów</SectionLabel>
            {visibleProjects.length === 0 ? (
              <div className="overflow-hidden rounded-2xl border border-border bg-card">
                <EmptyFilterRow />
              </div>
            ) : view === "grid" ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {visibleProjects.map((f) => (
                  <FolderCard key={f.key} folder={f} view="grid" onClick={() => onNavigate(f.key)}
                    onDelete={() => setDeleteTarget({ kind: "project", key: f.key, name: f.name })}
                    onRename={() => setRenameTarget({ kind: "project", key: f.key, currentName: f.name })}
                    onCopy={() => setProjectFolders((p) => insertAfter(p, f.key, duplicateFolder(f)))}
                    onDownload={() => downloadFolderManifest(f)}
                  />
                ))}
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
                {visibleProjects.map((f) => (
                  <FolderCard key={f.key} folder={f} view="list" onClick={() => onNavigate(f.key)}
                    onDelete={() => setDeleteTarget({ kind: "project", key: f.key, name: f.name })}
                    onRename={() => setRenameTarget({ kind: "project", key: f.key, currentName: f.name })}
                    onCopy={() => setProjectFolders((p) => insertAfter(p, f.key, duplicateFolder(f)))}
                    onDownload={() => downloadFolderManifest(f)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pliki bez folderu — visible when type filter allows files */}
        {showFiles(typeFilter) && (
          <div className="flex flex-col gap-3">
            <SectionLabel>Pliki bez folderu</SectionLabel>
            <div className="overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
              {visibleLooseFiles.length === 0 ? <EmptyFilterRow /> : visibleLooseFiles.map((file) => (
                <FileRow key={file.key} file={file}
                  onDelete={() => setDeleteTarget({ kind: "file", key: file.key, name: file.name })}
                  onRename={() => setRenameTarget({ kind: "file", key: file.key, currentName: file.name })}
                  onCopy={() => setLooseFiles((p) => [duplicateFile(file), ...p])}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  )
}

// ─── Inner page ────────────────────────────────────────────────────────────────

function FilesInner() {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const folderParam  = searchParams.get("folder")

  const [categoryFolders, setCategoryFolders] = useState<FolderItem[]>(initialCategoryFolders)
  const [projectFolders,  setProjectFolders]  = useState<FolderItem[]>(initialProjectFolders)
  const [looseFiles,      setLooseFiles]      = useState<FileItem[]>(initialLooseFiles)

  const [folderDialogOpen,    setFolderDialogOpen]    = useState(false)
  const [kartotekaDialogOpen, setKartotekaDialogOpen] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    const newItems: FileItem[] = Array.from(files).map((f) => {
      const ext  = f.name.split(".").pop() ?? ""
      const type = extToType(ext)
      return { key: `upload-${Date.now()}-${f.name}`, name: f.name, type, size: formatSize(f.size), modified: "dzisiaj", icon: typeToIcon(type), fileRef: f }
    })
    setLooseFiles((prev) => [...newItems, ...prev])
    e.target.value = ""
  }

  function handleNewFolder(name: string) {
    setProjectFolders((prev) => [{ key: `p-${Date.now()}`, name, modified: "dzisiaj" }, ...prev])
  }

  function handleNewKartoteka(name: string, iconColor: string) {
    setCategoryFolders((prev) => [...prev, { key: `cat-${Date.now()}`, name, modified: "dzisiaj", iconColor, count: 0, isCategory: true }])
  }

  const sharedProps = {
    onNewFolder:    () => setFolderDialogOpen(true),
    onNewKartoteka: () => setKartotekaDialogOpen(true),
    fileInputRef,
  }

  return (
    <>
      <input ref={fileInputRef} type="file" multiple accept="*/*" className="hidden" onChange={handleFilesSelected} />
      <NewFolderDialog    open={folderDialogOpen}    onOpenChange={setFolderDialogOpen}    onConfirm={handleNewFolder} />
      <NewKartotekaDialog open={kartotekaDialogOpen} onOpenChange={setKartotekaDialogOpen} onConfirm={handleNewKartoteka} />

      {folderParam ? (
        <FolderView
          key={folderParam}
          {...sharedProps}
          folderKey={folderParam}
          onBack={() => router.push("/files")}
          categoryFolders={categoryFolders}
          projectFolders={projectFolders}
        />
      ) : (
        <RootView
          {...sharedProps}
          categoryFolders={categoryFolders} setCategoryFolders={setCategoryFolders}
          projectFolders={projectFolders}   setProjectFolders={setProjectFolders}
          looseFiles={looseFiles}           setLooseFiles={setLooseFiles}
          onNavigate={(key) => router.push(`/files?folder=${key}`)}
        />
      )}
    </>
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
