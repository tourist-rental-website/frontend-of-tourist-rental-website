/**
 * GuidesListPage.jsx — Browse Tour Guides
 *
 * Public page displaying a paginated list of all guide profiles.
 * Each card shows the guide's bio, experience, languages, location, and price.
 * Pagination controls allow navigating through results.
 */

import { useEffect, useState } from "react";
import { getGuides } from "../../api/listingsApi";
import SearchBar from "../../components/SearchBar";
import "../../css/GuideListPage.css";

const GuidesListPage = () => {
  const [guides, setGuides] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Track if there are more pages (backend returns 'next' URL when more exist)
  const [hasNext, setHasNext] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  /** Fetch guides for the current page */
  const loadGuides = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getGuides(page);
      // Backend may return paginated { results, next, ... } or a plain array
      setGuides(data.results || data);
      setHasNext(!!data.next);
    } catch (err) {
      setError("Failed to load guides. Please try again.");
      console.error("Error fetching guides:", err);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch guides whenever the page number changes
  useEffect(() => {
    loadGuides();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Filter guides based on search query
  const filteredGuides = guides.filter((guide) => {
    const name = `${guide.user?.first_name || ""} ${guide.user?.last_name || ""}`.toLowerCase();
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
    return <p>Loading guides...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h2>Tour Guides</h2>

      <SearchBar
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search guides..."
      />

      {filteredGuides.length === 0 ? (
        <p>No guides found.</p>
      ) : (
        filteredGuides.map((guide) => (
          <div key={guide.id} className="guide-card">
            <h3>{guide.user?.first_name} {guide.user?.last_name}</h3>
            <p>{guide.bio}</p>
            <p><strong>Experience:</strong> {guide.experience_years} years</p>
            <p><strong>Languages:</strong> {guide.languages}</p>
            <p><strong>Location:</strong> {guide.location}</p>
            <p><strong>Price/day:</strong> ${guide.price_per_day}</p>
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

export default GuidesListPage;