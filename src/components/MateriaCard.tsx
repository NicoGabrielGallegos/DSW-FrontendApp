import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';

export function MateriaCardSkeleton() {
    return (
        <Card elevation={3}>
            <CardContent sx={{
                pt: { xs: 2, md: 0 },
                pr: 2,
                pb: "0 !important",
                pl: 2,
            }}
            >
                <Grid container alignItems={"center"}>
                    <Grid size={{ xs: 12, md: 8, lg: 6 }} sx={{ textAlign: { xs: "center", md: "left" } }}>
                        <Typography variant="h5" component="div" align="inherit" sx={{ py: { md: 2 }, fontSize: { xs: "1rem", md: "1.5rem" } }}>
                            <Skeleton />
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4, lg: 6 }}>
                        <Grid container>
                            <Grid size={{ xs: 6, md: 12, lg: "grow" }}>
                                <CardActions sx={{ justifyContent: { xs: "center", md: "right" } }}>
                                    <Skeleton width={110} />
                                </CardActions>
                            </Grid>
                            <Grid size={{ xs: 6, md: 12, lg: "auto" }}>
                                <CardActions sx={{ justifyContent: { xs: "center", md: "right" } }}>
                                    <Skeleton width={110} />
                                </CardActions>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

export default function MateriaCard({ id, nombreMateria, options }: { id: string, nombreMateria: string, options?: {docente?: string} }) {
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
                    <Grid size={{ xs: 12, md: 7.5, lg: 6 }} sx={{ textAlign: { xs: "center", md: "left" } }}>
                        <Typography variant="h5" component="div" align="inherit" sx={{ py: { md: 2 }, fontSize: { xs: "1rem", md: "1.5rem" } }}>
                            {nombreMateria}
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4.5, lg: 6 }}>
                        <Grid container alignItems={"center"}>
                            <Grid size={{ xs: 6, md: 12, lg: "grow" }}>
                                <CardActions sx={{ justifyContent: { xs: "center", md: "right" } }}>
                                    <Button size="small" sx={{ py: { md: 0.5 }, fontSize: { xs: "0.7rem", md: "0.8rem" } }}>Ver docentes</Button>
                                </CardActions>
                            </Grid>
                            <Grid size={{ xs: 6, md: 12, lg: "auto" }}>
                                <CardActions sx={{ justifyContent: { xs: "center", md: "right" } }}>
                                    <Button size="small" sx={{ py: { md: 0.5 }, fontSize: { xs: "0.7rem", md: "0.8rem" } }}>{options && options.docente && "Ver consultas del docente" || "Ver consultas"}</Button>
                                </CardActions>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}