/**
 * useWebSocket.js — WebSocket Connection Manager
 */

import { useEffect, useRef, useState } from "react";

export const useWebSocket = (conversationId) => {
  const [messages, setMessages] = useState([]);
  const [readyStatus, setReadyStatus] = useState("CONNECTING");
  const wsRef = useRef(null);

  useEffect(() => {
    if (!conversationId) return;

    const token = localStorage.getItem("access_token");
    if (!token) {
      setReadyStatus("UNAUTHORIZED");
      return;
    }

    // Connect to backend WS server using standard ws protocol
    const wsUrl = `ws://localhost:8000/ws/chat/${conversationId}/?token=${token}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setReadyStatus("OPEN");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "message") {
          // Append new incoming real-time message
          setMessages((prev) => {
            // Avoid duplicates if message already exists in list (e.g. if we did REST send and WS echo)
            if (prev.some((m) => m.id === data.message.id)) {
              return prev;
            }
            return [...prev, data.message];
          });
        }
      } catch (err) {
        console.error("Error parsing WS message:", err);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setReadyStatus("ERROR");
    };

    ws.onclose = () => {
      setReadyStatus("CLOSED");
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [conversationId]);

  const sendWsMessage = (content) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "message",
          content: content,
        })
      );
      return true;
    }
    return false;
  };

  return {
    messages,
    setMessages,
    readyStatus,
    sendWsMessage,
  };
};

export default useWebSocket;
