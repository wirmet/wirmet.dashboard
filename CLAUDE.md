# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A management dashboard for micro and small construction companies. The goal is to replace Excel spreadsheets, sticky notes, and manual printed offers with a simple, clean digital tool. No complex CRM systems — only the most essential features for daily operations of a micro construction business.

## Target Users

Small construction business owners with no technical background. The UI must be extremely simple and intuitive.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui (primary component library)
- HugeIcons
- next-themes

## Directory Structure

- `src/app/` - Pages using App Router
- `src/components/ui/` - shadcn components (do NOT modify manually)
- `src/components/` - Custom components
- `src/lib/` - Utilities

## Figma Views

- Sidebar navigation (start here — present on every view)
- Data table
- Menu
- File display view

## Key Features to Build

- Offers management (tworzenie i zarządzanie ofertami)
- Project tracking (realizacje)
- Calendar and scheduler (terminarz)
- Clients management (klienci)
- Suppliers management (dostawcy)
- Inventory and stock management (spis towaru i magazyn)

## Design Guidelines

- Minimalist and clean style
- Light mode is primary, dark mode supported via next-themes
- Always match Figma designs exactly
- UI must be simple enough for non-technical construction workers
- No unnecessary features or complexity

## Component Rules

- Always use shadcn/ui components first before creating any custom component
- Check shadcn docs before building anything new
- Use CVA (class-variance-authority) for component variants
- Use path aliases: `@/components`, `@/lib`

## Commands

```bash
npm run dev      # Start development server on localhost:3000
npm run build    # Production build with TypeScript check
npm run lint     # Run ESLint
```

## Component Styles

### DropdownMenu
Always use this pattern for `DropdownMenuContent` — light mode forced via CSS variable overrides, with a visible border:

```tsx
<DropdownMenuContent
  align="end"
  className="w-36 border border-zinc-200"
  style={{
    "--popover": "oklch(1 0 0)",
    "--popover-foreground": "oklch(0.145 0 0)",
    "--accent": "oklch(0.97 0 0)",
    "--accent-foreground": "oklch(0.205 0 0)",
    "--border": "oklch(0.922 0 0)",
  } as React.CSSProperties}
>
  <DropdownMenuItem>
    <SomeIcon />
    Label
  </DropdownMenuItem>
  <DropdownMenuSeparator />
  <DropdownMenuItem variant="destructive">
    <DeleteIcon />
    Delete
  </DropdownMenuItem>
</DropdownMenuContent>
```

- Icons go directly inside `DropdownMenuItem` with no extra wrapper
- Destructive action uses `variant="destructive"` — no manual color classes
- CSS variables force light mode regardless of active theme

## Claude Behavior Rules

- I am a designer, not a developer — explain technical decisions in simple, plain language
- Always ask before making large changes (adding new files, changing architecture, refactoring)
- Add comments in code explaining "why", not just "what"
- When in doubt about design intent, ask — do not assume
- Keep responses concise and practical
