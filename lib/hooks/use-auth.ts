"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function useAuthRedirect() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is authenticated by looking for auth_token cookie
    const isAuthenticated = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth_token="));

    if (isAuthenticated) {
      // Get current locale from pathname
      const currentLocale = pathname.split("/")[1] || "en";
      // Redirect to dashboard if user is already authenticated
      router.replace(`/${currentLocale}/dashboard`);
    } else {
      setIsLoading(false);
    }
  }, [router, pathname]);

  return { isLoading };
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated by looking for auth_token cookie
    const authToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth_token="));

    setIsAuthenticated(!!authToken);
    setIsLoading(false);
  }, []);

  return { isAuthenticated, isLoading };
}
