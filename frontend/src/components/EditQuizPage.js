"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import QuestionForm from "@/components/Question";

export default function EditQuizForm() {
  const { token } = useAuth();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState(null);
  const [questions, setQuestions] = useState([]);

  const fetchQuiz = async () => {
    try {
      const res = await axios.get(`/api/quiz/quiz/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      const data = res.data;
      setInitialValues({
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        duration: data.duration,
        isPrivate: data.isPrivate,
        isPublished: data.isPublished,
        category: data.category || "",
      });
    } catch (err) {
      console.error("Error loading quiz:", err);
      alert("Failed to load quiz");
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`/api/quiz/question?quizId=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setQuestions(res.data);
    } catch (err) {
      console.error("Error loading questions:", err);
    }
  };

  const deleteQuestion = async (questionId) => {
    if (!confirm("Are you sure?")) return;
    try {
      await axios.delete(`/api/quiz/question/${questionId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      fetchQuestions();
    } catch (err) {
      console.error("Error deleting question:", err);
      alert("Could not delete");
    }
  };

  useEffect(() => {
    if (id && token) {
      fetchQuiz();
      fetchQuestions();
    }
  }, [id, token]);

  const validationSchema = Yup.object({
    title: Yup.string().required("Required"),
    description: Yup.string(),
    difficulty: Yup.string()
      .oneOf(["easy", "medium", "hard"], "Invalid difficulty")
      .required("Required"),
    duration: Yup.number().required("Required").min(1, "Min. 1 minute"),
    isPrivate: Yup.boolean(),
    isPublished: Yup.boolean(),
    category: Yup.string().required("Required"),
  });

  const handleSubmit = async (values) => {
    try {
      await axios.patch(`/api/quiz/quiz/${id}`, values, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      alert("Quiz updated");
    } catch (err) {
      console.error("Error updating quiz:", err);
      alert("Update failed");
    }
  };

  if (!initialValues) return <p>Loading...</p>;

  return (
    <div>
      <h2>Edit Quiz</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        <Form>
          <Field name="title" placeholder="Title" />
          <ErrorMessage name="title" component="div" />
          <br />

          <Field name="description" placeholder="Description" />
          <br />

          <Field as="select" name="difficulty">
            <option value="">Select difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </Field>
          <ErrorMessage name="difficulty" component="div" />
          <br />

          <Field name="duration" type="number" placeholder="Duration (min)" />
          <ErrorMessage name="duration" component="div" />
          <br />

          <Field name="category" placeholder="Category" />
          <ErrorMessage name="category" component="div" />
          <br />

          <label>
            <Field type="checkbox" name="isPrivate" />
            Private
          </label>
          <br />

          <label>
            <Field type="checkbox" name="isPublished" />
            Published
          </label>
          <br />

          <button type="submit">Save Quiz</button>
        </Form>
      </Formik>

      <hr />

      <QuestionForm quizId={id} onSuccess={fetchQuestions} />

      <h3>Questions</h3>
      <ul>
        {questions.map((q) => (
          <li key={q._id}>
            <strong>{q.text}</strong> ({q.type})
            <button onClick={() => deleteQuestion(q._id)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
