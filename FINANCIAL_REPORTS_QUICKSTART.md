# Financial Reports - Quick Reference Guide

## 🚀 Quick Start

### Access the Page
```
URL: http://localhost:3000/#/admin/finance/reports
```

## 📊 Available Reports

### 1. Revenue Report
**What it shows**: Total revenue, bookings, sources, and tour performance

**Key Metrics**:
- Total Revenue
- Total Bookings
- Average Booking Value
- Revenue Growth %

**Breakdowns**:
- By Tour
- By Source (Website, Agent, Phone)
- By Time Period

### 2. Profit & Loss Report
**What it shows**: Complete P&L statement with revenue, costs, and profit margins

**Key Metrics**:
- Total Revenue
- Gross Profit & Margin
- Net Profit & Margin
- Tax Information

**Sections**:
- Revenue Breakdown (Tours, Addons, Other)
- Cost Analysis (Tour, Staff, Marketing, Operational)
- Profit Summary
- Tax Information

### 3. Cash Flow (In Progress)
**What it shows**: Cash in/out flow analysis

**Categories**:
- Operating Activities
- Investing Activities
- Financing Activities

## 🎯 Quick Actions

### Export Reports
```tsx
// Export to Excel
Click "Export Excel" button → Downloads .xlsx file

// Export to CSV
Click "Export CSV" button → Downloads .csv file
```

### Change Time Period
```tsx
// Use preset periods
Select from dropdown: Today, This Week, This Month, This Quarter, This Year

// Custom date range
Select "Custom Range" → Enter start and end dates
```

### Compare Periods
```tsx
// Enable comparison
Check "Compare with previous period" checkbox
→ See growth/decline percentages
```

## 💻 Component Usage

### Use Report Filters
```tsx
import { ReportFiltersComponent } from '@/features/finance/components';

<ReportFiltersComponent
  filters={filters}
  onChange={setFilters}
  showTourFilter={true}
  showGroupBy={true}
/>
```

### Display Metric Card
```tsx
import { MetricCard } from '@/features/finance/components';

<MetricCard
  title="Total Revenue"
  value={1245000}
  change={15.3}
  icon={<DollarSign />}
  format="currency"
  currency="SEK"
/>
```

### Show Revenue Report
```tsx
import { RevenueReportView } from '@/features/finance/components';

<RevenueReportView report={revenueReport} />
```

## 🔧 Service Methods

### Generate Reports
```tsx
import { ReportService } from '@/features/finance/services/report.service';

// Revenue Report
const revenue = await ReportService.generateRevenueReport(filters);

// P&L Report
const profitLoss = await ReportService.generateProfitLossStatement(filters);

// Cash Flow
const cashFlow = await ReportService.generateCashFlowAnalysis(filters);
```

### Export Report
```tsx
import { ExportFormat } from '@/features/finance/types/report.types';

await ReportService.exportReport(report, {
  format: ExportFormat.EXCEL,
  includeCharts: true,
  includeSummary: true,
  includeDetails: true,
  filename: 'my-report'
});
```

## 📋 Filter Options

### Report Periods
```tsx
ReportPeriod.TODAY           // Today only
ReportPeriod.YESTERDAY       // Yesterday only
ReportPeriod.THIS_WEEK       // Current week
ReportPeriod.LAST_WEEK       // Previous week
ReportPeriod.THIS_MONTH      // Current month
ReportPeriod.LAST_MONTH      // Previous month
ReportPeriod.THIS_QUARTER    // Current quarter
ReportPeriod.LAST_QUARTER    // Previous quarter
ReportPeriod.THIS_YEAR       // Current year
ReportPeriod.LAST_YEAR       // Previous year
ReportPeriod.CUSTOM          // Custom date range
```

### Group By Options
```tsx
groupBy: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'tour' | 'customer'
```

## 🎨 Report Types

### Revenue Report Structure
```tsx
{
  summary: {
    totalRevenue: number,
    averageBookingValue: number,
    totalBookings: number,
    revenueGrowth: number,
    currency: string
  },
  breakdown: [...],
  byTour: [...],
  bySource: [...],
  byPeriod: [...]
}
```

### P&L Statement Structure
```tsx
{
  revenue: {
    tourRevenue: number,
    addonRevenue: number,
    otherRevenue: number,
    totalRevenue: number
  },
  costs: {
    tourCosts: number,
    staffCosts: number,
    marketingCosts: number,
    operationalCosts: number,
    otherCosts: number,
    totalCosts: number
  },
  profit: {
    grossProfit: number,
    grossProfitMargin: number,
    netProfit: number,
    netProfitMargin: number,
    ebitda: number
  },
  tax: {...}
}
```

## 🔐 Type Imports

```tsx
// Import all report types
import {
  ReportType,
  ReportPeriod,
  ReportFilters,
  RevenueReport,
  ProfitLossStatement,
  CashFlowAnalysis,
  ExportFormat
} from '@/features/finance/types/report.types';

// Import components
import {
  ReportFiltersComponent,
  MetricCard,
  RevenueReportView,
  ProfitLossReportView
} from '@/features/finance/components';

// Import service
import { ReportService } from '@/features/finance/services/report.service';
```

## 🎯 Common Use Cases

### 1. Monthly Revenue Report
```tsx
const filters = {
  dateFrom: '2024-11-01',
  dateTo: '2024-11-30',
  period: ReportPeriod.THIS_MONTH,
  currency: 'SEK'
};

const report = await ReportService.generateRevenueReport(filters);
```

### 2. Year-over-Year Comparison
```tsx
const filters = {
  dateFrom: '2024-01-01',
  dateTo: '2024-12-31',
  period: ReportPeriod.THIS_YEAR,
  compareWithPrevious: true
};
```

### 3. Tour Performance Analysis
```tsx
const filters = {
  period: ReportPeriod.THIS_QUARTER,
  groupBy: 'tour'
};
```

## 📱 Responsive Design

- **Desktop**: Full layout with all metrics and charts
- **Tablet**: Stacked cards, scrollable tables
- **Mobile**: Single column, touch-optimized

## 🐛 Troubleshooting

### Report Not Loading
1. Check browser console for errors
2. Verify filters are valid
3. Ensure service is available

### Export Not Working
1. Check browser download permissions
2. Verify blob creation
3. Check file format support

### Data Not Updating
1. Click refresh or change filters
2. Check `useEffect` dependencies
3. Verify state management

## 🚀 Performance Tips

1. **Use appropriate time ranges** - Don't load years of data at once
2. **Enable grouping** - Aggregate data for better performance
3. **Limit export size** - Use filters before exporting
4. **Cache reports** - Store frequently accessed reports

## 📚 Related Documentation

- `FINANCIAL_REPORTS_COMPLETE.md` - Full implementation details
- `INVOICE_MANAGEMENT_COMPLETE.md` - Invoice system docs
- Type definitions: `src/features/finance/types/report.types.ts`
- Service layer: `src/features/finance/services/report.service.ts`

## ✨ Coming Soon

- [ ] Interactive charts with Chart.js/Recharts
- [ ] Scheduled email reports
- [ ] Custom report builder
- [ ] Report templates
- [ ] Advanced forecasting
- [ ] Real-time data updates
- [ ] Multi-currency support
- [ ] Tax report automation
- [ ] Commission payment tracking
