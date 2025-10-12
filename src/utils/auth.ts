import { jwtDecode } from "jwt-decode"
import type { AuthTokenPayload } from "../types/AuthTokenPayload.ts"

export const decodeToken = (token: string) => {
    try {
        return jwtDecode<AuthTokenPayload>(token)
    } catch (err: any) {
        return null
    }
}