import './App.css'
import "./commons/DateExtensions.tsx"
import { BrowserRouter, Routes, Route } from 'react-router'
import ScheduleBooking from './pages/ScheduleBooking.tsx'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'
import AdminPanel from './pages/AdminPanel.tsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="calendar" element={<ScheduleBooking />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="admin" element={<AdminPanel />}>
          <Route path="alumnos" element={<>CRUD Alumnos</>} />
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
