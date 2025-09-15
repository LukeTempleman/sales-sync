import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../data';
import { 
  Home, 
  Users, 
  Calendar, 
  BarChart2, 
  Clock, 
  Target, 
  PlusCircle, 
  User, 
  Bell, 
  HelpCircle, 
  LogOut, 
  Menu, 
  X,
  Package,
  FileText,
  Settings
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, tenant, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Navigation items based on user role
  const getNavItems = () => {
    switch (user?.role) {
      case ROLES.AGENT:
        return [
          { path: '/agent/dashboard', label: 'Home', icon: <Home className="w-5 h-5" /> },
          { path: '/agent/new-visit', label: 'New Visit', icon: <PlusCircle className="w-5 h-5" /> },
          { path: '/agent/visit-history', label: 'Visit History', icon: <Clock className="w-5 h-5" /> },
          { path: '/agent/goals', label: 'Goals', icon: <Target className="w-5 h-5" /> },
        ];
      case ROLES.TEAM_LEADER:
        return [
          { path: '/team-leader/dashboard', label: 'Home', icon: <Home className="w-5 h-5" /> },
          { path: '/team-leader/team-management', label: 'Team', icon: <Users className="w-5 h-5" /> },
          { path: '/team-leader/call-cycles', label: 'Call Cycles', icon: <Calendar className="w-5 h-5" /> },
          { path: '/team-leader/analytics', label: 'Analytics', icon: <BarChart2 className="w-5 h-5" /> },
          { path: '/team-leader/visit-history', label: 'Visit History', icon: <Clock className="w-5 h-5" /> },
        ];
      case ROLES.AREA_MANAGER:
        return [
          { path: '/area-manager/dashboard', label: 'Home', icon: <Home className="w-5 h-5" /> },
          { path: '/area-manager/user-management', label: 'Users', icon: <Users className="w-5 h-5" /> },
          { path: '/area-manager/call-cycles', label: 'Call Cycles', icon: <Calendar className="w-5 h-5" /> },
          { path: '/area-manager/analytics', label: 'Analytics', icon: <BarChart2 className="w-5 h-5" /> },
          { path: '/area-manager/visit-history', label: 'Visit History', icon: <Clock className="w-5 h-5" /> },
        ];
      case ROLES.REGIONAL_MANAGER:
        return [
          { path: '/regional-manager/dashboard', label: 'Home', icon: <Home className="w-5 h-5" /> },
          { path: '/regional-manager/user-management', label: 'Users', icon: <Users className="w-5 h-5" /> },
          { path: '/regional-manager/call-cycles', label: 'Call Cycles', icon: <Calendar className="w-5 h-5" /> },
          { path: '/regional-manager/analytics', label: 'Analytics', icon: <BarChart2 className="w-5 h-5" /> },
          { path: '/regional-manager/visit-history', label: 'Visit History', icon: <Clock className="w-5 h-5" /> },
        ];
      case ROLES.NATIONAL_MANAGER:
        return [
          { path: '/national-manager/dashboard', label: 'Home', icon: <Home className="w-5 h-5" /> },
          { path: '/national-manager/user-management', label: 'Users', icon: <Users className="w-5 h-5" /> },
          { path: '/national-manager/call-cycles', label: 'Call Cycles', icon: <Calendar className="w-5 h-5" /> },
          { path: '/national-manager/analytics', label: 'Analytics', icon: <BarChart2 className="w-5 h-5" /> },
          { path: '/national-manager/visit-history', label: 'Visit History', icon: <Clock className="w-5 h-5" /> },
        ];
      case ROLES.ADMIN:
        return [
          { path: '/admin/dashboard', label: 'Home', icon: <Home className="w-5 h-5" /> },
          { path: '/admin/brand-management', label: 'Brands', icon: <Package className="w-5 h-5" /> },
          { path: '/admin/survey-management', label: 'Surveys', icon: <FileText className="w-5 h-5" /> },
          { path: '/admin/user-management', label: 'Users', icon: <Users className="w-5 h-5" /> },
          { path: '/admin/visit-history', label: 'Visit History', icon: <Clock className="w-5 h-5" /> },
          { path: '/admin/analytics', label: 'Analytics', icon: <BarChart2 className="w-5 h-5" /> },
        ];
      default:
        return [];
    }
  };

  // Common navigation items for all roles
  const commonNavItems = [
    { path: `/${user?.role}/profile`, label: 'Profile', icon: <User className="w-5 h-5" /> },
    { path: `/${user?.role}/notifications`, label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
    { path: `/${user?.role}/help`, label: 'Help', icon: <HelpCircle className="w-5 h-5" /> },
  ];

  // Format role for display
  const formatRole = (role) => {
    return role?.replace('_', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Get base path for the current role
  const getBasePath = () => {
    switch (user?.role) {
      case ROLES.AGENT: return '/agent';
      case ROLES.TEAM_LEADER: return '/team-leader';
      case ROLES.AREA_MANAGER: return '/area-manager';
      case ROLES.REGIONAL_MANAGER: return '/regional-manager';
      case ROLES.NATIONAL_MANAGER: return '/national-manager';
      case ROLES.ADMIN: return '/admin';
      default: return '/';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white shadow-sm p-4 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md text-gray-500 hover:text-gray-600 focus:outline-none"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <div className="flex items-center">
          <span className="font-semibold text-blue-600">Sales-sync</span>
        </div>
        <div className="w-6 h-6"></div> {/* Spacer for alignment */}
      </div>

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-center">
              <h1 className="text-xl font-bold text-blue-600">Sales-sync</h1>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                  <p className="text-xs text-gray-500">{formatRole(user?.role)}</p>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <p>Tenant: {tenant?.name}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {getNavItems().map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm ${
                      location.pathname === item.path
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Account
              </h3>
              <ul className="mt-2 space-y-1">
                {commonNavItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path.replace('{role}', getBasePath())}
                      className={`flex items-center px-3 py-2 rounded-md text-sm ${
                        location.pathname === item.path.replace('{role}', getBasePath())
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="ml-3">Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="pt-16 lg:pt-0 min-h-screen">
          <Outlet />
        </div>
      </div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-10 bg-gray-600 bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default DashboardLayout;