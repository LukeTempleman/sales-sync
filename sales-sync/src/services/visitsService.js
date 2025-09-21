import { visitsAPI } from '../lib/api';
import { 
  allVisits, 
  consumerVisits, 
  shopVisits, 
  getVisitsByAgent, 
  getVisitsByTeam,
  getVisitsByArea,
  getVisitsByRegion,
  getVisitsByTenant,
  getVisitsByDateRange,
  getVisitsByType,
  getVisitsByStatus,
  VISIT_TYPES,
  VISIT_STATUS
} from '../data/visits';

/**
 * Get all visits
 * @param {Object} filters - Optional filters for visits
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Array>} - Array of visits
 */
export const getVisits = async (filters = {}, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await visitsAPI.getVisits(filters);
      return response.data.visits || [];
    } catch (error) {
      console.error('Error fetching visits:', error);
      throw error;
    }
  } else {
    // Use mock data with filters
    let filteredVisits = [...allVisits];
    
    // Apply filters
    if (filters.agentId) {
      filteredVisits = filteredVisits.filter(visit => visit.agentId === filters.agentId);
    }
    
    if (filters.tenantId) {
      filteredVisits = filteredVisits.filter(visit => visit.tenantId === filters.tenantId);
    }
    
    if (filters.type) {
      filteredVisits = filteredVisits.filter(visit => visit.type === filters.type);
    }
    
    if (filters.status) {
      filteredVisits = filteredVisits.filter(visit => visit.status === filters.status);
    }
    
    if (filters.startDate && filters.endDate) {
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      filteredVisits = filteredVisits.filter(visit => {
        const visitDate = new Date(visit.date);
        return visitDate >= startDate && visitDate <= endDate;
      });
    }
    
    return filteredVisits;
  }
};

/**
 * Get visits by agent
 * @param {string|number} agentId - Agent ID
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Array>} - Array of visits for the agent
 */
export const getVisitsByAgentId = async (agentId, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await visitsAPI.getVisits({ agent_id: agentId });
      return response.data.visits || [];
    } catch (error) {
      console.error(`Error fetching visits for agent ${agentId}:`, error);
      throw error;
    }
  } else {
    // Use mock data
    return getVisitsByAgent(agentId);
  }
};

/**
 * Get visits by team
 * @param {string|number} teamId - Team ID
 * @param {Array} agents - Array of agents (needed for mock data)
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Array>} - Array of visits for the team
 */
export const getVisitsByTeamId = async (teamId, agents = [], useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await visitsAPI.getVisits({ team_id: teamId });
      return response.data.visits || [];
    } catch (error) {
      console.error(`Error fetching visits for team ${teamId}:`, error);
      throw error;
    }
  } else {
    // Use mock data
    return getVisitsByTeam(teamId, agents);
  }
};

/**
 * Get visits by area
 * @param {string|number} areaId - Area ID
 * @param {Array} teams - Array of teams (needed for mock data)
 * @param {Array} agents - Array of agents (needed for mock data)
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Array>} - Array of visits for the area
 */
export const getVisitsByAreaId = async (areaId, teams = [], agents = [], useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await visitsAPI.getVisits({ area_id: areaId });
      return response.data.visits || [];
    } catch (error) {
      console.error(`Error fetching visits for area ${areaId}:`, error);
      throw error;
    }
  } else {
    // Use mock data
    return getVisitsByArea(areaId, teams, agents);
  }
};

/**
 * Get visits by region
 * @param {string|number} regionId - Region ID
 * @param {Array} areas - Array of areas (needed for mock data)
 * @param {Array} teams - Array of teams (needed for mock data)
 * @param {Array} agents - Array of agents (needed for mock data)
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Array>} - Array of visits for the region
 */
export const getVisitsByRegionId = async (regionId, areas = [], teams = [], agents = [], useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await visitsAPI.getVisits({ region_id: regionId });
      return response.data.visits || [];
    } catch (error) {
      console.error(`Error fetching visits for region ${regionId}:`, error);
      throw error;
    }
  } else {
    // Use mock data
    return getVisitsByRegion(regionId, areas, teams, agents);
  }
};

