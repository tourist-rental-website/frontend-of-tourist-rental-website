/**
 * notificationsApi.js — Notifications API
 *
 * Handles system notification endpoints:
 *   - List all / unread notifications
 *   - Mark individual or all as read
 *   - Delete notifications
 *   - Get unread count (for Navbar badge)
 *
 * All endpoints require JWT authentication.
 */

import axiosInstance from "./axiosInstance";

/**
 * Get all notifications for the current user.
 * @returns {Promise<Array>} List of notification objects
 */
export const getNotifications = async () => {
  const response = await axiosInstance.get("/notifications/");
  return response.data;
};

/**
 * Get only unread notifications.
 * @returns {Promise<Array>} List of unread notification objects
 */
export const getUnreadNotifications = async () => {
  const response = await axiosInstance.get("/notifications/unread/");
  return response.data;
};

/**
 * Mark a single notification as read.
 * @param {number|string} id - Notification ID
 * @returns {Promise<Object>} Updated notification
 */
export const markAsRead = async (id) => {
  const response = await axiosInstance.patch(`/notifications/${id}/read/`);
  return response.data;
};

/**
 * Mark all notifications as read at once.
 * @returns {Promise<Object>} Confirmation response
 */
export const markAllAsRead = async () => {
  const response = await axiosInstance.patch("/notifications/read-all/");
  return response.data;
};

/**
 * Delete a notification permanently.
 * @param {number|string} id - Notification ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteNotification = async (id) => {
  const response = await axiosInstance.delete(`/notifications/${id}/delete/`);
  return response.data;
};

/**
 * Get count of unread notifications (used for Navbar badge).
 * @returns {Promise<Object>} { count: number }
 */
export const getUnreadCount = async () => {
  const response = await axiosInstance.get("/notifications/count/unread/");
  return response.data;
};