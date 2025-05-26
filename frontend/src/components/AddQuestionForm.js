"use client";

import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import axios from "axios";
const AddQuestionForm = ({ quizId }) => {
  const initialValues = {
    type: "single",
    text: "",
    options: ["", "", "", ""],
    correctAnswers: [],
    points: 1,
    hint: "",
  };

  const validationSchema = Yup.object({
    text: Yup.string().required("Required"),
    options: Yup.array().of(Yup.string().required("Required")).min(2),
    correctAnswers: Yup.array()
      .of(Yup.string())
      .min(1, "At least one correct answer"),
    points: Yup.number().min(1).required("Required"),
    hint: Yup.string(),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      //TODO
      await axios.post("http://localhost:3000/api/", { quizId, ...values });
      alert("Question added!");
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Error adding question");
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <div>
            <Field name="text" placeholder="Question text" />
            <ErrorMessage name="text" component="div" />
          </div>

          <FieldArray name="options">
            {({ remove, push }) => (
              <div>
                {values.options.map((option, index) => (
                  <div key={index}>
                    <Field
                      name={`options.${index}`}
                      placeholder={`Option ${index + 1}`}
                    />
                    <input
                      type="checkbox"
                      checked={values.correctAnswers.includes(option)}
                      onChange={() => {
                        const updated = values.correctAnswers.includes(option)
                          ? values.correctAnswers.filter(
                              (ans) => ans !== option
                            )
                          : [...values.correctAnswers, option];
                        setFieldValue("correctAnswers", updated);
                      }}
                    />
                    Correct
                    <button type="button" onClick={() => remove(index)}>
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => push("")}>
                  Add Option
                </button>
              </div>
            )}
          </FieldArray>

          <div>
            <Field name="points" type="number" />
            <ErrorMessage name="points" component="div" />
          </div>

          <div>
            <Field name="hint" placeholder="Hint" />
          </div>

          <button type="submit">Add Question</button>
        </Form>
      )}
    </Formik>
  );
};

export default AddQuestionForm;
