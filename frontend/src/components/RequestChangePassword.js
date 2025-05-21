"use client";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

export default function RequestPasswordChange() {
  const [isEmailSent, setIsEmailSent] = useState(false);

  const changePasswordForm = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Nieprawidłowy email").required("Wymagany"),
    }),
    onSubmit: async (values) => {
      try {
        await axios.post(
          "http://localhost:3000/api/auth/reset-password/request",
          {
            email: values.email,
          }
        );
        setIsEmailSent(true);
      } catch (err) {
        console.error("Error during password reset:", err);
      }
    },
  });

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      {isEmailSent ? (
        <div>Link to reset your password was sent to your email!</div>
      ) : (
        <form onSubmit={changePasswordForm.handleSubmit}>
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              onChange={changePasswordForm.handleChange}
              onBlur={changePasswordForm.handleBlur}
              value={changePasswordForm.values.email}
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
            />
            {changePasswordForm.touched.email &&
              changePasswordForm.errors.email && (
                <div style={{ color: "red", marginTop: "0.5rem" }}>
                  {changePasswordForm.errors.email}
                </div>
              )}
          </div>
          <button type="submit" style={{ marginTop: "1rem" }}>
            Reset password
          </button>
        </form>
      )}
    </div>
  );
}
