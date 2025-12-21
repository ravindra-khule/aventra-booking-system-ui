# Marketing Campaigns Feature - Implementation Guide

## Overview

The Marketing Campaigns module is a comprehensive multi-channel campaign management system for the Aventra Booking System. It enables creation, execution, and tracking of marketing campaigns across email, SMS, and social media channels with advanced features like audience segmentation, A/B testing, and ROI tracking.

## Features Implemented

### 1. **Multi-Channel Campaign Management**
- **Supported Channels:**
  - Email campaigns
  - SMS campaigns
  - Social Media (Facebook, Instagram, Twitter, LinkedIn)
  - Push Notifications

- **Campaign Lifecycle:**
  - Draft → Scheduled → Active → Completed
  - Support for pausing and cancelling campaigns
  - Scheduled delivery with timezone support

### 2. **Audience Segmentation**
- **Segment Types:**
  - Booking History-based segmentation
  - Customer Value segmentation
  - Geographic segmentation
  - Behavioral segmentation
  - Custom filters

- **Key Capabilities:**
  - Create and manage audience segments
  - Filter by booking frequency, total spend, last booking date
  - Real-time customer count estimation
  - Flexible criteria-based targeting

### 3. **Campaign Templates**
- **Pre-built Templates:**
  - Seasonal Promotions
  - Welcome Series
  - Abandoned Cart Recovery
  - Win-Back Campaigns
  - Cross-Sell Opportunities
  - Loyalty Rewards

- **Template Features:**
  - Customizable email, SMS, and social content
  - Recommended channels per template
  - Estimated conversion rates
  - Quick-start campaign creation

### 4. **A/B Testing**
- **Test Configuration:**
  - Multiple variant support
  - Custom traffic distribution
  - Configurable test duration
  - Statistical significance calculation

- **Metrics Tracked:**
  - Open rates (email)
  - Click rates
  - Conversion rates
  - Revenue impact
  - Automatic winner detection

### 5. **Real-Time Analytics Dashboard**
- **Metrics:**
  - Delivery rates
  - Open rates
  - Click-through rates
  - Conversion rates
  - Bounce rates
  - Unsubscribe rates

- **Visualizations:**
  - Performance trends (line charts)
  - Channel distribution (pie charts)
  - Channel performance comparison (bar charts)
  - Hourly breakdown

### 6. **ROI Tracking**
- **Metrics Calculated:**
  - Campaign cost
  - Revenue generated
  - Gross profit
  - Return on Investment (ROI%)
  - Return on Ad Spend (ROAS)
  - Cost per conversion
  - Break-even analysis

### 7. **Promo Code Integration**
- Associate campaigns with discount codes
- Track usage by campaign
- Measure conversion impact of promo codes
- Revenue attribution to campaigns

## Project Structure

```
src/features/marketing/
├── types/
│   ├── campaign.types.ts          # Campaign type definitions
│   └── promo.types.ts             # Promo code types (existing)
├── services/
│   └── campaign.service.ts        # API service layer
├── context/
│   └── CampaignContext.tsx        # Global state management
├── components/
│   ├── CampaignForm.tsx           # Campaign creation/editing
│   ├── CampaignForm.module.css    # Form styles
│   ├── CampaignList.tsx           # Campaign list view
│   ├── CampaignList.module.css    # List styles
│   ├── CampaignAnalytics.tsx      # Analytics dashboard
│   ├── CampaignAnalytics.module.css
│   ├── ABTesting.tsx              # A/B testing component
│   ├── ABTesting.module.css       # A/B testing styles
│   ├── CampaignsManager.tsx       # Main page container
│   └── CampaignsManager.module.css
├── pages/
│   └── CampaignsManager.tsx       # Page wrapper
└── index.ts                       # Module exports
```

## Type Definitions

### Core Types

#### Campaign
Main campaign object containing all campaign settings and metrics.

