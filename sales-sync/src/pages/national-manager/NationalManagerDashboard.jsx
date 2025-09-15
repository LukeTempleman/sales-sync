import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, ShoppingBag, Target, Calendar, ArrowUpRight, UserPlus, BarChart2, Map, TrendingUp, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import StatCard from '../../components/dashboard/StatCard';
import ChartCard from '../../components/dashboard/ChartCard';
import { 
  getNationalManagerAnalytics, 
  getRegionalManagersByNationalManager,
  getAreaManagersByNationalManager,
  getTeamLeadersByNationalManager,
  getAgentsByNationalManager,
  getGoalsByNationalManager,
  getCallCyclesByNationalManager
} from '../../data';
import { formatPercentage, formatNumber } from '../../lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const NationalManagerDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [regionalManagers, setRegionalManagers] = useState([]);
  const [areaManagers, setAreaManagers] = useState([]);
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [agents, setAgents] = useState([]);
  const [goals, setGoals] = useState([]);
  const [callCycles, setCallCycles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // In a real app, these would be API calls
      const nationalAnalytics = getNationalManagerAnalytics(user.id);
      const nationalRegionalManagers = getRegionalManagersByNationalManager(user.id);
      const nationalAreaManagers = getAreaManagersByNationalManager(user.id);
      const nationalTeamLeaders = getTeamLeadersByNationalManager(user.id);
      const nationalAgents = getAgentsByNationalManager(user.id);
      const nationalGoals = getGoalsByNationalManager(user.id);
      const nationalCallCycles = getCallCyclesByNationalManager(user.id);
      
      setAnalytics(nationalAnalytics);
      setRegionalManagers(nationalRegionalManagers);
      setAreaManagers(nationalAreaManagers);
      setTeamLeaders(nationalTeamLeaders);
      setAgents(nationalAgents);
      setGoals(nationalGoals);
      setCallCycles(nationalCallCycles);
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
  const visitChartData = analytics?.visitTrend?.periods.map((period, index) => ({
    name: period,
    value: analytics.visitTrend.data[index]
  }));

  const conversionChartData = analytics?.conversionTrend?.periods.map((period, index) => ({
    name: period,
    value: analytics.conversionTrend.data[index]
  }));

  // Regional performance data
  const regionalPerformanceData = regionalManagers.map(regionalManager => ({
    name: regionalManager.name.split(' ')[0],
    visits: regionalManager.analytics?.totalVisits || 0,
    conversions: regionalManager.analytics?.totalConversions || 0,
    goalCompletion: regionalManager.analytics?.goalCompletion || 0
  }));

  // Calculate goal completion stats
  const completedGoals = goals.filter(goal => goal.status === 'completed').length;
  const goalCompletionRate = goals.length > 0 ? (completedGoals / goals.length) * 100 : 0;

  // Get active call cycles
  const activeCallCycles = callCycles.filter(cycle => cycle.status === 'active');

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">National Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome, {user.name}</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button asChild>
              <Link to="/national-manager/user-management">
                <UserPlus className="h-4 w-4 mr-2" />
                Manage Users
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/national-manager/analytics">
                <BarChart2 className="h-4 w-4 mr-2" />
                Analytics
              </Link>
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Regions"
            value={regionalManagers.length}
            icon={<Globe className="h-6 w-6" />}
          />
          <StatCard
            title="Areas"
            value={areaManagers.length}
            icon={<Map className="h-6 w-6" />}
          />
          <StatCard
            title="Teams"
            value={teamLeaders.length}
            icon={<Users className="h-6 w-6" />}
          />
          <StatCard
            title="Agents"
            value={agents.length}
            icon={<Users className="h-6 w-6" />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Visits"
            value={formatNumber(analytics?.totalVisits || 0)}
            icon={<ShoppingBag className="h-6 w-6" />}
            trend={analytics?.visitTrend?.change > 0 ? 'up' : 'down'}
            trendValue={`${analytics?.visitTrend?.change > 0 ? '+' : ''}${analytics?.visitTrend?.change}% from last week`}
          />
          <StatCard
            title="Conversion Rate"
            value={formatPercentage(analytics?.conversionRate || 0)}
            icon={<Target className="h-6 w-6" />}
            trend={analytics?.conversionRate > 50 ? 'up' : 'down'}
            trendValue={`${analytics?.conversionRate > 50 ? '+' : '-'}${Math.abs(5).toFixed(1)}% from last week`}
          />
          <StatCard
            title="Goal Completion"
            value={formatPercentage(goalCompletionRate)}
            icon={<Target className="h-6 w-6" />}
          />
          <StatCard
            title="Call Cycle Adherence"
            value={formatPercentage(analytics?.callCycleAdherence || 0)}
            icon={<Calendar className="h-6 w-6" />}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard
            title="National Visit Trend"
            description="Daily visits over the past week"
            data={visitChartData}
            type="bar"
          />
          <ChartCard
            title="Conversion Trend"
            description="Daily conversions over the past week"
            data={conversionChartData}
            type="line"
          />
        </div>

        {/* Regional Performance */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Regional Performance</CardTitle>
            <CardDescription>Performance metrics for each region</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Regional Manager</th>
                    <th className="text-left py-3 px-4 font-medium">Areas</th>
                    <th className="text-left py-3 px-4 font-medium">Teams</th>
                    <th className="text-left py-3 px-4 font-medium">Agents</th>
                    <th className="text-left py-3 px-4 font-medium">Visits</th>
                    <th className="text-left py-3 px-4 font-medium">Conversion Rate</th>
                    <th className="text-left py-3 px-4 font-medium">Goal Completion</th>
                  </tr>
                </thead>
                <tbody>
                  {regionalManagers.map((regionalManager) => {
                    const regionAreaManagers = areaManagers.filter(am => am.regionalManagerId === regionalManager.id);
                    const regionTeamLeaders = teamLeaders.filter(tl => tl.regionalManagerId === regionalManager.id);
                    const regionAgents = agents.filter(agent => agent.regionalManagerId === regionalManager.id);
                    return (
                      <tr key={regionalManager.id} className="border-b">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                              <span className="text-blue-600 font-semibold">
                                {regionalManager.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{regionalManager.name}</p>
                              <p className="text-xs text-gray-500">{regionalManager.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">{regionAreaManagers.length}</td>
                        <td className="py-3 px-4">{regionTeamLeaders.length}</td>
                        <td className="py-3 px-4">{regionAgents.length}</td>
                        <td className="py-3 px-4">{formatNumber(regionalManager.analytics?.totalVisits || 0)}</td>
                        <td className="py-3 px-4">{formatPercentage(regionalManager.analytics?.conversionRate || 0)}</td>
                        <td className="py-3 px-4">{formatPercentage(regionalManager.analytics?.goalCompletion || 0)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link to="/national-manager/user-management">View All Regions</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Goals and Call Cycles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>National Goals</CardTitle>
              <CardDescription>Track your national goals</CardDescription>
            </CardHeader>
            <CardContent>
              {goals.slice(0, 5).map((goal) => (
                <div key={goal.id} className="mb-4 last:mb-0">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium">{goal.metric.replace('_', ' ').toUpperCase()}: {goal.target}</p>
                    <span className="text-sm text-gray-500">{goal.type}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">Progress: {goal.progress}%</span>
                    <span className="text-xs text-gray-500">
                      Due: {new Date(goal.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link to="/national-manager/goals">View All Goals</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Call Cycle Templates</CardTitle>
              <CardDescription>Your national call cycle templates</CardDescription>
            </CardHeader>
            <CardContent>
              {activeCallCycles.slice(0, 5).map((cycle) => (
                <div key={cycle.id} className="mb-4 last:mb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{cycle.name}</p>
                      <p className="text-xs text-gray-500">
                        {cycle.frequency} • {cycle.locations.length} locations
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Template
                    </span>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <Button variant="ghost" size="sm" className="flex items-center" asChild>
                      <Link to={`/national-manager/call-cycles/${cycle.id}`}>
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
                <Link to="/national-manager/call-cycles">View All Templates</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* National Trends */}
        <Card>
          <CardHeader>
            <CardTitle>National Growth Trends</CardTitle>
            <CardDescription>Key performance indicators over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex flex-col">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Visit Growth</h3>
                <div className="flex items-center">
                  <div className="text-2xl font-bold mr-2">
                    {formatPercentage(analytics?.visitGrowth || 0)}
                  </div>
                  <div className={`flex items-center ${
                    analytics?.visitGrowth > 0 ? 'text-green-600' : 'text-rose-600'
                  }`}>
                    {analytics?.visitGrowth > 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingUp className="h-4 w-4 mr-1 transform rotate-180" />
                    )}
                    <span className="text-xs">
                      {analytics?.visitGrowth > 0 ? '+' : ''}
                      {formatPercentage(analytics?.visitGrowth || 0)}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">vs. last quarter</p>
              </div>
              
              <div className="flex flex-col">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Conversion Growth</h3>
                <div className="flex items-center">
                  <div className="text-2xl font-bold mr-2">
                    {formatPercentage(analytics?.conversionGrowth || 0)}
                  </div>
                  <div className={`flex items-center ${
                    analytics?.conversionGrowth > 0 ? 'text-green-600' : 'text-rose-600'
                  }`}>
                    {analytics?.conversionGrowth > 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingUp className="h-4 w-4 mr-1 transform rotate-180" />
                    )}
                    <span className="text-xs">
                      {analytics?.conversionGrowth > 0 ? '+' : ''}
                      {formatPercentage(analytics?.conversionGrowth || 0)}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">vs. last quarter</p>
              </div>
              
              <div className="flex flex-col">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Shelf Share Growth</h3>
                <div className="flex items-center">
                  <div className="text-2xl font-bold mr-2">
                    {formatPercentage(analytics?.shelfShareGrowth || 0)}
                  </div>
                  <div className={`flex items-center ${
                    analytics?.shelfShareGrowth > 0 ? 'text-green-600' : 'text-rose-600'
                  }`}>
                    {analytics?.shelfShareGrowth > 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingUp className="h-4 w-4 mr-1 transform rotate-180" />
                    )}
                    <span className="text-xs">
                      {analytics?.shelfShareGrowth > 0 ? '+' : ''}
                      {formatPercentage(analytics?.shelfShareGrowth || 0)}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">vs. last quarter</p>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={analytics?.growthTrend?.periods.map((period, index) => ({
                    name: period,
                    visits: analytics.growthTrend.visits[index],
                    conversions: analytics.growthTrend.conversions[index],
                    shelfShare: analytics.growthTrend.shelfShare[index]
                  }))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="visits" stroke="#2563eb" name="Visits" />
                  <Line type="monotone" dataKey="conversions" stroke="#ec4899" name="Conversions" />
                  <Line type="monotone" dataKey="shelfShare" stroke="#10b981" name="Shelf Share" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link to="/national-manager/analytics">View Detailed Analytics</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default NationalManagerDashboard;
