"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const HomePage = () => {
  const [isLogged, setIsLogged] = useState(false);

  return (
    <div>
      <h1>Welcome to Thousand</h1>
      <ul>
        <li>
          <Link href="/login">Log in</Link>
        </li>
        <li>
          <Link href="/register">Register</Link>
        </li>
      </ul>
    </div>
  );
};

export default HomePage;
