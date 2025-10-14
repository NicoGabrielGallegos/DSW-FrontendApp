import './App.css'
import "./commons/DateExtensions.tsx"
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import ScheduleBooking from './pages/ScheduleBooking.tsx'
import LoginAlumno from './pages/LoginAlumno.tsx'
import LoginDocente from './pages/LoginDocente.tsx'
import AdminPanel from './pages/admin/AdminPanel.tsx'
import DataTable from './components/admin_panel/DataTable.tsx'
import Materias from './pages/Materias.tsx'
import Dashboard from './pages/Dashboard.tsx'
import { PrivateRoute } from './components/PrivateRouter.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import Docentes from './pages/Docentes.tsx'
import Consultas from './pages/Consultas.tsx'
import MateriasCRUD from './pages/admin/MateriasCRUD.tsx'
import DocentesCRUD from './pages/admin/DocentesCRUD.tsx'
import DictadosCRUD from './pages/admin/DictadosCRUD.tsx'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="calendar" element={<ScheduleBooking />} />
          <Route path="login">
            <Route index element={<Navigate to="/login/alumnos" replace />} />
            <Route path="alumnos" element={<LoginAlumno />} />
            <Route path="docentes" element={<LoginDocente />} />
            <Route
              path="*"
              element={<Navigate to="/login/alumnos" replace />}
            />
          </Route>
          <Route path="dashboard">
            <Route index element={<PrivateRoute redirectTo="/login/alumnos"><Dashboard /></PrivateRoute>} />
            <Route path="materias" element={<PrivateRoute redirectTo="/login/alumnos"><Materias /></PrivateRoute>} />
            <Route path="docentes" element={<PrivateRoute redirectTo="/login/alumnos"><Docentes /></PrivateRoute>} />
            <Route path="consultas" element={<PrivateRoute redirectTo="/login/alumnos"><Consultas /></PrivateRoute>} />
          </Route>
          <Route path="admin" element={<AdminPanel />}>
            <Route path="alumnos" element={<></>} />
            <Route path="docentes" element={<DocentesCRUD />} />
            <Route path="materias" element={<MateriasCRUD />} />
            <Route path="dictados" element={<DictadosCRUD />} />
            <Route path="inscripciones" element={<>CRUD Inscripciones</>} />
            <Route path="consultas" element={<>CRUD Consultas</>} />
            <Route path="calificaciones" element={<>CRUD Calificaciones</>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
