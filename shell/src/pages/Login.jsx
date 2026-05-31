
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [nombre, setNombre] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const { setUser } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ nombre, pin })
      })
      const data = await res.json()
      if (!res.ok) return setError(data.error)

      const me = await fetch('http://localhost:3001/api/auth/me', {
        credentials: 'include'
      })
      const usuario = await me.json()
      setUser(usuario)

      if (usuario.rol === 'profesor' || usuario.rol === 'superadmin') {
        navigate('/admin')
      } else {
        navigate('/inicio')
      }
    } catch (err) {
      setError('Error de conexión')
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Iniciar sesión</h1>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            style={{ display: 'block', width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>PIN</label>
          <input
            type="password"
            value={pin}
            onChange={e => setPin(e.target.value)}
            style={{ display: 'block', width: '100%', padding: '0.5rem' }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ padding: '0.5rem 2rem' }}>
          Entrar
        </button>
      </form>
    </div>
  )
}