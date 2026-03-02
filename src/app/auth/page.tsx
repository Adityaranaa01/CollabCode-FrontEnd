import AuthClient from "./AuthClient";
import { Suspense } from "react";

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background-dark" />}>
      <AuthClient />
    </Suspense>
  );
}
