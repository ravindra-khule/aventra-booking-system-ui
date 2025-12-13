/**
 * Main Tours Pricing & Availability Page
 */
import React, { useState, useEffect } from 'react';
import {
  PricingConfiguration,
  SeasonalPeriod,
  GroupDiscountTier,
  EarlyBirdLastMinuteRule,
  BlackoutPeriod,
  PricingAnalytics,
  PriceHistoryEntry,
} from '../../types/pricing.types';
import { pricingService } from '../../services/pricing.service';
import { SeasonalPricing } from './SeasonalPricing';
import { GroupDiscounts } from './GroupDiscounts';
import { EarlyBirdLastMinute } from './EarlyBirdLastMinute';
import { BlackoutDates } from './BlackoutDates';
import { CapacitySettings } from './CapacitySettings';
import { PriceCalendar } from './PriceCalendar';
import { PriceHistoryAnalytics } from './PriceHistoryAnalytics';
import {
  Calendar, Users, Zap, TrendingUp, Settings, BarChart3, Save, AlertCircle
} from 'lucide-react';
import { formatCurrency } from '../../../../shared/utils';
import { useToast } from '../../../../shared/context/ToastContext';

interface PricingPageProps {
  tourId: string;
}

type TabType = 'seasonal' | 'group' | 'earlyBird' | 'blackout' | 'capacity' | 'calendar' | 'analytics';

const TABS: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'seasonal', label: 'Seasonal Pricing', icon: <Calendar className="h-4 w-4" /> },
  { id: 'group', label: 'Group Discounts', icon: <Users className="h-4 w-4" /> },
  { id: 'earlyBird', label: 'Early Bird & Last Minute', icon: <Zap className="h-4 w-4" /> },
  { id: 'blackout', label: 'Blackout Dates', icon: <AlertCircle className="h-4 w-4" /> },
  { id: 'capacity', label: 'Capacity', icon: <Settings className="h-4 w-4" /> },
  { id: 'calendar', label: 'Price Calendar', icon: <Calendar className="h-4 w-4" /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="h-4 w-4" /> },
];

export const ToursPricingPage: React.FC<PricingPageProps> = ({ tourId }) => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('seasonal');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [pricing, setPricing] = useState<PricingConfiguration | null>(null);
  const [analytics, setAnalytics] = useState<PricingAnalytics | null>(null);
  const [history, setHistory] = useState<PriceHistoryEntry[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchData();
  }, [tourId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [pricingData, analyticsData, historyData] = await Promise.all([
        pricingService.getPricingConfiguration(tourId),
        pricingService.getPricingAnalytics(tourId, '2025-01-01', '2025-12-31'),
        pricingService.getPriceHistory(tourId),
      ]);

      setPricing(pricingData);
      setAnalytics(analyticsData);
      setHistory(historyData);
    } catch (error) {
      console.error('Failed to fetch pricing data:', error);
      toast.error('Failed to load pricing configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAll = async () => {
    if (!pricing) return;
    
    setIsSaving(true);
    try {
      // Save all pricing configurations
      await Promise.all([
        pricingService.updateSeasonalPricing(tourId, pricing.seasonalPricing),
        pricingService.updateGroupDiscounts(tourId, pricing.groupDiscounts),
        pricingService.updateCapacitySettings(tourId, pricing.capacitySettings),
      ]);

      // Handle early bird/last minute separately if needed
      if (pricing.earlyBirdLastMinute[0]) {
        await pricingService.updateEarlyBirdLastMinute(tourId, pricing.earlyBirdLastMinute[0]);
      }

      setHasChanges(false);
      toast.success('Pricing configuration saved successfully!');
      await fetchData();
    } catch (error) {
      console.error('Failed to save pricing:', error);
      toast.error('Failed to save pricing configuration');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading pricing configuration...</div>
        </div>
      </div>
    );
  }

  if (!pricing) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          Failed to load pricing configuration
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pricing & Availability</h1>
            <p className="text-gray-600 mt-1">Manage dynamic pricing, discounts, and tour availability</p>
          </div>
          <button
            onClick={handleSaveAll}
            disabled={isSaving || !hasChanges}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Base Pricing Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-600">Base Price</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatCurrency(pricing.basePricing.basePrice)}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-600">Deposit</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatCurrency(pricing.basePricing.basePrice * (pricing.basePricing.depositPercentage / 100))}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              ({pricing.basePricing.depositPercentage}% of price)
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-600">Currency</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {pricing.basePricing.currency}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="mb-6 border-b border-gray-200 bg-white rounded-t-lg overflow-x-auto">
        <div className="flex space-x-1 p-4">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-b-lg border border-t-0 border-gray-200 p-6">
        {activeTab === 'seasonal' && (
          <SeasonalPricing
            periods={pricing.seasonalPricing}
            onUpdate={(periods) => {
              setPricing({ ...pricing, seasonalPricing: periods });
              setHasChanges(true);
            }}
          />
        )}

        {activeTab === 'group' && (
          <GroupDiscounts
            discounts={pricing.groupDiscounts}
            basePrice={pricing.basePricing.basePrice}
            onUpdate={(discounts) => {
              setPricing({ ...pricing, groupDiscounts: discounts });
              setHasChanges(true);
            }}
          />
        )}

        {activeTab === 'earlyBird' && (
          <EarlyBirdLastMinute
            rule={pricing.earlyBirdLastMinute[0] || null}
            onUpdate={(rule) => {
              setPricing({ ...pricing, earlyBirdLastMinute: [rule] });
              setHasChanges(true);
            }}
          />
        )}

        {activeTab === 'blackout' && (
          <BlackoutDates
            periods={pricing.blackoutPeriods}
            onUpdate={(periods) => {
              setPricing({ ...pricing, blackoutPeriods: periods });
              setHasChanges(true);
            }}
          />
        )}

        {activeTab === 'capacity' && (
          <CapacitySettings
            setting={pricing.capacitySettings}
            onUpdate={(setting) => {
              setPricing({ ...pricing, capacitySettings: setting });
              setHasChanges(true);
            }}
          />
        )}

        {activeTab === 'calendar' && (
          <PriceCalendar
            entries={pricing.priceCalendar}
            basePrice={pricing.basePricing.basePrice}
          />
        )}

        {activeTab === 'analytics' && (
          <PriceHistoryAnalytics
            analytics={analytics}
            history={history}
          />
        )}
      </div>

      {/* Save reminder */}
      {hasChanges && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-900">Unsaved changes</h4>
            <p className="text-sm text-yellow-800 mt-1">
              You have unsaved changes. Click the "Save Changes" button to apply them.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Re-export subcomponents for direct use if needed
export { SeasonalPricing } from './SeasonalPricing';
export { GroupDiscounts } from './GroupDiscounts';
export { EarlyBirdLastMinute } from './EarlyBirdLastMinute';
export { BlackoutDates } from './BlackoutDates';
export { CapacitySettings } from './CapacitySettings';
export { PriceCalendar } from './PriceCalendar';
export { PriceHistoryAnalytics } from './PriceHistoryAnalytics';
