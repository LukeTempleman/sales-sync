import React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../data';

// Layouts
import DashboardLayout from '../components/layout/DashboardLayout';
import AuthLayout from '../components/layout/AuthLayout';

// Auth pages
import LoginPage from '../pages/auth/LoginPage';
import TenantSelectPage from '../pages/auth/TenantSelectPage';

// Shared pages
import ProfilePage from '../pages/shared/ProfilePage';
import NotificationsPage from '../pages/shared/NotificationsPage';
import HelpPage from '../pages/shared/HelpPage';

// Agent pages
import AgentDashboard from '../pages/agent/AgentDashboard';
import NewVisitPage from '../pages/agent/NewVisitPage';
import VisitHistoryPage from '../pages/agent/VisitHistoryPage';
import AgentGoalsPage from '../pages/agent/AgentGoalsPage';

// Team Leader pages
import TeamLeaderDashboard from '../pages/team-leader/TeamLeaderDashboard';
import TeamManagementPage from '../pages/team-leader/TeamManagementPage';
import TeamCallCyclesPage from '../pages/team-leader/TeamCallCyclesPage';
import TeamAnalyticsPage from '../pages/team-leader/TeamAnalyticsPage';
import TeamVisitHistoryPage from '../pages/team-leader/TeamVisitHistoryPage';

// Area Manager pages
import AreaManagerDashboard from '../pages/area-manager/AreaManagerDashboard';
import AreaUserManagementPage from '../pages/area-manager/AreaUserManagementPage';
import AreaCallCyclesPage from '../pages/area-manager/AreaCallCyclesPage';
import AreaAnalyticsPage from '../pages/area-manager/AreaAnalyticsPage';
import AreaVisitHistoryPage from '../pages/area-manager/AreaVisitHistoryPage';

// Regional Manager pages
import RegionalManagerDashboard from '../pages/regional-manager/RegionalManagerDashboard';
import RegionalUserManagementPage from '../pages/regional-manager/RegionalUserManagementPage';
import RegionalCallCyclesPage from '../pages/regional-manager/RegionalCallCyclesPage';
import RegionalAnalyticsPage from '../pages/regional-manager/RegionalAnalyticsPage';
import RegionalVisitHistoryPage from '../pages/regional-manager/RegionalVisitHistoryPage';

// National Sales Manager pages
import NationalManagerDashboard from '../pages/national-manager/NationalManagerDashboard';
import NationalUserManagementPage from '../pages/national-manager/NationalUserManagementPage';
import NationalCallCyclesPage from '../pages/national-manager/NationalCallCyclesPage';
import NationalAnalyticsPage from '../pages/national-manager/NationalAnalyticsPage';
import NationalVisitHistoryPage from '../pages/national-manager/NationalVisitHistoryPage';

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import BrandManagementPage from '../pages/admin/BrandManagementPage';
import SurveyManagementPage from '../pages/admin/SurveyManagementPage';
import UserManagementPage from '../pages/admin/UserManagementPage';
import AdminVisitHistoryPage from '../pages/admin/AdminVisitHistoryPage';
import AdminAnalyticsPage from '../pages/admin/AdminAnalyticsPage';

// Error pages
import NotFoundPage from '../pages/NotFoundPage';

// Route guard for authenticated routes
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};

