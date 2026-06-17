/**
 * useNotifications.js — Notification Context Shortcut Hook
 *
 * Convenience hook for consuming NotificationContext from any component.
 * Throws a helpful error if used outside of <NotificationProvider>.
 *
 * Usage:
 *   import useNotifications from '../hooks/useNotifications';
 *   const { unreadCount, fetchUnreadCount } = useNotifications();
 */

import { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a <NotificationProvider>"
    );
  }
  return context;
};

export default useNotifications;
