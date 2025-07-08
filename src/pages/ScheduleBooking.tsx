import { useState } from "react";
import { today } from "../commons/Constants.tsx";
import Calendar from "../components/Calendar.tsx";
import TimeTable from "../components/TimeTable.tsx";
import useScreenSize from "../hooks/useScreenSize.tsx";
import "./ScheduleBooking.css"

const widths = [0, 500, 650, 800, 950, 1100, 1250]

export default function ScheduleBooking() {
    const [selectedDay, selectDay] = useState(today);
    const screenWidth = useScreenSize();
    return (
        <>
            <Calendar onSelectedDateChange={(date: Date) => selectDay(date)} />
            <div className="time-tables">
                {widths.map((width, index) => {
                    return screenWidth > width && <TimeTable date={selectedDay.addDays(index)} key={index} />
                })}
            </div>
        </>
  )
}