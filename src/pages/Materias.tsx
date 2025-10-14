import Grid from "@mui/material/Grid";
import MateriaCard, { MateriaCardSkeleton } from "../components/MateriaCard";
import ResponsiveDrawer from "../components/ResponsiveDrawer";
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
import TablePagination from "@mui/material/TablePagination";
import ControlledAutocomplete from "../components/ControlledAutocomplete.tsx";

export default function Materias() {
    // Colecciones de materias y docentes
    const [materias, setMaterias] = useState<Materia[]>([])
    const [docentes, setDocentes] = useState<Docente[]>([])
    // Variables para el selector de docente
    const [valueDocente, setValueDocente] = useState<{ id: string, label: string } | null>(null)
    const [inputDocente, setInputDocente] = useState<string>("")
    // Variables de control sobre cargas y errores
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
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
            const res = await apiClient.get(API_ROUTES.DOCENTES.FIND_ALL, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
            res.data.sort((a: Docente, b: Docente) => `${a.apellido} ${a.nombre}` < `${b.apellido} ${b.nombre}` ? -1 : 1)
            setDocentes(res.data)
            setValueDocente(() => {
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

            let params: { p?: string, l?: string } = {}
            let page = searchParams.get("p")
            if (page) params.p = page
            let limit = searchParams.get("l")
            if (limit) params.l = limit

            console.log(page, limit);
            

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
            searchParams.set("p", (page + 1).toString())
            searchParams.set("l", limit.toString())
            setSearchParams(searchParams, {replace: true})
            await fetchMaterias()
            await fetchDocentes()
            setLoading(false)
        }
        initPage()
    }, [])

    useEffect(() => {
        async function reloadMaterias() {
            await fetchMaterias()
        }
        reloadMaterias()
    }, [valueDocente])

    const onSelectDocente = (_event: any, value: any) => {
        if (value) {
            searchParams.set("docente", value.id)
            setSearchParams(searchParams, {replace: true})
            setValueDocente(value)
        } else {
            searchParams.delete("docente")
            setSearchParams(searchParams, {replace: true})
            setValueDocente(null)
        }
    }

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
        searchParams.set("p", "1")
        setSearchParams(searchParams, {replace: true})
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
                            <MateriaCard id={materia._id} nombreMateria={materia.descripcion} options={{ docente: valueDocente?.id || "" }} />
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