import { useEffect, useState } from "react"
import type { Dictado } from "../../types/Dictado.ts"
import type { Docente } from "../../types/Docente.ts"
import type { Materia } from "../../types/Materia.ts"
import { API_ROUTES } from "../../api/endpoints.ts"
import { useSearchParams } from "react-router"
import { apiClient } from "../../api/apiClient.ts"
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
import ControlledAutocomplete from "../../components/ControlledAutocomplete.tsx"

export default function DictadosCRUD() {
    const [dictados, setDictados] = useState<Dictado[]>([])
    const [docentes, setDocentes] = useState<Docente[]>([])
    const [materias, setMaterias] = useState<Materia[]>([])
    const [message, setMessage] = useState<string | null>(null)
    const [severity, setSeverity] = useState<"success" | "error">("success")
    const [searchParams, setSearchParams] = useSearchParams()
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(0)
    const [count, setCount] = useState(1)
    // Variables para el selector de docente
    const [valueDocente, setValueDocente] = useState<{ id: string, label: string } | null>(null)
    const [inputDocente, setInputDocente] = useState<string>("")
    // Variables para el selector de materia
    const [valueMateria, setValueMateria] = useState<{ id: string, label: string } | null>(null)
    const [inputMateria, setInputMateria] = useState<string>("")

    async function fetchDictados() {
        console.log(page, count);

        try {
            let params: { p?: string, l?: string } = {}
            let page = searchParams.get("p")
            if (page) params.p = page
            let limit = searchParams.get("l")
            if (limit) params.l = limit

            const res = await apiClient.get(API_ROUTES.DICTADOS.FIND_ALL, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, params })
            setDictados(res.data)
            setCount(res.total)
        } catch (err: any) {
            setMessage(err.message)
            setSeverity("error")
        }
    }

    async function createDictado() {
        const body = {
            docente: valueDocente?.id,
            materia: valueMateria?.id,
        }

        if (!body.docente || !body.materia) {
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
            const res = await apiClient.post(API_ROUTES.DICTADOS.ADD, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, body })
            setMessage(`${res.message}: ${getNombreDocente(res.data.docente)} -> ${getNombreMateria(res.data.materia)}`)
            setSeverity("success")
        } catch (err: any) {
            setMessage(err.message)
            setSeverity("error")
        } finally {
            fetchDictados()
        }
    }

    async function deleteDictado(id: string) {
        try {
            const res = await apiClient.delete(API_ROUTES.DICTADOS.DELETE(id), { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
            setMessage(`${res.message}: ${getNombreDocente(res.data.docente)} -> ${getNombreMateria(res.data.materia)}`)
            setSeverity("success")
        } catch (err: any) {
            setMessage(err.message)
            setSeverity("error")
            throw err
        } finally {
            fetchDictados()
        }
    }

    useEffect(() => {
        searchParams.set("p", "1")
        searchParams.set("l", "10")
        fetchDictados()
        fetchDocentes()
        fetchMaterias()
    }, [])

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
        searchParams.set("p", (newPage + 1).toString())
        setSearchParams(searchParams, { replace: true })
        fetchDictados()
    };

    const handleChangeLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLimit(parseInt(event.target.value));
        setPage(0);
        searchParams.set("l", event.target.value)
        setSearchParams(searchParams, { replace: true })
        fetchDictados()
    };

    async function fetchDocentes() {
        try {
            const res = await apiClient.get(API_ROUTES.DOCENTES.FIND_ALL, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
            setDocentes(res.data)
        } catch (err: any) {
            console.log(err.message)
            throw err
        }
    }

    async function fetchMaterias() {
        try {
            const res = await apiClient.get(API_ROUTES.MATERIAS.FIND_ALL, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
            setMaterias(res.data)
        } catch (err: any) {
            console.log(err.message)
            throw err
        }
    }

    const onSelectDocente = (_event: any, value: any) => {
        setValueDocente(value)

    }

    const onSelectMateria = (_event: any, value: any) => {
        setValueMateria(value)
    }

    const getNombreDocente = (id :string) => {
        let docente = docentes.find(docente => docente._id === id)
        return docente ? `${docente.apellido} ${docente.nombre}` : ""
    }

    const getNombreMateria = (id: string) => {
        let materia = materias.find(materia => materia._id === id)
        return materia ? materia.descripcion : ""
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
                            <TableCell>Id</TableCell>
                            <TableCell>Docente</TableCell>
                            <TableCell>Materia</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dictados.map((dictado, idx) => {
                            return (
                                <TableRow key={idx}>
                                    <TableCell><Typography variant="subtitle2">{dictado._id}</Typography></TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{getNombreDocente(dictado.docente)}</Typography>
                                        <Typography variant="body2" fontSize={10} color="textSecondary">{dictado.docente}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{getNombreMateria(dictado.materia)}</Typography>
                                        <Typography variant="body2" fontSize={10} color="textSecondary">{dictado.materia}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => deleteDictado(dictado._id)} size="small"><Icon color="action">delete</Icon></IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                        <TableRow>
                            <TableCell><Typography variant="body2" color="textSecondary">autogenerado</Typography></TableCell>
                            <TableCell>
                                <ControlledAutocomplete
                                    id="docente"
                                    options={docentes.map(docente => { return { id: docente._id, label: `${docente.apellido} ${docente.nombre}` } })}
                                    value={valueDocente}
                                    onChange={onSelectDocente}
                                    inputValue={inputDocente}
                                    onInputChange={(_event: any, newInputValue: any) => {
                                        setInputDocente(newInputValue);
                                    }}
                                    variant="standard"
                                />
                            </TableCell>
                            <TableCell>
                                <ControlledAutocomplete
                                    id="materia"
                                    options={materias.map(materia => { return { id: materia._id, label: materia.descripcion } })}
                                    value={valueMateria}
                                    onChange={onSelectMateria}
                                    inputValue={inputMateria}
                                    onInputChange={(_event: any, newInputValue: any) => {
                                        setInputMateria(newInputValue);
                                    }}
                                    variant="standard"
                                />
                            </TableCell>
                            <TableCell>
                                <IconButton onClick={createDictado} size="small"><Icon color="primary">add</Icon></IconButton>
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