import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import Logs from '@/components/datatables/logs'
import { TitleRender } from '@/utils/TitleRender'


export default function Page() {
  TitleRender("Report Maker | Logs")
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        }
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title='User Activities' />
        <div className="flex flex-1 flex-col bg-muted">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6">
                <div className="w-full flex item-center justify-between">
                    <h1 className="text-lg font-semibold">Logs</h1>
                </div>
             <Logs />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
