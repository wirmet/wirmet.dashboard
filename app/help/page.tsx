"use client"

import { useState } from "react"
import { PageSetup } from "@/components/PageSetup"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  HelpCircleIcon,
  Mail01Icon,
  Add01Icon,
  Invoice01Icon,
  Package01Icon,
  UserGroupIcon,
  Settings01Icon,
  CheckmarkCircle01Icon,
  ArrowRight01Icon,
  StarIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

// ─── FAQ data ──────────────────────────────────────────────────────────────────

const FAQ = [
  {
    q: "Jak dodać nową ofertę?",
    a: 'Przejdź do zakładki "Oferty" i kliknij przycisk "Nowa oferta" w prawym górnym rogu. Wypełnij formularz — wybierz klienta, numer oferty (lub wygeneruj automatycznie), status i datę ważności. Możesz też dołączyć plik PDF z wyceną.',
  },
  {
    q: "Jak zmienić status oferty lub zamówienia?",
    a: 'Kliknij na dowolną ofertę lub realizację w tabeli — otworzy się panel szczegółów. Kliknij "Edytuj" i zmień status na wybrany. Zmiany zapisują się natychmiast.',
  },
  {
    q: "Jak zmienić ilość produktu w magazynie?",
    a: 'W widoku Magazynu każdy wiersz ma wbudowany licznik: kliknij na ilość, wpisz nową wartość i zatwierdź Enterem — lub użyj przycisków "-" i "+" do korekty o 1. Wartości aktualizują się na bieżąco.',
  },
  {
    q: "Jak dodać nowego klienta?",
    a: 'Przejdź do zakładki "Klienci" i kliknij "Dodaj klienta". Dane klienta (firma, osoba kontaktowa, e-mail, telefon, adres) będą dostępne przy tworzeniu ofert — możesz je wybrać z listy zamiast wpisywać ręcznie.',
  },
  {
    q: "Jak działa automatyczna numeracja ofert?",
    a: "System generuje numery w formacie #OF-XXXX (np. #OF-0442). Format można zmienić w Ustawieniach w sekcji Numeracja ofert. Możesz też wpisać własny numer ręcznie — automat go pomija, ale wewnętrzny licznik dalej rośnie, żeby sekwencja była spójna.",
  },
  {
    q: "Czy mogę dodać własne kategorie produktów?",
    a: 'Tak. W widoku Spis towaru kliknij "Kategorie" w pasku narzędzi. Możesz dodawać kategorie z nazwą i kolorem. Są dostępne od razu przy dodawaniu nowych produktów.',
  },
  {
    q: "Czy dane są zapisywane na serwerze?",
    a: "Obecna wersja aplikacji przechowuje dane lokalnie w przeglądarce (w pamięci sesji). Planujemy dodać synchronizację z chmurą — zostaniesz powiadomiony, gdy ta funkcja będzie dostępna. Do tego czasu nie zamykaj karty przeglądarki, żeby nie stracić zmian.",
  },
  {
    q: "Jak zmienić motyw jasny/ciemny?",
    a: "Kliknij ikonę słońca lub księżyca w lewym górnym rogu paska nawigacji (obok przycisku zwijania menu). Motyw zmienia się natychmiast i jest zapamiętany dla przeglądarki.",
  },
]

// ─── Section wrapper ───────────────────────────────────────────────────────────

function SectionCard({ accent, children }: {
  accent: "orange" | "blue" | "green" | "rose"
  children: React.ReactNode
}) {
  const bar = {
    orange: "from-wirmet-orange",
    blue:   "from-wirmet-blue",
    green:  "from-wirmet-green",
    rose:   "from-rose-400",
  }[accent]

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className={cn("h-[2px] shrink-0 bg-gradient-to-r to-transparent", bar)} />
      {children}
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function HelpPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <PageSetup title="Pomoc" icon={HelpCircleIcon} />

      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
          Pomoc
        </h1>
        <p className="text-sm text-muted-foreground">
          Najczęstsze pytania i kontakt z pomocą techniczną.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* ── Left: FAQ ─────────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <SectionCard accent="orange">
            <div className="flex items-center gap-2.5 border-b border-border px-5 py-4">
              <HugeiconsIcon icon={HelpCircleIcon} size={14} className="text-wirmet-orange" />
              <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-foreground">
                Często zadawane pytania
              </p>
            </div>

            <Accordion type="single" collapsible className="divide-y divide-border">
              {FAQ.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-0 px-5">
                  <AccordionTrigger className="py-4 text-sm font-medium text-foreground hover:text-wirmet-orange hover:no-underline [&[data-state=open]]:text-wirmet-orange">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-sm text-muted-foreground leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </SectionCard>
        </div>

        {/* ── Right: Contact + quick links ──────────────────────────────────── */}
        <div className="flex flex-col gap-4">

          {/* Contact card */}
          <SectionCard accent="blue">
            <div className="flex flex-col gap-4 p-6">
              <div className="flex size-11 items-center justify-center rounded-xl bg-wirmet-blue/10">
                <HugeiconsIcon icon={Mail01Icon} size={20} className="text-wirmet-blue" />
              </div>
              <div>
                <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-foreground">
                  Kontakt z pomocą
                </p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Nie znalazłeś odpowiedzi? Napisz do nas — odpowiadamy w ciągu 1 dnia roboczego.
                </p>
              </div>
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => window.location.href = "mailto:pomoc@wirmet.pl"}
              >
                <HugeiconsIcon icon={Mail01Icon} data-icon="inline-start" />
                pomoc@wirmet.pl
              </Button>
              <p className="text-center text-[11px] text-muted-foreground/50">
                Pon–Pt, 8:00–16:00
              </p>
            </div>
          </SectionCard>

          {/* Quick nav */}
          <SectionCard accent="green">
            <div className="px-5 py-4 border-b border-border">
              <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-foreground">
                Skróty do sekcji
              </p>
            </div>
            <div className="flex flex-col divide-y divide-border">
              {[
                { label: "Oferty",        href: "/offers",    icon: Invoice01Icon  },
                { label: "Spis towaru",   href: "/inventory", icon: Package01Icon  },
                { label: "Klienci",       href: "/customers", icon: UserGroupIcon  },
                { label: "Ustawienia",    href: "/settings",  icon: Settings01Icon },
              ].map(({ label, href, icon }) => (
                <a
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-5 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted/20 hover:text-foreground"
                >
                  <HugeiconsIcon icon={icon} size={14} className="shrink-0" />
                  <span className="flex-1">{label}</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={12} className="shrink-0 opacity-40" />
                </a>
              ))}
            </div>
          </SectionCard>

          {/* Version */}
          <div className="rounded-2xl border border-border bg-card px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-foreground">Wirmet Dashboard</p>
                <p className="text-[11px] text-muted-foreground">Wersja 1.0 · marzec 2026</p>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-wirmet-green/10 px-2 py-0.5">
                <span className="size-1.5 rounded-full bg-wirmet-green" />
                <span className="text-[11px] font-medium text-wirmet-green">Aktualna</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
