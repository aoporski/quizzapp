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
  const [selectedType, setSelectedType] = useState("single-choice");

  const getInitialValues = (type) => {
    const base = {
      type,
      text: "",
      points: 1,
      hint: "",
    };

    switch (type) {
      case "true-false":
        return {
          ...base,
          options: ["true", "false"],
          correctAnswers: ["true"],
        };
      case "open-ended":
        return {
          ...base,
          options: [],
          correctAnswers: [],
        };
      default:
        return {
          ...base,
          options: ["", ""],
          correctAnswers: [""],
        };
    }
  };

  const validationSchema = Yup.object().shape({
    type: Yup.string().oneOf(QUESTION_TYPES).required("Required"),
    text: Yup.string().required("Question text is required"),
    points: Yup.number().min(1).required("Points are required"),
    hint: Yup.string(),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await axios.post(
        "/api/quiz/question",
        { quizId, ...values },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      alert("Question added successfully");
      resetForm();
      onSuccess?.();
    } catch (err) {
      console.error("Error adding question:", err);
      alert("Error adding question. Please try again.");
    }
  };

  const renderOptions = (values) => {
    if (values.type === "true-false") {
      return <p>Options: true, false (auto)</p>;
    }

    if (values.type === "open-ended") return null;

    return (
      <FieldArray name="options">
        {({ push, remove }) => (
          <div>
            <div>Options:</div>
            {values.options.map((option, index) => (
              <div key={index}>
                <Field
                  name={`options.${index}`}
                  placeholder={`Option ${index + 1}`}
                />
                {values.options.length > 2 && (
                  <button type="button" onClick={() => remove(index)}>
                    ❌
                  </button>
                )}
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
    if (values.type === "open-ended") return null;

    return (
      <FieldArray name="correctAnswers">
        {({ push, remove }) => (
          <div>
            <div>Correct Answers:</div>
            {values.correctAnswers.map((answer, index) => (
              <div key={index}>
                {values.type === "true-false" ? (
                  <Field as="select" name={`correctAnswers.${index}`}>
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </Field>
                ) : (
                  <Field as="select" name={`correctAnswers.${index}`}>
                    <option value="">Select correct answer</option>
                    {values.options.map((option, i) => (
                      <option key={i} value={option}>
                        {option || `Option ${i + 1}`}
                      </option>
                    ))}
                  </Field>
                )}
                {values.correctAnswers.length > 1 && (
                  <button type="button" onClick={() => remove(index)}>
                    ❌
                  </button>
                )}
              </div>
            ))}
            {values.type !== "single-choice" && (
              <button
                type="button"
                onClick={() => push(values.type === "true-false" ? "true" : "")}
              >
                ➕ Add Correct Answer
              </button>
            )}
          </div>
        )}
      </FieldArray>
    );
  };

  return (
    <div>
      <h3>Add Question</h3>
      <Formik
        initialValues={getInitialValues(selectedType)}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        enableReinitialize
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form>
            <div>
              <label>Type:</label>
              <Field
                as="select"
                name="type"
                onChange={(e) => {
                  const newType = e.target.value;
                  setSelectedType(newType);
                  // Reset all fields when type changes
                  Object.entries(getInitialValues(newType)).forEach(
                    ([key, value]) => {
                      setFieldValue(key, value);
                    }
                  );
                }}
              >
                {QUESTION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Field>
            </div>

            <div>
              <Field name="text" placeholder="Question text" />
              <ErrorMessage name="text" component="div" />
            </div>

            {renderOptions(values)}
            {renderCorrectAnswers(values)}

            <div>
              <Field name="points" type="number" placeholder="Points" min="1" />
              <ErrorMessage name="points" component="div" />
            </div>

            <div>
              <Field name="hint" placeholder="Hint (optional)" />
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Question"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default QuestionForm;
