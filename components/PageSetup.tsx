"use client"

import { useEffect } from "react"
import { IconSvgElement } from "@hugeicons/react"
import { useTopBarContext } from "@/components/TopBarContext"

export function PageSetup({
  title,
  icon,
}: {
  title: string
  icon?: IconSvgElement
}) {
  const { setTitle, setIcon } = useTopBarContext()

  useEffect(() => {
    setTitle(title)
    setIcon(icon ?? null)
  }, [title, icon, setTitle, setIcon])

  return null
}
