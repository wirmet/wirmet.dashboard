import { PageSetup } from "@/components/PageSetup"
import { UserIcon } from "@hugeicons/core-free-icons"

export default function CustomersPage() {
  return (
    <>
      <PageSetup title="Customers" icon={UserIcon} />
      <div className="p-8">
        <h1 className="text-lg font-semibold text-zinc-900">Customers</h1>
      </div>
    </>
  )
}
