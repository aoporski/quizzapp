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
        const res = await fetch(`/api/user/me`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        setUser(data.user);
        setProfile(data.profile);
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
        <strong>Bio:</strong> {profile?.bio || "–"}
      </p>

      {profile?.stats && (
        <>
          <h3>📊 Statystyki</h3>
          <p>
            <strong>Średni wynik:</strong> {profile.stats.averageScore}%
          </p>
          <p>
            <strong>Najlepszy wynik:</strong> {profile.stats.bestScore}%
          </p>
          <p>
            <strong>Łączna liczba quizów:</strong> {profile.stats.totalQuizzes}
          </p>
        </>
      )}

      {profile?.history && profile.history.length > 0 && (
        <>
          <h3>🕓 Historia quizów</h3>
          <ul>
            {profile.history.map((h, i) => (
              <li key={i}>
                Quiz: {h.quizId} | Wynik: {h.score}/{h.total} ({h.percentage}%)
                | Data: {new Date(h.completedAt).toLocaleString()}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
