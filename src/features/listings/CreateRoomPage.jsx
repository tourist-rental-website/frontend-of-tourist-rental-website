/**
 * CreateRoomPage.jsx — Room Creation Form
 *
 * Allows users with role="hotel" to add rooms to their hotel.
 * Hotel profile must exist before creating rooms.
 *
 * Form fields: room_type (dropdown), price_per_night, capacity, description, is_available
 * On success, redirects to the rooms list page.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
// FIX: Corrected import path — was "../../../api/" (3 levels), should be "../../api/" (2 levels)
import { createRoom } from "../../api/listingsApi";

const CreateRoomPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    room_type: "single",
    price_per_night: "",
    capacity: "",
    description: "",
    is_available: true,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /** Handle input changes — special handling for checkbox (checked vs value) */
  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setForm({
      ...form,
      [e.target.name]: value,
    });
  };

  /** Submit room data */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createRoom(form);
      navigate("/hotels");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Failed to create room. Make sure you have a hotel profile first."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create Room</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="room-type-select">Room Type: </label>
          <select
            id="room-type-select"
            name="room_type"
            value={form.room_type}
            onChange={handleChange}
          >
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="suite">Suite</option>
          </select>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            name="price_per_night"
            type="number"
            placeholder="Price per night ($)"
            value={form.price_per_night}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            name="capacity"
            type="number"
            placeholder="Guest capacity"
            value={form.capacity}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <textarea
            name="description"
            placeholder="Room description..."
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>
            <input
              type="checkbox"
              name="is_available"
              checked={form.is_available}
              onChange={handleChange}
            />{" "}
            Available for booking
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Room"}
        </button>
      </form>
    </div>
  );
};

export default CreateRoomPage;