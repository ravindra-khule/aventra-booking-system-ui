/**
 * Campaign Management API Services
 * Handles all campaign-related API calls
 */

import {
  Campaign,
  CampaignRequest,
  CampaignStatus,
  CampaignAnalytics,
  CampaignAnalyticsRequest,
  CampaignFilter,
  AudienceSegment,
  CampaignTemplate,
  ABTestConfig,
  ROIMetrics,
} from '../types/campaign.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Campaign CRUD Operations
 */
export class CampaignService {
  /**
   * Fetch all campaigns with optional filtering
   */
  static async getCampaigns(filter?: CampaignFilter, page = 1, limit = 10) {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      if (filter?.status && filter.status.length > 0) {
        params.append('status', filter.status.join(','));
      }
      if (filter?.channels && filter.channels.length > 0) {
        params.append('channels', filter.channels.join(','));
      }
      if (filter?.searchTerm) {
        params.append('search', filter.searchTerm);
      }
      if (filter?.dateRange) {
        params.append('startDate', filter.dateRange.startDate.toISOString());
        params.append('endDate', filter.dateRange.endDate.toISOString());
      }

      const response = await fetch(
        `${API_BASE_URL}/marketing/campaigns?${params.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch campaigns');
      return await response.json();
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  }

  /**
   * Get single campaign by ID
   */
  static async getCampaignById(id: string): Promise<Campaign> {
    try {
      const response = await fetch(`${API_BASE_URL}/marketing/campaigns/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch campaign');
      return await response.json();
    } catch (error) {
      console.error('Error fetching campaign:', error);
      throw error;
    }
  }

  /**
   * Create new campaign
   */
  static async createCampaign(data: CampaignRequest): Promise<Campaign> {
    try {
      const response = await fetch(`${API_BASE_URL}/marketing/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create campaign');
      return await response.json();
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  }

  /**
   * Update campaign
   */
  static async updateCampaign(id: string, data: Partial<CampaignRequest>): Promise<Campaign> {
    try {
      const response = await fetch(`${API_BASE_URL}/marketing/campaigns/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update campaign');
      return await response.json();
    } catch (error) {
      console.error('Error updating campaign:', error);
      throw error;
    }
  }

  /**
   * Delete campaign
   */
  static async deleteCampaign(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/marketing/campaigns/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete campaign');
    } catch (error) {
      console.error('Error deleting campaign:', error);
      throw error;
    }
  }

  /**
   * Update campaign status
   */
  static async updateCampaignStatus(id: string, status: CampaignStatus): Promise<Campaign> {
    try {
      const response = await fetch(`${API_BASE_URL}/marketing/campaigns/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update campaign status');
      return await response.json();
    } catch (error) {
      console.error('Error updating campaign status:', error);
      throw error;
    }
  }

  /**
   * Schedule campaign for delivery
   */
  static async scheduleCampaign(id: string, scheduledFor: Date): Promise<Campaign> {
    try {
      const response = await fetch(`${API_BASE_URL}/marketing/campaigns/${id}/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ scheduledFor }),
      });

      if (!response.ok) throw new Error('Failed to schedule campaign');
      return await response.json();
    } catch (error) {
      console.error('Error scheduling campaign:', error);
      throw error;
    }
  }

  /**
   * Send campaign immediately
   */
  static async sendCampaignNow(id: string): Promise<Campaign> {
    try {
      const response = await fetch(`${API_BASE_URL}/marketing/campaigns/${id}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to send campaign');
      return await response.json();
    } catch (error) {
      console.error('Error sending campaign:', error);
      throw error;
    }
  }

  /**
   * Duplicate campaign
   */
  static async duplicateCampaign(id: string): Promise<Campaign> {
    try {
      const response = await fetch(`${API_BASE_URL}/marketing/campaigns/${id}/duplicate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to duplicate campaign');
      return await response.json();
    } catch (error) {
      console.error('Error duplicating campaign:', error);
      throw error;
    }
  }
}

/**
 * Audience Segmentation Services
 */
