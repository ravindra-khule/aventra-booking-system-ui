/**
 * Report Service - Financial reporting and analytics
 */

import {
  ReportType,
  ReportPeriod,
  ReportFilters,
  RevenueReport,
  ProfitLossStatement,
  CashFlowAnalysis,
  SalesForecast,
  TaxReport,
  CommissionReport,
  PaymentMethodReport,
  RefundCancellationReport,
  ScheduledReport,
  ReportExportOptions,
  FinancialReport,
  ExportFormat
} from '../types/report.types';

// Mock data generators
class ReportServiceClass {
  /**
   * Get date range based on period
   */
  private getDateRangeFromPeriod(period: ReportPeriod): { dateFrom: string; dateTo: string } {
    const today = new Date();
    let dateFrom: Date;
    let dateTo: Date = today;

    switch (period) {
      case ReportPeriod.TODAY:
        dateFrom = today;
        break;
      case ReportPeriod.YESTERDAY:
        dateFrom = new Date(today);
        dateFrom.setDate(today.getDate() - 1);
        dateTo = dateFrom;
        break;
      case ReportPeriod.THIS_WEEK:
        dateFrom = new Date(today);
        dateFrom.setDate(today.getDate() - today.getDay());
        break;
      case ReportPeriod.LAST_WEEK:
        dateFrom = new Date(today);
        dateFrom.setDate(today.getDate() - today.getDay() - 7);
        dateTo = new Date(dateFrom);
        dateTo.setDate(dateFrom.getDate() + 6);
        break;
      case ReportPeriod.THIS_MONTH:
        dateFrom = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case ReportPeriod.LAST_MONTH:
        dateFrom = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        dateTo = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case ReportPeriod.THIS_QUARTER:
        const quarterStart = Math.floor(today.getMonth() / 3) * 3;
        dateFrom = new Date(today.getFullYear(), quarterStart, 1);
        break;
      case ReportPeriod.LAST_QUARTER:
        const lastQuarterStart = Math.floor(today.getMonth() / 3) * 3 - 3;
        dateFrom = new Date(today.getFullYear(), lastQuarterStart, 1);
        dateTo = new Date(today.getFullYear(), lastQuarterStart + 3, 0);
        break;
      case ReportPeriod.THIS_YEAR:
        dateFrom = new Date(today.getFullYear(), 0, 1);
        break;
      case ReportPeriod.LAST_YEAR:
        dateFrom = new Date(today.getFullYear() - 1, 0, 1);
        dateTo = new Date(today.getFullYear() - 1, 11, 31);
        break;
      default:
        dateFrom = new Date(today.getFullYear(), 0, 1);
    }

    return {
      dateFrom: dateFrom.toISOString().split('T')[0],
      dateTo: dateTo.toISOString().split('T')[0]
    };
  }

  /**
   * Generate Revenue Report
   */
  async generateRevenueReport(filters: ReportFilters): Promise<RevenueReport> {
    // Apply period filter if provided
    if (filters.period && filters.period !== ReportPeriod.CUSTOM) {
      const dateRange = this.getDateRangeFromPeriod(filters.period);
      filters = { ...filters, ...dateRange };
    }

    // Mock data - Replace with actual API calls
    const mockReport: RevenueReport = {
      filters,
      summary: {
        totalRevenue: 1245000,
        averageBookingValue: 12450,
        totalBookings: 100,
        revenueGrowth: 15.3,
        currency: filters.currency || 'SEK'
      },
      breakdown: [
        {
          date: '2024-11',
          tourName: 'Northern Lights Adventure',
          tourRevenue: 450000,
          addonRevenue: 45000,
          totalRevenue: 495000,
          bookingsCount: 35,
          currency: 'SEK'
        },
        {
          date: '2024-12',
          tourName: 'Fjord Explorer',
          tourRevenue: 600000,
          addonRevenue: 60000,
          totalRevenue: 660000,
          bookingsCount: 45,
          currency: 'SEK'
        }
      ],
      byTour: [
        {
          tourId: 'tour-1',
          tourName: 'Northern Lights Adventure',
          revenue: 495000,
          percentage: 39.8,
          bookingsCount: 35
        },
        {
          tourId: 'tour-2',
          tourName: 'Fjord Explorer',
          revenue: 660000,
          percentage: 53.0,
          bookingsCount: 45
        },
        {
          tourId: 'tour-3',
          tourName: 'Coastal Hike',
          revenue: 90000,
          percentage: 7.2,
          bookingsCount: 20
        }
      ],
      bySource: [
        { source: 'Website', revenue: 747000, percentage: 60, bookingsCount: 60 },
        { source: 'Travel Agent', revenue: 373500, percentage: 30, bookingsCount: 30 },
        { source: 'Phone', revenue: 124500, percentage: 10, bookingsCount: 10 }
      ],
      byPeriod: [
        { period: '2024-11', revenue: 495000, bookingsCount: 35 },
        { period: '2024-12', revenue: 750000, bookingsCount: 65 }
      ]
    };

    return mockReport;
  }

