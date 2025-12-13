/**
 * Campaign Management Context
 * Global state management for campaigns, segments, and templates
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  Campaign,
  CampaignFilter,
  AudienceSegment,
  CampaignTemplate,
  CampaignStatus,
} from '../types/campaign.types';
import {
  CampaignService,
  AudienceSegmentService,
  CampaignTemplateService,
} from '../services/campaign.service';
import { mockCampaigns, mockSegments, mockTemplates } from '../constants/mockData';

interface CampaignContextType {
  // Campaigns
  campaigns: Campaign[];
  selectedCampaign: Campaign | null;
  campaignLoading: boolean;
  campaignError: string | null;
  currentPage: number;
  totalPages: number;

  // Audience Segments
  segments: AudienceSegment[];
  segmentLoading: boolean;
  segmentError: string | null;

  // Templates
  templates: CampaignTemplate[];
  templateLoading: boolean;
  templateError: string | null;

  // Campaign Actions
  loadCampaigns: (filter?: CampaignFilter, page?: number) => Promise<void>;
  getCampaignById: (id: string) => Promise<Campaign>;
  createCampaign: (data: any) => Promise<Campaign>;
  updateCampaign: (id: string, data: any) => Promise<Campaign>;
  deleteCampaign: (id: string) => Promise<void>;
  updateCampaignStatus: (id: string, status: CampaignStatus) => Promise<void>;
  scheduleCampaign: (id: string, date: Date) => Promise<void>;
  sendCampaignNow: (id: string) => Promise<void>;
  duplicateCampaign: (id: string) => Promise<Campaign>;
  setSelectedCampaign: (campaign: Campaign | null) => void;

  // Segment Actions
  loadSegments: () => Promise<void>;
  createSegment: (data: any) => Promise<AudienceSegment>;
  updateSegment: (id: string, data: any) => Promise<AudienceSegment>;
  deleteSegment: (id: string) => Promise<void>;

  // Template Actions
  loadTemplates: () => Promise<void>;
  getTemplateById: (id: string) => Promise<CampaignTemplate>;
  createTemplate: (data: any) => Promise<CampaignTemplate>;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

/**
 * Campaign Context Provider Component
 */
