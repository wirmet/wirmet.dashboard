"use client"

import * as React from "react"
import { IconSvgElement } from "@hugeicons/react"

interface TopBarContextValue {
  title: string
  setTitle: (title: string) => void
  icon: IconSvgElement | null
  setIcon: (icon: IconSvgElement | null) => void
  sidebarOpen: boolean
  toggleSidebar: () => void
}

const TopBarContext = React.createContext<TopBarContextValue | null>(null)

export function TopBarProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = React.useState("Dashboard")
  const [icon, setIcon] = React.useState<IconSvgElement | null>(null)
  const [sidebarOpen, setSidebarOpen] = React.useState(true)

  const toggleSidebar = React.useCallback(() => {
    setSidebarOpen((prev) => !prev)
  }, [])

  const value = React.useMemo(
    () => ({ title, setTitle, icon, setIcon, sidebarOpen, toggleSidebar }),
    [title, icon, sidebarOpen, toggleSidebar]
  )

  return (
    <TopBarContext.Provider value={value}>{children}</TopBarContext.Provider>
  )
}

export function useTopBarContext() {
  const context = React.useContext(TopBarContext)
  if (!context) {
    throw new Error("useTopBarContext must be used within a TopBarProvider")
  }
  return context
}
