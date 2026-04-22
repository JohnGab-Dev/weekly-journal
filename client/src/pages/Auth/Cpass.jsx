import { ChangePass } from "@/components/auth/cpass"
import { TitleRender } from '@/utils/TitleRender'
export default function Page() {
  TitleRender("ReportMaker | Set New Password")
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-muted">
      <div className="w-full max-w-sm">
        <ChangePass />
      </div>
    </div>
  )
}
