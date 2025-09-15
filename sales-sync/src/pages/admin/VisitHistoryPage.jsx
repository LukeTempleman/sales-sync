import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import DataTable from '../../components/tables/DataTable';
import { 
  allVisits, 
  VISIT_TYPES, 
  VISIT_STATUS 
} from '../../data/visits';
import { 
  allUsers,
  getUserById,
  tenants
} from '../../data/users';
import { formatDate, formatDateTime } from '../../lib/utils';
import { 
  Search,
  ArrowUpDown, 
  Calendar,
  MapPin,
  User,
  Building,
  FileText,
  Filter,
  Download,
  Eye,
  MoreHorizontal,
  Camera,
  CheckCircle,
  XCircle,
  Clock,
  CalendarRange
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../components/ui/popover';
import { Calendar as CalendarComponent } from '../../components/ui/calendar';
import { format, subDays, isWithinInterval, parseISO } from 'date-fns';

const VisitHistoryPage = () => {
  const { user } = useAuth();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    tenant: 'all',
    agent: 'all',
    dateRange: 'all'
  });
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date()
  });
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [showVisitDetails, setShowVisitDetails] = useState(false);

  useEffect(() => {
    // In a real app, these would be API calls
    setVisits(allVisits);
    setLoading(false);
  }, []);

  const handleTabChange = (value) => {
    setActiveTab(value);
    if (value === 'all') {
      setVisits(allVisits);
    } else {
      setVisits(allVisits.filter(visit => visit.type === value));
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    if (range.from && range.to) {
      setFilters((prev) => ({ ...prev, dateRange: 'custom' }));
    }
  };

  const handleViewVisit = (visit) => {
    setSelectedVisit(visit);
    setShowVisitDetails(true);
  };

  const getDateRangeFilter = () => {
    const today = new Date();
    const ranges = {
      'today': { from: today, to: today },
      'yesterday': { from: subDays(today, 1), to: subDays(today, 1) },
      'last7days': { from: subDays(today, 7), to: today },
      'last30days': { from: subDays(today, 30), to: today },
      'last90days': { from: subDays(today, 90), to: today },
      'custom': dateRange
    };
    
    return ranges[filters.dateRange] || { from: null, to: null };
  };

  const filteredVisits = visits.filter(visit => {
    // Search filter
    if (searchQuery) {
      const agent = getUserById(visit.agentId);
      const searchLower = searchQuery.toLowerCase();
      
      const matchesAgent = agent && agent.name.toLowerCase().includes(searchLower);
      const matchesConsumer = visit.type === VISIT_TYPES.CONSUMER && 
        visit.consumerDetails && 
        (visit.consumerDetails.name.toLowerCase().includes(searchLower) || 
         visit.consumerDetails.surname.toLowerCase().includes(searchLower));
      const matchesShop = visit.type === VISIT_TYPES.SHOP && 
        visit.shopDetails && 
        visit.shopDetails.name.toLowerCase().includes(searchLower);
      
      if (!matchesAgent && !matchesConsumer && !matchesShop) {
        return false;
      }
    }
    
    // Type filter
    if (filters.type !== 'all' && visit.type !== filters.type) {
      return false;
    }
    
    // Status filter
    if (filters.status !== 'all' && visit.status !== filters.status) {
      return false;
    }
    
    // Tenant filter
    if (filters.tenant !== 'all' && visit.tenantId !== parseInt(filters.tenant)) {
      return false;
    }
    
    // Agent filter
    if (filters.agent !== 'all' && visit.agentId !== parseInt(filters.agent)) {
      return false;
    }
    
    // Date range filter
    if (filters.dateRange !== 'all') {
      const range = getDateRangeFilter();
      if (range.from && range.to) {
        const visitDate = new Date(visit.date);
        if (!isWithinInterval(visitDate, { start: range.from, end: range.to })) {
          return false;
        }
      }
    }
    
    return true;
  });

  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => <span>#{row.original.id}</span>,
    },
    {
      accessorKey: 'date',
      header: ({ column }) => (
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => formatDateTime(row.original.date),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant={row.original.type === VISIT_TYPES.CONSUMER ? 'default' : 'secondary'}>
          {row.original.type === VISIT_TYPES.CONSUMER ? 'Consumer' : 'Shop'}
        </Badge>
      ),
    },
    {
      accessorKey: 'agent',
      header: 'Agent',
      cell: ({ row }) => {
        const agent = getUserById(row.original.agentId);
        return agent ? (
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={agent.avatar} alt={agent.name} />
              <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{agent.name}</span>
          </div>
        ) : 'Unknown';
      },
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => {
        const geocode = row.original.geocode;
        return geocode ? (
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-xs">
              {geocode.lat.toFixed(6)}, {geocode.lng.toFixed(6)}
            </span>
          </div>
        ) : '-';
      },
    },
    {
      accessorKey: 'details',
      header: 'Details',
      cell: ({ row }) => {
        if (row.original.type === VISIT_TYPES.CONSUMER) {
          const consumer = row.original.consumerDetails;
          return consumer ? (
            <div>
              <p className="font-medium">{consumer.name} {consumer.surname}</p>
              <p className="text-xs text-muted-foreground">{consumer.cellNumber}</p>
            </div>
          ) : '-';
        } else {
          const shop = row.original.shopDetails;
          return shop ? (
            <div>
              <p className="font-medium">{shop.name}</p>
              <p className="text-xs text-muted-foreground">{shop.type}</p>
            </div>
          ) : '-';
        }
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
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const statusVariants = {
          [VISIT_STATUS.COMPLETED]: 'success',
          [VISIT_STATUS.PENDING]: 'warning',
          [VISIT_STATUS.CANCELLED]: 'destructive'
        };
        
        return (
          <Badge variant={statusVariants[row.original.status] || 'default'}>
            {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => handleViewVisit(row.original)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const renderVisitDetails = () => {
    if (!selectedVisit) return null;
    
    const agent = getUserById(selectedVisit.agentId);
    const tenant = tenants.find(t => t.id === selectedVisit.tenantId);
    
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Visit Details</CardTitle>
              <CardDescription>
                {selectedVisit.type === VISIT_TYPES.CONSUMER ? 'Consumer Visit' : 'Shop Visit'} #{selectedVisit.id}
              </CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowVisitDetails(false)}
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Visit Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{formatDateTime(selectedVisit.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {selectedVisit.geocode.lat.toFixed(6)}, {selectedVisit.geocode.lng.toFixed(6)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Badge variant={selectedVisit.status === VISIT_STATUS.COMPLETED ? 'success' : 
                                    selectedVisit.status === VISIT_STATUS.PENDING ? 'warning' : 'destructive'}>
                      {selectedVisit.status.charAt(0).toUpperCase() + selectedVisit.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Agent Information</h3>
                {agent && (
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={agent.avatar} alt={agent.name} />
                      <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">{agent.email}</p>
                      <p className="text-xs text-muted-foreground">{agent.phone}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Tenant Information</h3>
                {tenant && (
                  <div>
                    <p className="font-medium">{tenant.name}</p>
                    <p className="text-xs text-muted-foreground">{tenant.domain}</p>
                  </div>
                )}
              </div>
            </div>
            
            <Separator />
            
            {selectedVisit.type === VISIT_TYPES.CONSUMER ? (
              <div>
                <h3 className="text-sm font-medium mb-3">Consumer Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">Name</Label>
                        <p>{selectedVisit.consumerDetails.name} {selectedVisit.consumerDetails.surname}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Cell Number</Label>
                        <p>{selectedVisit.consumerDetails.cellNumber}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">ID Photo</Label>
                        <div className="mt-1 border rounded-md overflow-hidden">
                          <img 
                            src={selectedVisit.consumerDetails.idPhoto} 
                            alt="ID Photo" 
                            className="max-w-full h-auto"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Brand Questions</h4>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">Brand Info Shared</Label>
                        <p>{selectedVisit.brandQuestions.infoShared ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Converted Consumer</Label>
                        <p>{selectedVisit.brandQuestions.converted ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Voucher Purchased</Label>
                        <p>{selectedVisit.brandQuestions.voucherPurchased ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Other Platforms Used</Label>
                        <p>{selectedVisit.brandQuestions.otherPlatformsUsed.join(', ')}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Goldrush Comparison</Label>
                        <p>{selectedVisit.brandQuestions.goldrushComparison}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Feedback</Label>
                        <p>{selectedVisit.brandQuestions.feedback}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-sm font-medium mb-3">Shop Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">Shop Name</Label>
                        <p>{selectedVisit.shopDetails.name}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Shop Type</Label>
                        <p>{selectedVisit.shopDetails.type}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Address</Label>
                        <p>{selectedVisit.shopDetails.address}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Contact Person</Label>
                        <p>{selectedVisit.shopDetails.contactPerson}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Contact Number</Label>
                        <p>{selectedVisit.shopDetails.contactNumber}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Awareness</h4>
                        <div className="space-y-2">
                          <div>
                            <Label className="text-xs text-muted-foreground">Knows About Brand</Label>
                            <p>{selectedVisit.awarenessQuestions.knowsAboutBrand ? 'Yes' : 'No'}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Stocks Product</Label>
                            <p>{selectedVisit.awarenessQuestions.stocksProduct ? 'Yes' : 'No'}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Stock & Sales</h4>
                        <div className="space-y-2">
                          <div>
                            <Label className="text-xs text-muted-foreground">Current Sales</Label>
                            <p>{selectedVisit.stockAndSales.currentSales}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Source</Label>
                            <p>{selectedVisit.stockAndSales.source}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Competitor Info</h4>
                        <div className="space-y-2">
                          <div>
                            <Label className="text-xs text-muted-foreground">Products Stocked</Label>
                            <p>{selectedVisit.competitorInfo.productsStocked.join(', ')}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Brands</Label>
                            <p>{selectedVisit.competitorInfo.brands.join(', ')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Shelf Analysis</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Shelf Photo</Label>
                        <div className="mt-1 border rounded-md overflow-hidden">
                          <img 
                            src={selectedVisit.shelfAnalysis.shelfPhoto} 
                            alt="Shelf Photo" 
                            className="max-w-full h-auto"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="space-y-2">
                          <div>
                            <Label className="text-xs text-muted-foreground">Shelf Share</Label>
                            <p>{selectedVisit.shelfAnalysis.shelfShare}%</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Grid Marked</Label>
                            <p>{selectedVisit.shelfAnalysis.gridMarked ? 'Yes' : 'No'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Advertising</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Exterior Photo</Label>
                        <div className="mt-1 border rounded-md overflow-hidden">
                          <img 
                            src={selectedVisit.advertising.exteriorPhoto} 
                            alt="Exterior Photo" 
                            className="max-w-full h-auto"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Board Photo</Label>
                        <div className="mt-1 border rounded-md overflow-hidden">
                          <img 
                            src={selectedVisit.advertising.boardPhoto} 
                            alt="Board Photo" 
                            className="max-w-full h-auto"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 space-y-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">Competitor Adverts</Label>
                        <p>{selectedVisit.advertising.competitorAdverts.join(', ')}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">New Board Placed</Label>
                        <p>{selectedVisit.advertising.newBoardPlaced ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Training</h4>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">Cashier Trained</Label>
                        <p>{selectedVisit.training.cashierTrained ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Infographic Displayed</Label>
                        <p>{selectedVisit.training.infographicDisplayed ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {selectedVisit.notes && (
              <div>
                <h3 className="text-sm font-medium mb-2">Notes</h3>
                <p className="text-sm">{selectedVisit.notes}</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setShowVisitDetails(false)}>
            Close
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </CardFooter>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p>Loading visits...</p>
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
            <h1 className="text-2xl font-bold">Visit History</h1>
            <p className="text-muted-foreground mt-1">View and analyze all field visits</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="col-span-1 md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search visits..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
              </div>
              <div>
                <Select
                  value={filters.type}
                  onValueChange={(value) => handleFilterChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Visit Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value={VISIT_TYPES.CONSUMER}>Consumer</SelectItem>
                    <SelectItem value={VISIT_TYPES.SHOP}>Shop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value={VISIT_STATUS.COMPLETED}>Completed</SelectItem>
                    <SelectItem value={VISIT_STATUS.PENDING}>Pending</SelectItem>
                    <SelectItem value={VISIT_STATUS.CANCELLED}>Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select
                  value={filters.tenant}
                  onValueChange={(value) => handleFilterChange('tenant', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tenant" />
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
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarRange className="mr-2 h-4 w-4" />
                      {filters.dateRange === 'all' ? (
                        <span>All Dates</span>
                      ) : filters.dateRange === 'custom' ? (
                        <span>
                          {dateRange.from ? format(dateRange.from, 'PP') : ''}
                          {' - '}
                          {dateRange.to ? format(dateRange.to, 'PP') : ''}
                        </span>
                      ) : (
                        <span>
                          {filters.dateRange === 'today' ? 'Today' : 
                           filters.dateRange === 'yesterday' ? 'Yesterday' : 
                           filters.dateRange === 'last7days' ? 'Last 7 Days' : 
                           filters.dateRange === 'last30days' ? 'Last 30 Days' : 
                           filters.dateRange === 'last90days' ? 'Last 90 Days' : 'All Dates'}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-3 border-b">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Date Range</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="justify-start"
                            onClick={() => handleFilterChange('dateRange', 'all')}
                          >
                            All Dates
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="justify-start"
                            onClick={() => handleFilterChange('dateRange', 'today')}
                          >
                            Today
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="justify-start"
                            onClick={() => handleFilterChange('dateRange', 'yesterday')}
                          >
                            Yesterday
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="justify-start"
                            onClick={() => handleFilterChange('dateRange', 'last7days')}
                          >
                            Last 7 Days
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="justify-start"
                            onClick={() => handleFilterChange('dateRange', 'last30days')}
                          >
                            Last 30 Days
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="justify-start"
                            onClick={() => handleFilterChange('dateRange', 'last90days')}
                          >
                            Last 90 Days
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-sm mb-2">Custom Range</h4>
                      <CalendarComponent
                        mode="range"
                        selected={dateRange}
                        onSelect={handleDateRangeChange}
                        numberOfMonths={2}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visit List */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All Visits</TabsTrigger>
            <TabsTrigger value={VISIT_TYPES.CONSUMER}>Consumer Visits</TabsTrigger>
            <TabsTrigger value={VISIT_TYPES.SHOP}>Shop Visits</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <DataTable columns={columns} data={filteredVisits} />
          </TabsContent>
          <TabsContent value={VISIT_TYPES.CONSUMER} className="mt-4">
            <DataTable columns={columns} data={filteredVisits} />
          </TabsContent>
          <TabsContent value={VISIT_TYPES.SHOP} className="mt-4">
            <DataTable columns={columns} data={filteredVisits} />
          </TabsContent>
        </Tabs>

        {/* Visit Details Modal */}
        {showVisitDetails && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-auto bg-background rounded-lg">
              {renderVisitDetails()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitHistoryPage;