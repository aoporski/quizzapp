"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

export default function ChangePassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [errorMessage, setErrorMessage] = useState("");

  const changePasswordForm = useFormik({
    initialValues: {
      password: "",
      repeatPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().min(6, "Minimum 6 znaków").required("Wymagany"),
      repeatPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Hasła muszą być identyczne")
        .required("Wymagane"),
    }),
    onSubmit: async (values) => {
      try {
        await axios.post(
          "http://localhost:3000/api/auth/reset-password/confirm",
          {
            token: token,
            newPassword: values.password,
          }
        );
        router.push("/login");
      } catch (err) {
        console.error("Error during password reset:", err);
        setErrorMessage("❌ Nie udało się zresetować hasła.");
      }
    },
  });

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <form onSubmit={changePasswordForm.handleSubmit}>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            name="password"
            onChange={changePasswordForm.handleChange}
            onBlur={changePasswordForm.handleBlur}
            value={changePasswordForm.values.password}
          />
          {changePasswordForm.touched.password &&
            changePasswordForm.errors.password && (
              <div style={{ color: "red" }}>
                {changePasswordForm.errors.password}
              </div>
            )}
        </div>

        <div>
          <label>Repeat Password:</label>
          <input
            type="password"
            name="repeatPassword"
            onChange={changePasswordForm.handleChange}
            onBlur={changePasswordForm.handleBlur}
            value={changePasswordForm.values.repeatPassword}
          />
          {changePasswordForm.touched.repeatPassword &&
            changePasswordForm.errors.repeatPassword && (
              <div style={{ color: "red" }}>
                {changePasswordForm.errors.repeatPassword}
              </div>
            )}
        </div>

        <button type="submit" style={{ marginTop: "1rem" }}>
          Reset password
        </button>

        {errorMessage && (
          <p style={{ color: "red", marginTop: "1rem" }}>{errorMessage}</p>
        )}
      </form>
    </div>
  );
}
