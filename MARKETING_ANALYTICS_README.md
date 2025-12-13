# Marketing Analytics Module

## Overview

The Marketing Analytics module provides comprehensive insights into marketing performance and customer behavior through interactive dashboards, detailed reports, and analytics visualizations.

## Features Implemented

### 1. **Key Performance Indicators Dashboard**
- **Impressions**: Total website/app impressions with trend indicators
- **Clicks**: User click-through metrics
- **Click-Through Rate (CTR)**: Calculated performance percentage
- **Conversions**: Booking completions
- **Conversion Rate**: Percentage of viewers converting
- **Revenue**: Total revenue generated
- **Average Order Value (AOV)**: Average booking value

**File**: `src/features/marketing/components/KeyMetricsDashboard.tsx`

### 2. **Conversion Funnel Analysis**
Visualizes the customer journey with drop-off analysis:
- **Stages**: Views → Clicks → Add to Cart → Bookings
- **Visual Representation**: Horizontal bar chart showing funnel progression
- **Metrics**: Drop-off percentages and conversion rates at each stage
- **Trend Analysis**: 30-day historical trend line chart
- **Summary Statistics**: Total users and overall conversion rate

**File**: `src/features/marketing/components/ConversionFunnel.tsx`

### 3. **Customer Acquisition Cost (CAC) Tracking**
Analyzes acquisition efficiency across marketing channels:
- **Channel Breakdown**: Performance by Google Ads, Facebook, Instagram, Email, Organic, Referral
- **Metrics Per Channel**: Spend, acquisitions, CAC, and ROI
- **Visualization**: Composed chart showing CAC vs. ROI
- **Insights**: Identifies most efficient channels and highest ROI performers
- **Trend Analysis**: Historical spend and acquisition tracking

**File**: `src/features/marketing/components/CACAnalytics.tsx`

### 4. **Email Engagement Metrics**
Tracks email campaign performance:
- **Overall Metrics**: Total sent, opens, click-through rates
- **Campaign Performance**: Individual campaign analysis with open rates and CTR
- **Delivery Status**: Donut chart showing delivered vs. bounced emails
- **Engagement Trends**: Historical email engagement visualization
- **Detailed Results**: Campaign-by-campaign performance table

**File**: `src/features/marketing/components/EmailEngagementMetrics.tsx`

### 5. **Promo Code Analytics & ROI**
Analyzes promotional code effectiveness:
- **Code Summary**: Total codes, active codes, discounts given, revenue
- **Status Distribution**: Active/inactive code breakdown pie chart
- **Top Performers**: Bar chart of most-used promo codes
- **Usage Trends**: Historical usage and discount/revenue trends
- **Detailed Table**: All codes with usage, discounts, revenue, and ROI

**File**: `src/features/marketing/components/PromoCodeAnalytics.tsx`

### 6. **Customer Lifetime Value (CLV) Analysis**
Segments customers by profitability:
- **CLV Metrics**: Average and total customer value
- **Segments**: VIP, Loyal, Regular, At-Risk customers
- **Segment Cards**: Interactive cards showing customer counts, CLV, acquisition cost, margin
- **Top Customers**: List of highest-value customers with purchase history
- **Acquisition Cost vs. CLV**: Comparative analysis chart

**File**: `src/features/marketing/components/CLVAnalytics.tsx`

### 7. **Traffic Source Analysis**
Analyzes website traffic sources:
- **Source Types**: Organic, paid, referral, direct, social, email
- **Distribution**: Pie chart of traffic distribution
- **Performance Metrics**: Visits, unique visitors, bounce rate, session duration
- **Conversions by Source**: Top converting traffic sources
- **Detailed Metrics**: Complete table with revenue per source

**File**: `src/features/marketing/components/TrafficSourceAnalytics.tsx`

### 8. **Export Reports**
Enables report generation and download:
- **Formats**: Excel (.xlsx) and PDF document export
- **Date Ranges**: Predefined ranges (7d, 30d, 90d) or custom dates
- **Contents**: Select to include metrics and/or charts
- **Processing**: Real-time report generation with loading state

**File**: `src/features/marketing/components/ExportReports.tsx`

## Project Structure

```
src/features/marketing/
├── components/
│   ├── KeyMetricsDashboard.tsx
│   ├── KeyMetricsDashboard.module.css
│   ├── ConversionFunnel.tsx
│   ├── ConversionFunnel.module.css
│   ├── CACAnalytics.tsx
│   ├── CACAnalytics.module.css
│   ├── EmailEngagementMetrics.tsx
│   ├── EmailEngagementMetrics.module.css
│   ├── PromoCodeAnalytics.tsx
│   ├── PromoCodeAnalytics.module.css
│   ├── CLVAnalytics.tsx
│   ├── CLVAnalytics.module.css
│   ├── TrafficSourceAnalytics.tsx
│   ├── TrafficSourceAnalytics.module.css
│   ├── ExportReports.tsx
│   ├── ExportReports.module.css
│   └── index.ts
├── pages/
│   ├── AnalyticsPage.tsx
│   ├── AnalyticsPage.module.css
│   ├── CampaignsManager.tsx
│   ├── PromoCodeManager.tsx
│   └── index.ts
├── types/
│   ├── analytics.types.ts
│   ├── campaign.types.ts
│   ├── email.types.ts
│   ├── promo.types.ts
│   └── index.ts
├── constants/
│   ├── analytics.constants.ts
│   └── index.ts
└── index.ts
```

