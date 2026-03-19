"use client"

import * as React from "react"
import { AppSidebar } from "@/components/Sidebar"
import { TopBar } from "@/components/TopBar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { UserProvider } from "@/components/UserContext"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
    <TooltipProvider>
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <TopBar />
        <main className="flex-1 bg-zinc-50">{children}</main>
      </div>
    </SidebarProvider>
    </TooltipProvider>
    </UserProvider>
  )
}
