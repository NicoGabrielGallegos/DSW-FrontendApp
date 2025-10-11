const BASE_URL = "http://localhost:3000/api"

export const API_ROUTES = {
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