import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't already tried to refresh the token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // No refresh token, redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        // Call the refresh token endpoint
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );
        
        // If we got a new token, save it and retry the original request
        if (response.data.tokens) {
          localStorage.setItem('accessToken', response.data.tokens.access_token);
          localStorage.setItem('refreshToken', response.data.tokens.refresh_token);
          
          // Update the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${response.data.tokens.access_token}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // If refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
};

// Users API
export const usersAPI = {
  getUsers: (params) => api.get('/users', { params }),
  createUser: (userData) => api.post('/users', userData),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// Brands API
export const brandsAPI = {
  getBrands: (params) => api.get('/brands', { params }),
  createBrand: (brandData) => api.post('/brands', brandData),
  getBrandById: (id) => api.get(`/brands/${id}`),
  updateBrand: (id, brandData) => api.put(`/brands/${id}`, brandData),
  deleteBrand: (id) => api.delete(`/brands/${id}`),
};

// Visits API
export const visitsAPI = {
  getVisits: (params) => api.get('/visits', { params }),
  createVisit: (visitData) => api.post('/visits', visitData),
  getVisitById: (id) => api.get(`/visits/${id}`),
  updateVisit: (id, visitData) => api.put(`/visits/${id}`, visitData),
  deleteVisit: (id) => api.delete(`/visits/${id}`),
};

// Teams API
export const teamsAPI = {
  getTeams: (params) => api.get('/teams', { params }),
  createTeam: (teamData) => api.post('/teams', teamData),
  getTeamById: (id) => api.get(`/teams/${id}`),
  updateTeam: (id, teamData) => api.put(`/teams/${id}`, teamData),
  deleteTeam: (id) => api.delete(`/teams/${id}`),
  addMember: (teamId, userId, role) => api.post(`/teams/${teamId}/members`, { user_id: userId, role }),
  removeMember: (teamId, userId) => api.delete(`/teams/${teamId}/members/${userId}`),
};

// Surveys API
export const surveysAPI = {
  getSurveys: (params) => api.get('/surveys', { params }),
  createSurvey: (surveyData) => api.post('/surveys', surveyData),
  getSurveyById: (id) => api.get(`/surveys/${id}`),
  updateSurvey: (id, surveyData) => api.put(`/surveys/${id}`, surveyData),
  deleteSurvey: (id) => api.delete(`/surveys/${id}`),
};

// Goals API
export const goalsAPI = {
  getGoals: (params) => api.get('/goals', { params }),
  createGoal: (goalData) => api.post('/goals', goalData),
  getGoalById: (id) => api.get(`/goals/${id}`),
  updateGoal: (id, goalData) => api.put(`/goals/${id}`, goalData),
  deleteGoal: (id) => api.delete(`/goals/${id}`),
  assignGoal: (goalId, assignmentData) => api.post(`/goals/${goalId}/assignments`, assignmentData),
  removeAssignment: (goalId, assignmentId) => api.delete(`/goals/${goalId}/assignments/${assignmentId}`),
};

// Analytics API
export const analyticsAPI = {
  getOverview: (params) => api.get('/analytics/overview', { params }),
  getVisitStats: (params) => api.get('/analytics/visits', { params }),
  getUserStats: (params) => api.get('/analytics/users', { params }),
  getGoalStats: (params) => api.get('/analytics/goals', { params }),
};

// Call Cycles API
export const callCyclesAPI = {
  getCallCycles: (params) => api.get('/call-cycles', { params }),
  createCallCycle: (cycleData) => api.post('/call-cycles', cycleData),
  getCallCycleById: (id) => api.get(`/call-cycles/${id}`),
  updateCallCycle: (id, cycleData) => api.put(`/call-cycles/${id}`, cycleData),
  deleteCallCycle: (id) => api.delete(`/call-cycles/${id}`),
};

// Tenants API
export const tenantsAPI = {
  getTenants: (params) => api.get('/tenants', { params }),
  createTenant: (tenantData) => api.post('/tenants', tenantData),
  getTenantById: (id) => api.get(`/tenants/${id}`),
  updateTenant: (id, tenantData) => api.put(`/tenants/${id}`, tenantData),
  deleteTenant: (id) => api.delete(`/tenants/${id}`),
};

export default api;