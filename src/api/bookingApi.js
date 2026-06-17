/**
 * bookingApi.js — Booking Operations API
 *
 * Handles room and package booking:
 *   - Create bookings (traveler role required)
 *   - List user's own bookings
 *   - Cancel bookings (pending/confirmed only)
 *
 * All endpoints require JWT authentication.
 */

import axiosInstance from "./axiosInstance";

// ===========================================================================
// Create Bookings
// ===========================================================================

/**
 * Create a new room booking.
 * @param {Object} data - { room, check_in, check_out } (room = room ID)
 * @returns {Promise<Object>} Created booking with status
 */
export const createRoomBooking = async (data) => {
  const response = await axiosInstance.post("/booking/room-booking/", data);
  return response.data;
};

/**
 * Create a new package booking.
 * @param {Object} data - { package, start_date } (package = package ID)
 * @returns {Promise<Object>} Created booking with status
 */
export const createPackageBooking = async (data) => {
  const response = await axiosInstance.post("/booking/package-booking/", data);
  return response.data;
};

// ===========================================================================
// List My Bookings
// ===========================================================================

/**
 * Get all room bookings for the authenticated user.
 * @returns {Promise<Array>} List of user's room bookings
 */
export const getMyRoomBookings = async () => {
  const response = await axiosInstance.get("/booking/my-room-bookings/");
  return response.data;
};

/**
 * Get all package bookings for the authenticated user.
 * @returns {Promise<Array>} List of user's package bookings
 */
export const getMyPackageBookings = async () => {
  const response = await axiosInstance.get("/booking/my-package-bookings/");
  return response.data;
};

// ===========================================================================
// Cancel Bookings
// ===========================================================================

/**
 * Cancel a room booking by ID.
 * Only bookings with status "pending" or "confirmed" can be cancelled.
 * @param {number|string} id - Booking ID
 * @returns {Promise<Object>} Updated booking with cancelled status
 */
export const cancelRoomBooking = async (id) => {
  const response = await axiosInstance.patch(
    `/booking/room-bookings/${id}/cancel/`
  );
  return response.data;
};

/**
 * Cancel a package booking by ID.
 * Only bookings with status "pending" or "confirmed" can be cancelled.
 * @param {number|string} id - Booking ID
 * @returns {Promise<Object>} Updated booking with cancelled status
 */
export const cancelPackageBooking = async (id) => {
  // BUG FIX: Was "package-bookages" (typo) — corrected to "package-bookings"
  const response = await axiosInstance.patch(
    `/booking/package-bookings/${id}/cancel/`
  );
  return response.data;
};