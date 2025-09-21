import { analyticsAPI } from '../lib/api';
import { 
  agentKPIs, 
  teamKPIs, 
  areaKPIs, 
  regionKPIs, 
  nationalKPIs,
  visitTrends,
  conversionTrends,
  shelfShareTrends,
  trainingTrends,
  visitsByType,
  visitsByStatus,
  goalsByMetric,
  goalsByStatus,
  callCycleAdherence,
  visitHeatmapData
} from '../data/analytics';

/**
 * Get analytics overview
 * @param {Object} params - Query parameters
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Object>} - Analytics overview data
 */
export const getAnalyticsOverview = async (params = {}, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await analyticsAPI.getOverview(params);
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics overview:', error);
      throw error;
    }
  } else {
    // Use mock data
    const { role, userId, teamId, areaId, regionId, tenantId } = params;
    
    // Return different KPIs based on role or entity ID
    if (role === 'agent' || userId) {
      const agentId = userId || params.id;
      const agent = agentKPIs.find(a => a.id === agentId);
      return {
        kpis: agent || agentKPIs[0],
        visitTrends,
        conversionTrends,
        visitsByType,
        visitsByStatus,
        goalsByMetric,
        goalsByStatus
      };
    } else if (role === 'team_leader' || teamId) {
      const team = teamKPIs.find(t => t.id === (teamId || params.id));
      return {
        kpis: team || teamKPIs[0],
        visitTrends,
        conversionTrends,
        shelfShareTrends,
        visitsByType,
        visitsByStatus,
        goalsByMetric,
        goalsByStatus,
        callCycleAdherence
      };
    } else if (role === 'area_manager' || areaId) {
      const area = areaKPIs.find(a => a.id === (areaId || params.id));
      return {
        kpis: area || areaKPIs[0],
        visitTrends,
        conversionTrends,
        shelfShareTrends,
        trainingTrends,
        visitsByType,
        visitsByStatus,
        goalsByMetric,
        goalsByStatus,
        callCycleAdherence,
        visitHeatmapData
      };
    } else if (role === 'regional_manager' || regionId) {
      const region = regionKPIs.find(r => r.id === (regionId || params.id));
      return {
        kpis: region || regionKPIs[0],
        visitTrends,
        conversionTrends,
        shelfShareTrends,
        trainingTrends,
        visitsByType,
        visitsByStatus,
        goalsByMetric,
        goalsByStatus,
        callCycleAdherence,
        visitHeatmapData
      };
    } else if (role === 'national_manager') {
      const national = nationalKPIs.find(n => n.tenantId === (tenantId || params.tenantId));
      return {
        kpis: national || nationalKPIs[0],
        visitTrends,
        conversionTrends,
        shelfShareTrends,
        trainingTrends,
        visitsByType,
        visitsByStatus,
        goalsByMetric,
        goalsByStatus,
        callCycleAdherence,
        visitHeatmapData
      };
    } else {
      // Default to admin view
      return {
        kpis: nationalKPIs[0],
        visitTrends,
        conversionTrends,
        shelfShareTrends,
        trainingTrends,
        visitsByType,
        visitsByStatus,
        goalsByMetric,
        goalsByStatus,
        callCycleAdherence,
        visitHeatmapData
      };
    }
  }
};

/**
 * Get visit statistics
 * @param {Object} params - Query parameters
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Object>} - Visit statistics
 */
export const getVisitStats = async (params = {}, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await analyticsAPI.getVisitStats(params);
      return response.data;
    } catch (error) {
      console.error('Error fetching visit statistics:', error);
      throw error;
    }
  } else {
    // Use mock data
    return {
      trends: visitTrends,
      byType: visitsByType,
      byStatus: visitsByStatus,
      heatmap: visitHeatmapData
    };
  }
};

/**
 * Get user statistics
 * @param {Object} params - Query parameters
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Object>} - User statistics
 */
export const getUserStats = async (params = {}, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await analyticsAPI.getUserStats(params);
      return response.data;
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      throw error;
    }
  } else {
    // Use mock data based on role
    const { role } = params;
    
    if (role === 'agent') {
      return { kpis: agentKPIs };
    } else if (role === 'team_leader') {
      return { kpis: teamKPIs };
    } else if (role === 'area_manager') {
      return { kpis: areaKPIs };
    } else if (role === 'regional_manager') {
      return { kpis: regionKPIs };
    } else if (role === 'national_manager') {
      return { kpis: nationalKPIs };
    } else {
      // Default to all users
      return {
        agents: agentKPIs,
        teamLeaders: teamKPIs,
        areaManagers: areaKPIs,
        regionalManagers: regionKPIs,
        nationalManagers: nationalKPIs
      };
    }
  }
};

/**
 * Get goal statistics
 * @param {Object} params - Query parameters
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Object>} - Goal statistics
 */
export const getGoalStats = async (params = {}, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await analyticsAPI.getGoalStats(params);
      return response.data;
    } catch (error) {
      console.error('Error fetching goal statistics:', error);
      throw error;
    }
  } else {
    // Use mock data
    return {
      byMetric: goalsByMetric,
      byStatus: goalsByStatus,
      trends: {
        conversions: conversionTrends,
        shelfShare: shelfShareTrends,
        training: trainingTrends
      }
    };
  }
};

/**
 * Get call cycle adherence statistics
 * @param {Object} params - Query parameters
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Object>} - Call cycle adherence statistics
 */
export const getCallCycleStats = async (params = {}, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await analyticsAPI.getCallCycleStats(params);
      return response.data;
    } catch (error) {
      console.error('Error fetching call cycle statistics:', error);
      throw error;
    }
  } else {
    // Use mock data
    return {
      adherence: callCycleAdherence
    };
  }
};