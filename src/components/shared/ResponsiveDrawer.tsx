import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router';
import { useAuth } from '../../context/AuthContext.tsx';
import { ROUTES } from '../../utils/routes.ts';
import type { Rol } from '../../types/User.ts';

const drawerWidth = 240;


export default function ResponsiveDrawer({ title, children }: { title: string, children?: any }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const auth = useAuth()

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    const drawer = (
        <div>
            <Toolbar />
            {
                auth.user?.rol === "administrador" &&
                <>
                    <Divider />
                    <List>
                        <RouterLink to={ROUTES.ADMIN.CRUD_ALUMNOS} >
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <Icon>admin_panel_settings</Icon>
                                    </ListItemIcon>
                                    <ListItemText primary="Admin" />
                                </ListItemButton>
                            </ListItem>
                        </RouterLink>
                    </List>
                </>
            }
            <Divider />
            <List>
                {['Consultas', 'Docentes', 'Materias'].map((text, index) => (
                    <RouterLink to={[ROUTES.CONSULTAS, ROUTES.DOCENTES, ROUTES.MATERIAS][index]} key={text}>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <Icon>{["calendar_month", "co_present", "auto_stories"][index]}</Icon>
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    </RouterLink>
                ))}
            </List>
            {
                auth.user?.rol === "docente" &&
                <>
                    <Divider />
                    <List>
                        {['Mis Consultas', 'Crear Consulta'].map((text, index) => (
                            <RouterLink to={[`${ROUTES.CONSULTAS}?docente=${auth.user?.id as Rol}&p=1&l=5`, ROUTES.CONSULTA_NUEVA][index]} key={text}>
                                <ListItem disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <Icon>{["calendar_month", "add_circle_outline"][index]}</Icon>
                                        </ListItemIcon>
                                        <ListItemText primary={text} />
                                    </ListItemButton>
                                </ListItem>
                            </RouterLink>
                        ))}
                    </List>
                </>
            }
            <Divider />
            <List>
                <RouterLink to={ROUTES.CAMBIAR_PASSWORD}>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <Icon>lock_reset</Icon>
                            </ListItemIcon>
                            <ListItemText primary="Cambiar contraseña" />
                        </ListItemButton>
                    </ListItem>
                </RouterLink>
                <ListItem disablePadding>
                    <ListItemButton onClick={auth.logout}>
                        <ListItemIcon>
                            <Icon>logout</Icon>
                        </ListItemIcon>
                        <ListItemText primary="Log out" />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
        </div>
    );

    return (
        <Box sx={{ display: 'flex', width: "100%" }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <Icon>menu</Icon>
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        {title}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    slotProps={{
                        root: {
                            keepMounted: true,
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3 }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
}