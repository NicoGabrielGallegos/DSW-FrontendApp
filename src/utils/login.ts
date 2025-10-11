import type { NavigateFunction } from "react-router"
import { apiClient } from "../api/apiClient.ts"
import { API_ROUTES } from "../api/endpoints.ts"

export const login = async (rol: "alumno" | "docente", correo: string, password: string, navigate: NavigateFunction, navigateTo: string = "/dashboard") => {
    const endpoint = rol == "alumno" ? API_ROUTES.ALUMNOS.LOGIN : rol == "docente" ? API_ROUTES.DOCENTES.LOGIN : ""
    try {
        const token = (await apiClient.post(endpoint, { body: { correo, password } })).data
        localStorage.setItem("token", token)
        navigate(navigateTo)
    } catch (err: any) {
        console.log(err.message);
    }
}

export const logout = (navigate: NavigateFunction, navigateTo: string = "/login") => {
    try {
        (["token", "legajo", "nombre", "apellido", "correo"].forEach(key => {
            localStorage.removeItem(key)
        }))
        navigate(navigateTo)
    } catch (err: any) {
        console.log(err.message);
    }
}