/**
 * RoleRoute.jsx — Role-Based Access Guard
 *
 * Wraps routes that require a specific user role (traveler, guide, hotel).
 * Used as a layout route in App.jsx:
 *
 *   <Route element={<RoleRoute allowedRoles={["guide"]} />}>
 *     <Route path="/create-package" element={<CreatePackagePage />} />
 *   </Route>
 *
 * Props:
 *   - allowedRoles: string[] — Array of role names that can access the route
 *
 * Behavior:
 *   - While auth is loading: shows a loading spinner (prevents premature redirect)
 *   - If not logged in: redirects to /login
 *   - If logged in but wrong role: redirects to / (home)
 *   - If logged in with correct role: renders the child route via <Outlet />
 */

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

const RoleRoute = ({ allowedRoles }) => {
  const { user, isLoading } = useAuth();

  // Wait for auth check to complete before making access decisions
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Not authenticated at all — redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated but wrong role — redirect to home
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Correct role — render the protected child route
  return <Outlet />;
};

export default RoleRoute;