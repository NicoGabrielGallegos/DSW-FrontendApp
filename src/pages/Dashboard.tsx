import Box from "@mui/material/Box";
import ResponsiveDrawer from "../components/ResponsiveDrawer";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import CardActionArea from "@mui/material/CardActionArea";
import Icon from "@mui/material/Icon";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

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

export default function Materias() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <AppBar position="static" >
                <Toolbar>
                    <Typography variant="h5" color="inherit" component="div" p={2} flexGrow={1}>
                        Landing Page
                    </Typography>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <Icon>account_circle</Icon>
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={handleClose}>My account</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Grid container spacing={8} sx={{ mt: { xs: 4, md: 12, xl: 14 } }}>
                {cards.map((card, index) => (
                    <Grid size={{ xs: 12, md: 4 }} key={index} mx={{ xs: 4, md: 0 }}>
                        <Card elevation={3}>
                            <CardActionArea
                                LinkComponent={Link}
                                href={`/dashboard/${card.url}`}
                                onClick={() => { }}
                            >
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