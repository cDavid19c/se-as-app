 import { useNavigate } from 'react-router-dom'

export default function FinSesion() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '2rem', textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
      <h2>¡Sesión completada!</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Completaste todas tus señas de hoy. ¡Vuelve mañana para seguir aprendiendo!
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button
          onClick={() => navigate('/palabras/diccionario')}
          style={{ padding: '0.75rem', fontSize: '1rem', borderRadius: '8px', cursor: 'pointer' }}
        >
          📖 Explorar diccionario
        </button>
        <button
          onClick={() => navigate('/inicio')}
          style={{ padding: '0.75rem', fontSize: '1rem', borderRadius: '8px', cursor: 'pointer' }}
        >
          🏠 Volver al inicio
        </button>
      </div>
    </div>
  )
}
