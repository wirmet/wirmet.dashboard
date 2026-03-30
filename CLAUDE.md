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
- **Dark mode is primary** — defaultTheme="dark" in theme-provider; light mode still supported
- Always match Figma designs exactly
- UI must be simple enough for non-technical construction workers
- No unnecessary features or complexity

## Dashboard Inspiration (applied March 2026)

Reference: Square UI by indev-ui (square.indev.me)
![inspiration](/Users/maya/Downloads/G9BIWXXXIAAh-xF.jpeg)

Key patterns applied from this inspiration:
- Sidebar as a **floating card** — uses shadcn `variant="floating"` (adds p-2 padding + rounded-lg + ring, no border-r separator)
- Very dark main background (`oklch(0.10)`) so the sidebar card visually "floats" inside it
- Sidebar card background (`oklch(0.16)`) — noticeably lighter than bg but still dark
- Theme toggle icon on the **left side of TopBar**, next to the sidebar trigger
- TopBar blends with the dark background (`dark:bg-zinc-950`)

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

## Button Style

Always use `size="lg"` for action buttons in page headers and top bars. Icons use `data-icon="inline-start"` (never `size` prop on the icon itself):

```tsx
// Primary action (filled)
<Button variant="default" size="lg">
  <HugeiconsIcon icon={SomeIcon} data-icon="inline-start" />
  Zaplanuj transport
</Button>

// Secondary action (outlined)
<Button variant="outline" size="lg">
  <HugeiconsIcon icon={SomeIcon} data-icon="inline-start" />
  Dodaj klienta
</Button>
```

- `size="lg"` everywhere in headers/top bars — never `sm` or `default` size
- `data-icon="inline-start"` on the icon — never manual size classes on icons inside buttons
- Primary CTA: `variant="default"`, supporting actions: `variant="outline"`

## Wirmet Visual Style (established March 2026)

This is the **approved design language** for all dashboard components. Apply consistently.

### Brand Color Palette

Defined as CSS variables in `globals.css`, available as Tailwind utilities:

| Token | Tailwind class | Hex | Usage |
|---|---|---|---|
| `--wirmet-orange` | `text/bg/border-wirmet-orange` | `#d97757` | Primary accent, installation type, active states |
| `--wirmet-blue` | `text/bg/border-wirmet-blue` | `#6a9bcc` | Secondary accent, delivery type, in-progress |
| `--wirmet-green` | `text/bg/border-wirmet-green` | `#788c5d` | Positive/paid states, revenue |
| rose-400 | `text/bg-rose-400` | Tailwind | Fourth accent (scheduled, calendar) |

Background elevation hierarchy (dark mode):
- `--background` `oklch(0.09 0.003 80)` — outer bg (very dark warm)
- `--surface` `oklch(0.13 0.003 80)` — floating content panel
- `--card` `oklch(0.19 0.003 80)` — UI cards inside content panel
- `--muted` `oklch(0.26 0 0)` — hover states, subtle fills

### Typography

- **Display font** (`--font-display`, Poppins 500/600/700): section headers, page h1
  - Apply with: `font-[family-name:var(--font-display)]`
- **Body font** (`--font-sans`, Inter): all other text

### Stat Card Pattern (reference implementation in `app/page.tsx`)

```tsx
<div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
  {/* 2px gradient accent bar — solid on left, fades right */}
  <div className="h-[2px] shrink-0 bg-gradient-to-r from-wirmet-orange to-wirmet-orange/0" />
  <div className="flex flex-col gap-3 px-5 pb-5 pt-4">
    <div className="flex items-center justify-between">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Label</p>
      <HugeiconsIcon icon={SomeIcon} size={14} className="text-wirmet-orange" />
    </div>
    <p className="text-4xl font-bold leading-none tabular-nums text-foreground">42</p>
    <p className="text-xs text-muted-foreground">Trend note</p>
  </div>
</div>
```

### Section Card Pattern (dashboard sections)

Every dashboard section is wrapped in `page.tsx` with:
```tsx
<div className="rounded-2xl border border-border bg-card overflow-hidden">
  <ComponentHere />
</div>
```

Inside each component, the section header uses:
```tsx
<div className="flex items-center justify-between border-b border-border px-5 py-4">
  <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-foreground">
    Tytuł sekcji
  </p>
  <Link href="/page" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
    Wszystkie
    <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
  </Link>
</div>
```

### Flat Row Pattern (lists inside section cards)

Lists use `divide-y divide-border` on the container, each row:
```tsx
<div className="divide-y divide-border">
  <div className="flex items-center gap-3 px-5 py-3.5 cursor-pointer transition-colors hover:bg-muted/20">
    <div className="size-2 shrink-0 rounded-full bg-wirmet-orange/70" /> {/* status dot */}
    <div className="flex-1 min-w-0">
      <p className="truncate text-sm font-medium text-foreground">Primary label</p>
      <p className="text-xs text-muted-foreground">Secondary info</p>
    </div>
    <Badge variant="outline" className="shrink-0 text-[11px] bg-wirmet-orange/10 text-wirmet-orange border-wirmet-orange/20">
      Status
    </Badge>
  </div>
</div>
```

### Left Accent Strip Pattern (project/task rows with type color coding)

For rows that need type-based color coding, use an absolute-positioned vertical strip:
```tsx
<div className="relative flex flex-col gap-2 py-4 pl-9 pr-5 cursor-pointer hover:bg-muted/20 transition-colors">
  {/* Strip is the vertical counterpart of the horizontal stat-card gradient bar */}
  <div className="absolute left-5 top-4 bottom-4 w-[3px] rounded-full bg-wirmet-orange" />
  {/* content */}
</div>
```

### Status / Type Badge Colors

```tsx
// Paid / success / positive
"bg-wirmet-green/10 text-wirmet-green border-wirmet-green/20"

// In progress / ordered / blue info
"bg-wirmet-blue/10 text-wirmet-blue border-wirmet-blue/20"

// Pending / awaiting / amber
"bg-amber-500/10 text-amber-400 border-amber-500/20"

// Muted / neutral
"bg-zinc-500/10 text-muted-foreground border-zinc-500/20"

// Warning / stopped / red
"bg-red-500/10 text-red-400 border-red-500/20"
```

## Claude Behavior Rules

- I am a designer, not a developer — explain technical decisions in simple, plain language
- Always ask before making large changes (adding new files, changing architecture, refactoring)
- Add comments in code explaining "why", not just "what"
- When in doubt about design intent, ask — do not assume
- Keep responses concise and practical
