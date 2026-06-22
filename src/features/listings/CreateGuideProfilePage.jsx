/**
 * CreateGuideProfilePage.jsx — Update Guide Profile Form
 *
 * Allows users with role="guide" to update their guide profile,
 * including their profile image (stored in user model) and professional details.
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getGuideProfile, updateGuideProfile } from "../../api/listingsApi";
import { getMediaUrl } from "../../api/axiosInstance";
import { Camera, Save, ArrowLeft } from "lucide-react";

const CreateGuideProfilePage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    profile_image: null,
    bio: "",
    experience_years: "",
    location: "",
    price_per_day: "",
  });

  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch guide profile details on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getGuideProfile();
        setForm({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          phone: data.phone || "",
          profile_image: data.profile_image || null,
          bio: data.bio || "",
          experience_years: data.experience_years || "",
          location: data.location || "",
          price_per_day: data.price_per_day || "",
        });

        if (data.profile_image) {
          setPreview(getMediaUrl(data.profile_image));
        }
      } catch (err) {
        console.error("Error fetching guide profile:", err);
        setError("Failed to load guide profile details.");
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({
        ...prev,
        profile_image: file,
      }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await updateGuideProfile(form);
      setSuccess("Guide profile updated successfully!");
      // Redirect to /profile after a brief delay, using full window relocation to refresh the auth context
      setTimeout(() => {
        window.location.href = "/profile";
      }, 1500);
    } catch (err) {
      console.error("Error updating guide profile:", err);
      setError(
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Failed to update guide profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <p>Loading guide profile...</p>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <button onClick={() => navigate("/profile")} style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-h)", display: "flex", alignItems: "center", gap: "6px", padding: "8px 12px" }}>
          <ArrowLeft size={16} /> Back to Profile
        </button>
        <h2 style={{ margin: 0 }}>Update Guide Profile</h2>
      </div>

      {error && <div className="feedback-alert feedback-error">{error}</div>}
      {success && <div className="feedback-alert feedback-success">{success}</div>}

      <div className="content-card">
        <form onSubmit={handleSubmit}>
          {/* Profile Image Section */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", marginBottom: "30px", borderBottom: "1px solid var(--border)", paddingBottom: "24px" }}>
            <div style={{ position: "relative", width: "120px", height: "120px" }}>
              {preview ? (
                <img
                  src={preview}
                  alt="Profile Preview"
                  style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "3px solid var(--accent)" }}
                />
              ) : (
                <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "linear-gradient(135deg, var(--accent) 0%, #ff7b90 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "36px", fontWeight: "bold" }}>
                  {form.first_name ? form.first_name[0].toUpperCase() : "?"}
                </div>
              )}
              <label
                htmlFor="profile_image_input"
                style={{
                  position: "absolute",
                  bottom: "0",
                  right: "0",
                  background: "var(--accent)",
                  color: "white",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  transition: "transform 0.2s ease"
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                <Camera size={18} />
              </label>
              <input
                id="profile_image_input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
            <span style={{ fontSize: "14px", color: "var(--text)" }}>Click the camera icon to upload a profile picture</span>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label>First Name</label>
              <input
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                placeholder="First Name"
                required
              />
            </div>

            <div className="form-field">
              <label>Last Name</label>
              <input
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                placeholder="Last Name"
                required
              />
            </div>

            <div className="form-field">
              <label>Phone Number</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
              />
            </div>

            <div className="form-field">
              <label>Years of Experience</label>
              <input
                name="experience_years"
                type="number"
                value={form.experience_years}
                onChange={handleChange}
                placeholder="Years of experience"
                required
              />
            </div>

            <div className="form-field">
              <label>Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Location"
                required
              />
            </div>

            <div className="form-field">
              <label>Price per Day ($)</label>
              <input
                name="price_per_day"
                type="number"
                value={form.price_per_day}
                onChange={handleChange}
                placeholder="Price per day ($)"
                required
              />
            </div>

            <div className="form-field full-width">
              <label>Bio</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Tell travelers about yourself, your background, areas of expertise, etc..."
                required
              />
            </div>

            <div className="form-field full-width" style={{ marginTop: "10px" }}>
              <button type="submit" disabled={loading} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%" }}>
                <Save size={18} /> {loading ? "Saving Changes..." : "Save Profile Details"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGuideProfilePage;