declare global {
    interface Date {
        //
        addDays(days: number): Date;
        addHours(hours: number): Date;
        addMinutes(minutes: number): Date;
        addSeconds(seconds: number): Date;
        //
        hoursString(): string;
        minutesString(): string;
        secondsString(): string;
        //
        dayString(): string;
        monthString(): string;
        yearString(): string;
        //
        timeString(): string;
        dateString(): string;
        fullString(): string;
    }
}

Date.prototype.addDays = function (days: number): Date {
    this.setDate(this.getDate() + days);
    return this;
}

Date.prototype.addHours = function (hours: number): Date {
    this.setHours(this.getHours() + hours);
    return this;
}

Date.prototype.addMinutes = function (minutes: number): Date {
    this.setMinutes(this.getMinutes() + minutes);
    return this;
}

Date.prototype.addSeconds = function (seconds: number): Date {
    this.addSeconds(this.getSeconds() + seconds);
    return this;
}

Date.prototype.hoursString = function (): string {
    let h = this.getHours()
    return h < 10 ? `0${h}` : `${h}`
}

Date.prototype.minutesString = function (): string {
    let m = this.getMinutes()
    return m < 10 ? `0${m}` : `${m}`
}

Date.prototype.secondsString = function (): string {
    let s = this.getSeconds()
    return s < 10 ? `0${s}` : `${s}`
}

Date.prototype.dayString = function (): string {
    let d = this.getDate()
    return d < 10 ? `0${d}` : `${d}`
}

Date.prototype.monthString = function (): string {
    let m = this.getMonth() + 1
    return m < 10 ? `0${m}` : `${m}`
}

Date.prototype.yearString = function (): string {
    return `${this.getFullYear()}`
}

Date.prototype.timeString = function (): string {
    return `${this.hoursString()}:${this.minutesString()}`
}

Date.prototype.dateString = function (): string {
    return `${this.dayString()}/${this.monthString()}/${this.yearString()}`
}

Date.prototype.fullString = function (): string {
    return `${this.dateString()} - ${this.timeString()}`
}