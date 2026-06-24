/**
 * RegisterPage.jsx — User Registration Form
 */

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, Phone, UserPlus } from "lucide-react";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === "object") {
        const messages = Object.values(data).flat().join(". ");
        setError(messages || "Registration failed. Please check inputs.");
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", padding: "2rem 1rem" }}>
      <div className="card glass-card" style={{ width: "100%", maxWidth: "560px", padding: "2.5rem" }}>
        
        {/* Header Title */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.75rem", fontFamily: "var(--font-display)" }}>Create Account</h2>
          <p className="text-muted" style={{ fontSize: "0.9rem" }}>Join TouristHelper to plan tours or list bookings</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div style={{ padding: "0.75rem 1rem", color: "var(--accent-color)", background: "rgba(244, 63, 94, 0.1)", borderRadius: "var(--border-radius-sm)", marginBottom: "1.5rem", fontSize: "0.85rem", borderLeft: "4px solid var(--accent-color)" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          
          {/* First & Last Name Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label htmlFor="first_name" style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                First Name
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="first_name"
                  name="first_name"
                  placeholder="John"
                  value={form.first_name}
                  onChange={handleChange}
                  required
                  style={{ paddingLeft: "2.5rem" }}
                />
                <User size={16} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              </div>
            </div>

            <div>
              <label htmlFor="last_name" style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                Last Name
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="last_name"
                  name="last_name"
                  placeholder="Doe"
                  value={form.last_name}
                  onChange={handleChange}
                  required
                  style={{ paddingLeft: "2.5rem" }}
                />
                <User size={16} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              </div>
            </div>
          </div>

          {/* Email field */}
          <div>
            <label htmlFor="email" style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                style={{ paddingLeft: "2.5rem" }}
              />
              <Mail size={16} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label htmlFor="password" style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="•••••••• (Min 8 characters)"
                value={form.password}
                onChange={handleChange}
                required
                style={{ paddingLeft: "2.5rem" }}
              />
              <Lock size={16} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            </div>
          </div>

          {/* Phone field */}
          <div>
            <label htmlFor="phone" style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
              Phone Number
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="phone"
                name="phone"
                placeholder="+1 (555) 000-0000"
                value={form.phone}
                onChange={handleChange}
                style={{ paddingLeft: "2.5rem" }}
              />
              <Phone size={16} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            </div>
          </div>

          {/* Role selector field */}
          <div>
            <label htmlFor="role-select" style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
              Account Role
            </label>
            <select
              id="role-select"
              name="role"
              value={form.role}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid var(--border-color)", borderRadius: "var(--border-radius-sm)", backgroundColor: "var(--bg-secondary)", color: "var(--text-primary)" }}
            >
              <option value="traveler">Traveler — Book Hotels & Guides</option>
              <option value="guide">Guide — Sell Tour Packages</option>
              <option value="hotel">Hotel Owner — List Hotel Rooms</option>
            </select>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn" 
            style={{ width: "100%", marginTop: "1rem" }} 
            disabled={loading}
          >
            <UserPlus size={16} />
            <span>{loading ? "Creating account..." : "Register"}</span>
          </button>
        </form>

        {/* Footer Links */}
        <p style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.9rem" }} className="text-muted">
          Already have an account?{" "}
          <Link to="/login" style={{ fontWeight: "600", color: "var(--primary-color)" }}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;