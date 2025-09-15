import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import Badge from '../../components/ui/badge';
import { 
  allGoals, 
  GOAL_TYPES, 
  GOAL_METRICS, 
  GOAL_STATUS, 
  getGoalsByTenant, 
  getGoalsByType, 
  getGoalsByMetric, 
  getGoalsByStatus 
} from '../../data';
import { allUsers, getUsersByTenant, ROLES } from '../../data';
import { formatDate, formatPercentage } from '../../lib/utils';
import { 
  Target, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Search, 
  Plus, 
  Filter, 
  BarChart2, 
  Users, 
  Trash2, 
  Edit 
} from 'lucide-react';

const GoalManagementPage = () => {
  const { user, tenant } = useAuth();
  const [goals, setGoals] = useState([]);
  const [filteredGoals, setFilteredGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterMetric, setFilterMetric] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddGoalForm, setShowAddGoalForm] = useState(false);
  const [tenantUsers, setTenantUsers] = useState([]);

  // New goal form state
  const [newGoal, setNewGoal] = useState({
    type: GOAL_TYPES.MONTHLY,
    metric: GOAL_METRICS.VISITS,
    target: 10,
    assignedTo: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    if (tenant) {
      // In a real app, these would be API calls
      const tenantGoals = getGoalsByTenant(tenant.id);
      setGoals(tenantGoals);
      setFilteredGoals(tenantGoals);
      
      const users = getUsersByTenant(tenant.id);
      setTenantUsers(users);
      
      setLoading(false);
    }
  }, [tenant]);

  useEffect(() => {
    applyFilters();
  }, [activeTab, searchQuery, filterRole, filterMetric, filterStatus, goals]);

  const applyFilters = () => {
    let result = [...goals];
    
    // Apply tab filter (goal type)
    if (activeTab !== 'all') {
      result = result.filter(goal => goal.type === activeTab);
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(goal => {
        const assignedUser = allUsers.find(u => u.id === goal.assignedTo);
        const assignedByUser = allUsers.find(u => u.id === goal.assignedBy);
        
        return (
          (assignedUser && assignedUser.name.toLowerCase().includes(query)) ||
          (assignedByUser && assignedByUser.name.toLowerCase().includes(query)) ||
          (goal.notes && goal.notes.toLowerCase().includes(query))
        );
      });
    }
    
    // Apply role filter
    if (filterRole !== 'all') {
      result = result.filter(goal => {
        const assignedUser = allUsers.find(u => u.id === goal.assignedTo);
        return assignedUser && assignedUser.role === filterRole;
      });
    }
    
    // Apply metric filter
    if (filterMetric !== 'all') {
      result = result.filter(goal => goal.metric === filterMetric);
    }
    
    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(goal => goal.status === filterStatus);
    }
    
    setFilteredGoals(result);
  };

  const getGoalStatusBadge = (status, progress) => {
    switch (status) {
      case GOAL_STATUS.COMPLETED:
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case GOAL_STATUS.IN_PROGRESS:
        if (progress >= 75) {
          return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Almost Complete</Badge>;
        }
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">In Progress</Badge>;
      case GOAL_STATUS.PENDING:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Pending</Badge>;
      case GOAL_STATUS.FAILED:
        return <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100">Failed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Unknown</Badge>;
    }
  };

  const getGoalMetricBadge = (metric) => {
    switch (metric) {
      case GOAL_METRICS.VISITS:
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Visits</Badge>;
      case GOAL_METRICS.CONVERSIONS:
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Conversions</Badge>;
      case GOAL_METRICS.SHELF_SHARE:
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Shelf Share</Badge>;
      case GOAL_METRICS.SHOPS_TRAINED:
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Shops Trained</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Unknown</Badge>;
    }
  };

  const getGoalTypeBadge = (type) => {
    switch (type) {
      case GOAL_TYPES.DAILY:
        return <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">Daily</Badge>;
      case GOAL_TYPES.WEEKLY:
        return <Badge className="bg-violet-100 text-violet-800 hover:bg-violet-100">Weekly</Badge>;
      case GOAL_TYPES.MONTHLY:
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Monthly</Badge>;
      case GOAL_TYPES.QUARTERLY:
        return <Badge className="bg-cyan-100 text-cyan-800 hover:bg-cyan-100">Quarterly</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Unknown</Badge>;
    }
  };

  const formatRoleName = (role) => {
    return role.replace('_', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setNewGoal(prev => ({ ...prev, [name]: value }));
  };

  const handleAddGoal = () => {
    // In a real app, this would be an API call
    const newGoalObj = {
      id: Math.max(...goals.map(g => g.id)) + 1,
      ...newGoal,
      progress: 0,
      status: GOAL_STATUS.PENDING,
      assignedBy: user.id,
      tenantId: tenant.id,
      startDate: new Date(newGoal.startDate),
      endDate: new Date(newGoal.endDate)
    };
    
    setGoals(prev => [...prev, newGoalObj]);
    setShowAddGoalForm(false);
    
    // Reset form
    setNewGoal({
      type: GOAL_TYPES.MONTHLY,
      metric: GOAL_METRICS.VISITS,
      target: 10,
      assignedTo: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
      notes: ''
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p>Loading goals...</p>
          </div>
        </div>
      </div>
    );
  }

  const pendingGoals = goals.filter(goal => goal.status === GOAL_STATUS.PENDING).length;
  const completedGoals = goals.filter(goal => goal.status === GOAL_STATUS.COMPLETED).length;
  const inProgressGoals = goals.filter(goal => goal.status === GOAL_STATUS.IN_PROGRESS).length;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Goal Management</h1>
            <p className="text-muted-foreground mt-1">Create and manage goals across your organization</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button onClick={() => setShowAddGoalForm(!showAddGoalForm)}>
              {showAddGoalForm ? 'Cancel' : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Goal
                </>
              )}
            </Button>
          </div>
        </div>

        {showAddGoalForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New Goal</CardTitle>
              <CardDescription>
                Set up a new goal to assign to users in your organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="type">Goal Type</Label>
                    <Select 
                      name="type" 
                      value={newGoal.type} 
                      onValueChange={(value) => handleSelectChange('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={GOAL_TYPES.DAILY}>Daily</SelectItem>
                        <SelectItem value={GOAL_TYPES.WEEKLY}>Weekly</SelectItem>
                        <SelectItem value={GOAL_TYPES.MONTHLY}>Monthly</SelectItem>
                        <SelectItem value={GOAL_TYPES.QUARTERLY}>Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="metric">Metric</Label>
                    <Select 
                      name="metric" 
                      value={newGoal.metric} 
                      onValueChange={(value) => handleSelectChange('metric', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select metric" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={GOAL_METRICS.VISITS}>Visits</SelectItem>
                        <SelectItem value={GOAL_METRICS.CONVERSIONS}>Conversions</SelectItem>
                        <SelectItem value={GOAL_METRICS.SHELF_SHARE}>Shelf Share</SelectItem>
                        <SelectItem value={GOAL_METRICS.SHOPS_TRAINED}>Shops Trained</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="target">Target Value</Label>
                    <Input 
                      id="target" 
                      name="target" 
                      type="number" 
                      value={newGoal.target} 
                      onChange={handleInputChange} 
                      min="1"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="assignedTo">Assign To</Label>
                    <Select 
                      name="assignedTo" 
                      value={newGoal.assignedTo} 
                      onValueChange={(value) => handleSelectChange('assignedTo', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                      <SelectContent>
                        {tenantUsers.map(user => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.name} ({formatRoleName(user.role)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input 
                      id="startDate" 
                      name="startDate" 
                      type="date" 
                      value={newGoal.startDate} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input 
                      id="endDate" 
                      name="endDate" 
                      type="date" 
                      value={newGoal.endDate} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input 
                    id="notes" 
                    name="notes" 
                    value={newGoal.notes} 
                    onChange={handleInputChange} 
                    placeholder="Additional details about this goal"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={handleAddGoal}
                  disabled={!newGoal.assignedTo}
                >
                  Create Goal
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Goals</p>
                  <h3 className="text-2xl font-bold mt-1">{pendingGoals}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                  <h3 className="text-2xl font-bold mt-1">{inProgressGoals}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Target className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <h3 className="text-2xl font-bold mt-1">{completedGoals}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Goals</CardTitle>
            <CardDescription>
              Manage and track all goals across your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="Search goals..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value={ROLES.AGENT}>Agents</SelectItem>
                    <SelectItem value={ROLES.TEAM_LEADER}>Team Leaders</SelectItem>
                    <SelectItem value={ROLES.AREA_MANAGER}>Area Managers</SelectItem>
                    <SelectItem value={ROLES.REGIONAL_MANAGER}>Regional Managers</SelectItem>
                    <SelectItem value={ROLES.NATIONAL_MANAGER}>National Managers</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterMetric} onValueChange={setFilterMetric}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Metrics</SelectItem>
                    <SelectItem value={GOAL_METRICS.VISITS}>Visits</SelectItem>
                    <SelectItem value={GOAL_METRICS.CONVERSIONS}>Conversions</SelectItem>
                    <SelectItem value={GOAL_METRICS.SHELF_SHARE}>Shelf Share</SelectItem>
                    <SelectItem value={GOAL_METRICS.SHOPS_TRAINED}>Shops Trained</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value={GOAL_STATUS.PENDING}>Pending</SelectItem>
                    <SelectItem value={GOAL_STATUS.IN_PROGRESS}>In Progress</SelectItem>
                    <SelectItem value={GOAL_STATUS.COMPLETED}>Completed</SelectItem>
                    <SelectItem value={GOAL_STATUS.FAILED}>Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Tabs defaultValue="all" onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Goals</TabsTrigger>
                <TabsTrigger value={GOAL_TYPES.DAILY}>Daily</TabsTrigger>
                <TabsTrigger value={GOAL_TYPES.WEEKLY}>Weekly</TabsTrigger>
                <TabsTrigger value={GOAL_TYPES.MONTHLY}>Monthly</TabsTrigger>
                <TabsTrigger value={GOAL_TYPES.QUARTERLY}>Quarterly</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-0">
                {filteredGoals.length === 0 ? (
                  <div className="text-center py-12">
                    <Target className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">No goals found matching your filters</p>
                  </div>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-muted">
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Assigned To</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Metric</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Target</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Progress</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Due Date</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {filteredGoals.map((goal) => {
                            const assignedUser = allUsers.find(u => u.id === goal.assignedTo);
                            return (
                              <tr key={goal.id} className="hover:bg-muted/50">
                                <td className="px-4 py-3 text-sm">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-2">
                                      <span className="font-medium">{assignedUser?.name.charAt(0) || '?'}</span>
                                    </div>
                                    <div>
                                      <p className="font-medium">{assignedUser?.name || 'Unknown'}</p>
                                      <p className="text-xs text-muted-foreground">{formatRoleName(assignedUser?.role || '')}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  {getGoalTypeBadge(goal.type)}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  {getGoalMetricBadge(goal.metric)}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  {goal.target} {goal.metric === GOAL_METRICS.SHELF_SHARE ? '%' : ''}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  <div className="w-full bg-muted rounded-full h-2">
                                    <div 
                                      className={`h-2 rounded-full ${
                                        goal.status === GOAL_STATUS.COMPLETED 
                                          ? 'bg-green-600' 
                                          : goal.progress >= 75 
                                            ? 'bg-blue-600' 
                                            : 'bg-yellow-600'
                                      }`}
                                      style={{ width: `${goal.progress}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-muted-foreground mt-1 block">
                                    {goal.progress}%
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  {getGoalStatusBadge(goal.status, goal.progress)}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  {formatDate(goal.endDate)}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  <div className="flex space-x-2">
                                    <Button variant="ghost" size="icon">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GoalManagementPage;