  /**
   * Generate Profit & Loss Statement
   */
  async generateProfitLossStatement(filters: ReportFilters): Promise<ProfitLossStatement> {
    if (filters.period && filters.period !== ReportPeriod.CUSTOM) {
      const dateRange = this.getDateRangeFromPeriod(filters.period);
      filters = { ...filters, ...dateRange };
    }

    const mockReport: ProfitLossStatement = {
      filters,
      revenue: {
        tourRevenue: 1050000,
        addonRevenue: 105000,
        otherRevenue: 90000,
        totalRevenue: 1245000
      },
      costs: {
        tourCosts: 420000, // Direct costs (guides, transport, etc.)
        staffCosts: 250000,
        marketingCosts: 100000,
        operationalCosts: 150000,
        otherCosts: 50000,
        totalCosts: 970000
      },
      profit: {
        grossProfit: 825000, // Revenue - Tour Costs
        grossProfitMargin: 66.3,
        netProfit: 275000, // Revenue - All Costs
        netProfitMargin: 22.1,
        ebitda: 300000
      },
      tax: {
        taxableIncome: 275000,
        taxRate: 21.4, // Swedish corporate tax rate
        taxAmount: 58850
      },
      currency: filters.currency || 'SEK'
    };

    return mockReport;
  }

  /**
   * Generate Cash Flow Analysis
   */
  async generateCashFlowAnalysis(filters: ReportFilters): Promise<CashFlowAnalysis> {
    if (filters.period && filters.period !== ReportPeriod.CUSTOM) {
      const dateRange = this.getDateRangeFromPeriod(filters.period);
      filters = { ...filters, ...dateRange };
    }

    const mockReport: CashFlowAnalysis = {
      filters,
      operating: {
        cashFromBookings: 1150000,
        cashFromRefunds: -50000,
        netOperatingCash: 1100000
      },
      investing: {
        equipmentPurchases: -150000,
        otherInvestments: 0,
        netInvestingCash: -150000
      },
      financing: {
        loans: 0,
        loanRepayments: -80000,
        netFinancingCash: -80000
      },
      summary: {
        openingBalance: 500000,
        totalCashIn: 1150000,
        totalCashOut: 280000,
        netCashFlow: 870000,
        closingBalance: 1370000
      },
      byMonth: [
        { month: '2024-11', cashIn: 495000, cashOut: 120000, netCashFlow: 375000 },
        { month: '2024-12', cashIn: 655000, cashOut: 160000, netCashFlow: 495000 }
      ],
      currency: filters.currency || 'SEK'
    };

    return mockReport;
  }

