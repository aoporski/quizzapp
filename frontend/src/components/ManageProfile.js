"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function EditProfileForm() {
  const [message, setMessage] = useState("");
  const { token, isAuthenticated } = useAuth();

  const formik = useFormik({
    initialValues: {
      preferred_username: "",
      firstName: "",
      lastName: "",
      avatar: "",
      bio: "",
      privacy: "public",
    },
    validationSchema: Yup.object({
      preferred_username: Yup.string()
        .min(3, "Min. 3 characters")
        .required("Required"),
      firstName: Yup.string().required("Required"),
      lastName: Yup.string().required("Required"),
      avatar: Yup.string().url("Invalid URL"),
      bio: Yup.string().max(300, "Max. 300 characters"),
      privacy: Yup.string().oneOf(["public", "private", "friends-only"]),
    }),
    onSubmit: async (values) => {
      try {
        await axios.put("/api/user/update-me", values, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setMessage("✅ Profile updated successfully!");
      } catch (err) {
        console.error("Update error:", err);
        setMessage("❌ Failed to update profile.");
      }
    },
  });

  useEffect(() => {
    axios
      .get("/api/user/me", {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        const { user, profile } = res.data;
        formik.setValues({
          preferred_username: user?.preferred_username || "",
          firstName: user?.firstName || "",
          lastName: user?.lastName || "",
          avatar: profile?.avatar || "",
          bio: profile?.bio || "",
          privacy: profile?.privacy || "public",
        });
      })
      .catch((err) => console.error("Fetch user error:", err));
  }, []);

  if (!isAuthenticated) return <p>❌ Nie zalogowano.</p>;

  return (
    <form
      onSubmit={formik.handleSubmit}
      style={{ maxWidth: "600px", margin: "auto" }}
    >
      <h2>Edit Profile</h2>

      <input
        type="text"
        name="preferred_username"
        placeholder="Username"
        value={formik.values.preferred_username}
        onChange={formik.handleChange}
      />
      {formik.touched.preferred_username &&
        formik.errors.preferred_username && (
          <div style={{ color: "red" }}>{formik.errors.preferred_username}</div>
        )}

      <input
        type="text"
        name="firstName"
        placeholder="First Name"
        value={formik.values.firstName}
        onChange={formik.handleChange}
      />
      {formik.touched.firstName && formik.errors.firstName && (
        <div style={{ color: "red" }}>{formik.errors.firstName}</div>
      )}

      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        value={formik.values.lastName}
        onChange={formik.handleChange}
      />
      {formik.touched.lastName && formik.errors.lastName && (
        <div style={{ color: "red" }}>{formik.errors.lastName}</div>
      )}

      <input
        type="text"
        name="avatar"
        placeholder="Avatar URL"
        value={formik.values.avatar}
        onChange={formik.handleChange}
      />
      {formik.touched.avatar && formik.errors.avatar && (
        <div style={{ color: "red" }}>{formik.errors.avatar}</div>
      )}

      <textarea
        name="bio"
        placeholder="Short bio"
        value={formik.values.bio}
        onChange={formik.handleChange}
      />
      {formik.touched.bio && formik.errors.bio && (
        <div style={{ color: "red" }}>{formik.errors.bio}</div>
      )}

      <select
        name="privacy"
        value={formik.values.privacy}
        onChange={formik.handleChange}
      >
        <option value="public">Public</option>
        <option value="private">Private</option>
        <option value="friends-only">Friends only</option>
      </select>
      {formik.touched.privacy && formik.errors.privacy && (
        <div style={{ color: "red" }}>{formik.errors.privacy}</div>
      )}

      <button type="submit">Save Changes</button>

      {message && <p>{message}</p>}
    </form>
  );
}
