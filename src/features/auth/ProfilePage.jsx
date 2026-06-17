/**
 * ProfilePage.jsx — User Profile View & Edit
 *
 * Displays the authenticated user's profile information.
 * Editable fields: first_name, last_name, phone
 * Read-only fields: email, role (shown but disabled)
 */

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();

  // Initialize form with current user data
  const [form, setForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    phone: user?.phone || "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /** Update form field on input change */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /** Submit profile updates */
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

  // Safety check — shouldn't happen because this is a protected route
  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Profile</h2>

      {/* Feedback messages */}
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Read-only fields */}
        <div style={{ marginBottom: "10px" }}>
          <label>Email </label>
          <input value={user.email} disabled />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Role </label>
          <input value={user.role} disabled />
        </div>

        {/* Editable fields */}
        <div style={{ marginBottom: "10px" }}>
          <label>First Name </label>
          <input
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Last Name </label>
          <input
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Phone </label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;