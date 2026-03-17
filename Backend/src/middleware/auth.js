const jwt = require('jsonwebtoken');
const { HTTP_STATUS_CODES } = require('../constants/http');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;