"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import UserProfile from "@/components/UserProfile";

export default function ProfilePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <div style={{ padding: "2rem" }}>
      <UserProfile />
    </div>
  );
}
