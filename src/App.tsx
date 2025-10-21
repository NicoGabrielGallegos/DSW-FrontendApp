import './App.css'
import "./commons/DateExtensions.tsx"
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import LoginAlumno from './pages/LoginAlumno.tsx'
import LoginDocente from './pages/LoginDocente.tsx'
import AdminPanel from './pages/admin/AdminPanel.tsx'
import Materias from './pages/Materias.tsx'
import Home from './pages/Home.tsx'
import { PrivateRoute } from './components/shared/PrivateRouter.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import Docentes from './pages/Docentes.tsx'
import Consultas from './pages/Consultas.tsx'
import MateriasCRUD from './pages/admin/MateriasCRUD.tsx'
import DocentesCRUD from './pages/admin/DocentesCRUD.tsx'
import DictadosCRUD from './pages/admin/DictadosCRUD.tsx'
import AlumnosCRUD from './pages/admin/AlumnosCRUD.tsx'
import InscripcionesCRUD from './pages/admin/InscripcionesCRUD.tsx'
import ConsultasCRUD from './pages/admin/ConsultasCRUD.tsx'
import { ROUTES } from './utils/routes.ts'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.LOGIN}>
            <Route index element={<Navigate to={ROUTES.LOGIN_ALUMNOS} replace />} />
            <Route path={ROUTES.LOGIN_ALUMNOS} element={<LoginAlumno />} />
            <Route path={ROUTES.LOGIN_DOCENTES} element={<LoginDocente />} />
            <Route
              path="*"
              element={<Navigate to={ROUTES.LOGIN_ALUMNOS} replace />}
            />
          </Route>
          <Route path={ROUTES.HOME} element=
            {
              <PrivateRoute redirectTo={ROUTES.LOGIN_ALUMNOS} replace>
                <Home />
              </PrivateRoute>
            }
          />
          <Route path={ROUTES.MATERIAS} element=
            {
              <PrivateRoute redirectTo={ROUTES.LOGIN_ALUMNOS} replace>
                <Materias />
              </PrivateRoute>
            }
          />
          <Route path={ROUTES.DOCENTES} element=
            {
              <PrivateRoute redirectTo={ROUTES.LOGIN_ALUMNOS} replace>
                <Docentes />
              </PrivateRoute>
            }
          />
          <Route path={ROUTES.CONSULTAS} element=
            {
              <PrivateRoute redirectTo={ROUTES.LOGIN_ALUMNOS} replace>
                <Consultas />
              </PrivateRoute>
            }
          />
          <Route path={ROUTES.ADMIN.ROOT} element=
            {
              <PrivateRoute authorizedRoles={["administrador"]} redirectTo={ROUTES.HOME} replace>
                <AdminPanel />
              </PrivateRoute>
            }
          >
            <Route path={ROUTES.ADMIN.CRUD_ALUMNOS} element={<AlumnosCRUD />} />
            <Route path={ROUTES.ADMIN.CRUD_DOCENTES} element={<DocentesCRUD />} />
            <Route path={ROUTES.ADMIN.CRUD_MATERIAS} element={<MateriasCRUD />} />
            <Route path={ROUTES.ADMIN.CRUD_DICTADOS} element={<DictadosCRUD />} />
            <Route path={ROUTES.ADMIN.CRUD_INSCRIPCIONES} element={<InscripcionesCRUD />} />
            <Route path={ROUTES.ADMIN.CRUD_CONSULTAS} element={<ConsultasCRUD />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
