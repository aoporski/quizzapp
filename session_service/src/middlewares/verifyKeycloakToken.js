const jwt = require('jsonwebtoken');
const jwksRsa = require('jwks-rsa');

const client = jwksRsa({
  jwksUri: 'http://keycloak:8080/realms/quizzapp/protocol/openid-connect/certs',
  cache: true,
  rateLimit: true,
});

const getKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      console.error('Błąd pobierania klucza:', err);
      return callback(err);
    }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
};

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Brak tokena Bearer' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(
    token,
    getKey,
    {
      algorithms: ['RS256'],
      issuer: 'http://localhost:8080/realms/quizzapp',
      audience: 'account',
    },
    (err, decoded) => {
      if (err) {
        console.error('Nieprawidłowy token:', err);
        return res.status(401).json({ message: 'Token nieważny' });
      }

      req.user = {
        keycloakId: decoded.sub,
        email: decoded.email,
        preferred_username: decoded.preferred_username,
        given_name: decoded.given_name,
        family_name: decoded.family_name,
        roles: decoded.realm_access?.roles || [],
      };

      next();
    }
  );
};
