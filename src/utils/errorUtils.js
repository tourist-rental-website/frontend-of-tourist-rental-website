/**
 * errorUtils.js — Centralized Error Message Extraction
 *
 * Provides a single utility to extract human-readable error messages
 * from Axios error responses. Handles the various shapes of error
 * payloads returned by Django REST Framework:
 *   - { detail: "..." }
 *   - { error: "..." }
 *   - { field_name: ["error1", "error2"] }
 *   - { non_field_errors: ["..."] }
 *   - Plain string responses
 */

/**
 * Extract a user-friendly error message from an Axios error.
 *
 * @param {Error} err - The caught error (typically from axios)
 * @param {string} fallback - Fallback message if no meaningful error is found
 * @returns {string} A human-readable error message
 */
export const getErrorMessage = (err, fallback = "Something went wrong. Please try again.") => {
  // No response at all — network error or request was never sent
  if (!err.response) {
    return err.message || fallback;
  }

  const data = err.response.data;

  // If the response isn't an object, return it as a string
  if (!data || typeof data === "string") {
    return data || fallback;
  }

  // DRF standard: { detail: "..." }
  if (data.detail) {
    return data.detail;
  }

  // Custom backend pattern: { error: "..." }
  if (data.error) {
    return data.error;
  }

  // DRF non_field_errors: { non_field_errors: ["..."] }
  if (data.non_field_errors) {
    return Array.isArray(data.non_field_errors)
      ? data.non_field_errors.join(" ")
      : data.non_field_errors;
  }

  // DRF field-level errors: { field_name: ["error1", "error2"], ... }
  // Collect the first error from each field into a readable string
  const fieldErrors = Object.entries(data)
    .filter(([, value]) => Array.isArray(value) || typeof value === "string")
    .map(([key, value]) => {
      const msg = Array.isArray(value) ? value.join(", ") : value;
      return `${key}: ${msg}`;
    });

  if (fieldErrors.length > 0) {
    return fieldErrors.join(". ");
  }

  return fallback;
};
