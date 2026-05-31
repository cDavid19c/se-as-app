 import { useState, useEffect } from 'react'

const API = 'http://localhost:3001/api'

export default function Niveles() {
  const [niveles, setNiveles] = useState([])
  const [categorias, setCategorias] = useState([])
  const [nombre, setNombre] = useState('')
  const [categoria_id, setCategoriaId] = useState('')
  const [max_repasos, setMaxRepasos] = useState(20)
  const [max_nuevas, setMaxNuevas] = useState(5)
  const [editando, setEditando] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    cargarNiveles()
    cargarCategorias()
  }, [])

  const cargarNiveles = async () => {
    const res = await fetch(`${API}/niveles`, { credentials: 'include' })
    const data = await res.json()
    setNiveles(data)
  }

  const cargarCategorias = async () => {
    const res = await fetch(`${API}/categorias`, { credentials: 'include' })
    const data = await res.json()
    setCategorias(data)
  }

  const limpiarForm = () => {
    setNombre('')
    setCategoriaId('')
    setMaxRepasos(20)
    setMaxNuevas(5)
    setEditando(null)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const body = {
      nombre,
      categoria_id,
      orden: niveles.length + 1,
      config: {
        max_repasos_diarios: max_repasos,
        max_tarjetas_nuevas: max_nuevas
      }
    }

    const url = editando ? `${API}/niveles/${editando}` : `${API}/niveles`
    const method = editando ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body)
    })

    if (!res.ok) {
      const data = await res.json()
      return setError(data.error)
    }

    limpiarForm()
    cargarNiveles()
  }

  const handleEditar = (nivel) => {
    setEditando(nivel._id)
    setNombre(nivel.nombre)
    setCategoriaId(nivel.categoria_id)
    setMaxRepasos(nivel.config?.max_repasos_diarios || 20)
    setMaxNuevas(nivel.config?.max_tarjetas_nuevas || 5)
  }

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar este nivel?')) return
    await fetch(`${API}/niveles/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    cargarNiveles()
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Niveles</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <h3>{editando ? 'Editar nivel' : 'Nuevo nivel'}</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
          <input
            placeholder="Nombre del nivel"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
            style={{ padding: '0.5rem' }}
          />
          <select
            value={categoria_id}
            onChange={e => setCategoriaId(e.target.value)}
            required
            style={{ padding: '0.5rem' }}
          >
            <option value="">Seleccionar categoría</option>
            {categorias.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.icono} {cat.nombre}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Máx. repasos diarios"
            value={max_repasos}
            onChange={e => setMaxRepasos(Number(e.target.value))}
            style={{ padding: '0.5rem', width: '160px' }}
          />
          <input
            type="number"
            placeholder="Máx. tarjetas nuevas"
            value={max_nuevas}
            onChange={e => setMaxNuevas(Number(e.target.value))}
            style={{ padding: '0.5rem', width: '160px' }}
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
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Nombre</th>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Categoría</th>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Repasos/día</th>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Nuevas/día</th>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {niveles.map(nivel => (
            <tr key={nivel._id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.5rem' }}>{nivel.nombre}</td>
              <td style={{ padding: '0.5rem' }}>
                {categorias.find(c => c._id === nivel.categoria_id)?.nombre || nivel.categoria_id}
              </td>
              <td style={{ padding: '0.5rem' }}>{nivel.config?.max_repasos_diarios}</td>
              <td style={{ padding: '0.5rem' }}>{nivel.config?.max_tarjetas_nuevas}</td>
              <td style={{ padding: '0.5rem' }}>
                <button onClick={() => handleEditar(nivel)} style={{ marginRight: '0.5rem' }}>
                  Editar
                </button>
                <button onClick={() => handleEliminar(nivel._id)} style={{ color: 'red' }}>
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
