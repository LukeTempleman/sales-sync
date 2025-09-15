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
export const agentGoals = Array.from({ length: 30 }, (_, index) => {
  const type = getRandomElement(Object.values(GOAL_TYPES));
  const metric = getRandomElement(Object.values(GOAL_METRICS));
  const agent = getRandomElement(agents);
  const progress = getRandomProgress();
  const status = progress === 100 
    ? GOAL_STATUS.COMPLETED 
    : progress === 0 
      ? GOAL_STATUS.PENDING 
      : GOAL_STATUS.IN_PROGRESS;
  
  return {
    id: 3000 + index,
    type,
    metric,
    target: getRandomNumber(5, 50),
    progress,
    status,
    startDate: new Date(),
    endDate: getRandomFutureDate(type),
    assignedTo: agent.id,
    assignedBy: agent.teamId ? teamLeaders.find(tl => tl.teamId === agent.teamId)?.id : null,
    tenantId: agent.tenantId,
    notes: `Goal for ${agent.name} to achieve ${metric} targets`
  };
});

// Generate team goals
export const teamGoals = Array.from({ length: 15 }, (_, index) => {
  const type = getRandomElement(Object.values(GOAL_TYPES));
  const metric = getRandomElement(Object.values(GOAL_METRICS));
  const teamLeader = getRandomElement(teamLeaders);
  const progress = getRandomProgress();
  const status = progress === 100 
    ? GOAL_STATUS.COMPLETED 
    : progress === 0 
      ? GOAL_STATUS.PENDING 
      : GOAL_STATUS.IN_PROGRESS;
  
  return {
    id: 4000 + index,
    type,
    metric,
    target: getRandomNumber(20, 100),
    progress,
    status,
    startDate: new Date(),
    endDate: getRandomFutureDate(type),
    assignedTo: teamLeader.id,
    assignedBy: teamLeader.areaId ? areaManagers.find(am => am.areaId === teamLeader.areaId)?.id : null,
    teamId: teamLeader.teamId,
    tenantId: teamLeader.tenantId,
    notes: `Team goal for ${teamLeader.name}'s team to achieve ${metric} targets`
  };
});

// Generate area goals
export const areaGoals = Array.from({ length: 10 }, (_, index) => {
  const type = getRandomElement(Object.values(GOAL_TYPES));
  const metric = getRandomElement(Object.values(GOAL_METRICS));
  const areaManager = getRandomElement(areaManagers);
  const progress = getRandomProgress();
  const status = progress === 100 
    ? GOAL_STATUS.COMPLETED 
    : progress === 0 
      ? GOAL_STATUS.PENDING 
      : GOAL_STATUS.IN_PROGRESS;
  
  return {
    id: 5000 + index,
    type,
    metric,
    target: getRandomNumber(50, 200),
    progress,
    status,
    startDate: new Date(),
    endDate: getRandomFutureDate(type),
    assignedTo: areaManager.id,
    assignedBy: areaManager.regionId ? regionalManagers.find(rm => rm.regionId === areaManager.regionId)?.id : null,
    areaId: areaManager.areaId,
    tenantId: areaManager.tenantId,
    notes: `Area goal for ${areaManager.name}'s area to achieve ${metric} targets`
  };
});

// Generate region goals
export const regionGoals = Array.from({ length: 6 }, (_, index) => {
  const type = getRandomElement(Object.values(GOAL_TYPES));
  const metric = getRandomElement(Object.values(GOAL_METRICS));
  const regionalManager = getRandomElement(regionalManagers);
  const progress = getRandomProgress();
  const status = progress === 100 
    ? GOAL_STATUS.COMPLETED 
    : progress === 0 
      ? GOAL_STATUS.PENDING 
      : GOAL_STATUS.IN_PROGRESS;
  
  return {
    id: 6000 + index,
    type,
    metric,
    target: getRandomNumber(100, 500),
    progress,
    status,
    startDate: new Date(),
    endDate: getRandomFutureDate(type),
    assignedTo: regionalManager.id,
    assignedBy: nationalManagers.find(nm => nm.tenantId === regionalManager.tenantId)?.id,
    regionId: regionalManager.regionId,
    tenantId: regionalManager.tenantId,
    notes: `Region goal for ${regionalManager.name}'s region to achieve ${metric} targets`
  };
});

// Generate national goals
export const nationalGoals = Array.from({ length: 3 }, (_, index) => {
  const type = getRandomElement(Object.values(GOAL_TYPES));
  const metric = getRandomElement(Object.values(GOAL_METRICS));
  const nationalManager = getRandomElement(nationalManagers);
  const progress = getRandomProgress();
  const status = progress === 100 
    ? GOAL_STATUS.COMPLETED 
    : progress === 0 
      ? GOAL_STATUS.PENDING 
      : GOAL_STATUS.IN_PROGRESS;
  
  return {
    id: 7000 + index,
    type,
    metric,
    target: getRandomNumber(500, 2000),
    progress,
    status,
    startDate: new Date(),
    endDate: getRandomFutureDate(type),
    assignedTo: nationalManager.id,
    assignedBy: null,
    tenantId: nationalManager.tenantId,
    notes: `National goal for ${nationalManager.name} to achieve ${metric} targets`
  };
});

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