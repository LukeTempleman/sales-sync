import { teamsAPI } from '../lib/api';
import { 
  teams, 
  getTeamsByArea, 
  getTeamMembers 
} from '../data/users';

/**
 * Get all teams
 * @param {Object} filters - Optional filters for teams
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Array>} - Array of teams
 */
export const getTeams = async (filters = {}, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await teamsAPI.getTeams(filters);
      return response.data.teams || [];
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw error;
    }
  } else {
    // Use mock data with filters
    let filteredTeams = [...teams];
    
    // Apply filters
    if (filters.areaId) {
      filteredTeams = filteredTeams.filter(team => team.areaId === filters.areaId);
    }
    
    if (filters.tenantId) {
      filteredTeams = filteredTeams.filter(team => team.tenantId === filters.tenantId);
    }
    
    if (filters.leaderId) {
      filteredTeams = filteredTeams.filter(team => team.leaderId === filters.leaderId);
    }
    
    return filteredTeams;
  }
};

/**
 * Get a team by ID
 * @param {string|number} id - Team ID
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Object>} - Team object
 */
export const getTeamById = async (id, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await teamsAPI.getTeamById(id);
      return response.data.team;
    } catch (error) {
      console.error(`Error fetching team with ID ${id}:`, error);
      throw error;
    }
  } else {
    // Use mock data
    return teams.find(team => team.id === id);
  }
};

/**
 * Get teams by area
 * @param {string|number} areaId - Area ID
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Array>} - Array of teams in the area
 */
export const getTeamsByAreaId = async (areaId, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await teamsAPI.getTeams({ area_id: areaId });
      return response.data.teams || [];
    } catch (error) {
      console.error(`Error fetching teams for area ${areaId}:`, error);
      throw error;
    }
  } else {
    // Use mock data
    return getTeamsByArea(areaId);
  }
};

/**
 * Get team members
 * @param {string|number} teamId - Team ID
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Array>} - Array of team members
 */
export const getTeamMembersById = async (teamId, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await teamsAPI.getTeamMembers(teamId);
      return response.data.members || [];
    } catch (error) {
      console.error(`Error fetching members for team ${teamId}:`, error);
      throw error;
    }
  } else {
    // Use mock data
    return getTeamMembers(teamId);
  }
};

/**
 * Create a new team
 * @param {Object} teamData - Team data
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Object>} - Created team
 */
export const createTeam = async (teamData, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await teamsAPI.createTeam(teamData);
      return response.data.team;
    } catch (error) {
      console.error('Error creating team:', error);
      throw error;
    }
  } else {
    // Mock creating a team
    const newId = Math.max(...teams.map(t => t.id)) + 1;
    const newTeam = {
      id: newId,
      ...teamData
    };
    
    // In a real app, we would update the mock data store
    // For now, we'll just return the new team
    return newTeam;
  }
};

/**
 * Update an existing team
 * @param {string|number} id - Team ID
 * @param {Object} teamData - Updated team data
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Object>} - Updated team
 */
export const updateTeam = async (id, teamData, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await teamsAPI.updateTeam(id, teamData);
      return response.data.team;
    } catch (error) {
      console.error(`Error updating team with ID ${id}:`, error);
      throw error;
    }
  } else {
    // Mock updating a team
    const team = teams.find(t => t.id === id);
    if (!team) {
      throw new Error(`Team with ID ${id} not found`);
    }
    
    const updatedTeam = {
      ...team,
      ...teamData
    };
    
    // In a real app, we would update the mock data store
    // For now, we'll just return the updated team
    return updatedTeam;
  }
};

/**
 * Delete a team
 * @param {string|number} id - Team ID
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Object>} - Success response
 */
export const deleteTeam = async (id, useRealApi = false) => {
  if (useRealApi) {
    try {
      await teamsAPI.deleteTeam(id);
      return { success: true };
    } catch (error) {
      console.error(`Error deleting team with ID ${id}:`, error);
      throw error;
    }
  } else {
    // Mock deleting a team
    // In a real app, we would update the mock data store
    return { success: true };
  }
};

/**
 * Add a member to a team
 * @param {string|number} teamId - Team ID
 * @param {string|number} userId - User ID to add
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Object>} - Success response
 */
export const addTeamMember = async (teamId, userId, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await teamsAPI.addTeamMember(teamId, userId);
      return response.data;
    } catch (error) {
      console.error(`Error adding user ${userId} to team ${teamId}:`, error);
      throw error;
    }
  } else {
    // Mock adding a team member
    // In a real app, we would update the mock data store
    return { success: true };
  }
};

/**
 * Remove a member from a team
 * @param {string|number} teamId - Team ID
 * @param {string|number} userId - User ID to remove
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Object>} - Success response
 */
export const removeTeamMember = async (teamId, userId, useRealApi = false) => {
  if (useRealApi) {
    try {
      await teamsAPI.removeTeamMember(teamId, userId);
      return { success: true };
    } catch (error) {
      console.error(`Error removing user ${userId} from team ${teamId}:`, error);
      throw error;
    }
  } else {
    // Mock removing a team member
    // In a real app, we would update the mock data store
    return { success: true };
  }
};