const express = require("express");
const session = require("express-session");
const Keycloak = require("keycloak-connect");
const authRoutes = require("./routes/auth");
const keycloakConfig = require("../keycloak.config");

const app = express();
const memoryStore = new session.MemoryStore();
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
);

const keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);
app.use(keycloak.middleware());

app.use(express.json());

app.use("/api/auth", authRoutes);
// app.use("/api/public", publicRoutes);
// app.use("/api/secure", keycloak.protect(), secureRoutes);
// app.use("/api/users", keycloak.protect(), proxyRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Gateway running at http://localhost:${PORT}`);
});
