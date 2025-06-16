"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const HomePage = () => {
  const { keycloak, isAuthenticated } = useAuth();

  const handleLogout = () => {
    if (keycloak) {
      keycloak.logout({
        redirectUri: window.location.origin,
      });
    }
  };

  return (
    <div>
      <h1>🎯 Welcome to QuizzApp</h1>

      <ul>
        {!isAuthenticated ? (
          <>
            <li>
              <Link href="/login">🔐 Log in</Link>
            </li>
            <li>
              <Link href="/register">📝 Register</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/profile">👤 Profile</Link>
            </li>

            <li>
              <Link href="/quiz/browse">📚 Browse Quizzes</Link>
            </li>
            <li>
              <Link href="/quiz/me">🧠 My Quizzes</Link>
            </li>
            <li>
              <Link href="/quiz/create">➕ Create Quiz</Link>
            </li>

            <li>
              <Link href="/play">🎮 Play</Link>
            </li>

            <li>
              <button onClick={handleLogout}>🚪 Logout</button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default HomePage;
