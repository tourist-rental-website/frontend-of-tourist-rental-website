import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useNotifications from "../hooks/useNotifications";
import {
  Compass,
  Bell,
  MessageSquare,
  ChevronDown,
  LogOut,
  User,
  Menu,
  X
} from "lucide-react";

/**
 * Navbar.jsx — Modern & Responsive Navigation Bar
 *
 * Adapts styling and menu structure according to:
 *   - Authentication state (logged in vs. anonymous)
 *   - User role (traveler, guide, hotel)
 *
 * Utilizes glassmorphism styling, clean lucide-react icons,
 * an interactive user dropdown menu, and a mobile drawer.
 */
const Navbar = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close all menus when location/route path changes
  useEffect(() => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Click outside to close the desktop dropdown menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand / Logo */}
        <Link to="/" className="navbar-brand">
          <Compass className="brand-icon" size={26} />
          <span>TouristHelper</span>
        </Link>

        {/* Public Desktop Navigation Links */}
        <nav className="navbar-links">
          <Link
            to="/hotels"
            className={`nav-link ${isActive("/hotels") ? "active" : ""}`}
          >
            Hotels
          </Link>
          <Link
            to="/guides"
            className={`nav-link ${isActive("/guides") ? "active" : ""}`}
          >
            Guides
          </Link>
          <Link
            to="/packages"
            className={`nav-link ${isActive("/packages") ? "active" : ""}`}
          >
            Packages
          </Link>
        </nav>

        {/* Authenticated Actions or Auth Links (Desktop) */}
        <div className="navbar-actions">
          {user ? (
            <>
              {/* Chat Icon Link */}
              <Link
                to="/conversations"
                className="nav-icon-btn"
                title="Chat Conversations"
              >
                <MessageSquare size={20} />
              </Link>

              {/* Notifications Icon Link with Pulsing Badge */}
              <Link
                to="/notifications"
                className="nav-icon-btn"
                title="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="badge-count">{unreadCount}</span>
                )}
              </Link>

              {/* User Dropdown Profile Menu */}
              <div className="dropdown-container" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="dropdown-toggle"
                  aria-haspopup="true"
                  aria-expanded={isDropdownOpen}
                >
                  <User size={16} />
                  <span>{user.first_name || user.email.split("@")[0]}</span>
                  <ChevronDown
                    size={14}
                    style={{
                      transform: isDropdownOpen ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s ease",
                    }}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      {user.role ? `${user.role} Dashboard` : "User Account"}
                    </div>

                    {/* Role-Specific Navigation Options */}
                    {user.role === "traveler" && (
                      <>
                        <Link to="/my-room-bookings" className="dropdown-item">
                          My Room Bookings
                        </Link>
                        <Link to="/my-package-bookings" className="dropdown-item">
                          My Package Bookings
                        </Link>
                      </>
                    )}

                    {user.role === "guide" && (
                      <>
                        <Link to="/create-guide-profile" className="dropdown-item">
                          Guide Profile
                        </Link>
                        <Link to="/create-package" className="dropdown-item">
                          Create Package
                        </Link>
                      </>
                    )}

                    {user.role === "hotel" && (
                      <>
                        <Link to="/create-hotel-profile" className="dropdown-item">
                          Hotel Profile
                        </Link>
                        <Link to="/create-room" className="dropdown-item">
                          Create Room
                        </Link>
                      </>
                    )}

                    <div className="dropdown-divider" />

                    {/* General Account Profile Link */}
                    <Link to="/profile" className="dropdown-item">
                      <User size={14} /> My Profile
                    </Link>

                    {/* Logout Trigger */}
                    <button onClick={handleLogout} className="dropdown-item" style={{ color: "var(--accent)" }}>
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Anonymous Links */}
              <Link
                to="/login"
                className={`nav-link ${isActive("/login") ? "active" : ""}`}
              >
                Login
              </Link>
              <Link to="/register" className="nav-link cta-button">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Hamburger Toggle Button for Mobile Screens */}
        <button
          className="mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Side Drawer */}
      {isMobileMenuOpen && (
        <>
          <div
            className="mobile-overlay"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="mobile-drawer">
            <div className="mobile-drawer-header">
              <Link to="/" className="navbar-brand">
                <Compass size={24} className="brand-icon" />
                <span>TouristHelper</span>
              </Link>
              <button
                className="mobile-toggle"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close Navigation Menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* General Links in Mobile Drawer */}
            <div className="mobile-drawer-links">
              <Link
                to="/hotels"
                className={`nav-link ${isActive("/hotels") ? "active" : ""}`}
              >
                Hotels
              </Link>
              <Link
                to="/guides"
                className={`nav-link ${isActive("/guides") ? "active" : ""}`}
              >
                Guides
              </Link>
              <Link
                to="/packages"
                className={`nav-link ${isActive("/packages") ? "active" : ""}`}
              >
                Packages
              </Link>

              {user && (
                <>
                  <Link
                    to="/conversations"
                    className={`nav-link ${isActive("/conversations") ? "active" : ""}`}
                  >
                    <MessageSquare size={16} /> Chat
                  </Link>
                  <Link
                    to="/notifications"
                    className={`nav-link ${isActive("/notifications") ? "active" : ""}`}
                  >
                    <Bell size={16} /> Notifications
                    {unreadCount > 0 && (
                      <span
                        className="badge-count"
                        style={{ position: "static", marginLeft: "8px" }}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                </>
              )}
            </div>

            {/* Authenticated / Anonymous Section in Mobile Drawer */}
            {user ? (
              <div className="mobile-drawer-section">
                <div className="dropdown-header" style={{ padding: "0 0 8px 0" }}>
                  {user.role ? `${user.role} Dashboard` : "User Account"}
                </div>

                {user.role === "traveler" && (
                  <>
                    <Link to="/my-room-bookings" className="nav-link">
                      My Room Bookings
                    </Link>
                    <Link to="/my-package-bookings" className="nav-link">
                      My Package Bookings
                    </Link>
                  </>
                )}

                {user.role === "guide" && (
                  <>
                    <Link to="/create-guide-profile" className="nav-link">
                      Guide Profile
                    </Link>
                    <Link to="/create-package" className="nav-link">
                      Create Package
                    </Link>
                  </>
                )}

                {user.role === "hotel" && (
                  <>
                    <Link to="/create-hotel-profile" className="nav-link">
                      Hotel Profile
                    </Link>
                    <Link to="/create-room" className="nav-link">
                      Create Room
                    </Link>
                  </>
                )}

                <Link to="/profile" className="nav-link">
                  <User size={16} /> Profile ({user.first_name || user.email})
                </Link>

                <button
                  onClick={handleLogout}
                  className="dropdown-item"
                  style={{
                    color: "var(--accent)",
                    padding: "8px 0",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div className="mobile-drawer-section">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="nav-link cta-button"
                  style={{ textAlign: "center" }}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
