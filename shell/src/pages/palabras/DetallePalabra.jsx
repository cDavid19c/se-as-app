 import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const API = 'http://localhost:3001/api'

export default function DetallePalabra() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [flashcard, setFlashcard] = useState(null)

  const cargarFlashcard = async () => {
    const res = await fetch(`${API}/flashcards/${id}`, { credentials: 'include' })
    const data = await res.json()
    setFlashcard(data)
  }

  useEffect(() => {
    cargarFlashcard()
  }, [id])

  if (!flashcard) return <p style={{ padding: '2rem' }}>Cargando...</p>

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }}>
        ← Volver
      </button>

      <h2>{flashcard.palabra}</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        {flashcard.categoria_id?.icono} {flashcard.categoria_id?.nombre} — {flashcard.nivel_id?.nombre}
      </p>

      {flashcard.imagen_url && (
        <img
          src={flashcard.imagen_url}
          alt={flashcard.palabra}
          style={{ width: '100%', maxWidth: '300px', borderRadius: '8px', marginBottom: '1rem' }}
        />
      )}

      {flashcard.video_url && (
        <video
          src={flashcard.video_url}
          controls
          autoPlay
          loop
          muted
          style={{ width: '100%', maxWidth: '400px', borderRadius: '8px', marginBottom: '1rem' }}
        />
      )}

      {flashcard.descripcion && (
        <p style={{ marginTop: '1rem', fontSize: '1rem', lineHeight: '1.6' }}>
          {flashcard.descripcion}
        </p>
      )}
    </div>
  )
}
