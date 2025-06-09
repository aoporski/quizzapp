"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function MyQuizzesPage() {
  const { token } = useAuth();
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchMyQuizzes = async () => {
      if (!token) return;
      try {
        const res = await axios.get("/api/quiz/quiz/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setQuizzes(res.data);
      } catch (err) {
        console.error("Failed to load quizzes", err);
      }
    };

    fetchMyQuizzes();
  }, [token]);

  if (!token) return <p>Loading...</p>;

  return (
    <div>
      <h2>My Quizzes</h2>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz._id}>
            {quiz.title} – {quiz.difficulty}
          </li>
        ))}
      </ul>
    </div>
  );
}
