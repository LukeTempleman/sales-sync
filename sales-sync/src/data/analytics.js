// Mock data for analytics
import { agents, teamLeaders, areaManagers, regionalManagers, nationalManagers, teams, areas, regions } from './users';
import { allVisits, VISIT_TYPES, VISIT_STATUS } from './visits';
import { allGoals, GOAL_METRICS, GOAL_STATUS } from './goals';
import { allCallCycles, CYCLE_STATUS } from './callCycles';
import { subDays, subMonths, format, isWithinInterval } from 'date-fns';

// Generate random number between min and max
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate random percentage
const getRandomPercentage = () => getRandomNumber(30, 95);

// Generate random growth rate
const getRandomGrowthRate = () => getRandomNumber(-20, 50);

// Generate time periods
const today = new Date();
const periods = {
  daily: Array.from({ length: 7 }, (_, i) => {
    const date = subDays(today, i);
    return format(date, 'yyyy-MM-dd');
  }).reverse(),
  weekly: Array.from({ length: 4 }, (_, i) => {
    const date = subDays(today, i * 7);
    return `Week ${4 - i}`;
  }),
  monthly: Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(today, i);
    return format(date, 'MMM yyyy');
  }).reverse()
};

// Generate KPI data for agents
export const agentKPIs = agents.map(agent => {
  const visits = allVisits.filter(visit => visit.agentId === agent.id);
  const consumerVisits = visits.filter(visit => visit.type === VISIT_TYPES.CONSUMER);
  const shopVisits = visits.filter(visit => visit.type === VISIT_TYPES.SHOP);
  const completedVisits = visits.filter(visit => visit.status === VISIT_STATUS.COMPLETED);
  const conversions = consumerVisits.filter(visit => visit.brandQuestions.converted).length;
  
  const goals = allGoals.filter(goal => goal.assignedTo === agent.id);
  const completedGoals = goals.filter(goal => goal.status === GOAL_STATUS.COMPLETED);
  
  const callCycles = allCallCycles.filter(cycle => cycle.assignedTo === agent.id);
  const activeCallCycles = callCycles.filter(cycle => cycle.status === CYCLE_STATUS.ACTIVE);
  
  return {
    agentId: agent.id,
    name: agent.name,
    teamId: agent.teamId,
    tenantId: agent.tenantId,
    totalVisits: visits.length,
    consumerVisits: consumerVisits.length,
    shopVisits: shopVisits.length,
    completedVisits: completedVisits.length,
    completionRate: visits.length > 0 ? (completedVisits.length / visits.length) * 100 : 0,
    conversions,
    conversionRate: consumerVisits.length > 0 ? (conversions / consumerVisits.length) * 100 : 0,
    goalsAssigned: goals.length,
    goalsCompleted: completedGoals.length,
    goalCompletionRate: goals.length > 0 ? (completedGoals.length / goals.length) * 100 : 0,
    callCyclesAssigned: callCycles.length,
    callCyclesActive: activeCallCycles.length,
    averageAdherenceRate: callCycles.length > 0 ? callCycles.reduce((sum, cycle) => sum + cycle.adherenceRate, 0) / callCycles.length : 0,
    shelfShareContribution: getRandomPercentage(),
    visitTrend: {
      periods: periods.daily,
      data: periods.daily.map(() => getRandomNumber(1, 10))
    },
    conversionTrend: {
      periods: periods.daily,
      data: periods.daily.map(() => getRandomNumber(0, 5))
    }
  };
});

