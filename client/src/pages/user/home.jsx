import React from 'react'
import NavBar from '@/components/nav-bar'
import { TitleRender } from '@/utils/TitleRender'
import Calendar from '@/components/calendar-fns'
import { Button } from "@/components/ui/button"
import { MoveLeft } from "lucide-react"
import{ useState} from 'react'
import api from "@/axiosInstance/api"
import { useSearchParams, Link } from "react-router-dom";
import AddReport from '@/components/forms/addReport'
import EditReport from '@/components/forms/editReport'
import AccountSettings from '@/components/forms/accountSettings'
import ExportReport from '@/components/forms/export'


function Page() {
  TitleRender("ReportMaker | Students Dashboard")

    const [searchParams] = useSearchParams();
    const add = searchParams.get("add");
    const edit = searchParams.get("edit");
    const account = searchParams.get("account");
    const exportReport = searchParams.get("exportReport");

    const [events, setEvents] = useState([]);
    const [reportDates, setReportDates] = useState([]);
    const [selectedReport, setSelectedReport] = useState([])
    const [selectedEvent, setSelectedEvent] = useState([])
    const fetchTaskEvents = async (search = "") => {
      let url = "/get-events-and-tasks"
        if(search != ""){
          url+=`?date=${search}`
        }
      try{
        const response = await api.get(url);
        setEvents(response.data.events)
        setReportDates(response.data.reportDates)
        setSelectedEvent(response.data.filteredEvent)
        setSelectedReport(response.data.filteredReport)
        // console.log(response.data)
      }catch(error){
        console.error(error);
      }
    }
    const user = JSON.parse(localStorage.getItem("user"))
  
  return (
    <div className='bg-muted min-h-screen'>
      <NavBar user={user} />
      <div className='w-full py-6 items-center flex flex-col gap-6'>
        <div className=''>
          {(!add && !edit && !account && !exportReport)  && (
            <Calendar 
            fetchTaskEvents={fetchTaskEvents} 
            events={events} reportDates={reportDates} 
            selectedEvent={selectedEvent}
            selectedReport={selectedReport}
            />
          )}

          {add && (
            <div>
              <Link to="/home" className='flex items-center gap-1 mb-4 hover:underline'><MoveLeft /> Back to homepage</Link>
              <AddReport />
            </div>
            
          )}

          {edit && (
            <div>
              <Link to="/home" className='flex items-center gap-1 mb-4 hover:underline'><MoveLeft /> Back to homepage</Link>
              <EditReport date={edit} />
            </div>
            
          )}

          {account && (
            <div>
              <Link to="/home" className='flex items-center gap-1 mb-4 hover:underline'><MoveLeft /> Back to homepage</Link>
              <AccountSettings />
            </div>
            
          )}

          {exportReport && (
            <div>
              <Link to="/home" className='flex items-center gap-1 mb-4 hover:underline'><MoveLeft /> Back to homepage</Link>
              <ExportReport />
            </div>
            
          )}
        </div>
        
      </div>
    </div>
  )
}

export default Page
