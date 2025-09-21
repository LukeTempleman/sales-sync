import { locations as mockLocations } from '../data/callCycles';

// Get all locations
export const getLocations = async (useRealApi = false) => {
  if (useRealApi) {
    try {
      // This would be an API call in a real implementation
      // For now, we'll just return the mock data
      return mockLocations;
    } catch (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }
  } else {
    // Use mock data
    return mockLocations;
  }
};

// Search locations by query
export const searchLocations = async (query, useRealApi = false) => {
  if (useRealApi) {
    try {
      // This would be an API call in a real implementation
      // For now, we'll filter the mock data
      return mockLocations.filter(location => 
        location.name.toLowerCase().includes(query.toLowerCase()) ||
        location.address.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching locations:', error);
      throw error;
    }
  } else {
    // Use mock data
    return mockLocations.filter(location => 
      location.name.toLowerCase().includes(query.toLowerCase()) ||
      location.address.toLowerCase().includes(query.toLowerCase())
    );
  }
};

// Get a single location by ID
export const getLocationById = async (id, useRealApi = false) => {
  if (useRealApi) {
    try {
      // This would be an API call in a real implementation
      // For now, we'll search the mock data
      return mockLocations.find(location => location.id === id) || null;
    } catch (error) {
      console.error('Error fetching location:', error);
      throw error;
    }
  } else {
    // Use mock data
    return mockLocations.find(location => location.id === id) || null;
  }
};