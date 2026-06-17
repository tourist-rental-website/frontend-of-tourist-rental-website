/**
 * AuthContext.jsx — Global Authentication State
 *
 * Provides authentication state and actions to the entire app via React Context.
 *
 * State exposed:
 *   - user           — Current user profile object (null if logged out)
 *   - accessToken    — JWT access token string
 *   - refreshToken   — JWT refresh token string
 *   - isAuthenticated — Boolean shortcut: true when user is logged in
 *   - isLoading      — True during initial auth check on app mount
 *
 * Actions exposed:
 *   - login(email, password) — Authenticate and store tokens
 *   - register(data)         — Create account then auto-login
 *   - logout()               — Clear tokens and reset state
 *   - updateProfile(data)    — PATCH user profile fields
 *
 * On mount, checks localStorage for existing tokens and validates them
 * by fetching the user profile. Stale/invalid tokens are cleared automatically.
 */

import { createContext, useContext, useEffect, useState } from "react";
import {
  login as loginApi,
  register as registerApi,
  getProfile,
  updateProfile as updateProfileApi,
} from "../api/authApi";

// Create the context — exported so hooks/useAuth.js can import it directly
export const AuthContext = createContext(null);

/**
 * AuthProvider — Wraps the app to provide auth state to all children.
 * Must be placed inside <BrowserRouter> (since login/register may navigate).
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("access_token")
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refresh_token")
  );
  // isLoading starts true — prevents ProtectedRoute from redirecting
  // to /login before we've had a chance to validate stored tokens
  const [isLoading, setIsLoading] = useState(true);

  // -------------------------------------------------------------------------
  // On Mount: Validate existing tokens
  // -------------------------------------------------------------------------
  // If tokens exist in localStorage (from a previous session), try to fetch
  // the user profile. If it fails (expired/invalid), clear everything.
  useEffect(() => {
    const checkAuth = async () => {
      if (accessToken) {
        try {
          const profile = await getProfile();
          setUser(profile);
        } catch (error) {
          // Token is invalid or expired — clean up
          console.warn("Stored token invalid, logging out:", error.message);
          logout();
        }
      }
      setIsLoading(false);
    };
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------------------------------------------------
  // Login — Authenticate with email/password, store tokens, fetch profile
  // -------------------------------------------------------------------------
  const login = async (email, password) => {
    const data = await loginApi({ email, password });

    // Store tokens in localStorage for persistence across page reloads
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    setAccessToken(data.access);
    setRefreshToken(data.refresh);

    // Fetch full user profile after successful login
    const profile = await getProfile();
    setUser(profile);
  };

  // -------------------------------------------------------------------------
  // Register — Create account then auto-login
  // -------------------------------------------------------------------------
  const register = async (data) => {
    await registerApi(data);
    // Auto-login after successful registration
    await login(data.email, data.password);
  };

  // -------------------------------------------------------------------------
  // Logout — Clear all auth state
  // -------------------------------------------------------------------------
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  // -------------------------------------------------------------------------
  // Update Profile — PATCH user fields and sync state
  // -------------------------------------------------------------------------
  const updateProfile = async (data) => {
    const updatedUser = await updateProfileApi(data);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth — Convenience hook to consume AuthContext.
 * Can be imported from here or from hooks/useAuth.js (both work).
 *
 * Usage:
 *   const { user, login, logout } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return context;
};