/**
 * ProfilePage.jsx — User Profile View & Edit
 */

import { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { User, Mail, Phone, Shield, CheckCircle, ShieldCheck, Camera, Upload, X } from "lucide-react";
import { getImageUrl } from "../../utils/imageUtils";
import { getErrorMessage } from "../../utils/errorUtils";

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    phone: user?.phone || "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {

      const formData = new FormData();

      formData.append("first_name", form.first_name);
      formData.append("last_name", form.last_name);
      formData.append("phone", form.phone);

      if (profileImageFile) {
        formData.append(
          "profile_image",
          profileImageFile
        );
      }

      await updateProfile(formData);

      setMessage("Profile updated successfully!");

    } catch (err) {
      setError(getErrorMessage(err, "Failed to update profile. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return;
    
    setProfileImageFile(file);

    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  }

  /** Remove the selected image preview */
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

  if (!user) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
        <p className="text-muted">Loading profile details...</p>
      </div>
    );
  }

  const getRoleBadgeLabel = (role) => {
    switch (role) {
      case "traveler":
        return "Traveler Account";
      case "guide":
        return "Tour Guide Partner";
      case "hotel":
        return "Hotel Partner";
      default:
        return role;
    }
  };

  // Determine which image to show: preview (selected but unsaved) > existing profile image > fallback initials
  const displayImageUrl = previewUrl || getImageUrl(user.profile_image);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      
      {/* Profile Title Header */}
      <div className="flex-between margin-bottom-sm" style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "1.5rem", marginBottom: "2rem" }}>
        <div className="flex-center" style={{ gap: "1.5rem" }}>
          {/* Avatar with clickable image upload */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            style={{ 
              width: "72px", 
              height: "72px", 
              borderRadius: "50%", 
              background: displayImageUrl ? "transparent" : "linear-gradient(135deg, var(--primary-color), var(--accent-color))",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "700",
              fontSize: "1.5rem",
              boxShadow: "0 4px 10px rgba(59, 130, 246, 0.2)",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {displayImageUrl ? (
              <img 
                src={displayImageUrl} 
                alt={`${user.first_name} ${user.last_name}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <>
                {user.first_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                {user.last_name?.[0]?.toUpperCase() || ""}
              </>
            )}

            {/* Hover overlay with camera icon */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0, 0, 0, 0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0,
                transition: "opacity 0.2s ease",
                borderRadius: "50%",
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
              onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
            >
              <Camera size={20} style={{ color: "#fff" }} />
            </div>
          </div>

          {/* Hidden file input */}
          <input 
            ref={fileInputRef}
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            style={{ display: "none" }} 
          />
          
          <div>
            <h1 style={{ margin: "0 0 0.25rem", fontSize: "2rem" }}>
              {user.first_name ? `${user.first_name} ${user.last_name}` : user.email.split("@")[0]}
            </h1>
            <div className="flex-center" style={{ gap: "0.5rem" }}>
              <span className="badge badge-confirmed" style={{ fontSize: "0.75rem", padding: "0.2rem 0.6rem" }}>
                <ShieldCheck size={12} />
                <span>{getRoleBadgeLabel(user.role)}</span>
              </span>
              <span className="text-muted" style={{ fontSize: "0.85rem" }}>Joined Partner Program</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "2.5rem" }}>
        
        {/* Left Side: Form Edit Panel */}
        <div className="card" style={{ padding: "2rem" }}>
          <h3 style={{ marginBottom: "1.5rem" }}>Edit Profile Details</h3>
          
          {/* Success / Error Alerts */}
          {message && (
            <div style={{ padding: "0.75rem 1rem", color: "var(--status-confirmed-text)", background: "var(--status-confirmed-bg)", borderRadius: "var(--border-radius-sm)", marginBottom: "1.5rem", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <CheckCircle size={16} />
              <span>{message}</span>
            </div>
          )}
          
          {error && (
            <div style={{ padding: "0.75rem 1rem", color: "var(--accent-color)", background: "rgba(244, 63, 94, 0.1)", borderRadius: "var(--border-radius-sm)", marginBottom: "1.5rem", fontSize: "0.85rem" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            
            {/* Profile Image Upload Section */}
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "0.75rem" }}>
                Profile Photo
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-secondary"
                  style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
                >
                  <Upload size={14} />
                  <span>{displayImageUrl ? "Change Photo" : "Upload Photo"}</span>
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
                  Click avatar or button to change
                </span>
              </div>
            </div>

            {/* First & Last Name Fields */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label htmlFor="first_name" style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                  First Name
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="first_name"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
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
                    value={form.last_name}
                    onChange={handleChange}
                    style={{ paddingLeft: "2.5rem" }}
                  />
                  <User size={16} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                </div>
              </div>
            </div>

            {/* Phone Input Field */}
            <div>
              <label htmlFor="phone" style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                Phone Number
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  style={{ paddingLeft: "2.5rem" }}
                />
                <Phone size={16} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              </div>
            </div>

            {/* Save Button */}
            <button 
              type="submit" 
              className="btn" 
              style={{ width: "100%", marginTop: "0.5rem" }} 
              disabled={loading}
            >
              <span>{loading ? "Saving Changes..." : "Update Profile"}</span>
            </button>
          </form>
        </div>

        {/* Right Side: Account Credentials info (Read Only) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="card" style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-color)" }}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1.25rem" }}>System Credentials</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <span className="text-muted" style={{ fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", display: "block", marginBottom: "0.25rem" }}>Email Identifier</span>
                <div className="flex-center" style={{ color: "var(--text-primary)", fontWeight: "500", fontSize: "0.9rem" }}>
                  <Mail size={14} style={{ color: "var(--primary-color)" }} />
                  <span>{user.email}</span>
                </div>
              </div>

              <div>
                <span className="text-muted" style={{ fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", display: "block", marginBottom: "0.25rem" }}>Access Level</span>
                <div className="flex-center" style={{ color: "var(--text-primary)", fontWeight: "500", fontSize: "0.9rem" }}>
                  <Shield size={14} style={{ color: "var(--primary-color)" }} />
                  <span style={{ textTransform: "capitalize" }}>{user.role}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;