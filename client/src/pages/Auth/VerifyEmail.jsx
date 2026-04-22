import { VerifyEmail } from "@/components/auth/verify-email"
import { TitleRender } from '@/utils/TitleRender'
export default function Page() {
  TitleRender("ReportMaker | Verify Email")
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-muted">
      <div className="w-full max-w-sm">
        <VerifyEmail />
      </div>
    </div>
  )
}
