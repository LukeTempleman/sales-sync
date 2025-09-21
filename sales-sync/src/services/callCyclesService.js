import { callCyclesAPI } from '../lib/api';
import { getCallCyclesByTeamLeader as getMockCallCyclesByTeamLeader } from '../data/helpers';

// Get call cycles for a team leader
export const getCallCyclesByTeamLeader = async (teamLeaderId, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await callCyclesAPI.getCallCycles({ team_leader_id: teamLeaderId });
      return response.data.call_cycles || [];
    } catch (error) {
      console.error('Error fetching call cycles:', error);
      throw error;
    }
  } else {
    // Use mock data
    return getMockCallCyclesByTeamLeader(teamLeaderId);
  }
};

// Create a new call cycle
export const createCallCycle = async (cycleData, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await callCyclesAPI.createCallCycle(cycleData);
      return response.data.call_cycle;
    } catch (error) {
      console.error('Error creating call cycle:', error);
      throw error;
    }
  } else {
    // Mock creating a call cycle
    const newId = Math.floor(Math.random() * 10000) + 1;
    return {
      id: newId,
      ...cycleData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
};

// Update an existing call cycle
export const updateCallCycle = async (id, cycleData, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await callCyclesAPI.updateCallCycle(id, cycleData);
      return response.data.call_cycle;
    } catch (error) {
      console.error('Error updating call cycle:', error);
      throw error;
    }
  } else {
    // Mock updating a call cycle
    return {
      id,
      ...cycleData,
      updated_at: new Date().toISOString()
    };
  }
};

// Delete a call cycle
export const deleteCallCycle = async (id, useRealApi = false) => {
  if (useRealApi) {
    try {
      await callCyclesAPI.deleteCallCycle(id);
      return { success: true };
    } catch (error) {
      console.error('Error deleting call cycle:', error);
      throw error;
    }
  } else {
    // Mock deleting a call cycle
    return { success: true };
  }
};

// Get a single call cycle by ID
export const getCallCycleById = async (id, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await callCyclesAPI.getCallCycleById(id);
      return response.data.call_cycle;
    } catch (error) {
      console.error('Error fetching call cycle:', error);
      throw error;
    }
  } else {
    // Mock getting a call cycle by ID
    // This is a simplified implementation - in a real app, you'd search through your mock data
    return null;
  }
};