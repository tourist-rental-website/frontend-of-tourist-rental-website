/**
 * PackagesListPage.jsx — Browse Tour Packages
 *
 * Public page displaying a paginated list of tour packages.
 * Each card shows title, description, price, duration, and location.
 * Travelers can click "Book" to navigate to the booking page.
 */

import { useEffect, useState } from "react";
import { getPackages } from "../../api/listingsApi";
import { Link } from "react-router-dom";

const PackagesListPage = () => {
  const [packages, setPackages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasNext, setHasNext] = useState(false);

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

  if (loading) {
    return <p>Loading packages...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h2>Tour Packages</h2>

      {packages.length === 0 ? (
        <p>No packages found.</p>
      ) : (
        packages.map((pkg) => (
          <div
            key={pkg.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "12px",
              textAlign: "left",
            }}
          >
            <h3>{pkg.title}</h3>
            <p>{pkg.description}</p>
            <p><strong>Price:</strong> ${pkg.price}</p>
            <p><strong>Duration:</strong> {pkg.duration_days} days</p>
            <p><strong>Location:</strong> {pkg.location}</p>

            {/* Book button — links to booking page (traveler role required) */}
            <Link to={`/book-package/${pkg.id}`}>Book Now →</Link>
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

export default PackagesListPage;