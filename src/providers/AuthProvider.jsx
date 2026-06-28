"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axiosSecure from "../utils/axiosSecure";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("startupforge_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const saveUser = (userData) => {
    setUser(userData);
    localStorage.setItem("startupforge_user", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await axiosSecure.post("/logout").catch(() => {});
    } finally {
      setUser(null);
      localStorage.removeItem("startupforge_user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, saveUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
