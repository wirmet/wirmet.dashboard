"use client"

import * as React from "react"

export type EventType = "spotkanie" | "montaz" | "wizja lokalna" | "przeglad"

export interface ScheduleEvent {
  id: string
  title: string
  date: string         // YYYY-MM-DD
  time: string         // "9:00am"
  duration: number     // minutes
  type: EventType
  customerName?: string // used as site label in timeline view
  address?: string
  assignee?: string
}

// Seed data — matches the original static EVENTS array in schedule/page.tsx
const initialEvents: ScheduleEvent[] = [
  { id: "1",  title: "Spotkanie z klientem",      date: "2026-03-02", time: "9:00am",  duration: 60,  type: "spotkanie"      },
  { id: "2",  title: "Inspekcja fundamentów",     date: "2026-03-05", time: "11:00am", duration: 60,  type: "przeglad"       },
  { id: "3",  title: "Dostawa materiałów",        date: "2026-03-09", time: "8:00am",  duration: 90,  type: "montaz"         },
  { id: "4",  title: "Wizja lokalna – Kowalski",  date: "2026-03-09", time: "2:00pm",  duration: 60,  type: "wizja lokalna"  },
  { id: "5",  title: "Dostawa stali",             date: "2026-03-12", time: "9:45am",  duration: 90,  type: "montaz"         },
  { id: "6",  title: "Przegląd budżetu",          date: "2026-03-14", time: "3:30pm",  duration: 60,  type: "spotkanie"      },
  { id: "7",  title: "Standup zespołu",           date: "2026-03-16", time: "8:00am",  duration: 30,  type: "spotkanie"      },
  { id: "8",  title: "Kontrola materiałów",       date: "2026-03-16", time: "11:00am", duration: 60,  type: "montaz"         },
  { id: "9",  title: "Wizja lokalna – Nowak",     date: "2026-03-17", time: "10:00am", duration: 90,  type: "wizja lokalna"  },
  { id: "10", title: "Obiad z klientem",          date: "2026-03-17", time: "12:30pm", duration: 60,  type: "spotkanie"      },
  { id: "11", title: "Betonowanie",               date: "2026-03-18", time: "7:00am",  duration: 120, type: "montaz"         },
  { id: "12", title: "Kontrola BHP",              date: "2026-03-18", time: "2:00pm",  duration: 60,  type: "przeglad"       },
  { id: "13", title: "Pomiar okien",              date: "2026-03-19", time: "9:00am",  duration: 45,  type: "wizja lokalna"  },
  { id: "14", title: "Spotkanie z dostawcą",      date: "2026-03-19", time: "1:00pm",  duration: 60,  type: "spotkanie"      },
  { id: "15", title: "Inspekcja BHP",             date: "2026-03-20", time: "1:00pm",  duration: 60,  type: "przeglad"       },
  { id: "16", title: "Podsumowanie tygodnia",     date: "2026-03-20", time: "4:00pm",  duration: 60,  type: "spotkanie"      },
  { id: "17", title: "Prezentacja dla klienta",   date: "2026-03-24", time: "4:00pm",  duration: 90,  type: "spotkanie"      },
  { id: "18", title: "Dostawa okien",             date: "2026-03-26", time: "8:30am",  duration: 90,  type: "montaz"         },
  { id: "19", title: "Rozpoczęcie pokrycia dachu",date: "2026-03-28", time: "7:00am",  duration: 240, type: "wizja lokalna"  },
  { id: "20", title: "Przegląd pozwoleń",         date: "2026-03-28", time: "2:00pm",  duration: 60,  type: "przeglad"       },
]

interface EventsContextValue {
  events: ScheduleEvent[]
  addEvent: (data: Omit<ScheduleEvent, "id">) => void
  updateEvent: (id: string, updates: Partial<ScheduleEvent>) => void
  deleteEvent: (id: string) => void
}

const EventsContext = React.createContext<EventsContextValue | null>(null)

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = React.useState<ScheduleEvent[]>(initialEvents)

  const addEvent = React.useCallback((data: Omit<ScheduleEvent, "id">) => {
    setEvents((prev) => [...prev, { id: crypto.randomUUID(), ...data }])
  }, [])

  const updateEvent = React.useCallback((id: string, updates: Partial<ScheduleEvent>) => {
    setEvents((prev) => prev.map((ev) => ev.id === id ? { ...ev, ...updates } : ev))
  }, [])

  const deleteEvent = React.useCallback((id: string) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== id))
  }, [])

  const value = React.useMemo<EventsContextValue>(
    () => ({ events, addEvent, updateEvent, deleteEvent }),
    [events, addEvent, updateEvent, deleteEvent]
  )

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
}

export function useEvents(): EventsContextValue {
  const ctx = React.useContext(EventsContext)
  if (!ctx) throw new Error("useEvents must be used within EventsProvider")
  return ctx
}
