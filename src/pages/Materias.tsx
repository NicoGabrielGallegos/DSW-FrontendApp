import Grid from "@mui/material/Grid";
import MateriaCard, { MateriaCardSkeleton } from "../components/MateriaCard";
import ResponsiveDrawer from "../components/ResponsiveDrawer";
import { useEffect, useState } from "react";
import { apiClient } from "../api/apiClient.ts";
import { API_ROUTES } from "../api/endpoints.ts";
import Typography from "@mui/material/Typography";

interface Materia {
    _id: string,
    descripcion: string
}

export default function Materias() {
    const [materias, setMaterias] = useState<Materia[]>([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchMaterias() {
            try {
                const res = await apiClient.get(API_ROUTES.MATERIAS.FIND_ALL, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
                setMaterias(res.data)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false);
            }
        }
        fetchMaterias()
    }, [])

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
    } else {
        content = (
            <Grid container spacing={2}>
                {materias.map((materia, idx) => {
                    return (
                        <Grid size={12} key={idx}>
                            <MateriaCard id={materia._id} nombreMateria={materia.descripcion} />
                        </Grid>
                    )
                })}
            </Grid>
        )
    }

    return (
        <ResponsiveDrawer title="Materias">
            {content}
        </ResponsiveDrawer>
    )
}