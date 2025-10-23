import Typography from "@mui/material/Typography"
import { useEffect, useState } from "react"
import Grid from "@mui/material/Grid"
import Table from "@mui/material/Table"
import TableContainer from "@mui/material/TableContainer"
import TableRow from "@mui/material/TableRow"
import TableHead from "@mui/material/TableHead"
import TableCell from "@mui/material/TableCell"
import Paper from "@mui/material/Paper"
import TableBody from "@mui/material/TableBody"
import TablePagination from "@mui/material/TablePagination"
import { useNavigate, useParams, useSearchParams } from "react-router"
import { API_ROUTES } from "../api/endpoints.ts"
import { apiClient } from "../api/apiClient.ts"
import type { Alumno } from "../types/Alumno.ts"
import TableSortLabel from "@mui/material/TableSortLabel"
import type { Docente } from "../types/Docente.ts"
import type { Materia } from "../types/Materia.ts"
import type { Dictado as D } from "../types/Dictado.ts"
import type { Consulta as C } from "../types/Consulta.ts"
import Button from "@mui/material/Button"
import Icon from "@mui/material/Icon"
import Box from "@mui/material/Box"
import { ROUTES } from "../utils/routes.ts"
import NavBar from "../components/shared/NavBar.tsx"
import { useAuth } from "../context/AuthContext.tsx"

type Dictado = D<Docente, Materia>
type Consulta = C<Dictado>

