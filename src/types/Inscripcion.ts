import type { Alumno } from "./Alumno.ts";
import type { Consulta } from "./Consulta.ts";

export interface Inscripcion {
    _id: string,
    alumno: string | Alumno,
    consulta: string | Consulta
}