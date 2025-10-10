import Grid from "@mui/material/Grid";
import MateriaCard from "../components/MateriaCard";
import ResponsiveDrawer from "../components/ResponsiveDrawer";

export default function Materias() {
    return (
        <ResponsiveDrawer title="Materias">
            <Grid container>
                <Grid size={12}>
                    <MateriaCard id="1" nombreMateria="Bases de Datos" />
                </Grid>
            </Grid>
        </ResponsiveDrawer>
    )
}