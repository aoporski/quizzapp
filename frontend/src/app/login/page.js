"use client";
import dynamic from "next/dynamic";

const Login = dynamic(() => import("@/components/Login"), {
  ssr: false,
});
import RequestChangePassword from "@/components/RequestChangePassword";
import { useState } from "react";

export default function LoginPage() {
  const [reqChangePassword, setRequestChangePassword] = useState(false);

  return (
    <>
      {!reqChangePassword ? (
        <div>
          <Login />
          <button onClick={() => setRequestChangePassword(true)}>
            Change password
          </button>
        </div>
      ) : (
        <RequestChangePassword />
      )}
    </>
  );
}
