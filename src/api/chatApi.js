/**
 * chatApi.js — Chat REST API
 *
 * Handles conversation and messaging endpoints (REST, not WebSocket).
 * WebSocket real-time messaging is handled separately in useWebSocket.js.
 *
 * All endpoints require JWT authentication.
 */

import axiosInstance from "./axiosInstance";

/**
 * Create a new conversation with a hotel.
 * Traveler initiates a chat with a hotel via their hotel profile ID.
 * @param {number|string} hotel_id - Hotel profile ID
 * @returns {Promise<Object>} Created conversation data
 */
export const createConversation = async (hotel_id) => {
  const response = await axiosInstance.post("/chat/conversations/create/", {
    hotel_id,
  });
  return response.data;
};

/**
 * Get all conversations for the authenticated user.
 * @returns {Promise<Array>} List of conversation objects
 */
export const getConversations = async () => {
  const response = await axiosInstance.get("/chat/conversations/");
  return response.data;
};

/**
 * Get a single conversation by ID (includes participant info).
 * @param {number|string} id - Conversation ID
 * @returns {Promise<Object>} Conversation details
 */
export const getConversation = async (id) => {
  const response = await axiosInstance.get(`/chat/conversations/${id}/`);
  return response.data;
};

/**
 * Send a message in a conversation via REST (fallback for WebSocket).
 * @param {number|string} id - Conversation ID
 * @param {string} content - Message text
 * @returns {Promise<Object>} Created message data
 */
export const sendMessage = async (id, content) => {
  const response = await axiosInstance.post(
    `/chat/conversations/${id}/send_message/`,
    { content }
  );
  return response.data;
};

/**
 * Mark a specific message as read.
 * @param {number|string} id - Conversation ID
 * @param {number|string} message_id - Message ID to mark as read
 * @returns {Promise<Object>} Confirmation
 */
export const markAsRead = async (id, message_id) => {
  const response = await axiosInstance.post(
    `/chat/conversations/${id}/mark_as_read/`,
    { message_id }
  );
  return response.data;
};

/**
 * Get all messages in a conversation (for initial load).
 * After initial load, new messages arrive via WebSocket.
 * @param {number|string} id - Conversation ID
 * @returns {Promise<Array>} List of messages
 */
export const getMessages = async (id) => {
  const response = await axiosInstance.get(
    `/chat/conversations/${id}/messages/`
  );
  return response.data;
};