import { PageSetup } from "@/components/PageSetup"
import { Folder01Icon } from "@hugeicons/core-free-icons"

export default function FilesPage() {
  return (
    <>
      <PageSetup title="Files" icon={Folder01Icon} />
      <div className="p-8">
        <h1 className="text-lg font-semibold text-zinc-900">Files</h1>
      </div>
    </>
  )
}
