import { surveysAPI } from '../lib/api';
import { 
  consumerSurveyTemplates, 
  shopSurveyTemplates, 
  SURVEY_TYPES, 
  QUESTION_TYPES 
} from '../data/surveys';

/**
 * Get all survey templates
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Array>} - Array of survey templates
 */
export const getSurveyTemplates = async (useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await surveysAPI.getSurveyTemplates();
      return response.data.templates || [];
    } catch (error) {
      console.error('Error fetching survey templates:', error);
      throw error;
    }
  } else {
    // Use mock data
    return [...consumerSurveyTemplates, ...shopSurveyTemplates];
  }
};

/**
 * Get survey templates by type
 * @param {string} type - Survey type (consumer or shop)
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Array>} - Array of survey templates of the specified type
 */
export const getSurveyTemplatesByType = async (type, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await surveysAPI.getSurveyTemplates({ type });
      return response.data.templates || [];
    } catch (error) {
      console.error(`Error fetching ${type} survey templates:`, error);
      throw error;
    }
  } else {
    // Use mock data
    if (type === SURVEY_TYPES.CONSUMER) {
      return consumerSurveyTemplates;
    } else if (type === SURVEY_TYPES.SHOP) {
      return shopSurveyTemplates;
    } else {
      return [];
    }
  }
};

/**
 * Get survey templates by tenant
 * @param {string|number} tenantId - Tenant ID
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Array>} - Array of survey templates for the tenant
 */
export const getSurveyTemplatesByTenant = async (tenantId, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await surveysAPI.getSurveyTemplates({ tenant_id: tenantId });
      return response.data.templates || [];
    } catch (error) {
      console.error(`Error fetching survey templates for tenant ${tenantId}:`, error);
      throw error;
    }
  } else {
    // Use mock data
    const allTemplates = [...consumerSurveyTemplates, ...shopSurveyTemplates];
    return allTemplates.filter(template => template.tenantId === tenantId);
  }
};

/**
 * Get a survey template by ID
 * @param {string|number} id - Survey template ID
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Object>} - Survey template object
 */
export const getSurveyTemplateById = async (id, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await surveysAPI.getSurveyTemplateById(id);
      return response.data.template;
    } catch (error) {
      console.error(`Error fetching survey template with ID ${id}:`, error);
      throw error;
    }
  } else {
    // Use mock data
    const allTemplates = [...consumerSurveyTemplates, ...shopSurveyTemplates];
    return allTemplates.find(template => template.id === id);
  }
};

/**
 * Create a new survey template
 * @param {Object} templateData - Survey template data
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Object>} - Created survey template
 */
export const createSurveyTemplate = async (templateData, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await surveysAPI.createSurveyTemplate(templateData);
      return response.data.template;
    } catch (error) {
      console.error('Error creating survey template:', error);
      throw error;
    }
  } else {
    // Mock creating a survey template
    const allTemplates = [...consumerSurveyTemplates, ...shopSurveyTemplates];
    const newId = Math.max(...allTemplates.map(t => t.id)) + 1;
    const newTemplate = {
      id: newId,
      ...templateData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // In a real app, we would update the mock data store
    // For now, we'll just return the new template
    return newTemplate;
  }
};

/**
 * Update an existing survey template
 * @param {string|number} id - Survey template ID
 * @param {Object} templateData - Updated survey template data
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Object>} - Updated survey template
 */
export const updateSurveyTemplate = async (id, templateData, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await surveysAPI.updateSurveyTemplate(id, templateData);
      return response.data.template;
    } catch (error) {
      console.error(`Error updating survey template with ID ${id}:`, error);
      throw error;
    }
  } else {
    // Mock updating a survey template
    const allTemplates = [...consumerSurveyTemplates, ...shopSurveyTemplates];
    const template = allTemplates.find(t => t.id === id);
    if (!template) {
      throw new Error(`Survey template with ID ${id} not found`);
    }
    
    const updatedTemplate = {
      ...template,
      ...templateData,
      updatedAt: new Date().toISOString()
    };
    
    // In a real app, we would update the mock data store
    // For now, we'll just return the updated template
    return updatedTemplate;
  }
};

/**
 * Delete a survey template
 * @param {string|number} id - Survey template ID
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Object>} - Success response
 */
export const deleteSurveyTemplate = async (id, useRealApi = false) => {
  if (useRealApi) {
    try {
      await surveysAPI.deleteSurveyTemplate(id);
      return { success: true };
    } catch (error) {
      console.error(`Error deleting survey template with ID ${id}:`, error);
      throw error;
    }
  } else {
    // Mock deleting a survey template
    // In a real app, we would update the mock data store
    return { success: true };
  }
};

/**
 * Get completed surveys
 * @param {Object} filters - Filters for the surveys
 * @param {boolean} useRealApi - Whether to use the real API or mock data
 * @returns {Promise<Array>} - Array of completed surveys
 */
export const getCompletedSurveys = async (filters = {}, useRealApi = false) => {
  if (useRealApi) {
    try {
      const response = await surveysAPI.getCompletedSurveys(filters);
      return response.data.surveys || [];
    } catch (error) {
      console.error('Error fetching completed surveys:', error);
      throw error;
    }
  } else {
    // Mock completed surveys
    // In a real app, we would have mock data for completed surveys
    return [];
  }
};