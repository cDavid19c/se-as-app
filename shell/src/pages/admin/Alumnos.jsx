 import { useState, useEffect } from 'react'

const API = 'http://localhost:3001/api'

export default function Alumnos() {
  const [alumnos, setAlumnos] = useState([])
  const [nombre, setNombre] = useState('')
  const [avatar_id, setAvatarId] = useState('avatar1')
  const [error, setError] = useState('')
  const [pinGenerado, setPinGenerado] = useState(null)
  const [creando, setCreando] = useState(false)

  useEffect(() => {
    cargarAlumnos()
  }, [])

  const cargarAlumnos = async () => {
    const res = await fetch(`${API}/alumnos`, { credentials: 'include' })
    const data = await res.json()
    setAlumnos(data)
  }

  const handleCrear = async (e) => {
    e.preventDefault()
    setError('')
    setCreando(true)

    const res = await fetch(`${API}/alumnos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ nombre, avatar_id })
    })

    const data = await res.json()
    setCreando(false)

    if (!res.ok) return setError(data.error)

    setPinGenerado({ nombre: data.alumno.nombre, pin: data.pin })
    setNombre('')
    setAvatarId('avatar1')
    cargarAlumnos()
  }

  const handleResetPin = async (id, nombre) => {
    if (!confirm(`¿Regenerar PIN de ${nombre}?`)) return

    const res = await fetch(`${API}/alumnos/${id}/reset-pin`, {
      method: 'POST',
      credentials: 'include'
    })
    const data = await res.json()
    if (!res.ok) return alert(data.error)
    setPinGenerado({ nombre, pin: data.pin })
  }

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar este alumno?')) return
    await fetch(`${API}/alumnos/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    cargarAlumnos()
  }

  const AVATARES = ['avatar1', 'avatar2', 'avatar3', 'avatar4', 'avatar5', 'avatar6']

  return (
    <div style={{ padding: '2rem' }}>
      <h2>👨‍🎓 Alumnos</h2>

      {/* PIN generado */}
      {pinGenerado && (
        <div style={{ background: '#eafaf1', border: '1px solid #a9dfbf', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
          <p><strong>PIN generado para {pinGenerado.nombre}:</strong></p>
          <p style={{ fontSize: '2rem', letterSpacing: '0.5rem', fontWeight: 'bold' }}>
            {pinGenerado.pin.split('').join(' · ')}
          </p>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>Anótalo ahora, no se volverá a mostrar.</p>
          <button onClick={() => setPinGenerado(null)} style={{ marginTop: '0.5rem' }}>Entendido</button>
        </div>
      )}

      {/* Formulario crear alumno */}
      <form onSubmit={handleCrear} style={{ marginBottom: '2rem' }}>
        <h3>Nuevo alumno</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
          <input
            placeholder="Nombre del alumno"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
            style={{ padding: '0.5rem' }}
          />
          <select
            value={avatar_id}
            onChange={e => setAvatarId(e.target.value)}
            style={{ padding: '0.5rem' }}
          >
            {AVATARES.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={creando} style={{ padding: '0.5rem 1rem' }}>
          {creando ? 'Creando...' : 'Crear alumno'}
        </button>
      </form>

      {/* Tabla de alumnos */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc' }}>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Avatar</th>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Nombre</th>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map(alumno => (
            <tr key={alumno._id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.5rem' }}>{alumno.avatar_id}</td>
              <td style={{ padding: '0.5rem' }}>{alumno.nombre}</td>
              <td style={{ padding: '0.5rem' }}>
                <button
                  onClick={() => handleResetPin(alumno._id, alumno.nombre)}
                  style={{ marginRight: '0.5rem' }}
                >
                  🔑 Resetear PIN
                </button>
                <button
                  onClick={() => handleEliminar(alumno._id)}
                  style={{ color: 'red' }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {alumnos.length === 0 && (
            <tr>
              <td colSpan={3} style={{ padding: '1rem', textAlign: 'center', color: '#999' }}>
                No hay alumnos todavía
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
