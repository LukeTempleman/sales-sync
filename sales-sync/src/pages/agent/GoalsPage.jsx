import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { getGoalsByUserId, GOAL_TYPES, GOAL_STATUS } from '../../services/goalsService';
import { formatDate, formatPercentage } from '../../lib/utils';
import { Target, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const GoalsPage = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchGoals = async () => {
      if (user) {
        try {
          setLoading(true);
          const userGoals = await getGoalsByUserId(user.id, user?.useRealApi);
          setGoals(userGoals);
        } catch (error) {
          console.error('Error fetching goals:', error);
          // Handle error state here
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchGoals();
  }, [user]);

  const getFilteredGoals = () => {
    if (activeTab === 'all') return goals;
    return goals.filter(goal => goal.type === activeTab);
  };

  const getGoalStatusIcon = (status, progress) => {
    if (status === GOAL_STATUS.COMPLETED) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
    
    if (status === GOAL_STATUS.IN_PROGRESS) {
      if (progress >= 75) {
        return <Clock className="h-5 w-5 text-blue-600" />;
      }
      return <Clock className="h-5 w-5 text-yellow-600" />;
    }
    
    return <AlertCircle className="h-5 w-5 text-rose-600" />;
  };

  const getGoalStatusClass = (status, progress) => {
    if (status === GOAL_STATUS.COMPLETED) {
      return 'bg-green-100 text-green-800';
    }
    
    if (status === GOAL_STATUS.IN_PROGRESS) {
      if (progress >= 75) {
        return 'bg-blue-100 text-blue-800';
      }
      return 'bg-yellow-100 text-yellow-800';
    }
    
    return 'bg-rose-100 text-rose-800';
  };

  const getGoalMetricIcon = (metric) => {
    switch (metric) {
      case 'visits':
        return <Calendar className="h-5 w-5 text-blue-600" />;
      case 'conversions':
        return <Target className="h-5 w-5 text-purple-600" />;
      case 'shelf_share':
        return <Target className="h-5 w-5 text-green-600" />;
      case 'shops_trained':
        return <Target className="h-5 w-5 text-orange-600" />;
      default:
        return <Target className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatMetric = (metric) => {
    return metric.replace('_', ' ').toUpperCase();
  };

  const formatGoalType = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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

  const filteredGoals = getFilteredGoals();
  const completedGoals = goals.filter(goal => goal.status === GOAL_STATUS.COMPLETED).length;
  const totalGoals = goals.length;
  const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Your Goals</h1>
            <p className="text-gray-500 mt-1">Track and manage your assigned goals</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Goals</p>
                  <h3 className="text-2xl font-bold mt-1">{totalGoals}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Target className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Completed Goals</p>
                  <h3 className="text-2xl font-bold mt-1">{completedGoals}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                  <h3 className="text-2xl font-bold mt-1">{formatPercentage(completionRate)}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Goal Tracking</CardTitle>
            <CardDescription>
              Monitor your progress on assigned goals
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                    <Target className="h-12 w-12 mx-auto text-gray-300" />
                    <p className="mt-4 text-gray-500">No {activeTab !== 'all' ? activeTab : ''} goals found</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredGoals.map((goal) => (
                      <div key={goal.id} className="border rounded-lg overflow-hidden">
                        <div className="p-4 bg-white">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 mt-1">
                                {getGoalMetricIcon(goal.metric)}
                              </div>
                              <div>
                                <div className="flex items-center">
                                  <h3 className="font-medium">{formatMetric(goal.metric)}</h3>
                                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {formatGoalType(goal.type)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                  Target: {goal.target} {goal.metric === 'shelf_share' ? '%' : ''}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Assigned by: {goal.assignedBy.name}
                                </p>
                              </div>
                            </div>
                            
                            <div className="mt-4 md:mt-0 flex flex-col items-end">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                getGoalStatusClass(goal.status, goal.progress)
                              }`}>
                                <div className="flex items-center">
                                  {getGoalStatusIcon(goal.status, goal.progress)}
                                  <span className="ml-1">
                                    {goal.status === GOAL_STATUS.COMPLETED 
                                      ? 'Completed' 
                                      : `${goal.progress}% Complete`}
                                  </span>
                                </div>
                              </span>
                              <div className="text-sm text-gray-500 mt-1">
                                {goal.status !== GOAL_STATUS.COMPLETED && (
                                  <span>
                                    {getDaysRemaining(goal.endDate)} days remaining
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className={`h-2.5 rounded-full ${
                                  goal.status === GOAL_STATUS.COMPLETED 
                                    ? 'bg-green-600' 
                                    : goal.progress >= 75 
                                      ? 'bg-blue-600' 
                                      : 'bg-yellow-600'
                                }`}
                                style={{ width: `${goal.progress}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex justify-between text-sm text-gray-500">
                            <span>Start: {formatDate(goal.startDate)}</span>
                            <span>Due: {formatDate(goal.endDate)}</span>
                          </div>
                          
                          {goal.description && (
                            <div className="mt-4 pt-4 border-t">
                              <p className="text-sm">{goal.description}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
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

export default GoalsPage;