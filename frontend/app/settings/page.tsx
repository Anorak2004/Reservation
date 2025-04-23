import { PageHeader } from "@/components/page-header"
import { SettingsForm } from "@/components/settings-form"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="系统设置" description="管理您的个人设置和偏好" />
      <SettingsForm />
    </div>
  )
}
