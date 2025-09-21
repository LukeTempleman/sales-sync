import { goalsAPI } from '../lib/api';
import { 
  allGoals, 
  getGoalsByUser, 
  getGoalsByTeam, 
  getGoalsByArea, 
  getGoalsByRegion, 
  getGoalsByTenant, 
  getGoalsByType, 
  getGoalsByMetric, 
  getGoalsByStatus,
  GOAL_TYPES,
  GOAL_METRICS,
  GOAL_STATUS
} from '../data/goals';

/**
 * Get all goals with optional filters
 * @param {Object} filters - Optional filters for goals
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Array>} - Array of goals
 */
export const getGoals = async (filters = {}, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await goalsAPI.getGoals(filters);
      return response.data.goals || [];
    } catch (error) {
      console.error('Error fetching goals:', error);
      throw error;
    }
  } else {
    // Use mock data with filters
    let filteredGoals = [...allGoals];
    
    // Apply filters
    if (filters.userId) {
      filteredGoals = filteredGoals.filter(goal => goal.assignedTo === filters.userId);
    }
    
    if (filters.teamId) {
      filteredGoals = filteredGoals.filter(goal => goal.teamId === filters.teamId);
    }
    
    if (filters.areaId) {
      filteredGoals = filteredGoals.filter(goal => goal.areaId === filters.areaId);
    }
    
    if (filters.regionId) {
      filteredGoals = filteredGoals.filter(goal => goal.regionId === filters.regionId);
    }
    
    if (filters.tenantId) {
      filteredGoals = filteredGoals.filter(goal => goal.tenantId === filters.tenantId);
    }
    
    if (filters.type) {
      filteredGoals = filteredGoals.filter(goal => goal.type === filters.type);
    }
    
    if (filters.metric) {
      filteredGoals = filteredGoals.filter(goal => goal.metric === filters.metric);
    }
    
    if (filters.status) {
      filteredGoals = filteredGoals.filter(goal => goal.status === filters.status);
    }
    
    return filteredGoals;
  }
};

/**
 * Get a goal by ID
 * @param {string|number} id - Goal ID
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Object>} - Goal object
 */
export const getGoalById = async (id, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await goalsAPI.getGoalById(id);
      return response.data.goal;
    } catch (error) {
      console.error(`Error fetching goal with ID ${id}:`, error);
      throw error;
    }
  } else {
    // Use mock data
    return allGoals.find(goal => goal.id === id);
  }
};

/**
 * Get goals by user
 * @param {string|number} userId - User ID
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Array>} - Array of goals assigned to the user
 */
export const getGoalsByUserId = async (userId, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await goalsAPI.getGoals({ user_id: userId });
      return response.data.goals || [];
    } catch (error) {
      console.error(`Error fetching goals for user ${userId}:`, error);
      throw error;
    }
  } else {
    // Use mock data
    return getGoalsByUser(userId);
  }
};

/**
 * Get goals by team
 * @param {string|number} teamId - Team ID
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Array>} - Array of goals assigned to the team
 */
export const getGoalsByTeamId = async (teamId, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await goalsAPI.getGoals({ team_id: teamId });
      return response.data.goals || [];
    } catch (error) {
      console.error(`Error fetching goals for team ${teamId}:`, error);
      throw error;
    }
  } else {
    // Use mock data
    return getGoalsByTeam(teamId);
  }
};

/**
 * Get goals by area
 * @param {string|number} areaId - Area ID
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Array>} - Array of goals assigned to the area
 */
export const getGoalsByAreaId = async (areaId, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await goalsAPI.getGoals({ area_id: areaId });
      return response.data.goals || [];
    } catch (error) {
      console.error(`Error fetching goals for area ${areaId}:`, error);
      throw error;
    }
  } else {
    // Use mock data
    return getGoalsByArea(areaId);
  }
};

/**
 * Get goals by region
 * @param {string|number} regionId - Region ID
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Array>} - Array of goals assigned to the region
 */
export const getGoalsByRegionId = async (regionId, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await goalsAPI.getGoals({ region_id: regionId });
      return response.data.goals || [];
    } catch (error) {
      console.error(`Error fetching goals for region ${regionId}:`, error);
      throw error;
    }
  } else {
    // Use mock data
    return getGoalsByRegion(regionId);
  }
};

/**
 * Get goals by tenant
 * @param {string|number} tenantId - Tenant ID
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Array>} - Array of goals for the tenant
 */
export const getGoalsByTenantId = async (tenantId, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await goalsAPI.getGoals({ tenant_id: tenantId });
      return response.data.goals || [];
    } catch (error) {
      console.error(`Error fetching goals for tenant ${tenantId}:`, error);
      throw error;
    }
  } else {
    // Use mock data
    return getGoalsByTenant(tenantId);
  }
};

/**
 * Create a new goal
 * @param {Object} goalData - Goal data
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Object>} - Created goal
 */
export const createGoal = async (goalData, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await goalsAPI.createGoal(goalData);
      return response.data.goal;
    } catch (error) {
      console.error('Error creating goal:', error);
      throw error;
    }
  } else {
    // Mock creating a goal
    const newId = Math.max(...allGoals.map(g => g.id)) + 1;
    const newGoal = {
      id: newId,
      ...goalData
    };
    
    // In a real app, we would update the mock data store
    // For now, we'll just return the new goal
    return newGoal;
  }
};

/**
 * Update an existing goal
 * @param {string|number} id - Goal ID
 * @param {Object} goalData - Updated goal data
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Object>} - Updated goal
 */
export const updateGoal = async (id, goalData, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await goalsAPI.updateGoal(id, goalData);
      return response.data.goal;
    } catch (error) {
      console.error(`Error updating goal with ID ${id}:`, error);
      throw error;
    }
  } else {
    // Mock updating a goal
    const goal = allGoals.find(g => g.id === id);
    if (!goal) {
      throw new Error(`Goal with ID ${id} not found`);
    }
    
    const updatedGoal = {
      ...goal,
      ...goalData
    };
    
    // In a real app, we would update the mock data store
    // For now, we'll just return the updated goal
    return updatedGoal;
  }
};

/**
 * Delete a goal
 * @param {string|number} id - Goal ID
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Object>} - Success response
 */
export const deleteGoal = async (id, useRealApi = false) => {
  if (useRealApi) {
    try {
      await goalsAPI.deleteGoal(id);
      return { success: true };
    } catch (error) {
      console.error(`Error deleting goal with ID ${id}:`, error);
      throw error;
    }
  } else {
    // Mock deleting a goal
    // In a real app, we would update the mock data store
    return { success: true };
  }
};

/**
 * Assign a goal to a user, team, area, or region
 * @param {string|number} goalId - Goal ID
 * @param {Object} assignmentData - Assignment data (userId, teamId, areaId, or regionId)
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Object>} - Success response
 */
export const assignGoal = async (goalId, assignmentData, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await goalsAPI.assignGoal(goalId, assignmentData);
      return response.data;
    } catch (error) {
      console.error(`Error assigning goal ${goalId}:`, error);
      throw error;
    }
  } else {
    // Mock assigning a goal
    // In a real app, we would update the mock data store
    return { success: true };
  }
};

/**
 * Update goal progress
 * @param {string|number} id - Goal ID
 * @param {number} progress - New progress value (0-100)
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Object>} - Updated goal
 */
export const updateGoalProgress = async (id, progress, useRealApi = false) => {
  return updateGoal(id, { progress }, useRealApi);
};

/**
 * Export constants for use in components
 */
export { GOAL_TYPES, GOAL_METRICS, GOAL_STATUS };