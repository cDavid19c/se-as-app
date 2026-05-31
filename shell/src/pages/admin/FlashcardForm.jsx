 import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API = 'http://localhost:3001/api'

export default function FlashcardForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const esEdicion = Boolean(id)

  const [categorias, setCategorias] = useState([])
  const [niveles, setNiveles] = useState([])
  const [palabra, setPalabra] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [categoria_id, setCategoriaId] = useState('')
  const [nivel_id, setNivelId] = useState('')
  const [imagen_url, setImagenUrl] = useState('')
  const [video_url, setVideoUrl] = useState('')
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    cargarCategorias()
    cargarNiveles()
    if (esEdicion) cargarFlashcard()
  }, [])

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

  const cargarFlashcard = async () => {
    const res = await fetch(`${API}/flashcards/${id}`, { credentials: 'include' })
    const data = await res.json()
    setPalabra(data.palabra)
    setDescripcion(data.descripcion || '')
    setCategoriaId(data.categoria_id?._id || '')
    setNivelId(data.nivel_id?._id || '')
    setImagenUrl(data.imagen_url || '')
    setVideoUrl(data.video_url || '')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setGuardando(true)

    const url = esEdicion ? `${API}/flashcards/${id}` : `${API}/flashcards`
    const method = esEdicion ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ palabra, descripcion, imagen_url, video_url, categoria_id, nivel_id })
    })

    setGuardando(false)

    if (!res.ok) {
      const data = await res.json()
      return setError(data.error)
    }

    navigate('/admin/flashcards')
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px' }}>
      <h2>{esEdicion ? 'Editar flashcard' : 'Nueva flashcard'}</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Palabra</label>
          <input
            value={palabra}
            onChange={e => setPalabra(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Descripción</label>
          <textarea
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            rows={3}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Categoría</label>
          <select
            value={categoria_id}
            onChange={e => setCategoriaId(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          >
            <option value="">Seleccionar categoría</option>
            {categorias.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.icono} {cat.nombre}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Nivel</label>
          <select
            value={nivel_id}
            onChange={e => setNivelId(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          >
            <option value="">Seleccionar nivel</option>
            {niveles.map(n => (
              <option key={n._id} value={n._id}>{n.nombre}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>URL de imagen</label>
          <input
            value={imagen_url}
            onChange={e => setImagenUrl(e.target.value)}
            placeholder="https://..."
            style={{ width: '100%', padding: '0.5rem' }}
          />
          {imagen_url && (
            <img src={imagen_url} alt="preview" style={{ marginTop: '0.5rem', width: '100px', height: '100px', objectFit: 'cover' }} />
          )}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>URL de video</label>
          <input
            value={video_url}
            onChange={e => setVideoUrl(e.target.value)}
            placeholder="https://..."
            style={{ width: '100%', padding: '0.5rem' }}
          />
          {video_url && (
            <video src={video_url} controls style={{ marginTop: '0.5rem', width: '200px' }} />
          )}
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" disabled={guardando} style={{ padding: '0.5rem 1.5rem' }}>
            {guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear flashcard'}
          </button>
          <button type="button" onClick={() => navigate('/admin/flashcards')} style={{ padding: '0.5rem 1.5rem' }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