  /**
   * Generate Sales Forecast
   */
  async generateSalesForecast(filters: ReportFilters): Promise<SalesForecast> {
    const mockReport: SalesForecast = {
      filters,
      forecast: [
        {
          period: '2025-01',
          expectedBookings: 55,
          expectedRevenue: 687500,
          confidence: 85,
          basedOn: '3 years historical data + seasonal trends'
        },
        {
          period: '2025-02',
          expectedBookings: 60,
          expectedRevenue: 750000,
          confidence: 82,
          basedOn: '3 years historical data + seasonal trends'
        },
        {
          period: '2025-03',
          expectedBookings: 70,
          expectedRevenue: 875000,
          confidence: 80,
          basedOn: '3 years historical data + seasonal trends'
        }
      ],
      summary: {
        totalExpectedRevenue: 2312500,
        averageMonthlyRevenue: 770833,
        growthTrend: 18.5,
        currency: filters.currency || 'SEK'
      }
    };

    return mockReport;
  }

  /**
   * Generate Tax Report
   */
  async generateTaxReport(filters: ReportFilters): Promise<TaxReport> {
    if (filters.period && filters.period !== ReportPeriod.CUSTOM) {
      const dateRange = this.getDateRangeFromPeriod(filters.period);
      filters = { ...filters, ...dateRange };
    }

    const mockReport: TaxReport = {
      filters,
      vatSummary: {
        totalSales: 1245000,
        vatCollected: 249000, // 20% VAT
        totalPurchases: 970000,
        vatPaid: 194000,
        netVatOwed: 55000
      },
      byRate: [
        { taxRate: 25, taxableAmount: 996000, taxAmount: 249000 },
        { taxRate: 12, taxableAmount: 200000, taxAmount: 24000 },
        { taxRate: 6, taxableAmount: 49000, taxAmount: 2940 }
      ],
      byMonth: [
        {
          month: '2024-11',
          sales: 495000,
          vatCollected: 99000,
          vatPaid: 80000,
          netVat: 19000
        },
        {
          month: '2024-12',
          sales: 750000,
          vatCollected: 150000,
          vatPaid: 114000,
          netVat: 36000
        }
      ],
      currency: filters.currency || 'SEK'
    };

    return mockReport;
  }

  /**
   * Generate Commission Report
   */
  async generateCommissionReport(filters: ReportFilters): Promise<CommissionReport> {
    if (filters.period && filters.period !== ReportPeriod.CUSTOM) {
      const dateRange = this.getDateRangeFromPeriod(filters.period);
      filters = { ...filters, ...dateRange };
    }

    const mockReport: CommissionReport = {
      filters,
      byAgent: [
        {
          agentId: 'agent-1',
          agentName: 'Nordic Travel Agency',
          bookingsCount: 25,
          totalSales: 312500,
          commissionRate: 15,
          commissionAmount: 46875,
          paid: true,
          paidDate: '2024-11-30'
        },
        {
          agentId: 'agent-2',
          agentName: 'Adventure Tours AB',
          bookingsCount: 18,
          totalSales: 225000,
          commissionRate: 12,
          commissionAmount: 27000,
          paid: false
        }
      ],
      summary: {
        totalCommissions: 73875,
        paidCommissions: 46875,
        unpaidCommissions: 27000,
        averageCommissionRate: 13.5
      },
      currency: filters.currency || 'SEK'
    };

    return mockReport;
  }

  /**
   * Generate Payment Method Report
   */
  async generatePaymentMethodReport(filters: ReportFilters): Promise<PaymentMethodReport> {
    if (filters.period && filters.period !== ReportPeriod.CUSTOM) {
      const dateRange = this.getDateRangeFromPeriod(filters.period);
      filters = { ...filters, ...dateRange };
    }

    const mockReport: PaymentMethodReport = {
      filters,
      byMethod: [
        {
          method: 'Stripe',
          transactionCount: 65,
          totalAmount: 810750,
          percentage: 65.1,
          averageTransaction: 12473
        },
        {
          method: 'Bank Transfer',
          transactionCount: 25,
          totalAmount: 311250,
          percentage: 25.0,
          averageTransaction: 12450
        },
        {
          method: 'Swish',
          transactionCount: 10,
          totalAmount: 123000,
          percentage: 9.9,
          averageTransaction: 12300
        }
      ],
      summary: {
        totalTransactions: 100,
        totalAmount: 1245000,
        mostPopularMethod: 'Stripe'
      },
      currency: filters.currency || 'SEK'
    };

    return mockReport;
  }

