"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function OAuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) return;

    const exchangeCodeForToken = async () => {
      try {
        const res = await axios.post(
          "http://localhost:8080/realms/quizzapp/protocol/openid-connect/token",
          new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri: "http://localhost:3000/oauth/callback",
            client_id: "frontend",
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        const { access_token } = res.data;
        localStorage.setItem("access_token", access_token);

        router.push("/");
      } catch (err) {
        console.error("Błąd przy wymianie kodu:", err);
        router.push("/login");
      }
    };

    exchangeCodeForToken();
  }, [searchParams, router]);

  return <p>Logowanie przez Google...</p>;
}
