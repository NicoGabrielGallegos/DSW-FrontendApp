import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import type { Dictado as D } from '../../types/Dictado.ts';
import type { Consulta as C } from '../../types/Consulta.ts';
import type { Materia } from '../../types/Materia.ts';
import type { Docente } from '../../types/Docente.ts';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';

type Consulta = C<D<Docente, Materia>>

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: 24,
    width: { xs: "80%" },
    maxWidth: 800,
    p: 4,
};

export default function ConsultaInscripcionModal({ data, open, handleClose, handleInscripcion, done, alert, onCloseAlert }: { data: { consulta?: Consulta, materia?: Materia, docente?: Docente }, open: boolean, handleClose: () => void, handleInscripcion: () => void, done: boolean, alert: {message?: string, severity?: "error" | "success"}, onCloseAlert: () => void }) {
    let horaInicio = data.consulta ? new Date(data.consulta.horaInicio) : undefined
    let horaFin = data.consulta ? new Date(data.consulta.horaFin) : undefined

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
                keepMounted
            >
                <Paper sx={style}>
                    {alert.message && <Alert severity={alert.severity} sx={{ mb: 2 }} onClose={onCloseAlert}>
                        {alert.message}
                    </Alert>}
                    <Typography color="textSecondary" fontSize={{ xs: "0.8rem", md: "1rem" }}>
                        Inscripción a consulta
                    </Typography>
                    <Typography variant="h5" component="div" sx={{ fontSize: { xs: "1rem", md: "1.4rem", lg: "1.5rem" } }}>
                        {data.materia?.descripcion || ""}
                    </Typography>
                    <Typography component="div" color="textSecondary" align="inherit" fontSize={{ xs: "0.8rem", md: "1rem" }}>
                        Docente: <Typography color="textPrimary" component="span" fontSize="inherit">{data.docente?.apellido || ""} {data.docente?.nombre || ""}</Typography>
                    </Typography>
                    <Typography component="div" color="textSecondary" align="inherit" fontSize={{ xs: "0.8rem", md: "1rem" }}>
                        Fecha: <Typography color="textPrimary" component="span" fontSize="inherit">{horaInicio?.dateString()}</Typography>
                    </Typography>
                    <Typography component="div" color="textSecondary" align="inherit" fontSize={{ xs: "0.8rem", md: "1rem" }}>
                        Desde: <Typography color="textPrimary" component="span" fontSize="inherit">{horaInicio?.timeString()}</Typography> -
                        Hasta: <Typography color="textPrimary" component="span" fontSize="inherit">{horaFin?.timeString()}</Typography>
                    </Typography>
                    {done &&
                        <Grid container spacing={2} justifyContent={"flex-end"} mt={1}>
                            <Grid size={{ xs: 12, sm: "auto" }}>
                                <Button variant="outlined" color="error" sx={{ fontSize: { xs: "0.6rem", md: "0.8rem" } }} fullWidth onClick={handleClose}>Cerrar</Button>
                            </Grid>
                        </Grid>
                    }
                    {!done &&
                        <Grid container spacing={2} justifyContent={"flex-end"} rowSpacing={1} mt={1}>
                            <Grid size={{ xs: 12, sm: "auto" }}>
                                <Button variant="outlined" color="error" sx={{ fontSize: { xs: "0.6rem", md: "0.8rem" } }} fullWidth onClick={handleClose}>Cancelar</Button>
                            </Grid>
                            <Grid size={{ xs: 12, sm: "auto" }}>
                                <Button variant="contained" sx={{ fontSize: { xs: "0.6rem", md: "0.8rem" } }} fullWidth onClick={handleInscripcion}>Confirmar Inscripción</Button>
                            </Grid>
                        </Grid>}
                </Paper>
            </Modal>
        </div>
    );
}