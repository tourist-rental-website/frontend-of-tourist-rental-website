/**
 * RegisterPage.jsx — User Registration Form
 *
 * Allows new users to create an account.
 * Fields: email, password, first_name, last_name, phone, role
 *
 * The role selector determines what the user can do:
 *   - traveler: Book rooms and packages
 *   - guide:    Create guide profiles and tour packages
 *   - hotel:    Create hotel profiles and rooms
 *
 * On success, auto-logs in and redirects to home.
 */

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Form state — controlled inputs
  const [form, setForm] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    role: "traveler",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /** Update form field on input change */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /** Submit registration data */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      // Show backend validation errors (e.g., "email already exists")
      const data = err.response?.data;
      if (data && typeof data === "object") {
        // Backend may return field-level errors like { email: ["already exists"] }
        const messages = Object.values(data).flat().join(". ");
        setError(messages || "Registration failed");
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Register</h2>

      {/* Display error message if registration fails */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            name="first_name"
            placeholder="First Name"
            value={form.first_name}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            name="last_name"
            placeholder="Last Name"
            value={form.last_name}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="role-select">Role: </label>
          <select
            id="role-select"
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="traveler">Traveler</option>
            <option value="guide">Guide</option>
            <option value="hotel">Hotel</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p style={{ marginTop: "16px" }}>
        Already have an account?{" "}
        <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default RegisterPage;