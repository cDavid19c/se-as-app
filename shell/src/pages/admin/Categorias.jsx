 import { useState, useEffect } from 'react'

const API = 'http://localhost:3001/api'

export default function Categorias() {
  const [categorias, setCategorias] = useState([])
  const [nombre, setNombre] = useState('')
  const [icono, setIcono] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [editando, setEditando] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    cargarCategorias()
  }, [])

  const cargarCategorias = async () => {
    const res = await fetch(`${API}/categorias`, { credentials: 'include' })
    const data = await res.json()
    setCategorias(data)
  }

  const limpiarForm = () => {
    setNombre('')
    setIcono('')
    setDescripcion('')
    setEditando(null)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const url = editando ? `${API}/categorias/${editando}` : `${API}/categorias`
    const method = editando ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ nombre, icono, descripcion })
    })

    if (!res.ok) {
      const data = await res.json()
      return setError(data.error)
    }

    limpiarForm()
    cargarCategorias()
  }

  const handleEditar = (cat) => {
    setEditando(cat._id)
    setNombre(cat.nombre)
    setIcono(cat.icono || '')
    setDescripcion(cat.descripcion || '')
  }

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar esta categoría?')) return
    await fetch(`${API}/categorias/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    cargarCategorias()
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Categorías</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <h3>{editando ? 'Editar categoría' : 'Nueva categoría'}</h3>
        <div style={{ marginBottom: '0.5rem' }}>
          <input
            placeholder="Nombre"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
            style={{ padding: '0.5rem', marginRight: '0.5rem' }}
          />
          <input
            placeholder="Ícono (emoji)"
            value={icono}
            onChange={e => setIcono(e.target.value)}
            style={{ padding: '0.5rem', marginRight: '0.5rem', width: '120px' }}
          />
          <input
            placeholder="Descripción"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            style={{ padding: '0.5rem', marginRight: '0.5rem' }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ padding: '0.5rem 1rem', marginRight: '0.5rem' }}>
          {editando ? 'Guardar cambios' : 'Crear'}
        </button>
        {editando && (
          <button type="button" onClick={limpiarForm} style={{ padding: '0.5rem 1rem' }}>
            Cancelar
          </button>
        )}
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc' }}>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Ícono</th>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Nombre</th>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Descripción</th>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map(cat => (
            <tr key={cat._id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.5rem' }}>{cat.icono}</td>
              <td style={{ padding: '0.5rem' }}>{cat.nombre}</td>
              <td style={{ padding: '0.5rem' }}>{cat.descripcion}</td>
              <td style={{ padding: '0.5rem' }}>
                <button onClick={() => handleEditar(cat)} style={{ marginRight: '0.5rem' }}>
                  Editar
                </button>
                <button onClick={() => handleEliminar(cat._id)} style={{ color: 'red' }}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
