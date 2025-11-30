/**
 * Financial Report Types - Comprehensive financial reporting and analytics
 */

// Report types enum
export enum ReportType {
  REVENUE = 'REVENUE',
  PROFIT_LOSS = 'PROFIT_LOSS',
  CASH_FLOW = 'CASH_FLOW',
  SALES_FORECAST = 'SALES_FORECAST',
  TAX_SUMMARY = 'TAX_SUMMARY',
  COMMISSION = 'COMMISSION',
  PAYMENT_METHOD = 'PAYMENT_METHOD',
  REFUND_CANCELLATION = 'REFUND_CANCELLATION',
  CUSTOM = 'CUSTOM'
}

// Report period enum
export enum ReportPeriod {
  TODAY = 'TODAY',
  YESTERDAY = 'YESTERDAY',
  THIS_WEEK = 'THIS_WEEK',
  LAST_WEEK = 'LAST_WEEK',
  THIS_MONTH = 'THIS_MONTH',
  LAST_MONTH = 'LAST_MONTH',
  THIS_QUARTER = 'THIS_QUARTER',
  LAST_QUARTER = 'LAST_QUARTER',
  THIS_YEAR = 'THIS_YEAR',
  LAST_YEAR = 'LAST_YEAR',
  CUSTOM = 'CUSTOM'
}

// Export format enum
export enum ExportFormat {
  EXCEL = 'EXCEL',
  CSV = 'CSV',
  PDF = 'PDF',
  JSON = 'JSON'
}

// Report filters interface
export interface ReportFilters {
  dateFrom: string;
  dateTo: string;
  period?: ReportPeriod;
  tourId?: string;
  customerId?: string;
  currency?: string;
  groupBy?: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'tour' | 'customer';
  compareWithPrevious?: boolean; // Compare with previous period
}

// Revenue breakdown interface
export interface RevenueBreakdown {
  date: string;
  tourName?: string;
  tourRevenue: number;
  addonRevenue: number;
  totalRevenue: number;
  bookingsCount: number;
  currency: string;
}

// Revenue by source interface
export interface RevenueBySource {
  source: string; // 'website', 'agent', 'phone', 'email', etc.
  revenue: number;
  percentage: number;
  bookingsCount: number;
}

// Revenue report interface
export interface RevenueReport {
  filters: ReportFilters;
  summary: {
    totalRevenue: number;
    averageBookingValue: number;
    totalBookings: number;
    revenueGrowth: number; // Percentage compared to previous period
    currency: string;
  };
  breakdown: RevenueBreakdown[];
  byTour: Array<{
    tourId: string;
    tourName: string;
    revenue: number;
    percentage: number;
    bookingsCount: number;
  }>;
  bySource: RevenueBySource[];
  byPeriod: Array<{
    period: string;
    revenue: number;
    bookingsCount: number;
  }>;
}

// Profit and Loss statement interface
export interface ProfitLossStatement {
  filters: ReportFilters;
  revenue: {
    tourRevenue: number;
    addonRevenue: number;
    otherRevenue: number;
    totalRevenue: number;
  };
  costs: {
    tourCosts: number; // Direct costs of delivering tours
    staffCosts: number;
    marketingCosts: number;
    operationalCosts: number;
    otherCosts: number;
    totalCosts: number;
  };
  profit: {
    grossProfit: number; // Revenue - Direct Costs
    grossProfitMargin: number; // Percentage
    netProfit: number; // Revenue - All Costs
    netProfitMargin: number; // Percentage
    ebitda: number; // Earnings Before Interest, Taxes, Depreciation, Amortization
  };
  tax: {
    taxableIncome: number;
    taxRate: number;
    taxAmount: number;
  };
  currency: string;
}

// Cash flow analysis interface
export interface CashFlowAnalysis {
  filters: ReportFilters;
  operating: {
    cashFromBookings: number;
    cashFromRefunds: number; // Negative
    netOperatingCash: number;
  };
  investing: {
    equipmentPurchases: number; // Negative
    otherInvestments: number;
    netInvestingCash: number;
  };
  financing: {
    loans: number;
    loanRepayments: number; // Negative
    netFinancingCash: number;
  };
  summary: {
    openingBalance: number;
    totalCashIn: number;
    totalCashOut: number;
    netCashFlow: number;
    closingBalance: number;
  };
  byMonth: Array<{
    month: string;
    cashIn: number;
    cashOut: number;
    netCashFlow: number;
  }>;
  currency: string;
}

