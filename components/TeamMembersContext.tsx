"use client"

import * as React from "react"

const initialMembers = [
  "Adam Wiśniewski",
  "Piotr Kowalski",
  "Marek Jabłoński",
  "Tomasz Nowak",
  "Rafał Zając",
]

interface TeamMembersContextValue {
  members: string[]
  addMember: (name: string) => void
  removeMember: (name: string) => void
}

const TeamMembersContext = React.createContext<TeamMembersContextValue | null>(null)

export function TeamMembersProvider({ children }: { children: React.ReactNode }) {
  const [members, setMembers] = React.useState<string[]>(initialMembers)

  const addMember = React.useCallback((name: string) => {
    setMembers(prev => prev.includes(name) ? prev : [...prev, name])
  }, [])

  const removeMember = React.useCallback((name: string) => {
    setMembers(prev => prev.filter(m => m !== name))
  }, [])

  const value = React.useMemo(() => ({ members, addMember, removeMember }), [members, addMember, removeMember])

  return <TeamMembersContext.Provider value={value}>{children}</TeamMembersContext.Provider>
}

export function useTeamMembers(): TeamMembersContextValue {
  const ctx = React.useContext(TeamMembersContext)
  if (!ctx) throw new Error("useTeamMembers must be used within TeamMembersProvider")
  return ctx
}
