"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function UserProfile() {
  const { token, isAuthenticated } = useAuth();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        console.log(token);
        const res = await fetch(`api/user/me`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("Status:", res.status);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log(data);

        setUser(data.user);
        setProfile(data.profile);

        console.log("user", user);
        console.log("profile", profile);
      } catch (err) {
        console.error("Błąd pobierania profilu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (loading) return <p>⏳ Ładowanie profilu...</p>;
  if (!isAuthenticated || !user) return <p>❌ Nie zalogowano.</p>;

  return (
    <div>
      <h2>👤 Profil użytkownika</h2>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Username:</strong> {user.preferred_username}
      </p>
      <p>
        <strong>Imię i nazwisko:</strong> {user.firstName} {user.lastName}
      </p>
      <p>
        <strong>Bio:</strong> {profile?.bio}
      </p>
      <p>
        <strong>Średni wynik:</strong> {profile?.stats?.averageScore}
      </p>
    </div>
  );
}
