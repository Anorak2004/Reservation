import { VenueList } from "@/components/venue-list"
import { PageHeader } from "@/components/page-header"

export default function Home() {
  return (
    <div className="space-y-6">
      <PageHeader title="场馆预约" description="查看并预约可用场馆，或设置自动预约任务" />
      <VenueList />
    </div>
  )
}
