import { dayNames } from "./Constants.tsx";

declare global {
    interface Date {
        addDays(days: number): Date;
        addHours(hours: number): Date;
        addMinutes(minutes: number): Date;
        addSeconds(seconds: number): Date;
        toFormattedHour(): string;
        toFormattedString(): string;
    }
}

Date.prototype.addDays = function(days: number): Date {
    let newDate: Date = new Date(this);
    newDate.setDate(newDate.getDate() + days);  
    return newDate;
}

Date.prototype.addHours = function(hours: number): Date {
    let newDate: Date = new Date(this);
    newDate.setHours(newDate.getHours() + hours);
    return newDate;
}

Date.prototype.addMinutes = function(minutes: number): Date {
    let newDate: Date = new Date(this);
    newDate.setMinutes(newDate.getMinutes() + minutes);
    return newDate;
}

Date.prototype.addSeconds = function(seconds: number): Date {
    let newDate: Date = new Date(this);
    newDate.addSeconds(newDate.getSeconds() + seconds);
    return newDate;
}

Date.prototype.toFormattedHour = function(): string {
    return this.getHours().toString().padStart(2, "0") + ":" + this.getMinutes().toString().padStart(2, "0")
}

Date.prototype.toFormattedString =  function(): string {
    return `${dayNames[(this.getDay()+6)%7]} ${this.getDate().toString().padStart(2, "0")}/${(this.getMonth()+1).toString().padStart(2, "0")}/${this.getFullYear()}`
}

/*
export function getFormattedHour(date: Date): string {
    return date.getHours().toString().padStart(2, "0") + ":" + date.getMinutes().toString().padStart(2, "0")
}

export function addDays(date: Date, days: number): Date {
    let newDate: Date = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
}

export function addHours(date: Date, hours: number): Date {
    let newDate: Date = new Date(date);
    newDate.setHours(newDate.getHours() + hours);
    return newDate;
}
*/