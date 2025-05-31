const axios = require("axios");

exports.register = async (req, res) => {
  const { email, password, username, name, surname, country } = req.body;

  try {
    const tokenRes = await axios.post(
      "http://keycloak:8080/realms/master/protocol/openid-connect/token",
      new URLSearchParams({
        client_id: "admin-cli",
        grant_type: "password",
        username: "admin",
        password: "secret",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const accessToken = tokenRes.data.access_token;

    await axios.post(
      "http://keycloak:8080/admin/realms/quizzapp/users",
      {
        username,
        email,
        enabled: true,
        attributes: {
          name,
          surname,
          country,
        },
        requiredActions: ["VERIFY_EMAIL"],
        credentials: [
          {
            type: "password",
            value: password,
            temporary: false,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const users = await axios.get(
      `http://keycloak:8080/admin/realms/quizzapp/users?username=${username}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const userId = users.data[0]?.id;
    if (!userId)
      throw new Error("Nie znaleziono nowego użytkownika w Keycloak");

    await axios.put(
      `http://keycloak:8080/admin/realms/quizzapp/users/${userId}/execute-actions-email`,
      ["VERIFY_EMAIL"],
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(201).json({ message: "Zarejestrowano" });
  } catch (err) {
    console.error("Błąd rejestracji:", err?.response?.data || err.message);
    res.status(500).json({
      message: "Rejestracja nieudana",
      error: err?.response?.data || err.message,
    });
  }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const tokenRes = await axios.post(
      "http://keycloak:8080/realms/quizzapp/protocol/openid-connect/token",
      new URLSearchParams({
        client_id: "frontend",
        grant_type: "password",
        username: email,
        password,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    res.status(200).json(tokenRes.data);
  } catch (err) {
    console.error("Błąd logowania:", err?.response?.data || err.message);
    res.status(401).json({ message: "Nieprawidłowe dane logowania" });
  }
};

exports.loginWithGoogle = (req, res) => {
  const redirectUri = encodeURIComponent("http://localhost:3000/oauth");

  const keycloakLoginUrl = `http://localhost:8080/realms/quizzapp/protocol/openid-connect/auth?client_id=frontend&response_type=code&redirect_uri=${redirectUri}&scope=openid&kc_idp_hint=google`;

  res.redirect(keycloakLoginUrl);
};
