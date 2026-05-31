 import { useAuth } from '../context/AuthContext'

export default function Admin() {
  const { user, logout } = useAuth()

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Panel Admin</h1>
      <p>Hola, {user?.nombre}</p>
      <p>Rol: {user?.rol}</p>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  )
}
