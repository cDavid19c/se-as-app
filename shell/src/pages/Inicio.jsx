 import { useAuth } from '../context/AuthContext'

export default function Inicio() {
  const { user, logout } = useAuth()

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Hola, {user?.nombre}</h1>
      <p>Rol: {user?.rol}</p>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  )
}
