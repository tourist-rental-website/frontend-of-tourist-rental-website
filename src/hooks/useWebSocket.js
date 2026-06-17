/**
 * useWebSocket.js — WebSocket Connection Manager (Stub)
 *
 * Will manage WebSocket lifecycle for real-time chat (Phase 7).
 * Currently returns stub values so components can import without errors.
 *
 * Full implementation will:
 *   - Connect to: ws://localhost:8000/ws/chat/<conversation_id>/?token=<access_token>
 *   - Handle message types: "message", "typing", "read_receipt"
 *   - Provide sendMessage(), sendTyping(), sendReadReceipt() helpers
 *   - Auto-reconnect with exponential backoff on disconnect
 */

import { useState } from "react";

export const useWebSocket = (conversationId) => {
  const [messages, setMessages] = useState([]);
  const [readyStatus, setReadyStatus] = useState("CONNECTING");

  // TODO (Phase 7): Implement WebSocket connection using the native
  // WebSocket API. Connect on mount, disconnect on unmount.
  const sendMessage = () => {};

  return {
    messages,
    setMessages,
    readyStatus,
    sendMessage,
  };
};

export default useWebSocket;
