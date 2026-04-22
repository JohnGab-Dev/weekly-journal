import { SignupForm } from "@/components/auth/signup-form"
import { TitleRender } from '@/utils/TitleRender'
export default function Page() {
  TitleRender("ReportMaker | Signup")
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-muted">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  )
}
