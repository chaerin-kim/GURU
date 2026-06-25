import React, { createContext, useContext, useState, useEffect } from "react";
import { url } from "../store/ref";
import Loading from "../components/Loading";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch(`${url}/verify-token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("token");
          }
        } catch (error) {
          console.error("토큰 검증 오류:", error);
        }
      }
      setLoading(false);
    };
    verifyToken();
  }, []);

  const islogin = () => setIsAuthenticated(true);
  const isLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  };
  if (loading) {
    return <Loading />;
  }

  return <AuthContext.Provider value={{ isAuthenticated, islogin, isLogout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
