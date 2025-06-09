"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";

const validationSchema = Yup.object({
  keyword: Yup.string(),
  difficulty: Yup.string().oneOf(["", "easy", "medium", "hard"]),
  sortBy: Yup.string().oneOf(["createdAt", "popularity"]),
});

const QuizBrowse = () => {
  const { token } = useAuth();
  const [quizzes, setQuizzes] = useState([]);

  const formik = useFormik({
    initialValues: {
      category: "",
      difficulty: "",
      language: "",
      keyword: "",
      sortBy: "createdAt",
      order: "desc",
      page: 1,
      limit: 10,
    },
    validationSchema,
    onSubmit: () => {
      fetchQuizzes();
    },
  });

  const fetchQuizzes = async () => {
    try {
      const { data } = await axios.get("/api/quiz/quiz", {
        params: formik.values,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setQuizzes(data.quizzes);
    } catch (err) {
      console.error("Error fetching quizzes:", err);
    }
  };

  useEffect(() => {
    if (token) fetchQuizzes();
  }, [token]);

  if (!token) return <p>Loading...</p>;

  return (
    <div>
      <h2>Browse Quizzes</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          name="keyword"
          placeholder="Search by keyword"
          value={formik.values.keyword}
          onChange={formik.handleChange}
        />
        {formik.touched.keyword && formik.errors.keyword && (
          <div style={{ color: "red" }}>{formik.errors.keyword}</div>
        )}

        <select
          name="difficulty"
          value={formik.values.difficulty}
          onChange={formik.handleChange}
        >
          <option value="">All difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <select
          name="sortBy"
          value={formik.values.sortBy}
          onChange={formik.handleChange}
        >
          <option value="createdAt">Newest</option>
          <option value="popularity">Most Popular</option>
        </select>

        <button type="submit">Apply Filters</button>
      </form>

      <ul>
        {Array.isArray(quizzes) &&
          quizzes.map((quiz) => (
            <li key={quiz._id || quiz.id}>
              <Link href={`/quiz/${quiz._id || quiz.id}`}>
                <strong>{quiz.title}</strong> - {quiz.difficulty}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default QuizBrowse;
