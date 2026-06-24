import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { createPackageBooking } from "../../api/bookingApi";
import { getPackageDetails } from "../../api/listingsApi";
import { useAuth } from "../../context/AuthContext";
import { Compass, Calendar, ArrowLeft, Clock, ShieldAlert, MapPin } from "lucide-react";

const BookPackagePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  const [form, setForm] = useState({
    start_date: ""
  });

  useEffect(() => {
    const fetchPackage = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getPackageDetails(id);
        setPkg(data);
      } catch (err) {
        setError("Failed to fetch package details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBookingError("");
    setBookingLoading(true);

    if (!form.start_date) {
      setBookingError("Please select a tour start date.");
      setBookingLoading(false);
      return;
    }

    try {
      await createPackageBooking({
        package: id,
        ...form
      });
      navigate("/my-package-bookings");
    } catch (err) {
      setBookingError(
        err.response?.data?.detail || 
        err.response?.data?.error || 
        "Failed to place booking. Please try again."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  if (user?.role !== "traveler") {
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>
        <ShieldAlert size={48} style={{ color: "var(--accent-color)", marginBottom: "1rem" }} />
        <h2>Access Denied</h2>
        <p className="text-muted">Only registered Travelers can book tour package reservations.</p>
        <Link to="/packages" className="btn btn-secondary margin-top-md">Back to Packages</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
        <p className="text-muted">Loading package details...</p>
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "var(--accent-color)" }}>{error || "Package details not found."}</p>
        <Link to="/packages" className="btn btn-secondary margin-top-md">Back to Packages</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      {/* Back Link */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex-center text-muted" 
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: "1.5rem", fontWeight: "500" }}
      >
        <ArrowLeft size={16} />
        <span>Back to Packages</span>
      </button>

      <h1 style={{ marginBottom: "1.5rem" }}>Confirm Tour Booking</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem" }}>
        
        {/* Left Column: Form Inputs */}
        <div className="card" style={{ padding: "2rem" }}>
          <h3 style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Calendar size={18} style={{ color: "var(--primary-color)" }} />
            <span>Select Tour Start Date</span>
          </h3>

          {bookingError && (
            <div style={{ padding: "1rem", color: "var(--accent-color)", background: "rgba(244, 63, 94, 0.1)", borderRadius: "var(--border-radius-sm)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
              {bookingError}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label htmlFor="start_date" style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                Start Date
              </label>
              <input
                id="start_date"
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split("T")[0]}
                style={{ width: "100%" }}
              />
            </div>

            <button 
              type="submit" 
              className="btn" 
              style={{ width: "100%", marginTop: "1rem" }}
              disabled={bookingLoading}
            >
              {bookingLoading ? "Booking..." : "Confirm Booking"}
            </button>
          </form>
        </div>

        {/* Right Column: Booking Summary Card */}
        <div className="card" style={{ background: "var(--bg-tertiary)", alignSelf: "start" }}>
          <div className="flex-center" style={{ color: "var(--primary-color)", marginBottom: "0.75rem" }}>
            <Compass size={20} />
            <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{pkg.title}</h3>
          </div>

          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
            {pkg.description || "An immersive local tour featuring top-rated guides, transportation, and customized day itineraries."}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
            <div className="flex-between text-muted" style={{ fontSize: "0.85rem" }}>
              <span>Duration</span>
              <span className="flex-center" style={{ color: "var(--text-primary)", fontWeight: "500" }}>
                <Clock size={14} />
                <span>{pkg.duration_days} Days</span>
              </span>
            </div>
            <div className="flex-between text-muted" style={{ fontSize: "0.85rem" }}>
              <span>Location</span>
              <span className="flex-center" style={{ color: "var(--text-primary)", fontWeight: "500" }}>
                <MapPin size={14} />
                <span>{pkg.location}</span>
              </span>
            </div>
          </div>

          <div className="flex-between">
            <span style={{ fontWeight: "600", color: "var(--text-primary)", fontSize: "0.95rem" }}>Total Package Cost</span>
            <span style={{ fontSize: "1.45rem", fontWeight: "800", color: "var(--primary-color)" }}>
              ${pkg.price}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookPackagePage;