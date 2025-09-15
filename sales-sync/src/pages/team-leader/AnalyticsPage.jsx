import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import ChartCard from '../../components/dashboard/ChartCard';
import { 
  getTeamLeaderAnalytics, 
  getAgentsByTeamLeader,
  getVisitsByTeamLeader
} from '../../data';
import { formatPercentage, formatNumber, formatDate } from '../../lib/utils';
import { 
  BarChart2, 
  TrendingUp, 
  Map, 
  Calendar, 
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const AnalyticsPage = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [agents, setAgents] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      // In a real app, these would be API calls
      const teamAnalytics = getTeamLeaderAnalytics(user.id);
      const teamAgents = getAgentsByTeamLeader(user.id);
      const teamVisits = getVisitsByTeamLeader(user.id);
      
      setAnalytics(teamAnalytics);
      setAgents(teamAgents);
      setVisits(teamVisits);
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p>Loading analytics...</p>
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

  const goalCompletionData = analytics?.goalCompletion?.map(goal => ({
    name: goal.metric.replace('_', ' ').toUpperCase(),
    value: goal.completionRate
  }));

  const visitTypeData = [
    { name: 'Consumer Visits', value: analytics?.visitTypes?.consumer || 0 },
    { name: 'Shop Visits', value: analytics?.visitTypes?.shop || 0 }
  ];

  const COLORS = ['#2563eb', '#ec4899', '#10b981', '#f59e0b', '#6366f1'];

  // Agent performance data
  const agentPerformanceData = agents.map(agent => ({
    name: agent.name.split(' ')[0],
    visits: agent.analytics?.totalVisits || 0,
    conversions: agent.analytics?.totalConversions || 0,
    goalCompletion: agent.analytics?.goalCompletion || 0
  }));

  // Call cycle adherence data
  const callCycleAdherenceData = analytics?.callCycleAdherence?.map(cycle => ({
    name: cycle.name,
    adherence: cycle.adherenceRate
  }));

  // Heatmap data (mock)
  const heatmapData = {
    locations: [
      { lat: -33.918861, lng: 18.423300, weight: 10 },
      { lat: -33.925435, lng: 18.429349, weight: 5 },
      { lat: -33.916357, lng: 18.417778, weight: 8 },
      { lat: -33.931401, lng: 18.435589, weight: 3 },
      { lat: -33.922756, lng: 18.445631, weight: 7 }
    ]
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Team Analytics</h1>
            <p className="text-gray-500 mt-1">Insights and performance metrics for your team</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <div className="flex items-center space-x-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="h-9 rounded-md border border-gray-200 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="overview" onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="visits">Visits</TabsTrigger>
            <TabsTrigger value="agents">Agent Performance</TabsTrigger>
            <TabsTrigger value="callcycles">Call Cycles</TabsTrigger>
            <TabsTrigger value="coverage">Coverage Map</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Visits</p>
                      <h3 className="text-2xl font-bold mt-1">{formatNumber(analytics?.totalVisits || 0)}</h3>
                      <p className="text-xs text-green-600 mt-1">
                        +{analytics?.visitTrend?.change || 0}% from previous {timeRange}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <BarChart2 className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                      <h3 className="text-2xl font-bold mt-1">{formatPercentage(analytics?.conversionRate || 0)}</h3>
                      <p className="text-xs text-green-600 mt-1">
                        +{analytics?.conversionTrend?.change || 0}% from previous {timeRange}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Call Cycle Adherence</p>
                      <h3 className="text-2xl font-bold mt-1">{formatPercentage(analytics?.callCycleAdherence?.[0]?.adherenceRate || 0)}</h3>
                      <p className="text-xs text-yellow-600 mt-1">
                        {analytics?.callCycleAdherenceTrend?.change > 0 ? '+' : ''}
                        {analytics?.callCycleAdherenceTrend?.change || 0}% from previous {timeRange}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                      <Calendar className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <ChartCard
                title="Visit Trend"
                description={`Visit performance over the past ${timeRange}`}
                data={visitChartData}
                type="bar"
              />
              <ChartCard
                title="Conversion Trend"
                description={`Conversion rates over the past ${timeRange}`}
                data={conversionChartData}
                type="line"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Goal Completion</CardTitle>
                  <CardDescription>Team goal completion rates by metric</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={goalCompletionData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `${value}%`} />
                        <Tooltip formatter={(value) => [`${value}%`, 'Completion Rate']} />
                        <Legend />
                        <Bar dataKey="value" fill="#2563eb" name="Completion Rate" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Visit Types</CardTitle>
                  <CardDescription>Distribution of visit types</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={visitTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {visitTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [value, 'Visits']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Visits Tab */}
          <TabsContent value="visits" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Visit Analytics</h2>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Consumer Visits</p>
                      <h3 className="text-2xl font-bold mt-1">{formatNumber(analytics?.visitTypes?.consumer || 0)}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <BarChart2 className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Shop Visits</p>
                      <h3 className="text-2xl font-bold mt-1">{formatNumber(analytics?.visitTypes?.shop || 0)}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                      <BarChart2 className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Avg. Duration</p>
                      <h3 className="text-2xl font-bold mt-1">{analytics?.averageVisitDuration || 0} min</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <Calendar className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Visit Trend by Day</CardTitle>
                  <CardDescription>Number of visits per day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={visitChartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#2563eb" name="Visits" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Visit Distribution by Type</CardTitle>
                  <CardDescription>Consumer vs Shop visits</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={visitTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {visitTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [value, 'Visits']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Visits</CardTitle>
                <CardDescription>Latest visits by your team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Agent</th>
                        <th className="text-left py-3 px-4 font-medium">Type</th>
                        <th className="text-left py-3 px-4 font-medium">Location</th>
                        <th className="text-left py-3 px-4 font-medium">Date</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visits.slice(0, 5).map((visit) => (
                        <tr key={visit.id} className="border-b">
                          <td className="py-3 px-4">
                            {agents.find(a => a.id === visit.agentId)?.name || 'Unknown'}
                          </td>
                          <td className="py-3 px-4 capitalize">{visit.type}</td>
                          <td className="py-3 px-4">
                            {visit.type === 'consumer' 
                              ? `Consumer: ${visit.consumerDetails.name}`
                              : `Shop: ${visit.shopDetails.name}`
                            }
                          </td>
                          <td className="py-3 px-4">{formatDate(visit.date)}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              visit.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : visit.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                            }`}>
                              {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Agent Performance Tab */}
          <TabsContent value="agents" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Agent Performance</h2>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Visits by Agent</CardTitle>
                  <CardDescription>Number of visits completed by each agent</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={agentPerformanceData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={80} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="visits" fill="#2563eb" name="Visits" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Conversions by Agent</CardTitle>
                  <CardDescription>Number of conversions achieved by each agent</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={agentPerformanceData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={80} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="conversions" fill="#ec4899" name="Conversions" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Goal Completion by Agent</CardTitle>
                <CardDescription>Percentage of goals completed by each agent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={agentPerformanceData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Goal Completion']} />
                      <Legend />
                      <Bar dataKey="goalCompletion" fill="#10b981" name="Goal Completion" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Call Cycles Tab */}
          <TabsContent value="callcycles" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Call Cycle Analytics</h2>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Call Cycle Adherence</CardTitle>
                <CardDescription>Percentage of scheduled visits completed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={callCycleAdherenceData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Adherence Rate']} />
                      <Legend />
                      <Bar dataKey="adherence" fill="#f59e0b" name="Adherence Rate" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Visit Frequency by Location</CardTitle>
                  <CardDescription>Number of visits per location</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analytics?.visitFrequency?.map(loc => ({
                          name: loc.name.length > 15 ? loc.name.substring(0, 15) + '...' : loc.name,
                          visits: loc.visits
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={120} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="visits" fill="#6366f1" name="Visits" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Call Cycle Completion Trend</CardTitle>
                  <CardDescription>Completion rate over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={analytics?.callCycleCompletionTrend?.periods.map((period, index) => ({
                          name: period,
                          value: analytics.callCycleCompletionTrend.data[index]
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `${value}%`} />
                        <Tooltip formatter={(value) => [`${value}%`, 'Completion Rate']} />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="#2563eb" name="Completion Rate" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Coverage Map Tab */}
          <TabsContent value="coverage" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Coverage Map</h2>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Visit Heatmap</CardTitle>
                <CardDescription>Geographical distribution of visits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[500px] w-full bg-gray-100 rounded-md flex items-center justify-center">
                  <div className="text-center">
                    <Map className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Map visualization would be displayed here</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Showing {heatmapData.locations.length} visit locations
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Coverage by Area</CardTitle>
                  <CardDescription>Visit distribution by geographical area</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analytics?.coverageByArea?.map(area => ({
                            name: area.name,
                            value: area.visits
                          }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {analytics?.coverageByArea?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [value, 'Visits']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Uncovered Areas</CardTitle>
                  <CardDescription>Areas with low or no visit coverage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Area</th>
                          <th className="text-left py-3 px-4 font-medium">Last Visit</th>
                          <th className="text-left py-3 px-4 font-medium">Coverage</th>
                          <th className="text-left py-3 px-4 font-medium">Priority</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics?.uncoveredAreas?.map((area, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-3 px-4">{area.name}</td>
                            <td className="py-3 px-4">{area.lastVisit ? formatDate(area.lastVisit) : 'Never'}</td>
                            <td className="py-3 px-4">{formatPercentage(area.coverage)}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                area.priority === 'high' 
                                  ? 'bg-rose-100 text-rose-800' 
                                  : area.priority === 'medium'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-blue-100 text-blue-800'
                              }`}>
                                {area.priority.charAt(0).toUpperCase() + area.priority.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnalyticsPage;