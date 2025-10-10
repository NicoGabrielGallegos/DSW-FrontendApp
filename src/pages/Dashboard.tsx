import Box from "@mui/material/Box";
import ResponsiveDrawer from "../components/ResponsiveDrawer";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import CardActionArea from "@mui/material/CardActionArea";
import Stack from "@mui/material/Stack";

const cards = [
    {
        id: 1,
        title: "Materias",
        icon: "a",
    },
    {
        id: 2,
        title: "Docentes",
        icon: "b",
    },
    {
        id: 3,
        title: "Consultas",
        icon: "c",
    },
];

export default function Materias() {
    return (
        <ResponsiveDrawer title="Dashboard">
            <Stack direction="row">
                {cards.map((card, index) => (
                    <Card>
                        <CardActionArea
                            onClick={() => { }}
                            sx={{
                                height: '100%',
                                '&[data-active]': {
                                    backgroundColor: 'action.selected',
                                    '&:hover': {
                                        backgroundColor: 'action.selectedHover',
                                    },
                                },
                            }}
                        >
                            <CardContent sx={{ height: '100%' }}>
                                <Typography variant="h5" component="div">
                                    {card.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {card.icon}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                ))}
            </Stack>
        </ResponsiveDrawer>
    )
}