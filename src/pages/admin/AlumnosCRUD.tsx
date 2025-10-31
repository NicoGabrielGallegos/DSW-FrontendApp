import { useEffect, useState } from "react"
import type { Alumno } from "../../types/Alumno.ts"
import { API_ROUTES } from "../../api/endpoints.ts"
import { useSearchParams } from "react-router"
import { apiClient } from "../../api/apiClient.ts"
import TextField from "@mui/material/TextField"
import IconButton from "@mui/material/IconButton"
import Icon from "@mui/material/Icon"
import Typography from "@mui/material/Typography"
import Table from "@mui/material/Table"
import TableContainer from "@mui/material/TableContainer"
import Paper from "@mui/material/Paper"
import TableHead from "@mui/material/TableHead"
import TableBody from "@mui/material/TableBody"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import TablePagination from "@mui/material/TablePagination"
import Alert from "@mui/material/Alert"
import TableSortLabel from "@mui/material/TableSortLabel"

export default function AlumnosCRUD() {
    const [alumnos, setAlumnos] = useState<Alumno[]>([])
    const [message, setMessage] = useState<string | null>(null)
    const [severity, setSeverity] = useState<"success" | "error">("success")
    const [searchParams, setSearchParams] = useSearchParams()
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(0)
    const [count, setCount] = useState(1)
    // Elemento seleccionado para editar
    const [selected, setSelected] = useState<Alumno | null>(null)
    // Sorting
    const [sort, setSort] = useState<"asc" | "desc">("asc")
    const [sortBy, setSortBy] = useState<string>("Legajo")

    async function fetchAlumnos() {
        try {
            let params: { p?: string, l?: string, sort?: string } = {}
            let page = searchParams.get("p")
            if (page) params.p = page
            let limit = searchParams.get("l")
            if (limit) params.l = limit
            let sort = searchParams.get("sort")
            if (sort) params.sort = sort

            const res = await apiClient.get(API_ROUTES.ALUMNOS.FIND_ALL, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, params })
            setAlumnos(res.data)
            setCount(res.total)
        } catch (err: any) {
            setMessage(err.message)
            setSeverity("error")
        }
    }

    async function createAlumno() {
        const body = {
            legajo: (document.getElementById("legajo") as HTMLInputElement).value.trim(),
            nombre: (document.getElementById("nombre") as HTMLInputElement).value.trim(),
            apellido: (document.getElementById("apellido") as HTMLInputElement).value.trim(),
            correo: (document.getElementById("correo") as HTMLInputElement).value.trim(),
            password: ""
        }
        body.password = `${body.nombre[0]}${body.apellido[0]}${body.legajo}`.toLowerCase()

        if (!body.legajo || !body.nombre || !body.apellido || !body.correo) {
            let err = "Campos incompletos: "
            Object.keys(body).forEach(key => {
                if (!body[key as keyof typeof body]) {
                    err += key + ", "
                }
            })
            setMessage(err.slice(0, -2))
            setSeverity("error")
            return
        }

        try {
            const res = await apiClient.post(API_ROUTES.ALUMNOS.ADD, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, body })
            setMessage(`${res.message}: ${res.data.legajo}, ${res.data.nombre} ${res.data.apellido}`)
            setSeverity("success")
        } catch (err: any) {
            setMessage(err.message)
            setSeverity("error")
        } finally {
            fetchAlumnos()
        }
    }

    async function deleteAlumno(id: string) {
        try {
            const res = await apiClient.delete(API_ROUTES.ALUMNOS.DELETE(id), { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
            setMessage(`${res.message}: ${res.data.legajo}, ${res.data.nombre} ${res.data.apellido}`)
            setSeverity("success")
        } catch (err: any) {
            setMessage(err.message)
            setSeverity("error")
            throw err
        } finally {
            fetchAlumnos()
        }
    }

    async function updateAlumno(id: string) {
        const body = {
            legajo: (document.getElementById("legajo") as HTMLInputElement).value,
            nombre: (document.getElementById("nombre") as HTMLInputElement).value,
            apellido: (document.getElementById("apellido") as HTMLInputElement).value,
            correo: (document.getElementById("correo") as HTMLInputElement).value,
        }

        if (!body.legajo || !body.nombre || !body.apellido || !body.correo) {
            let err = "Campos incompletos: "
            Object.keys(body).forEach(key => {
                if (!body[key as keyof typeof body]) {
                    err += key + ", "
                }
            })
            setMessage(err.slice(0, -2))
            setSeverity("error")
            return
        }

        try {
            const res = await apiClient.put(API_ROUTES.ALUMNOS.UPDATE(id), { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, body })
            setMessage(`${res.message}: ${res.data.legajo}, ${res.data.nombre} ${res.data.apellido}`)
            setSeverity("success")
            setSelected(null)
            fetchAlumnos()
        } catch (err: any) {
            setMessage(err.message)
            setSeverity("error")
        }
    }

    useEffect(() => {
        searchParams.set("p", "1")
        searchParams.set("l", "10")
        fetchAlumnos()
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
        setSelected(null)
        fetchAlumnos()
    };

    const handleChangeLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLimit(parseInt(event.target.value));
        setPage(0);
        searchParams.set("p", "1")
        searchParams.set("l", event.target.value)
        setSearchParams(searchParams, { replace: true })
        setSelected(null)
        fetchAlumnos()
    };

    function handleEdit(alumno: Alumno) {
        setSelected(alumno)
    }

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

    return (
        <>
            {message && <Alert severity={severity} sx={{ mb: 2 }} onClose={() => setMessage(null)}>
                {message}
            </Alert>}
            <TableContainer component={Paper}>
                <Table size={"small"}>
                    <TableHead>
                        <TableRow>
                            {["Id", "Legajo", "Nombre", "Apellido", "Correo"].map((text, idx) => {
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
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {alumnos.map((alumno, idx) => {
                            return (selected?._id === alumno._id
                                ?
                                <TableRow key={idx}>
                                    <TableCell><Typography variant="subtitle2">{alumno._id}</Typography></TableCell>
                                    <TableCell><TextField id="legajo" variant="standard" size="small" fullWidth defaultValue={alumno.legajo} /></TableCell>
                                    <TableCell><TextField id="nombre" variant="standard" size="small" fullWidth defaultValue={alumno.nombre} /></TableCell>
                                    <TableCell><TextField id="apellido" variant="standard" size="small" fullWidth defaultValue={alumno.apellido} /></TableCell>
                                    <TableCell><TextField id="correo" variant="standard" size="small" fullWidth defaultValue={alumno.correo} /></TableCell>
                                    <TableCell sx={{ minWidth: 100 }}>
                                        <IconButton onClick={() => updateAlumno(alumno._id)} size="small"><Icon color="success">done</Icon></IconButton>
                                        <IconButton onClick={() => setSelected(null)} size="small"><Icon color="error">close</Icon></IconButton>
                                    </TableCell>
                                </TableRow>
                                :
                                <TableRow key={idx}>
                                    <TableCell><Typography variant="subtitle2">{alumno._id}</Typography></TableCell>
                                    <TableCell>{alumno.legajo}</TableCell>
                                    <TableCell>{alumno.nombre}</TableCell>
                                    <TableCell>{alumno.apellido}</TableCell>
                                    <TableCell>{alumno.correo}</TableCell>
                                    <TableCell sx={{ minWidth: 100 }}>
                                        <IconButton onClick={() => handleEdit(alumno)} size="small"><Icon color="primary">edit</Icon></IconButton>
                                        <IconButton onClick={() => deleteAlumno(alumno._id)} size="small"><Icon color="action">delete</Icon></IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                        <TableRow>
                            <TableCell><Typography variant="body2" color="textSecondary">autogenerado</Typography></TableCell>
                            <TableCell><TextField id="legajo" variant="standard" size="small" fullWidth /></TableCell>
                            <TableCell><TextField id="nombre" variant="standard" size="small" fullWidth /></TableCell>
                            <TableCell><TextField id="apellido" variant="standard" size="small" fullWidth /></TableCell>
                            <TableCell><TextField id="correo" variant="standard" size="small" fullWidth /></TableCell>
                            <TableCell>
                                <IconButton onClick={createAlumno} size="small"><Icon color="primary">add</Icon></IconButton>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                labelRowsPerPage="Resultados por página:"
                labelDisplayedRows={({ from, to, count }) => {
                    return `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`;
                }}
                rowsPerPageOptions={[5, 10, 15, 20, 25]}
                component="div"
                count={count}
                rowsPerPage={limit}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeLimit}
            />
            <Typography fontSize={12}>
                * Al crear un nuevo alumno, la contraseña será asignada automáticamente tomando la primera letra del nombre, la primera letra del apellido y el legajo, ambas letras en minúsculas
            </Typography>
            <Typography fontSize={12}>
                Ej.: para el alumno "John Doe" con legajo "50444", la contraseña automática será "jd50444"
            </Typography>
        </>
    )
}