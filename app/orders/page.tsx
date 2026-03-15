import { PageSetup } from "@/components/PageSetup"
import { ShoppingCart01Icon } from "@hugeicons/core-free-icons"

export default function OrdersPage() {
  return (
    <>
      <PageSetup title="Orders" icon={ShoppingCart01Icon} />
      <div className="p-8">
        <h1 className="text-lg font-semibold text-zinc-900">Orders</h1>
      </div>
    </>
  )
}
