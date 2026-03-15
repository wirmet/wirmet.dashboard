import { PageSetup } from "@/components/PageSetup"
import { Package01Icon } from "@hugeicons/core-free-icons"

export default function InventoryPage() {
  return (
    <>
      <PageSetup title="Inventory" icon={Package01Icon} />
      <div className="p-8">
        <h1 className="text-lg font-semibold text-zinc-900">Inventory</h1>
      </div>
    </>
  )
}
