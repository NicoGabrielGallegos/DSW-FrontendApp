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
import type { Consulta } from "../types/Consulta.ts";
import LocalizedDatePicker from "../components/LocalizedDatePicker.tsx";
import ControlledAutocomplete from "../components/ControlledAutocomplete.tsx";
import TablePagination from "@mui/material/TablePagination";
import type { Dictado } from "../types/Dictado.ts";
import ConsultaCard, { ConsultaCardSkeleton } from "../components/ConsultaCard.tsx";

export default function Materias() {
    // Colecciones de materias, docentes y consultas
    const [materias, setMaterias] = useState<Materia[]>([])
    const [docentes, setDocentes] = useState<Docente[]>([])
    const [consultas, setConsultas] = useState<Consulta[]>([])
    const [dictados, setDictados] = useState<Dictado[]>([])
    // Variables para el selector de docente
    const [valueDocente, setValueDocente] = useState<{ id: string, label: string } | null>(null)
    const [inputDocente, setInputDocente] = useState<string>("")
    // Variables para el selector de materias
    const [valueMateria, setValueMateria] = useState<{ id: string, label: string } | null>(null)
    const [inputMateria, setInputMateria] = useState<string>("")
    // Variables de control sobre cargas y errores
    const [error, setError] = useState<string | null>(null)
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

    async function fetchDictados() {
        try {
            const res = await apiClient.get(API_ROUTES.DICTADOS.FIND_ALL, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
            setDictados(res.data)
        } catch (err: any) {
            setError(err.message)
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
            const res = await apiClient.get(route, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
            setMaterias(res.data)
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
                const dictadoObj: Dictado | undefined = dictados.find(dictado => dictado.docente === docente && dictado.materia === materia)
                if (!dictadoObj) {
                    setError("No existe el dictado seleccionado")
                    setConsultas([])
                    return
                }
                route = API_ROUTES.CONSULTAS.FIND_BY_DICTADO(dictadoObj._id)
            } else if (docente !== "") {
                route = API_ROUTES.CONSULTAS.FIND_BY_DOCENTE(docente)
            } else if (materia !== "") {
                route = API_ROUTES.CONSULTAS.FIND_BY_MATERIA(materia)
            } else {
                route = API_ROUTES.CONSULTAS.FIND_ALL
            }

            let params: { p?: string, l?: string } = {}
            let page = searchParams.get("p")
            if (page) params.p = page
            let limit = searchParams.get("l")
            if (limit) params.l = limit

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
            await fetchDictados()
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

    const onSelectDocente = (_event: any, value: any) => {
        if (value) {
            searchParams.set("docente", value.id)
        } else {
            searchParams.delete("docente")
        }
        setValueDocente(value)
        setSearchParams(searchParams, { replace: true })
    }

    const onSelectMateria = (_event: any, value: any) => {
        if (value) {
            searchParams.set("materia", value.id)
        } else {
            searchParams.delete("materia")
        }
        setValueMateria(value)
        setSearchParams(searchParams)
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
    };

    const handleChangeLimit = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setLimit(parseInt(event.target.value));
        setPage(0);
        searchParams.set("l", event.target.value)
        searchParams.set("p", "1")
        setSearchParams(searchParams, { replace: true })
        await fetchConsultas()
    };

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
        content = <Typography variant="h5" sx={{ py: 2 }}>No hay consultas {materiaMessage} {docenteMessage} para el período de fechas dado</Typography>
    } else {
        content = (
            <Grid container spacing={2}>
                {consultas.map((consulta, idx) => {
                    let dictado = dictados.find(dictado => dictado._id === consulta.dictado)
                    let materia = materias.find(materia => materia._id === dictado?.materia)
                    let docente = docentes.find(docente => docente._id === dictado?.docente)

                    return (
                        <Grid size={12} key={idx}>
                            <ConsultaCard consulta={consulta} materia={materia} docente={docente} />
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
                <Grid container size={{ xs: 12, lg: 10 }}>
                    <Grid size={{ xs: 12, md: 4 }}>
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
                            sx={{ justifyContent: "start" }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
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
                    <Grid size={{ xs: 12, md: 4 }}>
                        <LocalizedDatePicker label="Fecha" />
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
        </ResponsiveDrawer>
    )
}