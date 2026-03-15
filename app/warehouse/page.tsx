import { PageSetup } from "@/components/PageSetup"
import { WarehouseIcon } from "@hugeicons/core-free-icons"

export default function WarehousePage() {
  return (
    <>
      <PageSetup title="Warehouse" icon={WarehouseIcon} />
      <div className="p-8">
        <h1 className="text-lg font-semibold text-zinc-900">Warehouse</h1>
      </div>
    </>
  )
}
