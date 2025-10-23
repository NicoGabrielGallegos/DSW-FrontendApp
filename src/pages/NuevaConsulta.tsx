import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { apiClient } from "../api/apiClient.ts";
import { API_ROUTES } from "../api/endpoints.ts";
import Typography from "@mui/material/Typography";
import Icon from "@mui/material/Icon";
import type { Materia } from "../types/Materia.ts";
import { useNavigate } from "react-router";
import { EstadoConsulta } from "../types/Consulta.ts";
import LocalizedDatePicker from "../components/shared/LocalizedDatePicker.tsx";
import ControlledAutocomplete from "../components/shared/ControlledAutocomplete.tsx";
import type { Dictado } from "../types/Dictado.ts";
import LocalizedTimePicker from "../components/shared/LocalizedTimePicker.tsx";
import { useAuth } from "../context/AuthContext.tsx";
import NavBar from "../components/shared/NavBar.tsx";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { ROUTES } from "../utils/routes.ts";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";

export default function NuevaConsulta() {
    // Colecciones de materias, docentes y consultas
    const [materias, setMaterias] = useState<Materia[]>([])
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
    const [alert, setAlert] = useState<{ message?: string, severity?: "error" | "success" }>({})
    // Hook para navegar
    const navigate = useNavigate()
    // Auth
    const auth = useAuth()

    async function fetchMaterias() {
        try {
            let docente = auth.user?.id || ""
            let route: string
            if (docente === "") {
                route = API_ROUTES.MATERIAS.FIND_ALL
            } else {
                route = API_ROUTES.MATERIAS.FIND_BY_DOCENTE(docente)
            }
            const res = await apiClient.get(route, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
            setMaterias(res.data)
            if (!valueMateria) setValueMateria({ id: res.data[0]._id, label: res.data[0].descripcion })
        } catch (err: any) {
            setError(err.message)
        }
    }

    useEffect(() => {
        async function initPage() {
            await fetchMaterias()
        }
        initPage()
    }, [])


    const onSelectMateria = (_event: any, value: { id: string, label: string }) => {
        setValueMateria(value)
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
            setValueHoraFin(new Date(value).addMinutes(1))
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
            setValueHoraInicio(new Date(value).addMinutes(-1))
        }
        setValueHoraFin(value)
    }

    const handleCrearConsulta = async () => {

        let dictado: Dictado<string, string>
        try {
            const resDictado = await apiClient.get(API_ROUTES.DICTADOS.FIND_ONE_BY_DOCENTE_AND_MATERIA(auth.user?.id || "", valueMateria?.id || ""), { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
            if (!resDictado.data) return
            dictado = resDictado.data
        } catch (err: any) {
            setAlert({ message: err.message, severity: "error" })
            return
        }

        let body: { dictado?: string, horaInicio?: string, horaFin?: string, estado: string } = { dictado: dictado._id, estado: EstadoConsulta.Programada }
        if (valueFecha && valueHoraInicio) {
            valueFecha.setHours(valueHoraInicio.getHours(), valueHoraInicio.getMinutes(), 0, 0)
            body.horaInicio = valueFecha.toISOString()
        }
        if (valueFecha && valueHoraFin) {
            let { horaFin, minutoFin } = { horaFin: valueHoraFin.getHours(), minutoFin: valueHoraFin.getMinutes() }
            valueFecha.setHours(horaFin, minutoFin, 0, 0)
            if (horaFin === 0 && minutoFin === 0) {
                valueFecha.addDays(1)
            }
            body.horaFin = valueFecha.toISOString()
        }

        try {
            const res = await apiClient.post(API_ROUTES.CONSULTAS.ADD, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, body })
            setAlert({ message: res.message, severity: "success" })
        } catch (err: any) {
            setAlert({ message: err.message, severity: "error" })
        }
    }

    let content = <></>

    if (error) {
        content = <Typography variant="body1">Error: {error}</Typography>
    } else {
        content = (
            <Paper sx={{ p: 4, mt: 2, maxWidth: 500 }} elevation={3}>
                <Typography variant="h5">Ingrese los datos de la nueva consulta</Typography>
                <Grid container spacing={2} mt={2}>
                    <Grid size={12}>
                        <ControlledAutocomplete
                            id="materia"
                            options={materias.map(materia => { return { id: materia._id, label: materia.descripcion } })}
                            value={valueMateria}
                            onChange={onSelectMateria}
                            label="Materia"
                            inputValue={inputMateria}
                            onInputChange={(_event: any, newInputValue: any) => {
                                setInputMateria(newInputValue);
                            }}
                            variant="standard"
                        />
                    </Grid>
                    <Grid container size={12}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <LocalizedDatePicker
                                value={valueFecha}
                                onChange={onSelectFecha}
                                label="Fecha"
                                clearable
                                variant="standard"
                            />
                        </Grid>
                        <Grid container size={{ xs: 12, sm: 6 }}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <LocalizedTimePicker
                                    value={valueFecha && valueHoraInicio}
                                    onChange={onSelectHoraInicio}
                                    label="Desde"
                                    variant="standard"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <LocalizedTimePicker
                                    value={valueFecha && valueHoraFin}
                                    onChange={onSelectHoraFin}
                                    label="Hasta"
                                    variant="standard"
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container size={12} justifyContent={"end"}>
                    <Button variant="contained" sx={{ mt: 3 }} onClick={handleCrearConsulta}>Crear Consulta</Button>
                </Grid>
            </Paper>
        )
    }

    return (
        <>
            <NavBar>Nueva Consulta</NavBar>
            <Box
                component="main"
                sx={{ flexGrow: 1, px: 2 }}
            >
                <Box display={"flex"}>
                    <Button variant="text" startIcon={<Icon>arrow_back</Icon>} onClick={() => navigate(ROUTES.CONSULTAS)}>Volver</Button>
                </Box>
                <Box>
                    {alert.message && <Alert severity={alert.severity} sx={{ mb: 2 }} onClose={() => setAlert({})}>
                        {alert.message}
                    </Alert>}
                </Box>
                <Box display={"flex"} justifyContent={"center"}>
                    {content}
                </Box>
            </Box>
        </>
    )
}