import ChangePassword from "@/components/ChangePassword";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChangePassword />
    </Suspense>
  );
}
