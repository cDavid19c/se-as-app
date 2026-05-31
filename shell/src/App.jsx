import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Inicio from './pages/Inicio'
import Admin from './pages/Admin'
import Diccionario from './pages/alumno/Diccionario'
import DetallePalabra from './pages/alumno/DetallePalabra'
import Juego from './pages/alumno/Juego'
import FinSesion from './pages/alumno/FinSesion'

function RutaProtegida({ children }) {
  const { user } = useAuth()
  if (user === undefined) return <p>Cargando...</p>
  if (!user) return <Navigate to="/" />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/inicio" element={<RutaProtegida><Inicio /></RutaProtegida>} />
      <Route path="/admin/*" element={<RutaProtegida><Admin /></RutaProtegida>} />
      <Route path="/diccionario" element={<RutaProtegida><Diccionario /></RutaProtegida>} />
      <Route path="/diccionario/:id" element={<RutaProtegida><DetallePalabra /></RutaProtegida>} />
      <Route path="/juego" element={<RutaProtegida><Juego /></RutaProtegida>} />
      <Route path="/juego/fin" element={<RutaProtegida><FinSesion /></RutaProtegida>} />
      <Route path="/palabras/*" element={<h1>Módulo Palabras</h1>} />
      <Route path="/mates/*" element={<h1>Módulo Mates</h1>} />
      <Route path="/camara/*" element={<h1>Módulo Cámara</h1>} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}