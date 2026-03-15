import { PageSetup } from "@/components/PageSetup"
import { DeliveryTruck01Icon } from "@hugeicons/core-free-icons"

export default function ShipmentsPage() {
  return (
    <>
      <PageSetup title="Shipments" icon={DeliveryTruck01Icon} />
      <div className="p-8">
        <h1 className="text-lg font-semibold text-zinc-900">Shipments</h1>
      </div>
    </>
  )
}