```typescript
interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  channels: CampaignChannel[];
  templateId?: string;
  audienceSegments: AudienceSegment[];
  
  // Content
  emailContent?: EmailTemplateContent;
  smsContent?: SMSTemplateContent;
  socialContent?: SocialTemplateContent;
  
  // Scheduling
  startDate: Date;
  endDate: Date;
  
  // A/B Testing
  hasABTest: boolean;
  abTestConfig?: ABTestConfig;
  
  // Tracking
  metrics: CampaignMetrics;
  roiTracking: ROIMetrics;
  
  // Metadata
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### AudienceSegment
Defines a target audience group.

```typescript
interface AudienceSegment {
  id: string;
  name: string;
  segmentType: AudienceSegmentType;
  criteria: SegmentCriteria;
  customerCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

#### ABTestConfig
Configuration for A/B testing.

```typescript
interface ABTestConfig {
  id: string;
  testName: string;
  status: ABTestStatus;
  variants: ABTestVariant[];
  testDuration: number;
  startedAt: Date;
  winningVariant?: string;
  confidence?: number;
}
```

#### CampaignMetrics
Performance metrics for a campaign.

```typescript
interface CampaignMetrics {
  sent: number;
  delivered: number;
  opened?: number;
  clicked?: number;
  converted: number;
  revenue: number;
  deliveryRate: number;
  conversionRate: number;
}
```

#### ROIMetrics
Return on investment calculations.

```typescript
interface ROIMetrics {
  campaignCost: number;
  revenue: number;
  profit: number;
  roi: number;
  roas: number;
  costPerConversion: number;
}
```

## API Endpoints

### Campaign Management
- `GET /api/marketing/campaigns` - List campaigns
- `POST /api/marketing/campaigns` - Create campaign
- `GET /api/marketing/campaigns/:id` - Get campaign details
- `PUT /api/marketing/campaigns/:id` - Update campaign
- `DELETE /api/marketing/campaigns/:id` - Delete campaign
- `PATCH /api/marketing/campaigns/:id/status` - Update status
- `POST /api/marketing/campaigns/:id/send` - Send immediately
- `POST /api/marketing/campaigns/:id/schedule` - Schedule delivery
- `POST /api/marketing/campaigns/:id/duplicate` - Duplicate campaign

### Audience Segments
- `GET /api/marketing/segments` - List segments
- `POST /api/marketing/segments` - Create segment
- `GET /api/marketing/segments/:id` - Get segment
- `PUT /api/marketing/segments/:id` - Update segment
- `DELETE /api/marketing/segments/:id` - Delete segment
- `GET /api/marketing/segments/:id/count` - Get customer count

### Templates
- `GET /api/marketing/templates` - List templates
- `POST /api/marketing/templates` - Create template
- `GET /api/marketing/templates/:id` - Get template

### Analytics
- `GET /api/marketing/campaigns/:id/analytics` - Campaign analytics
- `GET /api/marketing/campaigns/:id/metrics` - Real-time metrics
- `GET /api/marketing/campaigns/:id/roi` - ROI metrics
- `GET /api/marketing/campaigns/:id/ab-test` - A/B test results
- `POST /api/marketing/campaigns/:id/ab-test/apply-winner` - Apply winning variant

### Promo Code Integration
- `POST /api/marketing/campaigns/:id/promo-code` - Associate promo code
- `GET /api/marketing/campaigns/:id/promo-code/usage` - Promo code usage stats

## Service Classes

### CampaignService
Handles all campaign CRUD operations.

```typescript
CampaignService.getCampaigns(filter?, page?, limit?);
CampaignService.getCampaignById(id);
CampaignService.createCampaign(data);
CampaignService.updateCampaign(id, data);
CampaignService.deleteCampaign(id);
CampaignService.updateCampaignStatus(id, status);
CampaignService.scheduleCampaign(id, date);
CampaignService.sendCampaignNow(id);
CampaignService.duplicateCampaign(id);
```

### AudienceSegmentService
Manages audience segments.

```typescript
AudienceSegmentService.getSegments();
AudienceSegmentService.getSegmentById(id);
AudienceSegmentService.createSegment(data);
AudienceSegmentService.updateSegment(id, data);
AudienceSegmentService.deleteSegment(id);
AudienceSegmentService.getSegmentCustomerCount(id);
```

### CampaignTemplateService
Manages campaign templates.

```typescript
CampaignTemplateService.getTemplates();
CampaignTemplateService.getTemplateById(id);
CampaignTemplateService.createTemplate(data);
```

### CampaignAnalyticsService
Provides analytics and performance data.

```typescript
CampaignAnalyticsService.getCampaignAnalytics(request);
CampaignAnalyticsService.getCampaignMetrics(campaignId);
CampaignAnalyticsService.getCampaignROI(campaignId);
CampaignAnalyticsService.getABTestResults(campaignId);
CampaignAnalyticsService.applyABTestWinner(campaignId, variantId);
```

### CampaignPromoCodeService
Integrates campaigns with promo codes.

```typescript
CampaignPromoCodeService.associatePromoCode(campaignId, promoCodeId);
CampaignPromoCodeService.getPromoCodeUsage(campaignId);
```

## Context and State Management

### CampaignContext
Global state for campaigns, segments, and templates.

```typescript
interface CampaignContextType {
  // State
  campaigns: Campaign[];
  selectedCampaign: Campaign | null;
  segments: AudienceSegment[];
  templates: CampaignTemplate[];
  
  // Loading states
  campaignLoading: boolean;
  segmentLoading: boolean;
  templateLoading: boolean;
  
  // Campaign actions
  loadCampaigns(filter?, page?): Promise<void>;
  getCampaignById(id): Promise<Campaign>;
  createCampaign(data): Promise<Campaign>;
  updateCampaign(id, data): Promise<Campaign>;
  deleteCampaign(id): Promise<void>;
  updateCampaignStatus(id, status): Promise<void>;
  scheduleCampaign(id, date): Promise<void>;
  sendCampaignNow(id): Promise<void>;
  
  // Segment actions
  loadSegments(): Promise<void>;
  createSegment(data): Promise<AudienceSegment>;
  updateSegment(id, data): Promise<AudienceSegment>;
  deleteSegment(id): Promise<void>;
  
  // Template actions
  loadTemplates(): Promise<void>;
  getTemplateById(id): Promise<CampaignTemplate>;
  createTemplate(data): Promise<CampaignTemplate>;
}
```

## Component Usage

### Wrapping with Provider
```typescript
import { CampaignProvider } from 'src/features/marketing';

<CampaignProvider>
  <YourComponent />
</CampaignProvider>
```

### Using the Hook
```typescript
import { useCampaignContext } from 'src/features/marketing';

const MyComponent = () => {
  const { campaigns, createCampaign, loadCampaigns } = useCampaignContext();
  
  // Use state and actions
};
```

### Campaign Form
```typescript
<CampaignForm
  campaign={existingCampaign}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  isLoading={false}
/>
```

### Campaign List
```typescript
<CampaignList
  campaigns={campaigns}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onSelect={handleSelect}
  isLoading={false}
/>
```

### Analytics Dashboard
```typescript
<CampaignAnalyticsDashboard
  campaign={campaign}
  isLoading={false}
/>
```

### A/B Testing
```typescript
<ABTesting
  campaign={campaign}
  onTestUpdate={handleTestUpdate}
  isLoading={false}
/>
```

## Workflow Examples

### Creating a Campaign
1. Click "New Campaign"
2. Enter basic info (name, description)
3. Select communication channels
4. Choose audience segments
5. Set campaign schedule
6. Optional: Enable A/B testing
7. Submit to create

### Running Analytics
1. Select a campaign from the list
2. Click "Analytics" button
3. View performance metrics
4. Filter by date range
5. Analyze channel performance
6. Review ROI metrics

### A/B Testing Flow
1. Create campaign with "Enable A/B Testing"
2. Configure test variants
3. Set traffic distribution
4. Launch campaign
5. Monitor variant performance
6. System identifies winner
7. Apply winning variant to remaining audience

## Key Design Patterns

### Tab-Based Navigation
The campaign form uses tabs for better UX:
- Basic Info
- Channels
- Audience
- Schedule

### Status Management
Campaign lifecycle:
- DRAFT (not sent yet)
- SCHEDULED (scheduled for delivery)
- ACTIVE (currently running)
- COMPLETED (finished)
- PAUSED (temporarily halted)
- CANCELLED (stopped)

### Metric Calculations
Real-time calculations for:
- Delivery rate = (delivered / sent) × 100
- Open rate = (opened / delivered) × 100
- Click rate = (clicked / delivered) × 100
- Conversion rate = (converted / delivered) × 100
- ROI = ((revenue - cost) / cost) × 100

## Future Enhancements

1. **Advanced Scheduling**
   - Recurring campaigns
   - Time zone optimization
   - Best send time prediction

2. **Enhanced Analytics**
   - Cohort analysis
   - Customer journey tracking
   - Predictive analytics

3. **AI Features**
   - Content generation
   - Optimal send time prediction
   - Audience size forecasting

4. **Integration Improvements**
   - Webhook support
   - Third-party platform integrations
   - CRM synchronization

5. **Compliance**
   - GDPR consent tracking
   - Unsubscribe management
   - Spam compliance monitoring

## Environment Setup

Add to your `.env` file:
```
VITE_API_URL=http://localhost:3001/api
```

## Testing

Each component includes error handling and loading states for comprehensive testing.

## Support

For questions or issues, refer to the inline code documentation or create an issue in the repository.
