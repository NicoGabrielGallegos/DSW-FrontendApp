import type { Dictado } from "./Dictado.ts";

export interface Consulta {
    _id: string,
    dictado: string | Dictado,
    horaInicio: string,
    horaFin: string,
    estado: string,
}