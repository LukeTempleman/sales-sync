import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { MapPin, User, Phone, Camera, Check, X, Info, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { VISIT_TYPES, VISIT_STATUS } from '../../data/visits';
import { getBrands } from '../../services/brandsService';
import { createVisit, uploadVisitPhoto } from '../../services/visitsService';
import ShelfAnalysisGrid from '../../components/ShelfAnalysisGrid';

const NewVisitPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [visitType, setVisitType] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [brands, setBrands] = useState([]);
  
  // Fetch brands when component mounts
  React.useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brandsData = await getBrands(user?.useRealApi);
        setBrands(brandsData);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };
    
    fetchBrands();
  }, [user]);
  
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues: {
      type: '',
      geocode: { lat: -33.918861, lng: 18.423300 }, // Default location (mock)
      status: VISIT_STATUS.COMPLETED,
      agentId: user?.id,
      date: new Date(),
      tenantId: user?.tenantId,
      // Consumer visit fields
      consumerName: '',
      consumerSurname: '',
      idPhoto: null,
      cellNumber: '',
      infoShared: false,
      converted: false,
      voucherPurchased: false,
      otherPlatformsUsed: [],
      goldrushComparison: '',
      feedback: '',
      // Shop visit fields
      shopName: '',
      shopType: '',
      shopAddress: '',
      contactPerson: '',
      contactNumber: '',
      knowsAboutBrand: false,
      stocksProduct: false,
      currentSales: 0,
      source: '',
      productsStocked: [],
      prices: {},
      brands: [],
      shelfPhoto: null,
      shelfShare: 0,
      gridMarked: false,
      exteriorPhoto: null,
      boardPhoto: null,
      competitorAdverts: [],
      newBoardPlaced: false,
      cashierTrained: false,
      infographicDisplayed: false,
      notes: ''
    }
  });

  const handleVisitTypeSelect = (type) => {
    setVisitType(type);
    reset({ ...watch(), type });
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      // Prepare visit data based on visit type
      const visitData = {
        type: data.type,
        geocode: data.geocode,
        status: data.status,
        agentId: data.agentId,
        date: new Date().toISOString(),
        tenantId: data.tenantId,
        notes: data.notes
      };
      
      // Add type-specific data
      if (data.type === VISIT_TYPES.CONSUMER) {
        visitData.consumerDetails = {
          name: data.consumerName,
          surname: data.consumerSurname,
          cellNumber: data.consumerPhone
        };
        visitData.brandQuestions = {
          infoShared: data.infoShared,
          converted: data.converted,
          voucherPurchased: data.voucherPurchased,
          otherPlatformsUsed: data.otherPlatforms ? data.otherPlatforms.split(',') : [],
          goldrushComparison: data.comparison,
          feedback: data.feedback
        };
      } else if (data.type === VISIT_TYPES.SHOP) {
        visitData.shopDetails = {
          name: data.shopName,
          type: data.shopType,
          address: data.shopAddress,
          contactPerson: data.contactPerson,
          contactNumber: data.contactNumber
        };
        visitData.awarenessQuestions = {
          knowsAboutBrand: data.knowsAboutBrand,
          stocksProduct: data.stocksProduct
        };
        visitData.stockAndSales = {
          currentSales: data.currentSales,
          source: data.source
        };
        visitData.competitorInfo = {
          productsStocked: data.competitorProducts ? data.competitorProducts.split(',') : [],
          prices: data.competitorPrices ? JSON.parse(data.competitorPrices) : {},
          brands: data.competitorBrands ? data.competitorBrands.split(',') : []
        };
        visitData.shelfAnalysis = {
          shelfShare: data.shelfShare,
          gridMarked: data.gridMarked
        };
        visitData.advertising = {
          competitorAdverts: data.competitorAdverts ? data.competitorAdverts.split(',') : [],
          newBoardPlaced: data.newBoardPlaced
        };
        visitData.training = {
          cashierTrained: data.cashierTrained,
          infographicDisplayed: data.infographicDisplayed
        };
      }
      
      // Create the visit
      const newVisit = await createVisit(visitData, user?.useRealApi);
      
      // Handle photo uploads if any
      if (data.idPhoto && data.type === VISIT_TYPES.CONSUMER) {
        await uploadVisitPhoto(newVisit.id, 'id', data.idPhoto[0], user?.useRealApi);
      }
      
      if (data.shelfPhoto && data.type === VISIT_TYPES.SHOP) {
        await uploadVisitPhoto(newVisit.id, 'shelf', data.shelfPhoto[0], user?.useRealApi);
      }
      
      if (data.exteriorPhoto && data.type === VISIT_TYPES.SHOP) {
        await uploadVisitPhoto(newVisit.id, 'exterior', data.exteriorPhoto[0], user?.useRealApi);
      }
      
      if (data.boardPhoto && data.type === VISIT_TYPES.SHOP) {
        await uploadVisitPhoto(newVisit.id, 'board', data.boardPhoto[0], user?.useRealApi);
      }
      
      // Show success message
      setSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setSuccess(false);
        setVisitType(null);
        setStep(1);
        reset();
        navigate('/agent/visit-history');
      }, 2000);
    } catch (error) {
      console.error('Error creating visit:', error);
      // Handle error state here
    } finally {
      setLoading(false);
    }
  };

  // Mock function to get current location
  const getCurrentLocation = () => {
    // In a real app, this would use the Geolocation API
    return { lat: -33.918861 + (Math.random() * 0.1), lng: 18.423300 + (Math.random() * 0.1) };
  };

  // Function to handle photo selection
  const takePhoto = (fieldName) => {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    
    // Set up the change event handler
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Create a URL for the selected file
        const photoUrl = URL.createObjectURL(file);
        
        // Update the form with the selected photo URL
        switch(fieldName) {
          case 'ID Photo':
            reset({ ...watch(), idPhoto: photoUrl });
            break;
          case 'Shelf Photo':
            reset({ ...watch(), shelfPhoto: photoUrl });
            break;
          case 'Exterior Photo':
            reset({ ...watch(), exteriorPhoto: photoUrl });
            break;
          case 'Board Photo':
            reset({ ...watch(), boardPhoto: photoUrl });
            break;
          default:
            break;
        }
      }
    };
    
    // Trigger the file selection dialog
    fileInput.click();
    
    // Return a placeholder URL initially
    // The actual URL will be set in the onchange handler
    return null;
  };

  // Render different steps based on visit type
  const renderStep = () => {
    if (!visitType) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>New Visit</CardTitle>
            <CardDescription>Select the type of visit you want to create</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card 
              className={`cursor-pointer hover:border-blue-300 transition-colors`}
              onClick={() => handleVisitTypeSelect(VISIT_TYPES.CONSUMER)}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <User className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="font-medium text-lg mb-2">Consumer Visit</h3>
                <p className="text-gray-500 text-sm">
                  Record interactions with individual consumers, including conversions and feedback
                </p>
              </CardContent>
            </Card>
            
            <Card 
              className={`cursor-pointer hover:border-blue-300 transition-colors`}
              onClick={() => handleVisitTypeSelect(VISIT_TYPES.SHOP)}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <ShoppingBag className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="font-medium text-lg mb-2">Shop Visit</h3>
                <p className="text-gray-500 text-sm">
                  Record shop visits, including shelf analysis, stock information, and training
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      );
    }

    if (visitType === VISIT_TYPES.CONSUMER) {
      switch (step) {
        case 1:
          return (
            <Card>
              <CardHeader>
                <CardTitle>Consumer Details</CardTitle>
                <CardDescription>Record the consumer's personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const location = getCurrentLocation();
                      reset({ ...watch(), geocode: location });
                    }}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Capture Location
                  </Button>
                  <span className="text-sm text-gray-500">
                    {watch('geocode')?.lat.toFixed(6)}, {watch('geocode')?.lng.toFixed(6)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="consumerName">First Name</Label>
                    <Input
                      id="consumerName"
                      {...register('consumerName', { required: 'First name is required' })}
                    />
                    {errors.consumerName && (
                      <p className="text-sm text-rose-500">{errors.consumerName.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="consumerSurname">Last Name</Label>
                    <Input
                      id="consumerSurname"
                      {...register('consumerSurname', { required: 'Last name is required' })}
                    />
                    {errors.consumerSurname && (
                      <p className="text-sm text-rose-500">{errors.consumerSurname.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cellNumber">Cell Number</Label>
                  <Input
                    id="cellNumber"
                    type="tel"
                    {...register('cellNumber', { required: 'Cell number is required' })}
                  />
                  {errors.cellNumber && (
                    <p className="text-sm text-rose-500">{errors.cellNumber.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>ID/Passport Photo</Label>
                  <div className="flex items-center space-x-2">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        takePhoto('ID Photo');
                      }}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Select Photo
                    </Button>
                    {watch('idPhoto') && (
                      <span className="text-sm text-green-600 flex items-center">
                        <Check className="h-4 w-4 mr-1" />
                        Photo selected
                      </span>
                    )}
                  </div>
                  {watch('idPhoto') && (
                    <div className="mt-2">
                      <img 
                        src={watch('idPhoto')} 
                        alt="ID/Passport" 
                        className="max-h-32 rounded border border-gray-200" 
                      />
                    </div>
                  )}
                  {errors.idPhoto && (
                    <p className="text-sm text-rose-500">{errors.idPhoto.message}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setVisitType(null);
                    reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={nextStep}>Next</Button>
              </CardFooter>
            </Card>
          );
        case 2:
          return (
            <Card>
              <CardHeader>
                <CardTitle>Brand Questions</CardTitle>
                <CardDescription>Record the consumer's responses to brand questions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="infoShared"
                      {...register('infoShared')}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                    />
                    <Label htmlFor="infoShared">Brand information shared with consumer</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="converted"
                      {...register('converted')}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                    />
                    <Label htmlFor="converted">Consumer converted to use our product</Label>
                  </div>
                </div>
                
                {watch('converted') && (
                  <div className="space-y-2 pl-6 border-l-2 border-blue-100">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="voucherPurchased"
                        {...register('voucherPurchased')}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                      />
                      <Label htmlFor="voucherPurchased">Voucher purchased</Label>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label>Other betting platforms used</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['BetMax', 'SportKing', 'LuckyBet', 'BetPro', 'QuickBet', 'None'].map((platform) => (
                      <div key={platform} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`platform-${platform}`}
                          value={platform}
                          {...register('otherPlatformsUsed')}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                        />
                        <Label htmlFor={`platform-${platform}`}>{platform}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Goldrush comparison to competitors</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Better', 'Same', 'Worse'].map((comparison) => (
                      <div key={comparison} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`comparison-${comparison}`}
                          value={comparison}
                          {...register('goldrushComparison')}
                          className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
                        />
                        <Label htmlFor={`comparison-${comparison}`}>{comparison}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="feedback">Additional Feedback</Label>
                  <textarea
                    id="feedback"
                    {...register('feedback')}
                    className="w-full min-h-[100px] rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                    placeholder="Enter any additional feedback from the consumer..."
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button type="button" onClick={handleSubmit(onSubmit)}>
                  {loading ? 'Submitting...' : 'Submit Visit'}
                </Button>
              </CardFooter>
            </Card>
          );
        default:
          return null;
      }
    }

    if (visitType === VISIT_TYPES.SHOP) {
      switch (step) {
        case 1:
          return (
            <Card>
              <CardHeader>
                <CardTitle>Shop Details</CardTitle>
                <CardDescription>Record the shop's information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const location = getCurrentLocation();
                      reset({ ...watch(), geocode: location });
                    }}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Capture Location
                  </Button>
                  <span className="text-sm text-gray-500">
                    {watch('geocode')?.lat.toFixed(6)}, {watch('geocode')?.lng.toFixed(6)}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shopName">Shop Name</Label>
                  <Input
                    id="shopName"
                    {...register('shopName', { required: 'Shop name is required' })}
                  />
                  {errors.shopName && (
                    <p className="text-sm text-rose-500">{errors.shopName.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shopType">Shop Type</Label>
                  <select
                    id="shopType"
                    {...register('shopType', { required: 'Shop type is required' })}
                    className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                  >
                    <option value="">Select shop type</option>
                    <option value="Convenience Store">Convenience Store</option>
                    <option value="Supermarket">Supermarket</option>
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="Gas Station">Gas Station</option>
                    <option value="Department Store">Department Store</option>
                  </select>
                  {errors.shopType && (
                    <p className="text-sm text-rose-500">{errors.shopType.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shopAddress">Shop Address</Label>
                  <Input
                    id="shopAddress"
                    {...register('shopAddress', { required: 'Shop address is required' })}
                  />
                  {errors.shopAddress && (
                    <p className="text-sm text-rose-500">{errors.shopAddress.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <Input
                      id="contactPerson"
                      {...register('contactPerson')}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    <Input
                      id="contactNumber"
                      type="tel"
                      {...register('contactNumber')}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setVisitType(null);
                    reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={nextStep}>Next</Button>
              </CardFooter>
            </Card>
          );
        case 2:
          return (
            <Card>
              <CardHeader>
                <CardTitle>Brand Awareness & Stock</CardTitle>
                <CardDescription>Record brand awareness and stock information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="knowsAboutBrand"
                      {...register('knowsAboutBrand')}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                    />
                    <Label htmlFor="knowsAboutBrand">Shop knows about our brand</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="stocksProduct"
                      {...register('stocksProduct')}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                    />
                    <Label htmlFor="stocksProduct">Shop stocks our product</Label>
                  </div>
                </div>
                
                {watch('stocksProduct') && (
                  <div className="space-y-4 pl-6 border-l-2 border-blue-100">
                    <div className="space-y-2">
                      <Label htmlFor="currentSales">Current Sales (units)</Label>
                      <Input
                        id="currentSales"
                        type="number"
                        {...register('currentSales', { valueAsNumber: true })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="source">Source of Products</Label>
                      <select
                        id="source"
                        {...register('source')}
                        className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                      >
                        <option value="">Select source</option>
                        <option value="Wholesaler">Wholesaler</option>
                        <option value="Manufacturer">Manufacturer</option>
                        <option value="Distributor">Distributor</option>
                      </select>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label>Competitor Products Stocked</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {brands.map((brand) => (
                      <div key={brand.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`brand-${brand.id}`}
                          value={brand.name}
                          {...register('productsStocked')}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                        />
                        <Label htmlFor={`brand-${brand.id}`}>{brand.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button type="button" onClick={nextStep}>Next</Button>
              </CardFooter>
            </Card>
          );
        case 3:
          return (
            <Card>
              <CardHeader>
                <CardTitle>Shelf Analysis</CardTitle>
                <CardDescription>Capture shelf photos and analyze shelf share</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Shelf Photo</Label>
                  <div className="flex items-center space-x-2">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        takePhoto('Shelf Photo');
                      }}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Select Photo
                    </Button>
                    {watch('shelfPhoto') && (
                      <span className="text-sm text-green-600 flex items-center">
                        <Check className="h-4 w-4 mr-1" />
                        Photo selected
                      </span>
                    )}
                  </div>
                  {watch('shelfPhoto') && (
                    <div className="mt-4">
                      <ShelfAnalysisGrid 
                        imageUrl={watch('shelfPhoto')} 
                        onShelfShareCalculated={(percentage) => {
                          reset({ 
                            ...watch(), 
                            shelfShare: percentage,
                            gridMarked: true 
                          });
                        }}
                      />
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shelfShare">Shelf Share (%)</Label>
                  <Input
                    id="shelfShare"
                    type="number"
                    min="0"
                    max="100"
                    {...register('shelfShare', { 
                      valueAsNumber: true,
                      min: { value: 0, message: 'Shelf share cannot be negative' },
                      max: { value: 100, message: 'Shelf share cannot exceed 100%' }
                    })}
                    readOnly
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500">
                    This value is automatically calculated from your grid selection above.
                  </p>
                  {errors.shelfShare && (
                    <p className="text-sm text-rose-500">{errors.shelfShare.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="gridMarked"
                      {...register('gridMarked')}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                      disabled
                    />
                    <Label htmlFor="gridMarked">Grid marked for shelf analysis</Label>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-md">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                    <p className="text-sm text-blue-700">
                      To analyze shelf share, mark the grid quadrants occupied by our products in the shelf photo. The system will calculate the percentage automatically.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button type="button" onClick={nextStep}>Next</Button>
              </CardFooter>
            </Card>
          );
        case 4:
          return (
            <Card>
              <CardHeader>
                <CardTitle>Advertising & Training</CardTitle>
                <CardDescription>Record advertising materials and training information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Shop Exterior Photo</Label>
                  <div className="flex items-center space-x-2">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        takePhoto('Exterior Photo');
                      }}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Select Photo
                    </Button>
                    {watch('exteriorPhoto') && (
                      <span className="text-sm text-green-600 flex items-center">
                        <Check className="h-4 w-4 mr-1" />
                        Photo selected
                      </span>
                    )}
                  </div>
                  {watch('exteriorPhoto') && (
                    <div className="mt-2">
                      <img 
                        src={watch('exteriorPhoto')} 
                        alt="Shop Exterior" 
                        className="max-h-32 rounded border border-gray-200" 
                      />
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Advertising Board Photo</Label>
                  <div className="flex items-center space-x-2">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        takePhoto('Board Photo');
                      }}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Select Photo
                    </Button>
                    {watch('boardPhoto') && (
                      <span className="text-sm text-green-600 flex items-center">
                        <Check className="h-4 w-4 mr-1" />
                        Photo selected
                      </span>
                    )}
                  </div>
                  {watch('boardPhoto') && (
                    <div className="mt-2">
                      <img 
                        src={watch('boardPhoto')} 
                        alt="Advertising Board" 
                        className="max-h-32 rounded border border-gray-200" 
                      />
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Competitor Adverts Visible</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {brands.map((brand) => (
                      <div key={brand.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`advert-${brand.id}`}
                          value={brand.name}
                          {...register('competitorAdverts')}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                        />
                        <Label htmlFor={`advert-${brand.id}`}>{brand.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="newBoardPlaced"
                      {...register('newBoardPlaced')}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                    />
                    <Label htmlFor="newBoardPlaced">New advertising board placed</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="cashierTrained"
                      {...register('cashierTrained')}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                    />
                    <Label htmlFor="cashierTrained">Cashier trained on products</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="infographicDisplayed"
                      {...register('infographicDisplayed')}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                    />
                    <Label htmlFor="infographicDisplayed">Brand infographic displayed</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <textarea
                    id="notes"
                    {...register('notes')}
                    className="w-full min-h-[100px] rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                    placeholder="Enter any additional notes about the shop visit..."
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button type="button" onClick={handleSubmit(onSubmit)}>
                  {loading ? 'Submitting...' : 'Submit Visit'}
                </Button>
              </CardFooter>
            </Card>
          );
        default:
          return null;
      }
    }
  };

  // Success message
  if (success) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Visit Submitted Successfully</h2>
              <p className="text-gray-500 mb-6">
                Your {visitType} visit has been recorded successfully.
              </p>
              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => {
                  setVisitType(null);
                  setStep(1);
                  reset();
                  setSuccess(false);
                }}>
                  New Visit
                </Button>
                <Button onClick={() => navigate('/agent/visit-history')}>
                  View History
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New Visit</h1>
        
        {/* Progress indicator for multi-step forms */}
        {visitType && (
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    1
                  </div>
                  <div className={`h-1 flex-1 ${
                    step > 1 ? 'bg-blue-600' : 'bg-gray-200'
                  }`}></div>
                </div>
                <p className="text-xs mt-1 text-center">
                  {visitType === VISIT_TYPES.CONSUMER ? 'Consumer Details' : 'Shop Details'}
                </p>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    2
                  </div>
                  {visitType === VISIT_TYPES.SHOP && (
                    <div className={`h-1 flex-1 ${
                      step > 2 ? 'bg-blue-600' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
                <p className="text-xs mt-1 text-center">
                  {visitType === VISIT_TYPES.CONSUMER ? 'Brand Questions' : 'Awareness & Stock'}
                </p>
              </div>
              
              {visitType === VISIT_TYPES.SHOP && (
                <>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        3
                      </div>
                      <div className={`h-1 flex-1 ${
                        step > 3 ? 'bg-blue-600' : 'bg-gray-200'
                      }`}></div>
                    </div>
                    <p className="text-xs mt-1 text-center">Shelf Analysis</p>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step >= 4 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        4
                      </div>
                    </div>
                    <p className="text-xs mt-1 text-center">Advertising & Training</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        
        {renderStep()}
      </div>
    </div>
  );
};

export default NewVisitPage;