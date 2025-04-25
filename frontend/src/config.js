/**
 * Application configuration
 * This file centralizes all configuration settings for the application
 */

// API configuration
export const API_CONFIG = {
  // Use environment variable with fallback to localhost for development
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
};

export default {
  API_CONFIG,
};
