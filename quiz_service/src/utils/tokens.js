const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

function generateAccessToken(payload) {
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.accessExpiresIn,
    issuer: jwtConfig.issuer,
    audience: jwtConfig.audience,
  });
}

function generateRefreshToken(payload) {
  return jwt.sign({ ...payload, type: 'refresh' }, jwtConfig.secret, {
    expiresIn: jwtConfig.refreshExpiresIn,
    issuer: jwtConfig.issuer,
    audience: jwtConfig.audience,
  });
}

function verifyToken(token) {
  return jwt.verify(token, jwtConfig.secret);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
};
