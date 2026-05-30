import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/"        element={<h1>Login</h1>} />
      <Route path="/palabras/*" element={<h1>Módulo Palabras</h1>} />
      <Route path="/mates/*"    element={<h1>Módulo Mates</h1>} />
      <Route path="/camara/*"   element={<h1>Módulo Cámara</h1>} />
    </Routes>
  )
}

export default App