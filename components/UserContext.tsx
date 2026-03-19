"use client"

import * as React from "react"

interface UserContextValue {
  avatarUrl: string | null
  setAvatarUrl: (url: string | null) => void
}

const UserContext = React.createContext<UserContextValue | null>(null)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null)

  const value = React.useMemo<UserContextValue>(
    () => ({ avatarUrl, setAvatarUrl }),
    [avatarUrl]
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser(): UserContextValue {
  const ctx = React.useContext(UserContext)
  if (!ctx) throw new Error("useUser must be used within UserProvider")
  return ctx
}