// Generate KPI data for teams
export const teamKPIs = teams.map(team => {
  const teamAgents = agents.filter(agent => agent.teamId === team.id);
  const teamAgentIds = teamAgents.map(agent => agent.id);
  
  const visits = allVisits.filter(visit => teamAgentIds.includes(visit.agentId));
  const consumerVisits = visits.filter(visit => visit.type === VISIT_TYPES.CONSUMER);
  const shopVisits = visits.filter(visit => visit.type === VISIT_TYPES.SHOP);
  const completedVisits = visits.filter(visit => visit.status === VISIT_STATUS.COMPLETED);
  const conversions = consumerVisits.filter(visit => visit.brandQuestions.converted).length;
  
  const goals = allGoals.filter(goal => goal.teamId === team.id || teamAgentIds.includes(goal.assignedTo));
  const completedGoals = goals.filter(goal => goal.status === GOAL_STATUS.COMPLETED);
  
  const callCycles = allCallCycles.filter(cycle => cycle.teamId === team.id || teamAgentIds.includes(cycle.assignedTo));
  const activeCallCycles = callCycles.filter(cycle => cycle.status === CYCLE_STATUS.ACTIVE);
  
  return {
    teamId: team.id,
    name: team.name,
    leaderId: team.leaderId,
    areaId: team.areaId,
    tenantId: team.tenantId,
    agentCount: teamAgents.length,
    totalVisits: visits.length,
    visitsPerAgent: teamAgents.length > 0 ? visits.length / teamAgents.length : 0,
    consumerVisits: consumerVisits.length,
    shopVisits: shopVisits.length,
    completedVisits: completedVisits.length,
    completionRate: visits.length > 0 ? (completedVisits.length / visits.length) * 100 : 0,
    conversions,
    conversionRate: consumerVisits.length > 0 ? (conversions / consumerVisits.length) * 100 : 0,
    goalsAssigned: goals.length,
    goalsCompleted: completedGoals.length,
    goalCompletionRate: goals.length > 0 ? (completedGoals.length / goals.length) * 100 : 0,
    callCyclesAssigned: callCycles.length,
    callCyclesActive: activeCallCycles.length,
    averageAdherenceRate: callCycles.length > 0 ? callCycles.reduce((sum, cycle) => sum + cycle.adherenceRate, 0) / callCycles.length : 0,
    averageShelfShare: getRandomPercentage(),
    visitTrend: {
      periods: periods.weekly,
      data: periods.weekly.map(() => getRandomNumber(10, 50))
    },
    conversionTrend: {
      periods: periods.weekly,
      data: periods.weekly.map(() => getRandomNumber(5, 25))
    },
    performanceByAgent: teamAgents.map(agent => {
      const agentVisits = visits.filter(visit => visit.agentId === agent.id);
      return {
        agentId: agent.id,
        name: agent.name,
        visits: agentVisits.length,
        conversions: agentVisits.filter(visit => visit.type === VISIT_TYPES.CONSUMER && visit.brandQuestions.converted).length,
        adherenceRate: getRandomPercentage()
      };
    })
  };
});

