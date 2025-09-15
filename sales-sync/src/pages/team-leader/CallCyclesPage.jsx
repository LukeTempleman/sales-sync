import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ChevronDown, 
  Edit, 
  Trash2, 
  Eye,
  Trash
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../../components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '../../components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../components/ui/select';
import { Separator } from '../../components/ui/separator';
import { Switch } from '../../components/ui/switch';
import { Checkbox } from '../../components/ui/checkbox';
import DataTable from '../../components/tables/DataTable';
import { 
  getCallCyclesByTeamLeader, 
  getAgentsByTeamLeader, 
  CYCLE_FREQUENCIES, 
  CYCLE_STATUS,
  locations
} from '../../data';
import { formatPercentage, formatDate } from '../../lib/utils';

const CallCyclesPage = () => {
  const { user } = useAuth();
  const [callCycles, setCallCycles] = useState([]);
  const [agents, setAgents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [frequencyFilter, setFrequencyFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(null);
  const [newCycle, setNewCycle] = useState({
    name: '',
    frequency: CYCLE_FREQUENCIES.WEEKLY,
    assignedTo: '',
    locations: [],
    status: CYCLE_STATUS.PENDING,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: ''
  });
  const [availableLocations, setAvailableLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      // In a real app, these would be API calls
      const teamCallCycles = getCallCyclesByTeamLeader(user.id);
      const teamAgents = getAgentsByTeamLeader(user.id);
      
      setCallCycles(teamCallCycles);
      setAgents(teamAgents);
      setAvailableLocations(locations);
      setLoading(false);
    }
  }, [user]);

  // Filter call cycles based on search query and filters
  const filteredCallCycles = callCycles.filter(cycle => {
    const matchesSearch = cycle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (cycle.notes && cycle.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || cycle.status === statusFilter;
    const matchesFrequency = frequencyFilter === 'all' || cycle.frequency === frequencyFilter;
    
    return matchesSearch && matchesStatus && matchesFrequency;
  });

  // Group call cycles by status
  const activeCycles = filteredCallCycles.filter(cycle => cycle.status === CYCLE_STATUS.ACTIVE);
  const pendingCycles = filteredCallCycles.filter(cycle => cycle.status === CYCLE_STATUS.PENDING);
  const completedCycles = filteredCallCycles.filter(cycle => cycle.status === CYCLE_STATUS.COMPLETED);

  // Filter locations based on search query
  const filteredLocations = availableLocations.filter(location => 
    location.name.toLowerCase().includes(locationSearchQuery.toLowerCase()) ||
    location.address.toLowerCase().includes(locationSearchQuery.toLowerCase())
  );

  const handleCreateCycle = () => {
    // In a real app, this would be an API call
    const newId = Math.max(...callCycles.map(c => c.id || 0), 0) + 1;
    const createdCycle = {
      ...newCycle,
      id: newId,
      assignedBy: user.id,
      adherenceRate: 0,
      tenantId: user.tenantId,
      locations: selectedLocations
    };
    
    setCallCycles([...callCycles, createdCycle]);
    setShowCreateDialog(false);
    setNewCycle({
      name: '',
      frequency: CYCLE_FREQUENCIES.WEEKLY,
      assignedTo: '',
      locations: [],
      status: CYCLE_STATUS.PENDING,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: ''
    });
    setSelectedLocations([]);
  };

  const handleEditCycle = () => {
    // In a real app, this would be an API call
    const updatedCycles = callCycles.map(cycle => 
      cycle.id === currentCycle.id ? { ...currentCycle, locations: selectedLocations } : cycle
    );
    
    setCallCycles(updatedCycles);
    setShowEditDialog(false);
    setCurrentCycle(null);
    setSelectedLocations([]);
  };

  const handleDeleteCycle = () => {
    // In a real app, this would be an API call
    const updatedCycles = callCycles.filter(cycle => cycle.id !== currentCycle.id);
    
    setCallCycles(updatedCycles);
    setShowDeleteDialog(false);
    setCurrentCycle(null);
  };

  const handleViewCycle = (cycle) => {
    setCurrentCycle(cycle);
    setSelectedLocations(cycle.locations);
    setShowViewDialog(true);
  };

  const handleEditClick = (cycle) => {
    setCurrentCycle(cycle);
    setSelectedLocations(cycle.locations);
    setShowEditDialog(true);
  };

  const handleDeleteClick = (cycle) => {
    setCurrentCycle(cycle);
    setShowDeleteDialog(true);
  };

  const toggleLocationSelection = (location) => {
    if (selectedLocations.some(loc => loc.id === location.id)) {
      setSelectedLocations(selectedLocations.filter(loc => loc.id !== location.id));
    } else {
      setSelectedLocations([...selectedLocations, location]);
    }
  };

  const getAgentName = (agentId) => {
    const agent = agents.find(a => a.id === agentId);
    return agent ? agent.name : 'Unassigned';
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case CYCLE_STATUS.ACTIVE:
        return 'bg-green-100 text-green-800';
      case CYCLE_STATUS.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case CYCLE_STATUS.COMPLETED:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFrequencyBadgeColor = (frequency) => {
    switch (frequency) {
      case CYCLE_FREQUENCIES.DAILY:
        return 'bg-purple-100 text-purple-800';
      case CYCLE_FREQUENCIES.WEEKLY:
        return 'bg-blue-100 text-blue-800';
      case CYCLE_FREQUENCIES.MONTHLY:
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Call Cycle Card Component
  const CallCycleCard = ({ 
    cycle, 
    getAgentName, 
    getStatusBadgeColor, 
    getFrequencyBadgeColor,
    onView,
    onEdit,
    onDelete
  }) => {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{cycle.name}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onView}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            <Badge className={getStatusBadgeColor(cycle.status)}>
              {cycle.status.charAt(0).toUpperCase() + cycle.status.slice(1)}
            </Badge>
            <Badge className={getFrequencyBadgeColor(cycle.frequency)}>
              {cycle.frequency.charAt(0).toUpperCase() + cycle.frequency.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm">Assigned to: <span className="font-medium">{getAgentName(cycle.assignedTo)}</span></span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm">{cycle.locations.length} locations to visit</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm">
                {formatDate(new Date(cycle.startDate))} - {formatDate(new Date(cycle.endDate))}
              </span>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Adherence Rate:</span>
                <span className="text-sm font-medium">{formatPercentage(cycle.adherenceRate)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    cycle.adherenceRate >= 80 ? 'bg-green-600' : 
                    cycle.adherenceRate >= 50 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${cycle.adherenceRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={onView}>
            View Details
          </Button>
        </CardFooter>
      </Card>
    );
  };

  // DataTable columns configuration
  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.name}</p>
          <p className="text-xs text-gray-500">{row.original.notes}</p>
        </div>
      ),
    },
    {
      accessorKey: 'frequency',
      header: 'Frequency',
      cell: ({ row }) => (
        <Badge className={getFrequencyBadgeColor(row.original.frequency)}>
          {row.original.frequency.charAt(0).toUpperCase() + row.original.frequency.slice(1)}
        </Badge>
      ),
    },
    {
      accessorKey: 'locations',
      header: 'Locations',
      cell: ({ row }) => `${row.original.locations.length} locations`,
    },
    {
      accessorKey: 'assignedTo',
      header: 'Assigned To',
      cell: ({ row }) => getAgentName(row.original.assignedTo),
    },
    {
      accessorKey: 'adherenceRate',
      header: 'Adherence',
      cell: ({ row }) => formatPercentage(row.original.adherenceRate),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge className={getStatusBadgeColor(row.original.status)}>
          {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleViewCycle(row.original)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleEditClick(row.original)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleDeleteClick(row.original)}
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

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Call Cycles Management</h1>
            <p className="text-gray-500 mt-1">Create and manage recurring visit schedules for your team</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Call Cycle
            </Button>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search call cycles..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <span>Status</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value={CYCLE_STATUS.ACTIVE}>Active</SelectItem>
                <SelectItem value={CYCLE_STATUS.PENDING}>Pending</SelectItem>
                <SelectItem value={CYCLE_STATUS.COMPLETED}>Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={frequencyFilter} onValueChange={setFrequencyFilter}>
              <SelectTrigger className="w-[150px]">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Frequency</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Frequencies</SelectItem>
                <SelectItem value={CYCLE_FREQUENCIES.DAILY}>Daily</SelectItem>
                <SelectItem value={CYCLE_FREQUENCIES.WEEKLY}>Weekly</SelectItem>
                <SelectItem value={CYCLE_FREQUENCIES.MONTHLY}>Monthly</SelectItem>
              </SelectContent>
            </Select>
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
                    {callCycles.filter(cycle => cycle.status === CYCLE_STATUS.ACTIVE).length}
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

        {/* Call Cycles Tabs */}
        <Tabs defaultValue="active" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="active" className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Active ({activeCycles.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              Pending ({pendingCycles.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Completed ({completedCycles.length})
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              All ({filteredCallCycles.length})
            </TabsTrigger>
          </TabsList>

          {/* Active Call Cycles */}
          <TabsContent value="active">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeCycles.length > 0 ? (
                activeCycles.map((cycle) => (
                  <CallCycleCard 
                    key={cycle.id} 
                    cycle={cycle} 
                    getAgentName={getAgentName}
                    getStatusBadgeColor={getStatusBadgeColor}
                    getFrequencyBadgeColor={getFrequencyBadgeColor}
                    onView={() => handleViewCycle(cycle)}
                    onEdit={() => handleEditClick(cycle)}
                    onDelete={() => handleDeleteClick(cycle)}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-500">No active call cycles found.</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Pending Call Cycles */}
          <TabsContent value="pending">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingCycles.length > 0 ? (
                pendingCycles.map((cycle) => (
                  <CallCycleCard 
                    key={cycle.id} 
                    cycle={cycle} 
                    getAgentName={getAgentName}
                    getStatusBadgeColor={getStatusBadgeColor}
                    getFrequencyBadgeColor={getFrequencyBadgeColor}
                    onView={() => handleViewCycle(cycle)}
                    onEdit={() => handleEditClick(cycle)}
                    onDelete={() => handleDeleteClick(cycle)}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-500">No pending call cycles found.</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Completed Call Cycles */}
          <TabsContent value="completed">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedCycles.length > 0 ? (
                completedCycles.map((cycle) => (
                  <CallCycleCard 
                    key={cycle.id} 
                    cycle={cycle} 
                    getAgentName={getAgentName}
                    getStatusBadgeColor={getStatusBadgeColor}
                    getFrequencyBadgeColor={getFrequencyBadgeColor}
                    onView={() => handleViewCycle(cycle)}
                    onEdit={() => handleEditClick(cycle)}
                    onDelete={() => handleDeleteClick(cycle)}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-500">No completed call cycles found.</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* All Call Cycles */}
          <TabsContent value="all">
            <DataTable columns={columns} data={filteredCallCycles} />
          </TabsContent>
        </Tabs>

        {/* Create Call Cycle Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create New Call Cycle</DialogTitle>
              <DialogDescription>
                Create a new recurring schedule of locations assigned to agents
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Call Cycle Name</Label>
                  <Input
                    id="name"
                    placeholder="Weekly Store Visits"
                    value={newCycle.name}
                    onChange={(e) => setNewCycle({ ...newCycle, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select 
                    value={newCycle.frequency} 
                    onValueChange={(value) => setNewCycle({ ...newCycle, frequency: value })}
                  >
                    <SelectTrigger id="frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={CYCLE_FREQUENCIES.DAILY}>Daily</SelectItem>
                      <SelectItem value={CYCLE_FREQUENCIES.WEEKLY}>Weekly</SelectItem>
                      <SelectItem value={CYCLE_FREQUENCIES.MONTHLY}>Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newCycle.startDate}
                    onChange={(e) => setNewCycle({ ...newCycle, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newCycle.endDate}
                    onChange={(e) => setNewCycle({ ...newCycle, endDate: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assign To Agent</Label>
                <Select 
                  value={newCycle.assignedTo} 
                  onValueChange={(value) => setNewCycle({ ...newCycle, assignedTo: value })}
                >
                  <SelectTrigger id="assignedTo">
                    <SelectValue placeholder="Select agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  placeholder="Additional information about this call cycle"
                  value={newCycle.notes}
                  onChange={(e) => setNewCycle({ ...newCycle, notes: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Locations ({selectedLocations.length} selected)</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                      placeholder="Search locations..."
                      className="pl-10 w-[250px]"
                      value={locationSearchQuery}
                      onChange={(e) => setLocationSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="border rounded-md h-64 overflow-y-auto p-2">
                  {filteredLocations.length > 0 ? (
                    filteredLocations.map((location) => (
                      <div key={location.id} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
                        <Checkbox
                          id={`location-${location.id}`}
                          checked={selectedLocations.some(loc => loc.id === location.id)}
                          onCheckedChange={() => toggleLocationSelection(location)}
                        />
                        <Label
                          htmlFor={`location-${location.id}`}
                          className="flex-grow cursor-pointer"
                        >
                          <div className="font-medium">{location.name}</div>
                          <div className="text-sm text-gray-500">{location.address}</div>
                        </Label>
                        <Badge className={location.type === 'Shop' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                          {location.type}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No locations found matching your search.
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
              <Button onClick={handleCreateCycle} disabled={!newCycle.name || !newCycle.assignedTo || selectedLocations.length === 0}>
                Create Call Cycle
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Call Cycle Dialog */}
        {currentCycle && (
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Edit Call Cycle</DialogTitle>
                <DialogDescription>
                  Update the details of this call cycle
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Call Cycle Name</Label>
                    <Input
                      id="edit-name"
                      value={currentCycle.name}
                      onChange={(e) => setCurrentCycle({ ...currentCycle, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-frequency">Frequency</Label>
                    <Select 
                      value={currentCycle.frequency} 
                      onValueChange={(value) => setCurrentCycle({ ...currentCycle, frequency: value })}
                    >
                      <SelectTrigger id="edit-frequency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={CYCLE_FREQUENCIES.DAILY}>Daily</SelectItem>
                        <SelectItem value={CYCLE_FREQUENCIES.WEEKLY}>Weekly</SelectItem>
                        <SelectItem value={CYCLE_FREQUENCIES.MONTHLY}>Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-startDate">Start Date</Label>
                    <Input
                      id="edit-startDate"
                      type="date"
                      value={currentCycle.startDate.split('T')[0]}
                      onChange={(e) => setCurrentCycle({ ...currentCycle, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-endDate">End Date</Label>
                    <Input
                      id="edit-endDate"
                      type="date"
                      value={currentCycle.endDate.split('T')[0]}
                      onChange={(e) => setCurrentCycle({ ...currentCycle, endDate: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-assignedTo">Assign To Agent</Label>
                  <Select 
                    value={currentCycle.assignedTo} 
                    onValueChange={(value) => setCurrentCycle({ ...currentCycle, assignedTo: value })}
                  >
                    <SelectTrigger id="edit-assignedTo">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select 
                    value={currentCycle.status} 
                    onValueChange={(value) => setCurrentCycle({ ...currentCycle, status: value })}
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={CYCLE_STATUS.ACTIVE}>Active</SelectItem>
                      <SelectItem value={CYCLE_STATUS.PENDING}>Pending</SelectItem>
                      <SelectItem value={CYCLE_STATUS.COMPLETED}>Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-notes">Notes</Label>
                  <Input
                    id="edit-notes"
                    value={currentCycle.notes}
                    onChange={(e) => setCurrentCycle({ ...currentCycle, notes: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Locations ({selectedLocations.length} selected)</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <Input
                        placeholder="Search locations..."
                        className="pl-10 w-[250px]"
                        value={locationSearchQuery}
                        onChange={(e) => setLocationSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="border rounded-md h-64 overflow-y-auto p-2">
                    {filteredLocations.length > 0 ? (
                      filteredLocations.map((location) => (
                        <div key={location.id} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
                          <Checkbox
                            id={`edit-location-${location.id}`}
                            checked={selectedLocations.some(loc => loc.id === location.id)}
                            onCheckedChange={() => toggleLocationSelection(location)}
                          />
                          <Label
                            htmlFor={`edit-location-${location.id}`}
                            className="flex-grow cursor-pointer"
                          >
                            <div className="font-medium">{location.name}</div>
                            <div className="text-sm text-gray-500">{location.address}</div>
                          </Label>
                          <Badge className={location.type === 'Shop' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                            {location.type}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No locations found matching your search.
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
                <Button onClick={handleEditCycle} disabled={!currentCycle.name || !currentCycle.assignedTo || selectedLocations.length === 0}>
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Delete Call Cycle Dialog */}
        {currentCycle && (
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Call Cycle</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this call cycle? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="font-medium">{currentCycle.name}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {currentCycle.locations.length} locations • Assigned to {getAgentName(currentCycle.assignedTo)}
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDeleteCycle}>
                  Delete Call Cycle
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* View Call Cycle Dialog */}
        {currentCycle && (
          <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>{currentCycle.name}</DialogTitle>
                <DialogDescription>
                  Call cycle details and assigned locations
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Frequency</h3>
                    <p className="font-medium">
                      <Badge className={getFrequencyBadgeColor(currentCycle.frequency)}>
                        {currentCycle.frequency.charAt(0).toUpperCase() + currentCycle.frequency.slice(1)}
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                    <p className="font-medium">
                      <Badge className={getStatusBadgeColor(currentCycle.status)}>
                        {currentCycle.status.charAt(0).toUpperCase() + currentCycle.status.slice(1)}
                      </Badge>
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Start Date</h3>
                    <p className="font-medium">{formatDate(new Date(currentCycle.startDate))}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">End Date</h3>
                    <p className="font-medium">{formatDate(new Date(currentCycle.endDate))}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Assigned To</h3>
                  <p className="font-medium">{getAgentName(currentCycle.assignedTo)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Adherence Rate</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                    <div 
                      className={`h-2.5 rounded-full ${
                        currentCycle.adherenceRate >= 80 ? 'bg-green-600' : 
                        currentCycle.adherenceRate >= 50 ? 'bg-yellow-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${currentCycle.adherenceRate}%` }}
                    ></div>
                  </div>
                  <p className="text-sm">{formatPercentage(currentCycle.adherenceRate)}</p>
                </div>
                
                {currentCycle.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Notes</h3>
                    <p>{currentCycle.notes}</p>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Assigned Locations ({currentCycle.locations.length})</h3>
                  <div className="border rounded-md h-64 overflow-y-auto">
                    {currentCycle.locations.map((location) => (
                      <div key={location.id} className="flex items-start p-3 border-b last:border-b-0">
                        <div className="flex-shrink-0 mr-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <MapPin className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-grow">
                          <p className="font-medium">{location.name}</p>
                          <p className="text-sm text-gray-500">{location.address}</p>
                          <div className="flex items-center mt-1">
                            <Badge className={location.type === 'Shop' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                              {location.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowViewDialog(false)}>Close</Button>
                <Button onClick={() => {
                  setShowViewDialog(false);
                  handleEditClick(currentCycle);
                }}>
                  Edit Call Cycle
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default CallCyclesPage;