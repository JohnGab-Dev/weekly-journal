import { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  setMonth,
  setYear,
} from "date-fns";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DeleteModal } from "@/components/modals/DeleteReport";

export default function Calendar({ fetchTaskEvents, events, reportDates, selectedEvent, selectedReport, user }) {

  const [openDel, setOpenDel] = useState(false)
  const today = new Date();
  const navigate = useNavigate();
  const dateToday = format(today, "yyyy-MM-dd");
  const [date, setDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [search, setSearch] = useState(dateToday)
  const years = Array.from({ length: 50 }, (_, i) => 2000 + i);
  
  const role = user.role
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  useEffect(()=>{
      fetchTaskEvents(search)
      
    }, [search])


  // ✅ HANDLE DATE CLICK
  const handleDateClick = (day) => {
    setDate(day);
    const formatted = format(day, "yyyy-MM-dd");
    setSearch(formatted)
    console.log(events)
  };

  const handleMonthChange = (e) => {
    setCurrentMonth(setMonth(currentMonth, parseInt(e.target.value)));
  };

  const handleYearChange = (e) => {
    setCurrentMonth(setYear(currentMonth, parseInt(e.target.value)));
  };

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center text-sm text-muted-foreground">
          {format(addDays(startDate, i), "EEE")}
        </div>
      );
    }

    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);

    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;

        const isSelected = isSameDay(day, date);
        const isToday = isSameDay(day, today);
        const isCurrentMonth = isSameMonth(day, monthStart);

        days.push(
          <button
            key={day}
            onClick={() => handleDateClick(cloneDay)}
            className={`
                  aspect-square w-full rounded-md text-xs sm:text-sm 
                  flex flex-col justify-between p-1 sm:p-2
                  transition relative
                  ${!isCurrentMonth ? "text-muted-foreground/40" : ""}
                  ${
                    isSelected 
                      ? "bg-primary text-primary-foreground"
                      : isToday
                      ? "bg-blue-100 text-blue-800 font-semibold"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }
                `}
          >
            {/* DAY NUMBER */}
            <span className="text-left">{format(day, "d")}</span>

            {/* EVENT DOTS */}
            <div className="flex gap-1 mt-1 justify-end">
              {events && events.some(item => item.date === format(day, "yyyy-MM-dd")) && (
                <span className="sm:px-2 sm:py-1 rounded-full text-[10px] sm:text-xs sm:bg-yellow-100 text-yellow-600 sm:border border-yellow-300 font-semibold">E</span>
              )}
              {reportDates && reportDates.some(item => item.date === format(day, "yyyy-MM-dd")) && (
                <span className="sm:px-2 sm:py-1 rounded-full text-[10px] sm:text-xs sm:bg-blue-100 text-blue-600 sm:border border-blue-300 font-semibold">R</span>
              )}
              
            </div>
          </button>
        );

        day = addDays(day, 1);
      }

      rows.push(
        <div className="grid grid-cols-7 gap-[2px] sm:gap-1">
          {days}
        </div>
      );

      days = [];
    }

    return <div className="space-y-1">{rows}</div>;
  };

  return (
    <div className="w-full sm:w-7xl flex flex-col lg:flex-row gap-4 bg-white rounded-xl">
      {/* 📅 CALENDAR */}
      <div className="w-full lg:w-[65%] min-h-[50vh] p-3 sm:p-4 sm:rounded-l-xl border-b sm:border-r overflow-x-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex flex-wrap gap-2 justify-center">
            <select
              value={currentMonth.getMonth()}
              onChange={handleMonthChange}
              className="border rounded-md px-2 py-1 text-sm bg-background"
            >
              {months.map((month, index) => (
                <option key={month} value={index}>
                  {month}
                </option>
              ))}
            </select>

            <select
              value={currentMonth.getFullYear()}
              onChange={handleYearChange}
              className="border rounded-md px-2 py-1 text-sm bg-background"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="h-8 w-8 sm:h-9 sm:w-9"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Days */}
        {renderDays()}

        {/* Cells */}
        {renderCells()}
      </div>

      {/* 📌 TASK PANEL */}
      <div className="w-full lg:w-[35%] p-4 sm:p-6 sm:max-h-[90vh] overflow-y-auto">
        <div className="w-full">
          <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="font-semibold mb-2">
              Reports on {format(date, "MMM dd, yyyy")}
            </h2>
            <Button variant="default" onClick={()=>{navigate("/home?add=true")}}>Add New Report</Button>
          </div>
          
          <p className="text-sm font-medium">Events</p>
          {selectedEvent.length > 0 ? (
            selectedEvent.map(item => (
              <div key={item.eventId} className="w-full p-4 mt-4 rounded-xl border border-yellow-500 bg-yellow-100">
                <h1 className="font-medium">{item.title}</h1>
                <h2 className="text-xs text-gray-600">{item.description}</h2>
            </div>
            ))
            
          ) : (
            <div className="w-full p-4 rounded-xl border border-yellow-500 bg-yellow-100 mt-4">
                <h2 className="text-xs text-gray-600">No particular event in this date.</h2>
            </div>
          )}
          {selectedReport.length === 0 ? (
            <p className="text-sm text-muted-foreground mt-4">
              No tasks/events
            </p>
          ) : (
            <ul className="space-y-2 mt-4 w-full list-disc">
              <div className="w-full flex justify-between">
                <p className="text-sm font-medium">{role === "student" ? "Documentation" : "Actions"}</p>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={(e) => (navigate(`/home?edit=${search}`))}>Edit</Button>
                  <Button variant="destructive" onClick={(e)=> {setOpenDel(true)}}> Delete </Button>
                  <DeleteModal openDel={openDel} setOpenDel={setOpenDel} rowId={selectedReport[0].reportDateId} fetchTaskEvents={fetchTaskEvents}/>
                </div>
              </div>
              {role === "student" && (
                <>
                  {selectedReport ? (
                    <div>
                      <img src={`${import.meta.env.VITE_BASE_URL}/${selectedReport[0].documentation}`} alt={selectedReport[0].documentation} className="w-full h-auto rounded-md"/>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-700">No record</p>
                    </div>
                  )}

                  <p className="text-sm font-medium">Documentation Description</p>
                  {selectedReport && (
                    <li 
                      className="ml-10 text-justify"
                    >
                      <p className="text-sm text-gray-700">
                        {selectedReport[0].doc_desc ?? "No record"}
                      </p>
                    </li>
                  )}
                  <p className="text-sm font-medium">Objectives</p>
                  {selectedReport.some(item => item.type === "objective") ? (
                    selectedReport
                      .filter(item => item.type === "objective")
                      .map(report => (
                        <li key={report.reportId} className="ml-10 text-justify">
                          <p className="text-sm text-gray-700">
                            {report.desc}
                          </p>
                        </li>
                      ))
                  ) : (
                    <li className="ml-10 text-justify">
                      <p className="text-sm text-gray-700">
                        No Record
                      </p>
                    </li>
                  )}
                  
                  <p className="text-sm font-medium">Reflection</p>
                  {selectedReport.some(item => item.type === "reflection") ? (
                    selectedReport
                      .filter(item => item.type === "reflection")
                      .map(report => (
                        <li key={report.reportId} className="ml-10 text-justify">
                          <p className="text-sm text-gray-700">
                            {report.desc}
                          </p>
                        </li>
                      ))
                  ) : (
                    <li className="ml-10">
                      <p className="text-sm text-gray-700">
                        No Record
                      </p>
                    </li>
                  )}
                </>
              )}
              
              <p className="text-sm font-medium">Task accomplished</p>
              {selectedReport.some(item => item.type === "task_accomplished") ? (
                selectedReport
                  .filter(item => item.type === "task_accomplished")
                  .map(report => (
                    <li key={report.reportId} className="ml-10 text-justify">
                      <p className="text-sm text-gray-700">
                        {report.desc}
                      </p>
                    </li>
                  ))
              ) : (
                <li className="ml-10">
                  <p className="text-sm text-gray-700">
                    No Record
                  </p>
                </li>
              )}
              {role === "student" && (
                <>
                    <p className="text-sm font-medium">Knowledge</p>
                    {selectedReport.some(item => item.type === "knowledge") ? (
                      selectedReport
                        .filter(item => item.type === "knowledge")
                        .map(report => (
                          <li key={report.reportId} className="ml-10 text-justify">
                            <p className="text-sm text-gray-700">
                              {report.desc}
                            </p>
                          </li>
                        ))
                    ) : (
                      <li className="ml-10">
                        <p className="text-sm text-gray-700">
                          No Record
                        </p>
                      </li>
                    )}

                    <p className="text-sm font-medium">Skills</p>
                    {selectedReport.some(item => item.type === "skills") ? (
                      selectedReport
                        .filter(item => item.type === "skills")
                        .map(report => (
                          <li key={report.reportId} className="ml-10 text-justify">
                            <p className="text-sm text-gray-700">
                              {report.desc}
                            </p>
                          </li>
                        ))
                    ) : (
                      <li className="ml-10">
                        <p className="text-sm text-gray-700">
                          No Record
                        </p>
                      </li>
                    )}

                    <p className="text-sm font-medium">Values</p>
                    {selectedReport.some(item => item.type === "values") ? (
                      selectedReport
                        .filter(item => item.type === "values")
                        .map(report => (
                          <li key={report.reportId} className="ml-10 text-justify">
                            <p className="text-sm text-gray-700">
                              {report.desc}
                            </p>
                          </li>
                        ))
                    ) : (
                      <li className="ml-10">
                        <p className="text-sm text-gray-700">
                          No Record
                        </p>
                      </li>
                    )}
                </>
              )}
              
            </ul>
          )}
          </div>
      </div>
    </div>
  );
}