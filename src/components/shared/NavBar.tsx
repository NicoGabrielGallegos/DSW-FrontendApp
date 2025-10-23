import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export default function NavBar({ children }: { children: string }) {

    return (
        <Box sx={{ display: 'flex', width: "100%" }}>
            <AppBar
                position="fixed"
                sx={{
                    width: "100%"
                }}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        {children}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="main"
                sx={{ flexGrow: 1, pb: 2 }}
            >
                <Toolbar />
            </Box>
        </Box>
    );
}