"use client"

import * as React from "react"
import { useTopBarContext } from "@/components/TopBarContext"

// Hook for pages to set their title
// Usage: useTopBar({ title: "Files" })
export function useTopBar({ title }: { title: string }) {
  const { setTitle } = useTopBarContext()

  React.useEffect(() => {
    setTitle(title)
  }, [title, setTitle])
}