## Type Definitions

### Core Analytics Types

```typescript
// Key metrics with trend tracking
interface MetricValue {
  current: number;
  previous?: number;
  change?: number;
  changePercent?: number;
  trend?: 'up' | 'down' | 'stable';
}

// Funnel analysis stages
interface FunnelStage {
  id: string;
  name: string;
  count: number;
  percentage: number;
  conversionRate?: number;
}

// CAC tracking per channel
interface CACData {
  channel: string;
  totalSpend: number;
  acquisitions: number;
  cac: number;
  roi: number;
}

// Email campaign metrics
interface EmailMetrics {
  campaignId: string;
  campaignName: string;
  sentCount: number;
  openCount: number;
  openRate: number;
  clickCount: number;
  clickThroughRate: number;
  unsubscribeCount: number;
  bounceCount: number;
  spamCount: number;
}

// CLV segments
interface CLVSegment {
  segment: string;
  customerCount: number;
  averageCLV: number;
  totalCLV: number;
  acquisitionCost: number;
  profitMargin: number;
}

// Traffic source breakdown
interface TrafficSource {
  source: string;
  sourceType: 'organic' | 'paid' | 'referral' | 'direct' | 'social' | 'email';
  visits: number;
  uniqueVisitors: number;
  bounceRate: number;
  averageSessionDuration: number;
  conversions: number;
  revenue: number;
}
```

See `src/features/marketing/types/analytics.types.ts` for complete type definitions.

## Constants

The module includes constants for:
- Date range options (today, 7d, 30d, 90d, custom, all-time)
- Traffic source colors and icons
- Metric colors and formats
- Promo code statuses
- CAC channels
- Funnel stages
- Email metrics keys
- Chart configurations
- Export formats
- CLV segments

See `src/features/marketing/constants/analytics.constants.ts` for all constants.

## Usage

### Displaying the Analytics Page

```tsx
import { AnalyticsPage } from '../src/features/marketing/pages/AnalyticsPage';

export const MarketingAnalytics: React.FC = () => {
  return <AnalyticsPage />;
};
```

### Using Individual Components

```tsx
import { KeyMetricsDashboard } from '../src/features/marketing/components';
import { DashboardMetrics } from '../src/features/marketing/types';

export const MyDashboard: React.FC = () => {
  const metrics: DashboardMetrics = {
    totalImpressions: { current: 10000, trend: 'up', changePercent: 15 },
    // ... other metrics
  };

  return <KeyMetricsDashboard metrics={metrics} />;
};
```

## Styling

All components use CSS Modules with:
- **Color Scheme**: Blue (#2563eb) primary, green (#10b981) success, red (#ef4444) danger
- **Spacing**: 24px base unit with 8px increments
- **Typography**: Clear hierarchy with 700/600/500 font weights
- **Responsive Design**: Grid layouts with auto-fit for mobile/tablet/desktop
- **Hover States**: Subtle transitions and shadows for interactivity

## Mock Data

The AnalyticsPage includes comprehensive mock data generators for:
- Key metrics with trend indicators
- 30-day conversion funnel data
- Multi-channel CAC data
- Email campaign performance
- Promo code usage patterns
- Customer segments and CLV
- Traffic source breakdown

**Note**: Replace mock data generators with actual API calls in production.

## Integration Points

### Backend API Integration

To integrate with backend APIs, replace the mock data generators in `AnalyticsPage.tsx`:

```typescript
// Example API integration
const loadMetrics = async (dateRange: string) => {
  const response = await fetch(`/api/analytics/metrics?range=${dateRange}`);
  const data = await response.json();
  setMetrics(data);
};

// Example export API
const handleExport = async (format: 'excel' | 'pdf', options: ExportFormat) => {
  const response = await fetch(`/api/analytics/export`, {
    method: 'POST',
    body: JSON.stringify({ format, ...options }),
  });
  
  const blob = await response.blob();
  downloadFile(blob, `report.${format === 'excel' ? 'xlsx' : 'pdf'}`);
};
```

## Performance Considerations

1. **Data Loading**: Use suspense boundaries for async data loading
2. **Memoization**: Components use React.FC for optimization
3. **Chart Rendering**: Recharts handles large datasets efficiently
4. **CSV/PDF Export**: Consider server-side generation for large reports

## Browser Support

- Modern browsers with ES2020+ support
- Chrome/Firefox/Safari/Edge (latest versions)
- Mobile-responsive design for tablets and phones

## Future Enhancements

1. **Real-time Data Updates**: WebSocket integration for live metrics
2. **Custom Reports**: Save and schedule custom report generation
3. **Predictive Analytics**: ML-based forecasting for metrics
4. **A/B Testing Dashboard**: Enhanced testing framework
5. **Data Export Enhancements**: More export formats (CSV, JSON)
6. **Advanced Filtering**: Drill-down capabilities by segment/source
7. **Alerts & Notifications**: Threshold-based alerts for key metrics
8. **API Documentation**: Full REST API docs for analytics data

## Testing

Each component includes:
- TypeScript type safety
- Mock data generators for testing
- Loading states
- Error handling
- Responsive design testing

## License

Part of the Aventra Booking System UI project.
