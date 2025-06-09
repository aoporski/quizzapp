"use client";

import { useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const QUESTION_TYPES = [
  "single-choice",
  "multiple-choice",
  "true-false",
  "open-ended",
];

const QuestionForm = ({ quizId, onSuccess }) => {
  const { token } = useAuth();
  const [type, setType] = useState("single-choice");

  const initialValues = {
    type,
    text: "",
    options: [],
    correctAnswers: [],
    points: 1,
    hint: "",
  };

  const validationSchema = Yup.object({
    text: Yup.string().required("Required"),
    points: Yup.number().min(1).required("Required"),
    options: Yup.array().when("type", {
      is: (val) => ["single-choice", "multiple-choice"].includes(val),
      then: Yup.array()
        .of(Yup.string().required("Required"))
        .min(2, "Min 2 options"),
    }),
    correctAnswers: Yup.array().when("type", {
      is: (val) => val !== "open-ended",
      then: Yup.array()
        .of(Yup.string().required("Required"))
        .min(1, "At least one correct"),
    }),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await axios.post(
        "/api/quiz/question",
        { quizId, ...values },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      alert("Question added");
      resetForm();
      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert("Error adding question");
    }
  };

  const renderOptions = (values) => {
    if (type === "true-false") {
      values.options = ["true", "false"];
      return null;
    }

    if (type === "open-ended") return null;

    return (
      <FieldArray name="options">
        {({ push, remove }) => (
          <div>
            {values.options.map((opt, index) => (
              <div key={index}>
                <Field
                  name={`options.${index}`}
                  placeholder={`Option ${index + 1}`}
                />
                <button type="button" onClick={() => remove(index)}>
                  ❌
                </button>
              </div>
            ))}
            <button type="button" onClick={() => push("")}>
              ➕ Add Option
            </button>
          </div>
        )}
      </FieldArray>
    );
  };

  const renderCorrectAnswers = (values) => {
    if (type === "open-ended") return null;

    return (
      <FieldArray name="correctAnswers">
        {({ push, remove }) => (
          <div>
            <label>Correct Answers:</label>
            {values.correctAnswers.map((ans, i) => (
              <div key={i}>
                <Field
                  name={`correctAnswers.${i}`}
                  placeholder={`Correct Answer ${i + 1}`}
                />
                <button type="button" onClick={() => remove(i)}>
                  ❌
                </button>
              </div>
            ))}
            <button type="button" onClick={() => push("")}>
              ➕ Add Correct
            </button>
          </div>
        )}
      </FieldArray>
    );
  };

  return (
    <div>
      <h3>Add Question</h3>
      <label>Type:</label>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        {QUESTION_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <Formik
        enableReinitialize
        initialValues={{ ...initialValues, type }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values }) => (
          <Form>
            <div>
              <Field name="text" placeholder="Question text" />
              <ErrorMessage name="text" component="div" />
            </div>

            {renderOptions(values)}
            {renderCorrectAnswers(values)}

            <div>
              <Field name="points" type="number" placeholder="Points" />
              <ErrorMessage name="points" component="div" />
            </div>

            <div>
              <Field name="hint" placeholder="Hint (optional)" />
            </div>

            <button type="submit">Save Question</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default QuestionForm;
