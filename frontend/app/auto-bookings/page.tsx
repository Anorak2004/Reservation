import { PageHeader } from "@/components/page-header"
import { AutoBookingList } from "@/components/auto-booking-list"

export default function AutoBookingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="自动预约管理" description="查看和管理您的自动预约任务" />
      <AutoBookingList />
    </div>
  )
}
