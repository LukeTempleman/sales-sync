// Mock user data for different roles

export const ROLES = {
  AGENT: 'agent',
  TEAM_LEADER: 'team_leader',
  AREA_MANAGER: 'area_manager',
  REGIONAL_MANAGER: 'regional_manager',
  NATIONAL_MANAGER: 'national_manager',
  ADMIN: 'admin'
};

export const tenants = [
  { id: 1, name: 'Acme Corporation', logo: 'https://placehold.co/200x100/blue/white?text=ACME' },
  { id: 2, name: 'Global Sales Inc.', logo: 'https://placehold.co/200x100/green/white?text=GSI' },
  { id: 3, name: 'Retail Masters', logo: 'https://placehold.co/200x100/red/white?text=RM' }
];

// Agents
export const agents = [
  { id: 1, name: 'John Smith', email: 'john.smith@example.com', phone: '123-456-7890', role: ROLES.AGENT, teamId: 1, tenantId: 1, avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah.johnson@example.com', phone: '123-456-7891', role: ROLES.AGENT, teamId: 1, tenantId: 1, avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: 3, name: 'Michael Brown', email: 'michael.brown@example.com', phone: '123-456-7892', role: ROLES.AGENT, teamId: 2, tenantId: 1, avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: 4, name: 'Emily Davis', email: 'emily.davis@example.com', phone: '123-456-7893', role: ROLES.AGENT, teamId: 2, tenantId: 1, avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: 5, name: 'David Wilson', email: 'david.wilson@example.com', phone: '123-456-7894', role: ROLES.AGENT, teamId: 3, tenantId: 2, avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: 6, name: 'Lisa Martinez', email: 'lisa.martinez@example.com', phone: '123-456-7895', role: ROLES.AGENT, teamId: 3, tenantId: 2, avatar: 'https://i.pravatar.cc/150?img=6' },
  { id: 7, name: 'Robert Taylor', email: 'robert.taylor@example.com', phone: '123-456-7896', role: ROLES.AGENT, teamId: 4, tenantId: 2, avatar: 'https://i.pravatar.cc/150?img=7' },
  { id: 8, name: 'Jennifer Anderson', email: 'jennifer.anderson@example.com', phone: '123-456-7897', role: ROLES.AGENT, teamId: 4, tenantId: 2, avatar: 'https://i.pravatar.cc/150?img=8' },
  { id: 9, name: 'Daniel Thomas', email: 'daniel.thomas@example.com', phone: '123-456-7898', role: ROLES.AGENT, teamId: 5, tenantId: 3, avatar: 'https://i.pravatar.cc/150?img=9' },
  { id: 10, name: 'Jessica Jackson', email: 'jessica.jackson@example.com', phone: '123-456-7899', role: ROLES.AGENT, teamId: 5, tenantId: 3, avatar: 'https://i.pravatar.cc/150?img=10' },
  { id: 11, name: 'Christopher White', email: 'christopher.white@example.com', phone: '123-456-7900', role: ROLES.AGENT, teamId: 6, tenantId: 3, avatar: 'https://i.pravatar.cc/150?img=11' },
  { id: 12, name: 'Amanda Harris', email: 'amanda.harris@example.com', phone: '123-456-7901', role: ROLES.AGENT, teamId: 6, tenantId: 3, avatar: 'https://i.pravatar.cc/150?img=12' }
];

// Team Leaders
export const teamLeaders = [
  { id: 101, name: 'James Wilson', email: 'james.wilson@example.com', phone: '123-456-8001', role: ROLES.TEAM_LEADER, areaId: 1, tenantId: 1, teamId: 1, avatar: 'https://i.pravatar.cc/150?img=13' },
  { id: 102, name: 'Patricia Moore', email: 'patricia.moore@example.com', phone: '123-456-8002', role: ROLES.TEAM_LEADER, areaId: 1, tenantId: 1, teamId: 2, avatar: 'https://i.pravatar.cc/150?img=14' },
  { id: 103, name: 'Richard Taylor', email: 'richard.taylor@example.com', phone: '123-456-8003', role: ROLES.TEAM_LEADER, areaId: 2, tenantId: 2, teamId: 3, avatar: 'https://i.pravatar.cc/150?img=15' },
  { id: 104, name: 'Linda Anderson', email: 'linda.anderson@example.com', phone: '123-456-8004', role: ROLES.TEAM_LEADER, areaId: 2, tenantId: 2, teamId: 4, avatar: 'https://i.pravatar.cc/150?img=16' },
  { id: 105, name: 'Charles Thomas', email: 'charles.thomas@example.com', phone: '123-456-8005', role: ROLES.TEAM_LEADER, areaId: 3, tenantId: 3, teamId: 5, avatar: 'https://i.pravatar.cc/150?img=17' },
  { id: 106, name: 'Barbara Jackson', email: 'barbara.jackson@example.com', phone: '123-456-8006', role: ROLES.TEAM_LEADER, areaId: 3, tenantId: 3, teamId: 6, avatar: 'https://i.pravatar.cc/150?img=18' }
];

// Area Managers
export const areaManagers = [
  { id: 201, name: 'Robert Johnson', email: 'robert.johnson@example.com', phone: '123-456-9001', role: ROLES.AREA_MANAGER, regionId: 1, tenantId: 1, areaId: 1, avatar: 'https://i.pravatar.cc/150?img=19' },
  { id: 202, name: 'Mary Williams', email: 'mary.williams@example.com', phone: '123-456-9002', role: ROLES.AREA_MANAGER, regionId: 2, tenantId: 2, areaId: 2, avatar: 'https://i.pravatar.cc/150?img=20' },
  { id: 203, name: 'John Brown', email: 'john.brown@example.com', phone: '123-456-9003', role: ROLES.AREA_MANAGER, regionId: 3, tenantId: 3, areaId: 3, avatar: 'https://i.pravatar.cc/150?img=21' }
];

// Regional Managers
export const regionalManagers = [
  { id: 301, name: 'William Davis', email: 'william.davis@example.com', phone: '123-456-9101', role: ROLES.REGIONAL_MANAGER, tenantId: 1, regionId: 1, avatar: 'https://i.pravatar.cc/150?img=22' },
  { id: 302, name: 'Elizabeth Miller', email: 'elizabeth.miller@example.com', phone: '123-456-9102', role: ROLES.REGIONAL_MANAGER, tenantId: 2, regionId: 2, avatar: 'https://i.pravatar.cc/150?img=23' },
  { id: 303, name: 'David Wilson', email: 'david.wilson@example.com', phone: '123-456-9103', role: ROLES.REGIONAL_MANAGER, tenantId: 3, regionId: 3, avatar: 'https://i.pravatar.cc/150?img=24' }
];

// National Sales Managers
export const nationalManagers = [
  { id: 401, name: 'Joseph Martinez', email: 'joseph.martinez@example.com', phone: '123-456-9201', role: ROLES.NATIONAL_MANAGER, tenantId: 1, avatar: 'https://i.pravatar.cc/150?img=25' },
  { id: 402, name: 'Susan Anderson', email: 'susan.anderson@example.com', phone: '123-456-9202', role: ROLES.NATIONAL_MANAGER, tenantId: 2, avatar: 'https://i.pravatar.cc/150?img=26' },
  { id: 403, name: 'Thomas Jackson', email: 'thomas.jackson@example.com', phone: '123-456-9203', role: ROLES.NATIONAL_MANAGER, tenantId: 3, avatar: 'https://i.pravatar.cc/150?img=27' }
];

// Admins
export const admins = [
  { id: 501, name: 'Margaret White', email: 'margaret.white@example.com', phone: '123-456-9301', role: ROLES.ADMIN, tenantId: 1, avatar: 'https://i.pravatar.cc/150?img=28' },
  { id: 502, name: 'Charles Harris', email: 'charles.harris@example.com', phone: '123-456-9302', role: ROLES.ADMIN, tenantId: 2, avatar: 'https://i.pravatar.cc/150?img=29' },
  { id: 503, name: 'Nancy Clark', email: 'nancy.clark@example.com', phone: '123-456-9303', role: ROLES.ADMIN, tenantId: 3, avatar: 'https://i.pravatar.cc/150?img=30' }
];

// All users combined
export const allUsers = [
  ...agents,
  ...teamLeaders,
  ...areaManagers,
  ...regionalManagers,
  ...nationalManagers,
  ...admins
];

// Teams
export const teams = [
  { id: 1, name: 'North Team', areaId: 1, tenantId: 1, leaderId: 101 },
  { id: 2, name: 'South Team', areaId: 1, tenantId: 1, leaderId: 102 },
  { id: 3, name: 'East Team', areaId: 2, tenantId: 2, leaderId: 103 },
  { id: 4, name: 'West Team', areaId: 2, tenantId: 2, leaderId: 104 },
  { id: 5, name: 'Central Team', areaId: 3, tenantId: 3, leaderId: 105 },
  { id: 6, name: 'Metro Team', areaId: 3, tenantId: 3, leaderId: 106 }
];

// Areas
export const areas = [
  { id: 1, name: 'Northern Area', regionId: 1, tenantId: 1, managerId: 201 },
  { id: 2, name: 'Eastern Area', regionId: 2, tenantId: 2, managerId: 202 },
  { id: 3, name: 'Southern Area', regionId: 3, tenantId: 3, managerId: 203 }
];

// Regions
export const regions = [
  { id: 1, name: 'North Region', tenantId: 1, managerId: 301 },
  { id: 2, name: 'East Region', tenantId: 2, managerId: 302 },
  { id: 3, name: 'South Region', tenantId: 3, managerId: 303 }
];

// Helper function to get user by ID
export const getUserById = (id) => {
  return allUsers.find(user => user.id === id);
};

// Helper function to get users by role
export const getUsersByRole = (role) => {
  return allUsers.filter(user => user.role === role);
};

// Helper function to get users by tenant
export const getUsersByTenant = (tenantId) => {
  return allUsers.filter(user => user.tenantId === tenantId);
};

// Helper function to get team members
export const getTeamMembers = (teamId) => {
  return agents.filter(agent => agent.teamId === teamId);
};

// Helper function to get teams by area
export const getTeamsByArea = (areaId) => {
  return teams.filter(team => team.areaId === areaId);
};

// Helper function to get areas by region
export const getAreasByRegion = (regionId) => {
  return areas.filter(area => area.regionId === regionId);
};