import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getMyRoomBookings,
  getMyPackageBookings,
  cancelRoomBooking,
  cancelPackageBooking
} from "../../../api/bookingApi";
import {
  User,
  Calendar,
  Clock,
  XCircle,
  FileText
} from "lucide-react";

/**
 * TravelerProfile.jsx
 *
 * Renders traveler-specific profile features:
 *  - Edit Personal Information (first_name, last_name, phone)
 *  - List of Room Bookings with cancellation actions
 *  - List of Tour Package Bookings with cancellation actions
 */
const TravelerProfile = ({ form, handleChange, handleSubmit, loading }) => {
  const [roomBookings, setRoomBookings] = useState([]);
  const [packageBookings, setPackageBookings] = useState([]);
  const [roomLoading, setRoomLoading] = useState(true);
  const [packageLoading, setPackageLoading] = useState(true);
  const [actionError, setActionError] = useState("");

  // Load traveler's room bookings safely
  const loadRoomBookings = async () => {
    try {
      const data = await getMyRoomBookings();
      const bookingsArray = Array.isArray(data) ? data : (data?.results || []);
      setRoomBookings(bookingsArray);
    } catch (err) {
      console.error("Error loading room bookings:", err);
      setRoomBookings([]);
    } finally {
      setRoomLoading(false);
    }
  };

  // Load traveler's package bookings safely
  const loadPackageBookings = async () => {
    try {
      const data = await getMyPackageBookings();
      const bookingsArray = Array.isArray(data) ? data : (data?.results || []);
      setPackageBookings(bookingsArray);
    } catch (err) {
      console.error("Error loading package bookings:", err);
      setPackageBookings([]);
    } finally {
      setPackageLoading(false);
    }
  };

  useEffect(() => {
    loadRoomBookings();
    loadPackageBookings();
  }, []);

  const handleCancelRoom = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this room booking?")) return;
    setActionError("");
    try {
      await cancelRoomBooking(id);
      loadRoomBookings(); // Refresh bookings list
    } catch (err) {
      setActionError("Failed to cancel room booking. It might not be pending or confirmed.");
      console.error(err);
    }
  };

  const handleCancelPackage = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this package booking?")) return;
    setActionError("");
    try {
      await cancelPackageBooking(id);
      loadPackageBookings(); // Refresh bookings list
    } catch (err) {
      setActionError("Failed to cancel package booking. It might not be pending or confirmed.");
      console.error(err);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "item-badge badge-confirmed";
      case "cancelled":
        return "item-badge badge-cancelled";
      default:
        return "item-badge badge-pending";
    }
  };

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

      {actionError && (
        <div className="feedback-alert feedback-error">
          <XCircle size={16} /> {actionError}
        </div>
      )}

      {/* Room Bookings Card */}
      <div className="content-card">
        <h3 className="card-title">
          <Calendar size={20} /> My Room Bookings
        </h3>

        {roomLoading ? (
          <p>Loading room bookings...</p>
        ) : roomBookings.length === 0 ? (
          <p style={{ color: "var(--text)", fontSize: "14px", textAlign: "left" }}>
            You haven't booked any rooms yet. <Link to="/hotels" style={{ fontWeight: 600 }}>Browse Hotels</Link> to make your first booking!
          </p>
        ) : (
          <div className="profile-items-list">
            {roomBookings.map((booking) => (
              <div key={booking.id} className="profile-item-card">
                <div className="item-info">
                  <div className="item-title">
                    {booking.room?.hotel_name || booking.room_details?.hotel_name || "Hotel Room"}{" "}
                    ({booking.room?.room_type || booking.room_details?.room_type || "Room"})
                  </div>
                  <div className="item-meta">
                    <span>
                      <Calendar size={14} /> {booking.check_in} to {booking.check_out}
                    </span>
                    <span>
                      <span className={getStatusBadgeClass(booking.status)}>
                        {booking.status}
                      </span>
                    </span>
                  </div>
                </div>

                {(booking.status?.toLowerCase() === "pending" || booking.status?.toLowerCase() === "confirmed") && (
                  <button
                    onClick={() => handleCancelRoom(booking.id)}
                    className="btn-cancel-booking"
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Package Bookings Card */}
      <div className="content-card">
        <h3 className="card-title">
          <FileText size={20} /> My Package Bookings
        </h3>

        {packageLoading ? (
          <p>Loading package bookings...</p>
        ) : packageBookings.length === 0 ? (
          <p style={{ color: "var(--text)", fontSize: "14px", textAlign: "left" }}>
            You haven't booked any tour packages yet. <Link to="/packages" style={{ fontWeight: 600 }}>Explore Tour Packages</Link> to start your adventure!
          </p>
        ) : (
          <div className="profile-items-list">
            {packageBookings.map((booking) => (
              <div key={booking.id} className="profile-item-card">
                <div className="item-info">
                  <div className="item-title">
                    {booking.package?.title || booking.package_details?.title || "Tour Package"}
                  </div>
                  <div className="item-meta">
                    <span>
                      <Clock size={14} /> Starts: {booking.start_date}
                    </span>
                    <span>
                      <span className={getStatusBadgeClass(booking.status)}>
                        {booking.status}
                      </span>
                    </span>
                  </div>
                </div>

                {(booking.status?.toLowerCase() === "pending" || booking.status?.toLowerCase() === "confirmed") && (
                  <button
                    onClick={() => handleCancelPackage(booking.id)}
                    className="btn-cancel-booking"
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelerProfile;
