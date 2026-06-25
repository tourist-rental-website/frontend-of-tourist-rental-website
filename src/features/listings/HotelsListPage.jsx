/**
 * HotelsListPage.jsx — Browse Hotels
 */

import { useEffect, useState } from "react";
import { getHotels } from "../../api/listingsApi";
import { Link } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import { MapPin, Phone, ArrowRight, Building2 } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

const HotelsListPage = () => {
  const { user } = useAuth();

  const [hotels, setHotels] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasNext, setHasNext] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (user && user.role === "hotel" && user.id) {
    return <Navigate to={`/hotels/${user.id}/rooms`} replace />;
  }

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
    const query = searchQuery.toLowerCase();

    return name.includes(query) || location.includes(query);
  });

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
        <p className="text-muted">Loading hotels...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "var(--accent-color)" }}>{error}</p>
        <button onClick={loadHotels} className="btn margin-top-md">Try Again</button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex-between margin-bottom-sm">
        <div>
          <h1 style={{ marginBottom: "0.25rem" }}>Find Your Dream Stay</h1>
          <p className="text-muted">Discover and book premium rooms tailored for your travels</p>
        </div>
      </div>

      <div className="search-container">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search hotels by name or location..."
        />
      </div>

      {filteredHotels.length === 0 ? (
        <div style={{ padding: "4rem", textAlign: "center", background: "var(--bg-secondary)", borderRadius: "var(--border-radius-md)", border: "1px dashed var(--border-color)" }}>
          <p className="text-muted">No hotels match your query.</p>
        </div>
      ) : (
        <div className="grid-cols-3">
          {filteredHotels.map((hotel) => (
            <div key={hotel.id} className="card" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div className="flex-center" style={{ marginBottom: "1rem", color: "var(--primary-color)" }}>
                <Building2 size={24} />
                <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "600", color: "var(--text-primary)" }}>
                  {hotel.hotel_name || hotel.name}
                </h3>
              </div>
              
              <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", flex: 1, marginBottom: "1.5rem" }}>
                {hotel.description || "Experience standard-setting hospitality in the heart of the city."}
              </p>

              <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
                <div className="flex-center text-muted" style={{ fontSize: "0.85rem" }}>
                  <MapPin size={14} style={{ color: "var(--primary-color)" }} />
                  <span>{hotel.location || "Location specified upon booking"}</span>
                </div>
                {(hotel.contact_number || hotel.contact) && (
                  <div className="flex-center text-muted" style={{ fontSize: "0.85rem" }}>
                    <Phone size={14} style={{ color: "var(--primary-color)" }} />
                    <span>{hotel.contact_number || hotel.contact}</span>
                  </div>
                )}
              </div>

              <Link 
                to={`/hotels/${hotel.id}/rooms`} 
                className="btn" 
                style={{ width: "100%", textDecoration: "none" }}
              >
                <span>View Rooms</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Pagination controls */}
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
    </div>
  );
};

export default HotelsListPage;