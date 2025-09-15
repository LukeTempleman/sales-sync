// Mock data for visits (both consumer and shop visits)
import { agents } from './users';
import { addDays, subDays, format } from 'date-fns';

// Visit types
export const VISIT_TYPES = {
  CONSUMER: 'consumer',
  SHOP: 'shop'
};

// Visit statuses
export const VISIT_STATUS = {
  COMPLETED: 'completed',
  PENDING: 'pending',
  CANCELLED: 'cancelled'
};

// Generate random date within the last 30 days
const getRandomDate = () => {
  const daysAgo = Math.floor(Math.random() * 30);
  return subDays(new Date(), daysAgo);
};

// Generate random geocode
const getRandomGeocode = () => {
  // Generate random latitude and longitude within South Africa
  const lat = -33.918861 + (Math.random() * 8);
  const lng = 18.423300 + (Math.random() * 10);
  return { lat, lng };
};

// Generate random boolean
const getRandomBoolean = () => Math.random() > 0.5;

// Generate random number between min and max
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate random element from array
const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

// Generate consumer visits
export const consumerVisits = Array.from({ length: 50 }, (_, index) => {
  const visitDate = getRandomDate();
  const agent = getRandomElement(agents);
  const geocode = getRandomGeocode();
  
  return {
    id: 1000 + index,
    type: VISIT_TYPES.CONSUMER,
    agentId: agent.id,
    date: visitDate,
    status: getRandomElement(Object.values(VISIT_STATUS)),
    geocode,
    consumerDetails: {
      name: `Consumer ${1000 + index}`,
      surname: `Surname ${1000 + index}`,
      idPhoto: `https://placehold.co/400x300/orange/white?text=ID+Photo+${1000 + index}`,
      cellNumber: `+27 ${getRandomNumber(700000000, 799999999)}`
    },
    brandQuestions: {
      infoShared: getRandomBoolean(),
      converted: getRandomBoolean(),
      voucherPurchased: getRandomBoolean(),
      otherPlatformsUsed: getRandomBoolean() ? ['Platform A', 'Platform B'] : ['Platform C'],
      goldrushComparison: getRandomElement(['Better', 'Same', 'Worse']),
      feedback: getRandomElement([
        'Great experience, very helpful',
        'Needs improvement in customer service',
        'Good products but expensive',
        'Excellent service and products',
        'Average experience overall'
      ])
    },
    notes: `Visit notes for consumer ${1000 + index}`,
    tenantId: agent.tenantId
  };
});

// Shop types
const SHOP_TYPES = ['Convenience Store', 'Supermarket', 'Pharmacy', 'Gas Station', 'Department Store'];

// Generate shop visits
export const shopVisits = Array.from({ length: 50 }, (_, index) => {
  const visitDate = getRandomDate();
  const agent = getRandomElement(agents);
  const geocode = getRandomGeocode();
  const shelfShare = getRandomNumber(10, 90);
  
  return {
    id: 2000 + index,
    type: VISIT_TYPES.SHOP,
    agentId: agent.id,
    date: visitDate,
    status: getRandomElement(Object.values(VISIT_STATUS)),
    geocode,
    shopDetails: {
      name: `Shop ${2000 + index}`,
      type: getRandomElement(SHOP_TYPES),
      address: `${getRandomNumber(1, 999)} Main Street, City ${getRandomNumber(1, 50)}`,
      contactPerson: `Manager ${2000 + index}`,
      contactNumber: `+27 ${getRandomNumber(800000000, 899999999)}`
    },
    awarenessQuestions: {
      knowsAboutBrand: getRandomBoolean(),
      stocksProduct: getRandomBoolean()
    },
    stockAndSales: {
      currentSales: getRandomNumber(1000, 50000),
      source: getRandomElement(['Wholesaler', 'Manufacturer', 'Distributor'])
    },
    competitorInfo: {
      productsStocked: getRandomBoolean() ? ['Competitor A', 'Competitor B'] : ['Competitor C'],
      prices: {
        'Competitor A': getRandomNumber(50, 200),
        'Competitor B': getRandomNumber(50, 200),
        'Competitor C': getRandomNumber(50, 200)
      },
      brands: getRandomBoolean() ? ['Brand X', 'Brand Y'] : ['Brand Z']
    },
    shelfAnalysis: {
      shelfPhoto: `https://placehold.co/600x400/blue/white?text=Shelf+Photo+${2000 + index}`,
      shelfShare: shelfShare,
      gridMarked: getRandomBoolean()
    },
    advertising: {
      exteriorPhoto: `https://placehold.co/600x400/green/white?text=Exterior+Photo+${2000 + index}`,
      boardPhoto: `https://placehold.co/600x400/red/white?text=Board+Photo+${2000 + index}`,
      competitorAdverts: getRandomBoolean() ? ['Advert A', 'Advert B'] : ['Advert C'],
      newBoardPlaced: getRandomBoolean()
    },
    training: {
      cashierTrained: getRandomBoolean(),
      infographicDisplayed: getRandomBoolean()
    },
    notes: `Visit notes for shop ${2000 + index}`,
    tenantId: agent.tenantId
  };
});

// All visits combined
export const allVisits = [...consumerVisits, ...shopVisits];

// Helper function to get visits by agent
export const getVisitsByAgent = (agentId) => {
  return allVisits.filter(visit => visit.agentId === agentId);
};

// Helper function to get visits by team
export const getVisitsByTeam = (teamId, agents) => {
  const teamAgentIds = agents.filter(agent => agent.teamId === teamId).map(agent => agent.id);
  return allVisits.filter(visit => teamAgentIds.includes(visit.agentId));
};

// Helper function to get visits by area
export const getVisitsByArea = (areaId, teams, agents) => {
  const areaTeamIds = teams.filter(team => team.areaId === areaId).map(team => team.id);
  const areaAgentIds = agents.filter(agent => areaTeamIds.includes(agent.teamId)).map(agent => agent.id);
  return allVisits.filter(visit => areaAgentIds.includes(visit.agentId));
};

// Helper function to get visits by region
export const getVisitsByRegion = (regionId, areas, teams, agents) => {
  const regionAreaIds = areas.filter(area => area.regionId === regionId).map(area => area.id);
  const regionTeamIds = teams.filter(team => regionAreaIds.includes(team.areaId)).map(team => team.id);
  const regionAgentIds = agents.filter(agent => regionTeamIds.includes(agent.teamId)).map(agent => agent.id);
  return allVisits.filter(visit => regionAgentIds.includes(visit.agentId));
};

// Helper function to get visits by tenant
export const getVisitsByTenant = (tenantId) => {
  return allVisits.filter(visit => visit.tenantId === tenantId);
};

// Helper function to get visits by date range
export const getVisitsByDateRange = (startDate, endDate, visits = allVisits) => {
  return visits.filter(visit => {
    const visitDate = new Date(visit.date);
    return visitDate >= startDate && visitDate <= endDate;
  });
};

// Helper function to get visits by type
export const getVisitsByType = (type, visits = allVisits) => {
  return visits.filter(visit => visit.type === type);
};

// Helper function to get visits by status
export const getVisitsByStatus = (status, visits = allVisits) => {
  return visits.filter(visit => visit.status === status);
};