import type { Alumno } from "./Alumno.ts";
import type { Consulta as C } from "./Consulta.ts";
import type { Dictado as D } from "./Dictado.ts";
import type { Docente } from "./Docente.ts";
import type { Materia } from "./Materia.ts";

type Dictado = D<string | Docente, string | Materia>
type Consulta = C<string | Dictado>

export interface Inscripcion<TAlumno extends string | Alumno = string, TConsulta extends string | Consulta = string> {
    _id: string,
    alumno: TAlumno,
    consulta: TConsulta
}