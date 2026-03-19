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
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

const mainNavItems = [
  { label: "Dashboard", icon: Home01Icon, href: "/" },
  { label: "Offers", icon: Invoice01Icon, href: "/offers" },
  { label: "Orders", icon: ShoppingCart01Icon, href: "/orders" },
  { label: "Shipments", icon: DeliveryTruck01Icon, href: "/shipments" },
  { label: "Schedule", icon: Calendar01Icon, href: "/schedule" },
  { label: "Files", icon: Folder01Icon, href: "/files" },
]

const managementNavItems = [
  { label: "Suppliers", icon: UserGroupIcon, href: "/suppliers" },
  { label: "Customers", icon: UserIcon, href: "/customers" },
  { label: "Inventory", icon: Package01Icon, href: "/inventory" },
  { label: "Warehouse", icon: WarehouseIcon, href: "/warehouse" },
]

const bottomNavItems = [
  { label: "Settings", icon: Settings01Icon, href: "/settings" },
  { label: "Help", icon: HelpCircleIcon, href: "/help" },
]

// Shared className for all nav menu buttons
const navButtonClass =
  "h-9 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 data-[active=true]:bg-zinc-100 data-[active=true]:font-medium data-[active=true]:text-zinc-900"

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
      <SidebarGroupLabel className="text-xs font-medium tracking-wider text-zinc-400 uppercase">
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

export function AppSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const { avatarUrl } = useUser()

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-zinc-200 bg-white"
      style={{
        "--sidebar": "oklch(1 0 0)",
        "--sidebar-foreground": "oklch(0.145 0 0)",
        "--sidebar-accent": "oklch(0.97 0 0)",
        "--sidebar-accent-foreground": "oklch(0.205 0 0)",
        "--sidebar-border": "oklch(0.922 0 0)",
      } as React.CSSProperties}
    >
      {/* Logo */}
      <SidebarHeader className="h-[72px] border-b border-zinc-200 py-0 justify-center">
        <div
          className={cn(
            "flex items-center gap-2 px-1 overflow-hidden",
            isCollapsed && "justify-center"
          )}
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-lg font-bold text-white">
            W
          </div>
          {!isCollapsed && (
            <>
              <span className="flex-1 truncate font-semibold text-zinc-900">
                Wirmet
              </span>
              <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-700 whitespace-nowrap">
                PRO
              </span>
              <Button variant="ghost" size="icon-sm" className="shrink-0">
                <HugeiconsIcon icon={ArrowDown01Icon} size={16} />
              </Button>
            </>
          )}
        </div>
      </SidebarHeader>

      {/* Main navigation */}
      <SidebarContent className="py-4">
        <NavGroup label="Main" items={mainNavItems} pathname={pathname} />
        <NavGroup
          label="Management"
          items={managementNavItems}
          pathname={pathname}
        />
      </SidebarContent>

      {/* Bottom: settings, help, user profile */}
      <SidebarFooter className="border-t border-zinc-200 py-2 gap-0">
        <SidebarGroup className="py-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomNavItems.map((item) => (
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

        {/* User profile */}
        <div className="px-2 pt-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                title={isCollapsed ? "Jan Kowalski" : undefined}
                className={cn(
                  "flex w-full items-center rounded-lg p-1.5 transition-colors hover:bg-zinc-50",
                  isCollapsed ? "justify-center" : "gap-3"
                )}
              >
                <Avatar key={avatarUrl} className="size-8 shrink-0">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt="Profile photo" />}
                  <AvatarFallback className="bg-zinc-200 text-sm font-medium text-zinc-700">
                    JK
                  </AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <>
                    <div className="flex-1 overflow-hidden text-left">
                      <p className="truncate text-sm font-medium text-zinc-900">
                        Jan Kowalski
                      </p>
                      <p className="truncate text-xs text-zinc-500">
                        jan@wirmet.pl
                      </p>
                    </div>
                    <HugeiconsIcon
                      icon={ArrowDown01Icon}
                      size={16}
                      className="shrink-0 text-zinc-400"
                    />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="right"
              align="end"
              sideOffset={8}
              className="w-52 border border-zinc-200"
              style={{
                "--popover": "oklch(1 0 0)",
                "--popover-foreground": "oklch(0.145 0 0)",
                "--accent": "oklch(0.97 0 0)",
                "--accent-foreground": "oklch(0.205 0 0)",
                "--border": "oklch(0.922 0 0)",
              } as React.CSSProperties}
            >
              <DropdownMenuLabel className="font-normal">
                <p className="text-sm font-medium text-zinc-900">Jan Kowalski</p>
                <p className="text-xs text-zinc-500">jan@wirmet.pl</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <HugeiconsIcon icon={UserEdit01Icon} size={14} />
                  Edit profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon icon={Settings01Icon} size={14} />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <HugeiconsIcon icon={Logout01Icon} size={14} />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>

      {/* Drag handle to resize / click to toggle */}
      <SidebarRail />
    </Sidebar>
  )
}
