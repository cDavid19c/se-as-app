import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const API = 'http://localhost:3001/api'

const EMOJIS = [
  { label: '😵 No la sé', valor: 1 },
  { label: '🤔 Más o menos', valor: 3 },
  { label: '😎 ¡La sé!', valor: 5 },
]

export default function Juego() {
  const [searchParams] = useSearchParams()
  const nivel_id = searchParams.get('nivel_id')
  const navigate = useNavigate()

  const [sesion, setSesion] = useState([])
  const [indice, setIndice] = useState(0)
  const [volteada, setVolteada] = useState(false)
  const [cargando, setCargando] = useState(true)
  const videoRef = useRef(null)
  const preloadRef = useRef(null)

  const cargarSesion = async () => {
    setCargando(true)
    const params = nivel_id ? `?nivel_id=${nivel_id}` : ''
    const res = await fetch(`${API}/progreso/sesion${params}`, { credentials: 'include' })
    const data = await res.json()
    setSesion(data)
    setCargando(false)
  }

  useEffect(() => {
    cargarSesion()
  }, [nivel_id])

  const handleVoltear = () => {
    setVolteada(true)
    if (videoRef.current) videoRef.current.play()
  }

  const handleCalificar = async (valor) => {
    const flashcard = sesion[indice]
    await fetch(`${API}/progreso/evaluar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        flashcard_id: flashcard._id,
        calificacion: valor,
        tipoJuego: 'flashcards'
      })
    })

    if (indice + 1 >= sesion.length) {
      navigate('/palabras/flashcards/fin')
    } else {
      setVolteada(false)
      setIndice(i => i + 1)
    }
  }

  if (cargando) return <p style={{ padding: '2rem' }}>Cargando sesión...</p>
  if (sesion.length === 0) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>🎉 ¡Todo al día!</h2>
      <p>No tienes palabras pendientes por ahora.</p>
      <button onClick={() => navigate('/inicio')} style={{ padding: '0.5rem 1.5rem', marginTop: '1rem' }}>
        Volver al inicio
      </button>
    </div>
  )

  const flashcard = sesion[indice]
  const siguiente = sesion[indice + 1]

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
      {/* Progreso */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ background: '#eee', borderRadius: '4px', height: '8px' }}>
          <div style={{
            background: '#6c63ff',
            height: '8px',
            borderRadius: '4px',
            width: `${((indice) / sesion.length) * 100}%`,
            transition: 'width 0.3s'
          }} />
        </div>
        <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.25rem' }}>
          {indice + 1} / {sesion.length}
        </p>
      </div>

      {/* Tarjeta */}
      <div
        onClick={!volteada ? handleVoltear : undefined}
        style={{
          border: '2px solid #ddd',
          borderRadius: '16px',
          padding: '2rem',
          minHeight: '300px',
          cursor: volteada ? 'default' : 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: volteada ? '#f9f9ff' : 'white',
          transition: 'background 0.3s'
        }}
      >
        {!volteada ? (
          <>
            {flashcard.imagen_url && (
              <img
                src={flashcard.imagen_url}
                alt={flashcard.palabra}
                style={{ width: '160px', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }}
              />
            )}
            <h2 style={{ fontSize: '2rem' }}>{flashcard.palabra}</h2>
            <p style={{ color: '#999', marginTop: '0.5rem' }}>Toca para ver la seña</p>
          </>
        ) : (
          <>
            {flashcard.video_url && (
              <video
                ref={videoRef}
                src={flashcard.video_url}
                autoPlay
                loop
                muted
                style={{ width: '100%', maxWidth: '300px', borderRadius: '8px', marginBottom: '1rem' }}
              />
            )}
            {flashcard.descripcion && (
              <p style={{ color: '#555' }}>{flashcard.descripcion}</p>
            )}
          </>
        )}
      </div>

      {/* Precarga del siguiente video */}
      {siguiente?.video_url && (
        <video
          ref={preloadRef}
          src={siguiente.video_url}
          preload="metadata"
          style={{ display: 'none' }}
        />
      )}

      {/* Botones de calificación */}
      {volteada && (
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', justifyContent: 'center' }}>
          {EMOJIS.map(e => (
            <button
              key={e.valor}
              onClick={() => handleCalificar(e.valor)}
              style={{ padding: '0.75rem 1rem', fontSize: '1rem', borderRadius: '8px', cursor: 'pointer' }}
            >
              {e.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 
