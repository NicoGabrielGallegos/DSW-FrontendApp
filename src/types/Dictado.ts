import type { Docente } from "./Docente.ts"
import type { Materia } from "./Materia.ts"

export interface Dictado {
    _id: string,
    docente: string | Docente
    materia: string | Materia
}