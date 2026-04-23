import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { TitleRender } from '@/utils/TitleRender'
import { useState, useEffect } from "react"
import api from "@/axiosInstance/api"
import AccountsList from "@/components/table"

export default function Page() {
  TitleRender("Report Maker | Dashboard")
   const [loading, setLoading] = useState(false)
   const [data, setData] = useState([])
   const [totalUsers, setTotalUsers] = useState(0)
   const [activeAccounts, setActiveAccounts] = useState(0)
   const [archiveAccounts, setArchiveAccounts] = useState(0)
   const [averageLogs, setaverageLogs] = useState(0)


  async function fetchData(){
    setLoading(true)
      try {
        const response = await api.get('/dashboard');
        setData(response.data.data)
        setTotalUsers(response.data.totalUsers)
        setActiveAccounts(response.data.activeAccounts)
        setArchiveAccounts(response.data.archiveAccounts)
        setaverageLogs(response.data.averageLogs)
      } catch (error) {
        console.error(error);
      }finally{
        setLoading(false)
      }
  }

  useEffect(()=>{
    fetchData()
  }, [])
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
        <SiteHeader title='Dashboard' />
        <div className="flex flex-1 flex-col bg-muted">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards 
                totalUsers={totalUsers}
                activeAccounts={activeAccounts}
                archiveAccounts={archiveAccounts}
                averageLogs={averageLogs}
              />
              <div className="px-4 lg:px-6">
                <div className="w-full border p-6 rounded-xl bg-gray-100">
                  <h1 className="font-medium">Top 10 users with most activities</h1>
                  <AccountsList data={data} loading={loading} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
