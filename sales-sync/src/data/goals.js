// Mock data for goals
import { agents, teamLeaders, areaManagers, regionalManagers, nationalManagers } from './users';
import { addDays, addWeeks, addMonths, format } from 'date-fns';

// Goal types
export const GOAL_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly'
};

// Goal metrics
export const GOAL_METRICS = {
  VISITS: 'visits',
  CONVERSIONS: 'conversions',
  SHELF_SHARE: 'shelf_share',
  SHOPS_TRAINED: 'shops_trained'
};

// Goal statuses
export const GOAL_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

// Generate random date in the future
const getRandomFutureDate = (type) => {
  const today = new Date();
  switch (type) {
    case GOAL_TYPES.DAILY:
      return addDays(today, Math.floor(Math.random() * 7));
    case GOAL_TYPES.WEEKLY:
      return addWeeks(today, Math.floor(Math.random() * 4));
    case GOAL_TYPES.MONTHLY:
      return addMonths(today, Math.floor(Math.random() * 3));
    case GOAL_TYPES.QUARTERLY:
      return addMonths(today, Math.floor(Math.random() * 3) + 3);
    default:
      return today;
  }
};

// Generate random number between min and max
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate random element from array
const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

// Generate random progress percentage
const getRandomProgress = () => getRandomNumber(0, 100);

// Generate agent goals
export const agentGoals = [
  // Daily goals
  ...agents.slice(0, 10).map((agent, index) => ({
    id: 3000 + index,
    type: GOAL_TYPES.DAILY,
    metric: GOAL_METRICS.VISITS,
    target: getRandomNumber(5, 15),
    progress: getRandomProgress(),
    status: getRandomElement(Object.values(GOAL_STATUS)),
    startDate: new Date(),
    endDate: addDays(new Date(), 1),
    assignedTo: agent.id,
    assignedBy: agent.teamId ? teamLeaders.find(tl => tl.teamId === agent.teamId)?.id : null,
    tenantId: agent.tenantId,
    notes: `Complete ${getRandomNumber(5, 15)} shop visits today in ${agent.area || 'your assigned area'}`
  })),
  
  // Weekly goals
  ...agents.slice(0, 8).map((agent, index) => ({
    id: 3100 + index,
    type: GOAL_TYPES.WEEKLY,
    metric: GOAL_METRICS.CONVERSIONS,
    target: getRandomNumber(10, 30),
    progress: getRandomProgress(),
    status: getRandomElement(Object.values(GOAL_STATUS)),
    startDate: new Date(),
    endDate: addWeeks(new Date(), 1),
    assignedTo: agent.id,
    assignedBy: agent.teamId ? teamLeaders.find(tl => tl.teamId === agent.teamId)?.id : null,
    tenantId: agent.tenantId,
    notes: `Convert ${getRandomNumber(10, 30)} consumers to our brand this week`
  })),
  
  // Monthly goals
  ...agents.slice(0, 6).map((agent, index) => ({
    id: 3200 + index,
    type: GOAL_TYPES.MONTHLY,
    metric: GOAL_METRICS.SHELF_SHARE,
    target: getRandomNumber(15, 30),
    progress: getRandomProgress(),
    status: getRandomElement(Object.values(GOAL_STATUS)),
    startDate: new Date(),
    endDate: addMonths(new Date(), 1),
    assignedTo: agent.id,
    assignedBy: agent.teamId ? teamLeaders.find(tl => tl.teamId === agent.teamId)?.id : null,
    tenantId: agent.tenantId,
    notes: `Increase shelf share by ${getRandomNumber(15, 30)}% in your assigned shops`
  })),
  
  // Quarterly goals
  ...agents.slice(0, 4).map((agent, index) => ({
    id: 3300 + index,
    type: GOAL_TYPES.QUARTERLY,
    metric: GOAL_METRICS.SHOPS_TRAINED,
    target: getRandomNumber(30, 60),
    progress: getRandomProgress(),
    status: getRandomElement(Object.values(GOAL_STATUS)),
    startDate: new Date(),
    endDate: addMonths(new Date(), 3),
    assignedTo: agent.id,
    assignedBy: agent.teamId ? teamLeaders.find(tl => tl.teamId === agent.teamId)?.id : null,
    tenantId: agent.tenantId,
    notes: `Train staff at ${getRandomNumber(30, 60)} shops on our new product line this quarter`
  }))
];

