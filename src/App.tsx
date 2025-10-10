import './App.css'
import "./commons/DateExtensions.tsx"
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import ScheduleBooking from './pages/ScheduleBooking.tsx'
import LoginAlumno from './pages/LoginAlumno.tsx'
import LoginDocente from './pages/LoginDocente.tsx'
import AdminPanel from './pages/AdminPanel.tsx'
import DataTable from './components/admin_panel/DataTable.tsx'
import Materias from './pages/Materias.tsx'
import Dashboard from './pages/Dashboard.tsx'

function App() {
  return (
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
          <Route index element={<Dashboard />} />
          <Route path="materias" element={<Materias />} />

        </Route>
        <Route path="admin" element={<AdminPanel />}>
          <Route path="alumnos" element={<DataTable />} />
          <Route path="docentes" element={<>CRUD Docentes</>} />
          <Route path="materias" element={<>CRUD Materias</>} />
          <Route path="dictados" element={<>CRUD Dictados</>} />
          <Route path="inscripciones" element={<>CRUD Inscripciones</>} />
          <Route path="consultas" element={<>CRUD Consultas</>} />
          <Route path="calificaciones" element={<>CRUD Calificaciones</>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
