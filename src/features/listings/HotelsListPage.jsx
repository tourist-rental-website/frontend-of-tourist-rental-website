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
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredHotels = hotels.filter((hotel) => {
    const name = (hotel.hotel_name || hotel.name || "").toLowerCase();
    const location = (hotel.location || "").toLowerCase();

    return (
      name.includes(searchQuery.toLowerCase()) ||
      location.includes(searchQuery.toLowerCase())
    );
  });
  
  if (loading) {
    return <p>Loading hotels...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h2>Hotels</h2>

      <input 
        type="text"
        placeholder="Search hotels..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ 
          width: "300px",
          padding: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          marginBottom: "20px"
         }}
      />

      {hotels.length === 0 ? (
        <p>No hotels found.</p>
      ) : (
        filteredHotels.map((hotel) => (
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