export class AudienceSegmentService {
  /**
   * Fetch all audience segments
   */
  static async getSegments(): Promise<AudienceSegment[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/marketing/segments`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch segments');
      return await response.json();
    } catch (error) {
      console.error('Error fetching segments:', error);
      throw error;
    }
  }

  /**
   * Get segment by ID
   */
  static async getSegmentById(id: string): Promise<AudienceSegment> {
    try {
      const response = await fetch(`${API_BASE_URL}/marketing/segments/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch segment');
      return await response.json();
    } catch (error) {
      console.error('Error fetching segment:', error);
      throw error;
    }
  }

  /**
   * Create new audience segment
   */
  static async createSegment(data: Partial<AudienceSegment>): Promise<AudienceSegment> {
    try {
      const response = await fetch(`${API_BASE_URL}/marketing/segments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create segment');
      return await response.json();
    } catch (error) {
      console.error('Error creating segment:', error);
      throw error;
    }
  }

  /**
   * Update audience segment
   */
  static async updateSegment(id: string, data: Partial<AudienceSegment>): Promise<AudienceSegment> {
    try {
      const response = await fetch(`${API_BASE_URL}/marketing/segments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update segment');
      return await response.json();
    } catch (error) {
      console.error('Error updating segment:', error);
      throw error;
    }
  }

  /**
   * Delete segment
   */
  static async deleteSegment(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/marketing/segments/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete segment');
    } catch (error) {
      console.error('Error deleting segment:', error);
      throw error;
    }
  }

  /**
   * Get customer count for segment
   */
  static async getSegmentCustomerCount(id: string): Promise<number> {
    try {
      const response = await fetch(`${API_BASE_URL}/marketing/segments/${id}/count`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch customer count');
      const data = await response.json();
      return data.count;
    } catch (error) {
      console.error('Error fetching customer count:', error);
      throw error;
    }
  }
}

/**
 * Campaign Templates Services
 */
export class CampaignTemplateService {
  /**
   * Fetch all campaign templates
   */
  static async getTemplates(): Promise<CampaignTemplate[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/marketing/templates`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch templates');
      return await response.json();
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  }

  /**
   * Get template by ID
   */
  static async getTemplateById(id: string): Promise<CampaignTemplate> {
    try {
      const response = await fetch(`${API_BASE_URL}/marketing/templates/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch template');
      return await response.json();
    } catch (error) {
      console.error('Error fetching template:', error);
      throw error;
    }
  }

  /**
   * Create custom template
   */
  static async createTemplate(data: Partial<CampaignTemplate>): Promise<CampaignTemplate> {
    try {
      const response = await fetch(`${API_BASE_URL}/marketing/templates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create template');
      return await response.json();
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  }
}

/**
 * Campaign Analytics Services
 */
export class CampaignAnalyticsService {
  /**
   * Get campaign analytics
   */
  static async getCampaignAnalytics(request: CampaignAnalyticsRequest): Promise<CampaignAnalytics> {
    try {
      const params = new URLSearchParams();
      params.append('startDate', request.startDate.toISOString());
      params.append('endDate', request.endDate.toISOString());
      if (request.groupBy) {
        params.append('groupBy', request.groupBy);
      }

      const response = await fetch(
        `${API_BASE_URL}/marketing/campaigns/${request.campaignId}/analytics?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch analytics');
      return await response.json();
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }

  /**
   * Get real-time campaign metrics
   */
  static async getCampaignMetrics(campaignId: string) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/marketing/campaigns/${campaignId}/metrics`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch metrics');
      return await response.json();
    } catch (error) {
      console.error('Error fetching metrics:', error);
      throw error;
    }
  }

  /**
   * Get ROI metrics for campaign
   */
  static async getCampaignROI(campaignId: string): Promise<ROIMetrics> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/marketing/campaigns/${campaignId}/roi`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch ROI metrics');
      return await response.json();
    } catch (error) {
      console.error('Error fetching ROI metrics:', error);
      throw error;
    }
  }

  /**
   * Get A/B test results
   */
  static async getABTestResults(campaignId: string): Promise<ABTestConfig> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/marketing/campaigns/${campaignId}/ab-test`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch A/B test results');
      return await response.json();
    } catch (error) {
      console.error('Error fetching A/B test results:', error);
      throw error;
    }
  }

  /**
   * Update A/B test to use winning variant
   */
  static async applyABTestWinner(campaignId: string, variantId: string): Promise<Campaign> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/marketing/campaigns/${campaignId}/ab-test/apply-winner`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
          body: JSON.stringify({ variantId }),
        }
      );

      if (!response.ok) throw new Error('Failed to apply A/B test winner');
      return await response.json();
    } catch (error) {
      console.error('Error applying A/B test winner:', error);
      throw error;
    }
  }
}

/**
 * Campaign Promo Code Integration
 */
export class CampaignPromoCodeService {
  /**
   * Associate promo code with campaign
   */
  static async associatePromoCode(campaignId: string, promoCodeId: string): Promise<Campaign> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/marketing/campaigns/${campaignId}/promo-code`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
          body: JSON.stringify({ promoCodeId }),
        }
      );

      if (!response.ok) throw new Error('Failed to associate promo code');
      return await response.json();
    } catch (error) {
      console.error('Error associating promo code:', error);
      throw error;
    }
  }

  /**
   * Get campaign promo code usage
   */
  static async getPromoCodeUsage(campaignId: string) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/marketing/campaigns/${campaignId}/promo-code/usage`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch promo code usage');
      return await response.json();
    } catch (error) {
      console.error('Error fetching promo code usage:', error);
      throw error;
    }
  }
}