// Generate KPI data for areas
export const areaKPIs = areas.map(area => {
  const areaTeams = teams.filter(team => team.areaId === area.id);
  const areaTeamIds = areaTeams.map(team => team.id);
  
  const teamAgents = agents.filter(agent => areaTeamIds.includes(agent.teamId));
  const teamAgentIds = teamAgents.map(agent => agent.id);
  
  const visits = allVisits.filter(visit => teamAgentIds.includes(visit.agentId));
  const consumerVisits = visits.filter(visit => visit.type === VISIT_TYPES.CONSUMER);
  const shopVisits = visits.filter(visit => visit.type === VISIT_TYPES.SHOP);
  const completedVisits = visits.filter(visit => visit.status === VISIT_STATUS.COMPLETED);
  const conversions = consumerVisits.filter(visit => visit.brandQuestions.converted).length;
  
  const goals = allGoals.filter(goal => 
    goal.areaId === area.id || 
    areaTeamIds.includes(goal.teamId) || 
    teamAgentIds.includes(goal.assignedTo)
  );
  const completedGoals = goals.filter(goal => goal.status === GOAL_STATUS.COMPLETED);
  
  const callCycles = allCallCycles.filter(cycle => 
    cycle.areaId === area.id || 
    areaTeamIds.includes(cycle.teamId) || 
    teamAgentIds.includes(cycle.assignedTo)
  );
  const activeCallCycles = callCycles.filter(cycle => cycle.status === CYCLE_STATUS.ACTIVE);
  
  return {
    areaId: area.id,
    name: area.name,
    managerId: area.managerId,
    regionId: area.regionId,
    tenantId: area.tenantId,
    teamCount: areaTeams.length,
    agentCount: teamAgents.length,
    totalVisits: visits.length,
    visitsPerTeam: areaTeams.length > 0 ? visits.length / areaTeams.length : 0,
    visitsPerAgent: teamAgents.length > 0 ? visits.length / teamAgents.length : 0,
    consumerVisits: consumerVisits.length,
    shopVisits: shopVisits.length,
    completedVisits: completedVisits.length,
    completionRate: visits.length > 0 ? (completedVisits.length / visits.length) * 100 : 0,
    conversions,
    conversionRate: consumerVisits.length > 0 ? (conversions / consumerVisits.length) * 100 : 0,
    goalsAssigned: goals.length,
    goalsCompleted: completedGoals.length,
    goalCompletionRate: goals.length > 0 ? (completedGoals.length / goals.length) * 100 : 0,
    callCyclesAssigned: callCycles.length,
    callCyclesActive: activeCallCycles.length,
    averageAdherenceRate: callCycles.length > 0 ? callCycles.reduce((sum, cycle) => sum + cycle.adherenceRate, 0) / callCycles.length : 0,
    averageShelfShare: getRandomPercentage(),
    visitTrend: {
      periods: periods.weekly,
      data: periods.weekly.map(() => getRandomNumber(50, 200))
    },
    conversionTrend: {
      periods: periods.weekly,
      data: periods.weekly.map(() => getRandomNumber(25, 100))
    },
    performanceByTeam: areaTeams.map(team => {
      const teamVisits = visits.filter(visit => {
        const visitAgent = agents.find(agent => agent.id === visit.agentId);
        return visitAgent && visitAgent.teamId === team.id;
      });
      return {
        teamId: team.id,
        name: team.name,
        visits: teamVisits.length,
        conversions: teamVisits.filter(visit => visit.type === VISIT_TYPES.CONSUMER && visit.brandQuestions.converted).length,
        adherenceRate: getRandomPercentage()
      };
    })
  };
});

