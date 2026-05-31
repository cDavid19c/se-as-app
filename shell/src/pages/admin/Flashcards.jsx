 import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const API = 'http://localhost:3001/api'

export default function Flashcards() {
  const [flashcards, setFlashcards] = useState([])
  const [categorias, setCategorias] = useState([])
  const [niveles, setNiveles] = useState([])
  const [filtroCat, setFiltroCat] = useState('')
  const [filtroNivel, setFiltroNivel] = useState('')
  const [filtroPalabra, setFiltroPalabra] = useState('')

  useEffect(() => {
    cargarCategorias()
    cargarNiveles()
  }, [])

  useEffect(() => {
    cargarFlashcards()
  }, [filtroCat, filtroNivel, filtroPalabra])

  const cargarFlashcards = async () => {
    const params = new URLSearchParams()
    if (filtroCat) params.append('categoria_id', filtroCat)
    if (filtroNivel) params.append('nivel_id', filtroNivel)
    if (filtroPalabra) params.append('palabra', filtroPalabra)
    const res = await fetch(`${API}/flashcards?${params}`, { credentials: 'include' })
    const data = await res.json()
    setFlashcards(data)
  }

  const cargarCategorias = async () => {
    const res = await fetch(`${API}/categorias`, { credentials: 'include' })
    const data = await res.json()
    setCategorias(data)
  }

  const cargarNiveles = async () => {
    const res = await fetch(`${API}/niveles`, { credentials: 'include' })
    const data = await res.json()
    setNiveles(data)
  }

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar esta flashcard?')) return
    await fetch(`${API}/flashcards/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    cargarFlashcards()
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Flashcards</h2>
        <Link to="/admin/flashcards/nueva">
          <button style={{ padding: '0.5rem 1rem' }}>+ Nueva flashcard</button>
        </Link>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          placeholder="Buscar por palabra..."
          value={filtroPalabra}
          onChange={e => setFiltroPalabra(e.target.value)}
          style={{ padding: '0.5rem' }}
        />
        <select
          value={filtroCat}
          onChange={e => setFiltroCat(e.target.value)}
          style={{ padding: '0.5rem' }}
        >
          <option value="">Todas las categorías</option>
          {categorias.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.icono} {cat.nombre}</option>
          ))}
        </select>
        <select
          value={filtroNivel}
          onChange={e => setFiltroNivel(e.target.value)}
          style={{ padding: '0.5rem' }}
        >
          <option value="">Todos los niveles</option>
          {niveles.map(n => (
            <option key={n._id} value={n._id}>{n.nombre}</option>
          ))}
        </select>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc' }}>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Palabra</th>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Categoría</th>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Nivel</th>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Imagen</th>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Video</th>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {flashcards.map(fc => (
            <tr key={fc._id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.5rem' }}>{fc.palabra}</td>
              <td style={{ padding: '0.5rem' }}>{fc.categoria_id?.nombre}</td>
              <td style={{ padding: '0.5rem' }}>{fc.nivel_id?.nombre}</td>
              <td style={{ padding: '0.5rem' }}>
                {fc.imagen_url ? <img src={fc.imagen_url} alt={fc.palabra} style={{ width: '50px', height: '50px', objectFit: 'cover' }} /> : '—'}
              </td>
              <td style={{ padding: '0.5rem' }}>
                {fc.video_url ? <a href={fc.video_url} target="_blank" rel="noreferrer">Ver</a> : '—'}
              </td>
              <td style={{ padding: '0.5rem' }}>
                <Link to={`/admin/flashcards/${fc._id}/editar`}>
                  <button style={{ marginRight: '0.5rem' }}>Editar</button>
                </Link>
                <button onClick={() => handleEliminar(fc._id)} style={{ color: 'red' }}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {flashcards.length === 0 && (
            <tr>
              <td colSpan={6} style={{ padding: '1rem', textAlign: 'center', color: '#999' }}>
                No hay flashcards todavía
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
