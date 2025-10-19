import Grid from "@mui/material/Grid";
import ResponsiveDrawer from "../components/ResponsiveDrawer.tsx";
import { useEffect, useState } from "react";
import { apiClient } from "../api/apiClient.ts";
import { API_ROUTES } from "../api/endpoints.ts";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import type { Materia } from "../types/Materia.ts";
import type { Docente } from "../types/Docente.ts";
import { useSearchParams } from "react-router";
import type { Consulta as C } from "../types/Consulta.ts";
import LocalizedDatePicker from "../components/LocalizedDatePicker.tsx";
import ControlledAutocomplete from "../components/ControlledAutocomplete.tsx";
import TablePagination from "@mui/material/TablePagination";
import type { Dictado } from "../types/Dictado.ts";
import ConsultaCard, { ConsultaCardSkeleton } from "../components/ConsultaCard.tsx";
import ConsultaInscripcionModal from "../components/ConsultaInscripcionModal.tsx";
import { decodeToken } from "../utils/auth.ts";
import LocalizedTimePicker from "../components/LocalizedTimePicker.tsx";

type Consulta = C<Dictado<Docente, Materia>>

export default function Materias() {
    // Colecciones de materias, docentes y consultas
    const [materias, setMaterias] = useState<Materia[]>([])
    const [docentes, setDocentes] = useState<Docente[]>([])
    const [consultas, setConsultas] = useState<Consulta[]>([])
    // Variables para el selector de docente
    const [valueDocente, setValueDocente] = useState<{ id: string, label: string } | null>(null)
    const [inputDocente, setInputDocente] = useState<string>("")
    // Variables para el selector de materia
    const [valueMateria, setValueMateria] = useState<{ id: string, label: string } | null>(null)
    const [inputMateria, setInputMateria] = useState<string>("")
    // Variables para los selectores de fecha y hora
    const [valueFecha, setValueFecha] = useState<Date | null>(null)
    const [valueHoraInicio, setValueHoraInicio] = useState<Date | null>(null)
    const [valueHoraFin, setValueHoraFin] = useState<Date | null>(null)
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    // Variables de control sobre cargas y errores
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    // Variables para el modal de inscripcion
    const [openInscripcionModal, setOpenInscripcionModal] = useState(false);
    const [inscripcionModalData, setInscripcionModalData] = useState<{ consulta?: Consulta, materia?: Materia, docente?: Docente }>({})
    const [doneInscripcion, setDoneInscripcion] = useState(false)
    const [alert, setAlert] = useState<{ message?: string, severity?: "error" | "success" }>({})
    // Hook para utilizar parámetros desde la URL
    const [searchParams, setSearchParams] = useSearchParams()
    // Variables para la paginación
    const [limit, setLimit] = useState(5)
    const [page, setPage] = useState(0)
    const [count, setCount] = useState(1)
    let limitOptions = [5, 10, 15, 20, 25]

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

    async function fetchDocentes() {
        try {
            let materia = searchParams.get("materia") || ""
            let route: string
            if (materia === "") {
                route = API_ROUTES.DOCENTES.FIND_ALL
            } else {
                route = API_ROUTES.DOCENTES.FIND_BY_MATERIA(materia)
            }
            const res = await apiClient.get(route, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
            res.data.sort((a: Docente, b: Docente) => `${a.apellido} ${a.nombre}` < `${b.apellido} ${b.nombre}` ? -1 : 1)
            setDocentes(res.data)
            if (!valueDocente) setValueDocente(() => {
                let docente = res.data.find((docente: Docente) => docente._id === searchParams.get("docente"))
                if (!docente) return null
                return { id: docente._id, label: `${docente.apellido} ${docente.nombre}` }
            })
        } catch (err: any) {
            setError(err.message)
        }
    }

    async function fetchMaterias() {
        try {
            let docente = searchParams.get("docente") || ""
            let route: string
            if (docente === "") {
                route = API_ROUTES.MATERIAS.FIND_ALL
            } else {
                route = API_ROUTES.MATERIAS.FIND_BY_DOCENTE(docente)
            }
            const res = await apiClient.get(route, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
            setMaterias(res.data)
            if (!valueMateria) setValueMateria(() => {
                let materia = res.data.find((materia: Materia) => materia._id === searchParams.get("materia"))
                if (!materia) return null
                return { id: materia._id, label: materia.descripcion }
            })
        } catch (err: any) {
            setError(err.message)
        }
    }

    async function fetchConsultas() {
        try {
            setError(null)
            let docente = searchParams.get("docente") || ""
            let materia = searchParams.get("materia") || ""
            let route: string
            if (docente !== "" && materia !== "") {
                const dictado: Dictado<string, string> | undefined = (await apiClient.get(API_ROUTES.DICTADOS.FIND_ONE_BY_DOCENTE_AND_MATERIA(docente, materia), { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })).data

                if (!dictado) {
                    setError("No existe el dictado seleccionado")
                    setConsultas([])
                    return
                }
                route = API_ROUTES.CONSULTAS.FIND_BY_DICTADO(dictado._id)
            } else if (docente !== "") {
                route = API_ROUTES.CONSULTAS.FIND_BY_DOCENTE(docente)
            } else if (materia !== "") {
                route = API_ROUTES.CONSULTAS.FIND_BY_MATERIA(materia)
            } else {
                route = API_ROUTES.CONSULTAS.FIND_ALL
            }

            let params: { p?: string, l?: string, i?: string, f?: string, populate: string } = { populate: "docente,materia" }
            let page = searchParams.get("p")
            if (page) params.p = page
            let limit = searchParams.get("l")
            if (limit) params.l = limit
            let horaInicio = searchParams.get("i")
            if (horaInicio) params.i = horaInicio
            let horaFin = searchParams.get("f")
            if (horaFin) params.f = horaFin

            const res = await apiClient.get(route, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, params })

            setConsultas(res.data)
            setCount(res.total)
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
            await fetchMaterias()
            await fetchDocentes()
            setLoading(false)
        }
        initPage()
    }, [])

    useEffect(() => {
        async function reloadMaterias() {
            await fetchMaterias()
            await fetchConsultas()
        }
        reloadMaterias()
    }, [valueDocente])

    useEffect(() => {
        async function reloadDocentes() {
            await fetchDocentes()
            await fetchConsultas()
        }
        reloadDocentes()
    }, [valueMateria])

    useEffect(() => {
        async function reloadConsultas() {
            await fetchConsultas()
        }

        if (valueFecha && valueHoraInicio && valueHoraFin) {
            let fecha = new Date(valueFecha)

            // Armar la fecha y hora de inicio
            let { horaInicio, minutoInicio } = { horaInicio: valueHoraInicio.getHours(), minutoInicio: valueHoraInicio.getMinutes() }
            fecha.setHours(horaInicio, minutoInicio, 0, 0)
            searchParams.set("i", fecha.toISOString())

            // Armar la fecha y hora de fin
            let { horaFin, minutoFin } = { horaFin: valueHoraFin.getHours(), minutoFin: valueHoraFin.getMinutes() }
            fecha.setHours(horaFin, minutoFin, 0, 0)
            if (horaFin === 0 && minutoFin === 0) {
                fecha = fecha.addDays(1)
            }
            searchParams.set("f", fecha.toISOString())
        } else {
            searchParams.delete("i")
            searchParams.delete("f")
        }
        setSearchParams(searchParams, { replace: true })

        reloadConsultas()
    }, [valueFecha, valueHoraInicio, valueHoraFin])

    const onSelectDocente = (_event: any, value: { id: string, label: string }) => {
        if (value) {
            searchParams.set("docente", value.id)
        } else {
            searchParams.delete("docente")
        }
        if (value !== valueDocente) setValueDocente(value)
        setSearchParams(searchParams, { replace: true })
    }

    const onSelectMateria = (_event: any, value: { id: string, label: string }) => {
        if (value) {
            searchParams.set("materia", value.id)
        } else {
            searchParams.delete("materia")
        }
        if (value !== valueMateria) setValueMateria(value)
        setSearchParams(searchParams)
    }

    const onSelectFecha = (value: Date | null) => {
        setValueFecha(value)
        if (value) {
            if (!valueHoraInicio) setValueHoraInicio(new Date(hoy))
            if (!valueHoraFin) setValueHoraFin(new Date(hoy.addDays(1)))
        }
    }

    const onSelectHoraInicio = (value: Date | null) => {
        if (!valueFecha) onSelectFecha(hoy)
        let horas = value ? value.getHours() : 0
        let minutos = value ? value.getMinutes() : 0
        value = new Date(hoy)
        value.setHours(horas, minutos)
        if (valueHoraFin && value > valueHoraFin) {
            setValueHoraFin(value.addMinutes(1))
        }
        setValueHoraInicio(value)
    }

    const onSelectHoraFin = (value: Date | null) => {
        if (!valueFecha) onSelectFecha(hoy)
        let horas = value ? value.getHours() : 0
        let minutos = value ? value.getMinutes() : 0
        value = new Date(hoy)
        value.setHours(horas, minutos)
        if (horas === 0 && minutos === 0) {
            value = value.addDays(1)
        }
        if (valueHoraInicio && valueHoraInicio > value) {
            setValueHoraInicio(value.addMinutes(-1))
        }
        setValueHoraFin(value)
    }

    const getNombreDocente = (id: string) => {
        let docente = docentes.find(docente => docente._id === id)
        return docente ? `${docente.apellido} ${docente.nombre}` : ""
    }

    const getNombreMateria = (id: string) => {
        let materia = materias.find(materia => materia._id === id)
        return materia ? materia.descripcion : ""
    }

    const handleChangePage = async (_event: unknown, newPage: number) => {
        setPage(newPage);
        searchParams.set("p", (newPage + 1).toString())
        setSearchParams(searchParams, { replace: true })
        await fetchConsultas()
    }

    const handleChangeLimit = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setLimit(parseInt(event.target.value));
        setPage(0);
        searchParams.set("l", event.target.value)
        searchParams.set("p", "1")
        setSearchParams(searchParams, { replace: true })
        await fetchConsultas()
    }

    const handleOpenInscripcionModal = (inscripcionData: { consulta?: Consulta, materia?: Materia, docente?: Docente }) => {
        setInscripcionModalData(inscripcionData)
        setOpenInscripcionModal(true)
    }

    const handleCloseInscripcionModal = () => {
        setInscripcionModalData({});
        (document.activeElement as HTMLElement).blur()
        setOpenInscripcionModal(false)
        setDoneInscripcion(false)
        setAlert({})
    }

    const handleInscripcion = async () => {
        let body: { alumno?: string, consulta?: string } = {}
        let payload = decodeToken(localStorage.getItem("token") || "")
        if (payload && payload.user.rol == "alumno") body.alumno = payload.user.id
        if (inscripcionModalData.consulta) body.consulta = inscripcionModalData.consulta._id

        try {
            const res = await apiClient.post(API_ROUTES.INSCRIPCIONES.ADD, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, body })
            setAlert({ message: res.message, severity: "success" })
        } catch (err: any) {
            setAlert({ message: err.message, severity: "error" })
        } finally {
            setDoneInscripcion(true)
        }
    }

    let content = <></>

    if (loading) {
        content = (
            <Grid container spacing={2} width={"100%"}>
                {Array.from(new Array(5)).map((_skeleton, idx) => {
                    return (
                        <Grid size={12} key={idx}>
                            <ConsultaCardSkeleton />
                            {/*<Skeleton variant="rounded" width={"100%"} sx={{height: {xs: 80, md: 92, lg: 65}}} />*/}
                        </Grid>
                    )
                })}
            </Grid>
        )

    } else if (error) {
        content = <Typography variant="body1">Error: {error}</Typography>
    } else if (consultas.length === 0) {
        let materiaMessage: string = valueMateria ? `de ${getNombreMateria(valueMateria.id)}` : ""
        let docenteMessage: string = valueDocente ? `dictadas por ${getNombreDocente(valueDocente?.id)}` : ""
        content = <Typography variant="h5" sx={{ py: 2 }}>No hay consultas {materiaMessage} {docenteMessage} para el período de fechas seleccionado</Typography>
    } else {
        content = (
            <Grid container spacing={2}>
                {consultas.map((consulta, idx) => {
                    return (
                        <Grid size={12} key={idx}>
                            <ConsultaCard consulta={consulta} onClickInscribirse={handleOpenInscripcionModal} />
                        </Grid>
                    )
                })}
            </Grid>
        )
    }

    return (
        <>
            <ResponsiveDrawer title="Consultas">
                <Grid container sx={{ alignItems: "center" }} spacing={2}>
                    <Grid sx={{ display: { xs: "none", lg: "inline-flex" } }}>
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            color="inherit"
                        >
                            <Icon>filter_list</Icon>
                        </IconButton>
                    </Grid>
                    <Grid container size={{ xs: 12, lg: 9, xl: 8 }}>
                        <Grid container size={12}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <ControlledAutocomplete
                                    id="docente"
                                    options={docentes.map(docente => { return { id: docente._id, label: `${docente.apellido} ${docente.nombre}` } })}
                                    label="Docente"
                                    value={valueDocente}
                                    onChange={onSelectDocente}
                                    inputValue={inputDocente}
                                    onInputChange={(_event: any, newInputValue: any) => {
                                        setInputDocente(newInputValue);
                                    }}
                                    sx={{textAlign: "left"}}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <ControlledAutocomplete
                                    id="materia"
                                    options={materias.map(materia => { return { id: materia._id, label: materia.descripcion } })}
                                    label="Materia"
                                    value={valueMateria}
                                    onChange={onSelectMateria}
                                    inputValue={inputMateria}
                                    onInputChange={(_event: any, newInputValue: any) => {
                                        setInputMateria(newInputValue);
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container size={12}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <LocalizedDatePicker
                                    value={valueFecha}
                                    onChange={onSelectFecha}
                                    label="Fecha"
                                    clearable
                                />
                            </Grid>
                            <Grid container size={{ xs: 12, md: 6 }}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <LocalizedTimePicker
                                        value={valueFecha && valueHoraInicio}
                                        onChange={onSelectHoraInicio}
                                        label="Desde"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <LocalizedTimePicker
                                        value={valueFecha && valueHoraFin}
                                        onChange={onSelectHoraFin}
                                        label="Hasta"
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 3 }}></Divider>
                {content}
                <TablePagination
                    labelRowsPerPage="Resultados por página:"
                    labelDisplayedRows={({ from, to, count }) => {
                        return `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`;
                    }}
                    rowsPerPageOptions={limitOptions}
                    component="div"
                    count={count}
                    rowsPerPage={limit}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeLimit}
                />
                <ConsultaInscripcionModal data={inscripcionModalData} open={openInscripcionModal} handleClose={handleCloseInscripcionModal} handleInscripcion={handleInscripcion} done={doneInscripcion} alert={alert} onCloseAlert={() => setAlert({})} />
            </ResponsiveDrawer>
        </>
    )
}