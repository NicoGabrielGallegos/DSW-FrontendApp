export class FormatedDate {
    constructor(date: string) {
        this.ISOString = date
        this.date = new Date(date)
    }
    ISOString: string
    date: Date
    hours = () => {
        let h = this.date.getHours()
        return h < 10 ? `0${h}` : `${h}`
    }
    minutes = () => {
        let m = this.date.getMinutes()
        return m < 10 ? `0${m}` : `${m}`
    }
    day = () => {
        let d = this.date.getDate()
        return d < 10 ? `0${d}` : `${d}`
    }
    month = () => {
        let m = this.date.getMonth() + 1
        return m < 10 ? `0${m}` : `${m}`
    }
    year = () => {
        return this.date.getFullYear()
    }
    timeString = () => {
        return `${this.hours()}:${this.minutes()}`
    }
    dateString = () => {
        return `${this.day()}/${this.month()}/${this.year()}`
    }
    fullString = () => {
        return `${this.dateString()} - ${this.timeString()}`
    }
}