// Generate KPI data for regions
export const regionKPIs = regions.map(region => {
  const regionAreas = areas.filter(area => area.regionId === region.id);
  const regionAreaIds = regionAreas.map(area => area.id);
  
  const areaTeams = teams.filter(team => regionAreaIds.includes(team.areaId));
  const areaTeamIds = areaTeams.map(team => team.id);
  
  const teamAgents = agents.filter(agent => areaTeamIds.includes(agent.teamId));
  const teamAgentIds = teamAgents.map(agent => agent.id);
  
  const visits = allVisits.filter(visit => teamAgentIds.includes(visit.agentId));
  const consumerVisits = visits.filter(visit => visit.type === VISIT_TYPES.CONSUMER);
  const shopVisits = visits.filter(visit => visit.type === VISIT_TYPES.SHOP);
  const completedVisits = visits.filter(visit => visit.status === VISIT_STATUS.COMPLETED);
  const conversions = consumerVisits.filter(visit => visit.brandQuestions.converted).length;
  
  const goals = allGoals.filter(goal => 
    goal.regionId === region.id || 
    regionAreaIds.includes(goal.areaId) || 
    areaTeamIds.includes(goal.teamId) || 
    teamAgentIds.includes(goal.assignedTo)
  );
  const completedGoals = goals.filter(goal => goal.status === GOAL_STATUS.COMPLETED);
  
  const callCycles = allCallCycles.filter(cycle => 
    cycle.regionId === region.id || 
    regionAreaIds.includes(cycle.areaId) || 
    areaTeamIds.includes(cycle.teamId) || 
    teamAgentIds.includes(cycle.assignedTo)
  );
  const activeCallCycles = callCycles.filter(cycle => cycle.status === CYCLE_STATUS.ACTIVE);
  
  return {
    regionId: region.id,
    name: region.name,
    managerId: region.managerId,
    tenantId: region.tenantId,
    areaCount: regionAreas.length,
    teamCount: areaTeams.length,
    agentCount: teamAgents.length,
    totalVisits: visits.length,
    visitsPerArea: regionAreas.length > 0 ? visits.length / regionAreas.length : 0,
    visitsPerTeam: areaTeams.length > 0 ? visits.length / areaTeams.length : 0,
    visitsPerAgent: teamAgents.length > 0 ? visits.length / teamAgents.length : 0,
    consumerVisits: consumerVisits.length,
    shopVisits: shopVisits.length,
    completedVisits: completedVisits.length,
    completionRate: visits.length > 0 ? (completedVisits.length / visits.length) * 100 : 0,
    conversions,
    conversionRate: consumerVisits.length > 0 ? (conversions / consumerVisits.length) * 100 : 0,
    goalsAssigned: goals.length,
    goalsCompleted: completedGoals.length,
    goalCompletionRate: goals.length > 0 ? (completedGoals.length / goals.length) * 100 : 0,
    callCyclesAssigned: callCycles.length,
    callCyclesActive: activeCallCycles.length,
    averageAdherenceRate: callCycles.length > 0 ? callCycles.reduce((sum, cycle) => sum + cycle.adherenceRate, 0) / callCycles.length : 0,
    averageShelfShare: getRandomPercentage(),
    visitTrend: {
      periods: periods.monthly,
      data: periods.monthly.map(() => getRandomNumber(200, 800))
    },
    conversionTrend: {
      periods: periods.monthly,
      data: periods.monthly.map(() => getRandomNumber(100, 400))
    },
    performanceByArea: regionAreas.map(area => {
      const areaVisits = visits.filter(visit => {
        const visitAgent = agents.find(agent => agent.id === visit.agentId);
        const visitTeam = teams.find(team => team.id === visitAgent?.teamId);
        return visitTeam && visitTeam.areaId === area.id;
      });
      return {
        areaId: area.id,
        name: area.name,
        visits: areaVisits.length,
        conversions: areaVisits.filter(visit => visit.type === VISIT_TYPES.CONSUMER && visit.brandQuestions.converted).length,
        adherenceRate: getRandomPercentage()
      };
    })
  };
});

