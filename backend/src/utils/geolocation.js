const logger = require('../utils/logger');

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in meters
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

/**
 * Validate if student is within allowed radius of school
 * @param {number} studentLat - Student's latitude
 * @param {number} studentLon - Student's longitude
 * @param {number} schoolLat - School's latitude
 * @param {number} schoolLon - School's longitude
 * @param {number} allowedRadius - Allowed radius in meters
 * @returns {object} Validation result with distance
 */
const validateLocation = (studentLat, studentLon, schoolLat, schoolLon, allowedRadius) => {
  try {
    const distance = calculateDistance(studentLat, studentLon, schoolLat, schoolLon);
    const isValid = distance <= allowedRadius;

    logger.info(`Location validation: distance=${distance.toFixed(2)}m, allowed=${allowedRadius}m, valid=${isValid}`);

    return {
      valid: isValid,
      distance: Math.round(distance),
      allowedRadius,
    };
  } catch (error) {
    logger.error(`Location validation error: ${error.message}`);
    return {
      valid: false,
      distance: null,
      allowedRadius,
      error: error.message,
    };
  }
};

/**
 * Determine attendance status based on time
 * @param {Date} checkInTime - Time of check-in
 * @param {Date} sessionStartTime - Start time of session
 * @param {number} presentMinutes - Minutes to mark as present
 * @param {number} lateMinutes - Minutes to mark as late
 * @returns {string} Status: 'present' or 'late'
 */
const determineStatus = (checkInTime, sessionStartTime, presentMinutes, lateMinutes) => {
  const timeDiff = (checkInTime - sessionStartTime) / 1000 / 60; // in minutes

  if (timeDiff <= presentMinutes) {
    return 'present';
  } else if (timeDiff <= lateMinutes) {
    return 'late';
  } else {
    return 'late'; // After late minutes but before expiry is still late
  }
};

/**
 * Generate a random attendance code
 * @param {number} length - Length of code (default 6)
 * @returns {string} Generated code
 */
const generateCode = (length = 6) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding similar characters
  let code = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  
  return code;
};

module.exports = {
  calculateDistance,
  validateLocation,
  determineStatus,
  generateCode,
};