// Generate team goals
export const teamGoals = [
  // Weekly team goals
  ...teamLeaders.slice(0, 5).map((teamLeader, index) => ({
    id: 4000 + index,
    type: GOAL_TYPES.WEEKLY,
    metric: GOAL_METRICS.VISITS,
    target: getRandomNumber(50, 100),
    progress: getRandomProgress(),
    status: getRandomElement(Object.values(GOAL_STATUS)),
    startDate: new Date(),
    endDate: addWeeks(new Date(), 1),
    assignedTo: teamLeader.id,
    assignedBy: teamLeader.areaId ? areaManagers.find(am => am.areaId === teamLeader.areaId)?.id : null,
    teamId: teamLeader.teamId,
    tenantId: teamLeader.tenantId,
    notes: `Team ${teamLeader.teamId} to complete ${getRandomNumber(50, 100)} total shop visits this week`
  })),
  
  // Monthly team goals
  ...teamLeaders.slice(0, 4).map((teamLeader, index) => ({
    id: 4100 + index,
    type: GOAL_TYPES.MONTHLY,
    metric: GOAL_METRICS.CONVERSIONS,
    target: getRandomNumber(100, 200),
    progress: getRandomProgress(),
    status: getRandomElement(Object.values(GOAL_STATUS)),
    startDate: new Date(),
    endDate: addMonths(new Date(), 1),
    assignedTo: teamLeader.id,
    assignedBy: teamLeader.areaId ? areaManagers.find(am => am.areaId === teamLeader.areaId)?.id : null,
    teamId: teamLeader.teamId,
    tenantId: teamLeader.tenantId,
    notes: `Team ${teamLeader.teamId} to achieve ${getRandomNumber(100, 200)} consumer conversions this month`
  })),
  
  // Quarterly team goals
  ...teamLeaders.slice(0, 3).map((teamLeader, index) => ({
    id: 4200 + index,
    type: GOAL_TYPES.QUARTERLY,
    metric: GOAL_METRICS.SHELF_SHARE,
    target: getRandomNumber(20, 40),
    progress: getRandomProgress(),
    status: getRandomElement(Object.values(GOAL_STATUS)),
    startDate: new Date(),
    endDate: addMonths(new Date(), 3),
    assignedTo: teamLeader.id,
    assignedBy: teamLeader.areaId ? areaManagers.find(am => am.areaId === teamLeader.areaId)?.id : null,
    teamId: teamLeader.teamId,
    tenantId: teamLeader.tenantId,
    notes: `Team ${teamLeader.teamId} to increase average shelf share by ${getRandomNumber(20, 40)}% across all assigned shops`
  }))
];

