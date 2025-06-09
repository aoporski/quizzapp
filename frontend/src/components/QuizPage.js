"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function QuizDetailsPage() {
  const { token } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);

  const fetchQuiz = async () => {
    try {
      const res = await axios.get(`/api/quiz/quiz/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setQuiz(res.data);
    } catch (err) {
      console.error("Error loading quiz:", err);
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`/api/quiz/question?quizId=${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setQuestions(res.data);
    } catch (err) {
      console.error("Error loading questions:", err);
    }
  };

  useEffect(() => {
    if (params.id && token) {
      fetchQuiz();
      fetchQuestions();
    }
  }, [params.id, token]);

  if (!quiz) return <p>Loading...</p>;

  return (
    <div>
      <h2>{quiz.title}</h2>
      <p>{quiz.description}</p>
      <p>
        <strong>Difficulty:</strong> {quiz.difficulty}
      </p>
      <p>
        <strong>Duration:</strong> {quiz.duration} min
      </p>

      {quiz.isOwner ? (
        <div>
          <button onClick={() => router.push(`/quiz/edit/${quiz._id}`)}>
            ✏️ Edit Quiz
          </button>
        </div>
      ) : (
        <button onClick={() => router.push(`/play/${quiz._id}`)}>
          🎮 Start Quiz
        </button>
      )}

      <h3>Questions</h3>
      <ul>
        {questions.map((q) => (
          <li key={q._id}>
            <strong>{q.text}</strong>
            {quiz.isOwner && (
              <>
                <button
                  onClick={() =>
                    router.push(`/quiz/edit/${quiz._id}?edit=${q._id}`)
                  }
                >
                  ✏️
                </button>
                <button
                  onClick={async () => {
                    if (confirm("Are you sure?")) {
                      await axios.delete(`/api/quiz/question/${q._id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials: true,
                      });
                      fetchQuestions();
                    }
                  }}
                >
                  🗑️
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
