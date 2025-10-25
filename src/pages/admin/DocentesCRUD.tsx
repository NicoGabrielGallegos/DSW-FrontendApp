import { useEffect, useState } from "react"
import type { Docente } from "../../types/Docente.ts"
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

export default function DocentesCRUD() {
    const [docentes, setDocentes] = useState<Docente[]>([])
    const [message, setMessage] = useState<string | null>(null)
    const [severity, setSeverity] = useState<"success" | "error">("success")
    const [searchParams, setSearchParams] = useSearchParams()
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(0)
    const [count, setCount] = useState(1)
    // Elemento seleccionado para editar
    const [selected, setSelected] = useState<Docente | null>(null)
    // Sorting
    const [sort, setSort] = useState<"asc" | "desc">("asc")
    const [sortBy, setSortBy] = useState<string>("Legajo")

    async function fetchDocentes() {
        try {
            let params: { p?: string, l?: string, sort?: string } = {}
            let page = searchParams.get("p")
            if (page) params.p = page
            let limit = searchParams.get("l")
            if (limit) params.l = limit
            let sort = searchParams.get("sort")
            if (sort) params.sort = sort

            const res = await apiClient.get(API_ROUTES.DOCENTES.FIND_ALL, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, params })
            setDocentes(res.data)
            setCount(res.total)
        } catch (err: any) {
            setMessage(err.message)
            setSeverity("error")
        }
    }

    async function createDocente() {
        const body = {
            legajo: (document.getElementById("legajo") as HTMLInputElement).value,
            nombre: (document.getElementById("nombre") as HTMLInputElement).value,
            apellido: (document.getElementById("apellido") as HTMLInputElement).value,
            correo: (document.getElementById("correo") as HTMLInputElement).value,
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
            const res = await apiClient.post(API_ROUTES.DOCENTES.ADD, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, body })
            setMessage(`${res.message}: ${res.data.legajo}, ${res.data.nombre} ${res.data.apellido}`)
            setSeverity("success")
            fetchDocentes()
        } catch (err: any) {
            setMessage(err.message)
            setSeverity("error")
        }
    }

    async function deleteDocente(id: string) {
        try {
            const res = await apiClient.delete(API_ROUTES.DOCENTES.DELETE(id), { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
            setMessage(`${res.message}: ${res.data.legajo}, ${res.data.nombre} ${res.data.apellido}`)
            setSeverity("success")
            fetchDocentes()
        } catch (err: any) {
            setMessage(err.message)
            setSeverity("error")
            throw err
        }
    }

    async function updateDocente(id: string) {
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
            const res = await apiClient.put(API_ROUTES.DOCENTES.UPDATE(id), { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, body })
            setMessage(`${res.message}: ${res.data.legajo}, ${res.data.nombre} ${res.data.apellido}`)
            setSeverity("success")
            setSelected(null)
            fetchDocentes()
        } catch (err: any) {
            setMessage(err.message)
            setSeverity("error")
        }
    }

    useEffect(() => {
        searchParams.set("p", "1")
        searchParams.set("l", "10")
        fetchDocentes()
    }, [])

    useEffect(() => {
        const sortParam = searchParams.get("sort")?.toString().split(",")[0] || "nombre:asc"
        const [field, order] = sortParam.split(":")

        if (field) setSortBy(field)
        if (order === "desc") setSort(order); else setSort("asc")

        fetchDocentes()
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
        fetchDocentes()
    };

    const handleChangeLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLimit(parseInt(event.target.value));
        setPage(0);
        searchParams.set("l", event.target.value)
        setSearchParams(searchParams, { replace: true })
        setSelected(null)
        fetchDocentes()
    };

    function handleEdit(docente: Docente) {
        setSelected(docente)
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
                        {docentes.map((docente, idx) => {
                            return (selected?._id === docente._id
                                ?
                                <TableRow key={idx}>
                                    <TableCell><Typography variant="subtitle2">{docente._id}</Typography></TableCell>
                                    <TableCell><TextField id="legajo" variant="standard" size="small" fullWidth defaultValue={docente.legajo} /></TableCell>
                                    <TableCell><TextField id="nombre" variant="standard" size="small" fullWidth defaultValue={docente.nombre} /></TableCell>
                                    <TableCell><TextField id="apellido" variant="standard" size="small" fullWidth defaultValue={docente.apellido} /></TableCell>
                                    <TableCell><TextField id="correo" variant="standard" size="small" fullWidth defaultValue={docente.correo} /></TableCell>
                                    <TableCell sx={{minWidth: 100}}>
                                        <IconButton onClick={() => updateDocente(docente._id)} size="small"><Icon color="success">done</Icon></IconButton>
                                        <IconButton onClick={() => setSelected(null)} size="small"><Icon color="error">close</Icon></IconButton>
                                    </TableCell>
                                </TableRow>
                                :
                                <TableRow key={idx}>
                                    <TableCell><Typography variant="subtitle2">{docente._id}</Typography></TableCell>
                                    <TableCell>{docente.legajo}</TableCell>
                                    <TableCell>{docente.nombre}</TableCell>
                                    <TableCell>{docente.apellido}</TableCell>
                                    <TableCell>{docente.correo}</TableCell>
                                    <TableCell sx={{minWidth: 100}}>
                                        <IconButton onClick={() => handleEdit(docente)} size="small"><Icon color="primary">edit</Icon></IconButton>
                                        <IconButton onClick={() => deleteDocente(docente._id)} size="small"><Icon color="action">delete</Icon></IconButton>
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
                                <IconButton onClick={createDocente} size="small"><Icon color="primary">add</Icon></IconButton>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 15, 20, 25]}
                component="div"
                count={count}
                rowsPerPage={limit}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeLimit}
            />
            <Typography fontSize={12}>
                * Al crear un nuevo docente, la contraseña será asignada automáticamente tomando la primera letra del nombre, la primera letra del apellido y el legajo, ambas letras en minúsculas
            </Typography>
            <Typography fontSize={12}>
                Ej.: para el docente "Adrían Meca" con legajo "61555", la contraseña automática será "am61555"
            </Typography>
            <Typography fontSize={12}>
                Ej.: para el docente "Joel Arnold" con legajo "61444", la contraseña automática será "ja61444"
            </Typography>
        </>
    )
}