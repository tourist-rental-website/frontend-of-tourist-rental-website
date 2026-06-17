/**
 * useAuth.js — Auth Context Shortcut Hook
 *
 * Convenience hook for consuming AuthContext from any component.
 * Throws a helpful error if used outside of <AuthProvider>.
 *
 * Usage:
 *   import useAuth from '../hooks/useAuth';
 *   const { user, login, logout, isAuthenticated } = useAuth();
 */

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return context;
};

export default useAuth;
