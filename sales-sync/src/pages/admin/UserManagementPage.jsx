import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import { Separator } from '../../components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import DataTable from '../../components/tables/DataTable';
import { 
  allUsers, 
  ROLES, 
  tenants,
  teams,
  areas,
  regions
} from '../../data/users';
import { formatDate } from '../../lib/utils';
import { 
  Plus, 
  Edit, 
  Trash, 
  Search,
  ArrowUpDown, 
  UserPlus,
  Mail,
  Phone,
  Building,
  Users,
  Map,
  Globe,
  Shield,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
  MoreHorizontal,
  Download,
  Upload
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';

const UserManagementPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [showAddUser, setShowAddUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: ROLES.AGENT,
    tenantId: 1,
    teamId: null,
    areaId: null,
    regionId: null,
    avatar: null,
    isActive: true
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    role: 'all',
    tenant: 'all',
    status: 'all'
  });
  const [availableTeams, setAvailableTeams] = useState([]);
  const [availableAreas, setAvailableAreas] = useState([]);
  const [availableRegions, setAvailableRegions] = useState([]);
  const [bulkActionUsers, setBulkActionUsers] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    // In a real app, these would be API calls
    setUsers(allUsers);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Filter teams, areas, and regions based on selected tenant
    if (formData.tenantId) {
      setAvailableTeams(teams.filter(team => team.tenantId === formData.tenantId));
      setAvailableAreas(areas.filter(area => area.tenantId === formData.tenantId));
      setAvailableRegions(regions.filter(region => region.tenantId === formData.tenantId));
    } else {
      setAvailableTeams([]);
      setAvailableAreas([]);
      setAvailableRegions([]);
    }
  }, [formData.tenantId]);

  const handleTabChange = (value) => {
    setActiveTab(value);
    if (value === 'all') {
      setUsers(allUsers);
    } else {
      setUsers(allUsers.filter(user => user.role === value));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name, checked) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleAddUser = () => {
    setShowAddUser(true);
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: ROLES.AGENT,
      tenantId: 1,
      teamId: null,
      areaId: null,
      regionId: null,
      avatar: null,
      isActive: true
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
      tenantId: user.tenantId,
      teamId: user.teamId || null,
      areaId: user.areaId || null,
      regionId: user.regionId || null,
      avatar: user.avatar || null,
      isActive: true // Assuming all users in the mock data are active
    });
  };

  const handleDeleteUser = (userId) => {
    // In a real app, this would be an API call to delete a user
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, this would be an API call to create or update a user
    if (selectedUser) {
      // Update existing user
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id ? { 
          ...user, 
          ...formData
        } : user
      );
      setUsers(updatedUsers);
    } else {
      // Add new user
      const newUser = {
        id: Date.now(),
        ...formData
      };
      setUsers([...users, newUser]);
    }
    
    setShowAddUser(false);
    setSelectedUser(null);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleBulkAction = (action) => {
    if (bulkActionUsers.length === 0) return;

    // In a real app, this would be an API call to perform the bulk action
    let updatedUsers = [...users];

    if (action === 'activate') {
      updatedUsers = users.map(user => 
        bulkActionUsers.includes(user.id) ? { ...user, isActive: true } : user
      );
    } else if (action === 'deactivate') {
      updatedUsers = users.map(user => 
        bulkActionUsers.includes(user.id) ? { ...user, isActive: false } : user
      );
    } else if (action === 'delete') {
      updatedUsers = users.filter(user => !bulkActionUsers.includes(user.id));
    }

    setUsers(updatedUsers);
    setBulkActionUsers([]);
  };

  const handleRowSelection = (selectedRowIds) => {
    const selectedIds = Object.keys(selectedRowIds).map(id => parseInt(id));
    setBulkActionUsers(selectedIds);
    setShowBulkActions(selectedIds.length > 0);
  };

  const filteredUsers = users.filter(user => {
    // Search filter
    if (searchQuery && 
        !user.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !user.email.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Role filter
    if (filters.role !== 'all' && user.role !== filters.role) {
      return false;
    }
    
    // Tenant filter
    if (filters.tenant !== 'all' && user.tenantId !== parseInt(filters.tenant)) {
      return false;
    }
    
    // Status filter - assuming all users are active in the mock data
    if (filters.status !== 'all' && 
        ((filters.status === 'active' && !user.isActive) || 
         (filters.status === 'inactive' && user.isActive))) {
      return false;
    }
    
    return true;
  });

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="px-1">
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="px-1">
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
        </div>
      ),
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={row.original.avatar} alt={row.original.name} />
            <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Role
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const roleLabels = {
          [ROLES.AGENT]: 'Agent',
          [ROLES.TEAM_LEADER]: 'Team Leader',
          [ROLES.AREA_MANAGER]: 'Area Manager',
          [ROLES.REGIONAL_MANAGER]: 'Regional Manager',
          [ROLES.NATIONAL_MANAGER]: 'National Manager',
          [ROLES.ADMIN]: 'Admin'
        };
        
        const roleBadgeVariants = {
          [ROLES.AGENT]: 'default',
          [ROLES.TEAM_LEADER]: 'outline',
          [ROLES.AREA_MANAGER]: 'secondary',
          [ROLES.REGIONAL_MANAGER]: 'destructive',
          [ROLES.NATIONAL_MANAGER]: 'purple',
          [ROLES.ADMIN]: 'success'
        };
        
        return (
          <Badge variant={roleBadgeVariants[row.original.role] || 'default'}>
            {roleLabels[row.original.role] || row.original.role}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'tenant',
      header: 'Tenant',
      cell: ({ row }) => {
        const tenant = tenants.find(t => t.id === row.original.tenantId);
        return tenant ? tenant.name : 'Unknown';
      },
    },
    {
      accessorKey: 'team',
      header: 'Team',
      cell: ({ row }) => {
        if (!row.original.teamId) return '-';
        const team = teams.find(t => t.id === row.original.teamId);
        return team ? team.name : 'Unknown';
      },
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => row.original.phone || '-',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? 'success' : 'outline'}>
          {row.original.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleEditUser(row.original)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mail className="h-4 w-4 mr-2" />
              Email
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Lock className="h-4 w-4 mr-2" />
              Reset Password
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDeleteUser(row.original.id)}>
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
            <p className="text-muted-foreground mt-1">Manage users across all tenants</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button onClick={handleAddUser}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="col-span-1 md:col-span-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
              </div>
              <div>
                <Select
                  value={filters.role}
                  onValueChange={(value) => handleFilterChange('role', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value={ROLES.AGENT}>Agents</SelectItem>
                    <SelectItem value={ROLES.TEAM_LEADER}>Team Leaders</SelectItem>
                    <SelectItem value={ROLES.AREA_MANAGER}>Area Managers</SelectItem>
                    <SelectItem value={ROLES.REGIONAL_MANAGER}>Regional Managers</SelectItem>
                    <SelectItem value={ROLES.NATIONAL_MANAGER}>National Managers</SelectItem>
                    <SelectItem value={ROLES.ADMIN}>Admins</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select
                  value={filters.tenant}
                  onValueChange={(value) => handleFilterChange('tenant', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by tenant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tenants</SelectItem>
                    {tenants.map((tenant) => (
                      <SelectItem key={tenant.id} value={tenant.id.toString()}>
                        {tenant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {showBulkActions && (
          <Card className="mb-4 bg-muted">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{bulkActionUsers.length} users selected</p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleBulkAction('activate')}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Activate
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleBulkAction('deactivate')}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Deactivate
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleBulkAction('delete')}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* User List */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value={ROLES.AGENT}>Agents</TabsTrigger>
            <TabsTrigger value={ROLES.TEAM_LEADER}>Team Leaders</TabsTrigger>
            <TabsTrigger value={ROLES.AREA_MANAGER}>Area Managers</TabsTrigger>
            <TabsTrigger value={ROLES.REGIONAL_MANAGER}>Regional Managers</TabsTrigger>
            <TabsTrigger value={ROLES.NATIONAL_MANAGER}>National Managers</TabsTrigger>
            <TabsTrigger value={ROLES.ADMIN}>Admins</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <DataTable 
              columns={columns} 
              data={filteredUsers} 
              enableRowSelection={true}
              onRowSelectionChange={handleRowSelection}
            />
          </TabsContent>
          <TabsContent value={ROLES.AGENT} className="mt-4">
            <DataTable 
              columns={columns} 
              data={filteredUsers} 
              enableRowSelection={true}
              onRowSelectionChange={handleRowSelection}
            />
          </TabsContent>
          <TabsContent value={ROLES.TEAM_LEADER} className="mt-4">
            <DataTable 
              columns={columns} 
              data={filteredUsers} 
              enableRowSelection={true}
              onRowSelectionChange={handleRowSelection}
            />
          </TabsContent>
          <TabsContent value={ROLES.AREA_MANAGER} className="mt-4">
            <DataTable 
              columns={columns} 
              data={filteredUsers} 
              enableRowSelection={true}
              onRowSelectionChange={handleRowSelection}
            />
          </TabsContent>
          <TabsContent value={ROLES.REGIONAL_MANAGER} className="mt-4">
            <DataTable 
              columns={columns} 
              data={filteredUsers} 
              enableRowSelection={true}
              onRowSelectionChange={handleRowSelection}
            />
          </TabsContent>
          <TabsContent value={ROLES.NATIONAL_MANAGER} className="mt-4">
            <DataTable 
              columns={columns} 
              data={filteredUsers} 
              enableRowSelection={true}
              onRowSelectionChange={handleRowSelection}
            />
          </TabsContent>
          <TabsContent value={ROLES.ADMIN} className="mt-4">
            <DataTable 
              columns={columns} 
              data={filteredUsers} 
              enableRowSelection={true}
              onRowSelectionChange={handleRowSelection}
            />
          </TabsContent>
        </Tabs>

        {/* Add/Edit User Form */}
        {showAddUser && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{selectedUser ? 'Edit User' : 'Add New User'}</CardTitle>
              <CardDescription>
                {selectedUser 
                  ? 'Update the user information' 
                  : 'Fill in the details to create a new user'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                    <Label htmlFor="email">Email Address</Label>
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
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => handleSelectChange('role', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ROLES.AGENT}>Agent</SelectItem>
                        <SelectItem value={ROLES.TEAM_LEADER}>Team Leader</SelectItem>
                        <SelectItem value={ROLES.AREA_MANAGER}>Area Manager</SelectItem>
                        <SelectItem value={ROLES.REGIONAL_MANAGER}>Regional Manager</SelectItem>
                        <SelectItem value={ROLES.NATIONAL_MANAGER}>National Manager</SelectItem>
                        <SelectItem value={ROLES.ADMIN}>Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tenantId">Tenant</Label>
                    <Select
                      value={formData.tenantId}
                      onValueChange={(value) => handleSelectChange('tenantId', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select tenant" />
                      </SelectTrigger>
                      <SelectContent>
                        {tenants.map((tenant) => (
                          <SelectItem key={tenant.id} value={tenant.id.toString()}>
                            {tenant.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {(formData.role === ROLES.AGENT || formData.role === ROLES.TEAM_LEADER) && (
                    <div className="space-y-2">
                      <Label htmlFor="teamId">Team</Label>
                      <Select
                        value={formData.teamId ? formData.teamId.toString() : ''}
                        onValueChange={(value) => handleSelectChange('teamId', value ? parseInt(value) : null)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select team" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {availableTeams.map((team) => (
                            <SelectItem key={team.id} value={team.id.toString()}>
                              {team.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {(formData.role === ROLES.AREA_MANAGER || formData.role === ROLES.TEAM_LEADER) && (
                    <div className="space-y-2">
                      <Label htmlFor="areaId">Area</Label>
                      <Select
                        value={formData.areaId ? formData.areaId.toString() : ''}
                        onValueChange={(value) => handleSelectChange('areaId', value ? parseInt(value) : null)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select area" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {availableAreas.map((area) => (
                            <SelectItem key={area.id} value={area.id.toString()}>
                              {area.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {formData.role === ROLES.REGIONAL_MANAGER && (
                    <div className="space-y-2">
                      <Label htmlFor="regionId">Region</Label>
                      <Select
                        value={formData.regionId ? formData.regionId.toString() : ''}
                        onValueChange={(value) => handleSelectChange('regionId', value ? parseInt(value) : null)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {availableRegions.map((region) => (
                            <SelectItem key={region.id} value={region.id.toString()}>
                              {region.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => handleSwitchChange('isActive', checked)}
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Security Settings</h3>
                  
                  {!selectedUser && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="Enter password"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          placeholder="Confirm password"
                        />
                      </div>
                    </div>
                  )}
                  
                  {selectedUser && (
                    <div className="flex items-center justify-between bg-muted p-4 rounded-md">
                      <div>
                        <h4 className="font-medium">Reset Password</h4>
                        <p className="text-sm text-muted-foreground">Send a password reset link to the user's email</p>
                      </div>
                      <Button variant="outline" type="button">
                        <Mail className="h-4 w-4 mr-2" />
                        Send Reset Link
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end mt-6 space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowAddUser(false);
                      setSelectedUser(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {selectedUser ? 'Update User' : 'Create User'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserManagementPage;
