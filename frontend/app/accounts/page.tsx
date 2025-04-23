import { PageHeader } from "@/components/page-header"
import { AccountManager } from "@/components/account-manager"

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="账号管理" description="管理您的预约账号信息" />
      <AccountManager />
    </div>
  )
}
