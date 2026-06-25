/**
 * CreateRoomPage.jsx — Room Creation Form
 *
 * Allows users with role="hotel" to add rooms to their hotel.
 * Hotel profile must exist before creating rooms.
 *
 * Form fields: room_type (dropdown), price_per_night, capacity, description, is_available
 * Also supports multi-image upload — images are sent to the backend after room creation.
 * On success, redirects to the hotels list page.
 */

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom, uploadRoomImages } from "../../api/listingsApi";
import { getErrorMessage } from "../../utils/errorUtils";
import { Camera, Upload, X, ImagePlus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const CreateRoomPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { user } = useAuth();

  const [form, setForm] = useState({
    room_type: "standard",
    price_per_night: "",
    capacity: "",
    description: "",
    is_available: true,
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
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

  /** Handle multi-image file selection */
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setImageFiles((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  /** Remove a specific image by index */
  const handleRemoveImage = (index) => {
    URL.revokeObjectURL(previewUrls[index]);
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  /** Submit room data, then upload images if any */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Step 1: Create the room
      const createdRoom = await createRoom(form);

      // Step 2: Upload images to the newly created room
      if (imageFiles.length > 0) {
        await uploadRoomImages(createdRoom.id, imageFiles);
      }

      navigate(user?.id ? `/hotels/${user.id}/rooms` : "/hotels");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to create room. Make sure you have a hotel profile first."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "0.5rem" }}>Create Room</h2>
      <p className="text-muted" style={{ marginBottom: "2rem" }}>
        Add a new room to your hotel listing
      </p>

      {error && (
        <div style={{ 
          padding: "0.75rem 1rem", 
          color: "var(--accent-color)", 
          background: "rgba(244, 63, 94, 0.1)", 
          borderRadius: "var(--border-radius-sm)", 
          marginBottom: "1.5rem", 
          fontSize: "0.85rem" 
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Room Images Upload */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "0.75rem" }}>
            Room Photos
          </label>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.75rem" }}>
            {/* Existing image previews */}
            {previewUrls.map((url, index) => (
              <div 
                key={index} 
                style={{ 
                  width: "100px", 
                  height: "100px", 
                  borderRadius: "var(--border-radius-sm)", 
                  overflow: "hidden", 
                  position: "relative",
                  border: "1px solid var(--border-color)",
                }}
              >
                <img 
                  src={url} 
                  alt={`Room preview ${index + 1}`} 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  style={{
                    position: "absolute",
                    top: "4px",
                    right: "4px",
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    background: "rgba(0,0,0,0.6)",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            ))}

            {/* Add image placeholder button */}
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "var(--border-radius-sm)",
                border: "2px dashed var(--border-color)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                background: "var(--bg-secondary)",
                gap: "0.25rem",
                transition: "border-color 0.2s ease",
              }}
            >
              <ImagePlus size={22} style={{ color: "var(--text-muted)" }} />
              <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>Add Photo</span>
            </div>
          </div>

          <span className="text-muted" style={{ fontSize: "0.75rem" }}>
            JPG, PNG or WebP. You can upload multiple images.
          </span>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>

        {/* Room Type & Price */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
          <div>
            <label htmlFor="room-type-select" style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
              Room Type
            </label>
            <select
              id="room-type-select"
              name="room_type"
              value={form.room_type}
              onChange={handleChange}
            >
              <option value="standard">Standard</option>
              <option value="deluxe">Deluxe</option>
              <option value="suite">Suite</option>
            </select>
          </div>

          <div>
            <label htmlFor="price_per_night" style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
              Price per Night ($)
            </label>
            <input
              id="price_per_night"
              name="price_per_night"
              type="number"
              placeholder="Price per night ($)"
              value={form.price_per_night}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Capacity & Availability */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
          <div>
            <label htmlFor="capacity" style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
              Guest Capacity
            </label>
            <input
              id="capacity"
              name="capacity"
              type="number"
              placeholder="Guest capacity"
              value={form.capacity}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: "0.65rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)", cursor: "pointer" }}>
              <input
                type="checkbox"
                name="is_available"
                checked={form.is_available}
                onChange={handleChange}
                style={{ width: "auto" }}
              />
              Available for booking
            </label>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label htmlFor="description" style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Room description..."
            value={form.description}
            onChange={handleChange}
            style={{ minHeight: "100px" }}
          />
        </div>

        <button type="submit" className="btn" style={{ width: "100%" }} disabled={loading}>
          <span>{loading ? "Creating..." : "Create Room"}</span>
        </button>
      </form>
    </div>
  );
};

export default CreateRoomPage;