// Generate area goals
export const areaGoals = [
  // Monthly area goals
  ...areaManagers.slice(0, 3).map((areaManager, index) => ({
    id: 5000 + index,
    type: GOAL_TYPES.MONTHLY,
    metric: GOAL_METRICS.VISITS,
    target: getRandomNumber(200, 500),
    progress: getRandomProgress(),
    status: getRandomElement(Object.values(GOAL_STATUS)),
    startDate: new Date(),
    endDate: addMonths(new Date(), 1),
    assignedTo: areaManager.id,
    assignedBy: areaManager.regionId ? regionalManagers.find(rm => rm.regionId === areaManager.regionId)?.id : null,
    areaId: areaManager.areaId,
    tenantId: areaManager.tenantId,
    notes: `Area ${areaManager.areaId} to complete ${getRandomNumber(200, 500)} total shop visits this month`
  })),
  
  // Monthly area conversion goals
  ...areaManagers.slice(0, 3).map((areaManager, index) => ({
    id: 5100 + index,
    type: GOAL_TYPES.MONTHLY,
    metric: GOAL_METRICS.CONVERSIONS,
    target: getRandomNumber(300, 600),
    progress: getRandomProgress(),
    status: getRandomElement(Object.values(GOAL_STATUS)),
    startDate: new Date(),
    endDate: addMonths(new Date(), 1),
    assignedTo: areaManager.id,
    assignedBy: areaManager.regionId ? regionalManagers.find(rm => rm.regionId === areaManager.regionId)?.id : null,
    areaId: areaManager.areaId,
    tenantId: areaManager.tenantId,
    notes: `Area ${areaManager.areaId} to achieve ${getRandomNumber(300, 600)} consumer conversions this month`
  })),
  
  // Quarterly area goals
  ...areaManagers.slice(0, 2).map((areaManager, index) => ({
    id: 5200 + index,
    type: GOAL_TYPES.QUARTERLY,
    metric: GOAL_METRICS.SHELF_SHARE,
    target: getRandomNumber(25, 45),
    progress: getRandomProgress(),
    status: getRandomElement(Object.values(GOAL_STATUS)),
    startDate: new Date(),
    endDate: addMonths(new Date(), 3),
    assignedTo: areaManager.id,
    assignedBy: areaManager.regionId ? regionalManagers.find(rm => rm.regionId === areaManager.regionId)?.id : null,
    areaId: areaManager.areaId,
    tenantId: areaManager.tenantId,
    notes: `Area ${areaManager.areaId} to increase average shelf share by ${getRandomNumber(25, 45)}% across all shops`
  })),
  
  // Quarterly area training goals
  ...areaManagers.slice(0, 2).map((areaManager, index) => ({
    id: 5300 + index,
    type: GOAL_TYPES.QUARTERLY,
    metric: GOAL_METRICS.SHOPS_TRAINED,
    target: getRandomNumber(100, 200),
    progress: getRandomProgress(),
    status: getRandomElement(Object.values(GOAL_STATUS)),
    startDate: new Date(),
    endDate: addMonths(new Date(), 3),
    assignedTo: areaManager.id,
    assignedBy: areaManager.regionId ? regionalManagers.find(rm => rm.regionId === areaManager.regionId)?.id : null,
    areaId: areaManager.areaId,
    tenantId: areaManager.tenantId,
    notes: `Area ${areaManager.areaId} to train staff at ${getRandomNumber(100, 200)} shops on our new product line`
  }))
];

// Generate region goals
export const regionGoals = [
  // Monthly region visit goals
  ...regionalManagers.slice(0, 2).map((regionalManager, index) => ({
    id: 6000 + index,
    type: GOAL_TYPES.MONTHLY,
    metric: GOAL_METRICS.VISITS,
    target: getRandomNumber(1000, 2000),
    progress: getRandomProgress(),
    status: getRandomElement(Object.values(GOAL_STATUS)),
    startDate: new Date(),
    endDate: addMonths(new Date(), 1),
    assignedTo: regionalManager.id,
    assignedBy: nationalManagers.find(nm => nm.tenantId === regionalManager.tenantId)?.id,
    regionId: regionalManager.regionId,
    tenantId: regionalManager.tenantId,
    notes: `Region ${regionalManager.regionId} to complete ${getRandomNumber(1000, 2000)} total shop visits this month`
  })),
  
  // Monthly region conversion goals
  ...regionalManagers.slice(0, 2).map((regionalManager, index) => ({
    id: 6100 + index,
    type: GOAL_TYPES.MONTHLY,
    metric: GOAL_METRICS.CONVERSIONS,
    target: getRandomNumber(800, 1500),
    progress: getRandomProgress(),
    status: getRandomElement(Object.values(GOAL_STATUS)),
    startDate: new Date(),
    endDate: addMonths(new Date(), 1),
    assignedTo: regionalManager.id,
    assignedBy: nationalManagers.find(nm => nm.tenantId === regionalManager.tenantId)?.id,
    regionId: regionalManager.regionId,
    tenantId: regionalManager.tenantId,
    notes: `Region ${regionalManager.regionId} to achieve ${getRandomNumber(800, 1500)} consumer conversions this month`
  })),
  
  // Quarterly region shelf share goals
  ...regionalManagers.slice(0, 2).map((regionalManager, index) => ({
    id: 6200 + index,
    type: GOAL_TYPES.QUARTERLY,
    metric: GOAL_METRICS.SHELF_SHARE,
    target: getRandomNumber(30, 50),
    progress: getRandomProgress(),
    status: getRandomElement(Object.values(GOAL_STATUS)),
    startDate: new Date(),
    endDate: addMonths(new Date(), 3),
    assignedTo: regionalManager.id,
    assignedBy: nationalManagers.find(nm => nm.tenantId === regionalManager.tenantId)?.id,
    regionId: regionalManager.regionId,
    tenantId: regionalManager.tenantId,
    notes: `Region ${regionalManager.regionId} to increase average shelf share by ${getRandomNumber(30, 50)}% across all areas`
  }))
];

