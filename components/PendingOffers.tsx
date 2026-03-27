import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import Link from "next/link"

type OfferStatus = "Do wyceny" | "Do wysłania" | "Oczekuje na odpowiedź"

interface PendingOffer {
  number: string
  company: string
  created: string
  status: OfferStatus
}

const offers: PendingOffer[] = [
  {
    number: "#OF-0441",
    company: "TechBuild Sp. z o.o.",
    created: "10 Mar 2025",
    status: "Do wyceny",
  },
  {
    number: "#OF-0438",
    company: "Konstrukt S.A.",
    created: "8 Mar 2025",
    status: "Do wysłania",
  },
  {
    number: "#OF-0435",
    company: "Rem-Bud Usługi",
    created: "5 Mar 2025",
    status: "Oczekuje na odpowiedź",
  },
  {
    number: "#OF-0431",
    company: "Piotr Jabłoński",
    created: "3 Mar 2025",
    status: "Do wyceny",
  },
]

// Small status dot color
const dotColor: Record<OfferStatus, string> = {
  "Do wyceny":             "bg-amber-400",
  "Do wysłania":           "bg-blue-400",
  "Oczekuje na odpowiedź": "bg-muted-foreground/40",
}

// Opacity-based badge colors — work in both light and dark
const badgeClass: Record<OfferStatus, string> = {
  "Do wyceny":             "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Do wysłania":           "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Oczekuje na odpowiedź": "bg-zinc-500/10 text-muted-foreground border-zinc-500/20",
}

export function PendingOffers() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-foreground">Oferty w toku</p>
        <Button variant="outline" size="sm" asChild className="rounded-full">
          <Link href="/offers">
            Wszystkie
            <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" />
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {offers.map((offer) => (
          <div key={offer.number} className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
            <div className={cn("size-2 shrink-0 rounded-full", dotColor[offer.status])} />
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{offer.company}</p>
              <p className="text-xs text-muted-foreground">{offer.number} · {offer.created}</p>
            </div>
            <Badge variant="outline" className={cn("shrink-0 text-[11px]", badgeClass[offer.status])}>
              {offer.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  )
}
