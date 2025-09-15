import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, ShoppingBag, Target, Calendar, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import StatCard from '../../components/dashboard/StatCard';
import ChartCard from '../../components/dashboard/ChartCard';
import { 
  getAgentAnalytics, 
  getVisitsByAgent, 
  getGoalsByUser,
  getCallCyclesByAgent
} from '../../data';
import { formatPercentage, formatNumber } from '../../lib/utils';

const AgentDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [visits, setVisits] = useState([]);
  const [goals, setGoals] = useState([]);
  const [callCycles, setCallCycles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // In a real app, these would be API calls
      const agentAnalytics = getAgentAnalytics(user.id);
      const agentVisits = getVisitsByAgent(user.id);
      const agentGoals = getGoalsByUser(user.id);
      const agentCallCycles = getCallCyclesByAgent(user.id);
      
      setAnalytics(agentAnalytics);
      setVisits(agentVisits);
      setGoals(agentGoals);
      setCallCycles(agentCallCycles);
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
            <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
            <p className="text-gray-500 mt-1">Here's an overview of your performance</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button asChild>
              <Link to="/agent/new-visit">New Visit</Link>
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Visits"
            value={formatNumber(analytics?.totalVisits || 0)}
            icon={<Users className="h-6 w-6" />}
          />
          <StatCard
            title="Conversion Rate"
            value={formatPercentage(analytics?.conversionRate || 0)}
            icon={<ShoppingBag className="h-6 w-6" />}
            trend={analytics?.conversionRate > 50 ? 'up' : 'down'}
            trendValue={`${analytics?.conversionRate > 50 ? '+' : '-'}${Math.abs(5).toFixed(1)}% from last week`}
          />
          <StatCard
            title="Goal Completion"
            value={formatPercentage(goalCompletionRate)}
            icon={<Target className="h-6 w-6" />}
          />
          <StatCard
            title="Active Call Cycles"
            value={activeCallCycles.length}
            icon={<Calendar className="h-6 w-6" />}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard
            title="Visit Trend"
            description="Your daily visits over the past week"
            data={visitChartData}
            type="bar"
          />
          <ChartCard
            title="Conversion Trend"
            description="Your daily conversions over the past week"
            data={conversionChartData}
            type="line"
          />
        </div>

        {/* Recent Activity and Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Visits</CardTitle>
              <CardDescription>Your most recent field visits</CardDescription>
            </CardHeader>
            <CardContent>
              {visits.slice(0, 5).map((visit) => (
                <div key={visit.id} className="mb-4 last:mb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {visit.type === 'consumer' 
                          ? `Consumer: ${visit.consumerDetails.name}`
                          : `Shop: ${visit.shopDetails.name}`
                        }
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(visit.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      visit.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : visit.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link to="/agent/visit-history">View All Visits</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Goals</CardTitle>
              <CardDescription>Track your assigned goals and progress</CardDescription>
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
                <Link to="/agent/goals">View All Goals</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Call Cycles */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Call Cycles</CardTitle>
            <CardDescription>Your scheduled visits for the week</CardDescription>
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
                      <Button variant="ghost" size="sm" className="flex items-center">
                        <span className="mr-1">Details</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentDashboard;