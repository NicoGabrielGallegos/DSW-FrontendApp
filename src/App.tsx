import './App.css'
import "./commons/DateExtensions.tsx"
import { BrowserRouter, Routes, Route } from 'react-router'
import ScheduleBooking from './pages/ScheduleBooking.tsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/calendar" element={<ScheduleBooking />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
