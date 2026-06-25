/**
 * authApi.js — Authentication API
 *
 * Handles all user authentication endpoints:
 *   - Registration (create new user account)
 *   - Login (obtain JWT token pair: access + refresh)
 *   - Token refresh (exchange refresh token for new access token)
 *   - Profile read/update
 *
 * The access token is valid for 60 minutes.
 * The refresh token is valid for 7 days.
 */

import axiosInstance from "./axiosInstance";

/**
 * Register a new user account.
 * Endpoint: POST /accounts/register/
 * @param {Object} data - { email, password, first_name, last_name, phone, role }
 *   role must be one of: "traveler", "guide", "hotel"
 * @returns {Promise<Object>} Created user data
 */
export const register = async (data) => {
  const response = await axiosInstance.post("/accounts/register/", data);
  return response.data;
};

/**
 * Login user and obtain JWT token pair.
 * Endpoint: POST /accounts/login/
 * @param {Object} data - { email, password }
 * @returns {Promise<Object>} { access, refresh } — JWT token pair
 */
export const login = async (data) => {
  const response = await axiosInstance.post("/accounts/login/", data);
  return response.data;
};

/**
 * Refresh an expired access token using a valid refresh token.
 * Endpoint: POST /accounts/api/token/refresh/
 * @param {string} refresh - The refresh token
 * @returns {Promise<Object>} { access } — New access token
 */
export const refreshToken = async (refresh) => {
  const response = await axiosInstance.post("/accounts/api/token/refresh/", {
    refresh,
  });
  return response.data;
};

/**
 * Get the authenticated user's profile.
 * Endpoint: GET /accounts/me/
 * Requires valid Bearer token in Authorization header.
 * @returns {Promise<Object>} User profile data
 */
export const getProfile = async () => {
  const response = await axiosInstance.get("/accounts/me/");
  return response.data;
};

/**
 * Update the authenticated user's profile (partial update).
 * Endpoint: PATCH /accounts/me/
 * @param {Object} data - Fields to update (e.g., { first_name, last_name, phone })
 *   Note: email and role are read-only and cannot be changed
 * @returns {Promise<Object>} Updated profile data
 */
export const updateProfile = async (data) => {
  const config = {};

  if (data instanceof FormData) {
    config.headers = {
      "Content-Type": "multipart/form-data",
    };
  }

  const response = await axiosInstance.patch(
    "/accounts/me/",
    data,
    config
  );

  return response.data;
};