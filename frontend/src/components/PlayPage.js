"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function PlayQuizPage() {
  const { token } = useAuth();
  const { id: quizId } = useParams();
  const router = useRouter();

  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [completed, setCompleted] = useState(false);

  const currentQuestion = questions[currentIndex];
  const currentAnswer =
    answers[currentQuestion?._id] ||
    (currentQuestion?.type === "multiple-choice" ? [] : "");

  useEffect(() => {
    const init = async () => {
      try {
        const session = await axios.post(
          `/api/session/start/${quizId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setSessionId(session.data._id);

        const res = await axios.get(`/api/quiz/question?quizId=${quizId}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setQuestions(res.data);
      } catch (err) {
        console.error("Failed to start session:", err);
        alert("Failed to start quiz");
        router.push("/quiz/browse");
      }
    };

    if (quizId && token) init();
  }, [quizId, token]);

  const handleChange = (value) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion._id]: value,
    }));
  };

  const handleCheckboxChange = (option) => {
    const current = answers[currentQuestion._id] || [];
    const updated = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option];
    handleChange(updated);
  };

  const handleAnswer = async () => {
    try {
      await axios.post(
        `/api/session/${quizId}/answer`,
        {
          questionId: currentQuestion._id,
          response: currentAnswer,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        await axios.post(
          `/api/session/${quizId}/complete`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setCompleted(true);
      }
    } catch (err) {
      console.error("Failed to save answer:", err);
    }
  };

  const renderInput = () => {
    const { type, options } = currentQuestion;

    switch (type) {
      case "single-choice":
        return options.map((opt, i) => (
          <div key={i}>
            <label>
              <input
                type="radio"
                name="answer"
                value={opt}
                checked={currentAnswer === opt}
                onChange={() => handleChange(opt)}
              />
              {opt}
            </label>
          </div>
        ));

      case "multiple-choice":
        return options.map((opt, i) => (
          <div key={i}>
            <label>
              <input
                type="checkbox"
                value={opt}
                checked={currentAnswer.includes(opt)}
                onChange={() => handleCheckboxChange(opt)}
              />
              {opt}
            </label>
          </div>
        ));

      case "true-false":
        return ["true", "false"].map((val) => (
          <div key={val}>
            <label>
              <input
                type="radio"
                name="answer"
                value={val}
                checked={currentAnswer === val}
                onChange={() => handleChange(val)}
              />
              {val}
            </label>
          </div>
        ));

      case "open-ended":
        return (
          <textarea
            rows={4}
            value={currentAnswer}
            onChange={(e) => handleChange(e.target.value)}
          />
        );

      default:
        return null;
    }
  };

  if (!questions.length) return <p>Loading...</p>;
  if (completed) return <p>🎉 Quiz completed!</p>;

  return (
    <div>
      <h2>
        Question {currentIndex + 1} of {questions.length}
      </h2>
      <p>
        <strong>{currentQuestion.text}</strong>
      </p>

      {renderInput()}

      <br />
      <button
        onClick={handleAnswer}
        disabled={!currentAnswer || currentAnswer.length === 0}
      >
        {currentIndex + 1 === questions.length ? "Finish" : "Next"}
      </button>
    </div>
  );
}