// Routes configuration
export default function Router() {
  const { user } = useAuth();
  
  const routes = useRoutes([
    // Auth routes
    {
      path: '/',
      element: <AuthLayout />,
      children: [
        { path: '', element: <Navigate to="/login" /> },
        { path: 'login', element: <LoginPage /> },
        { path: 'select-tenant', element: <TenantSelectPage /> }
      ]
    },
    
    // Agent routes
    {
      path: '/agent',
      element: (
        <ProtectedRoute allowedRoles={[ROLES.AGENT]}>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: '', element: <Navigate to="/agent/dashboard" /> },
        { path: 'dashboard', element: <AgentDashboard /> },
        { path: 'new-visit', element: <NewVisitPage /> },
        { path: 'visit-history', element: <VisitHistoryPage /> },
        { path: 'goals', element: <AgentGoalsPage /> },
        { path: 'profile', element: <ProfilePage /> },
        { path: 'notifications', element: <NotificationsPage /> },
        { path: 'help', element: <HelpPage /> }
      ]
    },
    
    // Team Leader routes
    {
      path: '/team-leader',
      element: (
        <ProtectedRoute allowedRoles={[ROLES.TEAM_LEADER]}>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: '', element: <Navigate to="/team-leader/dashboard" /> },
        { path: 'dashboard', element: <TeamLeaderDashboard /> },
        { path: 'team-management', element: <TeamManagementPage /> },
        { path: 'call-cycles', element: <TeamCallCyclesPage /> },
        { path: 'analytics', element: <TeamAnalyticsPage /> },
        { path: 'visit-history', element: <TeamVisitHistoryPage /> },
        { path: 'profile', element: <ProfilePage /> },
        { path: 'notifications', element: <NotificationsPage /> },
        { path: 'help', element: <HelpPage /> }
      ]
    },
    
    // Area Manager routes
    {
      path: '/area-manager',
      element: (
        <ProtectedRoute allowedRoles={[ROLES.AREA_MANAGER]}>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: '', element: <Navigate to="/area-manager/dashboard" /> },
        { path: 'dashboard', element: <AreaManagerDashboard /> },
        { path: 'user-management', element: <AreaUserManagementPage /> },
        { path: 'call-cycles', element: <AreaCallCyclesPage /> },
        { path: 'analytics', element: <AreaAnalyticsPage /> },
        { path: 'visit-history', element: <AreaVisitHistoryPage /> },
        { path: 'profile', element: <ProfilePage /> },
        { path: 'notifications', element: <NotificationsPage /> },
        { path: 'help', element: <HelpPage /> }
      ]
    },
    
    // Regional Manager routes
    {
      path: '/regional-manager',
      element: (
        <ProtectedRoute allowedRoles={[ROLES.REGIONAL_MANAGER]}>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: '', element: <Navigate to="/regional-manager/dashboard" /> },
        { path: 'dashboard', element: <RegionalManagerDashboard /> },
        { path: 'user-management', element: <RegionalUserManagementPage /> },
        { path: 'call-cycles', element: <RegionalCallCyclesPage /> },
        { path: 'analytics', element: <RegionalAnalyticsPage /> },
        { path: 'visit-history', element: <RegionalVisitHistoryPage /> },
        { path: 'profile', element: <ProfilePage /> },
        { path: 'notifications', element: <NotificationsPage /> },
        { path: 'help', element: <HelpPage /> }
      ]
    },
    
    // National Sales Manager routes
    {
      path: '/national-manager',
      element: (
        <ProtectedRoute allowedRoles={[ROLES.NATIONAL_MANAGER]}>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: '', element: <Navigate to="/national-manager/dashboard" /> },
        { path: 'dashboard', element: <NationalManagerDashboard /> },
        { path: 'user-management', element: <NationalUserManagementPage /> },
        { path: 'call-cycles', element: <NationalCallCyclesPage /> },
        { path: 'analytics', element: <NationalAnalyticsPage /> },
        { path: 'visit-history', element: <NationalVisitHistoryPage /> },
        { path: 'profile', element: <ProfilePage /> },
        { path: 'notifications', element: <NotificationsPage /> },
        { path: 'help', element: <HelpPage /> }
      ]
    },
    
    // Admin routes
    {
      path: '/admin',
      element: (
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: '', element: <Navigate to="/admin/dashboard" /> },
        { path: 'dashboard', element: <AdminDashboard /> },
        { path: 'brand-management', element: <BrandManagementPage /> },
        { path: 'survey-management', element: <SurveyManagementPage /> },
        { path: 'user-management', element: <UserManagementPage /> },
        { path: 'visit-history', element: <AdminVisitHistoryPage /> },
        { path: 'analytics', element: <AdminAnalyticsPage /> },
        { path: 'profile', element: <ProfilePage /> },
        { path: 'notifications', element: <NotificationsPage /> },
        { path: 'help', element: <HelpPage /> }
      ]
    },
    
    // Redirect based on user role
    {
      path: '/dashboard',
      element: (
        <ProtectedRoute>
          {user?.role === ROLES.AGENT && <Navigate to="/agent/dashboard" />}
          {user?.role === ROLES.TEAM_LEADER && <Navigate to="/team-leader/dashboard" />}
          {user?.role === ROLES.AREA_MANAGER && <Navigate to="/area-manager/dashboard" />}
          {user?.role === ROLES.REGIONAL_MANAGER && <Navigate to="/regional-manager/dashboard" />}
          {user?.role === ROLES.NATIONAL_MANAGER && <Navigate to="/national-manager/dashboard" />}
          {user?.role === ROLES.ADMIN && <Navigate to="/admin/dashboard" />}
        </ProtectedRoute>
      )
    },
    
    // 404 page
    { path: '404', element: <NotFoundPage /> },
    { path: '*', element: <Navigate to="/404" /> }
  ]);
  
  return routes;
}