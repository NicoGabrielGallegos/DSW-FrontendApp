import type { Docente } from "./Docente.ts"
import type { Materia } from "./Materia.ts"

export interface Dictado<TDocente extends string | Docente = string, TMateria extends string | Materia = string> {
    _id: string,
    docente: TDocente
    materia: TMateria
}