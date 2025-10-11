import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

export default function MateriaCard({id, nombreMateria}: {id: string, nombreMateria: string}) {
    return (
        <Card elevation={3}>
            <CardContent sx={{
                pt: { xs: 2 , md: 0},
                pr: { xs: 0 , md: 1},
                pb: "0 !important",
                pl: { xs: 0 , md: 2},
            }}
            >
                <Grid container alignItems={"center"}>
                    <Grid size={{ xs: 12, md: 8, lg: 6 }} sx={{ textAlign: { xs: "center", md: "left" } }}>
                        <Typography variant="h5" component="div" align="inherit">
                            {nombreMateria}
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4, lg: 6 }}>
                        <Grid container>
                            <Grid size={{ xs: 6, md: 12, lg: 6 }}>
                                <CardActions sx={{ justifyContent: { xs: "center", md: "right" } }}>
                                    <Button size="small">Ver docentes</Button>
                                </CardActions>
                            </Grid>
                            <Grid size={{ xs: 6, md: 12, lg: 6 }}>
                                <CardActions sx={{ justifyContent: { xs: "center", md: "right" } }}>
                                    <Button size="small">Ver consultas</Button>
                                </CardActions>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}