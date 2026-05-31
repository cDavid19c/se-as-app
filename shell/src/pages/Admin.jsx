import { useAuth } from '../context/AuthContext'
import { Routes, Route, Link } from 'react-router-dom'
import Categorias from './admin/palabras/Categorias'
import Niveles from './admin/palabras/Niveles'
import Flashcards from './admin/palabras/Flashcards'
import FlashcardForm from './admin/palabras/FlashcardForm'

export default function Admin() {
  const { user, logout } = useAuth()

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: '200px', background: '#1a1a2e', color: 'white', padding: '1rem' }}>
        <h3 style={{ marginBottom: '2rem' }}>Admin</h3>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {/* Palabras */}
          <p style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#666', marginTop: '1rem', marginBottom: '0.5rem' }}>Palabras</p>
          <Link to="/admin/palabras/categorias" style={{ color: 'white', paddingLeft: '1rem' }}>📁 Categorías</Link>
          <Link to="/admin/palabras/niveles" style={{ color: 'white', paddingLeft: '1rem' }}>📊 Niveles</Link>
          <Link to="/admin/palabras/flashcards" style={{ color: 'white', paddingLeft: '1rem' }}>🃏 Flashcards</Link>

          {/* Matemáticas */}
          <p style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#666', marginTop: '1rem', marginBottom: '0.5rem' }}>Matemáticas</p>
          <span style={{ color: '#999', paddingLeft: '1rem' }}>🔢 Próximamente...</span>

          {/* Cámara */}
          <p style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#666', marginTop: '1rem', marginBottom: '0.5rem' }}>Cámara</p>
          <span style={{ color: '#999', paddingLeft: '1rem' }}>📷 Próximamente...</span>
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
          <Route path="palabras/categorias" element={<Categorias />} />
          <Route path="palabras/niveles" element={<Niveles />} />
          <Route path="palabras/flashcards" element={<Flashcards />} />
          <Route path="palabras/flashcards/nueva" element={<FlashcardForm />} />
          <Route path="palabras/flashcards/:id/editar" element={<FlashcardForm />} />
        </Routes>
      </div>
    </div>
  )
}