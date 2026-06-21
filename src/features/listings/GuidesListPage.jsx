/**
 * GuidesListPage.jsx — Browse Tour Guides
 */

import { useEffect, useState } from "react";
import { getGuides } from "../../api/listingsApi";
import SearchBar from "../../components/SearchBar";
import { MapPin, Languages, Calendar, Shield, Phone, Mail, Award } from "lucide-react";

const GuidesListPage = () => {
  const [guides, setGuides] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasNext, setHasNext] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadGuides();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  /** Fetch guides for the current page */
  const loadGuides = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getGuides(page);
      setGuides(data.results || data);
      setHasNext(!!data.next);
    } catch (err) {
      setError("Failed to load guides. Please try again.");
      console.error("Error fetching guides:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter guides based on search query
  const filteredGuides = guides.filter((guide) => {
    // Note: serializer flattens user fields directly to the guide profile root object
    const name = `${guide.first_name || ""} ${guide.last_name || ""}`.toLowerCase();
    const bio = (guide.bio || "").toLowerCase();
    const location = (guide.location || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return (
      name.includes(query) ||
      bio.includes(query) ||
      location.includes(query)
    );
  });

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
        <p className="text-muted">Loading guides...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "var(--accent-color)" }}>{error}</p>
        <button onClick={loadGuides} className="btn margin-top-md">Try Again</button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex-between margin-bottom-sm">
        <div>
          <h1 style={{ marginBottom: "0.25rem" }}>Expert Tour Guides</h1>
          <p className="text-muted">Explore the world with certified local guides and personalized packages</p>
        </div>
      </div>

      <div className="search-container">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search guides by name, bio, or location..."
        />
      </div>

      {filteredGuides.length === 0 ? (
        <div style={{ padding: "4rem", textAlign: "center", background: "var(--bg-secondary)", borderRadius: "var(--border-radius-md)", border: "1px dashed var(--border-color)" }}>
          <p className="text-muted">No guides found matching your query.</p>
        </div>
      ) : (
        <div className="grid-cols-3">
          {filteredGuides.map((guide) => (
            <div key={guide.id} className="card" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              {/* Profile Image & Name Row */}
              <div className="flex-center" style={{ marginBottom: "1.25rem", gap: "1rem" }}>
                {guide.profile_image ? (
                  <img 
                    src={guide.profile_image} 
                    alt={`${guide.first_name} ${guide.last_name}`} 
                    style={{ width: "56px", height: "56px", borderRadius: "50%", objectFit: "cover" }}
                  />
                ) : (
                  <div 
                    style={{ 
                      width: "56px", 
                      height: "56px", 
                      borderRadius: "50%", 
                      background: "linear-gradient(135deg, var(--primary-color), var(--accent-color))",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "700",
                      fontSize: "1.25rem"
                    }}
                  >
                    {guide.first_name?.[0]}{guide.last_name?.[0]}
                  </div>
                )}
                
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: "600", color: "var(--text-primary)" }}>
                    {guide.first_name} {guide.last_name}
                  </h3>
                  <div className="flex-center text-muted" style={{ fontSize: "0.8rem", marginTop: "0.2rem" }}>
                    <Shield size={12} style={{ color: "var(--primary-color)" }} />
                    <span>Verified Local Guide</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", flex: 1, marginBottom: "1.5rem" }}>
                {guide.bio || "Passionate about travel, local history, and showing guests the absolute best spots off the beaten path."}
              </p>

              {/* Guide Details */}
              <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.5rem" }}>
                <div className="flex-center text-muted" style={{ fontSize: "0.85rem" }}>
                  <Award size={14} style={{ color: "var(--primary-color)" }} />
                  <span><strong>Experience:</strong> {guide.experience_years} Years</span>
                </div>
                <div className="flex-center text-muted" style={{ fontSize: "0.85rem" }}>
                  <Languages size={14} style={{ color: "var(--primary-color)" }} />
                  <span><strong>Speaks:</strong> {guide.languages || "English"}</span>
                </div>
                <div className="flex-center text-muted" style={{ fontSize: "0.85rem" }}>
                  <MapPin size={14} style={{ color: "var(--primary-color)" }} />
                  <span><strong>Location:</strong> {guide.location || "Available online"}</span>
                </div>
              </div>

              {/* Price & Contact Button */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                <div>
                  <span style={{ fontSize: "1.45rem", fontWeight: "700", color: "var(--text-primary)" }}>
                    ${guide.price_per_day}
                  </span>
                  <span className="text-muted" style={{ fontSize: "0.8rem" }}> / day</span>
                </div>
                
                {guide.phone && (
                  <a 
                    href={`tel:${guide.phone}`} 
                    className="btn btn-secondary" 
                    style={{ padding: "0.5rem 1rem", borderRadius: "var(--border-radius-sm)", fontSize: "0.85rem" }}
                  >
                    <Phone size={14} />
                    <span>Call Guide</span>
                  </a>
                )}
              </div>
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

export default GuidesListPage;