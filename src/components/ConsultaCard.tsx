import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import { useNavigate } from 'react-router';
import type { Materia } from '../types/Materia.ts';
import type { Docente } from '../types/Docente.ts';
import type { Consulta } from '../types/Consulta.ts';

export function ConsultaCardSkeleton() {
    return (
        <Card elevation={3}>
            <CardContent sx={{
                pt: { xs: 2, md: 0 },
                pr: 2,
                pb: "0 !important",
                pl: 2,
            }}
            >
                <Grid container alignItems={"center"} spacing={1}>
                    <Grid container size={{ xs: 12, md: "grow" }} sx={{ textAlign: { xs: "center", md: "left" } }}>
                        <Grid size={{ xs: 12, md: 6, lg: 4 }} sx={{ py: { xl: 2 }, pt: { md: 1, lg: 2 }, fontSize: { xs: "1rem", md: "1.4rem", lg: "1.5rem" } }}>
                            <Skeleton />
                        </Grid>
                        <Grid container size={{ xs: 12, xl: 5 }} alignItems={"center"} sx={{ py: { md: 1, lg: 2 }, ml: { xl: 2 }, mb: { md: 1, lg: 0 } }}>
                            <Grid size={{ xs: 12, md: 7, lg: 4 }} >
                                <Skeleton />
                            </Grid>
                            <Grid container size={{ xs: 12, md: 7, lg: 4 }} justifyContent={{ xs: "center", md: "left" }}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Skeleton />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Skeleton />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid size={{ xs: 12, md: "auto" }}>
                        <CardActions sx={{ justifyContent: { xs: "center", md: "right" } }}>
                            <Skeleton width={110} sx={{ mb: 0.5 }} />
                        </CardActions>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

export default function ConsultaCard({ consulta, materia, docente }: { consulta: Consulta, materia: Materia | undefined, docente: Docente | undefined }) {
    const navigate = useNavigate()

    return (
        <Card elevation={3}>
            <CardContent sx={{
                pt: { xs: 2, md: 0 },
                pr: { xs: 0, md: 1 },
                pb: "0 !important",
                pl: { xs: 0, md: 2 },
            }}
            >
                <Grid container alignItems={"center"}>
                    <Grid container size={{ xs: 12, md: "grow" }} sx={{ textAlign: { xs: "center", md: "left" } }}>
                        <Grid size={{ xs: 12, xl: "auto" }}>
                            <Typography variant="h5" component="div" align="inherit" sx={{ py: { xl: 2 }, pt: { md: 1, lg: 2 }, fontSize: { xs: "1rem", md: "1.4rem", lg: "1.5rem" } }}>
                                {materia?.descripcion || ""}
                            </Typography>
                        </Grid>
                        <Grid container size={{ xs: 12, xl: "auto" }} alignItems={"center"} sx={{ py: { md: 1, lg: 2 }, ml: { xl: 2 } }}>
                            <Grid size={{ xs: 12, md: "auto", xl: "auto" }} sx={{ mb: { md: 1, lg: 0 } }}>
                                <Typography component="div" color="textSecondary" align="inherit" fontSize={"1rem"}>
                                    Docente: {docente?.apellido || ""} {docente?.nombre || ""}
                                </Typography>
                            </Grid>
                            <Grid container size={{ xs: 12, lg: 6, xl: "auto" }} justifyContent={{ xs: "center", md: "left" }} ml={{ lg: 2 }}>
                                <Grid size={{ xs: 12, sm: "auto" }}>
                                    <Typography component="div" color="textSecondary" align="inherit" fontSize={"1rem"}>
                                        Desde: {consulta.horaInicio.split("T")[1].slice(0, -8)}
                                    </Typography>
                                </Grid>
                                <Grid size="auto" display={{ xs: "none", sm: "block" }}>
                                    <Typography component="div" color="textSecondary" align="inherit" fontSize={"1rem"}>
                                        &nbsp;-&nbsp;
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: "auto" }}>
                                    <Typography component="div" color="textSecondary" align="inherit" fontSize={"1rem"}>
                                        Hasta: {consulta.horaFin.split("T")[1].slice(0, -8)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid size={{ xs: 12, md: "auto" }}>
                        <CardActions sx={{ justifyContent: { xs: "center", md: "right" } }}>
                            <Button size="small" onClick={() => { }} sx={{ py: { md: 0.5 }, fontSize: { xs: "0.7rem", md: "0.8rem" } }}>Inscribirse</Button>
                        </CardActions>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}