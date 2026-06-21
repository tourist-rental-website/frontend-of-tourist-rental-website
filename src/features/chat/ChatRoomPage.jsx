import { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getConversation, getMessages, sendMessage as sendMessageApi } from "../../api/chatApi";
import { useWebSocket } from "../../hooks/useWebSocket";
import { useAuth } from "../../context/AuthContext";
import { ArrowLeft, Send, Building2, User, SendHorizonal } from "lucide-react";

const ChatRoomPage = () => {
  const { id: conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [conversation, setConversation] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Real-time messages hook
  const { messages: wsMessages, setMessages: setWsMessages, readyStatus, sendWsMessage } = useWebSocket(conversationId);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [wsMessages]);

  // Load conversation details and messages history on mount
  useEffect(() => {
    const loadConversationDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const convDetails = await getConversation(conversationId);
        setConversation(convDetails);

        const history = await getMessages(conversationId);
        // Sync history messages into websocket message state
        setWsMessages(history.results || history);
      } catch (err) {
        setError("Failed to load chat messages.");
        console.error("Error loading chat:", err);
      } finally {
        setLoading(false);
      }
    };
    loadConversationDetails();
  }, [conversationId, setWsMessages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const messageContent = text;
    setText("");

    // Try WS send first
    const sentViaWs = sendWsMessage(messageContent);
    
    // If WS fails or is not connected, use the REST API fallback
    if (!sentViaWs) {
      try {
        const response = await sendMessageApi(conversationId, messageContent);
        // Append response to message state manually
        setWsMessages((prev) => [...prev, response]);
      } catch (err) {
        alert("Failed to send message. Check your connection.");
        setText(messageContent); // Restore text
      }
    }
  };

  const getPartnerName = () => {
    if (!conversation) return "Chat";
    if (user?.role === "hotel") {
      const traveler = conversation.user;
      return traveler ? `${traveler.first_name} ${traveler.last_name}` : "Traveler";
    } else {
      return conversation.hotel?.hotel_name || conversation.hotel?.name || "Hotel Support";
    }
  };

  const getPartnerSub = () => {
    if (!conversation) return "";
    if (user?.role === "hotel") {
      return conversation.user?.email || "Traveler Partner";
    } else {
      return conversation.hotel?.location || "Hotel Partner";
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
        <p className="text-muted">Opening secure chat room...</p>
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "var(--accent-color)" }}>{error || "Chat room not found."}</p>
        <Link to="/conversations" className="btn btn-secondary margin-top-md">Back to Chats</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", height: "76vh" }}>
      
      {/* Top Header Section */}
      <div 
        className="card" 
        style={{ 
          padding: "1rem 1.5rem", 
          borderRadius: "var(--border-radius-md)", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
          marginBottom: "1rem",
          boxShadow: "var(--card-shadow)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button 
            onClick={() => navigate("/conversations")} 
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "var(--text-muted)", display: "flex", alignItems: "center" }}
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div 
            style={{ 
              width: "42px", 
              height: "42px", 
              borderRadius: "50%", 
              background: user?.role === "hotel" ? "rgba(244, 63, 94, 0.1)" : "rgba(59, 130, 246, 0.1)",
              color: user?.role === "hotel" ? "var(--accent-color)" : "var(--primary-color)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {user?.role === "hotel" ? <User size={20} /> : <Building2 size={20} />}
          </div>

          <div>
            <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: "600", color: "var(--text-primary)" }}>{getPartnerName()}</h3>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{getPartnerSub()}</span>
          </div>
        </div>

        <div className="flex-center">
          <span 
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: readyStatus === "OPEN" ? "#22c55e" : "#eab308"
            }}
          />
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>
            {readyStatus === "OPEN" ? "Live" : "Connecting"}
          </span>
        </div>
      </div>

      {/* Messages Thread list */}
      <div 
        className="card" 
        style={{ 
          flex: 1, 
          overflowY: "auto", 
          padding: "1.5rem", 
          display: "flex", 
          flexDirection: "column", 
          gap: "1rem",
          marginBottom: "1rem",
          background: "var(--bg-secondary)",
          borderRadius: "var(--border-radius-md)"
        }}
      >
        {wsMessages.length === 0 ? (
          <div style={{ margin: "auto", textAlign: "center" }}>
            <p className="text-muted" style={{ fontStyle: "italic" }}>No messages yet. Send a message to start conversation!</p>
          </div>
        ) : (
          wsMessages.map((m) => {
            const isMe = m.sender?.id === user?.id;
            return (
              <div 
                key={m.id} 
                style={{ 
                  display: "flex", 
                  flexDirection: "column",
                  alignItems: isMe ? "flex-end" : "flex-start",
                  maxWidth: "75%",
                  alignSelf: isMe ? "flex-end" : "flex-start"
                }}
              >
                {/* Bubble */}
                <div 
                  style={{ 
                    padding: "0.75rem 1.15rem", 
                    borderRadius: isMe ? "18px 18px 2px 18px" : "18px 18px 18px 2px",
                    background: isMe ? "var(--primary-color)" : "var(--bg-tertiary)",
                    color: isMe ? "#fff" : "var(--text-primary)",
                    fontSize: "0.95rem",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                  }}
                >
                  {m.content}
                </div>
                
                {/* Time metadata */}
                <span 
                  style={{ 
                    fontSize: "0.7rem", 
                    color: "var(--text-muted)", 
                    marginTop: "0.25rem",
                    padding: "0 0.25rem" 
                  }}
                >
                  {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input controls form */}
      <form onSubmit={handleSend} className="search-container" style={{ margin: 0 }}>
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ paddingLeft: "1.25rem", borderRadius: "var(--border-radius-sm)" }}
            required
          />
        </div>
        <button type="submit" className="btn" style={{ padding: "0.75rem 1.5rem" }} aria-label="Send">
          <SendHorizonal size={18} />
          <span>Send</span>
        </button>
      </form>
      
    </div>
  );
};

export default ChatRoomPage;
