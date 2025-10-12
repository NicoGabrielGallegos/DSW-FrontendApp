import { Navigate } from "react-router"
import { useAuth } from "../context/AuthContext.tsx"

export function PrivateRoute({ children, redirectTo = "/login" }: { children?: any, redirectTo: string }) {
    const auth = useAuth()
    
    return auth.isAuthenticated() ? children : <Navigate to={redirectTo} />
}