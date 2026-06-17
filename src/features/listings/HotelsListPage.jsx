/**
 * HotelsListPage.jsx — Browse Hotels
 *
 * Public page displaying a paginated list of all hotel profiles.
 * Each card shows the hotel name, description, location, and contact info.
 */

import { useEffect, useState } from "react";
import { getHotels } from "../../api/listingsApi";
import { Link } from "react-router-dom";

const HotelsListPage = () => {
  const [hotels, setHotels] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    loadHotels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  /** Fetch hotels for the current page */
  const loadHotels = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getHotels(page);
      setHotels(data.results || data);
      setHasNext(!!data.next);
    } catch (err) {
      setError("Failed to load hotels. Please try again.");
      console.error("Error fetching hotels:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading hotels...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h2>Hotels</h2>

      {hotels.length === 0 ? (
        <p>No hotels found.</p>
      ) : (
        hotels.map((hotel) => (
          <div
            key={hotel.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "12px",
              textAlign: "left",
            }}
          >
            <h3>{hotel.hotel_name || hotel.name}</h3>
            <p>{hotel.description}</p>
            <p><strong>Location:</strong> {hotel.location}</p>
            <p><strong>Contact:</strong> {hotel.contact_number || hotel.contact}</p>
            {/* Link to view rooms for this hotel */}
            <Link to={`/hotels/${hotel.id}/rooms`}>View Rooms →</Link>
          </div>
        ))
      )}

      {/* Pagination controls */}
      <div style={{ marginTop: "16px", display: "flex", gap: "10px", alignItems: "center" }}>
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

export default HotelsListPage;