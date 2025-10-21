export interface AuthTokenPayload {
    exp: number;
    iat: number;
    user: {
        id: string,
        legajo: string,
        nombre: string,
        apellido: string,
        correo: string,
        permisos?: number[],
        rol: "alumno" | "docente" | "administrador"
    }
}