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
import TablePagination from "@mui/material/TablePagination";

export default function Materias() {
    const [materias, setMaterias] = useState<Materia[]>([])
    const [docentes, setDocentes] = useState<Docente[]>([])
    const [selectedDocente, setSelectedDocente] = useState<string>("")
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [searchParams, setSearchParams] = useSearchParams()
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
            const res = await apiClient.get(API_ROUTES.DOCENTES.FIND_ALL, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
            res.data.sort((a: Docente, b: Docente) => `${a.apellido} ${a.nombre}` < `${b.apellido} ${b.nombre}` ? -1 : 1)
            setDocentes(res.data)
        } catch (err: any) {
            setError(err.message)
        }
    }

    async function fetchMaterias(docente: string = "",) {
        try {
            let route: string
            if (docente === "") {
                route = API_ROUTES.MATERIAS.FIND_ALL
            } else {
                route = API_ROUTES.MATERIAS.FIND_BY_DOCENTE(docente)
            }

            let params: { p?: string, l?: string } = {}
            let page = searchParams.get("p")
            if (page) params.p = page
            let limit = searchParams.get("l")
            if (limit) params.l = limit

            const res = await apiClient.get(route, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, params })
            setMaterias(res.data)
            setCount(res.total)
        } catch (err: any) {
            setError(err.message)
        }
    }

    useEffect(() => {
        async function initPage() {
            setVariablesFromParams()
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

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
        searchParams.set("p", (newPage + 1).toString())
        setSearchParams(searchParams)
        fetchMaterias()
    };

    const handleChangeLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLimit(parseInt(event.target.value));
        setPage(0);
        searchParams.set("l", event.target.value)
        setSearchParams(searchParams)
        fetchMaterias()
    };

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
            <TablePagination
                rowsPerPageOptions={limitOptions}
                component="div"
                count={count}
                rowsPerPage={limit}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeLimit}
            />
        </ResponsiveDrawer>
    )
}