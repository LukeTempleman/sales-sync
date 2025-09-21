import { usersAPI } from '../lib/api';
import { getAgentsByTeamLeader as getMockAgentsByTeamLeader } from '../data/helpers';

// Get agents for a team leader
export const getAgentsByTeamLeader = async (teamLeaderId, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await usersAPI.getUsers({ 
        team_leader_id: teamLeaderId,
        role: 'agent'
      });
      return response.data.users || [];
    } catch (error) {
      console.error('Error fetching agents:', error);
      throw error;
    }
  } else {
    // Use mock data
    return getMockAgentsByTeamLeader(teamLeaderId);
  }
};

// Get a single agent by ID
export const getAgentById = async (id, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await usersAPI.getUserById(id);
      return response.data.user;
    } catch (error) {
      console.error('Error fetching agent:', error);
      throw error;
    }
  } else {
    // Mock getting an agent by ID
    // This is a simplified implementation - in a real app, you'd search through your mock data
    return null;
  }
};