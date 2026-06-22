import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import TravelerProfile from "./components/TravelerProfile";
import GuideProfile from "./components/GuideProfile";
import HotelProfile from "./components/HotelProfile";
import { CheckCircle, XCircle } from "lucide-react";

/**
 * ProfilePage.jsx — Main User Profile Route Component
 *
 * Route path: /profile
 * Renders traveler, guide, or hotel subcomponents based on user.role
 * Centralizes authentication and profile update handlers.
 */
const ProfilePage = () => {
  const { user, updateProfile } = useAuth();

  // Initialize profile form with current user settings
  const [form, setForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    phone: user?.phone || "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /** Sync profile input field changes */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /** Send PATCH update to backend profile endpoint */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      await updateProfile(form);
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <p>Loading user profile...</p>;
  }

  // Generate dynamic profile avatar letters
  const initials =
    user.first_name && user.last_name
      ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
      : user.first_name
      ? user.first_name[0].toUpperCase()
      : user.email[0].toUpperCase();

  const getRoleBadgeClass = (role) => {
    return `profile-role-badge role-${role}`;
  };

  return (
    <div>
      <h2>Account Profile</h2>

      {/* Dynamic Success / Error alerts */}
      {message && (
        <div className="feedback-alert feedback-success">
          <CheckCircle size={16} /> {message}
        </div>
      )}
      {error && (
        <div className="feedback-alert feedback-error">
          <XCircle size={16} /> {error}
        </div>
      )}

      {/* Split layout: sidebar details card + action panels */}
      <div className="profile-layout">
        {/* Sidebar Info Card */}
        <div className="profile-sidebar">
          <div className="profile-card">
            <div className="avatar-container">
              <div className="profile-avatar">{initials}</div>
            </div>
            <h3 className="profile-name">
              {user.first_name || user.last_name
                ? `${user.first_name} ${user.last_name}`
                : "Welcome Traveler"}
            </h3>
            <span className={getRoleBadgeClass(user.role)}>
              {user.role}
            </span>

            <div className="profile-stats">
              <div className="stat-item">
                <span>Email Address</span>
                <span className="stat-val" style={{ fontSize: "12px" }}>
                  {user.email}
                </span>
              </div>
              {user.phone && (
                <div className="stat-item">
                  <span>Phone Number</span>
                  <span className="stat-val">{user.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Subcomponent panels per user role */}
        <div>
          {user.role === "traveler" && (
            <TravelerProfile
              form={form}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              loading={loading}
            />
          )}

          {user.role === "guide" && (
            <GuideProfile
              user={user}
              form={form}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              loading={loading}
            />
          )}

          {user.role === "hotel" && (
            <HotelProfile
              user={user}
              form={form}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;