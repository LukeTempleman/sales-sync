import { brandsAPI } from '../lib/api';
import { getBrands as getMockBrands, getBrandById as getMockBrandById, getBrandsByTenant as getMockBrandsByTenant } from '../data/brands';

/**
 * Get all brands
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Array>} - Array of brands
 */
export const getBrands = async (useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await brandsAPI.getBrands();
      return response.data.brands || [];
    } catch (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }
  } else {
    // Use mock data
    return getMockBrands();
  }
};

/**
 * Get a brand by ID
 * @param {string|number} id - Brand ID
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Object>} - Brand object
 */
export const getBrandById = async (id, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await brandsAPI.getBrandById(id);
      return response.data.brand;
    } catch (error) {
      console.error(`Error fetching brand with ID ${id}:`, error);
      throw error;
    }
  } else {
    // Use mock data
    return getMockBrandById(id);
  }
};

/**
 * Get brands by tenant
 * @param {string|number} tenantId - Tenant ID
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Array>} - Array of brands for the tenant
 */
export const getBrandsByTenant = async (tenantId, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await brandsAPI.getBrands({ tenant_id: tenantId });
      return response.data.brands || [];
    } catch (error) {
      console.error(`Error fetching brands for tenant ${tenantId}:`, error);
      throw error;
    }
  } else {
    // Use mock data
    return getMockBrandsByTenant(tenantId);
  }
};

/**
 * Create a new brand
 * @param {Object} brandData - Brand data
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Object>} - Created brand
 */
export const createBrand = async (brandData, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await brandsAPI.createBrand(brandData);
      return response.data.brand;
    } catch (error) {
      console.error('Error creating brand:', error);
      throw error;
    }
  } else {
    // Mock creating a brand
    const newId = Math.max(...getMockBrands().map(b => b.id)) + 1;
    const newBrand = {
      id: newId,
      ...brandData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      infographics: [],
      trainingMaterials: []
    };
    
    // In a real app, we would update the mock data store
    // For now, we'll just return the new brand
    return newBrand;
  }
};

/**
 * Update an existing brand
 * @param {string|number} id - Brand ID
 * @param {Object} brandData - Updated brand data
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Object>} - Updated brand
 */
export const updateBrand = async (id, brandData, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await brandsAPI.updateBrand(id, brandData);
      return response.data.brand;
    } catch (error) {
      console.error(`Error updating brand with ID ${id}:`, error);
      throw error;
    }
  } else {
    // Mock updating a brand
    const brand = getMockBrandById(id);
    if (!brand) {
      throw new Error(`Brand with ID ${id} not found`);
    }
    
    const updatedBrand = {
      ...brand,
      ...brandData,
      updatedAt: new Date().toISOString()
    };
    
    // In a real app, we would update the mock data store
    // For now, we'll just return the updated brand
    return updatedBrand;
  }
};

/**
 * Delete a brand
 * @param {string|number} id - Brand ID
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Object>} - Success response
 */
export const deleteBrand = async (id, useRealApi = false) => {
  if (useRealApi) {
    try {
      await brandsAPI.deleteBrand(id);
      return { success: true };
    } catch (error) {
      console.error(`Error deleting brand with ID ${id}:`, error);
      throw error;
    }
  } else {
    // Mock deleting a brand
    // In a real app, we would update the mock data store
    return { success: true };
  }
};

/**
 * Upload brand assets (logo, infographics, etc.)
 * @param {string|number} brandId - Brand ID
 * @param {string} assetType - Type of asset (logo, infographic, training)
 * @param {File} file - File to upload
 * @param {Object} metadata - Additional metadata for the asset
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Object>} - Uploaded asset
 */
export const uploadBrandAsset = async (brandId, assetType, file, metadata = {}, useRealApi = false) => {
  if (useRealApi) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('asset_type', assetType);
      formData.append('metadata', JSON.stringify(metadata));
      
      const response = await brandsAPI.uploadBrandAsset(brandId, formData);
      return response.data.asset;
    } catch (error) {
      console.error(`Error uploading ${assetType} for brand ${brandId}:`, error);
      throw error;
    }
  } else {
    // Mock uploading a brand asset
    const asset = {
      id: Math.floor(Math.random() * 1000) + 1,
      brandId,
      type: assetType,
      filename: file.name,
      url: URL.createObjectURL(file),
      ...metadata,
      createdAt: new Date().toISOString()
    };
    
    return asset;
  }
};