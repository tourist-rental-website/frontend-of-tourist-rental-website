import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getGuides, getPackages } from "../../../api/listingsApi";
import {
  User,
  MapPin,
  Clock,
  Globe,
  DollarSign,
  Award,
  PlusCircle,
  FileText,
  AlertCircle
} from "lucide-react";

/**
 * GuideProfile.jsx
 *
 * Renders guide-specific profile features:
 *  - Edit Personal Information (first_name, last_name, phone)
 *  - Display current Guide Listing profile details (bio, experience, price, etc.)
 *  - Display packages created by this guide
 */
const GuideProfile = ({ user, form, handleChange, handleSubmit, loading }) => {
  const [guideDetails, setGuideDetails] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [loadingPackages, setLoadingPackages] = useState(true);

  // Fetch guide profiles and find the one belonging to the logged-in user
  const fetchGuideDetails = async () => {
    try {
      const data = await getGuides(1);
      const list = data.results || data || [];
      const found = list.find((g) => (g.email || g.user?.email) === user.email);
      if (found) {
        setGuideDetails(found);
      }
    } catch (err) {
      console.error("Error loading guide details:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Fetch packages and filter by current guide ID
  const fetchGuidePackages = async () => {
    try {
      const data = await getPackages(1);
      const list = data.results || data || [];
      setPackages(list);
    } catch (err) {
      console.error("Error loading packages:", err);
    } finally {
      setLoadingPackages(false);
    }
  };

  useEffect(() => {
    fetchGuideDetails();
    fetchGuidePackages();
  }, [user.email]);

  // Filter packages belonging to this guide
  const myPackages = packages.filter((pkg) => {
    if (!guideDetails) return false;
    return (
      pkg.guide === guideDetails.id ||
      pkg.guide_details?.id === guideDetails.id ||
      (pkg.guide_details?.email || pkg.guide_details?.user?.email) === user.email
    );
  });

  return (
    <div className="profile-content">
      {/* Edit Personal Information Card */}
      <div className="content-card">
        <h3 className="card-title">
          <User size={20} /> Personal Information
        </h3>

        <form onSubmit={handleSubmit} className="form-grid">
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

          <div className="form-field full-width">
            <label>Phone Number</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
            />
          </div>

          <div className="form-field full-width" style={{ marginTop: "10px" }}>
            <button type="submit" disabled={loading} style={{ width: "fit-content" }}>
              {loading ? "Saving Changes..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>

      {/* Guide Listing Profile Details */}
      <div className="content-card">
        <h3 className="card-title">
          <Award size={20} /> Guide Professional Profile
        </h3>

        {loadingDetails ? (
          <p>Loading professional profile...</p>
        ) : guideDetails ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" }}>
            <div style={{ fontSize: "15px", lineHeight: "1.6", color: "var(--text-h)" }}>
              <strong>Bio:</strong>
              <p style={{ marginTop: "4px", color: "var(--text)" }}>{guideDetails.bio}</p>
            </div>

            <div className="form-grid" style={{ borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text)" }}>
                <Clock size={16} className="brand-icon" />
                <span><strong>Experience:</strong> {guideDetails.experience_years} years</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text)" }}>
                <Globe size={16} className="brand-icon" />
                <span><strong>Languages:</strong> {guideDetails.languages}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text)" }}>
                <MapPin size={16} className="brand-icon" />
                <span><strong>Location:</strong> {guideDetails.location}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text)" }}>
                <DollarSign size={16} className="brand-icon" />
                <span><strong>Rate:</strong> ${guideDetails.price_per_day} / day</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="feedback-alert feedback-error" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "12px", margin: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <AlertCircle size={20} />
              <strong style={{ fontSize: "15px" }}>Guide Profile Setup Required</strong>
            </div>
            <p style={{ margin: 0, fontSize: "14px", color: "var(--text-h)" }}>
              You haven't set up your public Guide profile page yet. Set this up so tourists can discover and book your services!
            </p>
            <Link to="/create-guide-profile" className="cta-button" style={{ marginTop: "8px" }}>
              Setup Guide Profile
            </Link>
          </div>
        )}
      </div>

      {/* Guide Packages */}
      {guideDetails && (
        <div className="content-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid var(--border)", paddingBottom: "12px" }}>
            <h3 className="card-title" style={{ margin: 0, border: "none", padding: 0 }}>
              <FileText size={20} /> My Tour Packages
            </h3>
            <Link to="/create-package" className="cta-button" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", padding: "6px 14px" }}>
              <PlusCircle size={14} /> Create Package
            </Link>
          </div>

          {loadingPackages ? (
            <p>Loading tour packages...</p>
          ) : myPackages.length === 0 ? (
            <p style={{ color: "var(--text)", fontSize: "14px" }}>
              You haven't listed any tour packages yet. Click "Create Package" to publish your first tour!
            </p>
          ) : (
            <div className="profile-items-list">
              {myPackages.map((pkg) => (
                <div key={pkg.id} className="profile-item-card">
                  <div className="item-info">
                    <div className="item-title">{pkg.title}</div>
                    <div className="item-meta">
                      <span>
                        <Clock size={14} /> {pkg.duration_days} days
                      </span>
                      <span>
                        <MapPin size={14} /> {pkg.location}
                      </span>
                      <span>
                        <strong>Price:</strong> ${pkg.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GuideProfile;
