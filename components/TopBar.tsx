"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Add01Icon } from "@hugeicons/core-free-icons"
import { useTopBarContext } from "@/components/TopBarContext"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

export function TopBar() {
  const { title } = useTopBarContext()

  return (
    <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-8">
      <div className="flex items-center gap-4">
        {/* Sidebar toggle — managed by SidebarProvider */}
        <SidebarTrigger className="size-7 rounded-md border border-zinc-200 bg-zinc-100 hover:bg-zinc-200 text-zinc-700" />

        <span className="text-base font-medium text-zinc-900">{title}</span>
      </div>

      <Button variant="outline" size="lg">
        <HugeiconsIcon icon={Add01Icon} size={14} />
        New Offers
      </Button>
    </header>
  )
}
