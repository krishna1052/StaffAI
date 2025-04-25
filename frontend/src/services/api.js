/**
 * API service for connecting to the StaffAI backend
 */

import { API_CONFIG } from '../config';

const API_URL = API_CONFIG.API_URL;

/**
 * Get all profiles
 * @returns {Promise<Array>} List of profiles
 */
export const getProfiles = async () => {
  try {
    const response = await fetch(`${API_URL}/profiles`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching profiles:', error);
    throw error;
  }
};

/**
 * Search profiles by query
 * @param {string} query - Search query
 * @returns {Promise<Array>} List of matching profiles
 */
export const searchProfiles = async (query) => {
  try {
    const response = await fetch(`${API_URL}/profiles/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching profiles:', error);
    throw error;
  }
};

/**
 * Search profiles using vector similarity
 * @param {string} query - Search query
 * @param {number} limit - Maximum number of results
 * @returns {Promise<Array>} List of matching profiles with similarity scores
 */
export const vectorSearchProfiles = async (query, limit = 10) => {
  try {
    const response = await fetch(`${API_URL}/profiles/vector-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, limit }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error performing vector search:', error);
    throw error;
  }
};

/**
 * Get profile by ID
 * @param {string} id - Profile ID
 * @returns {Promise<Object>} Profile details
 */
export const getProfileById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/profiles/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching profile ${id}:`, error);
    throw error;
  }
};

/**
 * Get all roles
 * @returns {Promise<Array>} List of roles
 */
export const getRoles = async () => {
  try {
    const response = await fetch(`${API_URL}/roles`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

/**
 * Get all tools/skills
 * @returns {Promise<Array>} List of tools
 */
export const getTools = async () => {
  try {
    const response = await fetch(`${API_URL}/tools`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching tools:', error);
    throw error;
  }
};

/**
 * Get profiles by role
 * @param {string} role - Role name
 * @returns {Promise<Array>} List of profiles with the specified role
 */
export const getProfilesByRole = async (role) => {
  try {
    const response = await fetch(`${API_URL}/profiles/role/${encodeURIComponent(role)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching profiles for role ${role}:`, error);
    throw error;
  }
};

/**
 * Get profiles by tool/skill
 * @param {string} tool - Tool/skill name
 * @returns {Promise<Array>} List of profiles with the specified tool/skill
 */
export const getProfilesByTool = async (tool) => {
  try {
    const response = await fetch(`${API_URL}/profiles/tool/${encodeURIComponent(tool)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching profiles for tool ${tool}:`, error);
    throw error;
  }
};

/**
 * Check API health
 * @returns {Promise<Object>} Health status
 */
export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_URL}/health`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error checking API health:', error);
    throw error;
  }
};

/**
 * Create a new profile
 * @param {Object} profileData - The profile data to create
 * @returns {Promise<Object>} Created profile
 */
export const createProfile = async (profileData) => {
  try {
    const response = await fetch(`${API_URL}/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
};
