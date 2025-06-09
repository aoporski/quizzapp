"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const CreateQuizForm = () => {
  const { token } = useAuth();

  const initialValues = {
    title: "",
    description: "",
    difficulty: "",
    duration: "",
    isPrivate: false,
    isPublished: false,
    category: "",
  };

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

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await axios.post(`/api/quiz/quiz`, values, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Quiz created!");
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Error creating quiz");
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        <div>
          <Field name="title" placeholder="Title" />
          <ErrorMessage name="title" component="div" />
        </div>

        <div>
          <Field name="description" placeholder="Description" />
        </div>

        <div>
          <Field as="select" name="difficulty">
            <option value="">Select difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </Field>
          <ErrorMessage name="difficulty" component="div" />
        </div>

        <div>
          <Field name="duration" type="number" placeholder="Duration" />
          <ErrorMessage name="duration" component="div" />
        </div>

        <div>
          <Field name="category" placeholder="Category" />
          <ErrorMessage name="category" component="div" />
        </div>

        <label>
          <Field type="checkbox" name="isPrivate" />
          Private
        </label>

        <label>
          <Field type="checkbox" name="isPublished" />
          Published
        </label>

        <button type="submit">Create Quiz</button>
      </Form>
    </Formik>
  );
};

export default CreateQuizForm;
