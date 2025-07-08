const dayNames = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"]
const longDayNames = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
const now = new Date()
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())


export { dayNames, longDayNames, monthNames, now, today }