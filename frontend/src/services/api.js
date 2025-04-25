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
 * Search profiles with advanced filters
 * @param {Object} filters - Filter parameters
 * @param {string} filters.query - Search query (optional)
 * @param {string} filters.role - Role filter (optional)
 * @param {string} filters.skill - Skill filter (optional)
 * @param {string} filters.grade - Grade filter (optional)
 * @param {string} filters.office - Office location filter (optional)
 * @param {string} filters.startDate - Start date filter (optional)
 * @param {string} filters.endDate - End date filter (optional)
 * @param {string} filters.jobDescription - Job description keyword filter (optional)
 * @returns {Promise<Array>} List of matching profiles
 */
export const searchProfilesWithFilters = async (filters) => {
  try {
    // Use the basic search endpoint if there's a query
    if (filters.query) {
      const response = await fetch(`${API_URL}/profiles/search?query=${encodeURIComponent(filters.query)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Get search results
      let results = await response.json();
      
      // Filter the results based on other criteria
      if (filters.role) {
        results = results.filter(profile => profile.role === filters.role);
      }
      
      if (filters.skill) {
        results = results.filter(profile => 
          profile.description && profile.description.toLowerCase().includes(filters.skill.toLowerCase())
        );
      }
      
      if (filters.grade) {
        results = results.filter(profile => profile.grade === filters.grade);
      }
      
      if (filters.office) {
        results = results.filter(profile => profile.office === filters.office);
      }
      
      // Handle job description filter
      if (filters.jobDescription) {
        results = results.filter(profile => 
          profile.description && profile.description.toLowerCase().includes(filters.jobDescription.toLowerCase())
        );
      }
      
      // Handle date filtering if supported in the profile data
      if (filters.startDate || filters.endDate) {
        results = results.filter(profile => {
          let matchesDateRange = true;
          const profileStartDate = profile.start_date ? new Date(profile.start_date) : null;
          const profileEndDate = profile.end_date ? new Date(profile.end_date) : null;
          
          if (filters.startDate && profileStartDate) {
            const filterStartDate = new Date(filters.startDate);
            if (profileStartDate < filterStartDate) {
              matchesDateRange = false;
            }
          }
          
          if (filters.endDate && profileEndDate) {
            const filterEndDate = new Date(filters.endDate);
            if (profileEndDate > filterEndDate) {
              matchesDateRange = false;
            }
          }
          
          return matchesDateRange;
        });
      }
      
      return results;
    } else if (filters.role) {
      // If no query but has role filter, use role endpoint
      const response = await fetch(`${API_URL}/profiles/role/${encodeURIComponent(filters.role)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Get results and apply other filters
      let results = await response.json();
      
      // Apply remaining filters
      if (filters.skill) {
        results = results.filter(profile => 
          profile.description && profile.description.toLowerCase().includes(filters.skill.toLowerCase())
        );
      }
      
      if (filters.grade) {
        results = results.filter(profile => profile.grade === filters.grade);
      }
      
      if (filters.office) {
        results = results.filter(profile => profile.office === filters.office);
      }
      
      // Handle remaining filters as above
      if (filters.jobDescription) {
        results = results.filter(profile => 
          profile.description && profile.description.toLowerCase().includes(filters.jobDescription.toLowerCase())
        );
      }
      
      // Date filtering
      if (filters.startDate || filters.endDate) {
        results = results.filter(profile => {
          let matchesDateRange = true;
          const profileStartDate = profile.start_date ? new Date(profile.start_date) : null;
          const profileEndDate = profile.end_date ? new Date(profile.end_date) : null;
          
          if (filters.startDate && profileStartDate) {
            const filterStartDate = new Date(filters.startDate);
            if (profileStartDate < filterStartDate) {
              matchesDateRange = false;
            }
          }
          
          if (filters.endDate && profileEndDate) {
            const filterEndDate = new Date(filters.endDate);
            if (profileEndDate > filterEndDate) {
              matchesDateRange = false;
            }
          }
          
          return matchesDateRange;
        });
      }
      
      return results;
    } else if (filters.skill) {
      // If has skill filter, use tool endpoint
      const response = await fetch(`${API_URL}/profiles/tool/${encodeURIComponent(filters.skill)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Get results and apply other filters
      let results = await response.json();
      
      // Apply remaining filters
      if (filters.grade) {
        results = results.filter(profile => profile.grade === filters.grade);
      }
      
      if (filters.office) {
        results = results.filter(profile => profile.office === filters.office);
      }
      
      // Handle remaining filters as above
      if (filters.jobDescription) {
        results = results.filter(profile => 
          profile.description && profile.description.toLowerCase().includes(filters.jobDescription.toLowerCase())
        );
      }
      
      // Date filtering
      if (filters.startDate || filters.endDate) {
        results = results.filter(profile => {
          let matchesDateRange = true;
          const profileStartDate = profile.start_date ? new Date(profile.start_date) : null;
          const profileEndDate = profile.end_date ? new Date(profile.end_date) : null;
          
          if (filters.startDate && profileStartDate) {
            const filterStartDate = new Date(filters.startDate);
            if (profileStartDate < filterStartDate) {
              matchesDateRange = false;
            }
          }
          
          if (filters.endDate && profileEndDate) {
            const filterEndDate = new Date(filters.endDate);
            if (profileEndDate > filterEndDate) {
              matchesDateRange = false;
            }
          }
          
          return matchesDateRange;
        });
      }
      
      return results;
    } else {
      // If no specific filters that match endpoints, get all profiles and filter client-side
      const response = await fetch(`${API_URL}/profiles`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Get all profiles
      let results = await response.json();
      
      // Apply all filters
      if (filters.grade) {
        results = results.filter(profile => profile.grade === filters.grade);
      }
      
      if (filters.office) {
        results = results.filter(profile => profile.office === filters.office);
      }
      
      if (filters.jobDescription) {
        results = results.filter(profile => 
          profile.description && profile.description.toLowerCase().includes(filters.jobDescription.toLowerCase())
        );
      }
      
      // Date filtering
      if (filters.startDate || filters.endDate) {
        results = results.filter(profile => {
          let matchesDateRange = true;
          const profileStartDate = profile.start_date ? new Date(profile.start_date) : null;
          const profileEndDate = profile.end_date ? new Date(profile.end_date) : null;
          
          if (filters.startDate && profileStartDate) {
            const filterStartDate = new Date(filters.startDate);
            if (profileStartDate < filterStartDate) {
              matchesDateRange = false;
            }
          }
          
          if (filters.endDate && profileEndDate) {
            const filterEndDate = new Date(filters.endDate);
            if (profileEndDate > filterEndDate) {
              matchesDateRange = false;
            }
          }
          
          return matchesDateRange;
        });
      }
      
      return results;
    }
  } catch (error) {
    console.error('Error searching profiles with filters:', error);
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

/**
 * Send messages to multiple profiles
 * @param {Array} profileIds - Array of profile IDs to send messages to
 * @param {string} roleOffer - The role being offered
 * @param {string} additionalMessage - Optional additional message content
 * @returns {Promise<Object>} Message sending status
 */
export const sendMessages = async (profileIds, roleOffer, additionalMessage = '') => {
  try {
    const response = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        profileIds,
        roleOffer,
        additionalMessage
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error sending messages:', error);
    throw error;
  }
};

/**
 * Get all messages
 * @returns {Promise<Array>} List of messages
 */
export const getMessages = async () => {
  try {
    const response = await fetch(`${API_URL}/messages`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};
