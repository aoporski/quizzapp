const express = require("express");
const session = require("express-session");
const cors = require("cors");

const { keycloak, memoryStore } = require("./keycloak");
const userRoutes = require("./routes/user");
const quizRoutes = require("./routes/quiz");
const sessionRoutes = require("./routes/session");
const verifyToken = require("./middlwares/keycloakToken");
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
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

app.use(express.json());
//token
app.use("/api/user", userRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/session", sessionRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Gateway running at http://localhost:${PORT}`);
});
