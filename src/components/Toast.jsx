/**
 * Toast.jsx — Simple Notification Toast
 *
 * Displays a brief feedback message (success, error, info).
 * Used for form submission feedback, error alerts, etc.
 *
 * Props:
 *   - message: string — The message to display
 *   - type: "success" | "error" | "info" (optional, default: "info")
 */

const Toast = ({ message, type = "info" }) => {
  if (!message) return null;

  // Color map for different toast types
  const colors = {
    success: { bg: "#d4edda", border: "#28a745", color: "#155724" },
    error: { bg: "#f8d7da", border: "#dc3545", color: "#721c24" },
    info: { bg: "#d1ecf1", border: "#17a2b8", color: "#0c5460" },
  };

  const style = colors[type] || colors.info;

  return (
    <div
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        color: style.color,
        padding: "10px 16px",
        borderRadius: "4px",
        margin: "10px 0",
      }}
    >
      {message}
    </div>
  );
};

export default Toast;
