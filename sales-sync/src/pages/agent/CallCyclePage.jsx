import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { getCallCyclesByAgent, CYCLE_FREQUENCIES, CYCLE_STATUS } from '../../data';
import { formatDate } from '../../lib/utils';
import { Calendar, MapPin, Clock, CheckCircle, AlertCircle, BarChart2 } from 'lucide-react';

const CallCyclePage = () => {
  const { user } = useAuth();
  const [callCycles, setCallCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCycle, setSelectedCycle] = useState(null);

  useEffect(() => {
    if (user) {
      // In a real app, this would be an API call
      const userCallCycles = getCallCyclesByAgent(user.id);
      setCallCycles(userCallCycles);
      if (userCallCycles.length > 0) {
        setSelectedCycle(userCallCycles[0]);
      }
      setLoading(false);
    }
  }, [user]);

  const getFilteredCallCycles = () => {
    if (activeTab === 'all') return callCycles;
    return callCycles.filter(cycle => cycle.frequency === activeTab);
  };

  const getCycleStatusBadge = (status) => {
    switch (status) {
      case CYCLE_STATUS.ACTIVE:
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case CYCLE_STATUS.COMPLETED:
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Completed</Badge>;
      case CYCLE_STATUS.PENDING:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Unknown</Badge>;
    }
  };

  const getFrequencyBadge = (frequency) => {
    switch (frequency) {
      case CYCLE_FREQUENCIES.DAILY:
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Daily</Badge>;
      case CYCLE_FREQUENCIES.WEEKLY:
        return <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">Weekly</Badge>;
      case CYCLE_FREQUENCIES.MONTHLY:
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Monthly</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Unknown</Badge>;
    }
  };

  const formatFrequency = (frequency) => {
    return frequency.charAt(0).toUpperCase() + frequency.slice(1);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p>Loading call cycles...</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredCallCycles = getFilteredCallCycles();
  const activeCycles = callCycles.filter(cycle => cycle.status === CYCLE_STATUS.ACTIVE).length;
  const totalLocations = callCycles.reduce((total, cycle) => total + cycle.locations.length, 0);
  const averageAdherence = callCycles.length > 0 
    ? callCycles.reduce((total, cycle) => total + cycle.adherenceRate, 0) / callCycles.length 
    : 0;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Your Call Cycles</h1>
            <p className="text-muted-foreground mt-1">View and manage your assigned call cycles</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Cycles</p>
                  <h3 className="text-2xl font-bold mt-1">{activeCycles}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Calendar className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Locations</p>
                  <h3 className="text-2xl font-bold mt-1">{totalLocations}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Adherence</p>
                  <h3 className="text-2xl font-bold mt-1">{averageAdherence.toFixed(1)}%</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <BarChart2 className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {callCycles.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">No call cycles assigned yet</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Call Cycles</CardTitle>
                <CardDescription>
                  Your assigned recurring visit schedules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" onValueChange={setActiveTab}>
                  <TabsList className="mb-6">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value={CYCLE_FREQUENCIES.DAILY}>Daily</TabsTrigger>
                    <TabsTrigger value={CYCLE_FREQUENCIES.WEEKLY}>Weekly</TabsTrigger>
                    <TabsTrigger value={CYCLE_FREQUENCIES.MONTHLY}>Monthly</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value={activeTab} className="mt-0">
                    {filteredCallCycles.length === 0 ? (
                      <div className="text-center py-12">
                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="mt-4 text-muted-foreground">No {activeTab !== 'all' ? activeTab : ''} call cycles found</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredCallCycles.map((cycle) => (
                          <div 
                            key={cycle.id} 
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedCycle?.id === cycle.id 
                                ? 'border-primary bg-primary/5' 
                                : 'hover:border-primary/50'
                            }`}
                            onClick={() => setSelectedCycle(cycle)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{cycle.name}</h3>
                                <div className="flex items-center mt-1 space-x-2">
                                  {getFrequencyBadge(cycle.frequency)}
                                  {getCycleStatusBadge(cycle.status)}
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-sm text-muted-foreground">
                                  {cycle.locations.length} locations
                                </span>
                              </div>
                            </div>
                            <div className="mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>Due: {formatDate(cycle.endDate)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>
                  {selectedCycle ? selectedCycle.name : 'Call Cycle Details'}
                </CardTitle>
                <CardDescription>
                  {selectedCycle 
                    ? `${formatFrequency(selectedCycle.frequency)} cycle with ${selectedCycle.locations.length} locations`
                    : 'Select a call cycle to view details'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!selectedCycle ? (
                  <div className="text-center py-12">
                    <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">Select a call cycle to view details</p>
                  </div>
                ) : (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                        <p className="text-lg font-medium mt-1">{formatDate(selectedCycle.startDate)}</p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground">End Date</p>
                        <p className="text-lg font-medium mt-1">{formatDate(selectedCycle.endDate)}</p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground">Adherence Rate</p>
                        <p className="text-lg font-medium mt-1">{selectedCycle.adherenceRate}%</p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                        <div className="mt-1">
                          {getCycleStatusBadge(selectedCycle.status)}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-medium mb-4">Locations</h3>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-muted">
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Address</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {selectedCycle.locations.map((location) => (
                              <tr key={location.id} className="hover:bg-muted/50">
                                <td className="px-4 py-3 text-sm">{location.name}</td>
                                <td className="px-4 py-3 text-sm">{location.address}</td>
                                <td className="px-4 py-3 text-sm">{location.type}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {selectedCycle.notes && (
                      <div className="mt-6">
                        <h3 className="text-lg font-medium mb-2">Notes</h3>
                        <p className="text-sm text-muted-foreground">{selectedCycle.notes}</p>
                      </div>
                    )}

                    <div className="mt-6 flex justify-end">
                      <Button>Start Visit</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallCyclePage;