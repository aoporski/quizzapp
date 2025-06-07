const axios = require('axios');

async function getKeycloakAdminToken() {
  try {
    const res = await axios.post(
      `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.KEYCLOAK_CLIENT_ID,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    return res.data.access_token;
  } catch (err) {
    console.error('Couldnt get token');
    throw err;
  }
}
async function updateKeycloakUser(keycloakId, updates) {
  const token = await getKeycloakAdminToken();
  try {
    const res = await axios.put(
      `${process.env.KEYCLOAK_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${keycloakId}`,
      updates,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err) {
    console.error('❌ Keycloak update error:', err.response?.status);
    console.error('📄', JSON.stringify(err.response?.data || err.message, null, 2));
    throw err;
  }
}

module.exports = {
  updateKeycloakUser,
};