// Sales forecast interface
export interface SalesForecast {
  filters: ReportFilters;
  forecast: Array<{
    period: string; // Month or quarter
    expectedBookings: number;
    expectedRevenue: number;
    confidence: number; // Percentage (0-100)
    basedOn: string; // Historical data description
  }>;
  summary: {
    totalExpectedRevenue: number;
    averageMonthlyRevenue: number;
    growthTrend: number; // Percentage
    currency: string;
  };
}

// Tax report interface
export interface TaxReport {
  filters: ReportFilters;
  vatSummary: {
    totalSales: number;
    vatCollected: number;
    totalPurchases: number;
    vatPaid: number;
    netVatOwed: number;
  };
  byRate: Array<{
    taxRate: number;
    taxableAmount: number;
    taxAmount: number;
  }>;
  byMonth: Array<{
    month: string;
    sales: number;
    vatCollected: number;
    vatPaid: number;
    netVat: number;
  }>;
  currency: string;
}

// Commission tracking interface
export interface CommissionReport {
  filters: ReportFilters;
  byAgent: Array<{
    agentId: string;
    agentName: string;
    bookingsCount: number;
    totalSales: number;
    commissionRate: number;
    commissionAmount: number;
    paid: boolean;
    paidDate?: string;
  }>;
  summary: {
    totalCommissions: number;
    paidCommissions: number;
    unpaidCommissions: number;
    averageCommissionRate: number;
  };
  currency: string;
}

// Payment method breakdown interface
export interface PaymentMethodReport {
  filters: ReportFilters;
  byMethod: Array<{
    method: string; // 'Stripe', 'Bank Transfer', 'Cash', etc.
    transactionCount: number;
    totalAmount: number;
    percentage: number;
    averageTransaction: number;
  }>;
  summary: {
    totalTransactions: number;
    totalAmount: number;
    mostPopularMethod: string;
  };
  currency: string;
}

// Refund and cancellation analysis interface
export interface RefundCancellationReport {
  filters: ReportFilters;
  refunds: {
    totalRefunds: number;
    refundAmount: number;
    refundRate: number; // Percentage of total bookings
    averageRefundAmount: number;
  };
  cancellations: {
    totalCancellations: number;
    cancellationRate: number; // Percentage of total bookings
    byReason: Array<{
      reason: string;
      count: number;
      percentage: number;
    }>;
  };
  byTour: Array<{
    tourId: string;
    tourName: string;
    refundsCount: number;
    cancellationsCount: number;
    totalLostRevenue: number;
  }>;
  byMonth: Array<{
    month: string;
    refunds: number;
    cancellations: number;
    lostRevenue: number;
  }>;
  currency: string;
}

// Scheduled report interface
export interface ScheduledReport {
  id: string;
  name: string;
  reportType: ReportType;
  filters: ReportFilters;
  recipients: string[]; // Email addresses
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  nextRunDate: string;
  format: ExportFormat;
  enabled: boolean;
  createdAt: string;
  createdBy: string;
}

// Report export options
export interface ReportExportOptions {
  format: ExportFormat;
  includeCharts: boolean;
  includeSummary: boolean;
  includeDetails: boolean;
  filename?: string;
}

// Generic report data structure
export interface FinancialReport {
  id: string;
  type: ReportType;
  title: string;
  description: string;
  generatedAt: string;
  generatedBy: string;
  filters: ReportFilters;
  data: RevenueReport | ProfitLossStatement | CashFlowAnalysis | SalesForecast | TaxReport | CommissionReport | PaymentMethodReport | RefundCancellationReport;
}

// Report comparison interface
export interface ReportComparison {
  current: {
    period: string;
    value: number;
  };
  previous: {
    period: string;
    value: number;
  };
  change: {
    absolute: number;
    percentage: number;
    trend: 'up' | 'down' | 'stable';
  };
}
