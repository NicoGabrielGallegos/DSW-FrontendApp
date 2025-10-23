export const ROUTES = {
    ROOT: "/",
    LOGIN: "/login",
    LOGIN_ALUMNOS: "/login/alumnos",
    LOGIN_DOCENTES: "/login/docentes",
    HOME: "/home",
    MATERIAS: "/materias",
    DOCENTES: "/docentes",
    CONSULTAS: "/consultas",
    CONSULTA_BY_ID: (id: string) => `/consultas/${id}`,
    CONSULTA_NUEVA: "/nueva_consulta",
    ADMIN: {
        ROOT: "/admin",
        CRUD_ALUMNOS: "/admin/alumnos",
        CRUD_DOCENTES: "/admin/docentes",
        CRUD_MATERIAS: "/admin/materias",
        CRUD_DICTADOS: "/admin/dictados",
        CRUD_CONSULTAS: "/admin/consultas",
        CRUD_INSCRIPCIONES: "/admin/inscripciones",
    }
}