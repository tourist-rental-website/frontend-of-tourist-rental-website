/**
 * CreateGuideProfilePage.jsx — Guide Profile Creation Form
 *
 * Allows users with role="guide" to create their guide profile.
 * Must be created before the guide can create tour packages.
 *
 * Form fields: bio, experience_years, languages, location, price_per_day, profile_image
 * On success, redirects to the guides list page.
 */

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../../api/authApi";
import { Camera, Upload, X } from "lucide-react";

const CreateGuideProfilePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    bio: "",
    experience_years: "",
    languages: "",
    location: "",
    price_per_day: "",
  });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /** Update form field on input change */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /** Handle image file selection */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileImageFile(file);
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  };

  /** Remove selected image */
  const handleRemoveImage = () => {
    setProfileImageFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /** Submit guide profile data */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("bio", form.bio);
      formData.append("experience_years", form.experience_years);
      formData.append("languages", form.languages);
      formData.append("location", form.location);
      formData.append("price_per_day", form.price_per_day);

      if (profileImageFile) {
        formData.append("profile_image", profileImageFile);
      }

      await updateProfile(formData);
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
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "0.5rem" }}>Create Guide Profile</h2>
      <p className="text-muted" style={{ marginBottom: "2rem" }}>
        Set up your guide profile to start offering tour packages
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
        {/* Profile Image Upload */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "0.75rem" }}>
            Profile Photo
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            {/* Image Preview / Placeholder */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              style={{ 
                width: "100px", 
                height: "100px", 
                borderRadius: "50%", 
                border: "2px dashed var(--border-color)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                overflow: "hidden",
                background: previewUrl ? "transparent" : "var(--bg-secondary)",
                transition: "border-color 0.2s ease",
                position: "relative",
              }}
            >
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Profile preview" 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                />
              ) : (
                <Camera size={28} style={{ color: "var(--text-muted)" }} />
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-secondary"
                style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
              >
                <Upload size={14} />
                <span>{previewUrl ? "Change Photo" : "Upload Photo"}</span>
              </button>

              {previewUrl && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  style={{ 
                    background: "none", 
                    border: "none", 
                    color: "var(--accent-color)", 
                    cursor: "pointer", 
                    fontSize: "0.8rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    padding: "0.25rem 0",
                  }}
                >
                  <X size={12} />
                  <span>Remove</span>
                </button>
              )}

              <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                JPG, PNG or WebP. Max 5MB.
              </span>
            </div>
          </div>

          <input 
            ref={fileInputRef}
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            style={{ display: "none" }} 
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="bio" style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            placeholder="Tell travelers about yourself..."
            value={form.bio}
            onChange={handleChange}
            required
            style={{ minHeight: "100px" }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
          <div>
            <label htmlFor="experience_years" style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
              Years of Experience
            </label>
            <input
              id="experience_years"
              name="experience_years"
              type="number"
              placeholder="Years of experience"
              value={form.experience_years}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="languages" style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
              Languages
            </label>
            <input
              id="languages"
              name="languages"
              placeholder="e.g., English, Nepali"
              value={form.languages}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
          <div>
            <label htmlFor="location" style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
              Location
            </label>
            <input
              id="location"
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="price_per_day" style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
              Price per Day ($)
            </label>
            <input
              id="price_per_day"
              name="price_per_day"
              type="number"
              placeholder="Price per day ($)"
              value={form.price_per_day}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn" style={{ width: "100%" }} disabled={loading}>
          <span>{loading ? "Creating..." : "Create Guide Profile"}</span>
        </button>
      </form>
    </div>
  );
};

export default CreateGuideProfilePage;