import { PageSetup } from "@/components/PageSetup"
import { Invoice01Icon } from "@hugeicons/core-free-icons"

export default function OffersPage() {
  return (
    <>
      <PageSetup title="Offers" icon={Invoice01Icon} />
      <div className="p-8">
        <h1 className="text-lg font-semibold text-zinc-900">Offers</h1>
      </div>
    </>
  )
}
