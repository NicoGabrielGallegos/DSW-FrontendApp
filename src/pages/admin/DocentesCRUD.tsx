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

export default function DocentesCRUD() {
    const [docentes, setDocentes] = useState<Docente[]>([])
    const [error, setError] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(0)
    const [count, setCount] = useState(1)

    async function fetchDocentes() {
        console.log(page, count);

        try {
            let params: { p?: string, l?: string } = {}
            let page = searchParams.get("p")
            if (page) params.p = page
            let limit = searchParams.get("l")
            if (limit) params.l = limit

            const res = await apiClient.get(API_ROUTES.DOCENTES.FIND_ALL, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, params })
            setDocentes(res.data)
            setCount(res.total)
        } catch (err: any) {
            setError(err.message)
        }
    }

    async function createDocente() {
        const body = {
            legajo: (document.getElementById("legajo") as HTMLInputElement).value,
            nombre: (document.getElementById("nombre") as HTMLInputElement).value,
            apellido: (document.getElementById("apellido") as HTMLInputElement).value,
            correo: (document.getElementById("correo") as HTMLInputElement).value
        }

        if (!body.legajo || !body.nombre || !body.apellido || !body.correo) return
        try {
            const res = await apiClient.post(API_ROUTES.DOCENTES.ADD, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, body })
            console.log(res.message);
            setError(null)
        } catch (err: any) {
            setError(err.message)
            throw err
        } finally {
            fetchDocentes()
        }
    }

    async function deleteDocente(id: string) {
        try {
            const res = await apiClient.delete(API_ROUTES.DOCENTES.DELETE(id), { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
        } catch (err: any) {
            setError(err.message)
            throw err
        } finally {
            fetchDocentes()
        }
    }

    useEffect(() => {
        searchParams.set("p", "1")
        searchParams.set("l", "10")
        fetchDocentes()
    }, [])

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
        searchParams.set("p", (newPage + 1).toString())
        setSearchParams(searchParams)
        fetchDocentes()
    };

    const handleChangeLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLimit(parseInt(event.target.value));
        setPage(0);
        searchParams.set("l", event.target.value)
        setSearchParams(searchParams)
        fetchDocentes()
    };

    return (
        <>
            {error}
            <TableContainer component={Paper}>
                <Table size={"small"}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Lejago</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Apellido</TableCell>
                            <TableCell>Correo</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {docentes.map((docente, idx) => {
                            return (
                                <TableRow key={idx}>
                                    <TableCell><Typography variant="subtitle2">{docente._id}</Typography></TableCell>
                                    <TableCell>{docente.legajo}</TableCell>
                                    <TableCell>{docente.nombre}</TableCell>
                                    <TableCell>{docente.apellido}</TableCell>
                                    <TableCell>{docente.correo}</TableCell>
                                    <TableCell>
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
        </>
    )
}