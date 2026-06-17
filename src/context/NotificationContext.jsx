/**
 * NotificationContext.jsx — Global Notification State
 *
 * Provides notification state and actions to the app via React Context.
 * Currently a stub — full implementation is Phase 8.
 *
 * State exposed:
 *   - notifications  — Array of notification objects
 *   - unreadCount    — Number of unread notifications (for Navbar badge)
 *   - loading        — True while fetching notifications
 *
 * Actions exposed (stubs for now):
 *   - fetchNotifications()     — Load all notifications
 *   - fetchUnreadCount()       — Refresh the unread count
 *   - markAllAsRead()          — Mark all notifications as read
 *   - markAsRead(id)           — Mark a single notification as read
 *   - deleteNotification(id)   — Delete a notification
 */

import { createContext, useState } from "react";

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // TODO (Phase 8): Implement these by calling notificationsApi functions
  // and adding polling via setInterval or window focus events
  const fetchNotifications = async () => {};
  const fetchUnreadCount = async () => {};
  const markAllAsRead = async () => {};
  const markAsRead = async () => {};
  const deleteNotification = async () => {};

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        fetchUnreadCount,
        markAllAsRead,
        markAsRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
