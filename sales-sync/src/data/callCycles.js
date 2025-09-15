// Mock data for call cycles
import { agents, teams, areas, regions } from './users';
import { addDays, addWeeks, addMonths, format } from 'date-fns';

// Call cycle frequencies
export const CYCLE_FREQUENCIES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly'
};

// Call cycle statuses
export const CYCLE_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  PENDING: 'pending'
};

// Generate random date in the future
const getRandomFutureDate = (type) => {
  const today = new Date();
  switch (type) {
    case CYCLE_FREQUENCIES.DAILY:
      return addDays(today, Math.floor(Math.random() * 7));
    case CYCLE_FREQUENCIES.WEEKLY:
      return addWeeks(today, Math.floor(Math.random() * 4));
    case CYCLE_FREQUENCIES.MONTHLY:
      return addMonths(today, Math.floor(Math.random() * 3));
    default:
      return today;
  }
};

// Generate random number between min and max
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate random element from array
const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

// Generate random locations
const generateLocations = (count) => {
  return Array.from({ length: count }, (_, index) => {
    // Generate random latitude and longitude within South Africa
    const lat = -33.918861 + (Math.random() * 8);
    const lng = 18.423300 + (Math.random() * 10);
    
    return {
      id: 10000 + index,
      name: `Location ${10000 + index}`,
      address: `${getRandomNumber(1, 999)} Main Street, City ${getRandomNumber(1, 50)}`,
      geocode: { lat, lng },
      type: getRandomElement(['Shop', 'Consumer Area', 'Market', 'Mall'])
    };
  });
};

// Generate random locations for each call cycle
const locations = generateLocations(100);

// Generate agent call cycles
export const agentCallCycles = Array.from({ length: 20 }, (_, index) => {
  const frequency = getRandomElement(Object.values(CYCLE_FREQUENCIES));
  const agent = getRandomElement(agents);
  const cycleLocations = Array.from({ length: getRandomNumber(3, 8) }, () => getRandomElement(locations));
  const adherenceRate = getRandomNumber(60, 100);
  
  return {
    id: 8000 + index,
    name: `${agent.name}'s ${frequency} cycle`,
    frequency,
    startDate: new Date(),
    endDate: getRandomFutureDate(frequency),
    assignedTo: agent.id,
    assignedBy: agent.teamId ? teams.find(t => t.id === agent.teamId)?.leaderId : null,
    locations: cycleLocations,
    adherenceRate,
    status: adherenceRate < 70 ? CYCLE_STATUS.PENDING : CYCLE_STATUS.ACTIVE,
    tenantId: agent.tenantId,
    notes: `Call cycle for ${agent.name} to visit ${cycleLocations.length} locations`
  };
});

// Generate team call cycles
export const teamCallCycles = Array.from({ length: 10 }, (_, index) => {
  const frequency = getRandomElement(Object.values(CYCLE_FREQUENCIES));
  const team = getRandomElement(teams);
  const cycleLocations = Array.from({ length: getRandomNumber(10, 20) }, () => getRandomElement(locations));
  const adherenceRate = getRandomNumber(60, 100);
  
  return {
    id: 9000 + index,
    name: `${team.name} ${frequency} cycle`,
    frequency,
    startDate: new Date(),
    endDate: getRandomFutureDate(frequency),
    teamId: team.id,
    assignedBy: team.areaId ? areas.find(a => a.id === team.areaId)?.managerId : null,
    locations: cycleLocations,
    adherenceRate,
    status: adherenceRate < 70 ? CYCLE_STATUS.PENDING : CYCLE_STATUS.ACTIVE,
    tenantId: team.tenantId,
    notes: `Team call cycle for ${team.name} to cover ${cycleLocations.length} locations`
  };
});

// Generate area call cycles
export const areaCallCycles = Array.from({ length: 6 }, (_, index) => {
  const frequency = getRandomElement(Object.values(CYCLE_FREQUENCIES));
  const area = getRandomElement(areas);
  const cycleLocations = Array.from({ length: getRandomNumber(20, 40) }, () => getRandomElement(locations));
  const adherenceRate = getRandomNumber(60, 100);
  
  return {
    id: 10000 + index,
    name: `${area.name} ${frequency} cycle`,
    frequency,
    startDate: new Date(),
    endDate: getRandomFutureDate(frequency),
    areaId: area.id,
    assignedBy: area.regionId ? regions.find(r => r.id === area.regionId)?.managerId : null,
    locations: cycleLocations,
    adherenceRate,
    status: adherenceRate < 70 ? CYCLE_STATUS.PENDING : CYCLE_STATUS.ACTIVE,
    tenantId: area.tenantId,
    notes: `Area call cycle for ${area.name} to cover ${cycleLocations.length} locations`
  };
});

// Generate regional call cycles
export const regionalCallCycles = Array.from({ length: 3 }, (_, index) => {
  const frequency = getRandomElement(Object.values(CYCLE_FREQUENCIES));
  const region = getRandomElement(regions);
  const cycleLocations = Array.from({ length: getRandomNumber(40, 80) }, () => getRandomElement(locations));
  const adherenceRate = getRandomNumber(60, 100);
  
  return {
    id: 11000 + index,
    name: `${region.name} ${frequency} cycle`,
    frequency,
    startDate: new Date(),
    endDate: getRandomFutureDate(frequency),
    regionId: region.id,
    assignedBy: null,
    locations: cycleLocations,
    adherenceRate,
    status: adherenceRate < 70 ? CYCLE_STATUS.PENDING : CYCLE_STATUS.ACTIVE,
    tenantId: region.tenantId,
    notes: `Regional call cycle for ${region.name} to cover ${cycleLocations.length} locations`
  };
});

// All call cycles combined
export const allCallCycles = [
  ...agentCallCycles,
  ...teamCallCycles,
  ...areaCallCycles,
  ...regionalCallCycles
];

// Helper function to get call cycles by agent
export const getCallCyclesByAgent = (agentId) => {
  return agentCallCycles.filter(cycle => cycle.assignedTo === agentId);
};

// Helper function to get call cycles by team
export const getCallCyclesByTeam = (teamId) => {
  return teamCallCycles.filter(cycle => cycle.teamId === teamId);
};

// Helper function to get call cycles by area
export const getCallCyclesByArea = (areaId) => {
  return areaCallCycles.filter(cycle => cycle.areaId === areaId);
};

// Helper function to get call cycles by region
export const getCallCyclesByRegion = (regionId) => {
  return regionalCallCycles.filter(cycle => cycle.regionId === regionId);
};

// Helper function to get call cycles by tenant
export const getCallCyclesByTenant = (tenantId) => {
  return allCallCycles.filter(cycle => cycle.tenantId === tenantId);
};

// Helper function to get call cycles by frequency
export const getCallCyclesByFrequency = (frequency) => {
  return allCallCycles.filter(cycle => cycle.frequency === frequency);
};

// Helper function to get call cycles by status
export const getCallCyclesByStatus = (status) => {
  return allCallCycles.filter(cycle => cycle.status === status);
};

// Export locations for reuse
export { locations };