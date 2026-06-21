/**
 * Navbar.jsx — Main Navigation Bar
 */

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useNotifications from "../hooks/useNotifications";
import { 
  Hotel, 
  Compass, 
  Briefcase, 
  MessageSquare, 
  Bell, 
  User, 
  LogOut, 
  LogIn, 
  UserPlus,
  CalendarCheck
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="navbar-wrapper">
      <div 
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "1rem 1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem"
        }}
      >
        {/* Brand / Logo */}
        <Link 
          to="/" 
          style={{ 
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "1.4rem", 
            fontWeight: "700", 
            color: "var(--text-primary)", 
            fontFamily: "var(--font-display)",
            textDecoration: "none"
          }}
        >
          <span 
            style={{ 
              background: "linear-gradient(135deg, var(--primary-color), var(--accent-color))",
              color: "#fff",
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "800",
              fontSize: "1.2rem"
            }}
          >
            T
          </span>
          <span style={{ letterSpacing: "-0.03em" }}>TouristHelper</span>
        </Link>

        {/* Navigation Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <Link 
            to="/hotels" 
            style={linkStyle(isActive("/hotels"))}
          >
            <Hotel size={16} />
            <span>Hotels</span>
          </Link>
          <Link 
            to="/guides" 
            style={linkStyle(isActive("/guides"))}
          >
            <Compass size={16} />
            <span>Guides</span>
          </Link>
          <Link 
            to="/packages" 
            style={linkStyle(isActive("/packages"))}
          >
            <Briefcase size={16} />
            <span>Packages</span>
          </Link>

          {user && (
            <>
              {/* Traveler specific booking links */}
              {user.role === "traveler" && (
                <>
                  <Link 
                    to="/my-room-bookings" 
                    style={linkStyle(isActive("/my-room-bookings"))}
                  >
                    <CalendarCheck size={16} />
                    <span>Room Bookings</span>
                  </Link>
                  <Link 
                    to="/my-package-bookings" 
                    style={linkStyle(isActive("/my-package-bookings"))}
                  >
                    <CalendarCheck size={16} />
                    <span>Package Bookings</span>
                  </Link>
                </>
              )}

              {/* Guide links */}
              {user.role === "guide" && (
                <Link 
                  to="/create-package" 
                  style={linkStyle(isActive("/create-package"))}
                >
                  <Briefcase size={16} />
                  <span>Create Package</span>
                </Link>
              )}

              {/* Hotel links */}
              {user.role === "hotel" && (
                <>
                  <Link 
                    to="/create-hotel-profile" 
                    style={linkStyle(isActive("/create-hotel-profile"))}
                  >
                    <Hotel size={16} />
                    <span>Hotel Profile</span>
                  </Link>
                  <Link 
                    to="/create-room" 
                    style={linkStyle(isActive("/create-room"))}
                  >
                    <Hotel size={16} />
                    <span>Create Room</span>
                  </Link>
                </>
              )}

              {/* Chat */}
              <Link 
                to="/conversations" 
                style={linkStyle(isActive("/conversations"))}
              >
                <MessageSquare size={16} />
                <span>Chat</span>
              </Link>

              {/* Notifications with Badge */}
              <Link 
                to="/notifications" 
                style={{
                  ...linkStyle(isActive("/notifications")),
                  position: "relative",
                  padding: "0.5rem"
                }}
                aria-label="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span 
                    style={{
                      position: "absolute",
                      top: "2px",
                      right: "2px",
                      background: "var(--accent-color)",
                      color: "#fff",
                      borderRadius: "50%",
                      minWidth: "16px",
                      height: "16px",
                      fontSize: "9px",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px solid var(--bg-secondary)"
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </Link>

              {/* User Profile */}
              <Link 
                to="/profile" 
                style={{
                  ...linkStyle(isActive("/profile")),
                  background: "var(--bg-tertiary)",
                  padding: "0.4rem 1rem",
                  borderRadius: "20px",
                  fontWeight: "600"
                }}
              >
                <User size={14} />
                <span>{user.first_name || user.email.split("@")[0]}</span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="btn btn-accent"
                style={{
                  padding: "0.4rem 1rem",
                  borderRadius: "20px",
                  fontSize: "0.85rem",
                  gap: "0.35rem"
                }}
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </>
          )}

          {!user && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginLeft: "0.5rem" }}>
              <Link 
                to="/login" 
                style={{
                  ...linkStyle(isActive("/login")),
                  background: "var(--bg-tertiary)",
                  padding: "0.4rem 1rem",
                  borderRadius: "20px"
                }}
              >
                <LogIn size={14} />
                <span>Login</span>
              </Link>
              <Link 
                to="/register" 
                className="btn"
                style={{
                  padding: "0.4rem 1rem",
                  borderRadius: "20px",
                  fontSize: "0.85rem",
                  gap: "0.35rem"
                }}
              >
                <UserPlus size={14} />
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const linkStyle = (active) => ({
  color: active ? "var(--primary-color)" : "var(--text-secondary)",
  textDecoration: "none",
  fontSize: "0.9rem",
  fontWeight: active ? "600" : "500",
  display: "flex",
  alignItems: "center",
  gap: "0.4rem",
  padding: "0.5rem 0.75rem",
  borderRadius: "var(--border-radius-sm)",
  transition: "var(--transition-fast)",
  backgroundColor: active ? "rgba(59, 130, 246, 0.08)" : "transparent"
});

export default Navbar;
