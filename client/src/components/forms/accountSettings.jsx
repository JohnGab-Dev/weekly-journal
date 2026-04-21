import EditProfile from "@/components/forms/editProfile"
import ChangePass from "@/components/forms/cpass"

function AccountSettings() {

  return (
    <div className="min-w-7xl flex flex-col bg-muted">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6">
                <div className="w-full flex item-center justify-between">
                    <h1 className="text-lg font-semibold">Modify your account information</h1>
                </div>
                <EditProfile />
                <ChangePass />
            </div>
    </div>
  )
}

export default AccountSettings
