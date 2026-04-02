"use client"

import React, { createContext, useCallback, useContext, useMemo, useState } from "react"

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface NumberingSettings {
  prefix: string
  separator: string   // "none" = no separator between parts
  padLength: number
  includeYear: boolean
  yearShort: boolean
  includeMonth: boolean
  startNumber: number
}

interface SettingsContextValue {
  numbering: NumberingSettings
  setNumbering: (updates: Partial<NumberingSettings>) => void
  /** Build a formatted offer number for a given counter value */
  buildOfferNumber: (counter: number) => string
}

// ─── Context ───────────────────────────────────────────────────────────────────

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [numbering, setNumberingState] = useState<NumberingSettings>({
    prefix: "OF",
    separator: "-",
    padLength: 4,
    includeYear: false,
    yearShort: false,
    includeMonth: false,
    startNumber: 442,   // matches the demo seed data (highest is 0441)
  })

  const setNumbering = useCallback((updates: Partial<NumberingSettings>) => {
    setNumberingState(prev => ({ ...prev, ...updates }))
  }, [])

  const buildOfferNumber = useCallback((counter: number) => {
    const now = new Date()
    const year = now.getFullYear().toString()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const { prefix, separator, padLength, includeYear, yearShort, includeMonth } = numbering
    const sep = separator === "none" ? "" : separator
    const num = String(counter).padStart(padLength, "0")
    const parts = [
      prefix || null,
      includeYear ? (yearShort ? year.slice(2) : year) : null,
      includeMonth ? month : null,
      num,
    ].filter(Boolean)
    return parts.join(sep)
  }, [numbering])

  const value = useMemo<SettingsContextValue>(
    () => ({ numbering, setNumbering, buildOfferNumber }),
    [numbering, setNumbering, buildOfferNumber],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider")
  return ctx
}
