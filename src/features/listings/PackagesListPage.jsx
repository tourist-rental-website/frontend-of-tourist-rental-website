/**
 * PackagesListPage.jsx — Browse Tour Packages
 */

import { useEffect, useState } from "react";
import { getPackages } from "../../api/listingsApi";
import { Link } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import { MapPin, Calendar, Clock, ArrowRight } from "lucide-react";

const PackagesListPage = () => {
  const [packages, setPackages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasNext, setHasNext] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    loadPackages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  /** Fetch packages for the current page */
  const loadPackages = async () => {
    setLoading(true);
    setError(""); 
    try {
      const data = await getPackages(page);
      setPackages(data.results || data);
      setHasNext(!!data.next);
    } catch (err) {
      setError("Failed to load packages. Please try again.");
      console.error("Error fetching packages:", err);
    } finally {
      setLoading(false);
    }
  };

  /** Filter packages based on search */
  const filteredPackages = packages.filter((pkg) => {
    const title = (pkg.title || "").toLowerCase();
    const location = (pkg.location || "").toLowerCase();
    const description = (pkg.description || "").toLowerCase();
    const query = searchQuery.toLowerCase();

    return (
      title.includes(query) ||
      location.includes(query) ||
      description.includes(query)
    );
  });

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
        <p className="text-muted">Loading tour packages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "var(--accent-color)" }}>{error}</p>
        <button onClick={loadPackages} className="btn margin-top-md">Try Again</button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex-between margin-bottom-sm">
        <div>
          <h1 style={{ marginBottom: "0.25rem" }}>Curated Tour Packages</h1>
          <p className="text-muted">Book complete tour experiences crafted by verified local guides</p>
        </div>
      </div>

      <div className="search-container">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search packages by title, location, or description..."
        />
      </div>

      {filteredPackages.length === 0 ? (
        <div style={{ padding: "4rem", textAlign: "center", background: "var(--bg-secondary)", borderRadius: "var(--border-radius-md)", border: "1px dashed var(--border-color)" }}>
          <p className="text-muted">No tour packages match your query.</p>
        </div>
      ) : (
        <div className="grid-cols-2">
          {filteredPackages.map((pkg) => (
            <div key={pkg.id} className="card" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              {/* Package Title */}
              <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "0.75rem" }}>
                {pkg.title}
              </h3>
              
              {/* Description */}
              <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", flex: 1, marginBottom: "1.5rem" }}>
                {pkg.description || "Embark on an unforgettable journey. Includes guided treks, local food experiences, transportation, and custom activities."}
              </p>

              {/* Package Details Info Row */}
              <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div className="flex-center text-muted" style={{ fontSize: "0.85rem" }}>
                  <Clock size={16} style={{ color: "var(--primary-color)" }} />
                  <span>{pkg.duration_days} Days</span>
                </div>
                <div className="flex-center text-muted" style={{ fontSize: "0.85rem" }}>
                  <MapPin size={16} style={{ color: "var(--primary-color)" }} />
                  <span>{pkg.location}</span>
                </div>
              </div>

              {/* Price & Book Button */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "1.45rem", fontWeight: "700", color: "var(--text-primary)" }}>
                    ${pkg.price}
                  </span>
                  <span className="text-muted" style={{ fontSize: "0.85rem" }}> / package</span>
                </div>

                <Link 
                  to={`/book-package/${pkg.id}`} 
                  className="btn"
                  style={{ textDecoration: "none" }}
                >
                  <span>Book Package</span>
                  <ArrowRight size={16} />
                </Link>
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

export default PackagesListPage;