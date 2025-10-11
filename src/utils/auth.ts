import { jwtDecode } from "jwt-decode"
import type { AuthTokenPayload } from "../types/AuthTokenPayload.ts"

export const isAuthenticated = () => {
    const token = localStorage.getItem("token")
    if (!token) return false // Si no hay token

    try {
        const { user, exp } = jwtDecode<AuthTokenPayload>(token)
        if (!exp) return true // Si no tiene expiración
        if (exp * 1000 < Date.now()) {
            (["token", "legajo", "nombre", "apellido", "correo"].forEach(key => {
                localStorage.removeItem(key)
            }))
            return false // Si ya expiró
        }
        if (!user) {
            return false // Si el payload no tiene usuario asociado
        }
        localStorage.setItem("legajo", user.legajo)
        localStorage.setItem("nombre", user.nombre)
        localStorage.setItem("apellido", user.apellido)
        localStorage.setItem("correo", user.correo)
        return true // Si el token es de un usuario válido
    } catch {
        return false // Si ocurrió un error
    }
}