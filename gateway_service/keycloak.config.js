module.exports = {
  realm: process.env.KEYCLOAK_REALM,
  "auth-server-url": process.env.KEYCLOAK_SERVER_URL,
  "ssl-required": "none",
  resource: process.env.KEYCLOAK_CLIENT,
  "public-client": true,
  "confidential-port": 0,
};
