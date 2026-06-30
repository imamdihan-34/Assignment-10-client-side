"use client";

import { useEffect, useState } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.log(err);
      }
    }

    setLoading(false);
  }, []);

  const login = (userData, jwt) => {
    localStorage.setItem("token", jwt);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setToken(null);
  };

  return {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };
}