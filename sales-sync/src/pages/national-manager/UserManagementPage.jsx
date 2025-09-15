import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import DataTable from '../../components/tables/DataTable';
import { 
  getRegionalManagersByNationalManager, 
  getAreaManagersByNationalManager,
  getTeamLeadersByNationalManager,
  getAgentsByNationalManager,
  ROLES
} from '../../data';
import { formatPercentage, formatNumber } from '../../lib/utils';
import { UserPlus, Edit, Trash, Mail, Phone, BarChart2, Target, Users, Map, Globe } from 'lucide-react';

const UserManagementPage = () => {
  const { user } = useAuth();
  const [regionalManagers, setRegionalManagers] = useState([]);
  const [areaManagers, setAreaManagers] = useState([]);
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('regionalManagers');
  const [showAddUser, setShowAddUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: ROLES.REGIONAL_MANAGER,
  });

  useEffect(() => {
    if (user) {
      // In a real app, these would be API calls
      const nationalRegionalManagers = getRegionalManagersByNationalManager(user.id);
      const nationalAreaManagers = getAreaManagersByNationalManager(user.id);
      const nationalTeamLeaders = getTeamLeadersByNationalManager(user.id);
      const nationalAgents = getAgentsByNationalManager(user.id);
      
      setRegionalManagers(nationalRegionalManagers);
      setAreaManagers(nationalAreaManagers);
      setTeamLeaders(nationalTeamLeaders);
      setAgents(nationalAgents);
      setLoading(false);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = (role) => {
    setShowAddUser(true);
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: role,
    });
  };

  const handleEditUser = (user) => {
    setShowAddUser(true);
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, this would be an API call to create or update a user
    if (selectedUser) {
      // Update existing user
      if (formData.role === ROLES.REGIONAL_MANAGER) {
        const updatedRegionalManagers = regionalManagers.map(rm => 
          rm.id === selectedUser.id ? { ...rm, ...formData } : rm
        );
        setRegionalManagers(updatedRegionalManagers);
      } else if (formData.role === ROLES.AREA_MANAGER) {
        const updatedAreaManagers = areaManagers.map(am => 
          am.id === selectedUser.id ? { ...am, ...formData } : am
        );
        setAreaManagers(updatedAreaManagers);
      } else if (formData.role === ROLES.TEAM_LEADER) {
        const updatedTeamLeaders = teamLeaders.map(tl => 
          tl.id === selectedUser.id ? { ...tl, ...formData } : tl
        );
        setTeamLeaders(updatedTeamLeaders);
      } else {
        const updatedAgents = agents.map(agent => 
          agent.id === selectedUser.id ? { ...agent, ...formData } : agent
        );
        setAgents(updatedAgents);
      }
    } else {
      // Add new user
      const newUser = {
        id: `user-${Date.now()}`,
        ...formData,
        tenantId: user.tenantId,
        nationalManagerId: user.id,
        analytics: {
          totalVisits: 0,
          conversionRate: 0,
          goalCompletion: 0,
          callCycleAdherence: 0,
        }
      };
      
      if (formData.role === ROLES.REGIONAL_MANAGER) {
        setRegionalManagers([...regionalManagers, newUser]);
      } else if (formData.role === ROLES.AREA_MANAGER) {
        setAreaManagers([...areaManagers, newUser]);
      } else if (formData.role === ROLES.TEAM_LEADER) {
        setTeamLeaders([...teamLeaders, newUser]);
      } else {
        setAgents([...agents, newUser]);
      }
    }
    
    setShowAddUser(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = (userId, role) => {
    // In a real app, this would be an API call to delete a user
    if (role === ROLES.REGIONAL_MANAGER) {
      const updatedRegionalManagers = regionalManagers.filter(rm => rm.id !== userId);
      setRegionalManagers(updatedRegionalManagers);
    } else if (role === ROLES.AREA_MANAGER) {
      const updatedAreaManagers = areaManagers.filter(am => am.id !== userId);
      setAreaManagers(updatedAreaManagers);
    } else if (role === ROLES.TEAM_LEADER) {
      const updatedTeamLeaders = teamLeaders.filter(tl => tl.id !== userId);
      setTeamLeaders(updatedTeamLeaders);
    } else {
      const updatedAgents = agents.filter(agent => agent.id !== userId);
      setAgents(updatedAgents);
    }
  };

  const regionalManagerColumns = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <span className="text-blue-600 font-semibold">
              {row.original.name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-xs text-gray-500">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => row.original.phone || 'N/A',
    },
    {
      accessorKey: 'areaManagers',
      header: 'Areas',
      cell: ({ row }) => {
        const regionAreaManagers = areaManagers.filter(am => am.regionalManagerId === row.original.id);
        return regionAreaManagers.length;
      },
    },
    {
      accessorKey: 'teamLeaders',
      header: 'Teams',
      cell: ({ row }) => {
        const regionTeamLeaders = teamLeaders.filter(tl => tl.regionalManagerId === row.original.id);
        return regionTeamLeaders.length;
      },
    },
    {
      accessorKey: 'agents',
      header: 'Agents',
      cell: ({ row }) => {
        const regionAgents = agents.filter(agent => agent.regionalManagerId === row.original.id);
        return regionAgents.length;
      },
    },
    {
      accessorKey: 'analytics.totalVisits',
      header: 'Total Visits',
      cell: ({ row }) => formatNumber(row.original.analytics?.totalVisits || 0),
    },
    {
      accessorKey: 'analytics.conversionRate',
      header: 'Conversion Rate',
      cell: ({ row }) => formatPercentage(row.original.analytics?.conversionRate || 0),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleEditUser(row.original)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleDeleteUser(row.original.id, ROLES.REGIONAL_MANAGER)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const areaManagerColumns = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <span className="text-blue-600 font-semibold">
              {row.original.name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-xs text-gray-500">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'regionalManagerId',
      header: 'Regional Manager',
      cell: ({ row }) => {
        const regionalManager = regionalManagers.find(rm => rm.id === row.original.regionalManagerId);
        return regionalManager ? regionalManager.name : 'Unassigned';
      },
    },
    {
      accessorKey: 'teamLeaders',
      header: 'Team Leaders',
      cell: ({ row }) => {
        const areaTeamLeaders = teamLeaders.filter(tl => tl.areaManagerId === row.original.id);
        return areaTeamLeaders.length;
      },
    },
    {
      accessorKey: 'agents',
      header: 'Agents',
      cell: ({ row }) => {
        const areaAgents = agents.filter(agent => agent.areaManagerId === row.original.id);
        return areaAgents.length;
      },
    },
    {
      accessorKey: 'analytics.totalVisits',
      header: 'Total Visits',
      cell: ({ row }) => formatNumber(row.original.analytics?.totalVisits || 0),
    },
    {
      accessorKey: 'analytics.conversionRate',
      header: 'Conversion Rate',
      cell: ({ row }) => formatPercentage(row.original.analytics?.conversionRate || 0),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleEditUser(row.original)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleDeleteUser(row.original.id, ROLES.AREA_MANAGER)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const teamLeaderColumns = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <span className="text-blue-600 font-semibold">
              {row.original.name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-xs text-gray-500">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'areaManagerId',
      header: 'Area Manager',
      cell: ({ row }) => {
        const areaManager = areaManagers.find(am => am.id === row.original.areaManagerId);
        return areaManager ? areaManager.name : 'Unassigned';
      },
    },
    {
      accessorKey: 'regionalManagerId',
      header: 'Regional Manager',
      cell: ({ row }) => {
        const regionalManager = regionalManagers.find(rm => rm.id === row.original.regionalManagerId);
        return regionalManager ? regionalManager.name : 'Unassigned';
      },
    },
    {
      accessorKey: 'agents',
      header: 'Team Size',
      cell: ({ row }) => {
        const teamAgents = agents.filter(agent => agent.teamLeaderId === row.original.id);
        return teamAgents.length;
      },
    },
    {
      accessorKey: 'analytics.totalVisits',
      header: 'Total Visits',
      cell: ({ row }) => formatNumber(row.original.analytics?.totalVisits || 0),
    },
    {
      accessorKey: 'analytics.conversionRate',
      header: 'Conversion Rate',
      cell: ({ row }) => formatPercentage(row.original.analytics?.conversionRate || 0),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleEditUser(row.original)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleDeleteUser(row.original.id, ROLES.TEAM_LEADER)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const agentColumns = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <span className="text-blue-600 font-semibold">
              {row.original.name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-xs text-gray-500">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'teamLeaderId',
      header: 'Team Leader',
      cell: ({ row }) => {
        const teamLeader = teamLeaders.find(tl => tl.id === row.original.teamLeaderId);
        return teamLeader ? teamLeader.name : 'Unassigned';
      },
    },
    {
      accessorKey: 'areaManagerId',
      header: 'Area Manager',
      cell: ({ row }) => {
        const areaManager = areaManagers.find(am => am.id === row.original.areaManagerId);
        return areaManager ? areaManager.name : 'Unassigned';
      },
    },
    {
      accessorKey: 'regionalManagerId',
      header: 'Regional Manager',
      cell: ({ row }) => {
        const regionalManager = regionalManagers.find(rm => rm.id === row.original.regionalManagerId);
        return regionalManager ? regionalManager.name : 'Unassigned';
      },
    },
    {
      accessorKey: 'analytics.totalVisits',
      header: 'Visits',
      cell: ({ row }) => formatNumber(row.original.analytics?.totalVisits || 0),
    },
    {
      accessorKey: 'analytics.conversionRate',
      header: 'Conversion Rate',
      cell: ({ row }) => formatPercentage(row.original.analytics?.conversionRate || 0),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleEditUser(row.original)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleDeleteUser(row.original.id, ROLES.AGENT)}
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
            <p>Loading users...</p>
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
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-gray-500 mt-1">Manage all users across the organization</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button onClick={() => handleAddUser(ROLES.REGIONAL_MANAGER)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Regional Manager
            </Button>
            <Button variant="outline" onClick={() => handleAddUser(ROLES.AREA_MANAGER)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Area Manager
            </Button>
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Regional Managers</p>
                  <h3 className="text-2xl font-bold mt-1">{regionalManagers.length}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Globe className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Area Managers</p>
                  <h3 className="text-2xl font-bold mt-1">{areaManagers.length}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <Map className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Team Leaders</p>
                  <h3 className="text-2xl font-bold mt-1">{teamLeaders.length}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Agents</p>
                  <h3 className="text-2xl font-bold mt-1">{agents.length}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit User Form */}
        {showAddUser && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {selectedUser 
                  ? `Edit ${
                      selectedUser.role === ROLES.REGIONAL_MANAGER 
                        ? 'Regional Manager' 
                        : selectedUser.role === ROLES.AREA_MANAGER 
                          ? 'Area Manager' 
                          : selectedUser.role === ROLES.TEAM_LEADER
                            ? 'Team Leader'
                            : 'Agent'
                    }`
                  : `Add New ${
                      formData.role === ROLES.REGIONAL_MANAGER 
                        ? 'Regional Manager' 
                        : formData.role === ROLES.AREA_MANAGER 
                          ? 'Area Manager' 
                          : formData.role === ROLES.TEAM_LEADER
                            ? 'Team Leader'
                            : 'Agent'
                    }`
                }
              </CardTitle>
              <CardDescription>
                {selectedUser 
                  ? `Update the ${
                      selectedUser.role === ROLES.REGIONAL_MANAGER 
                        ? 'regional manager' 
                        : selectedUser.role === ROLES.AREA_MANAGER 
                          ? 'area manager' 
                          : selectedUser.role === ROLES.TEAM_LEADER
                            ? 'team leader'
                            : 'agent'
                    }'s information` 
                  : `Fill in the details to add a new ${
                      formData.role === ROLES.REGIONAL_MANAGER 
                        ? 'regional manager' 
                        : formData.role === ROLES.AREA_MANAGER 
                          ? 'area manager' 
                          : formData.role === ROLES.TEAM_LEADER
                            ? 'team leader'
                            : 'agent'
                    }`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  {formData.role === ROLES.AREA_MANAGER && !selectedUser && (
                    <div className="space-y-2">
                      <Label htmlFor="regionalManagerId">Assign to Regional Manager</Label>
                      <select
                        id="regionalManagerId"
                        name="regionalManagerId"
                        className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Regional Manager</option>
                        {regionalManagers.map((rm) => (
                          <option key={rm.id} value={rm.id}>
                            {rm.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  {formData.role === ROLES.TEAM_LEADER && !selectedUser && (
                    <div className="space-y-2">
                      <Label htmlFor="areaManagerId">Assign to Area Manager</Label>
                      <select
                        id="areaManagerId"
                        name="areaManagerId"
                        className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Area Manager</option>
                        {areaManagers.map((am) => (
                          <option key={am.id} value={am.id}>
                            {am.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end mt-6 space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAddUser(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {selectedUser ? 'Update User' : 'Add User'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* User Tables */}
        <Tabs defaultValue="regionalManagers" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="regionalManagers">Regional Managers</TabsTrigger>
            <TabsTrigger value="areaManagers">Area Managers</TabsTrigger>
            <TabsTrigger value="teamLeaders">Team Leaders</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="regionalManagers">
            <Card>
              <CardHeader>
                <CardTitle>Regional Managers</CardTitle>
                <CardDescription>
                  Manage regional managers across the organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={regionalManagerColumns}
                  data={regionalManagers}
                  searchKey="name"
                  searchPlaceholder="Search regional managers..."
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="areaManagers">
            <Card>
              <CardHeader>
                <CardTitle>Area Managers</CardTitle>
                <CardDescription>
                  Manage area managers across the organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={areaManagerColumns}
                  data={areaManagers}
                  searchKey="name"
                  searchPlaceholder="Search area managers..."
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="teamLeaders">
            <Card>
              <CardHeader>
                <CardTitle>Team Leaders</CardTitle>
                <CardDescription>
                  Manage team leaders across the organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={teamLeaderColumns}
                  data={teamLeaders}
                  searchKey="name"
                  searchPlaceholder="Search team leaders..."
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="agents">
            <Card>
              <CardHeader>
                <CardTitle>Agents</CardTitle>
                <CardDescription>
                  Manage agents across the organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={agentColumns}
                  data={agents}
                  searchKey="name"
                  searchPlaceholder="Search agents..."
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Mail className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="font-medium mb-2">Email Organization</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Send an email to all users in the organization
                </p>
                <Button variant="outline" className="w-full">
                  Compose Email
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Target className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="font-medium mb-2">Assign National Goals</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Set goals for the entire organization
                </p>
                <Button variant="outline" className="w-full">
                  Manage Goals
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <BarChart2 className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="font-medium mb-2">Performance Reports</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Generate detailed performance reports
                </p>
                <Button variant="outline" className="w-full">
                  Generate Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;