  /**
   * Generate Refund & Cancellation Report
   */
  async generateRefundCancellationReport(filters: ReportFilters): Promise<RefundCancellationReport> {
    if (filters.period && filters.period !== ReportPeriod.CUSTOM) {
      const dateRange = this.getDateRangeFromPeriod(filters.period);
      filters = { ...filters, ...dateRange };
    }

    const mockReport: RefundCancellationReport = {
      filters,
      refunds: {
        totalRefunds: 8,
        refundAmount: 99600,
        refundRate: 8.0,
        averageRefundAmount: 12450
      },
      cancellations: {
        totalCancellations: 12,
        cancellationRate: 12.0,
        byReason: [
          { reason: 'Weather conditions', count: 5, percentage: 41.7 },
          { reason: 'Personal reasons', count: 4, percentage: 33.3 },
          { reason: 'Health issues', count: 2, percentage: 16.7 },
          { reason: 'Other', count: 1, percentage: 8.3 }
        ]
      },
      byTour: [
        {
          tourId: 'tour-1',
          tourName: 'Northern Lights Adventure',
          refundsCount: 3,
          cancellationsCount: 5,
          totalLostRevenue: 37350
        },
        {
          tourId: 'tour-2',
          tourName: 'Fjord Explorer',
          refundsCount: 3,
          cancellationsCount: 4,
          totalLostRevenue: 37350
        },
        {
          tourId: 'tour-3',
          tourName: 'Coastal Hike',
          refundsCount: 2,
          cancellationsCount: 3,
          totalLostRevenue: 24900
        }
      ],
      byMonth: [
        { month: '2024-11', refunds: 3, cancellations: 5, lostRevenue: 37350 },
        { month: '2024-12', refunds: 5, cancellations: 7, lostRevenue: 62250 }
      ],
      currency: filters.currency || 'SEK'
    };

    return mockReport;
  }

  /**
   * Export report to specified format
   */
  async exportReport(
    report: FinancialReport,
    options: ReportExportOptions
  ): Promise<Blob> {
    // Mock export - In production, implement actual export logic
    console.log('Exporting report:', report.type, 'Format:', options.format);
    
    const content = JSON.stringify(report, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    
    return blob;
  }

  /**
   * Get scheduled reports
   */
  async getScheduledReports(): Promise<ScheduledReport[]> {
    return [
      {
        id: 'sched-1',
        name: 'Monthly Revenue Report',
        reportType: ReportType.REVENUE,
        filters: {
          dateFrom: '',
          dateTo: '',
          period: ReportPeriod.LAST_MONTH
        },
        recipients: ['finance@aventratours.com', 'management@aventratours.com'],
        frequency: 'monthly',
        nextRunDate: '2025-01-01',
        format: ExportFormat.EXCEL,
        enabled: true,
        createdAt: '2024-01-15',
        createdBy: 'admin@aventratours.com'
      }
    ];
  }

  /**
   * Create scheduled report
   */
  async createScheduledReport(report: Omit<ScheduledReport, 'id' | 'createdAt' | 'createdBy'>): Promise<ScheduledReport> {
    const newReport: ScheduledReport = {
      ...report,
      id: `sched-${Date.now()}`,
      createdAt: new Date().toISOString(),
      createdBy: 'current-user@aventratours.com'
    };
    
    return newReport;
  }

  /**
   * Update scheduled report
   */
  async updateScheduledReport(id: string, updates: Partial<ScheduledReport>): Promise<ScheduledReport> {
    console.log('Updating scheduled report:', id, updates);
    // Mock implementation
    return {} as ScheduledReport;
  }

  /**
   * Delete scheduled report
   */
  async deleteScheduledReport(id: string): Promise<void> {
    console.log('Deleting scheduled report:', id);
  }
}

export const ReportService = new ReportServiceClass();
