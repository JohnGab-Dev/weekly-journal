import{ useState } from 'react'
import { Calendar } from "@/components/ui/calendar"

export default function CalendarDemo() {
  const [date, setDate] = useState(new Date)

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-lg border"
      captionLayout="dropdown"
    />
  )
}
