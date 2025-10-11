
async function request(endpoint: string, method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE", options: { body?: any, headers?: any, params?: any }) {
    if (!options.headers) options.headers = {}
    if (!options.params) options.params = {}

    // Crear URL normalizada
    const url = new URL(endpoint)

    // Agregar parámetros de query
    Object.keys(options.params).forEach((key) => url.searchParams.append(key, options.params[key]))

    // Headers
    const defaultHeaders = {
        "Content-Type": "application/json"
    }

    // Intentar recuperar los recursos
    try {
        const response = await fetch(url, {
            method,
            headers: { ...defaultHeaders, ...options.headers },
            body: options.body ? JSON.stringify(options.body) : undefined,
        })
        
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error desconocido")
        }

        return data
    } catch (err: any) {
        console.error("API Error:", err)
        throw err
    }
}

type OptionsType = { body?: {}, headers?: {}, params?: {} }

export const apiClient = {
    get: (endpoint: string, options: OptionsType = {}) => request(endpoint, "GET", { ...options }),
    post: (endpoint: string, options: OptionsType = {}) => request(endpoint, "POST", { ...options }),
    put: (endpoint: string, options: OptionsType = {}) => request(endpoint, "PUT", { ...options }),
    patch: (endpoint: string, options: OptionsType = {}) => request(endpoint, "PATCH", { ...options }),
    delete: (endpoint: string, options: OptionsType = {}) => request(endpoint, "DELETE", { ...options }),
}