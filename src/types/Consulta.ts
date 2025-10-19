import type { Dictado as D } from "./Dictado.ts";
import type { Docente } from "./Docente.ts";
import type { Materia } from "./Materia.ts";

type Dictado = D<string | Docente, string | Materia>

export const EstadoConsulta = {Programada: "Programada", Realizada: "Realizada", Cancelada: "Cancelada"}

export interface Consulta<TDictado extends string | Dictado> {
    _id: string,
    dictado: TDictado,
    horaInicio: string,
    horaFin: string,
    estado: string,
}