import { today, dayNames, monthNames } from "../commons/Constants.tsx"
import { useState } from "react"
import "./Calendar.css"

export default function Calendar({onSelectedDateChange}: {onSelectedDateChange?: Function}) {
    const [selectedDate, selectDate] = useState(today)
    const [monthToShow, selectMonth] = useState(today.getMonth())
    const [yearToShow, selectYear] = useState(today.getFullYear())

    function getFirstDateOfMonth(): Date {
        return new Date(yearToShow, monthToShow, 1)
    }

    function getStartingWeekDayOfMonth(): number {
        return (getFirstDateOfMonth().getDay() + 6) % 7
    }

    function getFirstCalendarDateToShow(): Date {
        return getFirstDateOfMonth().addDays(-getStartingWeekDayOfMonth())
    }

    function getDatesToShow(): Date[][] {
        let showedNumbers: Date[][] = []
        let firstDate = getFirstCalendarDateToShow()
        for (let j = 0; j < 6; j++) {
            showedNumbers.push([])
            for (let i = 0; i < 7; i++) {
                showedNumbers[j].push(firstDate.addDays(i + j*7))
                
            }
        }
        return showedNumbers
    }

    function onMonthChange(newMonth: number) {
        if (monthToShow == 0 && newMonth == 11) {
            selectYear(cur => cur - 1)
        } else if (monthToShow == 11 && newMonth == 0) {
            selectYear(cur => cur + 1)
        }
        selectMonth(newMonth)
    }

    return (
        <>
            <table className="calendar">
                <tbody>
                    <tr>
                        <th><button className="calendar-arrow" onClick={() => onMonthChange((monthToShow + 11) % 12)}>&lt;</button></th>
                        <th className="calendar-month" colSpan={5}>{monthNames[monthToShow] + " de " + yearToShow}</th>
                        <th><button className="calendar-arrow" onClick={() => onMonthChange((monthToShow + 1) % 12)}>&gt;</button></th>
                    </tr>

                    <tr>
                        {dayNames.map((d) => { /* Encabezados con los nombres de los días */
                            return (
                                <th className="calendar-day-name" key={d}>{d}</th>
                            )
                        })}
                    </tr>

                    {getDatesToShow().map((row, row_idx) => { /* Mostrar los días del calendario */
                        return (
                            <tr key={row_idx}>
                                {
                                row.map((date, num_idx) => {                  
                                return (
                                    <td key={num_idx}>
                                        <button
                                            className={"calendar-date" + (date.getMonth() == monthToShow ? "" : "-disabled") + (date.getDate() == selectedDate.getDate() && date.getMonth() == selectedDate.getMonth() ? "-selected" : "")}
                                            onClick={() => {
                                                if (date.getMonth() != monthToShow) {
                                                    selectMonth(date.getMonth())
                                                }
                                                selectDate(date)
                                                if (onSelectedDateChange) {
                                                    onSelectedDateChange(date)
                                                }
                                            }}
                                        >
                                            {
                                                date.getDate()
                                            }
                                        </button>
                                    </td>
                                )})}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </>
    )
}