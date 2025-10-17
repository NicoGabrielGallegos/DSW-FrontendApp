const BASE_URL = "http://localhost:3000/api"

export const API_ROUTES = {
    ALUMNOS: {
        FIND_ALL: `${BASE_URL}/alumnos`,
        FIND_ONE: (id: string) => `${BASE_URL}/alumnos/${id}`,
        ADD: `${BASE_URL}/alumnos`,
        UPDATE: (id: string) => `${BASE_URL}/alumnos/${id}`,
        PATCH: (id: string) => `${BASE_URL}/alumnos/${id}`,
        DELETE: (id: string) => `${BASE_URL}/alumnos/${id}`,
        FIND_BY_CORREO: (correo: string) => `${BASE_URL}/alumnos/byCorreo/${correo}`,
        FIND_BY_CONSULTA: (consulta: string) => `${BASE_URL}/alumnos/byConsulta/${consulta}`,
        LOGIN: `${BASE_URL}/alumnos/login`
    },
    DOCENTES: {
        FIND_ALL: `${BASE_URL}/docentes`,
        FIND_ONE: (id: string) => `${BASE_URL}/docentes/${id}`,
        ADD: `${BASE_URL}/docentes`,
        UPDATE: (id: string) => `${BASE_URL}/docentes/${id}`,
        PATCH: (id: string) => `${BASE_URL}/docentes/${id}`,
        DELETE: (id: string) => `${BASE_URL}/docentes/${id}`,
        FIND_BY_CORREO: (correo: string) => `${BASE_URL}/docentes/byCorreo/${correo}`,
        FIND_BY_MATERIA: (materia: string) => `${BASE_URL}/docentes/byMateria/${materia}`,
        LOGIN: `${BASE_URL}/docentes/login`
    },
    MATERIAS: {
        FIND_ALL: `${BASE_URL}/materias`,
        FIND_ONE: (id: string) => `${BASE_URL}/materias/${id}`,
        ADD: `${BASE_URL}/materias`,
        UPDATE: (id: string) => `${BASE_URL}/materias/${id}`,
        PATCH: (id: string) => `${BASE_URL}/materias/${id}`,
        DELETE: (id: string) => `${BASE_URL}/materias/${id}`,
        FIND_BY_DESCRIPCION: (descripcion: string) => `${BASE_URL}/materias/byDescripcion/${descripcion}`,
        FIND_BY_DOCENTE: (docente: string) => `${BASE_URL}/materias/byDocente/${docente}`
    },
    DICTADOS: {
        FIND_ALL: `${BASE_URL}/dictados`,
        FIND_ONE: (id: string) => `${BASE_URL}/dictados/${id}`,
        ADD: `${BASE_URL}/dictados`,
        UPDATE: (id: string) => `${BASE_URL}/dictados/${id}`,
        PATCH: (id: string) => `${BASE_URL}/dictados/${id}`,
        DELETE: (id: string) => `${BASE_URL}/dictados/${id}`,
        FIND_BY_DOCENTE: (docente: string) => `${BASE_URL}/dictados/byDocente/${docente}`,
        FIND_BY_MATERIA: (materia: string) => `${BASE_URL}/dictados/byMateria/${materia}`,
        FIND_ONE_BY_DOCENTE_AND_MATERIA: (docente: string, materia: string) => `${BASE_URL}/dictados/byDocente/${docente}/byMateria/${materia}`
    },
    CONSULTAS: {
        FIND_ALL: `${BASE_URL}/consultas`,
        FIND_ONE: (id: string) => `${BASE_URL}/consultas/${id}`,
        ADD: `${BASE_URL}/consultas`,
        UPDATE: (id: string) => `${BASE_URL}/consultas/${id}`,
        PATCH: (id: string) => `${BASE_URL}/consultas/${id}`,
        DELETE: (id: string) => `${BASE_URL}/consultas/${id}`,
        FIND_BY_DICTADO: (dictado: string) => `${BASE_URL}/consultas/byDictado/${dictado}`,
        FIND_BY_DOCENTE: (docente: string) => `${BASE_URL}/consultas/byDocente/${docente}`,
        FIND_BY_MATERIA: (materia: string) => `${BASE_URL}/consultas/byMateria/${materia}`
    }
}