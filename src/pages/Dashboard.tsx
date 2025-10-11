import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Icon from "@mui/material/Icon";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import ProfileButton from "../components/ProfileButton.tsx";
import { useNavigate } from "react-router";

const cards = [
    {
        url: "materias",
        title: "Materias",
        icon: "auto_stories",
    },
    {
        url: "docentes",
        title: "Docentes",
        icon: "people_alt",
    },
    {
        url: "consultas",
        title: "Consultas",
        icon: "calendar_month",
    },
];

export default function Dashboard() {
    const nombre = localStorage.getItem("nombre") || ""
    const apellido = localStorage.getItem("apellido") || ""
    const navigate = useNavigate()

    return (
        <>
            <AppBar position="static" >
                <Toolbar>
                    <Typography variant="h6" color="inherit" component="div" p={2} flexGrow={1}>
                        {`Hola, ${nombre} ${apellido}!`}
                    </Typography>
                    <ProfileButton />
                </Toolbar>
            </AppBar>
            <Typography variant="h4" color="textSecondary" sx={{ mt: { xs: 4, md: 12 }, mb: {xs: 4, md: 0} }}>¿Qué te interesa ver?</Typography>
            <Grid container spacing={8} sx={{ mt: { xs: 4, md: 12 } }}>
                {cards.map((card, index) => (
                    <Grid size={{ xs: 12, md: 4 }} key={index} mx={{ xs: 4, md: 0 }}>
                        <Card elevation={3}>
                            <CardActionArea onClick={() => navigate(`/dashboard/${card.url}`)}>
                                <CardContent sx={{ height: '100%' }}>
                                    <Typography color="text.secondary">
                                        <Icon sx={{ fontSize: 48 }}>{card.icon}</Icon>
                                    </Typography >
                                    <Typography variant="h5" color="text.secondary">
                                        {card.title}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>
    )
}