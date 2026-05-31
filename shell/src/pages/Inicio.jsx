import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Inicio() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Hola, {user?.nombre} 👋</h2>
        <button onClick={logout}>Salir</button>
      </div>

      <h3 style={{ marginBottom: '1rem' }}>¿Qué quieres aprender hoy?</h3>

      <div
        onClick={() => navigate('/palabras')}
        style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '1.5rem', marginBottom: '0.75rem', cursor: 'pointer' }}
      >
        <h3>🤟 Palabras</h3>
        <p style={{ color: '#666' }}>Aprende señas con flashcards y diccionario</p>
      </div>

      <div
        onClick={() => navigate('/mates')}
        style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '1.5rem', marginBottom: '0.75rem', cursor: 'pointer' }}
      >
        <h3>🔢 Matemáticas</h3>
        <p style={{ color: '#666' }}>Aprende números y operaciones en señas</p>
      </div>

      <div
        onClick={() => navigate('/camara')}
        style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '1.5rem', marginBottom: '0.75rem', cursor: 'pointer' }}
      >
        <h3>📷 Cámara</h3>
        <p style={{ color: '#666' }}>Practica tus señas con la cámara</p>
      </div>
    </div>
  )
}