import Grid from "@mui/material/Grid";
import MateriaCard, { MateriaCardSkeleton } from "../components/alumnos/MateriaCard.tsx";
import ResponsiveDrawer from "../components/shared/ResponsiveDrawer.tsx";
import { useEffect, useState } from "react";
import { apiClient } from "../api/apiClient.ts";
import { API_ROUTES } from "../api/endpoints.ts";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import type { Materia } from "../types/Materia.ts";
import type { Docente } from "../types/Docente.ts";
import { useSearchParams } from "react-router";
import LocalizedDateTimePicker from "../components/shared/LocalizedTimePicker.tsx";
import Box from "@mui/material/Box";
import type { Consulta } from "../types/Consulta.ts";

export default function Materias() {
    const [materias, setMaterias] = useState<Materia[]>([])
    const [docentes, setDocentes] = useState<Docente[]>([])
    const [selectedDocente, setSelectedDocente] = useState<string>("")
    const [selectedMateria, setSelectedMateria] = useState<string>("")
    const [consultas, setConsultas] = useState<Consulta[]>([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [searchParams, setSearchParams] = useSearchParams()

    async function fetchDocentes() {
        try {
            const res = await apiClient.get(API_ROUTES.DOCENTES.FIND_ALL, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
            res.data.sort((a: Docente, b: Docente) => `${a.apellido} ${a.nombre}` < `${b.apellido} ${b.nombre}` ? -1 : 1)
            setDocentes(res.data)
        } catch (err: any) {
            setError(err.message)
        }
    }

    async function fetchMaterias(docente: string = "") {
        try {
            let route: string
            if (docente === "") {
                route = API_ROUTES.MATERIAS.FIND_ALL
            } else {
                route = API_ROUTES.MATERIAS.FIND_BY_DOCENTE(docente)
            }
            const res = await apiClient.get(route, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
            res.data.sort((a: Materia, b: Materia) => a.descripcion < b.descripcion ? -1 : 1)
            setMaterias(res.data)
        } catch (err: any) {
            setError(err.message)
        }
    }

    useEffect(() => {
        async function initPage() {
            const docenteParam = searchParams.get("docente")
            if (docenteParam) {
                setSelectedDocente(docenteParam)
            }
            await fetchMaterias(docenteParam || "")
            await fetchDocentes()
            setLoading(false)
        }
        initPage()
    }, [])

    useEffect(() => {
        async function reloadMaterias() {
            await fetchMaterias(selectedDocente)
        }
        reloadMaterias()
    }, [selectedDocente])

    const onSelectDocente = (_event: any, value: any) => {
        if (value) {
            setSelectedDocente(value.id)
            searchParams.set("docente", value.id)
        } else {
            setSelectedDocente("")
            searchParams.delete("docente")
        }
        setSearchParams(searchParams)
    }

    const onSelectMateria = (_event: any, value: any) => {
        if (value) {
            setSelectedMateria(value.id)
            searchParams.set("materia", value.id)
        } else {
            setSelectedMateria("")
            searchParams.delete("materia")
        }
        setSearchParams(searchParams)
    }

    const docenteNombreCompleto = () => {
        let docente = docentes.find(d => d._id === selectedDocente)
        return docente ? `${docente.apellido} ${docente.nombre}` : ""
    }

    const materiaDescripcion = () => {
        return materias.find(m => m._id === selectedMateria)?.descripcion
    }

    let content = <></>

    if (loading) {
        content = (
            <Grid container spacing={2} width={"100%"}>
                {Array.from(new Array(5)).map((_skeleton, idx) => {
                    return (
                        <Grid size={12} key={idx}>
                            <MateriaCardSkeleton />
                            {/*<Skeleton variant="rounded" width={"100%"} sx={{height: {xs: 80, md: 92, lg: 65}}} />*/}
                        </Grid>
                    )
                })}
            </Grid>
        )

    } else if (error) {
        content = <Typography variant="body1">Error: {error}</Typography>
    } else if (!selectedDocente || !selectedMateria) {
        content = <Typography variant="h5" sx={{ py: 2 }}>Seleccione un docente y una materia</Typography>
    } else if (consultas.length === 0) {
        content = <Typography variant="h5" sx={{ py: 2 }}>No hay consultas de {materiaDescripcion()} dictadas por {docenteNombreCompleto()} para el período de fechas dado</Typography>
    } else {
        content = (
            <Grid container spacing={2}>
                {materias.map((materia, idx) => {
                    return (
                        <Grid size={12} key={idx}>
                            <MateriaCard id={materia._id} nombreMateria={materia.descripcion} options={{ docente: selectedDocente }} />
                        </Grid>
                    )
                })}
            </Grid>
        )
    }

    return (
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
                <Grid container sx={{ alignItems: "center" }} size={{ xs: 12, lg: "grow" }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Autocomplete
                            id="docente"
                            disablePortal
                            options={docentes.map(docente => { return { id: docente._id, label: `${docente.apellido} ${docente.nombre}` } })}
                            renderInput={(params) => <TextField {...params} label="Docente" size="small" fullWidth />}
                            onChange={onSelectDocente}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Autocomplete
                            id="materia"
                            disablePortal
                            options={materias.map(materia => { return { id: materia._id, label: materia.descripcion } })}
                            renderInput={(params) => <TextField {...params} label="Materia" size="small" fullWidth />}
                            onChange={onSelectMateria}
                        />
                    </Grid>
                </Grid>
                <Grid container sx={{ alignItems: "center" }} size={{ xs: 12, lg: "auto" }}>
                    <Grid size={{ xs: 12, md: 6 }} >
                        <LocalizedDateTimePicker label="Desde" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }} >
                        <LocalizedDateTimePicker label="Hasta" />
                    </Grid>
                </Grid>
            </Grid>
            <Divider sx={{ my: 3 }}></Divider>
            {content}
        </ResponsiveDrawer>
    )
}