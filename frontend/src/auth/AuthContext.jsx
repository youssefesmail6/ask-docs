import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSeededUserByRole } from "../api/usersApi";

const AuthContext = createContext(null);

const storageKey = "askdocs_session";

function readStoredUser() {
  try {
    const storedUser = window.localStorage.getItem(storageKey);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(readStoredUser());
  }, []);

  async function enterAsRole(role) {
    const response = await getSeededUserByRole(role);
    const nextUser = response.user;
    setUser(nextUser);
    window.localStorage.setItem(storageKey, JSON.stringify(nextUser));
    return nextUser;
  }

  function logout() {
    setUser(null);
    window.localStorage.removeItem(storageKey);
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      enterAsRole,
      logout,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
