import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Mail,
  TrendingUp,
  DollarSign,
  PieChart,
  Calendar,
  RefreshCw,
  Clock
} from 'lucide-react';
import {
  ReportFiltersComponent,
  RevenueReportView,
  ProfitLossReportView
} from '../../../src/features/finance/components';
import {
  ReportType,
  ReportPeriod,
  ReportFilters,
  RevenueReport,
  ProfitLossStatement,
  CashFlowAnalysis,
  ExportFormat
} from '../../../src/features/finance/types/report.types';
import { ReportService } from '../../../src/features/finance/services/report.service';

type ReportTab = 'revenue' | 'profit-loss' | 'cash-flow' | 'forecast' | 'tax' | 'commission' | 'payment-methods' | 'refunds';

export const FinanceReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ReportTab>('revenue');
  const [filters, setFilters] = useState<ReportFilters>({
    dateFrom: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    dateTo: new Date().toISOString().split('T')[0],
    period: ReportPeriod.THIS_MONTH,
    currency: 'SEK',
    compareWithPrevious: false
  });
  const [loading, setLoading] = useState(false);
  const [revenueReport, setRevenueReport] = useState<RevenueReport | null>(null);
  const [profitLossReport, setProfitLossReport] = useState<ProfitLossStatement | null>(null);
  const [cashFlowReport, setCashFlowReport] = useState<CashFlowAnalysis | null>(null);

  // Load data when filters or active tab changes
  useEffect(() => {
    loadReportData();
  }, [activeTab, filters.period]);

  const loadReportData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'revenue':
          const revReport = await ReportService.generateRevenueReport(filters);
          setRevenueReport(revReport);
          break;
        case 'profit-loss':
          const plReport = await ReportService.generateProfitLossStatement(filters);
          setProfitLossReport(plReport);
          break;
        case 'cash-flow':
          const cfReport = await ReportService.generateCashFlowAnalysis(filters);
          setCashFlowReport(cfReport);
          break;
        // Add other report types as needed
      }
    } catch (error) {
      console.error('Failed to load report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: ExportFormat) => {
    try {
      // Create a temporary report object for export
      let reportData: any = null;
      let reportType: ReportType = ReportType.REVENUE;

      switch (activeTab) {
        case 'revenue':
          reportData = revenueReport;
          reportType = ReportType.REVENUE;
          break;
        case 'profit-loss':
          reportData = profitLossReport;
          reportType = ReportType.PROFIT_LOSS;
          break;
        case 'cash-flow':
          reportData = cashFlowReport;
          reportType = ReportType.CASH_FLOW;
          break;
      }

      if (!reportData) {
        alert('No report data to export');
        return;
      }

      const report = {
        id: `report-${Date.now()}`,
        type: reportType,
        title: `${activeTab} Report`,
        description: `Generated on ${new Date().toLocaleString()}`,
        generatedAt: new Date().toISOString(),
        generatedBy: 'current-user',
        filters,
        data: reportData
      };

      const blob = await ReportService.exportReport(report, {
        format,
        includeCharts: true,
        includeSummary: true,
        includeDetails: true,
        filename: `${activeTab}-report-${new Date().toISOString().split('T')[0]}`
      });

      // Trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeTab}-report-${new Date().toISOString().split('T')[0]}.${format.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      alert(`Report exported successfully as ${format}!`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export report. Please try again.');
    }
  };

  const handleScheduleReport = () => {
    alert('Schedule Report feature coming soon!');
  };

  const tabs = [
    { id: 'revenue' as ReportTab, label: 'Revenue', icon: DollarSign },
    { id: 'profit-loss' as ReportTab, label: 'Profit & Loss', icon: TrendingUp },
    { id: 'cash-flow' as ReportTab, label: 'Cash Flow', icon: PieChart },
    { id: 'forecast' as ReportTab, label: 'Forecast', icon: Calendar },
    { id: 'tax' as ReportTab, label: 'Tax', icon: FileText },
    { id: 'commission' as ReportTab, label: 'Commission', icon: DollarSign },
    { id: 'payment-methods' as ReportTab, label: 'Payments', icon: DollarSign },
    { id: 'refunds' as ReportTab, label: 'Refunds', icon: RefreshCw }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive financial reporting and analytics for business insights
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport(ExportFormat.EXCEL)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Excel
          </button>
          <button
            onClick={() => handleExport(ExportFormat.CSV)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button
            onClick={handleScheduleReport}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />
            Schedule
          </button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Filters */}
      <ReportFiltersComponent
        filters={filters}
        onChange={setFilters}
        showTourFilter={true}
        showCustomerFilter={false}
        showGroupBy={true}
      />

      {/* Report Content */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading report data...</p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'revenue' && revenueReport && (
              <RevenueReportView report={revenueReport} />
            )}
            
            {activeTab === 'profit-loss' && profitLossReport && (
              <ProfitLossReportView report={profitLossReport} />
            )}
            
            {activeTab === 'cash-flow' && cashFlowReport && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Cash Flow Analysis</h3>
                <p className="text-gray-600">Cash flow report coming soon...</p>
              </div>
            )}
            
            {(activeTab === 'forecast' || activeTab === 'tax' || activeTab === 'commission' || 
              activeTab === 'payment-methods' || activeTab === 'refunds') && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="text-center py-12">
                  <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {tabs.find(t => t.id === activeTab)?.label} Report
                  </h3>
                  <p className="text-gray-600 mb-4">
                    This report type is currently under development
                  </p>
                  <div className="max-w-md mx-auto text-left">
                    <h4 className="font-medium text-gray-900 mb-2">Planned Features:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {activeTab === 'forecast' && (
                        <>
                          <li>• Expected bookings by month/quarter</li>
                          <li>• Revenue forecasting based on historical data</li>
                          <li>• Confidence intervals and trends</li>
                        </>
                      )}
                      {activeTab === 'tax' && (
                        <>
                          <li>• VAT summary and breakdown by rate</li>
                          <li>• Monthly tax calculations</li>
                          <li>• Tax reports ready for submission</li>
                        </>
                      )}
                      {activeTab === 'commission' && (
                        <>
                          <li>• Commission tracking by agent</li>
                          <li>• Payment status and history</li>
                          <li>• Commission rate analysis</li>
                        </>
                      )}
                      {activeTab === 'payment-methods' && (
                        <>
                          <li>• Payment method breakdown</li>
                          <li>• Transaction volume by method</li>
                          <li>• Average transaction values</li>
                        </>
                      )}
                      {activeTab === 'refunds' && (
                        <>
                          <li>• Refund and cancellation statistics</li>
                          <li>• Analysis by reason and tour</li>
                          <li>• Lost revenue calculations</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
