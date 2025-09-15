import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, ShoppingBag, Target, Calendar, ArrowUpRight, UserPlus, BarChart2, Map, TrendingUp, Globe, Building, FileText, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import StatCard from '../../components/dashboard/StatCard';
import ChartCard from '../../components/dashboard/ChartCard';
import { 
  getAdminAnalytics, 
  getTenants,
  getBrands,
  getSurveys,
  getAllUsers
} from '../../data';
import { formatPercentage, formatNumber } from '../../lib/utils';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [brands, setBrands] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // In a real app, these would be API calls
      const adminAnalytics = getAdminAnalytics();
      const allTenants = getTenants();
      const allBrands = getBrands();
      const allSurveys = getSurveys();
      const allUsers = getAllUsers();
      
      setAnalytics(adminAnalytics);
      setTenants(allTenants);
      setBrands(allBrands);
      setSurveys(allSurveys);
      setUsers(allUsers);
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Format data for charts
  const userActivityData = analytics?.userActivity?.periods.map((period, index) => ({
    name: period,
    value: analytics.userActivity.data[index]
  }));

  const surveyCompletionData = analytics?.surveyCompletion?.periods.map((period, index) => ({
    name: period,
    value: analytics.surveyCompletion.data[index]
  }));

  // Tenant usage data
  const tenantUsageData = tenants.map(tenant => ({
    name: tenant.name,
    users: tenant.userCount,
    visits: tenant.visitCount,
    surveys: tenant.surveyCount
  }));

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome, {user.name}</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button asChild>
              <Link to="/admin/user-management">
                <UserPlus className="h-4 w-4 mr-2" />
                Manage Users
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/admin/settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Tenants"
            value={tenants.length}
            icon={<Building className="h-6 w-6" />}
          />
          <StatCard
            title="Brands"
            value={brands.length}
            icon={<Target className="h-6 w-6" />}
          />
          <StatCard
            title="Surveys"
            value={surveys.length}
            icon={<FileText className="h-6 w-6" />}
          />
          <StatCard
            title="Users"
            value={users.length}
            icon={<Users className="h-6 w-6" />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Active Users"
            value={formatNumber(analytics?.activeUsers || 0)}
            icon={<Users className="h-6 w-6" />}
            trend={analytics?.activeUsersTrend?.change > 0 ? 'up' : 'down'}
            trendValue={`${analytics?.activeUsersTrend?.change > 0 ? '+' : ''}${analytics?.activeUsersTrend?.change}% from last week`}
          />
          <StatCard
            title="Surveys Completed"
            value={formatNumber(analytics?.surveysCompleted || 0)}
            icon={<FileText className="h-6 w-6" />}
            trend={analytics?.surveyCompletionTrend?.change > 0 ? 'up' : 'down'}
            trendValue={`${analytics?.surveyCompletionTrend?.change > 0 ? '+' : ''}${analytics?.surveyCompletionTrend?.change}% from last week`}
          />
          <StatCard
            title="System Uptime"
            value={formatPercentage(analytics?.systemUptime || 0)}
            icon={<Settings className="h-6 w-6" />}
          />
          <StatCard
            title="API Response Time"
            value={`${analytics?.apiResponseTime || 0} ms`}
            icon={<TrendingUp className="h-6 w-6" />}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard
            title="User Activity"
            description="Daily active users over the past week"
            data={userActivityData}
            type="bar"
          />
          <ChartCard
            title="Survey Completion"
            description="Daily survey completions over the past week"
            data={surveyCompletionData}
            type="line"
          />
        </div>

        {/* Tenant Usage */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Tenant Usage</CardTitle>
            <CardDescription>Usage metrics for each tenant</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Tenant</th>
                    <th className="text-left py-3 px-4 font-medium">Users</th>
                    <th className="text-left py-3 px-4 font-medium">Visits</th>
                    <th className="text-left py-3 px-4 font-medium">Surveys</th>
                    <th className="text-left py-3 px-4 font-medium">Storage Used</th>
                    <th className="text-left py-3 px-4 font-medium">Last Activity</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tenants.map((tenant) => (
                    <tr key={tenant.id} className="border-b">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-semibold">
                              {tenant.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{tenant.name}</p>
                            <p className="text-xs text-muted-foreground">{tenant.domain}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{tenant.userCount}</td>
                      <td className="py-3 px-4">{formatNumber(tenant.visitCount)}</td>
                      <td className="py-3 px-4">{formatNumber(tenant.surveyCount)}</td>
                      <td className="py-3 px-4">{tenant.storageUsed} MB</td>
                      <td className="py-3 px-4">{new Date(tenant.lastActivity).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tenant.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : tenant.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-secondary text-secondary-foreground'
                        }`}>
                          {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link to="/admin/tenants">Manage Tenants</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Brands and Surveys */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Brands</CardTitle>
              <CardDescription>Manage brand information and assets</CardDescription>
            </CardHeader>
            <CardContent>
              {brands.slice(0, 5).map((brand) => (
                <div key={brand.id} className="mb-4 last:mb-0">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      {brand.logo && (
                        <img 
                          src={brand.logo} 
                          alt={`${brand.name} logo`} 
                          className="w-10 h-10 object-contain mr-3"
                        />
                      )}
                      <div>
                        <p className="font-medium">{brand.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {brand.tenantCount} tenants • {brand.surveyCount} surveys
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="flex items-center" asChild>
                      <Link to={`/admin/brands/${brand.id}`}>
                        <span className="mr-1">Details</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link to="/admin/brands">Manage Brands</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Surveys</CardTitle>
              <CardDescription>Manage survey templates</CardDescription>
            </CardHeader>
            <CardContent>
              {surveys.slice(0, 5).map((survey) => (
                <div key={survey.id} className="mb-4 last:mb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{survey.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {survey.type} • {survey.questionCount} questions
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      survey.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : survey.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-secondary text-secondary-foreground'
                    }`}>
                      {survey.status.charAt(0).toUpperCase() + survey.status.slice(1)}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <Button variant="ghost" size="sm" className="flex items-center" asChild>
                      <Link to={`/admin/surveys/${survey.id}`}>
                        <span className="mr-1">Edit</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link to="/admin/surveys">Manage Surveys</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Monitor system performance and health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Server Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm">API Server</p>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Online
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm">Database</p>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Online
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm">Storage</p>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Online
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Resource Usage</h3>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm">CPU</p>
                      <p className="text-sm font-medium">{analytics?.cpuUsage || 0}%</p>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2.5">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${analytics?.cpuUsage || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm">Memory</p>
                      <p className="text-sm font-medium">{analytics?.memoryUsage || 0}%</p>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2.5">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${analytics?.memoryUsage || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm">Disk</p>
                      <p className="text-sm font-medium">{analytics?.diskUsage || 0}%</p>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2.5">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${analytics?.diskUsage || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Recent Events</h3>
                <div className="space-y-2">
                  {analytics?.recentEvents?.map((event, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${
                        event.type === 'error' 
                          ? 'bg-rose-500' 
                          : event.type === 'warning'
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                      }`}></div>
                      <div>
                        <p className="text-sm">{event.message}</p>
                        <p className="text-xs text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link to="/admin/system">View System Details</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;