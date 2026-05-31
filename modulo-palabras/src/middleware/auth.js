const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.cookies.auth_token;

  if (!token) {
    if (process.env.NODE_ENV === 'development') {
      req.user = { sub: 'mock-id-123', rol: 'alumno', nombre: 'Dev User' };
      return next();
    }
    return res.status(401).json({ error: 'No autenticado' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = authMiddleware;