import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Briefcase } from 'lucide-react';
import { ProfitLossStatement } from '../types/report.types';
import { MetricCard } from './ReportFilters';

interface ProfitLossReportViewProps {
  report: ProfitLossStatement;
}

export const ProfitLossReportView: React.FC<ProfitLossReportViewProps> = ({ report }) => {
  const { revenue, costs, profit, tax, currency } = report;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value={revenue.totalRevenue}
          icon={<DollarSign className="h-5 w-5" />}
          format="currency"
          currency={currency}
        />
        <MetricCard
          title="Gross Profit"
          value={profit.grossProfit}
          icon={<TrendingUp className="h-5 w-5" />}
          format="currency"
          currency={currency}
        />
        <MetricCard
          title="Net Profit"
          value={profit.netProfit}
          icon={<Briefcase className="h-5 w-5" />}
          format="currency"
          currency={currency}
        />
        <MetricCard
          title="Net Profit Margin"
          value={profit.netProfitMargin}
          icon={<TrendingUp className="h-5 w-5" />}
          format="percentage"
        />
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-green-700">Revenue</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-gray-600">Tour Revenue</span>
              <span className="font-semibold">
                {new Intl.NumberFormat('sv-SE', {
                  style: 'currency',
                  currency: currency,
                  minimumFractionDigits: 0
                }).format(revenue.tourRevenue)}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-gray-600">Add-on Revenue</span>
              <span className="font-semibold">
                {new Intl.NumberFormat('sv-SE', {
                  style: 'currency',
                  currency: currency,
                  minimumFractionDigits: 0
                }).format(revenue.addonRevenue)}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-gray-600">Other Revenue</span>
              <span className="font-semibold">
                {new Intl.NumberFormat('sv-SE', {
                  style: 'currency',
                  currency: currency,
                  minimumFractionDigits: 0
                }).format(revenue.otherRevenue)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="font-bold text-gray-900">Total Revenue</span>
              <span className="font-bold text-lg text-green-700">
                {new Intl.NumberFormat('sv-SE', {
                  style: 'currency',
                  currency: currency,
                  minimumFractionDigits: 0
                }).format(revenue.totalRevenue)}
              </span>
            </div>
          </div>
        </div>

        {/* Costs Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-red-700">Costs</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-gray-600">Tour Costs (Direct)</span>
              <span className="font-semibold">
                {new Intl.NumberFormat('sv-SE', {
                  style: 'currency',
                  currency: currency,
                  minimumFractionDigits: 0
                }).format(costs.tourCosts)}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-gray-600">Staff Costs</span>
              <span className="font-semibold">
                {new Intl.NumberFormat('sv-SE', {
                  style: 'currency',
                  currency: currency,
                  minimumFractionDigits: 0
                }).format(costs.staffCosts)}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-gray-600">Marketing Costs</span>
              <span className="font-semibold">
                {new Intl.NumberFormat('sv-SE', {
                  style: 'currency',
                  currency: currency,
                  minimumFractionDigits: 0
                }).format(costs.marketingCosts)}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-gray-600">Operational Costs</span>
              <span className="font-semibold">
                {new Intl.NumberFormat('sv-SE', {
                  style: 'currency',
                  currency: currency,
                  minimumFractionDigits: 0
                }).format(costs.operationalCosts)}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-gray-600">Other Costs</span>
              <span className="font-semibold">
                {new Intl.NumberFormat('sv-SE', {
                  style: 'currency',
                  currency: currency,
                  minimumFractionDigits: 0
                }).format(costs.otherCosts)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="font-bold text-gray-900">Total Costs</span>
              <span className="font-bold text-lg text-red-700">
                {new Intl.NumberFormat('sv-SE', {
                  style: 'currency',
                  currency: currency,
                  minimumFractionDigits: 0
                }).format(costs.totalCosts)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profit Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold mb-4 text-blue-900">Profit Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Gross Profit</span>
                <span className="font-semibold text-gray-900">
                  {new Intl.NumberFormat('sv-SE', {
                    style: 'currency',
                    currency: currency,
                    minimumFractionDigits: 0
                  }).format(profit.grossProfit)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Gross Profit Margin</span>
                <span className="font-semibold text-gray-900">
                  {profit.grossProfitMargin.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-blue-200">
                <span className="font-bold text-gray-900">Net Profit</span>
                <span className="font-bold text-lg text-blue-700">
                  {new Intl.NumberFormat('sv-SE', {
                    style: 'currency',
                    currency: currency,
                    minimumFractionDigits: 0
                  }).format(profit.netProfit)}
                </span>
              </div>
            </div>
          </div>
          <div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Net Profit Margin</span>
                <span className="font-semibold text-gray-900">
                  {profit.netProfitMargin.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">EBITDA</span>
                <span className="font-semibold text-gray-900">
                  {new Intl.NumberFormat('sv-SE', {
                    style: 'currency',
                    currency: currency,
                    minimumFractionDigits: 0
                  }).format(profit.ebitda)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tax Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Tax Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Taxable Income</div>
            <div className="text-xl font-bold text-gray-900">
              {new Intl.NumberFormat('sv-SE', {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: 0
              }).format(tax.taxableIncome)}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Tax Rate</div>
            <div className="text-xl font-bold text-gray-900">
              {tax.taxRate.toFixed(1)}%
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Tax Amount</div>
            <div className="text-xl font-bold text-gray-900">
              {new Intl.NumberFormat('sv-SE', {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: 0
              }).format(tax.taxAmount)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
