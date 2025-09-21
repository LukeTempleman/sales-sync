import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import DataTable from '../../components/tables/DataTable';
import { getTeamMembersById } from '../../services/teamsService';
import { formatPercentage, formatNumber } from '../../lib/utils';
import { UserPlus, Edit, Trash, Mail, Phone, BarChart2, Target } from 'lucide-react';

const TeamManagementPage = () => {
  const { user } = useAuth();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddAgent, setShowAddAgent] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'agent',
  });

  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (user && user.teamId) {
        try {
          setLoading(true);
          // Get team members using our service
          const teamAgents = await getTeamMembersById(user.teamId, user?.useRealApi);
          setAgents(teamAgents);
        } catch (error) {
          console.error('Error fetching team members:', error);
          // Handle error state here
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchTeamMembers();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAgent = () => {
    setShowAddAgent(true);
    setSelectedAgent(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'agent',
    });
  };

  const handleEditAgent = (agent) => {
    setShowAddAgent(true);
    setSelectedAgent(agent);
    setFormData({
      name: agent.name,
      email: agent.email,
      phone: agent.phone || '',
      role: 'agent',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, this would be an API call to create or update an agent
    if (selectedAgent) {
      // Update existing agent
      const updatedAgents = agents.map(agent => 
        agent.id === selectedAgent.id ? { ...agent, ...formData } : agent
      );
      setAgents(updatedAgents);
    } else {
      // Add new agent
      const newAgent = {
        id: `agent-${Date.now()}`,
        ...formData,
        tenantId: user.tenantId,
        teamLeaderId: user.id,
        analytics: {
          totalVisits: 0,
          conversionRate: 0,
          goalCompletion: 0,
          callCycleAdherence: 0,
        }
      };
      setAgents([...agents, newAgent]);
    }
    
    setShowAddAgent(false);
    setSelectedAgent(null);
  };

  const handleDeleteAgent = (agentId) => {
    // In a real app, this would be an API call to delete an agent
    const updatedAgents = agents.filter(agent => agent.id !== agentId);
    setAgents(updatedAgents);
  };

  const columns = [
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
      accessorKey: 'analytics.goalCompletion',
      header: 'Goal Completion',
      cell: ({ row }) => formatPercentage(row.original.analytics?.goalCompletion || 0),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleEditAgent(row.original)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleDeleteAgent(row.original.id)}
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
            <p>Loading team members...</p>
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
            <h1 className="text-2xl font-bold">Team Management</h1>
            <p className="text-gray-500 mt-1">Manage your team members</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button onClick={handleAddAgent}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Agent
            </Button>
          </div>
        </div>

        {/* Team Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Agents</p>
                  <h3 className="text-2xl font-bold mt-1">{agents.length}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <UserPlus className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Avg. Visits per Agent</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {formatNumber(
                      agents.length > 0
                        ? agents.reduce((sum, agent) => sum + (agent.analytics?.totalVisits || 0), 0) / agents.length
                        : 0
                    )}
                  </h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <BarChart2 className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Avg. Goal Completion</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {formatPercentage(
                      agents.length > 0
                        ? agents.reduce((sum, agent) => sum + (agent.analytics?.goalCompletion || 0), 0) / agents.length
                        : 0
                    )}
                  </h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                  <Target className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Agent Form */}
        {showAddAgent && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{selectedAgent ? 'Edit Agent' : 'Add New Agent'}</CardTitle>
              <CardDescription>
                {selectedAgent 
                  ? 'Update the agent\'s information' 
                  : 'Fill in the details to add a new agent to your team'}
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
                </div>
                
                <div className="flex justify-end mt-6 space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAddAgent(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {selectedAgent ? 'Update Agent' : 'Add Agent'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Team Members Table */}
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              View and manage all agents in your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={agents}
              searchKey="name"
              searchPlaceholder="Search agents..."
            />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Mail className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="font-medium mb-2">Email Team</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Send an email to all team members
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
                <h3 className="font-medium mb-2">Assign Goals</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Set goals for your team members
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
                <Phone className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="font-medium mb-2">Schedule Call</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Schedule a team call or meeting
                </p>
                <Button variant="outline" className="w-full">
                  Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeamManagementPage;