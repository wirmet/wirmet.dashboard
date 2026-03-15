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
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useTopBarContext } from "@/components/TopBarContext"

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

interface NavItemProps {
  label: string
  icon: IconSvgElement
  href: string
  isActive?: boolean
  collapsed?: boolean
}

function NavItem({ label, icon, href, isActive = false, collapsed = false }: NavItemProps) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={cn(
        "flex items-center rounded-lg py-2 text-sm transition-colors",
        collapsed ? "justify-center px-2" : "gap-3 px-3",
        isActive
          ? "bg-zinc-100 font-medium text-zinc-900"
          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
      )}
    >
      <HugeiconsIcon icon={icon} size={20} />
      {!collapsed && (
        <span className="truncate">{label}</span>
      )}
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen } = useTopBarContext()
  const collapsed = !sidebarOpen

  return (
    <aside
      className={cn(
        "flex h-screen shrink-0 flex-col border-r border-zinc-200 bg-white sticky top-0 overflow-hidden transition-all duration-300 ease-in-out",
        collapsed ? "w-14" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-[72px] shrink-0 items-center border-b border-zinc-200 px-2">
        <div className={cn(
          "flex items-center gap-2 overflow-hidden transition-all duration-300 ease-in-out w-full",
          collapsed ? "justify-center" : "px-2"
        )}>
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-lg font-bold text-white">
            W
          </div>
          {!collapsed && (
            <div className="flex flex-1 items-center gap-2 overflow-hidden">
              <span className="font-semibold text-zinc-900 whitespace-nowrap">Wirmet</span>
              <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-700 whitespace-nowrap">
                PRO
              </span>
            </div>
          )}
          {!collapsed && (
            <Button variant="ghost" size="icon-sm" className="shrink-0">
              <HugeiconsIcon icon={ArrowDown01Icon} size={16} />
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className={cn(
        "flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-6",
        collapsed ? "px-1" : "px-3"
      )}>
        {/* Main section */}
        <div className="space-y-1">
          {!collapsed && (
            <h3 className="px-3 pb-1 text-xs font-medium tracking-wider text-zinc-400 uppercase">
              Main
            </h3>
          )}
          <nav className="space-y-0.5">
            {mainNavItems.map((item) => (
              <NavItem
                key={item.href}
                {...item}
                isActive={pathname === item.href}
                collapsed={collapsed}
              />
            ))}
          </nav>
        </div>

        {/* Management section */}
        <div className="space-y-1">
          {!collapsed && (
            <h3 className="px-3 pb-1 text-xs font-medium tracking-wider text-zinc-400 uppercase">
              Management
            </h3>
          )}
          <nav className="space-y-0.5">
            {managementNavItems.map((item) => (
              <NavItem
                key={item.href}
                {...item}
                isActive={pathname === item.href}
                collapsed={collapsed}
              />
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom: Settings & Help */}
      <div className={cn(
        "border-t border-zinc-200 py-3",
        collapsed ? "px-1" : "px-3"
      )}>
        <nav className="space-y-0.5">
          {bottomNavItems.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              isActive={pathname === item.href}
              collapsed={collapsed}
            />
          ))}
        </nav>
      </div>

      {/* User profile */}
      <div className={cn(
        "border-t border-zinc-200 p-2"
      )}>
        <button
          title={collapsed ? "Jan Kowalski" : undefined}
          className={cn(
            "flex w-full items-center rounded-lg p-1.5 transition-colors hover:bg-zinc-50",
            collapsed ? "justify-center" : "gap-3"
          )}
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-sm font-medium text-zinc-700">
            JK
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden text-left">
              <p className="truncate text-sm font-medium text-zinc-900">Jan Kowalski</p>
              <p className="truncate text-xs text-zinc-500">jan@wirmet.pl</p>
            </div>
          )}
          {!collapsed && (
            <HugeiconsIcon icon={ArrowDown01Icon} size={16} className="shrink-0 text-zinc-400" />
          )}
        </button>
      </div>
    </aside>
  )
}
