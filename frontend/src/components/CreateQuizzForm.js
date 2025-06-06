"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const CreateQuizzForm = () => {
  const initialValues = {
    title: "",
    description: "",
    difficulty: "",
    duration: "",
    isPrivate: false,
    isPublished: false,
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Required"),
    description: Yup.string(),
    difficulty: Yup.string().required("Required"),
    duration: Yup.number().required("Required").min(1, "Min. 1 minute"),
    isPrivate: Yup.boolean(),
    isPublished: Yup.boolean(),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await axios.post("http://localhost:3000/api/quizz/create", values);
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
          <Field name="difficulty" placeholder="Difficulty" />
          <ErrorMessage name="difficulty" component="div" />
        </div>

        <div>
          <Field name="duration" type="number" placeholder="Duration" />
          <ErrorMessage name="duration" component="div" />
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

export default CreateQuizzForm;
