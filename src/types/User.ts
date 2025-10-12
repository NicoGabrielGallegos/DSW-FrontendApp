export interface User {
    id: string,
    legajo: string
    nombre: string,
    apellido: string,
    correo: string,
    rol: "admin" | "alumno" | "docente"
}

export const EMPTY_USER = {
    id: "",
    legajo: "",
    nombre: "",
    apellido: "",
    correo: "",
    rol: "admin"
}