/**
 * CreateHotelProfilePage.jsx — Hotel Profile Creation Form
 *
 * Allows users with role="hotel" to create their hotel profile.
 * Must be created before the hotel user can add rooms.
 *
 * Form fields: hotel_name, description, location, contact_number
 * On success, redirects to the hotels list page.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
// FIX: Corrected import path — was "../../../api/" (3 levels), should be "../../api/" (2 levels)
import { createHotelProfile } from "../../api/listingsApi";

const CreateHotelProfilePage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    hotel_name: "",
    description: "",
    location: "",
    contact_number: "",
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

  /** Submit hotel profile data */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createHotelProfile(form);
      navigate("/hotels");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Failed to create hotel profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create Hotel Profile</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <input
            name="hotel_name"
            placeholder="Hotel name"
            value={form.hotel_name}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <textarea
            name="description"
            placeholder="Describe your hotel..."
            value={form.description}
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
            name="contact_number"
            placeholder="Contact number"
            value={form.contact_number}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Hotel Profile"}
        </button>
      </form>
    </div>
  );
};

export default CreateHotelProfilePage;