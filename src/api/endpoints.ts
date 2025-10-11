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
        FIND_BY_CONSULTA: (consulta: string) => `${BASE_URL}/alumnos/byCorreo/${consulta}`,
        LOGIN: `${BASE_URL}/alumnos/login`
    },
    DOCENTES: {
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
    }
}