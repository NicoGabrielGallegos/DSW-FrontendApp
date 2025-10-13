import Grid from "@mui/material/Grid";
import MateriaCard, { MateriaCardSkeleton } from "../components/MateriaCard";
import ResponsiveDrawer from "../components/ResponsiveDrawer";
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

export default function Materias() {
    const [materias, setMaterias] = useState<Materia[]>([])
    const [docentes, setDocentes] = useState<Docente[]>([])
    const [selectedDocente, setSelectedDocente] = useState<string>("")
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

    async function fetchMaterias(docente: string = "", ) {
        try {
            let route: string
            if (docente === "") {
                route = API_ROUTES.MATERIAS.FIND_ALL
            } else {
                route = API_ROUTES.MATERIAS.FIND_BY_DOCENTE(docente)
            }
            
            let params: {p?: string, l?: string} = {}
            let page = searchParams.get("p")
            if (page) params.p = page
            let limit = searchParams.get("l")
            if (limit) params.l = limit

            const res = await apiClient.get(route, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, params })
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
            setSearchParams({ docente: value.id })
        } else {
            setSelectedDocente("")
            setSearchParams({})
        }
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
    } else if (materias.length === 0) {
        content = <Typography variant="h5" sx={{ py: 2 }}>No hay materias</Typography>
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
        <ResponsiveDrawer title="Materias">
            <Grid container sx={{ alignItems: "center" }}>
                <Grid size={"auto"}>
                    <IconButton
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        color="inherit"
                    >
                        <Icon>filter_list</Icon>
                    </IconButton>
                </Grid>
                <Grid size={"grow"}>
                    <Autocomplete
                        id="docente"
                        disablePortal
                        options={docentes.map(docente => { return { id: docente._id, label: `${docente.apellido} ${docente.nombre}` } })}
                        renderInput={(params) => <TextField {...params} label="Docente" size="small" />}
                        sx={{ maxWidth: 300 }}
                        onChange={onSelectDocente}
                    />

                </Grid>
            </Grid>
            <Divider sx={{ my: 3 }}></Divider>
            {content}
        </ResponsiveDrawer>
    )
}