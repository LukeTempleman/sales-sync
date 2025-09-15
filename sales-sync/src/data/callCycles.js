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

// For backward compatibility
export const CALL_CYCLE_FREQUENCY = CYCLE_FREQUENCIES;
export const CALL_CYCLE_STATUS = CYCLE_STATUS;

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

// Generate random locations with more realistic data
const generateLocations = (count) => {
  // South African cities and their approximate coordinates
  const cities = [
    { name: 'Cape Town', lat: -33.9249, lng: 18.4241 },
    { name: 'Johannesburg', lat: -26.2041, lng: 28.0473 },
    { name: 'Durban', lat: -29.8587, lng: 31.0218 },
    { name: 'Pretoria', lat: -25.7461, lng: 28.1881 },
    { name: 'Port Elizabeth', lat: -33.9608, lng: 25.6022 },
    { name: 'Bloemfontein', lat: -29.0852, lng: 26.1596 },
    { name: 'East London', lat: -33.0292, lng: 27.8546 },
    { name: 'Kimberley', lat: -28.7323, lng: 24.7623 },
    { name: 'Polokwane', lat: -23.9045, lng: 29.4688 },
    { name: 'Nelspruit', lat: -25.4753, lng: 30.9694 }
  ];
  
  // Street names
  const streetNames = [
    'Main Road', 'Church Street', 'Long Street', 'Adderley Street', 'Oxford Road',
    'Jan Smuts Avenue', 'Nelson Mandela Boulevard', 'Sandton Drive', 'Rivonia Road',
    'William Nicol Drive', 'Umhlanga Rocks Drive', 'Florida Road', 'Kloof Street',
    'Bree Street', 'Commissioner Street', 'West Street', 'Smith Street', 'Victoria Road'
  ];
  
  // Shop types
  const shopTypes = [
    'Convenience Store', 'Supermarket', 'Pharmacy', 'Liquor Store', 'Cafe',
    'Restaurant', 'Clothing Store', 'Electronics Shop', 'Hardware Store',
    'Bookstore', 'Bakery', 'Butchery', 'Spaza Shop', 'General Dealer'
  ];
  
  // Shop names
  const shopNames = [
    'Shoprite', 'Pick n Pay', 'Spar', 'Checkers', 'Woolworths', 'Game',
    'Clicks', 'Dis-Chem', 'Makro', 'OK Foods', 'U-Save', 'Boxer',
    'Cambridge Food', 'Food Lover\'s Market', 'Fruit & Veg City'
  ];
  
  // Mall names
  const mallNames = [
    'Sandton City', 'Canal Walk', 'Gateway', 'Menlyn Park', 'Eastgate',
    'V&A Waterfront', 'Mall of Africa', 'Pavilion', 'Cresta', 'Tyger Valley',
    'Brooklyn Mall', 'Clearwater Mall', 'Rosebank Mall', 'Cavendish Square'
  ];
  
  return Array.from({ length: count }, (_, index) => {
    const city = getRandomElement(cities);
    // Add some randomness to the coordinates to spread locations within the city
    const lat = city.lat + (Math.random() * 0.1 - 0.05);
    const lng = city.lng + (Math.random() * 0.1 - 0.05);
    
    const locationType = getRandomElement(['Shop', 'Consumer Area', 'Market', 'Mall']);
    let name, address;
    
    switch (locationType) {
      case 'Shop':
        name = `${getRandomElement(shopNames)} ${getRandomElement(shopTypes)}`;
        address = `${getRandomNumber(1, 999)} ${getRandomElement(streetNames)}, ${city.name}`;
        break;
      case 'Mall':
        name = getRandomElement(mallNames);
        address = `${getRandomElement(streetNames)}, ${city.name}`;
        break;
      case 'Market':
        name = `${city.name} ${['Farmers', 'Weekend', 'Central', 'Community'][Math.floor(Math.random() * 4)]} Market`;
        address = `${getRandomNumber(1, 999)} ${getRandomElement(streetNames)}, ${city.name}`;
        break;
      default: // Consumer Area
        name = `${city.name} ${['North', 'South', 'East', 'West', 'Central'][Math.floor(Math.random() * 5)]} Area`;
        address = `${city.name} ${['District', 'Zone', 'Suburb', 'Township'][Math.floor(Math.random() * 4)]}`;
    }
    
    return {
      id: 10000 + index,
      name,
      address,
      geocode: { lat, lng },
      type: locationType
    };
  });
};

// Generate random locations for each call cycle
const locations = generateLocations(100);

// Generate agent call cycles
// First, ensure each agent has at least one call cycle
const agentSpecificCycles = agents.map((agent, index) => {
  const frequency = getRandomElement(Object.values(CYCLE_FREQUENCIES));
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

// Then add some additional random call cycles
const additionalAgentCycles = Array.from({ length: 10 }, (_, index) => {
  const frequency = getRandomElement(Object.values(CYCLE_FREQUENCIES));
  const agent = getRandomElement(agents);
  const cycleLocations = Array.from({ length: getRandomNumber(3, 8) }, () => getRandomElement(locations));
  const adherenceRate = getRandomNumber(60, 100);
  
  return {
    id: 8500 + index,
    name: `${agent.name}'s additional ${frequency} cycle`,
    frequency,
    startDate: new Date(),
    endDate: getRandomFutureDate(frequency),
    assignedTo: agent.id,
    assignedBy: agent.teamId ? teams.find(t => t.id === agent.teamId)?.leaderId : null,
    locations: cycleLocations,
    adherenceRate,
    status: adherenceRate < 70 ? CYCLE_STATUS.PENDING : CYCLE_STATUS.ACTIVE,
    tenantId: agent.tenantId,
    notes: `Additional call cycle for ${agent.name} to visit ${cycleLocations.length} locations`
  };
});

// Combine both sets of call cycles
export const agentCallCycles = [...agentSpecificCycles, ...additionalAgentCycles];

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