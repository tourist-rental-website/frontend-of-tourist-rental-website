/**
 * CreatePackagePage.jsx — Tour Package Creation Form
 *
 * Allows users with role="guide" to create tour packages.
 * Guide profile must exist before creating packages.
 *
 * Form fields: title, description, price, duration_days, location
 * On success, redirects to the packages list page.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
// FIX: Corrected import path — was "../../../api/" (3 levels), should be "../../api/" (2 levels)
import { createPackage } from "../../api/listingsApi";
import { getErrorMessage } from "../../utils/errorUtils";

const CreatePackagePage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    duration_days: "",
    location: "",
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

  /** Submit package data */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createPackage(form);
      navigate("/packages");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to create package. Make sure you have a guide profile first."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create Tour Package</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <input
            name="title"
            placeholder="Package title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <textarea
            name="description"
            placeholder="Describe the tour package..."
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            name="price"
            type="number"
            placeholder="Price ($)"
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            name="duration_days"
            type="number"
            placeholder="Duration (days)"
            value={form.duration_days}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Package"}
        </button>
      </form>
    </div>
  );
};

export default CreatePackagePage;