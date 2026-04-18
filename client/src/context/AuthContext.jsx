import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => window.localStorage.getItem("token") || "");

  function setToken(nextToken) {
    if (nextToken) {
      window.localStorage.setItem("token", nextToken);
      setTokenState(nextToken);
      return;
    }

    window.localStorage.removeItem("token");
    setTokenState("");
  }

  function logout() {
    setToken("");
  }

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      setToken,
      logout
    }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
