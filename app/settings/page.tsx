"use client"

import React, { useState } from "react"
import { PageSetup } from "@/components/PageSetup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Settings01Icon,
  Invoice01Icon,
  Building01Icon,
  Moon02Icon,
  Sun01Icon,
  Tick02Icon,
  Cancel01Icon,
  EyeIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { useSettings } from "@/components/SettingsContext"

// ─── Section card wrapper ──────────────────────────────────────────────────────

function SettingsSection({ accent, icon, title, description, children }: {
  accent: "orange" | "blue" | "green"
  icon: React.ComponentProps<typeof HugeiconsIcon>["icon"]
  title: string
  description: string
  children: React.ReactNode
}) {
  const accentBar = {
    orange: "from-wirmet-orange",
    blue:   "from-wirmet-blue",
    green:  "from-wirmet-green",
  }[accent]
  const accentText = {
    orange: "text-wirmet-orange",
    blue:   "text-wirmet-blue",
    green:  "text-wirmet-green",
  }[accent]
  const accentBg = {
    orange: "bg-wirmet-orange/10",
    blue:   "bg-wirmet-blue/10",
    green:  "bg-wirmet-green/10",
  }[accent]

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className={cn("h-[2px] shrink-0 bg-gradient-to-r to-transparent", accentBar)} />
      <div className="flex items-start gap-4 border-b border-border px-6 py-5">
        <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", accentBg)}>
          <HugeiconsIcon icon={icon} size={16} className={accentText} />
        </div>
        <div>
          <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-foreground">
            {title}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex flex-col divide-y divide-border">
        {children}
      </div>
    </div>
  )
}

// ─── Setting row ───────────────────────────────────────────────────────────────