export const CampaignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Campaigns state
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [campaignLoading, setCampaignLoading] = useState(false);
  const [campaignError, setCampaignError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Segments state
  const [segments, setSegments] = useState<AudienceSegment[]>([]);
  const [segmentLoading, setSegmentLoading] = useState(false);
  const [segmentError, setSegmentError] = useState<string | null>(null);

  // Templates state
  const [templates, setTemplates] = useState<CampaignTemplate[]>([]);
  const [templateLoading, setTemplateLoading] = useState(false);
  const [templateError, setTemplateError] = useState<string | null>(null);

  // Campaign Actions
  const loadCampaigns = useCallback(async (filter?: CampaignFilter, page = 1) => {
    setCampaignLoading(true);
    setCampaignError(null);
    try {
      const response = await CampaignService.getCampaigns(filter, page);
      setCampaigns(response.data || response);
      setCurrentPage(page);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      // Use mock data if API fails (development mode)
      console.warn('Failed to fetch campaigns from API, using mock data for development');
      setCampaigns(mockCampaigns);
      setCurrentPage(1);
      setTotalPages(1);
      setCampaignError('Using mock data - backend API not available yet. Create a real campaign to test functionality.');
    } finally {
      setCampaignLoading(false);
    }
  }, []);

  const getCampaignById = useCallback(async (id: string): Promise<Campaign> => {
    try {
      const campaign = await CampaignService.getCampaignById(id);
      setSelectedCampaign(campaign);
      return campaign;
    } catch (error) {
      setCampaignError(error instanceof Error ? error.message : 'Failed to load campaign');
      throw error;
    }
  }, []);

  const createCampaign = useCallback(async (data: any): Promise<Campaign> => {
    setCampaignLoading(true);
    setCampaignError(null);
    try {
      const campaign = await CampaignService.createCampaign(data);
      setCampaigns([...campaigns, campaign]);
      return campaign;
    } catch (error) {
      setCampaignError(error instanceof Error ? error.message : 'Failed to create campaign');
      throw error;
    } finally {
      setCampaignLoading(false);
    }
  }, [campaigns]);

  const updateCampaign = useCallback(async (id: string, data: any): Promise<Campaign> => {
    setCampaignLoading(true);
    setCampaignError(null);
    try {
      const campaign = await CampaignService.updateCampaign(id, data);
      setCampaigns(campaigns.map(c => c.id === id ? campaign : c));
      if (selectedCampaign?.id === id) {
        setSelectedCampaign(campaign);
      }
      return campaign;
    } catch (error) {
      setCampaignError(error instanceof Error ? error.message : 'Failed to update campaign');
      throw error;
    } finally {
      setCampaignLoading(false);
    }
  }, [campaigns, selectedCampaign]);

  const deleteCampaign = useCallback(async (id: string) => {
    setCampaignLoading(true);
    setCampaignError(null);
    try {
      await CampaignService.deleteCampaign(id);
      setCampaigns(campaigns.filter(c => c.id !== id));
      if (selectedCampaign?.id === id) {
        setSelectedCampaign(null);
      }
    } catch (error) {
      setCampaignError(error instanceof Error ? error.message : 'Failed to delete campaign');
      throw error;
    } finally {
      setCampaignLoading(false);
    }
  }, [campaigns, selectedCampaign]);

  const updateCampaignStatus = useCallback(async (id: string, status: CampaignStatus) => {
    setCampaignLoading(true);
    setCampaignError(null);
    try {
      const campaign = await CampaignService.updateCampaignStatus(id, status);
      setCampaigns(campaigns.map(c => c.id === id ? campaign : c));
      if (selectedCampaign?.id === id) {
        setSelectedCampaign(campaign);
      }
    } catch (error) {
      setCampaignError(error instanceof Error ? error.message : 'Failed to update campaign status');
      throw error;
    } finally {
      setCampaignLoading(false);
    }
  }, [campaigns, selectedCampaign]);

  const scheduleCampaign = useCallback(async (id: string, date: Date) => {
    setCampaignLoading(true);
    setCampaignError(null);
    try {
      const campaign = await CampaignService.scheduleCampaign(id, date);
      setCampaigns(campaigns.map(c => c.id === id ? campaign : c));
      if (selectedCampaign?.id === id) {
        setSelectedCampaign(campaign);
      }
    } catch (error) {
      setCampaignError(error instanceof Error ? error.message : 'Failed to schedule campaign');
      throw error;
    } finally {
      setCampaignLoading(false);
    }
  }, [campaigns, selectedCampaign]);

  const sendCampaignNow = useCallback(async (id: string) => {
    setCampaignLoading(true);
    setCampaignError(null);
    try {
      const campaign = await CampaignService.sendCampaignNow(id);
      setCampaigns(campaigns.map(c => c.id === id ? campaign : c));
      if (selectedCampaign?.id === id) {
        setSelectedCampaign(campaign);
      }
    } catch (error) {
      setCampaignError(error instanceof Error ? error.message : 'Failed to send campaign');
      throw error;
    } finally {
      setCampaignLoading(false);
    }
  }, [campaigns, selectedCampaign]);

  const duplicateCampaign = useCallback(async (id: string): Promise<Campaign> => {
    setCampaignLoading(true);
    setCampaignError(null);
    try {
      const campaign = await CampaignService.duplicateCampaign(id);
      setCampaigns([...campaigns, campaign]);
      return campaign;
    } catch (error) {
      setCampaignError(error instanceof Error ? error.message : 'Failed to duplicate campaign');
      throw error;
    } finally {
      setCampaignLoading(false);
    }
  }, [campaigns]);

  // Segment Actions
  const loadSegments = useCallback(async () => {
    setSegmentLoading(true);
    setSegmentError(null);
    try {
      const segments = await AudienceSegmentService.getSegments();
      setSegments(segments);
    } catch (error) {
      // Use mock data if API fails (development mode)
      console.warn('Failed to fetch segments from API, using mock data for development');
      setSegments(mockSegments);
      setSegmentError(null);
    } finally {
      setSegmentLoading(false);
    }
  }, []);

  const createSegment = useCallback(async (data: any): Promise<AudienceSegment> => {
    setSegmentLoading(true);
    setSegmentError(null);
    try {
      const segment = await AudienceSegmentService.createSegment(data);
      setSegments([...segments, segment]);
      return segment;
    } catch (error) {
      setSegmentError(error instanceof Error ? error.message : 'Failed to create segment');
      throw error;
    } finally {
      setSegmentLoading(false);
    }
  }, [segments]);

  const updateSegment = useCallback(async (id: string, data: any): Promise<AudienceSegment> => {
    setSegmentLoading(true);
    setSegmentError(null);
    try {
      const segment = await AudienceSegmentService.updateSegment(id, data);
      setSegments(segments.map(s => s.id === id ? segment : s));
      return segment;
    } catch (error) {
      setSegmentError(error instanceof Error ? error.message : 'Failed to update segment');
      throw error;
    } finally {
      setSegmentLoading(false);
    }
  }, [segments]);

  const deleteSegment = useCallback(async (id: string) => {
    setSegmentLoading(true);
    setSegmentError(null);
    try {
      await AudienceSegmentService.deleteSegment(id);
      setSegments(segments.filter(s => s.id !== id));
    } catch (error) {
      setSegmentError(error instanceof Error ? error.message : 'Failed to delete segment');
      throw error;
    } finally {
      setSegmentLoading(false);
    }
  }, [segments]);

  // Template Actions
  const loadTemplates = useCallback(async () => {
    setTemplateLoading(true);
    setTemplateError(null);
    try {
      const templates = await CampaignTemplateService.getTemplates();
      setTemplates(templates);
    } catch (error) {
      // Use mock data if API fails (development mode)
      console.warn('Failed to fetch templates from API, using mock data for development');
      setTemplates(mockTemplates);
      setTemplateError(null);
    } finally {
      setTemplateLoading(false);
    }
  }, []);

  const getTemplateById = useCallback(async (id: string): Promise<CampaignTemplate> => {
    try {
      return await CampaignTemplateService.getTemplateById(id);
    } catch (error) {
      setTemplateError(error instanceof Error ? error.message : 'Failed to load template');
      throw error;
    }
  }, []);

  const createTemplate = useCallback(async (data: any): Promise<CampaignTemplate> => {
    setTemplateLoading(true);
    setTemplateError(null);
    try {
      const template = await CampaignTemplateService.createTemplate(data);
      setTemplates([...templates, template]);
      return template;
    } catch (error) {
      setTemplateError(error instanceof Error ? error.message : 'Failed to create template');
      throw error;
    } finally {
      setTemplateLoading(false);
    }
  }, [templates]);

  const value: CampaignContextType = {
    campaigns,
    selectedCampaign,
    campaignLoading,
    campaignError,
    currentPage,
    totalPages,
    segments,
    segmentLoading,
    segmentError,
    templates,
    templateLoading,
    templateError,
    loadCampaigns,
    getCampaignById,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    updateCampaignStatus,
    scheduleCampaign,
    sendCampaignNow,
    duplicateCampaign,
    setSelectedCampaign,
    loadSegments,
    createSegment,
    updateSegment,
    deleteSegment,
    loadTemplates,
    getTemplateById,
    createTemplate,
  };

  return (
    <CampaignContext.Provider value={value}>
      {children}
    </CampaignContext.Provider>
  );
};

/**
 * Hook to use Campaign Context
 */
export const useCampaignContext = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaignContext must be used within CampaignProvider');
  }
  return context;
};
