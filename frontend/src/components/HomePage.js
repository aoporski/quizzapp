"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext"; // ⬅️ import kontekstu

const HomePage = () => {
  const { isAuthenticated } = useAuth(); // ⬅️ sprawdzamy, czy zalogowany

  return (
    <div>
      <h1>Welcome to Thousand</h1>
      <ul>
        {!isAuthenticated ? (
          <>
            <li>
              <Link href="/login">Log in</Link>
            </li>
            <li>
              <Link href="/register">Register</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/profile">Go to Profile</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default HomePage;
