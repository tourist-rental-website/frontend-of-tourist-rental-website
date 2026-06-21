import { useEffect, useState } from "react";
import { getConversations } from "../../api/chatApi";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { MessageSquare, Building2, User, Clock, ArrowRight } from "lucide-react";

const ConversationListPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadConversations = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getConversations();
      // Handle possible paginated object
      setConversations(data.results || data);
    } catch (err) {
      setError("Failed to load conversations. Please try again.");
      console.error("Error fetching conversations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const getPartnerName = (conv) => {
    // If logged in user is a hotel owner, show traveler name. Else show hotel name.
    if (user?.role === "hotel") {
      const traveler = conv.user;
      return traveler ? `${traveler.first_name} ${traveler.last_name} (${traveler.email})` : "Traveler";
    } else {
      return conv.hotel?.hotel_name || conv.hotel?.name || "Hotel Owner";
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
        <p className="text-muted">Loading your conversations...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div className="flex-between margin-bottom-sm">
        <div>
          <h1 style={{ marginBottom: "0.25rem" }}>My Conversations</h1>
          <p className="text-muted">Chat directly with {user?.role === "hotel" ? "travelers" : "hotel support"} in real-time</p>
        </div>
      </div>

      {error && (
        <div style={{ padding: "1rem", color: "var(--accent-color)", background: "rgba(244, 63, 94, 0.1)", borderRadius: "var(--border-radius-sm)", marginBottom: "1.5rem" }}>
          {error}
        </div>
      )}

      {conversations.length === 0 ? (
        <div style={{ padding: "4rem", textAlign: "center", background: "var(--bg-secondary)", borderRadius: "var(--border-radius-md)", border: "1px dashed var(--border-color)" }}>
          <MessageSquare size={40} style={{ color: "var(--text-muted)", marginBottom: "1rem" }} />
          <p className="text-muted">You do not have any active chats yet.</p>
          {user?.role !== "hotel" && (
            <Link to="/hotels" className="btn margin-top-md">Browse Hotels to Start Chat</Link>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {conversations.map((c) => (
            <Link 
              key={c.id} 
              to={`/conversations/${c.id}`}
              className="card"
              style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between", 
                textDecoration: "none",
                padding: "1.25rem 1.75rem"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                <div 
                  style={{ 
                    width: "48px", 
                    height: "48px", 
                    borderRadius: "12px", 
                    background: user?.role === "hotel" ? "rgba(244, 63, 94, 0.1)" : "rgba(59, 130, 246, 0.1)",
                    color: user?.role === "hotel" ? "var(--accent-color)" : "var(--primary-color)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {user?.role === "hotel" ? <User size={22} /> : <Building2 size={22} />}
                </div>

                <div>
                  <h3 style={{ margin: "0 0 0.25rem", fontSize: "1.05rem", fontWeight: "600", color: "var(--text-primary)" }}>
                    {getPartnerName(c)}
                  </h3>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)", maxWidth: "450px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {c.last_message ? (
                      <span>
                        <strong>{c.last_message.sender?.id === user?.id ? "You: " : ""}</strong>
                        {c.last_message.content}
                      </span>
                    ) : (
                      <span className="text-muted" style={{ fontStyle: "italic" }}>No messages yet. Click to start the conversation.</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex-center" style={{ gap: "1rem" }}>
                {c.last_message && (
                  <div className="flex-center text-muted" style={{ fontSize: "0.75rem" }}>
                    <Clock size={12} />
                    <span>{new Date(c.last_message.created_at).toLocaleDateString()}</span>
                  </div>
                )}
                <ArrowRight size={16} style={{ color: "var(--text-muted)" }} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConversationListPage;
