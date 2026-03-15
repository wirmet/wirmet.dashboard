"use client"

import { Sidebar } from "@/components/Sidebar"
import { TopBar } from "@/components/TopBar"
import { useTopBarContext } from "@/components/TopBarContext"

export function AppShell({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useTopBarContext()

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <TopBar />
        <main className="flex-1 bg-zinc-50">{children}</main>
      </div>
    </div>
  )
}
