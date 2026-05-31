 import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const API = 'http://localhost:3001/api'

export default function Diccionario() {
  const [flashcards, setFlashcards] = useState([])
  const [categorias, setCategorias] = useState([])
  const [filtroCat, setFiltroCat] = useState('')
  const [filtroPalabra, setFiltroPalabra] = useState('')

  useEffect(() => {
    cargarCategorias()
  }, [])

  useEffect(() => {
    const delay = setTimeout(() => cargarFlashcards(), 300)
    return () => clearTimeout(delay)
  }, [filtroCat, filtroPalabra])

  const cargarFlashcards = async () => {
    const params = new URLSearchParams()
    if (filtroCat) params.append('categoria_id', filtroCat)
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

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📖 Diccionario</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          placeholder="Buscar palabra..."
          value={filtroPalabra}
          onChange={e => setFiltroPalabra(e.target.value)}
          style={{ padding: '0.5rem', fontSize: '1rem' }}
        />
        <select
          value={filtroCat}
          onChange={e => setFiltroCat(e.target.value)}
          style={{ padding: '0.5rem', fontSize: '1rem' }}
        >
          <option value="">Todas las categorías</option>
          {categorias.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.icono} {cat.nombre}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
        {flashcards.map(fc => (
          <Link key={fc._id} to={`/diccionario/${fc._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', textAlign: 'center', cursor: 'pointer' }}>
              {fc.imagen_url
                ? <img src={fc.imagen_url} alt={fc.palabra} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                : <div style={{ width: '80px', height: '80px', background: '#eee', borderRadius: '4px', margin: '0 auto' }} />
              }
              <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>{fc.palabra}</p>
              <p style={{ fontSize: '0.8rem', color: '#999' }}>{fc.categoria_id?.nombre}</p>
            </div>
          </Link>
        ))}
        {flashcards.length === 0 && (
          <p style={{ color: '#999' }}>No hay palabras todavía</p>
        )}
      </div>
    </div>
  )
}
