import { useEffect, useState } from "react"
import { EstadoConsulta, type Consulta as C } from "../../types/Consulta.ts"
import type { Dictado as D } from "../../types/Dictado.ts"
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
import ControlledAutocomplete from "../../components/shared/ControlledAutocomplete.tsx"
import LocalizedDateTimePicker from "../../components/shared/LocalizedDateTimePicker.tsx"

type Dictado = D<Docente, Materia>
type Consulta = C<Dictado>

export default function InscripcionesCRUD() {
    const [dictados, setDictados] = useState<Dictado[]>([])
    const [consultas, setConsultas] = useState<Consulta[]>([])
    const [message, setMessage] = useState<string | null>(null)
    const [severity, setSeverity] = useState<"success" | "error">("success")
    const [searchParams, setSearchParams] = useSearchParams()
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(0)
    const [count, setCount] = useState(1)
    // Variables para el selector de dictados
    const [valueDictado, setValueDictado] = useState<{ id: string, label: string } | null>(null)
    const [inputDictado, setInputDictado] = useState<string>("")
    // Variables para el selector de horaInicio
    const [valueHoraInicio, setValueHoraInicio] = useState<Date | null>(null)
    // Variables para el selector de horaFin
    const [valueHoraFin, setValueHoraFin] = useState<Date | null>(null)
    // Variables para el selector de estado
    const [valueEstado, setValueEstado] = useState<{ id: string, label: string } | null>(null)
    const [inputEstado, setInputEstado] = useState<string>("")

    async function fetchConsultas() {
        try {
            let params: { p?: string, l?: string, populate: string } = { populate: "docente,materia" }
            let page = searchParams.get("p")
            if (page) params.p = page
            let limit = searchParams.get("l")
            if (limit) params.l = limit

            const res = await apiClient.get(API_ROUTES.CONSULTAS.FIND_ALL, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, params })
            setConsultas(res.data)
            setCount(res.total)
        } catch (err: any) {
            setMessage(err.message)
            setSeverity("error")
        }
    }

    async function createConsulta() {
        const body = {
            dictado: valueDictado?.id,
            horaInicio: valueHoraInicio?.toISOString(),
            horaFin: valueHoraFin?.toISOString(),
            estado: valueEstado?.id,
        }

        if (!body.dictado || !body.horaInicio || !body.horaFin || !body.estado) {
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
            const res = await apiClient.post(API_ROUTES.CONSULTAS.ADD, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, params: { populate: "docente,materia" }, body })
            setMessage(`${res.message}: ${getLabelDictado(res.data.dictado)} @ ${getLabelHorario(res.data)}`)
            setSeverity("success")
        } catch (err: any) {
            setMessage(err.message)
            setSeverity("error")
        } finally {
            fetchConsultas()
        }
    }

    async function deleteConsulta(id: string) {
        try {
            const res = await apiClient.delete(API_ROUTES.CONSULTAS.DELETE(id), { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, params: { populate: "alumno,docente,materia" } })
            setMessage(`${res.message}: ${getLabelDictado(res.data.dictado)} @ ${getLabelHorario(res.data)}`)
            setSeverity("success")
        } catch (err: any) {
            setMessage(err.message)
            setSeverity("error")
            throw err
        } finally {
            fetchConsultas()
        }
    }

    useEffect(() => {
        searchParams.set("p", "1")
        searchParams.set("l", "10")
        fetchConsultas()
        fetchDictados()
    }, [])

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
        searchParams.set("p", (newPage + 1).toString())
        setSearchParams(searchParams, { replace: true })
        fetchConsultas()
    };

    const handleChangeLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLimit(parseInt(event.target.value));
        setPage(0);
        searchParams.set("l", event.target.value)
        setSearchParams(searchParams, { replace: true })
        fetchConsultas()
    };

    async function fetchDictados() {
        try {
            const res = await apiClient.get(API_ROUTES.DICTADOS.FIND_ALL, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, params: { populate: "docente,materia" } })
            setDictados(res.data)
        } catch (err: any) {
            console.log(err.message)
            throw err
        }
    }


    const onSelectDictado = (_event: any, value: any) => {
        setValueDictado(value)
    }

    const onSelectHoraInicio = (value: Date | null) => {
        setValueHoraInicio(value)
    }

    const onSelectHoraFin = (value: Date | null) => {
        setValueHoraFin(value)
    }

    const onSelectEstado = (_event: any, value: any) => {
        setValueEstado(value)
    }

    const getNombreDocente = (docente: Docente) => {
        return docente ? `${docente.apellido} ${docente.nombre}` : ""
    }

    const getNombreMateria = (materia: Materia) => {
        return materia ? materia.descripcion : ""
    }

    const getFecha = (consulta: Consulta) => {
        let horaInicio = new Date(consulta.horaInicio)
        return horaInicio ? `${horaInicio.dateString()}` : ""
    }

    const getHoraInicio = (consulta: Consulta) => {
        let horaInicio = new Date(consulta.horaInicio)
        return horaInicio ? `${horaInicio.timeString()}` : ""
    }

    const getHoraFin = (consulta: Consulta) => {
        let horaFin = new Date(consulta.horaFin)
        return horaFin ? `${horaFin.timeString()}` : ""
    }

    const getLabelDictado = (dictado: Dictado) => {
        return dictado ? `[${getNombreDocente(dictado.docente)} & ${getNombreMateria(dictado.materia)}]` : ""
    }

    const getLabelHorario = (consulta: Consulta) => {
        return consulta ? `[${getFecha(consulta)}, ${getHoraInicio(consulta)} - ${getHoraFin(consulta)}]` : ""
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
                            <TableCell>Dictado</TableCell>
                            <TableCell>Hora de Inicio</TableCell>
                            <TableCell>Hora de Fin</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {consultas.map((consulta, idx) => {
                            return (
                                <TableRow key={idx}>
                                    <TableCell><Typography variant="subtitle2">{consulta._id}</Typography></TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontSize={10} color="textSecondary">{consulta.dictado._id}</Typography>
                                        <Typography variant="body2">{getLabelDictado(consulta.dictado)}</Typography>
                                    </TableCell>
                                    <TableCell>{new Date(consulta.horaInicio).fullString()}</TableCell>
                                    <TableCell>{new Date(consulta.horaFin).fullString()}</TableCell>
                                    <TableCell>{consulta.estado}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => deleteConsulta(consulta._id)} size="small"><Icon color="action">delete</Icon></IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                        <TableRow>
                            <TableCell><Typography variant="body2" color="textSecondary">autogenerado</Typography></TableCell>
                            <TableCell>
                                <ControlledAutocomplete
                                    id="dictado"
                                    options={dictados.map(dictado => { return { id: dictado._id, label: getLabelDictado(dictado) } })}
                                    value={valueDictado}
                                    onChange={onSelectDictado}
                                    inputValue={inputDictado}
                                    onInputChange={(_event: any, newInputValue: any) => {
                                        setInputDictado(newInputValue);
                                    }}
                                    variant="standard"
                                />
                            </TableCell>
                            <TableCell>
                                <LocalizedDateTimePicker
                                    value={valueHoraInicio}
                                    onChange={onSelectHoraInicio}
                                    clearable
                                    variant="standard"
                                    sx={{maxWidth: 230}}
                                />
                            </TableCell>
                            <TableCell>
                                <LocalizedDateTimePicker
                                    value={valueHoraFin}
                                    onChange={onSelectHoraFin}
                                    clearable
                                    variant="standard"
                                    sx={{maxWidth: 230}}
                                />
                            </TableCell>
                            <TableCell>
                                <ControlledAutocomplete
                                    id="estado"
                                    options={Object.keys(EstadoConsulta).map(estado => { return { id: estado, label: EstadoConsulta[estado as keyof typeof EstadoConsulta]} })}
                                    value={valueEstado}
                                    onChange={onSelectEstado}
                                    inputValue={inputEstado}
                                    onInputChange={(_event: any, newInputValue: any) => {
                                        setInputEstado(newInputValue);
                                    }}
                                    variant="standard"
                                    sx={{minWidth: 150}}
                                />
                            </TableCell>
                            <TableCell>
                                <IconButton onClick={createConsulta} size="small"><Icon color="primary">add</Icon></IconButton>
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