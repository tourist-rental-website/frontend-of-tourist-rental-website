/**
 * Navbar.jsx — Main Navigation Bar
 *
 * Displays navigation links that adapt based on:
 *   - Authentication state (logged in vs. anonymous)
 *   - User role (traveler, guide, hotel)
 *
 * Shows notification badge with unread count when authenticated.
 * Role-specific links (e.g., "Create Room" for hotels) appear conditionally.
 */

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useNotifications from "../hooks/useNotifications";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  /**
   * Handle logout: clear auth state then redirect to login page
   */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        padding: "12px 20px",
        background: "#1a1a2e",
        display: "flex",
        gap: "16px",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {/* Brand / Home link */}
      <Link to="/" style={{ fontWeight: "bold", color: "#e94560", fontSize: "18px", textDecoration: "none" }}>
        TouristHelper
      </Link>

      {/* Public navigation links — visible to everyone */}
      <Link to="/hotels" style={linkStyle}>Hotels</Link>
      <Link to="/guides" style={linkStyle}>Guides</Link>
      <Link to="/packages" style={linkStyle}>Packages</Link>

      {user ? (
        <>
          {/* ---- Authenticated Links ---- */}

          {/* Role-specific links */}
          {user.role === "traveler" && (
            <>
              <Link to="/my-room-bookings" style={linkStyle}>My Room Bookings</Link>
              <Link to="/my-package-bookings" style={linkStyle}>My Package Bookings</Link>
            </>
          )}
          {user.role === "guide" && (
            <>
              {/*<Link to="/create-guide-profile" style={linkStyle}>Guide Profile</Link>*/}
              <Link to="/create-package" style={linkStyle}>Create Package</Link>
            </>
          )}
          {user.role === "hotel" && (
            <>
              <Link to="/create-hotel-profile" style={linkStyle}>Hotel Profile</Link>
              <Link to="/create-room" style={linkStyle}>Create Room</Link>
            </>
          )}

          {/* Chat */}
          <Link to="/conversations" style={linkStyle}>Chat</Link>

          {/* Notifications with unread badge */}
          <Link to="/notifications" style={linkStyle}>
            🔔 {unreadCount > 0 && <span style={badgeStyle}>{unreadCount}</span>}
          </Link>

          {/* Profile — shows user's first name (not username, which doesn't exist on this model) */}
          <Link to="/profile" style={linkStyle}>
            {user.first_name || user.email}
          </Link>

          <button
            onClick={handleLogout}
            style={{
              background: "#e94560",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "6px 14px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          {/* ---- Anonymous Links ---- */}
          <Link to="/login" style={linkStyle}>Login</Link>
          <Link to="/register" style={linkStyle}>Register</Link>
        </>
      )}
    </nav>
  );
};

/** Shared inline style for nav links */
const linkStyle = {
  color: "#eee",
  textDecoration: "none",
  fontSize: "14px",
};

/** Notification badge style */
const badgeStyle = {
  background: "#e94560",
  color: "#fff",
  borderRadius: "50%",
  padding: "2px 6px",
  fontSize: "11px",
  marginLeft: "4px",
};

export default Navbar;
