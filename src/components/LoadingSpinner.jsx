/**
 * LoadingSpinner.jsx — Reusable Loading Indicator
 *
 * Displayed while async operations are in progress
 * (auth check, API calls, etc.)
 */

const LoadingSpinner = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
        color: "#888",
        fontSize: "16px",
      }}
    >
      Loading...
    </div>
  );
};

export default LoadingSpinner;