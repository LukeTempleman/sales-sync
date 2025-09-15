import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, ShoppingBag, Target, Calendar, ArrowUpRight, UserPlus, BarChart2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import StatCard from '../../components/dashboard/StatCard';
import ChartCard from '../../components/dashboard/ChartCard';
import { 
  getAreaManagerAnalytics, 
  getTeamLeadersByAreaManager,
  getAgentsByAreaManager,
  getGoalsByAreaManager,
  getCallCyclesByAreaManager
} from '../../data';
import { formatPercentage, formatNumber } from '../../lib/utils';

const AreaManagerDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [agents, setAgents] = useState([]);
  const [goals, setGoals] = useState([]);
  const [callCycles, setCallCycles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // In a real app, these would be API calls
      const areaAnalytics = getAreaManagerAnalytics(user.id);
      const areaTeamLeaders = getTeamLeadersByAreaManager(user.id);
      const areaAgents = getAgentsByAreaManager(user.id);
      const areaGoals = getGoalsByAreaManager(user.id);
      const areaCallCycles = getCallCyclesByAreaManager(user.id);
      
      setAnalytics(areaAnalytics);
      setTeamLeaders(areaTeamLeaders);
      setAgents(areaAgents);
      setGoals(areaGoals);
      setCallCycles(areaCallCycles);
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

  // Team performance data
  const teamPerformanceData = teamLeaders.map(teamLeader => ({
    name: teamLeader.name.split(' ')[0],
    visits: teamLeader.analytics?.totalVisits || 0,
    conversions: teamLeader.analytics?.totalConversions || 0,
    goalCompletion: teamLeader.analytics?.goalCompletion || 0
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
            <h1 className="text-2xl font-bold">Area Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome, {user.name}</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button asChild>
              <Link to="/area-manager/user-management">
                <UserPlus className="h-4 w-4 mr-2" />
                Manage Users
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/area-manager/analytics">
                <BarChart2 className="h-4 w-4 mr-2" />
                Analytics
              </Link>
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Team Leaders"
            value={teamLeaders.length}
            icon={<Users className="h-6 w-6" />}
          />
          <StatCard
            title="Total Agents"
            value={agents.length}
            icon={<Users className="h-6 w-6" />}
          />
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
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard
            title="Area Visit Trend"
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

        {/* Team Performance */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
            <CardDescription>Performance metrics for each team in your area</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Team Leader</th>
                    <th className="text-left py-3 px-4 font-medium">Agents</th>
                    <th className="text-left py-3 px-4 font-medium">Visits</th>
                    <th className="text-left py-3 px-4 font-medium">Conversion Rate</th>
                    <th className="text-left py-3 px-4 font-medium">Goal Completion</th>
                    <th className="text-left py-3 px-4 font-medium">Call Cycle Adherence</th>
                  </tr>
                </thead>
                <tbody>
                  {teamLeaders.map((teamLeader) => {
                    const teamAgents = agents.filter(agent => agent.teamLeaderId === teamLeader.id);
                    return (
                      <tr key={teamLeader.id} className="border-b">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                              <span className="text-blue-600 font-semibold">
                                {teamLeader.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{teamLeader.name}</p>
                              <p className="text-xs text-gray-500">{teamLeader.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">{teamAgents.length}</td>
                        <td className="py-3 px-4">{formatNumber(teamLeader.analytics?.totalVisits || 0)}</td>
                        <td className="py-3 px-4">{formatPercentage(teamLeader.analytics?.conversionRate || 0)}</td>
                        <td className="py-3 px-4">{formatPercentage(teamLeader.analytics?.goalCompletion || 0)}</td>
                        <td className="py-3 px-4">{formatPercentage(teamLeader.analytics?.callCycleAdherence || 0)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link to="/area-manager/user-management">View All Teams</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Goals and Call Cycles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Area Goals</CardTitle>
              <CardDescription>Track your area's assigned goals</CardDescription>
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
                <Link to="/area-manager/goals">View All Goals</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Call Cycles</CardTitle>
              <CardDescription>Your area's active call cycles</CardDescription>
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
                      {formatPercentage(cycle.adherenceRate)} adherence
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${cycle.adherenceRate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link to="/area-manager/call-cycles">View All Call Cycles</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Area Map */}
        <Card>
          <CardHeader>
            <CardTitle>Area Coverage Map</CardTitle>
            <CardDescription>Geographical distribution of visits in your area</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full bg-gray-100 rounded-md flex items-center justify-center">
              <div className="text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Coverage map visualization would be displayed here</p>
                <p className="text-sm text-gray-400 mt-2">
                  Showing visit distribution across your area
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link to="/area-manager/analytics">View Detailed Analytics</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AreaManagerDashboard;