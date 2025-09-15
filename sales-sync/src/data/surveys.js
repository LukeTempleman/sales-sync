// Mock data for survey templates
import { tenants } from './users';
import { brands } from './brands';

// Survey types
export const SURVEY_TYPES = {
  CONSUMER: 'consumer',
  SHOP: 'shop'
};

// Question types
export const QUESTION_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  SINGLE_CHOICE: 'single_choice',
  MULTIPLE_CHOICE: 'multiple_choice',
  PHOTO: 'photo',
  GEOCODE: 'geocode',
  GRID: 'grid'
};

// Generate consumer survey templates
export const consumerSurveyTemplates = [
  {
    id: 1,
    name: 'Standard Consumer Visit',
    type: SURVEY_TYPES.CONSUMER,
    description: 'Standard survey for consumer visits',
    tenantId: 1,
    brandId: 1,
    isActive: true,
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-08-01'),
    questions: [
      {
        id: 101,
        order: 1,
        type: QUESTION_TYPES.GEOCODE,
        label: 'Location',
        required: true,
        description: 'Capture the current location'
      },
      {
        id: 102,
        order: 2,
        type: QUESTION_TYPES.TEXT,
        label: 'Consumer Name',
        required: true,
        description: 'Enter the consumer\'s first name'
      },
      {
        id: 103,
        order: 3,
        type: QUESTION_TYPES.TEXT,
        label: 'Consumer Surname',
        required: true,
        description: 'Enter the consumer\'s last name'
      },
      {
        id: 104,
        order: 4,
        type: QUESTION_TYPES.PHOTO,
        label: 'ID/Passport Photo',
        required: true,
        description: 'Take a photo of the consumer\'s ID or passport'
      },
      {
        id: 105,
        order: 5,
        type: QUESTION_TYPES.TEXT,
        label: 'Cell Number',
        required: true,
        description: 'Enter the consumer\'s cell phone number'
      },
      {
        id: 106,
        order: 6,
        type: QUESTION_TYPES.BOOLEAN,
        label: 'Brand Info Shared',
        required: true,
        description: 'Was brand information shared with the consumer?'
      },
      {
        id: 107,
        order: 7,
        type: QUESTION_TYPES.BOOLEAN,
        label: 'Converted Consumer',
        required: true,
        description: 'Was the consumer converted to use our product?'
      },
      {
        id: 108,
        order: 8,
        type: QUESTION_TYPES.BOOLEAN,
        label: 'Voucher Purchased',
        required: false,
        description: 'Did the consumer purchase a voucher?',
        conditionalOn: { questionId: 107, value: true }
      },
      {
        id: 109,
        order: 9,
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        label: 'Other Betting Platforms Used',
        required: true,
        description: 'Which other betting platforms does the consumer use?',
        options: ['BetMax', 'SportKing', 'LuckyBet', 'BetPro', 'QuickBet', 'None']
      },
      {
        id: 110,
        order: 10,
        type: QUESTION_TYPES.SINGLE_CHOICE,
        label: 'Goldrush Comparison',
        required: true,
        description: 'How does the consumer compare Goldrush to competitors?',
        options: ['Better', 'Same', 'Worse']
      },
      {
        id: 111,
        order: 11,
        type: QUESTION_TYPES.TEXT,
        label: 'Feedback',
        required: false,
        description: 'Any additional feedback from the consumer'
      }
    ]
  },
  {
    id: 2,
    name: 'BetMax Consumer Survey',
    type: SURVEY_TYPES.CONSUMER,
    description: 'Consumer survey for BetMax brand',
    tenantId: 1,
    brandId: 2,
    isActive: true,
    createdAt: new Date('2025-02-10'),
    updatedAt: new Date('2025-07-15'),
    questions: [
      {
        id: 112,
        order: 1,
        type: QUESTION_TYPES.GEOCODE,
        label: 'Location',
        required: true,
        description: 'Capture the current location'
      },
      {
        id: 113,
        order: 2,
        type: QUESTION_TYPES.TEXT,
        label: 'Consumer Name',
        required: true,
        description: 'Enter the consumer\'s first name'
      },
      {
        id: 114,
        order: 3,
        type: QUESTION_TYPES.TEXT,
        label: 'Consumer Surname',
        required: true,
        description: 'Enter the consumer\'s last name'
      },
      {
        id: 115,
        order: 4,
        type: QUESTION_TYPES.PHOTO,
        label: 'ID/Passport Photo',
        required: true,
        description: 'Take a photo of the consumer\'s ID or passport'
      },
      {
        id: 116,
        order: 5,
        type: QUESTION_TYPES.TEXT,
        label: 'Cell Number',
        required: true,
        description: 'Enter the consumer\'s cell phone number'
      },
      {
        id: 117,
        order: 6,
        type: QUESTION_TYPES.BOOLEAN,
        label: 'BetMax Info Shared',
        required: true,
        description: 'Was BetMax information shared with the consumer?'
      },
      {
        id: 118,
        order: 7,
        type: QUESTION_TYPES.BOOLEAN,
        label: 'Converted Consumer',
        required: true,
        description: 'Was the consumer converted to use BetMax?'
      },
      {
        id: 119,
        order: 8,
        type: QUESTION_TYPES.SINGLE_CHOICE,
        label: 'BetMax Premium Features Interest',
        required: true,
        description: 'Which premium feature is the consumer most interested in?',
        options: ['Live Betting', 'VIP Rewards', 'Exclusive Odds', 'Mobile App', 'None']
      },
      {
        id: 120,
        order: 9,
        type: QUESTION_TYPES.TEXT,
        label: 'Feedback',
        required: false,
        description: 'Any additional feedback from the consumer'
      }
    ]
  }
];

