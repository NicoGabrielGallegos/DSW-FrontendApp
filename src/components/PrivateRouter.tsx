import { Navigate } from "react-router"
import { isAuthenticated } from "../utils/auth.ts"

export function PrivateRoute({ children, redirectTo = "/login" }: { children?: any, redirectTo: string }) {
    return isAuthenticated() ? children : <Navigate to={redirectTo} />
}