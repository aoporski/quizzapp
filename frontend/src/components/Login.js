"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginClient() {
  const { keycloak, isAuthenticated } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const syncUser = async () => {
      try {
        const res = await fetch("/api/user/sync", {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const error = await res.json();
          console.error("Sync error:", error.message);
        } else {
          console.log("✅ User synced to DB");
        }
      } catch (err) {
        console.error("❌ Failed to sync user:", err);
      }
    };

    if (isClient && isAuthenticated && keycloak?.token) {
      syncUser();
      router.push("/");
    }
  }, [isClient, isAuthenticated, keycloak]);

  if (!isClient) return null;

  return (
    <div>
      <h2>{isAuthenticated ? "You're logged in!" : "Login"}</h2>

      {!isAuthenticated ? (
        <>
          <button onClick={() => keycloak?.login()}>
            Log in with username/password
          </button>
          <br />
          <button
            onClick={() =>
              keycloak?.login({
                idpHint: "google",
                redirectUri: window.location.origin + "/?ts=" + Date.now(),
              })
            }
          >
            Log in with Google
          </button>
        </>
      ) : (
        <button
          onClick={() =>
            keycloak?.logout({ redirectUri: window.location.origin })
          }
        >
          Logout
        </button>
      )}
    </div>
  );
}