/**
 * Get visits by tenant
 * @param {string|number} tenantId - Tenant ID
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Array>} - Array of visits for the tenant
 */
export const getVisitsByTenantId = async (tenantId, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await visitsAPI.getVisits({ tenant_id: tenantId });
      return response.data.visits || [];
    } catch (error) {
      console.error(`Error fetching visits for tenant ${tenantId}:`, error);
      throw error;
    }
  } else {
    // Use mock data
    return getVisitsByTenant(tenantId);
  }
};

/**
 * Get a visit by ID
 * @param {string|number} id - Visit ID
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Object>} - Visit object
 */
export const getVisitById = async (id, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await visitsAPI.getVisitById(id);
      return response.data.visit;
    } catch (error) {
      console.error(`Error fetching visit with ID ${id}:`, error);
      throw error;
    }
  } else {
    // Use mock data
    return allVisits.find(visit => visit.id === id);
  }
};

/**
 * Create a new visit
 * @param {Object} visitData - Visit data
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Object>} - Created visit
 */
export const createVisit = async (visitData, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await visitsAPI.createVisit(visitData);
      return response.data.visit;
    } catch (error) {
      console.error('Error creating visit:', error);
      throw error;
    }
  } else {
    // Mock creating a visit
    const newId = Math.max(...allVisits.map(v => v.id)) + 1;
    const newVisit = {
      id: newId,
      ...visitData,
      date: visitData.date || new Date().toISOString(),
      status: visitData.status || VISIT_STATUS.COMPLETED
    };
    
    // In a real app, we would update the mock data store
    // For now, we'll just return the new visit
    return newVisit;
  }
};

/**
 * Update an existing visit
 * @param {string|number} id - Visit ID
 * @param {Object} visitData - Updated visit data
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Object>} - Updated visit
 */
export const updateVisit = async (id, visitData, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await visitsAPI.updateVisit(id, visitData);
      return response.data.visit;
    } catch (error) {
      console.error(`Error updating visit with ID ${id}:`, error);
      throw error;
    }
  } else {
    // Mock updating a visit
    const visit = allVisits.find(v => v.id === id);
    if (!visit) {
      throw new Error(`Visit with ID ${id} not found`);
    }
    
    const updatedVisit = {
      ...visit,
      ...visitData
    };
    
    // In a real app, we would update the mock data store
    // For now, we'll just return the updated visit
    return updatedVisit;
  }
};

/**
 * Delete a visit
 * @param {string|number} id - Visit ID
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Object>} - Success response
 */
export const deleteVisit = async (id, useRealApi = false) => {
  if (useRealApi) {
    try {
      await visitsAPI.deleteVisit(id);
      return { success: true };
    } catch (error) {
      console.error(`Error deleting visit with ID ${id}:`, error);
      throw error;
    }
  } else {
    // Mock deleting a visit
    // In a real app, we would update the mock data store
    return { success: true };
  }
};

/**
 * Upload a photo for a visit
 * @param {string|number} visitId - Visit ID
 * @param {string} photoType - Type of photo (e.g., 'id', 'shelf', 'exterior')
 * @param {File} file - Photo file
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Object>} - Uploaded photo
 */
export const uploadVisitPhoto = async (visitId, photoType, file, useRealApi = false) => {
  if (useRealApi) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('photo_type', photoType);
      
      const response = await visitsAPI.uploadVisitPhoto(visitId, formData);
      return response.data.photo;
    } catch (error) {
      console.error(`Error uploading ${photoType} photo for visit ${visitId}:`, error);
      throw error;
    }
  } else {
    // Mock uploading a photo
    const photo = {
      id: Math.floor(Math.random() * 1000) + 1,
      visitId,
      type: photoType,
      url: URL.createObjectURL(file),
      filename: file.name,
      uploadedAt: new Date().toISOString()
    };
    
    return photo;
  }
};