// Generate KPI data for national level
export const nationalKPIs = nationalManagers.map(manager => {
  const tenantRegions = regions.filter(region => region.tenantId === manager.tenantId);
  const tenantRegionIds = tenantRegions.map(region => region.id);
  
  const regionAreas = areas.filter(area => tenantRegionIds.includes(area.regionId));
  const regionAreaIds = regionAreas.map(area => area.id);
  
  const areaTeams = teams.filter(team => regionAreaIds.includes(team.areaId));
  const areaTeamIds = areaTeams.map(team => team.id);
  
  const teamAgents = agents.filter(agent => areaTeamIds.includes(agent.teamId));
  const teamAgentIds = teamAgents.map(agent => agent.id);
  
  const visits = allVisits.filter(visit => teamAgentIds.includes(visit.agentId));
  const consumerVisits = visits.filter(visit => visit.type === VISIT_TYPES.CONSUMER);
  const shopVisits = visits.filter(visit => visit.type === VISIT_TYPES.SHOP);
  const completedVisits = visits.filter(visit => visit.status === VISIT_STATUS.COMPLETED);
  const conversions = consumerVisits.filter(visit => visit.brandQuestions.converted).length;
  
  const goals = allGoals.filter(goal => goal.tenantId === manager.tenantId);
  const completedGoals = goals.filter(goal => goal.status === GOAL_STATUS.COMPLETED);
  
  const callCycles = allCallCycles.filter(cycle => cycle.tenantId === manager.tenantId);
  const activeCallCycles = callCycles.filter(cycle => cycle.status === CYCLE_STATUS.ACTIVE);
  
  return {
    managerId: manager.id,
    name: manager.name,
    tenantId: manager.tenantId,
    regionCount: tenantRegions.length,
    areaCount: regionAreas.length,
    teamCount: areaTeams.length,
    agentCount: teamAgents.length,
    totalVisits: visits.length,
    visitsPerRegion: tenantRegions.length > 0 ? visits.length / tenantRegions.length : 0,
    visitsPerArea: regionAreas.length > 0 ? visits.length / regionAreas.length : 0,
    visitsPerTeam: areaTeams.length > 0 ? visits.length / areaTeams.length : 0,
    visitsPerAgent: teamAgents.length > 0 ? visits.length / teamAgents.length : 0,
    consumerVisits: consumerVisits.length,
    shopVisits: shopVisits.length,
    completedVisits: completedVisits.length,
    completionRate: visits.length > 0 ? (completedVisits.length / visits.length) * 100 : 0,
    conversions,
    conversionRate: consumerVisits.length > 0 ? (conversions / consumerVisits.length) * 100 : 0,
    goalsAssigned: goals.length,
    goalsCompleted: completedGoals.length,
    goalCompletionRate: goals.length > 0 ? (completedGoals.length / goals.length) * 100 : 0,
    callCyclesAssigned: callCycles.length,
    callCyclesActive: activeCallCycles.length,
    averageAdherenceRate: callCycles.length > 0 ? callCycles.reduce((sum, cycle) => sum + cycle.adherenceRate, 0) / callCycles.length : 0,
    averageShelfShare: getRandomPercentage(),
    growthRate: getRandomGrowthRate(),
    visitTrend: {
      periods: periods.monthly,
      data: periods.monthly.map(() => getRandomNumber(500, 2000))
    },
    conversionTrend: {
      periods: periods.monthly,
      data: periods.monthly.map(() => getRandomNumber(250, 1000))
    },
    performanceByRegion: tenantRegions.map(region => {
      const regionVisits = visits.filter(visit => {
        const visitAgent = agents.find(agent => agent.id === visit.agentId);
        const visitTeam = teams.find(team => team.id === visitAgent?.teamId);
        const visitArea = areas.find(area => area.id === visitTeam?.areaId);
        return visitArea && visitArea.regionId === region.id;
      });
      return {
        regionId: region.id,
        name: region.name,
        visits: regionVisits.length,
        conversions: regionVisits.filter(visit => visit.type === VISIT_TYPES.CONSUMER && visit.brandQuestions.converted).length,
        adherenceRate: getRandomPercentage()
      };
    })
  };
});

