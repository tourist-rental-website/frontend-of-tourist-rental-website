/**
 * listingsApi.js — Listings CRUD API
 *
 * Handles all listing-related endpoints:
 *   - Guides:   GET (public) + POST (role=guide)
 *   - Hotels:   GET (public) + POST (role=hotel)
 *   - Rooms:    GET (public) + POST (role=hotel)
 *   - Packages: GET (public) + POST (role=guide)
 *
 * All GET endpoints are public (no auth required).
 * All POST/create endpoints require JWT + correct user role.
 *
 * The backend paginates results with PAGE_SIZE=20.
 * Pass ?page=N to navigate pages.
 */

import axiosInstance from "./axiosInstance";

// ===========================================================================
// Guides
// ===========================================================================

/**
 * Fetch paginated list of all guide profiles.
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Object>} Paginated response: { count, next, previous, results }
 */
export const getGuides = async (page = 1) => {
  // BUG FIX: Was using regular quotes "..." which don't interpolate ${page}.
  // Must use backtick template literals for string interpolation.
  const response = await axiosInstance.get(`/listings/guides/?page=${page}`);
  return response.data;
};

/**
 * Create a new guide profile for the authenticated guide user.
 * @param {Object} data - { bio, experience_years, languages, location, price_per_day }
 * @returns {Promise<Object>} Created guide profile
 */
export const createGuideProfile = async (data) => {
  const config = {};

  if (data instanceof FormData) {
    config.headers = {
      "Content-Type": "multipart/form-data",
    };
  }

  const response = await axiosInstance.post("/listings/guides/create/", data, config);
  return response.data;
};

/**
 * Fetch detail of a single guide profile by ID.
 * @param {number|string} id - Guide Profile ID
 * @returns {Promise<Object>} Guide details
 */
export const getGuideDetails = async (id) => {
  const response = await axiosInstance.get(`/listings/guides/${id}/`);
  return response.data;
};

// ===========================================================================
// Hotels
// ===========================================================================

/**
 * Fetch paginated list of all hotel profiles.
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Object>} Paginated response with hotel data
 */
export const getHotels = async (page = 1) => {
  const response = await axiosInstance.get(`/listings/hotels/?page=${page}`);
  return response.data;
};

/**
 * Create a new hotel profile for the authenticated hotel user.
 * @param {Object} data - { hotel_name, description, location, contact_number }
 * @returns {Promise<Object>} Created hotel profile
 */
export const createHotelProfile = async (data) => {
  const response = await axiosInstance.post("/listings/hotels/create/", data);
  return response.data;
};

// ===========================================================================
// Rooms
// ===========================================================================

/**
 * Fetch detail of a single hotel by ID.
 * @param {number|string} id - Hotel ID
 * @returns {Promise<Object>} Hotel profile details
 */
export const getHotelDetails = async (id) => {
  const response = await axiosInstance.get(`/listings/hotels/${id}/`);
  return response.data;
};

/**
 * Fetch paginated list of all rooms (optionally filtered by hotel).
 * @param {number|string|null} hotelId - Hotel ID (optional)
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Object>} Paginated response with room data
 */
export const getRooms = async (hotelId = null, page = 1) => {
  const url = hotelId 
    ? `/listings/rooms/?hotel=${hotelId}&page=${page}`
    : `/listings/rooms/?page=${page}`;
  const response = await axiosInstance.get(url);
  return response.data;
};

/**
 * Create a new room listing (hotel users only).
 * @param {Object} data - { room_type, price_per_night, capacity, description, is_available }
 * @returns {Promise<Object>} Created room
 */
export const createRoom = async (data) => {
  const response = await axiosInstance.post("/listings/rooms/create/", data);
  return response.data;
};

/**
 * Fetch detail of a single room listing by ID.
 * @param {number|string} id - Room ID
 * @returns {Promise<Object>} Room details
 */
export const getRoomDetails = async (id) => {
  const response = await axiosInstance.get(`/listings/rooms/${id}/`);
  return response.data;
};

// ===========================================================================
// Packages
// ===========================================================================

/**
 * Fetch paginated list of all tour packages.
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Object>} Paginated response with package data
 */
export const getPackages = async (page = 1) => {
  const response = await axiosInstance.get(`/listings/packages/?page=${page}`);
  return response.data;
};

/**
 * Create a new tour package (guide users only).
 * @param {Object} data - { title, description, price, duration_days, location }
 * @returns {Promise<Object>} Created package
 */
export const createPackage = async (data) => {
  const response = await axiosInstance.post("/listings/packages/create/", data);
  return response.data;
};

/**
 * Fetch detail of a single tour package by ID.
 * @param {number|string} id - Package ID
 * @returns {Promise<Object>} Package details
 */
export const getPackageDetails = async (id) => {
  const response = await axiosInstance.get(`/listings/packages/${id}/`);
  return response.data;
};