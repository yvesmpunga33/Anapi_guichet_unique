"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

/**
 * Hook pour synchroniser le token d'authentification NextAuth avec localStorage
 * Cela permet à axios (http-common.js) d'accéder au token
 */
export function useAuthToken() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (status === 'authenticated' && session?.accessToken) {
      localStorage.setItem('authToken', session.accessToken);
    } else if (status === 'unauthenticated') {
      localStorage.removeItem('authToken');
    }
  }, [session, status]);

  return {
    token: session?.accessToken || null,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading'
  };
}

export default useAuthToken;
