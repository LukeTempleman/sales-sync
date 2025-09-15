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
import DataTable from '../../components/tables/DataTable';
import { 
  allSurveyTemplates, 
  SURVEY_TYPES, 
  QUESTION_TYPES,
  getSurveyTemplatesByType
} from '../../data/surveys';
import { getBrands } from '../../data/brands';
import { getTenants } from '../../data/helpers';
import { formatDate } from '../../lib/utils';
import { 
  Plus, 
  Edit, 
  Trash, 
  Copy, 
  Eye, 
  FileText, 
  ArrowUpDown, 
  Filter, 
  Search,
  MoveUp,
  MoveDown,
  Save,
  X
} from 'lucide-react';

const SurveyManagementPage = () => {
  const { user } = useAuth();
  const [surveys, setSurveys] = useState([]);
  const [brands, setBrands] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [showAddSurvey, setShowAddSurvey] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: SURVEY_TYPES.CONSUMER,
    tenantId: 1,
    brandId: 1,
    isActive: true,
    questions: []
  });
  const [showQuestionEditor, setShowQuestionEditor] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionFormData, setQuestionFormData] = useState({
    label: '',
    type: QUESTION_TYPES.TEXT,
    required: true,
    description: '',
    options: []
  });
  const [newOption, setNewOption] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    tenant: 'all',
    brand: 'all',
    status: 'all'
  });

  useEffect(() => {
    // In a real app, these would be API calls
    const allSurveys = allSurveyTemplates;
    const allBrands = getBrands();
    const allTenants = getTenants();
    
    setSurveys(allSurveys);
    setBrands(allBrands);
    setTenants(allTenants);
    setLoading(false);
  }, []);

  const handleTabChange = (value) => {
    setActiveTab(value);
    if (value === 'all') {
      setSurveys(allSurveyTemplates);
    } else {
      setSurveys(getSurveyTemplatesByType(value));
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

  const handleQuestionInputChange = (e) => {
    const { name, value } = e.target;
    setQuestionFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionSelectChange = (name, value) => {
    setQuestionFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionSwitchChange = (name, checked) => {
    setQuestionFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleAddOption = () => {
    if (newOption.trim()) {
      setQuestionFormData((prev) => ({
        ...prev,
        options: [...prev.options, newOption.trim()]
      }));
      setNewOption('');
    }
  };

  const handleRemoveOption = (index) => {
    setQuestionFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const handleAddSurvey = () => {
    setShowAddSurvey(true);
    setSelectedSurvey(null);
    setFormData({
      name: '',
      description: '',
      type: SURVEY_TYPES.CONSUMER,
      tenantId: 1,
      brandId: 1,
      isActive: true,
      questions: []
    });
  };

  const handleEditSurvey = (survey) => {
    setShowAddSurvey(true);
    setSelectedSurvey(survey);
    setFormData({
      name: survey.name,
      description: survey.description || '',
      type: survey.type,
      tenantId: survey.tenantId,
      brandId: survey.brandId,
      isActive: survey.isActive,
      questions: [...survey.questions]
    });
  };

  const handleDuplicateSurvey = (survey) => {
    setShowAddSurvey(true);
    setSelectedSurvey(null);
    setFormData({
      name: `Copy of ${survey.name}`,
      description: survey.description || '',
      type: survey.type,
      tenantId: survey.tenantId,
      brandId: survey.brandId,
      isActive: false,
      questions: [...survey.questions]
    });
  };

  const handleDeleteSurvey = (surveyId) => {
    // In a real app, this would be an API call to delete a survey
    const updatedSurveys = surveys.filter(survey => survey.id !== surveyId);
    setSurveys(updatedSurveys);
  };

  const handleAddQuestion = () => {
    setShowQuestionEditor(true);
    setCurrentQuestion(null);
    setQuestionFormData({
      label: '',
      type: QUESTION_TYPES.TEXT,
      required: true,
      description: '',
      options: []
    });
  };

  const handleEditQuestion = (question) => {
    setShowQuestionEditor(true);
    setCurrentQuestion(question);
    setQuestionFormData({
      label: question.label,
      type: question.type,
      required: question.required,
      description: question.description || '',
      options: question.options || []
    });
  };

  const handleSaveQuestion = () => {
    const newQuestion = {
      id: currentQuestion ? currentQuestion.id : Date.now(),
      order: currentQuestion ? currentQuestion.order : formData.questions.length + 1,
      ...questionFormData
    };

    if (currentQuestion) {
      // Update existing question
      setFormData((prev) => ({
        ...prev,
        questions: prev.questions.map(q => q.id === currentQuestion.id ? newQuestion : q)
      }));
    } else {
      // Add new question
      setFormData((prev) => ({
        ...prev,
        questions: [...prev.questions, newQuestion]
      }));
    }

    setShowQuestionEditor(false);
    setCurrentQuestion(null);
  };

  const handleDeleteQuestion = (questionId) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const handleMoveQuestion = (questionId, direction) => {
    const questions = [...formData.questions];
    const index = questions.findIndex(q => q.id === questionId);
    
    if (direction === 'up' && index > 0) {
      // Swap with previous question
      [questions[index - 1], questions[index]] = [questions[index], questions[index - 1]];
    } else if (direction === 'down' && index < questions.length - 1) {
      // Swap with next question
      [questions[index], questions[index + 1]] = [questions[index + 1], questions[index]];
    }

    // Update order property
    const updatedQuestions = questions.map((q, i) => ({ ...q, order: i + 1 }));
    
    setFormData((prev) => ({
      ...prev,
      questions: updatedQuestions
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, this would be an API call to create or update a survey
    if (selectedSurvey) {
      // Update existing survey
      const updatedSurveys = surveys.map(survey => 
        survey.id === selectedSurvey.id ? { 
          ...survey, 
          ...formData,
          updatedAt: new Date().toISOString()
        } : survey
      );
      setSurveys(updatedSurveys);
    } else {
      // Add new survey
      const newSurvey = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setSurveys([...surveys, newSurvey]);
    }
    
    setShowAddSurvey(false);
    setSelectedSurvey(null);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredSurveys = surveys.filter(survey => {
    // Search filter
    if (searchQuery && !survey.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !survey.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Type filter
    if (filters.type !== 'all' && survey.type !== filters.type) {
      return false;
    }
    
    // Tenant filter
    if (filters.tenant !== 'all' && survey.tenantId !== parseInt(filters.tenant)) {
      return false;
    }
    
    // Brand filter
    if (filters.brand !== 'all' && survey.brandId !== parseInt(filters.brand)) {
      return false;
    }
    
    // Status filter
    if (filters.status !== 'all' && 
        ((filters.status === 'active' && !survey.isActive) || 
         (filters.status === 'inactive' && survey.isActive))) {
      return false;
    }
    
    return true;
  });

  const columns = [
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
        <div>
          <p className="font-medium">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.description}</p>
        </div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant={row.original.type === SURVEY_TYPES.CONSUMER ? 'default' : 'secondary'}>
          {row.original.type === SURVEY_TYPES.CONSUMER ? 'Consumer' : 'Shop'}
        </Badge>
      ),
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
      accessorKey: 'brand',
      header: 'Brand',
      cell: ({ row }) => {
        const brand = brands.find(b => b.id === row.original.brandId);
        return brand ? brand.name : 'Unknown';
      },
    },
    {
      accessorKey: 'questions',
      header: 'Questions',
      cell: ({ row }) => row.original.questions.length,
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => (
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Last Updated
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => formatDate(row.original.updatedAt),
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
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleEditSurvey(row.original)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleDuplicateSurvey(row.original)}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleDeleteSurvey(row.original.id)}
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
            <p>Loading surveys...</p>
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
            <h1 className="text-2xl font-bold">Survey Management</h1>
            <p className="text-muted-foreground mt-1">Create and manage survey templates</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button onClick={handleAddSurvey}>
              <Plus className="h-4 w-4 mr-2" />
              Add Survey
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="col-span-1 md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search surveys..."
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
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value={SURVEY_TYPES.CONSUMER}>Consumer</SelectItem>
                    <SelectItem value={SURVEY_TYPES.SHOP}>Shop</SelectItem>
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

        {/* Survey List */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All Surveys</TabsTrigger>
            <TabsTrigger value={SURVEY_TYPES.CONSUMER}>Consumer Surveys</TabsTrigger>
            <TabsTrigger value={SURVEY_TYPES.SHOP}>Shop Surveys</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <DataTable columns={columns} data={filteredSurveys} />
          </TabsContent>
          <TabsContent value={SURVEY_TYPES.CONSUMER} className="mt-4">
            <DataTable columns={columns} data={filteredSurveys} />
          </TabsContent>
          <TabsContent value={SURVEY_TYPES.SHOP} className="mt-4">
            <DataTable columns={columns} data={filteredSurveys} />
          </TabsContent>
        </Tabs>

        {/* Add/Edit Survey Form */}
        {showAddSurvey && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{selectedSurvey ? 'Edit Survey' : 'Add New Survey'}</CardTitle>
              <CardDescription>
                {selectedSurvey 
                  ? 'Update the survey template information and questions' 
                  : 'Fill in the details to create a new survey template'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Survey Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Survey Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => handleSelectChange('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={SURVEY_TYPES.CONSUMER}>Consumer</SelectItem>
                        <SelectItem value={SURVEY_TYPES.SHOP}>Shop</SelectItem>
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="brandId">Brand</Label>
                    <Select
                      value={formData.brandId}
                      onValueChange={(value) => handleSelectChange('brandId', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id.toString()}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Enter a description for this survey..."
                    />
                  </div>
                  
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
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Survey Questions</h3>
                    <Button type="button" onClick={handleAddQuestion}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>
                  </div>
                  
                  {formData.questions.length === 0 ? (
                    <div className="text-center py-8 border border-dashed rounded-md">
                      <FileText className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">No questions added yet</p>
                      <Button variant="outline" className="mt-4" onClick={handleAddQuestion}>
                        Add Your First Question
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.questions
                        .sort((a, b) => a.order - b.order)
                        .map((question) => (
                          <Card key={question.id}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center">
                                    <Badge variant="outline" className="mr-2">
                                      {question.order}
                                    </Badge>
                                    <h4 className="font-medium">{question.label}</h4>
                                    {question.required && (
                                      <Badge variant="secondary" className="ml-2">Required</Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {question.description}
                                  </p>
                                  <div className="mt-2">
                                    <Badge>
                                      {Object.entries(QUESTION_TYPES).find(([key, value]) => value === question.type)?.[0] || question.type}
                                    </Badge>
                                    
                                    {(question.type === QUESTION_TYPES.SINGLE_CHOICE || 
                                      question.type === QUESTION_TYPES.MULTIPLE_CHOICE) && 
                                      question.options && (
                                        <div className="mt-2 flex flex-wrap gap-1">
                                          {question.options.map((option, index) => (
                                            <Badge key={index} variant="outline">{option}</Badge>
                                          ))}
                                        </div>
                                      )
                                    }
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleMoveQuestion(question.id, 'up')}
                                    disabled={question.order === 1}
                                  >
                                    <MoveUp className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleMoveQuestion(question.id, 'down')}
                                    disabled={question.order === formData.questions.length}
                                  >
                                    <MoveDown className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleEditQuestion(question)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end mt-6 space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowAddSurvey(false);
                      setSelectedSurvey(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {selectedSurvey ? 'Update Survey' : 'Create Survey'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Question Editor */}
        {showQuestionEditor && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{currentQuestion ? 'Edit Question' : 'Add New Question'}</CardTitle>
              <CardDescription>
                {currentQuestion 
                  ? 'Update the question details' 
                  : 'Fill in the details to add a new question'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="label">Question Label</Label>
                  <Input
                    id="label"
                    name="label"
                    value={questionFormData.label}
                    onChange={handleQuestionInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Question Type</Label>
                  <Select
                    value={questionFormData.type}
                    onValueChange={(value) => handleQuestionSelectChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(QUESTION_TYPES).map(([key, value]) => (
                        <SelectItem key={value} value={value}>
                          {key}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    value={questionFormData.description}
                    onChange={handleQuestionInputChange}
                    placeholder="Enter a description or help text for this question"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="required"
                    checked={questionFormData.required}
                    onCheckedChange={(checked) => handleQuestionSwitchChange('required', checked)}
                  />
                  <Label htmlFor="required">Required</Label>
                </div>
                
                {(questionFormData.type === QUESTION_TYPES.SINGLE_CHOICE || 
                  questionFormData.type === QUESTION_TYPES.MULTIPLE_CHOICE) && (
                  <div className="space-y-2 md:col-span-2">
                    <Label>Options</Label>
                    <div className="flex space-x-2">
                      <Input
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                        placeholder="Add an option"
                      />
                      <Button type="button" onClick={handleAddOption}>
                        Add
                      </Button>
                    </div>
                    
                    {questionFormData.options.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {questionFormData.options.map((option, index) => (
                          <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                            <span>{option}</span>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemoveOption(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowQuestionEditor(false);
                    setCurrentQuestion(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={handleSaveQuestion}>
                  {currentQuestion ? 'Update Question' : 'Add Question'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SurveyManagementPage;
