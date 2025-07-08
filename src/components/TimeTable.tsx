import { now, today } from "../commons/Constants.tsx"
import Schedule from "./Schedule.tsx"
import "./TimeTable.css"

export default function TimeTable({date = today}: {date?: Date}) {
    return (
        <>
        <table className="time-table">
            <tbody>
                <tr>
                    <th>{date.toFormattedString()}</th>
                </tr>
                <tr>
                    <td className="time-table-schedule">
                        <Schedule date={now} duration={15} />
                    </td>
                </tr>
                <tr>
                    <td className="time-table-schedule">
                        <Schedule date={now.addHours(5)} duration={60} />
                    </td>
                </tr>
                <tr>
                    <td className="time-table-schedule">
                        <Schedule />
                    </td>
                </tr>
            </tbody>
        </table>
        </>
    )
}