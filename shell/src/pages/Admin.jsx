import { useAuth } from '../context/AuthContext'
import { Routes, Route, Link } from 'react-router-dom'
import Categorias from './admin/Categorias'
import Niveles from './admin/Niveles'

export default function Admin() {
  const { user, logout } = useAuth()

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: '200px', background: '#1a1a2e', color: 'white', padding: '1rem' }}>
        <h3 style={{ marginBottom: '2rem' }}>Admin</h3>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link to="/admin/categorias" style={{ color: 'white' }}>📁 Categorías</Link>
          <Link to="/admin/niveles"    style={{ color: 'white' }}>📊 Niveles</Link>
          <Link to="/admin/flashcards" style={{ color: 'white' }}>🃏 Flashcards</Link>
          <Link to="/admin/alumnos"    style={{ color: 'white' }}>👨‍🎓 Alumnos</Link>
        </nav>
        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
          <p style={{ fontSize: '0.85rem' }}>{user?.nombre}</p>
          <button onClick={logout}>Salir</button>
        </div>
      </div>

      {/* Contenido */}
      <div style={{ flex: 1, padding: '1rem' }}>
        <Routes>
          <Route index element={<h2>Bienvenido, {user?.nombre}</h2>} />
          <Route path="categorias" element={<Categorias />} />
          <Route path="niveles" element={<Niveles />} />
        </Routes>
      </div>
    </div>
  )
}