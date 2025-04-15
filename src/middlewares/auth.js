const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const clientId = req.headers['client_id'] || null;

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required',
        client_id: clientId
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Sesuaikan dengan payload token Anda
    req.user = {
      userId: decoded.userId,  // Dari payload token: "userId"
      username: decoded.username
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token',
      client_id: req.headers['client_id'] || null
    });
  }
};

module.exports = auth;