// Generate system-wide analytics for admins
export const systemAnalytics = Array.from({ length: 3 }, (_, index) => {
  const tenantId = index + 1;
  const tenantVisits = allVisits.filter(visit => visit.tenantId === tenantId);
  const tenantGoals = allGoals.filter(goal => goal.tenantId === tenantId);
  const tenantCallCycles = allCallCycles.filter(cycle => cycle.tenantId === tenantId);
  
  const tenantAgents = agents.filter(agent => agent.tenantId === tenantId);
  const tenantTeamLeaders = teamLeaders.filter(tl => tl.tenantId === tenantId);
  const tenantAreaManagers = areaManagers.filter(am => am.tenantId === tenantId);
  const tenantRegionalManagers = regionalManagers.filter(rm => rm.tenantId === tenantId);
  
  return {
    tenantId,
    userCounts: {
      agents: tenantAgents.length,
      teamLeaders: tenantTeamLeaders.length,
      areaManagers: tenantAreaManagers.length,
      regionalManagers: tenantRegionalManagers.length,
      nationalManagers: 1
    },
    visitCounts: {
      total: tenantVisits.length,
      consumer: tenantVisits.filter(visit => visit.type === VISIT_TYPES.CONSUMER).length,
      shop: tenantVisits.filter(visit => visit.type === VISIT_TYPES.SHOP).length,
      completed: tenantVisits.filter(visit => visit.status === VISIT_STATUS.COMPLETED).length,
      pending: tenantVisits.filter(visit => visit.status === VISIT_STATUS.PENDING).length,
      cancelled: tenantVisits.filter(visit => visit.status === VISIT_STATUS.CANCELLED).length
    },
    goalCounts: {
      total: tenantGoals.length,
      completed: tenantGoals.filter(goal => goal.status === GOAL_STATUS.COMPLETED).length,
      inProgress: tenantGoals.filter(goal => goal.status === GOAL_STATUS.IN_PROGRESS).length,
      pending: tenantGoals.filter(goal => goal.status === GOAL_STATUS.PENDING).length,
      failed: tenantGoals.filter(goal => goal.status === GOAL_STATUS.FAILED).length
    },
    callCycleCounts: {
      total: tenantCallCycles.length,
      active: tenantCallCycles.filter(cycle => cycle.status === CYCLE_STATUS.ACTIVE).length,
      completed: tenantCallCycles.filter(cycle => cycle.status === CYCLE_STATUS.COMPLETED).length,
      pending: tenantCallCycles.filter(cycle => cycle.status === CYCLE_STATUS.PENDING).length
    },
    systemUsage: {
      activeUsers: getRandomNumber(tenantAgents.length * 0.7, tenantAgents.length),
      averageSessionDuration: getRandomNumber(15, 60),
      mobileUsage: getRandomPercentage(),
      webUsage: 100 - getRandomPercentage()
    },
    surveyCompletion: {
      averageCompletionTime: getRandomNumber(5, 15),
      completionRate: getRandomPercentage(),
      photoUploadSuccess: getRandomPercentage()
    },
    usageTrend: {
      periods: periods.monthly,
      data: periods.monthly.map(() => getRandomNumber(500, 2000))
    },
    userActivity: {
      periods: periods.daily,
      data: periods.daily.map(() => getRandomNumber(50, 200))
    },
    surveyCompletion: {
      periods: periods.daily,
      data: periods.daily.map(() => getRandomNumber(30, 150))
    },
    activeUsers: getRandomNumber(500, 1000),
    activeUsersTrend: {
      change: getRandomNumber(-5, 15)
    },
    surveysCompleted: getRandomNumber(1000, 5000),
    surveyCompletionTrend: {
      change: getRandomNumber(-5, 15)
    },
    systemUptime: getRandomNumber(98, 100),
    apiResponseTime: getRandomNumber(50, 200),
    cpuUsage: getRandomNumber(20, 80),
    memoryUsage: getRandomNumber(30, 90),
    diskUsage: getRandomNumber(40, 85)
  };
});

// Helper functions to get analytics by user role and ID
export const getAgentAnalytics = (agentId) => {
  return agentKPIs.find(kpi => kpi.agentId === agentId);
};

export const getTeamAnalytics = (teamId) => {
  return teamKPIs.find(kpi => kpi.teamId === teamId);
};

export const getAreaAnalytics = (areaId) => {
  return areaKPIs.find(kpi => kpi.areaId === areaId);
};

export const getRegionAnalytics = (regionId) => {
  return regionKPIs.find(kpi => kpi.regionId === regionId);
};

export const getNationalAnalytics = (managerId) => {
  return nationalKPIs.find(kpi => kpi.managerId === managerId);
};

export const getSystemAnalytics = (tenantId) => {
  return systemAnalytics.find(analytics => analytics.tenantId === tenantId);
};