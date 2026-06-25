/**
 * RoomsListPage.jsx — Browse Available Rooms for a Specific Hotel
 */

import { useEffect, useState } from "react";
import { getRooms, getHotelDetails } from "../../api/listingsApi";
import { createConversation } from "../../api/chatApi";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { MapPin, Users, CheckCircle, XCircle, ArrowLeft, BedDouble, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl } from "../../utils/imageUtils";

const RoomsListPage = () => {
  const { id: hotelId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    loadHotelAndRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotelId, page]);

  /** Fetch hotel details and rooms */
  const loadHotelAndRooms = async () => {
    setLoading(true);
    setError("");
    try {
      // Load hotel details once
      if (!hotel) {
        const hotelData = await getHotelDetails(hotelId);
        setHotel(hotelData);
      }
      
      // Load rooms for this hotel
      const roomsData = await getRooms(hotelId, page);
      setRooms(roomsData.results || roomsData);
      setHasNext(!!roomsData.next);
    } catch (err) {
      setError("Failed to load details. Please check the network and try again.");
      console.error("Error loading hotel/rooms details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = async () => {
    try {
      const conv = await createConversation(hotelId);
      navigate(`/conversations/${conv.id}`);
    } catch (err) {
      alert("Failed to start conversation. Please log in or try again.");
    }
  };

  if (loading && !hotel) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
        <p className="text-muted">Loading hotel rooms...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "var(--accent-color)" }}>{error}</p>
        <Link to="/hotels" className="btn btn-secondary margin-top-md">
          <ArrowLeft size={16} />
          <span>Back to Hotels</span>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Back to Hotels Link */}
      {(!user || user.role !== "hotel") && (
        <Link 
          to="/hotels" 
          className="flex-center text-muted" 
          style={{ textDecoration: "none", marginBottom: "1.5rem", fontWeight: "500" }}
        >
          <ArrowLeft size={16} />
          <span>Back to Hotels</span>
        </Link>
      )}

      {/* Hotel Detail Hero Section */}
      {hotel && (
        <div className="details-hero">
          <h1 style={{ marginBottom: "0.5rem" }}>{hotel.hotel_name || hotel.name}</h1>
          <p style={{ fontSize: "1.1rem", maxWidth: "800px", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
            {hotel.description || "Indulge in maximum comfort with tailored room choices, signature amenities, and premium service."}
          </p>
          <div className="flex-between">
            <div className="flex-center text-muted" style={{ fontSize: "0.95rem" }}>
              <MapPin size={16} style={{ color: "var(--primary-color)" }} />
              <span style={{ color: "var(--text-primary)", fontWeight: "500" }}>{hotel.location}</span>
              {hotel.contact_number && (
                <>
                  <span style={{ margin: "0 0.5rem" }}>•</span>
                  <span>Contact: {hotel.contact_number}</span>
                </>
              )}
            </div>
            {user && user.role === "traveler" && (
              <button 
                onClick={handleStartChat}
                className="btn btn-secondary flex-center"
                style={{ fontSize: "0.85rem", padding: "0.5rem 1.15rem", gap: "0.40rem" }}
              >
                <MessageSquare size={14} />
                <span>Chat with Hotel</span>
              </button>
            )}
            {user && user.role === "hotel" && user.id === hotel.id && (
              <Link
                to="/create-room"
                className="btn flex-center"
                style={{ fontSize: "0.85rem", padding: "0.5rem 1.15rem", gap: "0.40rem", textDecoration: "none" }}
              >
                <span>Add Room</span>
              </Link>
            )}
          </div>
        </div>
      )}

      <h2>Available Rooms</h2>

      {rooms.length === 0 ? (
        <div style={{ padding: "4rem", textAlign: "center", background: "var(--bg-secondary)", borderRadius: "var(--border-radius-md)", border: "1px dashed var(--border-color)" }}>
          <p className="text-muted">No rooms currently available for this hotel.</p>
        </div>
      ) : (
        <div className="grid-cols-2">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}

      {/* Pagination controls */}
      {rooms.length > 0 && (
        <div className="pagination">
          <button 
            className="btn btn-secondary" 
            disabled={page === 1} 
            onClick={() => setPage(page - 1)}
            style={{ padding: "0.5rem 1.25rem" }}
          >
            ← Previous
          </button>
          <span className="page-num">Page {page}</span>
          <button 
            className="btn btn-secondary" 
            disabled={!hasNext} 
            onClick={() => setPage(page + 1)}
            style={{ padding: "0.5rem 1.25rem" }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * RoomCard — Displays a single room with image carousel and details
 */
const RoomCard = ({ room }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = room.images || [];

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Room Image Section */}
      {images.length > 0 && (
        <div style={{ 
          position: "relative", 
          width: "100%",
          height: "200px",
          borderRadius: "var(--border-radius-sm)",
          overflow: "hidden",
          marginBottom: "1rem",
        }}>
          <img
            src={getImageUrl(images[currentImageIndex]?.image)}
            alt={`${room.room_type} room`}
            style={{ 
              width: "100%", 
              height: "100%", 
              objectFit: "cover",
              transition: "opacity 0.3s ease",
            }}
          />

          {/* Image navigation arrows (only show if > 1 image) */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                style={{
                  position: "absolute",
                  left: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.5)",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={nextImage}
                style={{
                  position: "absolute",
                  right: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.5)",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                }}
              >
                <ChevronRight size={16} />
              </button>

              {/* Dot indicators */}
              <div style={{
                position: "absolute",
                bottom: "8px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "4px",
              }}>
                {images.map((_, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: idx === currentImageIndex ? "#fff" : "rgba(255,255,255,0.5)",
                      transition: "background 0.2s ease",
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="flex-between" style={{ marginBottom: "1rem" }}>
        <div className="flex-center" style={{ color: "var(--primary-color)" }}>
          <BedDouble size={20} />
          <h3 style={{ margin: 0, textTransform: "capitalize", fontSize: "1.2rem", fontWeight: "600", color: "var(--text-primary)" }}>
            {room.room_type} Room
          </h3>
        </div>
        <span className={`badge ${room.is_available ? "badge-available" : "badge-unavailable"}`}>
          {room.is_available ? (
            <>
              <CheckCircle size={12} />
              <span>Available</span>
            </>
          ) : (
            <>
              <XCircle size={12} />
              <span>Booked</span>
            </>
          )}
        </span>
      </div>

      <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", flex: 1, marginBottom: "1.5rem" }}>
        {room.description || "A gorgeous, well-appointed suite featuring complimentary high-speed internet, smart TV, and standard toiletries."}
      </p>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
        <div>
          <span style={{ fontSize: "1.4rem", fontWeight: "700", color: "var(--text-primary)" }}>
            ${room.price_per_night}
          </span>
          <span className="text-muted" style={{ fontSize: "0.85rem" }}> / night</span>
        </div>

        <div className="flex-center text-muted" style={{ fontSize: "0.9rem" }}>
          <Users size={16} />
          <span>Up to {room.capacity} Guests</span>
        </div>
      </div>

      {room.is_available && (
        <Link 
          to={`/book-room/${room.id}`} 
          className="btn margin-top-md"
          style={{ width: "100%", textDecoration: "none" }}
        >
          Book Room Now
        </Link>
      )}
    </div>
  );
};

export default RoomsListPage;