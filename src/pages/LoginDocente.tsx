import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import Icon from '@mui/material/Icon';
import { useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Input from "@mui/material/Input";
import { Link, Navigate, useNavigate } from "react-router";
import { API_ROUTES } from "../api/endpoints.ts";
import { apiClient } from "../api/apiClient.ts";
import { useAuth } from "../context/AuthContext.tsx";
import { ROUTES } from "../utils/routes.ts";

export default function LoginDocente() {
    const [showPassword, setShowPassword] = useState(false);
    const [correoError, setCorreoError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const auth = useAuth()
    
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const setError = (value: boolean) => { setCorreoError(value); setPasswordError(value) }

    const handleLogin = async () => {
        const correo = (document.getElementById("correo") as HTMLInputElement).value
        const password = (document.getElementById("contraseña") as HTMLInputElement).value
        try {
            const token = (await apiClient.post(API_ROUTES.AUTH.LOGIN_ADMINISTRADORES, { body: { correo, password } })).data
            localStorage.setItem("token", token)
            auth.login(token)
        } catch (err: any) {

        }
        try {
            const token = (await apiClient.post(API_ROUTES.AUTH.LOGIN_DOCENTES, { body: { correo, password } })).data
            localStorage.setItem("token", token)
            auth.login(token)
        } catch (err: any) {
            setError(true)
        }
    }

    return (
        auth.isAuthenticated() ? <Navigate to={ROUTES.ADMIN.ROOT} /> :
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
                                <TextField error={correoError} id="correo" label="Correo" variant="standard" size="small" fullWidth onFocus={() => setCorreoError(false)} />
                            </Box>
                        </Grid>
                        <Grid size={12} p={2}>
                            <Box sx={{ width: "100%", display: 'flex', alignItems: 'flex-end' }}>
                                <Icon sx={{ color: 'action.active', mr: 1, my: 0.5 }}>key</Icon>
                                <FormControl variant="standard" fullWidth error={passwordError}>
                                    <InputLabel htmlFor="contraseña">Contraseña</InputLabel>
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
                                        onFocus={() => setPasswordError(false)}
                                    />
                                </FormControl>
                            </Box>
                        </Grid>
                        <Grid size={12} pt={2} pb={1}>
                            <Button variant="contained" sx={{ m: 1 }} onClick={handleLogin}>Iniciar Sesión</Button>
                        </Grid>
                        <Grid size={12}>
                            <Typography sx={{ fontSize: 12 }} color="textSecondary">
                                <Link to={ROUTES.LOGIN} replace>
                                    Ingresar como alumno
                                </Link>
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
    )
}