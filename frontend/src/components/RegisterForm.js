"use client";

const RegisterRedirect = () => {
  const handleRegister = () => {
    const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL;
    const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM;
    const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;

    const url = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/registrations?client_id=${clientId}&response_type=code&redirect_uri=${window.location.origin}/`;
    window.location.href = url;
  };

  return (
    <div>
      <h2>Register with Keycloak</h2>
      <button onClick={handleRegister}>Go to Registration Page</button>
    </div>
  );
};

export default RegisterRedirect;
