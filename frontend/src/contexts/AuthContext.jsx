import React, { createContext, useState, useEffect } from "react";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

export const AuthContext = createContext(null);

function parseJwt(token) {
  try {
    const base64 = token.split('.')[1];
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initializeAuth() {
      const access = localStorage.getItem(ACCESS_TOKEN);
      const refresh = localStorage.getItem(REFRESH_TOKEN);
      if (!access) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      const decoded = parseJwt(access);
      if (!decoded) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      try {
        const exp = decoded.exp;
        if (exp * 1000 < Date.now()) {
          if (refresh) {
            const res = await api.post("/letrajato/token/refresh/", { refresh });
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(true);
        }
      } catch (e) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }
    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post("/letrajato/token/", { email, password });
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.error("Login failed", err);
      setIsAuthenticated(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {loading ? <div>Loading auth...</div> : children}
    </AuthContext.Provider>
  );
}