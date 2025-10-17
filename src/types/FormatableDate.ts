export class FormatableDate {
    constructor(date: string) {
        this.ISOString = date
        this.date = new Date(date)
        this.horas = () => {
            let h = this.date.getHours()
            return h < 10 ? `0${h}` : `${h}`
        }
        this.minutos = () => {
            let m = this.date.getMinutes()
            return m < 10 ? `0${m}` : `${m}`
        }
    }
    ISOString: string
    date: Date
    horas: () => string
    minutos: () => string
}