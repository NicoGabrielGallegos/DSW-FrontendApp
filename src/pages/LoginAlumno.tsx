import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import Icon from '@mui/material/Icon';
import { useState } from "react";
import Link from "@mui/material/Link";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Input from "@mui/material/Input";
import { Navigate, useNavigate } from "react-router";
import { login } from "../utils/login.ts";
import { isAuthenticated } from "../utils/auth.ts";

export default function LoginAlumno() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate()

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleLogin = async () => {
        const correo = (document.getElementById("correo") as HTMLInputElement).value
        const password = (document.getElementById("contraseña") as HTMLInputElement).value
        login("alumno", correo, password, navigate)
    }

    return (
        isAuthenticated() ? <Navigate to={"/dashboard"} /> : 
        <Box sx={{ margin: "0 auto", textAlign: "center", width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Paper elevation={4} sx={{ display: "flex", width: "80%", minWidth: 275, maxWidth: 350, m: 1, p: 4, alignItems: "center", justifyContent: "center" }}>
                <Grid container spacing={0} alignItems={"center"}>
                    <Grid size={12} pt={3} pb={3}>
                        <Typography variant="h3">
                            Iniciar sesión
                        </Typography>
                    </Grid>
                    <Grid size={12} p={2} pb={0}>
                        <Box sx={{ width: "100%", display: 'flex', alignItems: 'flex-end' }}>
                            <Icon sx={{ color: 'action.active', mr: 1, my: 0.5 }}>mail</Icon>
                            <TextField id="correo" label="Correo" variant="standard" size="small" fullWidth />
                        </Box>
                    </Grid>
                    <Grid size={12} p={2}>
                        <Box sx={{ width: "100%", display: 'flex', alignItems: 'flex-end' }}>
                            <Icon sx={{ color: 'action.active', mr: 1, my: 0.5 }}>key</Icon>
                            <FormControl variant="standard" fullWidth>
                                <InputLabel htmlFor="contraseña">Password</InputLabel>
                                <Input
                                    id="contraseña"
                                    type={showPassword ? 'text' : 'password'}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label={
                                                    showPassword ? 'hide the password' : 'display the password'
                                                }
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                onMouseUp={handleMouseUpPassword}
                                            >
                                                {showPassword ? <Icon>visibility_off</Icon> : <Icon>visibility</Icon>}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid size={7} pt={1} pb={1}>
                        <FormControlLabel control={<Checkbox />} label={<Typography sx={{ fontSize: 12 }}>Mantener sesión iniciada</Typography>} />
                    </Grid>
                    <Grid size={5} pt={1} pb={1}>
                        <Link href="#" sx={{ fontSize: 12 }}>
                            Olvidé mi contraseña
                        </Link>
                    </Grid>
                    <Grid size={12} pt={2} pb={1}>
                        <Button variant="contained" sx={{ m: 1 }} onClick={handleLogin}>Iniciar Sesión</Button>
                    </Grid>
                    <Grid size={12}>
                        <Link href="/login/docentes" sx={{ fontSize: 12 }} color="textSecondary">
                            Iniciar sesión como docente
                        </Link>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    )
}