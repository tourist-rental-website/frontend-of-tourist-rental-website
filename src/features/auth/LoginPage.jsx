/**
 * LoginPage.jsx — User Login Form
 */

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
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
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh", padding: "1rem" }}>
      <div className="card glass-card" style={{ width: "100%", maxWidth: "440px", padding: "2.5rem" }}>
        
        {/* Header Title */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.75rem", fontFamily: "var(--font-display)" }}>Welcome Back</h2>
          <p className="text-muted" style={{ fontSize: "0.9rem" }}>Log in to access your bookings and profiles</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div style={{ padding: "0.75rem 1rem", color: "var(--accent-color)", background: "rgba(244, 63, 94, 0.1)", borderRadius: "var(--border-radius-sm)", marginBottom: "1.5rem", fontSize: "0.85rem", borderLeft: "4px solid var(--accent-color)" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
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
                style={{ paddingLeft: "2.75rem" }}
              />
              <Mail size={16} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
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
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                style={{ paddingLeft: "2.75rem" }}
              />
              <Lock size={16} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn" 
            style={{ width: "100%", marginTop: "0.5rem" }} 
            disabled={loading}
          >
            <LogIn size={16} />
            <span>{loading ? "Logging in..." : "Login"}</span>
          </button>
        </form>

        {/* Footer Links */}
        <p style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.9rem" }} className="text-muted">
          Don't have an account?{" "}
          <Link to="/register" style={{ fontWeight: "600", color: "var(--primary-color)" }}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;