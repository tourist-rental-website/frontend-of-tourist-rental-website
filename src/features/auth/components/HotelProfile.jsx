import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHotels, getRooms } from "../../../api/listingsApi";
import {
  User,
  MapPin,
  Phone,
  FileText,
  PlusCircle,
  AlertCircle,
  Home,
  CheckCircle,
  XCircle
} from "lucide-react";

/**
 * HotelProfile.jsx
 *
 * Renders hotel-specific profile features:
 *  - Edit Personal Information (first_name, last_name, phone)
 *  - Display current Hotel Listing details (hotel_name, description, contact, location)
 *  - Display rooms created by this hotel
 */
const HotelProfile = ({ user, form, handleChange, handleSubmit, loading }) => {
  const [hotelDetails, setHotelDetails] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [loadingRooms, setLoadingRooms] = useState(true);

  // Fetch hotel profiles and find the one belonging to the logged-in user
  const fetchHotelDetails = async () => {
    try {
      const data = await getHotels(1);
      const list = data.results || data || [];
      // Find hotel that has contact match or we can inspect data structure
      // Usually matching by looking for a related user or hotel name
      // Let's filter by checking if any contact_number matches user's phone, or we can check user matching if present.
      // Wait, let's look for matching by contact_number or email if present in hotel profile.
      // If we don't have a direct email, let's find the one matching user's last_name or similar if matching structure.
      // In Django backend, HotelProfile usually has a user relation, so let's check `hotel.user?.email` if available.
      const found = list.find((h) => (h.email || h.user?.email) === user.email);
      if (found) {
        setHotelDetails(found);
      }
    } catch (err) {
      console.error("Error loading hotel details:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Fetch rooms and filter by current hotel ID
  const fetchHotelRooms = async () => {
    try {
      const data = await getRooms(1);
      const list = data.results || data || [];
      setRooms(list);
    } catch (err) {
      console.error("Error loading rooms:", err);
    } finally {
      setLoadingRooms(false);
    }
  };

  useEffect(() => {
    fetchHotelDetails();
    fetchHotelRooms();
  }, [user.email]);

  // Filter rooms belonging to this hotel
  const myRooms = rooms.filter((room) => {
    if (!hotelDetails) return false;
    return (
      room.hotel === hotelDetails.id ||
      room.hotel_details?.id === hotelDetails.id ||
      (room.hotel_details?.email || room.hotel_details?.user?.email) === user.email
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

      {/* Hotel Listing Profile Details */}
      <div className="content-card">
        <h3 className="card-title">
          <Home size={20} /> Hotel Business Profile
        </h3>

        {loadingDetails ? (
          <p>Loading hotel business profile...</p>
        ) : hotelDetails ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" }}>
            <div>
              <h4 style={{ margin: "0 0 4px", fontSize: "16px", color: "var(--text-h)" }}>
                {hotelDetails.hotel_name || hotelDetails.name}
              </h4>
              <p style={{ margin: 0, color: "var(--text)", fontSize: "14px", lineHeight: "1.6" }}>
                {hotelDetails.description}
              </p>
            </div>

            <div className="form-grid" style={{ borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text)" }}>
                <MapPin size={16} className="brand-icon" />
                <span><strong>Location:</strong> {hotelDetails.location}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text)" }}>
                <Phone size={16} className="brand-icon" />
                <span><strong>Contact:</strong> {hotelDetails.contact_number || hotelDetails.contact}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="feedback-alert feedback-error" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "12px", margin: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <AlertCircle size={20} />
              <strong style={{ fontSize: "15px" }}>Hotel Profile Setup Required</strong>
            </div>
            <p style={{ margin: 0, fontSize: "14px", color: "var(--text-h)" }}>
              You haven't set up your public Hotel business profile page yet. Set this up so you can create room listings!
            </p>
            <Link to="/create-hotel-profile" className="cta-button" style={{ marginTop: "8px" }}>
              Setup Hotel Profile
            </Link>
          </div>
        )}
      </div>

      {/* Hotel Rooms */}
      {hotelDetails && (
        <div className="content-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid var(--border)", paddingBottom: "12px" }}>
            <h3 className="card-title" style={{ margin: 0, border: "none", padding: 0 }}>
              <Home size={20} /> My Listed Rooms
            </h3>
            <Link to="/create-room" className="cta-button" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", padding: "6px 14px" }}>
              <PlusCircle size={14} /> Create Room
            </Link>
          </div>

          {loadingRooms ? (
            <p>Loading rooms list...</p>
          ) : myRooms.length === 0 ? (
            <p style={{ color: "var(--text)", fontSize: "14px" }}>
              You haven't listed any rooms yet. Click "Create Room" to publish your first hotel room!
            </p>
          ) : (
            <div className="profile-items-list">
              {myRooms.map((room) => (
                <div key={room.id} className="profile-item-card">
                  <div className="item-info">
                    <div className="item-title" style={{ textTransform: "capitalize" }}>
                      {room.room_type} Room
                    </div>
                    <div className="item-meta">
                      <span>
                        <strong>Capacity:</strong> {room.capacity} guests
                      </span>
                      <span>
                        <strong>Rate:</strong> ${room.price_per_night} / night
                      </span>
                      <span>
                        <span className={`item-badge ${room.is_available ? "badge-confirmed" : "badge-cancelled"}`}>
                          {room.is_available ? "Available" : "Booked/Unavailable"}
                        </span>
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

export default HotelProfile;
