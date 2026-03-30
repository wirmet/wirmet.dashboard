"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react"
import {
  Home01Icon,
  Invoice01Icon,
  ShoppingCart01Icon,
  DeliveryTruck01Icon,
  Calendar01Icon,
  Folder01Icon,
  UserGroupIcon,
  UserIcon,
  Package01Icon,
  WarehouseIcon,
  Settings01Icon,
  HelpCircleIcon,
  ArrowDown01Icon,
  Logout01Icon,
  UserEdit01Icon,
  ArrowRight01Icon,
  FolderOpenIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "@/components/UserContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"

// Top-level folders inside the Files module — shown as collapsible sub-items
const fileFolders = [
  { label: "Oferty 2025", href: "/files?folder=offers-2025" },
  { label: "Archiwum projektów", href: "/files?folder=projects" },
  { label: "Dokumenty dostawców", href: "/files?folder=suppliers" },
  { label: "Faktury", href: "/files?folder=invoices" },
]

const mainNavItems = [
  { label: "Dashboard", icon: Home01Icon, href: "/" },
  { label: "Oferty", icon: Invoice01Icon, href: "/offers" },
  { label: "Realizacje", icon: ShoppingCart01Icon, href: "/orders" },
  { label: "Wysyłki", icon: DeliveryTruck01Icon, href: "/shipments" },
  { label: "Terminarz", icon: Calendar01Icon, href: "/schedule" },
]

const managementNavItems = [
  { label: "Dostawcy", icon: UserGroupIcon, href: "/suppliers" },
  { label: "Klienci", icon: UserIcon, href: "/customers" },
  { label: "Spis towaru", icon: Package01Icon, href: "/inventory" },
  { label: "Magazyn", icon: WarehouseIcon, href: "/warehouse" },
]

// Shared nav button style — uses sidebar CSS vars for theme compatibility
const navButtonClass =
  "h-9 text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-foreground"

// Simple nav group for non-collapsible items
function NavGroup({
  label,
  items,
  pathname,
}: {
  label: string
  items: { label: string; icon: IconSvgElement; href: string }[]
  pathname: string
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[11px] font-medium tracking-wider text-sidebar-foreground/30 uppercase">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
                className={navButtonClass}
              >
                <Link href={item.href}>
                  <HugeiconsIcon icon={item.icon} size={16} />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

// Files section with collapsible top-level folders
function FilesNavItem({ pathname }: { pathname: string }) {
  const isFilesActive = pathname === "/files" || pathname.startsWith("/files")
  const [open, setOpen] = React.useState(isFilesActive)

  return (
    <SidebarMenuItem>
      <Collapsible open={open} onOpenChange={setOpen} className="group/files">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            isActive={isFilesActive && !open}
            tooltip="Files"
            className={cn(navButtonClass, "w-full")}
          >
            <HugeiconsIcon icon={open ? FolderOpenIcon : Folder01Icon} size={16} />
            <span>Pliki</span>
            {/* Arrow rotates 90° when open */}
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={14}
              className="ml-auto text-sidebar-foreground/30 transition-transform duration-200 group-data-[state=open]/files:rotate-90"
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {/* "Wszystkie" — goes to the full files view with folders + loose files */}
            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                asChild
                isActive={pathname === "/files"}
                className="text-sidebar-foreground/50 hover:text-sidebar-foreground data-[active=true]:text-sidebar-foreground"
              >
                <Link href="/files">
                  <HugeiconsIcon icon={FolderOpenIcon} size={14} />
                  <span>Wszystkie</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>

            {fileFolders.map((folder) => (
              <SidebarMenuSubItem key={folder.href}>
                <SidebarMenuSubButton
                  asChild
                  isActive={pathname === folder.href}
                  className="text-sidebar-foreground/50 hover:text-sidebar-foreground data-[active=true]:text-sidebar-foreground"
                >
                  <Link href={folder.href}>
                    <HugeiconsIcon icon={Folder01Icon} size={14} />
                    <span>{folder.label}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}

export function AppSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const { avatarUrl } = useUser()

  return (
    <Sidebar
      collapsible="icon"
      // sits on the background — content card is the elevated element
    >
      {/* Logo */}
      <SidebarHeader className="py-4 justify-center">
        <div
          className={cn(
            "flex items-center gap-2 px-1 overflow-hidden",
            isCollapsed && "justify-center"
          )}
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-lg font-bold text-white dark:bg-white dark:text-zinc-900">
            W
          </div>
          {!isCollapsed && (
            <>
              <span className="flex-1 truncate font-semibold text-sidebar-foreground">
                Wirmet
              </span>
              <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-xs font-medium text-amber-400 whitespace-nowrap">
                PRO
              </span>
            </>
          )}
        </div>
      </SidebarHeader>

      {/* Main navigation */}
      <SidebarContent className="py-4">
        {/* Main group — plain items */}
        <NavGroup label="Główne" items={mainNavItems} pathname={pathname} />

        {/* Pliki — oddzielna grupa z rozwijanymi podfolderami */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <FilesNavItem pathname={pathname} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Zarządzanie */}
        <NavGroup label="Zarządzanie" items={managementNavItems} pathname={pathname} />
      </SidebarContent>

      {/* Bottom: user profile only — Settings & Help moved into the dropdown */}
      <SidebarFooter className="py-2 gap-0">
        {/* User profile */}
        <div className="px-2 pt-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                title={isCollapsed ? "Jan Kowalski" : undefined}
                className={cn(
                  "flex w-full items-center rounded-lg p-1.5 transition-colors hover:bg-sidebar-accent",
                  isCollapsed ? "justify-center" : "gap-3"
                )}
              >
                <Avatar key={avatarUrl} className="size-8 shrink-0">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt="Profile photo" />}
                  <AvatarFallback className="bg-sidebar-accent text-sm font-medium text-sidebar-foreground">
                    JK
                  </AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <>
                    <div className="flex-1 overflow-hidden text-left">
                      <p className="truncate text-sm font-medium text-sidebar-foreground">
                        Jan Kowalski
                      </p>
                      <p className="truncate text-xs text-sidebar-foreground/50">
                        jan@wirmet.pl
                      </p>
                    </div>
                    <HugeiconsIcon
                      icon={ArrowDown01Icon}
                      size={16}
                      className="shrink-0 text-sidebar-foreground/30"
                    />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="right"
              align="end"
              sideOffset={8}
              className="w-52 border border-border"
            >
              <DropdownMenuLabel className="font-normal">
                <p className="text-sm font-medium text-foreground">Jan Kowalski</p>
                <p className="text-xs text-muted-foreground">jan@wirmet.pl</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <HugeiconsIcon icon={UserEdit01Icon} size={14} />
                  Edytuj profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <HugeiconsIcon icon={Settings01Icon} size={14} />
                  Ustawienia
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/help">
                  <HugeiconsIcon icon={HelpCircleIcon} size={14} />
                  Pomoc
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <HugeiconsIcon icon={Logout01Icon} size={14} />
                Wyloguj się
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>

    </Sidebar>
  )
}
