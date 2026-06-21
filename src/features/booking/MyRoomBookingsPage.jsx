import { useEffect, useState } from "react";
import { getMyRoomBookings, cancelRoomBooking } from "../../api/bookingApi";
import { Calendar, Trash2, ShieldAlert, CheckCircle2, Clock } from "lucide-react";

const MyRoomBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMyRoomBookings();
      // Handle both paginated response object and flat array
      setBookings(data.results || data);
    } catch (err) {
      setError("Failed to load your room bookings.");
      console.error("Error loading room bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }
    try {
      await cancelRoomBooking(id);
      loadBookings();
    } catch (err) {
      alert("Failed to cancel booking. Please try again.");
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "confirmed":
        return "badge-confirmed";
      case "pending":
        return "badge-pending";
      case "cancelled":
      default:
        return "badge-cancelled";
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
        <p className="text-muted">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex-between margin-bottom-sm">
        <div>
          <h1 style={{ marginBottom: "0.25rem" }}>My Room Bookings</h1>
          <p className="text-muted">Manage your hotel stays, cancellations, and reservation statuses</p>
        </div>
      </div>

      {error && (
        <div style={{ padding: "1rem", color: "var(--accent-color)", background: "rgba(244, 63, 94, 0.1)", borderRadius: "var(--border-radius-sm)", marginBottom: "1.5rem" }}>
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div style={{ padding: "4rem", textAlign: "center", background: "var(--bg-secondary)", borderRadius: "var(--border-radius-md)", border: "1px dashed var(--border-color)" }}>
          <p className="text-muted">You do not have any room bookings yet.</p>
        </div>
      ) : (
        <div className="grid-cols-2">
          {bookings.map((b) => (
            <div key={b.id} className="card" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              {/* Header: Room Type and Status Badge */}
              <div className="flex-between" style={{ marginBottom: "1.25rem" }}>
                <div>
                  <h3 style={{ margin: 0, textTransform: "capitalize", fontSize: "1.2rem", fontWeight: "600", color: "var(--text-primary)" }}>
                    {b.room?.room_type || "Standard"} Room
                  </h3>
                  <span className="text-muted" style={{ fontSize: "0.8rem" }}>Booking Ref: #{b.id}</span>
                </div>
                <span className={`badge ${getStatusBadgeClass(b.status)}`}>
                  {b.status === "confirmed" && <CheckCircle2 size={12} />}
                  {b.status === "pending" && <Clock size={12} />}
                  {b.status === "cancelled" && <ShieldAlert size={12} />}
                  <span style={{ textTransform: "capitalize" }}>{b.status}</span>
                </span>
              </div>

              {/* Booking Details */}
              <div style={{ flex: 1, marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                  {b.room?.description || "Enjoy premium hospitality, complimentary Wi-Fi, and standard services."}
                </p>

                <div 
                  style={{ 
                    display: "flex", 
                    gap: "1.5rem", 
                    background: "var(--bg-tertiary)", 
                    padding: "0.75rem 1rem", 
                    borderRadius: "var(--border-radius-sm)",
                    flexWrap: "wrap"
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Check-In</span>
                    <span style={{ fontSize: "0.9rem", color: "var(--text-primary)", fontWeight: "500" }}>{b.check_in}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Check-Out</span>
                    <span style={{ fontSize: "0.9rem", color: "var(--text-primary)", fontWeight: "500" }}>{b.check_out}</span>
                  </div>
                </div>
              </div>

              {/* Footer: Price & Cancel Actions */}
              <div 
                style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  borderTop: "1px solid var(--border-color)", 
                  paddingTop: "1rem",
                  marginTop: "auto"
                }}
              >
                <div>
                  <span className="text-muted" style={{ fontSize: "0.8rem" }}>Rate: </span>
                  <span style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--text-primary)" }}>
                    ${b.room?.price_per_night || 0}
                  </span>
                  <span className="text-muted" style={{ fontSize: "0.8rem" }}> / night</span>
                </div>

                {(b.status === "pending" || b.status === "confirmed") && (
                  <button 
                    onClick={() => handleCancel(b.id)} 
                    className="btn btn-accent"
                    style={{ 
                      padding: "0.45rem 1rem", 
                      borderRadius: "var(--border-radius-sm)", 
                      fontSize: "0.85rem",
                      gap: "0.35rem"
                    }}
                  >
                    <Trash2 size={14} />
                    <span>Cancel Booking</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRoomBookingsPage;