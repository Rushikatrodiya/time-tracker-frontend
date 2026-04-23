"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api";
import { useAuthStore } from "../../store/authStore";

export default function AuthProvider({ children }) {
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initUser = async () => {
      try {
        const res = await api.get("/users/me");
        setUser(res.data.data);
      } catch {
        // not logged in
      } finally {
        setIsLoading(false);
      }
    };

    initUser();
  }, []);

  if (isLoading) return null; // or a loading spinner

  return children;
}
