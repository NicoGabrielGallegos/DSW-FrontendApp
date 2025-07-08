import { today } from "../commons/Constants.tsx";
import "./Schedule.css"

export default function Schedule({date = today, duration = 0}: {date?: Date, duration?: number}) {
    return (
        <table className="schedule">
            <tbody>
                <tr>
                    <th scope="col">Desde</th>
                    <th scope="col">Hasta</th>
                    <td rowSpan={2}><button className="schedule-button">Ver detalles</button></td>
                </tr>
                <tr>
                    <td className="schedule-hour">{date.toFormattedHour()}</td>
                    <td className="schedule-hour">{date.addMinutes(duration).toFormattedHour()}</td>
                </tr>
            </tbody>
        </table>
    )
}