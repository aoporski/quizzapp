"use client";

import { Suspense } from "react";
import OAuthCallbackHandler from "../../components/OauthCallbackHandler";

export default function OAuthPage() {
  return (
    <Suspense fallback={<p>Ładowanie...</p>}>
      <OAuthCallbackHandler />
    </Suspense>
  );
}
