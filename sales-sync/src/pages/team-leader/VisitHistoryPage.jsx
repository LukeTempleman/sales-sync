import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import DataTable from '../../components/tables/DataTable';
import { getVisitsByTeamLeader, getAgentsByTeamLeader, VISIT_TYPES, VISIT_STATUS } from '../../data';
import { formatDate, formatTime } from '../../lib/utils';
import { MapPin, User, ShoppingBag, Eye, Filter, Download, Calendar } from 'lucide-react';

const VisitHistoryPage = () => {
  const { user } = useAuth();
  const [visits, setVisits] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const [filters, setFilters] = useState({
    agentId: '',
    type: '',
    status: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (user) {
      // In a real app, these would be API calls
      const teamVisits = getVisitsByTeamLeader(user.id);
      const teamAgents = getAgentsByTeamLeader(user.id);
      
      setVisits(teamVisits);
      setAgents(teamAgents);
      setLoading(false);
    }
  }, [user]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      agentId: '',
      type: '',
      status: '',
    });
    setDateRange({
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
    });
  };

  const getFilteredVisits = () => {
    return visits.filter((visit) => {
      const visitDate = new Date(visit.date);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      endDate.setHours(23, 59, 59, 999); // End of the day
      
      const dateInRange = visitDate >= startDate && visitDate <= endDate;
      const agentMatch = !filters.agentId || visit.agentId === filters.agentId;
      const typeMatch = !filters.type || visit.type === filters.type;
      const statusMatch = !filters.status || visit.status === filters.status;
      
      return dateInRange && agentMatch && typeMatch && statusMatch;
    });
  };

  const columns = [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => formatDate(row.original.date),
    },
    {
      accessorKey: 'time',
      header: 'Time',
      cell: ({ row }) => formatTime(row.original.date),
    },
    {
      accessorKey: 'agentId',
      header: 'Agent',
      cell: ({ row }) => {
        const agent = agents.find(a => a.id === row.original.agentId);
        return agent ? agent.name : 'Unknown';
      },
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <div className="flex items-center">
          {row.original.type === VISIT_TYPES.CONSUMER ? (
            <>
              <User className="h-4 w-4 mr-2 text-blue-600" />
              <span>Consumer</span>
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4 mr-2 text-blue-600" />
              <span>Shop</span>
            </>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        const visit = row.original;
        return visit.type === VISIT_TYPES.CONSUMER
          ? `${visit.consumerDetails.name} ${visit.consumerDetails.surname}`
          : visit.shopDetails.name;
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === VISIT_STATUS.COMPLETED 
              ? 'bg-green-100 text-green-800' 
              : status === VISIT_STATUS.PENDING
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
      cell: ({ row }) => (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setSelectedVisit(row.original)}
          className="flex items-center"
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      ),
    },
  ];

  const renderVisitDetails = () => {
    if (!selectedVisit) return null;

    const agent = agents.find(a => a.id === selectedVisit.agentId);

    return (
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>
                {selectedVisit.type === VISIT_TYPES.CONSUMER ? 'Consumer Visit Details' : 'Shop Visit Details'}
              </CardTitle>
              <CardDescription>
                {formatDate(selectedVisit.date)} at {formatTime(selectedVisit.date)}
              </CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedVisit(null)}
            >
              Close
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-start space-x-2">
              <User className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Agent</p>
                <p className="text-sm text-gray-500">
                  {agent ? agent.name : 'Unknown'}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm text-gray-500">
                  {selectedVisit.geocode.lat.toFixed(6)}, {selectedVisit.geocode.lng.toFixed(6)}
                </p>
              </div>
            </div>

            {selectedVisit.type === VISIT_TYPES.CONSUMER ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Consumer Details</h3>
                      <div className="mt-2 space-y-2">
                        <p><span className="font-medium">Name:</span> {selectedVisit.consumerDetails.name} {selectedVisit.consumerDetails.surname}</p>
                        <p><span className="font-medium">Cell Number:</span> {selectedVisit.consumerDetails.cellNumber}</p>
                        {selectedVisit.consumerDetails.idPhoto && (
                          <div>
                            <p className="font-medium mb-1">ID Photo:</p>
                            <img 
                              src={selectedVisit.consumerDetails.idPhoto} 
                              alt="ID Photo" 
                              className="w-full max-w-[200px] h-auto rounded-md border"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Brand Questions</h3>
                      <div className="mt-2 space-y-2">
                        <p>
                          <span className="font-medium">Brand Info Shared:</span> 
                          {selectedVisit.brandQuestions.infoShared ? 'Yes' : 'No'}
                        </p>
                        <p>
                          <span className="font-medium">Converted:</span> 
                          {selectedVisit.brandQuestions.converted ? 'Yes' : 'No'}
                        </p>
                        {selectedVisit.brandQuestions.converted && (
                          <p>
                            <span className="font-medium">Voucher Purchased:</span> 
                            {selectedVisit.brandQuestions.voucherPurchased ? 'Yes' : 'No'}
                          </p>
                        )}
                        <p>
                          <span className="font-medium">Other Platforms Used:</span> 
                          {selectedVisit.brandQuestions.otherPlatformsUsed.join(', ') || 'None'}
                        </p>
                        <p>
                          <span className="font-medium">Goldrush Comparison:</span> 
                          {selectedVisit.brandQuestions.goldrushComparison}
                        </p>
                        {selectedVisit.brandQuestions.feedback && (
                          <div>
                            <p className="font-medium">Feedback:</p>
                            <p className="text-sm">{selectedVisit.brandQuestions.feedback}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Shop Details</h3>
                      <div className="mt-2 space-y-2">
                        <p><span className="font-medium">Name:</span> {selectedVisit.shopDetails.name}</p>
                        <p><span className="font-medium">Type:</span> {selectedVisit.shopDetails.type}</p>
                        <p><span className="font-medium">Address:</span> {selectedVisit.shopDetails.address}</p>
                        {selectedVisit.shopDetails.contactPerson && (
                          <p><span className="font-medium">Contact Person:</span> {selectedVisit.shopDetails.contactPerson}</p>
                        )}
                        {selectedVisit.shopDetails.contactNumber && (
                          <p><span className="font-medium">Contact Number:</span> {selectedVisit.shopDetails.contactNumber}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Awareness & Stock</h3>
                      <div className="mt-2 space-y-2">
                        <p>
                          <span className="font-medium">Knows About Brand:</span> 
                          {selectedVisit.awarenessQuestions.knowsAboutBrand ? 'Yes' : 'No'}
                        </p>
                        <p>
                          <span className="font-medium">Stocks Product:</span> 
                          {selectedVisit.awarenessQuestions.stocksProduct ? 'Yes' : 'No'}
                        </p>
                        {selectedVisit.awarenessQuestions.stocksProduct && (
                          <>
                            <p>
                              <span className="font-medium">Current Sales:</span> 
                              {selectedVisit.stockAndSales.currentSales} units
                            </p>
                            <p>
                              <span className="font-medium">Source:</span> 
                              {selectedVisit.stockAndSales.source}
                            </p>
                          </>
                        )}
                        <p>
                          <span className="font-medium">Competitor Products:</span> 
                          {selectedVisit.competitorInfo.productsStocked.join(', ') || 'None'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Shelf Analysis</h3>
                      <div className="mt-2 space-y-2">
                        {selectedVisit.shelfAnalysis.shelfPhoto && (
                          <div className="mb-2">
                            <p className="font-medium mb-1">Shelf Photo:</p>
                            <img 
                              src={selectedVisit.shelfAnalysis.shelfPhoto} 
                              alt="Shelf Photo" 
                              className="w-full max-w-[300px] h-auto rounded-md border"
                            />
                          </div>
                        )}
                        <p>
                          <span className="font-medium">Shelf Share:</span> 
                          {selectedVisit.shelfAnalysis.shelfShare}%
                        </p>
                        <p>
                          <span className="font-medium">Grid Marked:</span> 
                          {selectedVisit.shelfAnalysis.gridMarked ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Advertising & Training</h3>
                      <div className="mt-2 space-y-2">
                        {selectedVisit.advertising.exteriorPhoto && (
                          <div className="mb-2">
                            <p className="font-medium mb-1">Exterior Photo:</p>
                            <img 
                              src={selectedVisit.advertising.exteriorPhoto} 
                              alt="Exterior Photo" 
                              className="w-full max-w-[300px] h-auto rounded-md border"
                            />
                          </div>
                        )}
                        {selectedVisit.advertising.boardPhoto && (
                          <div className="mb-2">
                            <p className="font-medium mb-1">Board Photo:</p>
                            <img 
                              src={selectedVisit.advertising.boardPhoto} 
                              alt="Board Photo" 
                              className="w-full max-w-[300px] h-auto rounded-md border"
                            />
                          </div>
                        )}
                        <p>
                          <span className="font-medium">Competitor Adverts:</span> 
                          {selectedVisit.advertising.competitorAdverts.join(', ') || 'None'}
                        </p>
                        <p>
                          <span className="font-medium">New Board Placed:</span> 
                          {selectedVisit.advertising.newBoardPlaced ? 'Yes' : 'No'}
                        </p>
                        <p>
                          <span className="font-medium">Cashier Trained:</span> 
                          {selectedVisit.training.cashierTrained ? 'Yes' : 'No'}
                        </p>
                        <p>
                          <span className="font-medium">Infographic Displayed:</span> 
                          {selectedVisit.training.infographicDisplayed ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedVisit.notes && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                    <p className="mt-1">{selectedVisit.notes}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p>Loading visit history...</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredVisits = getFilteredVisits();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Team Visit History</h1>
            <p className="text-gray-500 mt-1">View and manage your team's visits</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Filter Visits</CardTitle>
              <CardDescription>
                Narrow down the visit history based on specific criteria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label htmlFor="startDate" className="text-sm font-medium">
                    Start Date
                  </label>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={dateRange.startDate}
                      onChange={handleDateChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="endDate" className="text-sm font-medium">
                    End Date
                  </label>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={dateRange.endDate}
                      onChange={handleDateChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="agentId" className="text-sm font-medium">
                    Agent
                  </label>
                  <select
                    id="agentId"
                    name="agentId"
                    value={filters.agentId}
                    onChange={handleFilterChange}
                    className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                  >
                    <option value="">All Agents</option>
                    {agents.map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="type" className="text-sm font-medium">
                    Visit Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                  >
                    <option value="">All Types</option>
                    <option value={VISIT_TYPES.CONSUMER}>Consumer</option>
                    <option value={VISIT_TYPES.SHOP}>Shop</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                  >
                    <option value="">All Statuses</option>
                    <option value={VISIT_STATUS.COMPLETED}>Completed</option>
                    <option value={VISIT_STATUS.PENDING}>Pending</option>
                    <option value={VISIT_STATUS.CANCELLED}>Cancelled</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <Button 
                  variant="outline" 
                  onClick={resetFilters}
                  className="mr-2"
                >
                  Reset Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {renderVisitDetails()}

        <Card>
          <CardHeader>
            <CardTitle>Visit History</CardTitle>
            <CardDescription>
              Showing {filteredVisits.length} visits
              {dateRange.startDate && dateRange.endDate && (
                <> from {formatDate(dateRange.startDate)} to {formatDate(dateRange.endDate)}</>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={filteredVisits}
              searchKey="name"
              searchPlaceholder="Search visits..."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VisitHistoryPage;