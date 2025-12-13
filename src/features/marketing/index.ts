/**
 * Marketing Module Index
 * Central export point for all marketing-related components and services
 */

// Types
export * from './types/campaign.types';
export * from './types/promo.types';

// Services
export {
  CampaignService,
  AudienceSegmentService,
  CampaignTemplateService,
  CampaignAnalyticsService,
  CampaignPromoCodeService,
} from './services/campaign.service';

// Context
export { CampaignProvider, useCampaignContext } from './context/CampaignContext';

// Components
export { CampaignForm } from './components/CampaignForm';
export { CampaignList } from './components/CampaignList';
export { CampaignAnalyticsDashboard } from './components/CampaignAnalytics';
export { ABTesting } from './components/ABTesting';

// Pages
export { CampaignsManager } from './pages/CampaignsManager';
