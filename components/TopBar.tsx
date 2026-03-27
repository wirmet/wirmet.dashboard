"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Add01Icon, Moon01Icon, Sun01Icon, HelpCircleIcon } from "@hugeicons/core-free-icons"
import { useTheme } from "next-themes"
import { useTopBarContext } from "@/components/TopBarContext"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function TopBar() {
  const { title, icon } = useTopBarContext()
  const { resolvedTheme, setTheme } = useTheme()
  // Avoid hydration mismatch — resolvedTheme is undefined on server
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border bg-transparent px-4 py-3">
      {/* Left: sidebar toggle → separator → page icon + title */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="size-8 rounded-md text-foreground/50 hover:bg-muted hover:text-foreground [&_svg]:size-4" />

        {/* wrapper z py-3 ogranicza widoczną wysokość separatora — sam separator wypełnia resztę */}
        <div className="self-stretch flex items-center py-3">
          <Separator orientation="vertical" className="h-full bg-border" />
        </div>

        <div className="flex items-center gap-2">
          {icon && (
            <HugeiconsIcon icon={icon} size={15} className="text-muted-foreground" />
          )}
          {/* tytuł w tym samym kolorze co ikona strony — spójne wizualnie */}
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="lg">
          <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
          Nowa oferta
        </Button>

        {/* Visual divider between action and utility icons */}
        <div className="flex items-center py-1.5 self-stretch">
          <Separator orientation="vertical" className="h-full bg-border" />
        </div>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon-lg"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="text-foreground/50 hover:text-foreground"
          title="Toggle theme"
        >
          {mounted && (
            <HugeiconsIcon icon={resolvedTheme === "dark" ? Sun01Icon : Moon01Icon} />
          )}
        </Button>

        {/* Help */}
        <Button
          variant="ghost"
          size="icon-lg"
          asChild
          className="text-foreground/50 hover:text-foreground"
          title="Help"
        >
          <Link href="/help">
            <HugeiconsIcon icon={HelpCircleIcon} />
          </Link>
        </Button>
      </div>
    </header>
  )
}
