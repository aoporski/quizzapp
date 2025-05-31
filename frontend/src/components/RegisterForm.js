"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/RegisterForm.module.css";

const RegisterForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
          `${process.env.NEXT_PUBLIC_GATEWAY_API_URL}/api/auth/register`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Rejestracja nieudana!");
        }

        alert(
          "Rejestracja zakończona. Sprawdź e-mail, aby zweryfikować konto."
        );
        router.push("/login");
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Register</h2>
      <div className={styles.formWrapper}>
        <form onSubmit={formik.handleSubmit}>
          {["email", "password", "username", "name", "surname", "country"].map(
            (field) => (
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
            )
          )}

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
