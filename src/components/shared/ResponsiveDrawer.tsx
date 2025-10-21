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
import ProfileButton from './ProfileButton.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { ROUTES } from '../../utils/routes.ts';

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
            <Divider />
            <List>
                <RouterLink to={ROUTES.HOME} >
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <Icon>book</Icon>
                            </ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItemButton>
                    </ListItem>
                </RouterLink>
            </List>
            <Divider />
            <List>
                {['Materias', 'Docentes', 'Consultas'].map((text, index) => (
                    <RouterLink to={[ROUTES.MATERIAS, ROUTES.DOCENTES, ROUTES.CONSULTAS][index]} key={text}>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <Icon>{["auto_stories", "people_alt", "calendar_month"][index]}</Icon>
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    </RouterLink>
                ))}
            </List>
            <Divider />
            {
                auth.user?.rol === "administrador" &&
                <>
                    <List>
                        <RouterLink to={ROUTES.ADMIN.ROOT} >
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
                    <Divider />
                </>
            }
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
                    <div>
                        <ProfileButton />
                    </div>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
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
                            keepMounted: true, // Better open performance on mobile.
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