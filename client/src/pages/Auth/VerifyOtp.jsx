import { VerifyOtp } from "@/components/auth/verify-otp"
import { TitleRender } from '@/utils/TitleRender'
export default function Page() {
  TitleRender("ReportMaker | OTP Verification")
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-muted">
      <div className="w-full max-w-sm">
        <VerifyOtp />
      </div>
    </div>
  )
}
