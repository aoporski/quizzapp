"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Keycloak from "keycloak-js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [keycloak, setKeycloak] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // ✅ zabezpieczenie przed uruchomieniem w SSR
    if (typeof window === "undefined") return;

    const kc = new Keycloak({
      url: process.env.NEXT_PUBLIC_KEYCLOAK_URL,
      realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
      clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
    });

    kc.init({
      onLoad: "check-sso",
      silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
      pkceMethod: "S256",
      checkLoginIframe: false,
    }).then((authenticated) => {
      if (authenticated) {
        setKeycloak(kc);
        setToken(kc.token);
        setIsAuthenticated(true);

        kc.onTokenExpired = () => {
          kc.updateToken(30).then((refreshed) => {
            if (refreshed) {
              setToken(kc.token);
            }
          });
        };
      } else {
        setKeycloak(kc); // nawet jeśli nie authenticated
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ keycloak, token, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