function SettingRow({ label, hint, children }: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-8 px-6 py-4">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

// ─── Offer numbering preview ───────────────────────────────────────────────────

function buildPreview(
  prefix: string,
  sep: string,
  pad: number,
  includeYear: boolean,
  year: string,
  yearShort: boolean,
  includeMonth: boolean,
  month: string,
  startNum: number,
): string {
  const num = String(startNum).padStart(pad, "0")
  const parts = [
    prefix || null,
    includeYear ? (yearShort ? year.slice(2) : year) : null,
    includeMonth ? month : null,
    num,
  ].filter(Boolean)
  return parts.join(sep)
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  // next-themes is undefined on SSR — wait for mount to avoid hydration mismatch
  React.useEffect(() => setMounted(true), [])

  // ── Offer numbering — read/write from SettingsContext ─────────────────────
  const { numbering, setNumbering } = useSettings()
  const { prefix, separator, padLength, includeYear, yearShort, includeMonth, startNumber } = numbering

  // Local string mirror for startNumber input (allows typing without parsing on every keystroke)
  const [startNumberInput, setStartNumberInput] = useState(String(startNumber))

  const now = new Date()
  const currentYear  = now.getFullYear().toString()
  const currentMonth = String(now.getMonth() + 1).padStart(2, "0")
  const actualSeparator = separator === "none" ? "" : separator
  const preview = buildPreview(
    prefix, actualSeparator, padLength,
    includeYear, currentYear, yearShort,
    includeMonth, currentMonth,
    startNumber,
  )

  // ── Company ────────────────────────────────────────────────────────────────
  const [company,  setCompany]  = useState("Wirmet Sp. z o.o.")
  const [nip,      setNip]      = useState("PL 1234567890")
  const [email,    setEmail]    = useState("biuro@wirmet.pl")

  function handleSave() {
    toast.success("Ustawienia zapisane.")
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <PageSetup title="Ustawienia" icon={Settings01Icon} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
            Ustawienia
          </h1>
          <p className="text-sm text-muted-foreground">
            Skonfiguruj aplikację pod swoje potrzeby.
          </p>
        </div>
        <Button variant="default" size="lg" onClick={handleSave} className="shrink-0">
          <HugeiconsIcon icon={Tick02Icon} data-icon="inline-start" />
          Zapisz zmiany
        </Button>
      </div>

      <div className="flex flex-col gap-5 max-w-2xl">

        {/* ── Offer numbering ──────────────────────────────────────────────── */}
        <SettingsSection
          accent="orange"
          icon={Invoice01Icon}
          title="Numeracja ofert"
          description="Ustaw format automatycznie generowanych numerów ofert."
        >
          <SettingRow
            label="Prefiks"
            hint='Litery na początku numeru, np. "OF" lub "WIRMET".'
          >
            <Input
              value={prefix}
              onChange={(e) => setNumbering({ prefix: e.target.value.toUpperCase() })}
              className="h-9 w-28 text-sm font-mono"
              maxLength={8}
              placeholder="OF"
            />
          </SettingRow>

          <SettingRow
            label="Separator"
            hint="Znak między prefixem, rokiem i numerem."
          >
            <Select value={separator} onValueChange={(v) => setNumbering({ separator: v })}>
              <SelectTrigger className="h-9 w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-">Myślnik  —</SelectItem>
                <SelectItem value="/">{`Ukośnik /`}</SelectItem>
                <SelectItem value=".">Kropka  .</SelectItem>
                <SelectItem value="none">Brak</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>

          <SettingRow
            label="Długość numeru"
            hint="Liczba cyfr — krótsze numery uzupełniane są zerami."
          >
            <Select value={String(padLength)} onValueChange={(v) => setNumbering({ padLength: parseInt(v) })}>
              <SelectTrigger className="h-9 w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 cyfry  (001)</SelectItem>
                <SelectItem value="4">4 cyfry  (0001)</SelectItem>
                <SelectItem value="5">5 cyfr   (00001)</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>

          <SettingRow
            label="Rok w numerze"
            hint={`Dodaje bieżący rok (${currentYear}) między prefixem a numerem.`}
          >
            <Switch
              checked={includeYear}
              onCheckedChange={(v) => setNumbering({ includeYear: v })}
            />
          </SettingRow>

          {/* Format roku — widoczny tylko gdy rok jest włączony */}
          {includeYear && (
            <div className="flex items-center justify-between gap-8 border-l-2 border-wirmet-orange/20 bg-muted/10 py-3 pl-10 pr-6">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">Format roku</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Pełny ({currentYear}) lub skrócony ({currentYear.slice(2)}).
                </p>
              </div>
              <div className="shrink-0">
                <div className="flex items-center gap-1 rounded-lg border border-border p-0.5">
                  {([
                    { value: false, label: currentYear },
                    { value: true,  label: currentYear.slice(2) },
                  ] as const).map(({ value, label }) => (
                    <button
                      key={String(value)}
                      type="button"
                      onClick={() => setNumbering({ yearShort: value })}
                      className={cn(
                        "rounded-md px-3 py-1.5 text-xs font-mono font-semibold transition-colors",
                        yearShort === value
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <SettingRow
            label="Miesiąc w numerze"
            hint={`Dodaje bieżący miesiąc (${currentMonth}) za rokiem${includeYear ? "" : " lub prefixem"}.`}
          >
            <Switch
              checked={includeMonth}
              onCheckedChange={(v) => setNumbering({ includeMonth: v })}
            />
          </SettingRow>

          {/* Separator before starting number — it's a distinct concept */}
          <div className="flex items-center justify-between gap-8 px-6 py-4 bg-muted/10">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">Numer startowy</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Masz już wcześniejsze oferty? Wpisz numer, od którego zaczniemy liczyć — np. jeśli masz 47 ofert, wpisz&nbsp;48.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              {/* decrement */}
              <button
                type="button"
                onClick={() => {
                  const next = Math.max(1, startNumber - 1)
                  setNumbering({ startNumber: next })
                  setStartNumberInput(String(next))
                }}
                className="flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-wirmet-orange/40 hover:text-wirmet-orange"
              >
                <span className="text-base leading-none">−</span>
              </button>
              <Input
                value={startNumberInput}
                onChange={(e) => setStartNumberInput(e.target.value.replace(/\D/g, ""))}
                onBlur={() => {
                  const n = Math.max(1, parseInt(startNumberInput) || 1)
                  setNumbering({ startNumber: n })
                  setStartNumberInput(String(n))
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") (e.target as HTMLInputElement).blur()
                }}
                className="h-8 w-20 text-center text-sm font-mono"
                inputMode="numeric"
              />
              {/* increment */}
              <button
                type="button"
                onClick={() => {
                  const next = startNumber + 1
                  setNumbering({ startNumber: next })
                  setStartNumberInput(String(next))
                }}
                className="flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-wirmet-orange/40 hover:text-wirmet-orange"
              >
                <span className="text-base leading-none">+</span>
              </button>
            </div>
          </div>

          {/* Live preview */}
          <div className="flex flex-wrap items-center gap-3 bg-muted/20 px-6 py-4">
            <HugeiconsIcon icon={EyeIcon} size={13} className="shrink-0 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Pierwsza oferta:</p>
            <code className="rounded-md border border-wirmet-orange/20 bg-wirmet-orange/5 px-3 py-1 text-sm font-mono font-semibold text-wirmet-orange">
              {preview}
            </code>
            <p className="text-[11px] text-muted-foreground/50">→ kolejne będą numerowane dalej automatycznie</p>
          </div>
        </SettingsSection>

        {/* ── Company ──────────────────────────────────────────────────────── */}
        <SettingsSection
          accent="blue"
          icon={Building01Icon}
          title="Dane firmy"
          description="Pojawiają się na dokumentach i w stopkach ofert."
        >
          <SettingRow label="Nazwa firmy">
            <Input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="h-9 w-60 text-sm"
              placeholder="np. Wirmet Sp. z o.o."
            />
          </SettingRow>

          <SettingRow label="NIP" hint="Format: PL XXXXXXXXXX">
            <Input
              value={nip}
              onChange={(e) => setNip(e.target.value)}
              className="h-9 w-60 text-sm font-mono"
              placeholder="PL 0000000000"
            />
          </SettingRow>

          <SettingRow label="E-mail kontaktowy" hint="Adres do kontaktu z klientami.">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-9 w-60 text-sm"
              placeholder="biuro@firma.pl"
              type="email"
            />
          </SettingRow>
        </SettingsSection>

        {/* ── Appearance ───────────────────────────────────────────────────── */}
        <SettingsSection
          accent="green"
          icon={Moon02Icon}
          title="Wygląd"
          description="Motyw kolorystyczny i preferencje interfejsu."
        >
          <SettingRow
            label="Motyw"
            hint="Ciemny to domyślny tryb Wirmet Dashboard."
          >
            <div className="flex items-center gap-1 rounded-lg border border-border p-0.5">
              {([
                { value: "dark",  label: "Ciemny",  icon: Moon02Icon },
                { value: "light", label: "Jasny",   icon: Sun01Icon  },
              ] as const).map(({ value, label, icon }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                    mounted && theme === value
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <HugeiconsIcon icon={icon} size={12} />
                  {label}
                </button>
              ))}
            </div>
          </SettingRow>
        </SettingsSection>

      </div>
    </div>
  )
}
