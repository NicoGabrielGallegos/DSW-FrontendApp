import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function MateriaCard() {
    return (
        <Box sx={{ width: "100%" }}>
            <Card sx={{width: "100%"}}>
                <CardContent>
                    <Typography variant="h5" component="div" align="left">
                        Bases de Datos
                    </Typography>
                    <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                        N consultas programadas de M profesores distintos
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small">Ver consultas disponibles</Button>
                </CardActions>
            </Card>
        </Box>
    );
}