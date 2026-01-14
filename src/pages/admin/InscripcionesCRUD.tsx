import { useEffect, useState } from "react"
import type { Inscripcion as I } from "../../types/Inscripcion.ts"
import type { Alumno } from "../../types/Alumno.ts"
import type { Consulta as C } from "../../types/Consulta.ts"
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

type Dictado = D<Docente, Materia>
type Consulta = C<Dictado>
type Inscripcion = I<Alumno, Consulta>

export default function InscripcionesCRUD() {
    const [inscripciones, setInscripciones] = useState<Inscripcion[]>([])
    const [alumnos, setAlumnos] = useState<Alumno[]>([])
    const [consultas, setConsultas] = useState<Consulta[]>([])
    const [message, setMessage] = useState<string | null>(null)
    const [severity, setSeverity] = useState<"success" | "error">("success")
    const [searchParams, setSearchParams] = useSearchParams()
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(0)
    const [count, setCount] = useState(1)
    // Variables para el selector de alumnos
    const [valueAlumno, setValueAlumno] = useState<{ id: string, label: string } | null>(null)
    const [inputAlumno, setInputAlumno] = useState<string>("")
    // Variables para el selector de consulta
    const [valueConsulta, setValueConsulta] = useState<{ id: string, label: string } | null>(null)
    const [inputConsulta, setInputConsulta] = useState<string>("")

    async function fetchInscripciones() {
        console.log(page, count);

        try {
            let params: { p?: string, l?: string, populate: string } = { populate: "alumno,docente,materia" }
            let page = searchParams.get("p")
            if (page) params.p = page
            let limit = searchParams.get("l")
            if (limit) params.l = limit

            const res = await apiClient.get(API_ROUTES.INSCRIPCIONES.FIND_ALL, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, params })
            setInscripciones(res.data)
            setCount(res.total)
        } catch (err: any) {
            setMessage(err.message)
            setSeverity("error")
        }
    }

    async function createInscripcion() {
        const body = {
            alumno: valueAlumno?.id,
            consulta: valueConsulta?.id,
        }

        if (!body.alumno || !body.consulta) {
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
            const res = await apiClient.post(API_ROUTES.INSCRIPCIONES.ADD, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, params: { populate: "alumno,docente,materia" }, body })
            setMessage(`${res.message}: ${getNombreAlumno(res.data.alumno)} -> ${getLabelConsulta(res.data.consulta)}`)
            setSeverity("success")
        } catch (err: any) {
            setMessage(err.message)
            setSeverity("error")
        } finally {
            fetchInscripciones()
        }
    }

    async function deleteInscripcion(id: string) {
        try {
            const res = await apiClient.delete(API_ROUTES.INSCRIPCIONES.DELETE(id), { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, params: { populate: "alumno,docente,materia" } })
            setMessage(`${res.message}: ${getNombreAlumno(res.data.alumno)} -> ${getLabelConsulta(res.data.consulta)}`)
            setSeverity("success")
        } catch (err: any) {
            setMessage(err.message)
            setSeverity("error")
            throw err
        } finally {
            fetchInscripciones()
        }
    }

    useEffect(() => {
        searchParams.set("p", "1")
        searchParams.set("l", "10")
        fetchInscripciones()
        fetchAlumnos()
        fetchConsultas()
    }, [])

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
        searchParams.set("p", (newPage + 1).toString())
        setSearchParams(searchParams, { replace: true })
        fetchInscripciones()
    };

    const handleChangeLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLimit(parseInt(event.target.value));
        setPage(0);
        searchParams.set("p", "1")
        searchParams.set("l", event.target.value)
        setSearchParams(searchParams, { replace: true })
        fetchInscripciones()
    };

    async function fetchAlumnos() {
        try {
            const res = await apiClient.get(API_ROUTES.ALUMNOS.FIND_ALL, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
            setAlumnos(res.data)
        } catch (err: any) {
            console.log(err.message)
            throw err
        }
    }

    async function fetchConsultas() {
        try {
            const res = await apiClient.get(API_ROUTES.CONSULTAS.FIND_ALL, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, params: { populate: "docente,materia" } })
            setConsultas(res.data)
        } catch (err: any) {
            console.log(err.message)
            throw err
        }
    }

    const onSelectAlumno = (_event: any, value: any) => {
        setValueAlumno(value)

    }

    const onSelectConsulta = (_event: any, value: any) => {
        setValueConsulta(value)
    }

    const getNombreAlumno = (alumno: Alumno) => {
        return alumno ? `${alumno.apellido} ${alumno.nombre}` : ""
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

    const getLabelConsulta = (consulta: Consulta) => {
        return consulta ?
            `[${getNombreDocente(consulta.dictado.docente)} & ${getNombreMateria(consulta.dictado.materia)}] @ [${getFecha(consulta)}, ${getHoraInicio(consulta)} - ${getHoraFin(consulta)}]`
            :
            ""
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
                            <TableCell>Alumno</TableCell>
                            <TableCell>Consulta</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {inscripciones.map((inscripcion, idx) => {
                            return (
                                <TableRow key={idx}>
                                    <TableCell>
                                        <Typography variant="body2" fontSize={10} color="textSecondary">{inscripcion.alumno._id}</Typography>
                                        <Typography variant="body2">{getNombreAlumno(inscripcion.alumno)}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontSize={10} color="textSecondary">{inscripcion.consulta._id}</Typography>
                                        <Typography variant="body2">{getLabelConsulta(inscripcion.consulta)}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => deleteInscripcion(inscripcion._id)} size="small"><Icon color="action">delete</Icon></IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                        <TableRow>
                            <TableCell>
                                <ControlledAutocomplete
                                    id="docente"
                                    options={alumnos.map(alumno => { return { id: alumno._id, label: getNombreAlumno(alumno) } })}
                                    value={valueAlumno}
                                    onChange={onSelectAlumno}
                                    inputValue={inputAlumno}
                                    onInputChange={(_event: any, newInputValue: any) => {
                                        setInputAlumno(newInputValue);
                                    }}
                                    variant="standard"
                                />
                            </TableCell>
                            <TableCell>
                                <ControlledAutocomplete
                                    id="materia"
                                    options={consultas.map(consulta => { return { id: consulta._id, label: getLabelConsulta(consulta) } })}
                                    value={valueConsulta}
                                    onChange={onSelectConsulta}
                                    inputValue={inputConsulta}
                                    onInputChange={(_event: any, newInputValue: any) => {
                                        setInputConsulta(newInputValue);
                                    }}
                                    variant="standard"
                                />
                            </TableCell>
                            <TableCell>
                                <IconButton onClick={createInscripcion} size="small"><Icon color="primary">add</Icon></IconButton>
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
        </>
    )
}