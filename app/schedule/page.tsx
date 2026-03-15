import { PageSetup } from "@/components/PageSetup"
import { Calendar01Icon } from "@hugeicons/core-free-icons"

export default function SchedulePage() {
  return (
    <>
      <PageSetup title="Schedule" icon={Calendar01Icon} />
      <div className="p-8">
        <h1 className="text-lg font-semibold text-zinc-900">Schedule</h1>
      </div>
    </>
  )
}
