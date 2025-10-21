import { Navigate } from "react-router"
import { useAuth } from "../../context/AuthContext.tsx";
import { ROUTES } from "../../utils/routes.ts";
import type { Rol } from "../../types/User.ts";

export function PrivateRoute({ children, redirectTo = ROUTES.LOGIN, replace = true, authorizedRoles = ["alumno", "docente", "administrador"] }: { children?: any, redirectTo: string, replace?: boolean, authorizedRoles?: Rol[] }) {
    const auth = useAuth()
    console.log("Loading:", auth.isLoading());
    console.log("Auth:", auth.isAuthenticated());

    // Si está cargando, espera
    if (auth.isLoading()) return <></>

    // Si está autenticado y tiene permiso para acceder, accede
    if (auth.isAuthenticated() && authorizedRoles.includes(auth.user?.rol as Rol)) return children

    // Sino, es redirecionado
    return <Navigate to={redirectTo} replace={replace} />
}