// Mock data for brands
import { tenants } from './users';

// Brand statuses
export const BRAND_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending'
};

// Generate brands
export const brands = [
  // Added tenantCount and surveyCount for dashboard compatibility
  {
    id: 1,
    name: 'Goldrush',
    logo: 'https://placehold.co/200x100/gold/black?text=Goldrush',
    description: 'Leading betting platform with nationwide presence',
    status: BRAND_STATUS.ACTIVE,
    tenantId: 1,
    tenantCount: 2,
    surveyCount: 5,
    createdAt: '2024-08-15T10:30:00Z',
    updatedAt: '2024-09-05T14:45:00Z',
    infographics: [
      {
        id: 101,
        title: 'Goldrush Product Overview',
        image: 'https://placehold.co/800x600/gold/black?text=Goldrush+Overview',
        description: 'Complete overview of Goldrush products and services'
      },
      {
        id: 102,
        title: 'Goldrush Betting Guide',
        image: 'https://placehold.co/800x600/gold/black?text=Betting+Guide',
        description: 'Guide to betting options and strategies'
      }
    ],
    trainingMaterials: [
      {
        id: 201,
        title: 'Goldrush Sales Training',
        content: 'Comprehensive training for sales agents on Goldrush products',
        url: 'https://example.com/training/goldrush-sales'
      },
      {
        id: 202,
        title: 'Goldrush Customer Service',
        content: 'Training for customer service and support',
        url: 'https://example.com/training/goldrush-service'
      }
    ]
  },
  {
    id: 2,
    name: 'BetMax',
    logo: 'https://placehold.co/200x100/blue/white?text=BetMax',
    description: 'Premium betting services with exclusive offers',
    status: BRAND_STATUS.ACTIVE,
    tenantId: 1,
    tenantCount: 1,
    surveyCount: 3,
    createdAt: '2024-07-20T09:15:00Z',
    updatedAt: '2024-09-01T11:30:00Z',
    infographics: [
      {
        id: 103,
        title: 'BetMax Product Range',
        image: 'https://placehold.co/800x600/blue/white?text=BetMax+Products',
        description: 'Overview of BetMax product range and features'
      }
    ],
    trainingMaterials: [
      {
        id: 203,
        title: 'BetMax Sales Techniques',
        content: 'Advanced sales techniques for BetMax products',
        url: 'https://example.com/training/betmax-sales'
      }
    ]
  },
  {
    id: 3,
    name: 'SportKing',
    logo: 'https://placehold.co/200x100/green/white?text=SportKing',
    description: 'Sports-focused betting platform with live odds',
    status: BRAND_STATUS.ACTIVE,
    tenantId: 2,
    tenantCount: 1,
    surveyCount: 2,
    createdAt: '2024-06-10T14:20:00Z',
    updatedAt: '2024-08-25T16:40:00Z',
    infographics: [
      {
        id: 104,
        title: 'SportKing Offerings',
        image: 'https://placehold.co/800x600/green/white?text=SportKing+Offerings',
        description: 'Complete guide to SportKing betting options'
      }
    ],
    trainingMaterials: [
      {
        id: 204,
        title: 'SportKing Product Knowledge',
        content: 'Detailed product knowledge for SportKing offerings',
        url: 'https://example.com/training/sportking-products'
      }
    ]
  },
  {
    id: 4,
    name: 'LuckyBet',
    logo: 'https://placehold.co/200x100/red/white?text=LuckyBet',
    description: 'Casual betting platform with jackpot opportunities',
    status: BRAND_STATUS.ACTIVE,
    tenantId: 2,
    tenantCount: 1,
    surveyCount: 1,
    createdAt: '2024-05-05T08:45:00Z',
    updatedAt: '2024-08-15T10:20:00Z',
    infographics: [
      {
        id: 105,
        title: 'LuckyBet Jackpots',
        image: 'https://placehold.co/800x600/red/white?text=LuckyBet+Jackpots',
        description: 'Guide to LuckyBet jackpot system and prizes'
      }
    ],
    trainingMaterials: [
      {
        id: 205,
        title: 'LuckyBet Sales Approach',
        content: 'Customer-focused sales approach for LuckyBet products',
        url: 'https://example.com/training/luckybet-sales'
      }
    ]
  },
  {
    id: 5,
    name: 'BetPro',
    logo: 'https://placehold.co/200x100/purple/white?text=BetPro',
    description: 'Professional betting platform for serious bettors',
    status: BRAND_STATUS.ACTIVE,
    tenantId: 3,
    tenantCount: 1,
    surveyCount: 2,
    createdAt: '2024-04-15T11:30:00Z',
    updatedAt: '2024-09-10T09:15:00Z',
    infographics: [
      {
        id: 106,
        title: 'BetPro Advanced Features',
        image: 'https://placehold.co/800x600/purple/white?text=BetPro+Features',
        description: 'Advanced features and tools for professional betting'
      }
    ],
    trainingMaterials: [
      {
        id: 206,
        title: 'BetPro Technical Training',
        content: 'Technical training on BetPro platform features',
        url: 'https://example.com/training/betpro-technical'
      }
    ]
  },
  {
    id: 6,
    name: 'QuickBet',
    logo: 'https://placehold.co/200x100/orange/black?text=QuickBet',
    description: 'Fast and simple betting platform for casual users',
    status: BRAND_STATUS.PENDING,
    tenantId: 3,
    tenantCount: 1,
    surveyCount: 1,
    createdAt: '2024-08-30T15:45:00Z',
    updatedAt: '2024-09-12T13:20:00Z',
    infographics: [
      {
        id: 107,
        title: 'QuickBet Simplicity',
        image: 'https://placehold.co/800x600/orange/black?text=QuickBet+Simple',
        description: 'The simplicity and ease of QuickBet platform'
      }
    ],
    trainingMaterials: [
      {
        id: 207,
        title: 'QuickBet Onboarding',
        content: 'Quick onboarding process for new QuickBet customers',
        url: 'https://example.com/training/quickbet-onboarding'
      }
    ]
  }
];

// Helper function to get brands by tenant
export const getBrandsByTenant = (tenantId) => {
  return brands.filter(brand => brand.tenantId === tenantId);
};

// Helper function to get brands by status
export const getBrandsByStatus = (status) => {
  return brands.filter(brand => brand.status === status);
};

// Helper function to get brand by ID
export const getBrandById = (brandId) => {
  return brands.find(brand => brand.id === brandId);
};