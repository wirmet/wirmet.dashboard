"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Add01Icon, SidebarLeft01Icon } from "@hugeicons/core-free-icons"
import { useTopBarContext } from "@/components/TopBarContext"

export function TopBar() {
  const { title, toggleSidebar } = useTopBarContext()

  return (
    <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-8">
      <div className="flex items-center gap-4">
        {/* Sidebar toggle */}
        <button
          onClick={toggleSidebar}
          className="flex size-7 items-center justify-center rounded-md border border-zinc-200 bg-zinc-100 hover:bg-zinc-200 transition-colors"
        >
          <HugeiconsIcon icon={SidebarLeft01Icon} size={16} className="text-zinc-700" />
        </button>

        <span className="text-base font-medium text-zinc-900">{title}</span>
      </div>

      {/* New Offers button */}
      <button className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50">
        <HugeiconsIcon icon={Add01Icon} size={14} className="text-zinc-700" />
        New Offers
      </button>
    </header>
  )
}
