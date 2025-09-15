import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, ShoppingBag, Target, Calendar, ArrowUpRight, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import StatCard from '../../components/dashboard/StatCard';
import ChartCard from '../../components/dashboard/ChartCard';
import { 
  getTeamLeaderAnalytics, 
  getAgentsByTeamLeader,
  getGoalsByTeamLeader,
  getCallCyclesByTeamLeader
} from '../../data';
import { formatPercentage, formatNumber } from '../../lib/utils';

const TeamLeaderDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [agents, setAgents] = useState([]);
  const [goals, setGoals] = useState([]);
  const [callCycles, setCallCycles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // In a real app, these would be API calls
      const teamAnalytics = getTeamLeaderAnalytics(user.id);
      const teamAgents = getAgentsByTeamLeader(user.id);
      const teamGoals = getGoalsByTeamLeader(user.id);
      const teamCallCycles = getCallCyclesByTeamLeader(user.id);
      
      setAnalytics(teamAnalytics);
      setAgents(teamAgents);
      setGoals(teamGoals);
      setCallCycles(teamCallCycles);
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
            <h1 className="text-2xl font-bold">Team Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome, {user.name}</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button asChild>
              <Link to="/team-leader/team-management">
                <UserPlus className="h-4 w-4 mr-2" />
                Manage Team
              </Link>
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Team Members"
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
          <StatCard
            title="Call Cycle Adherence"
            value={formatPercentage(analytics?.callCycleAdherence || 0)}
            icon={<Calendar className="h-6 w-6" />}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard
            title="Team Visit Trend"
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

        {/* Team Members and Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Your team's performance</CardDescription>
            </CardHeader>
            <CardContent>
              {agents.slice(0, 5).map((agent) => (
                <div key={agent.id} className="mb-4 last:mb-0">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-semibold">
                          {agent.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{agent.name}</p>
                        <p className="text-sm text-gray-500">{agent.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{agent.analytics?.totalVisits || 0} visits</p>
                      <p className="text-sm text-gray-500">
                        {formatPercentage(agent.analytics?.conversionRate || 0)} conversion
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link to="/team-leader/team-management">View All Team Members</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team Goals</CardTitle>
              <CardDescription>Track your team's assigned goals</CardDescription>
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
                <Link to="/team-leader/goals">View All Goals</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Call Cycles */}
        <Card>
          <CardHeader>
            <CardTitle>Active Call Cycles</CardTitle>
            <CardDescription>Your team's scheduled visits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeCallCycles.slice(0, 3).map((cycle) => (
                <Card key={cycle.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{cycle.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}>
                        {cycle.frequency}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">
                      {cycle.locations.length} locations to visit
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">
                        Adherence: {formatPercentage(cycle.adherenceRate)}
                      </span>
                      <Button variant="ghost" size="sm" className="flex items-center" asChild>
                        <Link to={`/team-leader/call-cycles/${cycle.id}`}>
                          <span className="mr-1">Details</span>
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link to="/team-leader/call-cycles">Manage Call Cycles</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default TeamLeaderDashboard;