export default function Consulta() {
    // Colección de alumnos
    const idConsulta = useParams<{ id: string }>()?.id || ""
    const [consulta, setConsulta] = useState<Consulta | null>(null)
    const [alumnos, setAlumnos] = useState<Alumno[]>([])
    // Variables de control sobre cargas y errores
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    // Parámetros en la URL
    const [searchParams, setSearchParams] = useSearchParams()
    // Hook para navegar
    const navigate = useNavigate()
    // Paginación
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(0)
    const [count, setCount] = useState(1)
    // Sorting
    const [sort, setSort] = useState<"asc" | "desc">("asc")
    const [sortBy, setSortBy] = useState<string>("Legajo")
    let limitOptions = [5, 10, 15, 20, 25]
    // Auth
    const auth = useAuth()

    function setVariablesFromParams() {
        let page: number
        try {
            page = parseInt(searchParams.get("p")?.toString() || "") || 1
            setPage(page < 1 ? 0 : page - 1)
        } catch (err) {
            setPage(0)
        }

        let limit: number
        try {
            limit = parseInt(searchParams.get("l")?.toString() || "") || 0
            setLimit(limit < 0 || !limitOptions.includes(limit) ? 5 : limit)
        } catch (err) {
            setLimit(5)
        }
    }

    async function fetchConsulta() {
        try {
            const res = await apiClient.get(API_ROUTES.CONSULTAS.FIND_ONE(idConsulta), { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, params: { populate: "docente,materia" } })
            if (auth.user?.rol !== "administrador" && res.data.dictado.docente._id && res.data.dictado.docente._id !== auth.user?.id) {
                navigate(ROUTES.CONSULTAS, { replace: true })
            }

            setConsulta(res.data)
        } catch (err: any) {
            setError(err.message)
        }
    }

    async function fetchAlumnos() {
        try {
            let params: { p?: string, l?: string, sort?: string } = {}
            let page = searchParams.get("p")
            if (page) params.p = page
            let limit = searchParams.get("l")
            if (limit) params.l = limit
            let sort = searchParams.get("sort")
            if (sort) params.sort = sort

            const resAlumnos = await apiClient.get(API_ROUTES.ALUMNOS.FIND_BY_CONSULTA(idConsulta), { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, params })
            setAlumnos(resAlumnos.data)
            setCount(resAlumnos.total)
        } catch (err: any) {
            setError(err.message)
        }
    }

    useEffect(() => {
        async function initPage() {
            setVariablesFromParams()
            searchParams.set("p", (page + 1).toString())
            searchParams.set("l", limit.toString())
            setSearchParams(searchParams, { replace: true })
            await fetchConsulta()
            await fetchAlumnos()
            setLoading(false)
        }
        initPage()
    }, [])

    useEffect(() => {
        const sortParam = searchParams.get("sort")?.toString().split(",")[0] || "nombre:asc"
        const [field, order] = sortParam.split(":")

        if (field) setSortBy(field)
        if (order === "desc") setSort(order); else setSort("asc")

        fetchAlumnos()
    }, [searchParams])

    useEffect(() => {
        searchParams.set("sort", `${sortBy.toLowerCase()}:${sort}`)
        setSearchParams(searchParams, { replace: true })
    }, [sort, sortBy])

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
        searchParams.set("p", (newPage + 1).toString())
        setSearchParams(searchParams, { replace: true })
        fetchAlumnos()
    };

    const handleChangeLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLimit(parseInt(event.target.value));
        setPage(0);
        searchParams.set("l", event.target.value)
        setSearchParams(searchParams, { replace: true })
        fetchAlumnos()
    };

    const handleSort = (text: string) => {
        let newSort: "asc" | "desc"

        setSortBy(prevText => {
            prevText
            return text
        })

        if (sortBy === text) {
            newSort = sort === "asc" ? "desc" : "asc"
        } else {
            newSort = "asc"
        }
        setSort(newSort)
    }

    let datosConsulta = <></>

    if (loading) {
        datosConsulta = <></>
    } else if (consulta) {
        datosConsulta =
            <>
                <Typography variant="h5" mb={1} mt={2} textAlign={"left"}>Datos de la consulta</Typography>
                <Typography color="textSecondary" align="left" mb={1} mr={{ xs: 2 }}>
                    Materia: <Typography color="textPrimary" component="span" fontSize="inherit">{consulta?.dictado.materia.descripcion || ""}</Typography>
                </Typography>
                <Typography color="textSecondary" align="left" mb={1} mr={{ xs: 2 }}>
                    Docente: <Typography color="textPrimary" component="span" fontSize="inherit">{consulta?.dictado.docente.apellido || ""} {consulta?.dictado.docente.nombre || ""}</Typography>
                </Typography>

                <Typography color="textSecondary" align="left" mb={1} mr={{ xs: 2 }}>
                    Fecha: <Typography color="textPrimary" component="span" fontSize="inherit">{new Date(consulta?.horaInicio || 0).dateString()}</Typography>
                </Typography>
                <Typography color="textSecondary" align="left" mb={1} mr={{ xs: 2 }}>
                    Horario: <Typography color="textPrimary" component="span" fontSize="inherit">{new Date(consulta?.horaInicio || 0).timeString()} - {new Date(consulta?.horaFin || 0).timeString()}</Typography>
                </Typography>
            </>
    }

    let alumnosInscriptos = <></>

    if (loading) {
        alumnosInscriptos = <></>
    } else if (error) {
        alumnosInscriptos = <Typography variant="body1">{error}</Typography>
    } else if (alumnos.length === 0) {
        alumnosInscriptos = <>
            <Typography variant="h5" mt={2} mb={1} textAlign={"left"}>Alumnos inscriptos</Typography>
            <Typography variant="body1" textAlign={"left"}>Todavía no hay alumnos inscriptos</Typography>
        </>
    } else {
        alumnosInscriptos = <>
            <Typography variant="h5" mt={2} mb={1} textAlign={"left"}>Alumnos inscriptos</Typography>
            <Grid container sx={{ alignItems: "center", justifyContent: "right" }}>
                <TableContainer component={Paper}>
                    <Table size={"small"}>
                        <TableHead>
                            <TableRow>
                                {["Legajo", "Nombre", "Apellido", "Correo"].map((text, idx) => {
                                    return (
                                        <TableCell sortDirection={"asc"} key={idx}>
                                            <TableSortLabel
                                                active={sortBy === text.toLowerCase()}
                                                direction={sortBy === text.toLowerCase() ? sort : "asc"}
                                                onClick={() => handleSort(text.toLowerCase())}
                                                sx={{ fontSize: { xs: "0.8rem", md: "1rem" } }}
                                            >
                                                {text}
                                            </TableSortLabel>
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {alumnos.map((alumno, idx) => {
                                return (
                                    <TableRow key={idx}>
                                        <TableCell>{alumno.legajo}</TableCell>
                                        <TableCell>{alumno.nombre}</TableCell>
                                        <TableCell>{alumno.apellido}</TableCell>
                                        <TableCell>{alumno.correo}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={limitOptions}
                    component="div"
                    count={count}
                    rowsPerPage={limit}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeLimit}
                />
            </Grid>
        </>
    }



    return (
        <>
            <NavBar>Consulta</NavBar>
            <Box
                component="main"
                sx={{ flexGrow: 1, px: 2 }}
            >
                <Box display={"flex"}>
                    <Button variant="text" startIcon={<Icon>arrow_back</Icon>} onClick={() => navigate(ROUTES.CONSULTAS)}>Volver</Button>
                </Box>
                {datosConsulta}
                {alumnosInscriptos}
            </Box>
        </>
    )
}