/**
 * RoomsListPage.jsx — Browse Available Rooms
 *
 * Public page displaying a paginated list of rooms.
 * Each card shows room type, price per night, capacity, and availability.
 * Travelers can click "Book" to navigate to the booking page.
 */

import { useEffect, useState } from "react";
import { getRooms } from "../../api/listingsApi";
import { Link } from "react-router-dom";
import "../../css/RoomsListPage.css";

const RoomsListPage = () => {
  const [rooms, setRooms] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasNext, setHasNext] = useState(false);

  /** Fetch rooms for the current page */
  const loadRooms = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getRooms(page);
      setRooms(data.results || data);
      setHasNext(!!data.next);
    } catch (err) {
      setError("Failed to load rooms. Please try again.");
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  if (loading) {
    return <p>Loading rooms...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h2>Rooms</h2>

      {rooms.length === 0 ? (
        <p>No rooms found.</p>
      ) : (
        rooms.map((room) => (
          <div key={room.id} className="room-card">
            <h3>{room.room_type}</h3>
            <p><strong>Price/night:</strong> ${room.price_per_night}</p>
            <p><strong>Capacity:</strong> {room.capacity} guests</p>
            <p>{room.description}</p>

            {/* Availability badge */}
            <span
              className={`availability-badge ${
                room.is_available ? "available" : "not-available"
              }`}
            >
              {room.is_available ? "Available" : "Not Available"}
            </span>

            {/* Book button — links to booking page (traveler role required) */}
            {room.is_available && (
              <Link
                to={`/book-room/${room.id}`}
                className="book-now-link"
              >
                Book Now →
              </Link>
            )}
          </div>
        ))
      )}

      {/* Pagination controls */}
      <div className="pagination-controls">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          ← Previous
        </button>
        <span>Page {page}</span>
        <button disabled={!hasNext} onClick={() => setPage(page + 1)}>
          Next →
        </button>
      </div>
    </div>
  );
};

export default RoomsListPage;