import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const API = 'http://localhost:3001/api'

export default function Inicio() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [niveles, setNiveles] = useState([])

  useEffect(() => {
    cargarNiveles()
  }, [])

  const cargarNiveles = async () => {
    const res = await fetch(`${API}/niveles`, { credentials: 'include' })
    const data = await res.json()
    setNiveles(data)
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Hola, {user?.nombre} 👋</h2>
        <button onClick={logout}>Salir</button>
      </div>

      <div
        onClick={() => navigate('/diccionario')}
        style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem', cursor: 'pointer' }}
      >
        <h3>📖 Diccionario</h3>
        <p style={{ color: '#666' }}>Explora todas las palabras por categoría</p>
      </div>

      <h3 style={{ marginBottom: '1rem' }}>🔥 Estudiar por nivel</h3>
      {niveles.map(nivel => (
        <div
          key={nivel._id}
          onClick={() => navigate(`/juego?nivel_id=${nivel._id}`)}
          style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '1.5rem', marginBottom: '0.75rem', cursor: 'pointer' }}
        >
          <h4>{nivel.nombre}</h4>
          <p style={{ color: '#666', fontSize: '0.85rem' }}>
            Máx. {nivel.config?.max_repasos_diarios} repasos · {nivel.config?.max_tarjetas_nuevas} nuevas por día
          </p>
        </div>
      ))}
    </div>
  )
}