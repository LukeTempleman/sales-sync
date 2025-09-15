import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import DataTable from '../../components/tables/DataTable';
import { 
  getCallCyclesByTeamLeader, 
  getAgentsByTeamLeader,
  CALL_CYCLE_FREQUENCY,
  CALL_CYCLE_STATUS
} from '../../data';
import { formatPercentage, formatDate } from '../../lib/utils';
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash, 
  MapPin, 
  Users, 
  Clock, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const CallCyclesPage = () => {
  const { user } = useAuth();
  const [callCycles, setCallCycles] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddCycle, setShowAddCycle] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: CALL_CYCLE_FREQUENCY.WEEKLY,
    startDate: '',
    endDate: '',
    locations: [],
    assignedAgents: [],
    status: CALL_CYCLE_STATUS.ACTIVE,
  });
  const [newLocation, setNewLocation] = useState('');

  useEffect(() => {
    if (user) {
      // In a real app, these would be API calls
      const teamCallCycles = getCallCyclesByTeamLeader(user.id);
      const teamAgents = getAgentsByTeamLeader(user.id);
      
      setCallCycles(teamCallCycles);
      setAgents(teamAgents);
      setLoading(false);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCycle = () => {
    setShowAddCycle(true);
    setSelectedCycle(null);
    setFormData({
      name: '',
      description: '',
      frequency: CALL_CYCLE_FREQUENCY.WEEKLY,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      locations: [],
      assignedAgents: [],
      status: CALL_CYCLE_STATUS.ACTIVE,
    });
  };

  const handleEditCycle = (cycle) => {
    setShowAddCycle(true);
    setSelectedCycle(cycle);
    setFormData({
      name: cycle.name,
      description: cycle.description || '',
      frequency: cycle.frequency,
      startDate: new Date(cycle.startDate).toISOString().split('T')[0],
      endDate: new Date(cycle.endDate).toISOString().split('T')[0],
      locations: cycle.locations || [],
      assignedAgents: cycle.assignedAgents || [],
      status: cycle.status,
    });
  };

  const handleAddLocation = () => {
    if (newLocation.trim()) {
      setFormData((prev) => ({
        ...prev,
        locations: [...prev.locations, newLocation.trim()]
      }));
      setNewLocation('');
    }
  };

  const handleRemoveLocation = (index) => {
    setFormData((prev) => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index)
    }));
  };

  const handleAgentSelection = (agentId) => {
    setFormData((prev) => {
      const isSelected = prev.assignedAgents.includes(agentId);
      return {
        ...prev,
        assignedAgents: isSelected
          ? prev.assignedAgents.filter(id => id !== agentId)
          : [...prev.assignedAgents, agentId]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, this would be an API call to create or update a call cycle
    if (selectedCycle) {
      // Update existing call cycle
      const updatedCallCycles = callCycles.map(cycle => 
        cycle.id === selectedCycle.id ? { ...cycle, ...formData } : cycle
      );
      setCallCycles(updatedCallCycles);
    } else {
      // Add new call cycle
      const newCallCycle = {
        id: `cycle-${Date.now()}`,
        ...formData,
        tenantId: user.tenantId,
        teamLeaderId: user.id,
        createdBy: user.id,
        createdAt: new Date().toISOString(),
        adherenceRate: 0,
      };
      setCallCycles([...callCycles, newCallCycle]);
    }
    
    setShowAddCycle(false);
    setSelectedCycle(null);
  };

  const handleDeleteCycle = (cycleId) => {
    // In a real app, this would be an API call to delete a call cycle
    const updatedCallCycles = callCycles.filter(cycle => cycle.id !== cycleId);
    setCallCycles(updatedCallCycles);
  };

  const getFilteredCallCycles = () => {
    if (activeTab === 'all') return callCycles;
    return callCycles.filter(cycle => cycle.status === activeTab);
  };

  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.name}</p>
          <p className="text-xs text-gray-500">{row.original.description}</p>
        </div>
      ),
    },
    {
      accessorKey: 'frequency',
      header: 'Frequency',
      cell: ({ row }) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {row.original.frequency}
        </span>
      ),
    },
    {
      accessorKey: 'locations',
      header: 'Locations',
      cell: ({ row }) => `${row.original.locations.length} locations`,
    },
    {
      accessorKey: 'assignedAgents',
      header: 'Agents',
      cell: ({ row }) => `${row.original.assignedAgents.length} agents`,
    },
    {
      accessorKey: 'adherenceRate',
      header: 'Adherence',
      cell: ({ row }) => formatPercentage(row.original.adherenceRate),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === CALL_CYCLE_STATUS.ACTIVE 
              ? 'bg-green-100 text-green-800' 
              : status === CALL_CYCLE_STATUS.PENDING
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
          }`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleEditCycle(row.original)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleDeleteCycle(row.original.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

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

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Call Cycles</h1>
            <p className="text-gray-500 mt-1">Manage recurring visit schedules for your team</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button onClick={handleAddCycle}>
              <Plus className="h-4 w-4 mr-2" />
              Create Call Cycle
            </Button>
          </div>
        </div>

        {/* Call Cycle Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Call Cycles</p>
                  <h3 className="text-2xl font-bold mt-1">{callCycles.length}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Calendar className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Cycles</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {callCycles.filter(cycle => cycle.status === CALL_CYCLE_STATUS.ACTIVE).length}
                  </h3>
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
                  <p className="text-sm font-medium text-gray-500">Avg. Adherence Rate</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {formatPercentage(
                      callCycles.length > 0
                        ? callCycles.reduce((sum, cycle) => sum + cycle.adherenceRate, 0) / callCycles.length
                        : 0
                    )}
                  </h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                  <AlertCircle className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Call Cycle Form */}
        {showAddCycle && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{selectedCycle ? 'Edit Call Cycle' : 'Create New Call Cycle'}</CardTitle>
              <CardDescription>
                {selectedCycle 
                  ? 'Update the call cycle details' 
                  : 'Define a new recurring schedule of visits for your team'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Call Cycle Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="frequency">Frequency</Label>
                      <select
                        id="frequency"
                        name="frequency"
                        value={formData.frequency}
                        onChange={handleInputChange}
                        className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                        required
                      >
                        <option value={CALL_CYCLE_FREQUENCY.DAILY}>Daily</option>
                        <option value={CALL_CYCLE_FREQUENCY.WEEKLY}>Weekly</option>
                        <option value={CALL_CYCLE_FREQUENCY.MONTHLY}>Monthly</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full min-h-[100px] rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                      placeholder="Enter a description for this call cycle..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                      required
                    >
                      <option value={CALL_CYCLE_STATUS.ACTIVE}>Active</option>
                      <option value={CALL_CYCLE_STATUS.PENDING}>Pending</option>
                      <option value={CALL_CYCLE_STATUS.COMPLETED}>Completed</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Locations</Label>
                    <div className="flex space-x-2">
                      <Input
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        placeholder="Enter location name or address"
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        onClick={handleAddLocation}
                      >
                        Add
                      </Button>
                    </div>
                    
                    <div className="mt-4">
                      {formData.locations.length === 0 ? (
                        <p className="text-sm text-gray-500">No locations added yet</p>
                      ) : (
                        <div className="space-y-2">
                          {formData.locations.map((location, index) => (
                            <div 
                              key={index} 
                              className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                            >
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                                <span>{location}</span>
                              </div>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleRemoveLocation(index)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Assign Agents</Label>
                    <div className="mt-2 border rounded-md divide-y">
                      {agents.length === 0 ? (
                        <p className="p-4 text-sm text-gray-500">No agents available</p>
                      ) : (
                        agents.map((agent) => (
                          <div 
                            key={agent.id} 
                            className="flex items-center p-3"
                          >
                            <input
                              type="checkbox"
                              id={`agent-${agent.id}`}
                              checked={formData.assignedAgents.includes(agent.id)}
                              onChange={() => handleAgentSelection(agent.id)}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                            />
                            <label 
                              htmlFor={`agent-${agent.id}`}
                              className="ml-3 flex items-center"
                            >
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                <span className="text-blue-600 font-semibold">
                                  {agent.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium">{agent.name}</p>
                                <p className="text-xs text-gray-500">{agent.email}</p>
                              </div>
                            </label>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6 space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAddCycle(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {selectedCycle ? 'Update Call Cycle' : 'Create Call Cycle'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Call Cycles Table */}
        <Card>
          <CardHeader>
            <CardTitle>Call Cycles</CardTitle>
            <CardDescription>
              View and manage all call cycles for your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" onValueChange={setActiveTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="all">All Cycles</TabsTrigger>
                <TabsTrigger value={CALL_CYCLE_STATUS.ACTIVE}>Active</TabsTrigger>
                <TabsTrigger value={CALL_CYCLE_STATUS.PENDING}>Pending</TabsTrigger>
                <TabsTrigger value={CALL_CYCLE_STATUS.COMPLETED}>Completed</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <DataTable
              columns={columns}
              data={filteredCallCycles}
              searchKey="name"
              searchPlaceholder="Search call cycles..."
            />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <MapPin className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="font-medium mb-2">Location Management</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Manage and organize visit locations
                </p>
                <Button variant="outline" className="w-full">
                  Manage Locations
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Users className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="font-medium mb-2">Team Assignment</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Assign call cycles to team members
                </p>
                <Button variant="outline" className="w-full">
                  Assign Teams
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Clock className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="font-medium mb-2">Schedule Templates</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Create reusable schedule templates
                </p>
                <Button variant="outline" className="w-full">
                  Manage Templates
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CallCyclesPage;