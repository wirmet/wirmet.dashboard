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
      {/* Floating content card — elevated above the dark background, sidebar sits on the bg */}
      {/* border zamiast ring — ring (box-shadow) jest poza elementem i przykrywany przez fixed sidebar po lewej */}
      <div className="flex flex-1 flex-col min-w-0 my-3 mr-3 rounded-xl overflow-hidden bg-surface border border-border">
        <TopBar />
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
    </TooltipProvider>
    </UserProvider>
  )
}
