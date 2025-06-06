module.exports = {
  realm: process.env.KEYCLOAK_REALM,
  "server-url": process.env.KEYCLOAK_SERVER_URL,
  bearerOnly: "true",
  resource: process.env.KEYCLOAK_CLIENT,
  "public-client": true,
  "confidential-port": 0,
};
