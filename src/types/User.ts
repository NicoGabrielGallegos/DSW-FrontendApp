export type Rol = "administrador" | "alumno" | "docente"

export interface User {
    id: string,
    legajo: string
    nombre: string,
    apellido: string,
    correo: string,
    permisos?: number[],
    rol: Rol
}

export const EMPTY_USER: User = {
    id: "",
    legajo: "",
    nombre: "",
    apellido: "",
    correo: "",
    permisos: [],
    rol: "alumno"
}