// context/AuthContext.jsx
// Global auth state: current user, token, login/logout/register actions.
// Persists token to localStorage so refresh doesn't log the user out.
// TICKET-FE-01

import { createContext, useState, useEffect, useCallback } from "react";
import { registerUser, loginUser, getMe } from "../services/authService.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true); // true while we verify stored token

  // On mount, if a token exists in localStorage, fetch the current user profile
  // so the UI shows the avatar/name immediately after a page refresh.
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    getMe()
      .then((res) => setUser(res.data.user))
      .catch(() => {
        // Token is invalid/expired — clean up
        localStorage.removeItem("token");
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // We intentionally run this only once at mount; `token` is the seed value.

  const persistToken = (t) => {
    setToken(t);
    localStorage.setItem("token", t);
  };

  // Re-fetches the current user profile from the server and updates state.
  // Needed whenever something changes server-side that the in-memory `user`
  // object doesn't know about — e.g. creating a channel pushes a new id onto
  // user.channels on the backend, but nothing here would reflect that until
  // the next login/refresh without explicitly calling this.
  const refreshUser = useCallback(async () => {
    try {
      const res = await getMe();
      setUser(res.data.user);
    } catch {
      // Token likely expired/invalid — the axios 401 interceptor already
      // clears it from localStorage; nothing extra to do here.
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await loginUser({ email, password });
    const { token: t, user: u } = res.data;
    persistToken(t);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (username, email, password) => {
    // register returns 201; after success the caller redirects to /login
    const res = await registerUser({ username, email, password });
    return res.data;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  }, []);

  const value = {
    user,
    token,
    loading,       // consumers can gate renders while we rehydrate
    isAuthed: !!user,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
