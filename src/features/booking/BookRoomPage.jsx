import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { createRoomBooking } from "../../api/bookingApi";
import { getRoomDetails } from "../../api/listingsApi";
import { useAuth } from "../../context/AuthContext";
import { BedDouble, Calendar, ArrowLeft, Users, ShieldAlert, CreditCard } from "lucide-react";

const BookRoomPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  const [form, setForm] = useState({
    check_in: "",
    check_out: ""
  });

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getRoomDetails(id);
        setRoom(data);
      } catch (err) {
        setError("Failed to fetch room details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
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

    if (!form.check_in || !form.check_out) {
      setBookingError("Please select both check-in and check-out dates.");
      setBookingLoading(false);
      return;
    }

    if (new Date(form.check_in) >= new Date(form.check_out)) {
      setBookingError("Check-out date must be after check-in date.");
      setBookingLoading(false);
      return;
    }

    try {
      await createRoomBooking({
        room: id,
        ...form
      });
      navigate("/my-room-bookings");
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

  // Calculate dynamic price
  const calculateBookingDetails = () => {
    if (!form.check_in || !form.check_out || !room) return null;
    const checkInDate = new Date(form.check_in);
    const checkOutDate = new Date(form.check_out);
    const diffTime = checkOutDate - checkInDate;
    if (diffTime <= 0) return null;
    
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalPrice = nights * parseFloat(room.price_per_night);
    return { nights, totalPrice };
  };

  const bookingDetails = calculateBookingDetails();

  if (user?.role !== "traveler") {
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>
        <ShieldAlert size={48} style={{ color: "var(--accent-color)", marginBottom: "1rem" }} />
        <h2>Access Denied</h2>
        <p className="text-muted">Only registered Travelers can book room reservations.</p>
        <Link to="/hotels" className="btn btn-secondary margin-top-md">Back to Hotels</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
        <p className="text-muted">Loading room details...</p>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "var(--accent-color)" }}>{error || "Room details not found."}</p>
        <Link to="/hotels" className="btn btn-secondary margin-top-md">Back to Hotels</Link>
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
        <span>Back to Rooms</span>
      </button>

      <h1 style={{ marginBottom: "1.5rem" }}>Confirm Your Booking</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem" }}>
        
        {/* Left Column: Form Inputs */}
        <div className="card" style={{ padding: "2rem" }}>
          <h3 style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Calendar size={18} style={{ color: "var(--primary-color)" }} />
            <span>Select Booking Dates</span>
          </h3>

          {bookingError && (
            <div style={{ padding: "1rem", color: "var(--accent-color)", background: "rgba(244, 63, 94, 0.1)", borderRadius: "var(--border-radius-sm)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
              {bookingError}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label htmlFor="check_in" style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                Check-In Date
              </label>
              <input
                id="check_in"
                type="date"
                name="check_in"
                value={form.check_in}
                onChange={handleChange}
                required
                min={new Date().toISOString().split("T")[0]}
                style={{ width: "100%" }}
              />
            </div>

            <div>
              <label htmlFor="check_out" style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                Check-Out Date
              </label>
              <input
                id="check_out"
                type="date"
                name="check_out"
                value={form.check_out}
                onChange={handleChange}
                required
                min={form.check_in || new Date().toISOString().split("T")[0]}
                style={{ width: "100%" }}
              />
            </div>

            <button 
              type="submit" 
              className="btn" 
              style={{ width: "100%", marginTop: "1rem" }}
              disabled={bookingLoading}
            >
              {bookingLoading ? "Confirming..." : "Confirm Booking"}
            </button>
          </form>
        </div>

        {/* Right Column: Booking Summary Card */}
        <div className="card" style={{ background: "var(--bg-tertiary)", alignSelf: "start" }}>
          <div className="flex-center" style={{ color: "var(--primary-color)", marginBottom: "0.75rem" }}>
            <BedDouble size={20} />
            <h3 style={{ margin: 0, textTransform: "capitalize", fontSize: "1.1rem" }}>{room.room_type} Room</h3>
          </div>

          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
            {room.description || "Enjoy premium hospitality, complimentary Wi-Fi, and standard services."}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem", marginBottom: "1rem" }}>
            <div className="flex-between text-muted" style={{ fontSize: "0.85rem" }}>
              <span>Capacity</span>
              <span className="flex-center" style={{ color: "var(--text-primary)", fontWeight: "500" }}>
                <Users size={14} />
                <span>Up to {room.capacity} Guests</span>
              </span>
            </div>
            <div className="flex-between text-muted" style={{ fontSize: "0.85rem" }}>
              <span>Price per night</span>
              <span style={{ color: "var(--text-primary)", fontWeight: "500" }}>${room.price_per_night}</span>
            </div>
          </div>

          {bookingDetails ? (
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "1.25rem" }}>
                <div className="flex-between text-muted" style={{ fontSize: "0.85rem" }}>
                  <span>Nights booked</span>
                  <span style={{ color: "var(--text-primary)", fontWeight: "500" }}>{bookingDetails.nights} nights</span>
                </div>
                <div className="flex-between text-muted" style={{ fontSize: "0.85rem" }}>
                  <span>Base fare</span>
                  <span style={{ color: "var(--text-primary)", fontWeight: "500" }}>${room.price_per_night} x {bookingDetails.nights}</span>
                </div>
              </div>
              
              <div className="flex-between" style={{ borderTop: "2px dashed var(--border-color)", paddingTop: "1rem" }}>
                <span style={{ fontWeight: "600", color: "var(--text-primary)", fontSize: "0.95rem" }}>Total Estimate</span>
                <span style={{ fontSize: "1.4rem", fontWeight: "800", color: "var(--primary-color)" }}>
                  ${bookingDetails.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          ) : (
            <div style={{ padding: "0.75rem", background: "rgba(59, 130, 246, 0.05)", borderRadius: "var(--border-radius-sm)", border: "1px dashed var(--border-color)", textAlign: "center" }}>
              <span className="text-muted" style={{ fontSize: "0.8rem" }}>
                Select check-in and check-out dates to preview total booking price.
              </span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default BookRoomPage;