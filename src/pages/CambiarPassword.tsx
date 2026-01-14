import Box from "@mui/material/Box";
import NavBar from "../components/shared/NavBar";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import { useNavigate } from "react-router";
import { ROUTES } from "../utils/routes";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { apiClient } from "../api/apiClient";
import { API_ROUTES } from "../api/endpoints";
import { useState } from "react";
import Alert from "@mui/material/Alert";

export default function CambiarPassword() {
    const [alert, setAlert] = useState<{ message?: string, severity?: "error" | "success" }>({})
    const navigate = useNavigate()
    const [disabled, setDisabled] = useState(false)

    const handleVolver = () => navigate(ROUTES.CONSULTAS)

    const handleCambiarPassword = async () => {
        const body = {
            currentPassword: (document.getElementById("currentPassword") as HTMLInputElement).value.trim(),
            newPassword: (document.getElementById("newPassword") as HTMLInputElement).value.trim(),
        }
        let repeatNewPassword = (document.getElementById("repeatNewPassword") as HTMLInputElement).value.trim()

        if (repeatNewPassword !== body.newPassword) {
            setAlert({ message: "Las nuevas contraseñas ingresadas no coinciden", severity: "error" })
            return
        }

        try {
            const res = await apiClient.post(API_ROUTES.AUTH.CAMBIAR_PASSWORD, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, body })
            setAlert({ message: `${res.message}. En breve será redireccionado a la página principal`, severity: "success" })
            setDisabled(true)
            setTimeout(handleVolver, 3000)

        } catch (err: any) {
            setAlert({ message: err.message, severity: "error" })
        }
    }

    return <>
        <NavBar>Cambiar contraseña</NavBar>
        <Box
            component="main"
            sx={{ flexGrow: 1, px: 2 }}
        >
            <Box display={"flex"}>
                <Button variant="text" startIcon={<Icon>arrow_back</Icon>} onClick={handleVolver}>Volver</Button>
            </Box>
            <Box>
                {alert.message && <Alert severity={alert.severity} sx={{ mb: 2 }} onClose={() => setAlert({})}>
                    {alert.message}
                </Alert>}
            </Box>
            <Box display={"flex"} justifyContent={"center"}>
                <Paper sx={{ p: 4, mt: 2, maxWidth: 500 }} elevation={3}>
                    <Typography variant="h5" color={disabled ? "textDisabled" : "textPrimary"}>Ingrese los siguientes datos</Typography>
                    <Grid container spacing={2} mt={2}>
                        <Grid size={12}>
                            <TextField id="currentPassword" label="Contraseña actual" size="small" variant="standard" fullWidth disabled={disabled}></TextField>
                        </Grid>
                        <Grid size={12}>
                            <TextField id="newPassword" label="Nueva contraseña" size="small" variant="standard" fullWidth disabled={disabled}></TextField>
                        </Grid>
                        <Grid size={12}>
                            <TextField id="repeatNewPassword" label="Repetir nueva contraseña" size="small" variant="standard" fullWidth disabled={disabled}></TextField>
                        </Grid>
                    </Grid>
                    <Grid container size={12} justifyContent={"end"} columnSpacing={2}>
                        <Button variant="outlined" sx={{ mt: 3 }} onClick={handleVolver} disabled={disabled}>Cancelar</Button>
                        <Button variant="contained" sx={{ mt: 3 }} onClick={handleCambiarPassword} disabled={disabled}>Cambiar contraseña</Button>
                    </Grid>
                </Paper>
            </Box>
        </Box>
    </>
}