// Generate shop survey templates
export const shopSurveyTemplates = [
  {
    id: 3,
    name: 'Standard Shop Visit',
    type: SURVEY_TYPES.SHOP,
    description: 'Standard survey for shop visits',
    tenantId: 1,
    brandId: 1,
    isActive: true,
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-08-05'),
    questions: [
      {
        id: 201,
        order: 1,
        type: QUESTION_TYPES.GEOCODE,
        label: 'Shop Location',
        required: true,
        description: 'Capture the shop location'
      },
      {
        id: 202,
        order: 2,
        type: QUESTION_TYPES.TEXT,
        label: 'Shop Name',
        required: true,
        description: 'Enter the shop name'
      },
      {
        id: 203,
        order: 3,
        type: QUESTION_TYPES.TEXT,
        label: 'Shop Address',
        required: true,
        description: 'Enter the shop address'
      },
      {
        id: 204,
        order: 4,
        type: QUESTION_TYPES.TEXT,
        label: 'Contact Person',
        required: true,
        description: 'Enter the name of the contact person'
      },
      {
        id: 205,
        order: 5,
        type: QUESTION_TYPES.TEXT,
        label: 'Contact Number',
        required: true,
        description: 'Enter the contact number'
      },
      {
        id: 206,
        order: 6,
        type: QUESTION_TYPES.BOOLEAN,
        label: 'Knows About Brand',
        required: true,
        description: 'Does the shop know about our brand?'
      },
      {
        id: 207,
        order: 7,
        type: QUESTION_TYPES.BOOLEAN,
        label: 'Stocks Product',
        required: true,
        description: 'Does the shop stock our product?'
      },
      {
        id: 208,
        order: 8,
        type: QUESTION_TYPES.NUMBER,
        label: 'Current Sales',
        required: true,
        description: 'Current sales volume (in units)'
      },
      {
        id: 209,
        order: 9,
        type: QUESTION_TYPES.SINGLE_CHOICE,
        label: 'Source',
        required: true,
        description: 'Source of products',
        options: ['Wholesaler', 'Manufacturer', 'Distributor']
      },
      {
        id: 210,
        order: 10,
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        label: 'Competitor Products Stocked',
        required: true,
        description: 'Which competitor products are stocked?',
        options: ['BetMax', 'SportKing', 'LuckyBet', 'BetPro', 'QuickBet', 'None']
      },
      {
        id: 211,
        order: 11,
        type: QUESTION_TYPES.PHOTO,
        label: 'Shelf Photo',
        required: true,
        description: 'Take a photo of the product shelf'
      },
      {
        id: 212,
        order: 12,
        type: QUESTION_TYPES.GRID,
        label: 'Shelf Share Analysis',
        required: true,
        description: 'Mark the grid to calculate shelf share percentage'
      },
      {
        id: 213,
        order: 13,
        type: QUESTION_TYPES.PHOTO,
        label: 'Shop Exterior Photo',
        required: true,
        description: 'Take a photo of the shop exterior'
      },
      {
        id: 214,
        order: 14,
        type: QUESTION_TYPES.PHOTO,
        label: 'Advertising Board Photo',
        required: false,
        description: 'Take a photo of any advertising boards'
      },
      {
        id: 215,
        order: 15,
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        label: 'Competitor Adverts',
        required: true,
        description: 'Which competitor adverts are visible?',
        options: ['BetMax', 'SportKing', 'LuckyBet', 'BetPro', 'QuickBet', 'None']
      },
      {
        id: 216,
        order: 16,
        type: QUESTION_TYPES.BOOLEAN,
        label: 'New Board Placed',
        required: true,
        description: 'Was a new advertising board placed?'
      },
      {
        id: 217,
        order: 17,
        type: QUESTION_TYPES.BOOLEAN,
        label: 'Cashier Trained',
        required: true,
        description: 'Was the cashier trained on our products?'
      },
      {
        id: 218,
        order: 18,
        type: QUESTION_TYPES.BOOLEAN,
        label: 'Infographic Displayed',
        required: true,
        description: 'Was the brand infographic displayed?'
      }
    ]
  },
  {
    id: 4,
    name: 'SportKing Shop Survey',
    type: SURVEY_TYPES.SHOP,
    description: 'Shop survey for SportKing brand',
    tenantId: 2,
    brandId: 3,
    isActive: true,
    createdAt: new Date('2025-03-05'),
    updatedAt: new Date('2025-07-20'),
    questions: [
      {
        id: 219,
        order: 1,
        type: QUESTION_TYPES.GEOCODE,
        label: 'Shop Location',
        required: true,
        description: 'Capture the shop location'
      },
      {
        id: 220,
        order: 2,
        type: QUESTION_TYPES.TEXT,
        label: 'Shop Name',
        required: true,
        description: 'Enter the shop name'
      },
      {
        id: 221,
        order: 3,
        type: QUESTION_TYPES.TEXT,
        label: 'Shop Address',
        required: true,
        description: 'Enter the shop address'
      },
      {
        id: 222,
        order: 4,
        type: QUESTION_TYPES.BOOLEAN,
        label: 'Knows About SportKing',
        required: true,
        description: 'Does the shop know about SportKing?'
      },
      {
        id: 223,
        order: 5,
        type: QUESTION_TYPES.BOOLEAN,
        label: 'Stocks SportKing',
        required: true,
        description: 'Does the shop stock SportKing products?'
      },
      {
        id: 224,
        order: 6,
        type: QUESTION_TYPES.PHOTO,
        label: 'Shelf Photo',
        required: true,
        description: 'Take a photo of the product shelf'
      },
      {
        id: 225,
        order: 7,
        type: QUESTION_TYPES.GRID,
        label: 'Shelf Share Analysis',
        required: true,
        description: 'Mark the grid to calculate shelf share percentage'
      },
      {
        id: 226,
        order: 8,
        type: QUESTION_TYPES.BOOLEAN,
        label: 'Sports Fixtures Displayed',
        required: true,
        description: 'Are sports fixtures displayed in the shop?'
      },
      {
        id: 227,
        order: 9,
        type: QUESTION_TYPES.BOOLEAN,
        label: 'Live Odds Displayed',
        required: true,
        description: 'Are live odds displayed in the shop?'
      }
    ]
  }
];

// All survey templates combined
export const allSurveyTemplates = [...consumerSurveyTemplates, ...shopSurveyTemplates];

// Helper function to get survey templates by type
export const getSurveyTemplatesByType = (type) => {
  return allSurveyTemplates.filter(template => template.type === type);
};

// Helper function to get survey templates by tenant
export const getSurveyTemplatesByTenant = (tenantId) => {
  return allSurveyTemplates.filter(template => template.tenantId === tenantId);
};

// Helper function to get survey templates by brand
export const getSurveyTemplatesByBrand = (brandId) => {
  return allSurveyTemplates.filter(template => template.brandId === brandId);
};

// Helper function to get active survey templates
export const getActiveSurveyTemplates = () => {
  return allSurveyTemplates.filter(template => template.isActive);
};