// Generate national goals
export const nationalGoals = [
  // Monthly national visit goals
  ...nationalManagers.slice(0, 1).map((nationalManager, index) => ({
    id: 7000 + index,
    type: GOAL_TYPES.MONTHLY,
    metric: GOAL_METRICS.VISITS,
    target: getRandomNumber(5000, 10000),
    progress: getRandomProgress(),
    status: getRandomElement(Object.values(GOAL_STATUS)),
    startDate: new Date(),
    endDate: addMonths(new Date(), 1),
    assignedTo: nationalManager.id,
    assignedBy: null,
    tenantId: nationalManager.tenantId,
    notes: `National target to complete ${getRandomNumber(5000, 10000)} total shop visits this month across all regions`
  })),
  
  // Monthly national conversion goals
  ...nationalManagers.slice(0, 1).map((nationalManager, index) => ({
    id: 7100 + index,
    type: GOAL_TYPES.MONTHLY,
    metric: GOAL_METRICS.CONVERSIONS,
    target: getRandomNumber(3000, 6000),
    progress: getRandomProgress(),
    status: getRandomElement(Object.values(GOAL_STATUS)),
    startDate: new Date(),
    endDate: addMonths(new Date(), 1),
    assignedTo: nationalManager.id,
    assignedBy: null,
    tenantId: nationalManager.tenantId,
    notes: `National target to achieve ${getRandomNumber(3000, 6000)} consumer conversions this month across all regions`
  })),
  
  // Quarterly national shelf share goals
  ...nationalManagers.slice(0, 1).map((nationalManager, index) => ({
    id: 7200 + index,
    type: GOAL_TYPES.QUARTERLY,
    metric: GOAL_METRICS.SHELF_SHARE,
    target: getRandomNumber(35, 55),
    progress: getRandomProgress(),
    status: getRandomElement(Object.values(GOAL_STATUS)),
    startDate: new Date(),
    endDate: addMonths(new Date(), 3),
    assignedTo: nationalManager.id,
    assignedBy: null,
    tenantId: nationalManager.tenantId,
    notes: `National target to increase average shelf share by ${getRandomNumber(35, 55)}% across all regions`
  })),
  
  // Quarterly national training goals
  ...nationalManagers.slice(0, 1).map((nationalManager, index) => ({
    id: 7300 + index,
    type: GOAL_TYPES.QUARTERLY,
    metric: GOAL_METRICS.SHOPS_TRAINED,
    target: getRandomNumber(1000, 2000),
    progress: getRandomProgress(),
    status: getRandomElement(Object.values(GOAL_STATUS)),
    startDate: new Date(),
    endDate: addMonths(new Date(), 3),
    assignedTo: nationalManager.id,
    assignedBy: null,
    tenantId: nationalManager.tenantId,
    notes: `National target to train staff at ${getRandomNumber(1000, 2000)} shops on our new product line this quarter`
  }))
];

// All goals combined
export const allGoals = [
  ...agentGoals,
  ...teamGoals,
  ...areaGoals,
  ...regionGoals,
  ...nationalGoals
];

// Helper function to get goals by user
export const getGoalsByUser = (userId) => {
  return allGoals.filter(goal => goal.assignedTo === userId);
};

// Helper function to get goals by team
export const getGoalsByTeam = (teamId) => {
  return allGoals.filter(goal => goal.teamId === teamId);
};

// Helper function to get goals by area
export const getGoalsByArea = (areaId) => {
  return allGoals.filter(goal => goal.areaId === areaId);
};

// Helper function to get goals by region
export const getGoalsByRegion = (regionId) => {
  return allGoals.filter(goal => goal.regionId === regionId);
};

// Helper function to get goals by tenant
export const getGoalsByTenant = (tenantId) => {
  return allGoals.filter(goal => goal.tenantId === tenantId);
};

// Helper function to get goals by type
export const getGoalsByType = (type) => {
  return allGoals.filter(goal => goal.type === type);
};

// Helper function to get goals by metric
export const getGoalsByMetric = (metric) => {
  return allGoals.filter(goal => goal.metric === metric);
};

// Helper function to get goals by status
export const getGoalsByStatus = (status) => {
  return allGoals.filter(goal => goal.status === status);
};