/**
 * CreateGuideProfilePage.jsx — Guide Profile Creation Form
 *
 * Allows users with role="guide" to create their guide profile.
 * Must be created before the guide can create tour packages.
 *
 * Form fields: bio, experience_years, languages, location, price_per_day
 * On success, redirects to the guides list page.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
// FIX: Corrected import path — was "../../../api/" (3 levels), should be "../../api/" (2 levels)
import { createGuideProfile } from "../../api/listingsApi";

const CreateGuideProfilePage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    bio: "",
    experience_years: "",
    languages: "",
    location: "",
    price_per_day: "",
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

  /** Submit guide profile data */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createGuideProfile(form);
      navigate("/guides");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Failed to create guide profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create Guide Profile</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <textarea
            name="bio"
            placeholder="Tell travelers about yourself..."
            value={form.bio}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            name="experience_years"
            type="number"
            placeholder="Years of experience"
            value={form.experience_years}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            name="languages"
            placeholder="Languages (e.g., English, Nepali)"
            value={form.languages}
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

        <div style={{ marginBottom: "10px" }}>
          <input
            name="price_per_day"
            type="number"
            placeholder="Price per day ($)"
            value={form.price_per_day}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Guide Profile"}
        </button>
      </form>
    </div>
  );
};

export default CreateGuideProfilePage;