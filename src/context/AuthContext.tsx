import { decodeToken } from "../utils/auth.ts"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "../types/User.ts"

type AuthContextType = {
    user: User | null,
    token: string | null,
    login: (token: string) => void,
    logout: () => void,
    isAuthenticated: () => boolean
    isLoading: () => boolean
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    login: () => { },
    logout: () => { },
    isAuthenticated: () => false,
    isLoading: () => true,
})

export const AuthProvider = ({ children }: { children: any }) => {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        const storedToken = localStorage.getItem("token")
        if (storedToken) {
            const decoded = decodeToken(storedToken)
            if (!decoded || !decoded.user) {
                logout()
                return
            }
            setToken(storedToken)
            setUser(decoded.user)
        }

    }, [])

    const login = (token: string) => {
        const decoded = decodeToken(token)
        if (decoded) {
            localStorage.setItem("token", token)
            setToken(token)
            setUser(decoded.user)
        }
    }

    const logout = () => {
        localStorage.removeItem("token")
        setToken(null)
        setUser(null)
    }

    const isAuthenticated = () => {
        const token = localStorage.getItem("token")

        // Si no hay token
        if (!token) return false

        const decoded = decodeToken(token)
        // Si no se pudo decodificar el token o el payload no tiene usuario asociado
        if (!decoded || !decoded.user) return false

        // Si no tiene expiración
        if (!decoded.exp) return true

        // Si ya expiró
        if (decoded.exp * 1000 < Date.now()) {
            logout()
            return false
        }

        // Si el token es de un usuario válido
        return true
    }

    const isLoading = () => localStorage.getItem("token") !== null && (token === null || user === null)

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)