import { useEffect, useState } from "react"
import type { Materia } from "../../types/Materia.ts"
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

export default function MateriasCRUD() {
    const [materias, setMaterias] = useState<Materia[]>([])
    const [message, setMessage] = useState<string | null>(null)
    const [severity, setSeverity] = useState<"success" | "error">("success")
    const [searchParams, setSearchParams] = useSearchParams()
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(0)
    const [count, setCount] = useState(1)

    async function fetchMaterias() {
        console.log(page, count);

        try {
            let params: { p?: string, l?: string } = {}
            let page = searchParams.get("p")
            if (page) params.p = page
            let limit = searchParams.get("l")
            if (limit) params.l = limit

            const res = await apiClient.get(API_ROUTES.MATERIAS.FIND_ALL, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, params })
            setMaterias(res.data)
            setCount(res.total)
        } catch (err: any) {
            setMessage(err.message)
            setSeverity("error")
        }
    }

    async function createMateria() {
        const body = { descripcion: (document.getElementById("descripcion") as HTMLInputElement).value }

        if (!body.descripcion) {
            setMessage("Campos incompletos: descripcion")
            setSeverity("error")
            return
        }
        try {
            const res = await apiClient.post(API_ROUTES.MATERIAS.ADD, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, body })
            setMessage(`${res.message}: ${res.data.descripcion}`)
            setSeverity("success")
        } catch (err: any) {
            setMessage(err.message)
            setSeverity("error")
        } finally {
            fetchMaterias();
        }
    }

    async function deleteMateria(id: string) {
        try {
            const res = await apiClient.delete(API_ROUTES.MATERIAS.DELETE(id), { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
            setMessage(`${res.message}: ${res.data.descripcion}`)
            setSeverity("success")
        } catch (err: any) {
            setMessage(err.message)
            setSeverity("error")
        } finally {
            fetchMaterias()
        }
    }

    useEffect(() => {
        searchParams.set("p", "1")
        searchParams.set("l", "10")
        fetchMaterias()
    }, [])

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
        searchParams.set("p", (newPage + 1).toString())
        setSearchParams(searchParams, {replace: true})
        fetchMaterias()
    };

    const handleChangeLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLimit(parseInt(event.target.value));
        setPage(0);
        searchParams.set("l", event.target.value)
        setSearchParams(searchParams, {replace: true})
        fetchMaterias()
    };

    return (
        <>
            {message && <Alert severity={severity} sx={{ mb: 2 }} onClose={() => setMessage(null)}>
                {message}
            </Alert>}
            <TableContainer component={Paper}>
                <Table size={"small"}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Descripcion</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {materias.map((materia, idx) => {
                            return (
                                <TableRow key={idx}>
                                    <TableCell><Typography variant="subtitle2">{materia._id}</Typography></TableCell>
                                    <TableCell>{materia.descripcion}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => deleteMateria(materia._id)} size="small"><Icon color="action">delete</Icon></IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                        <TableRow>
                            <TableCell><Typography variant="body2" color="textSecondary">autogenerado</Typography></TableCell>
                            <TableCell><TextField id="descripcion" variant="standard" size="small" fullWidth /></TableCell>
                            <TableCell>
                                <IconButton onClick={createMateria} size="small"><Icon color="primary">add</Icon></IconButton>
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