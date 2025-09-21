import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import DataTable from '../../components/tables/DataTable';
import { formatDate } from '../../lib/utils';
import { Plus, Edit, Trash, Upload, Eye, FileText, Image, Link as LinkIcon } from 'lucide-react';
import { getBrands, createBrand, updateBrand, deleteBrand, uploadBrandAsset } from '../../services/brandsService';

const BrandManagementPage = () => {
  const { user } = useAuth();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddBrand, setShowAddBrand] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    primaryColor: '#2563eb',
    secondaryColor: '#ec4899',
    logo: null,
    website: '',
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [showAssets, setShowAssets] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        // Get brands using our service
        // Pass user.useRealApi to toggle between mock and real API
        const allBrands = await getBrands(user?.useRealApi);
        setBrands(allBrands);
      } catch (error) {
        console.error('Error fetching brands:', error);
        // Handle error state here
      } finally {
        setLoading(false);
      }
    };
    
    fetchBrands();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, logo: file }));
      
      // Create a preview URL for the logo
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBrand = () => {
    setShowAddBrand(true);
    setSelectedBrand(null);
    setFormData({
      name: '',
      description: '',
      primaryColor: '#2563eb',
      secondaryColor: '#ec4899',
      logo: null,
      website: '',
    });
    setLogoPreview(null);
  };

  const handleEditBrand = (brand) => {
    setShowAddBrand(true);
    setSelectedBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description || '',
      primaryColor: brand.primaryColor || '#2563eb',
      secondaryColor: brand.secondaryColor || '#ec4899',
      logo: brand.logo,
      website: brand.website || '',
    });
    setLogoPreview(brand.logo);
  };

  const handleViewAssets = (brand) => {
    setSelectedBrand(brand);
    setShowAssets(true);
    setSelectedAssets(brand.assets || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (selectedBrand) {
        // Update existing brand
        const updatedBrand = await updateBrand(
          selectedBrand.id, 
          {
            ...formData,
            tenantId: user.tenantId
          },
          user?.useRealApi
        );
        
        // Update the brands list
        const updatedBrands = brands.map(brand => 
          brand.id === selectedBrand.id ? updatedBrand : brand
        );
        setBrands(updatedBrands);
      } else {
        // Add new brand
        const brandData = {
          ...formData,
          tenantId: user.tenantId,
          tenantCount: 0,
          surveyCount: 0,
          status: 'active'
        };
        
        const newBrand = await createBrand(brandData, user?.useRealApi);
        setBrands([...brands, newBrand]);
      }
      
      // If there's a logo file, upload it
      if (formData.logo && formData.logo instanceof File) {
        const brandId = selectedBrand ? selectedBrand.id : brands[brands.length - 1].id;
        await uploadBrandAsset(
          brandId,
          'logo',
          formData.logo,
          { description: `Logo for ${formData.name}` },
          user?.useRealApi
        );
      }
      
      setShowAddBrand(false);
      setSelectedBrand(null);
      setLogoPreview(null);
    } catch (error) {
      console.error('Error saving brand:', error);
      // Handle error state here
    }
  };

  const handleDeleteBrand = async (brandId) => {
    try {
      // Delete the brand using our service
      await deleteBrand(brandId, user?.useRealApi);
      
      // Update the UI
      const updatedBrands = brands.filter(brand => brand.id !== brandId);
      setBrands(updatedBrands);
    } catch (error) {
      console.error(`Error deleting brand with ID ${brandId}:`, error);
      // Handle error state here
    }
  };

  const handleAddAsset = async (e) => {
    const file = e.target.files[0];
    if (file && selectedBrand) {
      try {
        // Upload the asset using our service
        const assetType = file.type.startsWith('image/') ? 'infographic' : 'training';
        const newAsset = await uploadBrandAsset(
          selectedBrand.id,
          assetType,
          file,
          {
            name: file.name,
            description: `${assetType} for ${selectedBrand.name}`
          },
          user?.useRealApi
        );
        
        const updatedAssets = [...selectedAssets, newAsset];
        setSelectedAssets(updatedAssets);
        
        // Update the brand with the new asset
        const updatedBrands = brands.map(brand => 
          brand.id === selectedBrand.id ? { 
            ...brand, 
            assets: updatedAssets,
            updatedAt: new Date().toISOString()
          } : brand
        );
        setBrands(updatedBrands);
      } catch (error) {
        console.error('Error uploading asset:', error);
        // Handle error state here
      }
    }
  };

  const handleDeleteAsset = (assetId) => {
    if (selectedBrand) {
      // In a real app, this would be an API call to delete the asset
      const updatedAssets = selectedAssets.filter(asset => asset.id !== assetId);
      setSelectedAssets(updatedAssets);
      
      // Update the brand with the updated assets
      const updatedBrands = brands.map(brand => 
        brand.id === selectedBrand.id ? { 
          ...brand, 
          assets: updatedAssets,
          updatedAt: new Date().toISOString()
        } : brand
      );
      setBrands(updatedBrands);
    }
  };

  const columns = [
    {
      accessorKey: 'name',
      header: 'Brand',
      cell: ({ row }) => (
        <div className="flex items-center">
          {row.original.logo ? (
            <img 
              src={row.original.logo} 
              alt={`${row.original.name} logo`} 
              className="w-8 h-8 object-contain mr-3"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <span className="text-blue-600 font-semibold">
                {row.original.name.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-xs text-gray-500">
              {row.original.tenantCount} tenants • {row.original.surveyCount} surveys
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <div className="max-w-xs truncate">
          {row.original.description || 'No description'}
        </div>
      ),
    },
    {
      accessorKey: 'colors',
      header: 'Brand Colors',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <div 
            className="w-6 h-6 rounded-full" 
            style={{ backgroundColor: row.original.primaryColor || '#2563eb' }}
          ></div>
          <div 
            className="w-6 h-6 rounded-full" 
            style={{ backgroundColor: row.original.secondaryColor || '#ec4899' }}
          ></div>
        </div>
      ),
    },
    {
      accessorKey: 'assets',
      header: 'Assets',
      cell: ({ row }) => (
        <div>
          {row.original.assets?.length || 0} assets
        </div>
      ),
    },
    {
      accessorKey: 'updatedAt',
      header: 'Last Updated',
      cell: ({ row }) => formatDate(row.original.updatedAt),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.original.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : row.original.status === 'draft'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
        }`}>
          {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
        </span>
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
            onClick={() => handleEditBrand(row.original)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleViewAssets(row.original)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleDeleteBrand(row.original.id)}
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
            <p>Loading brands...</p>
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
            <h1 className="text-2xl font-bold">Brand Management</h1>
            <p className="text-gray-500 mt-1">Manage brand information, assets, and settings</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button onClick={handleAddBrand}>
              <Plus className="h-4 w-4 mr-2" />
              Add Brand
            </Button>
          </div>
        </div>

        {/* Add/Edit Brand Form */}
        {showAddBrand && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{selectedBrand ? 'Edit Brand' : 'Add New Brand'}</CardTitle>
              <CardDescription>
                {selectedBrand 
                  ? 'Update the brand information and assets' 
                  : 'Fill in the details to add a new brand'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Brand Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full min-h-[100px] rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                      placeholder="Enter a description for this brand..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        id="primaryColor"
                        name="primaryColor"
                        type="color"
                        value={formData.primaryColor}
                        onChange={handleInputChange}
                        className="w-10 h-10 rounded-md border border-gray-200 p-1"
                      />
                      <Input
                        value={formData.primaryColor}
                        onChange={handleInputChange}
                        name="primaryColor"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        id="secondaryColor"
                        name="secondaryColor"
                        type="color"
                        value={formData.secondaryColor}
                        onChange={handleInputChange}
                        className="w-10 h-10 rounded-md border border-gray-200 p-1"
                      />
                      <Input
                        value={formData.secondaryColor}
                        onChange={handleInputChange}
                        name="secondaryColor"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="logo">Brand Logo</Label>
                    <div className="flex items-center space-x-4">
                      {logoPreview && (
                        <div className="w-16 h-16 border rounded-md flex items-center justify-center overflow-hidden">
                          <img 
                            src={logoPreview} 
                            alt="Logo preview" 
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center">
                          <label 
                            htmlFor="logo-upload" 
                            className="cursor-pointer bg-white px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <Upload className="h-4 w-4 mr-2 inline-block" />
                            {logoPreview ? 'Change Logo' : 'Upload Logo'}
                          </label>
                          <input
                            id="logo-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="hidden"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Recommended size: 200x200px. Max file size: 2MB.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6 space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowAddBrand(false);
                      setSelectedBrand(null);
                      setLogoPreview(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {selectedBrand ? 'Update Brand' : 'Add Brand'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Brand Assets */}
        {showAssets && selectedBrand && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Brand Assets</CardTitle>
                  <CardDescription>
                    Manage assets for {selectedBrand.name}
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setShowAssets(false);
                    setSelectedBrand(null);
                    setSelectedAssets([]);
                  }}
                >
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-center">
                  <label 
                    htmlFor="asset-upload" 
                    className="cursor-pointer bg-white px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Upload className="h-4 w-4 mr-2 inline-block" />
                    Upload Asset
                  </label>
                  <input
                    id="asset-upload"
                    type="file"
                    onChange={handleAddAsset}
                    className="hidden"
                  />
                </div>
              </div>
              
              {selectedAssets.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No assets found</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Upload assets like logos, infographics, and training materials
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedAssets.map((asset) => (
                    <Card key={asset.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            {asset.type.includes('image') ? (
                              <Image className="h-5 w-5 text-gray-500 mr-2" />
                            ) : asset.type.includes('pdf') ? (
                              <FileText className="h-5 w-5 text-gray-500 mr-2" />
                            ) : (
                              <FileText className="h-5 w-5 text-gray-500 mr-2" />
                            )}
                            <div className="truncate max-w-[150px]">
                              <p className="font-medium text-sm">{asset.name}</p>
                              <p className="text-xs text-gray-500">
                                {(asset.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteAsset(asset.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {asset.type.includes('image') && (
                          <div className="h-32 w-full flex items-center justify-center border rounded-md overflow-hidden mb-2">
                            <img 
                              src={asset.url} 
                              alt={asset.name} 
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                        )}
                        
                        <div className="flex justify-end">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center"
                            onClick={() => window.open(asset.url, '_blank')}
                          >
                            <LinkIcon className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Brands Table */}
        <Card>
          <CardHeader>
            <CardTitle>Brands</CardTitle>
            <CardDescription>
              Manage all brands in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={brands}
              searchKey="name"
              searchPlaceholder="Search brands..."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BrandManagementPage;