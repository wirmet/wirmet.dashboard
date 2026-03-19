import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-xs/relaxed font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:     "bg-primary text-primary-foreground hover:bg-primary/80",
        brand:       "bg-amber-500 text-white hover:bg-amber-600",
        outline:     "border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 aria-expanded:bg-muted",
        secondary:   "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:       "hover:bg-muted hover:text-foreground aria-expanded:bg-muted dark:hover:bg-muted/50",
        destructive: "border-red-200 bg-red-50 text-red-600 hover:bg-red-100",
        link:        "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:  "h-7 gap-1 px-2 text-xs/relaxed [&_svg:not([class*='size-'])]:size-3.5",
        xs:       "h-5 gap-1 rounded-sm px-2 text-[0.625rem] [&_svg:not([class*='size-'])]:size-2.5",
        sm:       "h-6 gap-1 px-2 text-xs/relaxed [&_svg:not([class*='size-'])]:size-3",
        md:       "h-8 gap-1.5 px-2.5 text-xs font-medium [&_svg:not([class*='size-'])]:size-3.5",
        lg:       "h-9 gap-1.5 px-4 text-sm font-medium [&_svg:not([class*='size-'])]:size-4",
        icon:     "size-7 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-xs":  "size-5 rounded-sm [&_svg:not([class*='size-'])]:size-2.5",
        "icon-sm":  "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-lg":  "size-8 [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size:    "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
