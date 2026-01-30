"use client";

import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useAuthToken } from "@/hooks/useAuthToken";

// Composant interne pour synchroniser le token avec localStorage
function AuthTokenSync({ children }) {
  useAuthToken();
  return <>{children}</>;
}

export function Providers({ children }) {
  return (
    <SessionProvider>
      <AuthTokenSync>
        <LanguageProvider>{children}</LanguageProvider>
      </AuthTokenSync>
    </SessionProvider>
  );
}
