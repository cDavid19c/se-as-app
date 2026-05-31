import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Inicio from './pages/Inicio'
import Admin from './pages/Admin'
import Diccionario from './pages/palabras/Diccionario'
import DetallePalabra from './pages/palabras/DetallePalabra'
import Juego from './pages/palabras/Juego'
import FinSesion from './pages/palabras/FinSesion'
import Hub from './pages/palabras/Hub'

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
      <Route path="/palabras" element={<RutaProtegida><Hub /></RutaProtegida>} />
      <Route path="/palabras/diccionario" element={<RutaProtegida><Diccionario /></RutaProtegida>} />
      <Route path="/palabras/diccionario/:id" element={<RutaProtegida><DetallePalabra /></RutaProtegida>} />
      <Route path="/palabras/flashcards" element={<RutaProtegida><Juego /></RutaProtegida>} />
      <Route path="/palabras/flashcards/fin" element={<RutaProtegida><FinSesion /></RutaProtegida>} />
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