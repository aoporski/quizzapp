"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/RegisterForm.module.css";

const RegisterForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState(null);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      username: "",
      name: "",
      surname: "",
      country: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Nieprawidłowy email").required("Wymagany"),
      password: Yup.string().min(6, "Minimum 6 znaków").required("Wymagany"),
      username: Yup.string().required("Wymagany"),
      name: Yup.string().required("Wymagane"),
      surname: Yup.string().required("Wymagane"),
      country: Yup.string().required("Wymagane"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          }
        );

        const data = await response.json();
        localStorage.setItem("accessToken", data.accessToken);
        setRegisteredEmail(values.email); // <== ZAWSZE ustawiamy, nawet jeśli res.ok === false

        if (!response.ok)
          throw new Error(data.message || "Rejestracja nieudana!");
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleVerify = async () => {
    setVerificationError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: registeredEmail,
            code: verificationCode,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Weryfikacja nie powiodła się");

      alert("E-mail został zweryfikowany!");
      router.push("/");
    } catch (err) {
      setVerificationError(err.message);
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/resend-code`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: registeredEmail }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Nie udało się wysłać kodu ponownie");

      alert("Kod został ponownie wysłany!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className={styles.container}>
      {!registeredEmail ? (
        <>
          <h2 className={styles.title}>Register</h2>
          <div className={styles.formWrapper}>
            <form onSubmit={formik.handleSubmit}>
              {[
                "email",
                "password",
                "username",
                "name",
                "surname",
                "country",
              ].map((field) => (
                <div key={field} className={styles.inputRow}>
                  <input
                    type={field === "password" ? "password" : "text"}
                    name={field}
                    placeholder={field[0].toUpperCase() + field.slice(1)}
                    className={styles.input}
                    {...formik.getFieldProps(field)}
                  />
                  {formik.touched[field] && formik.errors[field] && (
                    <span className={styles.error}>{formik.errors[field]}</span>
                  )}
                </div>
              ))}

              <button
                type="submit"
                className={styles.button}
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>
          </div>
        </>
      ) : (
        <div className={styles.verifyContainer}>
          <h2 className={styles.title}>Verify Your Email</h2>
          <p>
            We have sent a verification code to{" "}
            <strong>{registeredEmail}</strong>.
          </p>
          <input
            type="text"
            placeholder="Enter verification code"
            className={styles.input}
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          {verificationError && (
            <p className={styles.error}>{verificationError}</p>
          )}
          <button onClick={handleVerify} className={styles.button}>
            Verify
          </button>
          <button onClick={handleResendCode} className={styles.resendButton}>
            Resend code
          </button>
        </div>
      )}
    </div>
  );
};

export default RegisterForm;
