import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

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

const accentColor: Record<OfferStatus, string> = {
  "Do wyceny":             "bg-amber-400",
  "Do wysłania":           "bg-blue-400",
  "Oczekuje na odpowiedź": "bg-zinc-300",
}

const badgeStyle: Record<OfferStatus, string> = {
  "Do wyceny":             "bg-amber-50 text-amber-700 border-amber-200",
  "Do wysłania":           "bg-blue-50 text-blue-700 border-blue-200",
  "Oczekuje na odpowiedź": "bg-zinc-100 text-zinc-600 border-zinc-200",
}

export function PendingOffers() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
      {offers.map((offer, index) => (
        <div
          key={offer.number}
          className={cn(
            "flex items-center gap-4 px-4 py-3",
            index !== offers.length - 1 && "border-b border-zinc-100"
          )}
        >
          {/* Status accent bar */}
          <div className={cn("h-8 w-1 shrink-0 rounded-full", accentColor[offer.status])} />

          {/* Main content */}
          <div className="flex flex-1 items-center justify-between gap-4 min-w-0">
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-900 truncate">{offer.company}</p>
              <p className="text-xs text-zinc-400">{offer.number} · {offer.created}</p>
            </div>
            <Badge
              variant="outline"
              className={cn("shrink-0 text-[11px]", badgeStyle[offer.status])}
            >
              {offer.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
