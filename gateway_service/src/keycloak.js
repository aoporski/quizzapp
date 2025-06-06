const session = require("express-session");
const Keycloak = require("keycloak-connect");
const keycloakConfig = require("../keycloak.config");

const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);

module.exports = {
  keycloak,
  memoryStore,
};
