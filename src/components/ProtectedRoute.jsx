/**
 * ProtectedRoute.jsx — Authentication Guard
 *
 * Wraps routes that require the user to be logged in.
 * Used as a layout route in App.jsx:
 *
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/profile" element={<ProfilePage />} />
 *   </Route>
 *
 * Behavior:
 *   - While auth is loading (initial token check): shows a loading spinner
 *   - If not authenticated: redirects to /login
 *   - If authenticated: renders the child route via <Outlet />
 */

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Don't redirect while we're still checking stored tokens —
  // this prevents a flash redirect on page refresh
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // User is not logged in — redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated — render the child route
  return <Outlet />;
};

export default ProtectedRoute;