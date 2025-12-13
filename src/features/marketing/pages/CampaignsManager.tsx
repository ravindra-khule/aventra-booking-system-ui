/**
 * Campaigns Manager Page
 * Main page for managing all marketing campaigns
 */

import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreVertical } from 'lucide-react';
import {
  Campaign,
  CampaignStatus,
  CampaignChannel,
  CampaignRequest,
} from '../types/campaign.types';
import { useCampaignContext } from '../context/CampaignContext';
import { CampaignForm } from '../components/CampaignForm';
import { CampaignList } from '../components/CampaignList';
import { CampaignAnalyticsDashboard } from '../components/CampaignAnalytics';
import styles from '../components/CampaignsManager.module.css';

type ViewMode = 'list' | 'details' | 'create' | 'edit' | 'analytics';

export const CampaignsManager: React.FC = () => {
  const {
    campaigns,
    selectedCampaign,
    campaignLoading,
    campaignError,
    currentPage,
    totalPages,
    loadCampaigns,
    getCampaignById,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    setSelectedCampaign,
  } = useCampaignContext();

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'ALL'>('ALL');
  const [channelFilter, setChannelFilter] = useState<CampaignChannel | 'ALL'>('ALL');
  const [isFormLoading, setIsFormLoading] = useState(false);

  useEffect(() => {
    loadCampaigns({
      status:
        statusFilter === 'ALL' ? undefined : [statusFilter as CampaignStatus],
      channels: channelFilter === 'ALL' ? undefined : [channelFilter as CampaignChannel],
      searchTerm: searchTerm || undefined,
    });
  }, [searchTerm, statusFilter, channelFilter, loadCampaigns]);

  const handleCreateCampaign = async (data: CampaignRequest) => {
    setIsFormLoading(true);
    try {
      const newCampaign = await createCampaign(data);
      setViewMode('list');
      // Show success notification
      console.log('Campaign created successfully', newCampaign);
    } catch (error) {
      console.error('Error creating campaign:', error);
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleUpdateCampaign = async (data: CampaignRequest) => {
    if (!selectedCampaign) return;

    setIsFormLoading(true);
    try {
      await updateCampaign(selectedCampaign.id, data);
      setViewMode('list');
      console.log('Campaign updated successfully');
    } catch (error) {
      console.error('Error updating campaign:', error);
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setViewMode('edit');
  };

  const handleSelectCampaign = async (campaign: Campaign) => {
    const fullCampaign = await getCampaignById(campaign.id);
    setSelectedCampaign(fullCampaign);
    setViewMode('details');
  };

  const handleDeleteCampaign = async (id: string) => {
    try {
      await deleteCampaign(id);
      setViewMode('list');
      console.log('Campaign deleted successfully');
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Marketing Campaigns</h1>
          <p>Create, manage, and track multi-channel marketing campaigns</p>
        </div>
        {viewMode === 'list' && (
          <button
            className={styles.createBtn}
            onClick={() => {
              setSelectedCampaign(null);
              setViewMode('create');
            }}
          >
            <Plus className={styles.icon} />
            New Campaign
          </button>
        )}
      </div>

      {/* Error Message */}
      {campaignError && (
        <div className={styles.errorBanner}>
          <p>{campaignError}</p>
        </div>
      )}

      {/* View: List */}
      {viewMode === 'list' && (
        <div className={styles.listView}>
          {/* Filters */}
          <div className={styles.filters}>
            <div className={styles.searchBox}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <Filter className={styles.filterIcon} />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as any)}
                className={styles.filterSelect}
              >
                <option value="ALL">All Status</option>
                <option value={CampaignStatus.DRAFT}>Draft</option>
                <option value={CampaignStatus.SCHEDULED}>Scheduled</option>
                <option value={CampaignStatus.ACTIVE}>Active</option>
                <option value={CampaignStatus.COMPLETED}>Completed</option>
                <option value={CampaignStatus.PAUSED}>Paused</option>
              </select>

              <select
                value={channelFilter}
                onChange={e => setChannelFilter(e.target.value as any)}
                className={styles.filterSelect}
              >
                <option value="ALL">All Channels</option>
                <option value={CampaignChannel.EMAIL}>Email</option>
                <option value={CampaignChannel.SMS}>SMS</option>
                <option value={CampaignChannel.SOCIAL_MEDIA}>Social Media</option>
                <option value={CampaignChannel.PUSH_NOTIFICATION}>Push Notification</option>
              </select>
            </div>
          </div>

          {/* Campaign List */}
          <CampaignList
            campaigns={campaigns}
            onEdit={handleEditCampaign}
            onDelete={handleDeleteCampaign}
            onSelect={handleSelectCampaign}
            isLoading={campaignLoading}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                disabled={currentPage === 1}
                onClick={() => loadCampaigns({}, currentPage - 1)}
                className={styles.paginationBtn}
              >
                Previous
              </button>
              <span className={styles.pageInfo}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => loadCampaigns({}, currentPage + 1)}
                className={styles.paginationBtn}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* View: Create Campaign */}
      {viewMode === 'create' && (
        <div className={styles.formView}>
          <div className={styles.formHeader}>
            <h2>Create New Campaign</h2>
            <button
              className={styles.closeBtn}
              onClick={() => setViewMode('list')}
            >
              ✕
            </button>
          </div>
          <CampaignForm
            onSubmit={handleCreateCampaign}
            onCancel={() => setViewMode('list')}
            isLoading={isFormLoading}
          />
        </div>
      )}

      {/* View: Edit Campaign */}
      {viewMode === 'edit' && selectedCampaign && (
        <div className={styles.formView}>
          <div className={styles.formHeader}>
            <h2>Edit Campaign: {selectedCampaign.name}</h2>
            <button
              className={styles.closeBtn}
              onClick={() => setViewMode('list')}
            >
              ✕
            </button>
          </div>
          <CampaignForm
            campaign={selectedCampaign}
            onSubmit={handleUpdateCampaign}
            onCancel={() => setViewMode('list')}
            isLoading={isFormLoading}
          />
        </div>
      )}

      {/* View: Campaign Details */}
      {viewMode === 'details' && selectedCampaign && (
        <div className={styles.detailsView}>
          <div className={styles.detailsHeader}>
            <div className={styles.detailsTitle}>
              <h2>{selectedCampaign.name}</h2>
              <span className={`${styles.status} ${styles[selectedCampaign.status.toLowerCase()]}`}>
                {selectedCampaign.status}
              </span>
            </div>
            <div className={styles.detailsActions}>
              <button
                className={styles.actionBtn}
                onClick={() => handleEditCampaign(selectedCampaign)}
              >
                Edit
              </button>
              <button
                className={styles.actionBtn}
                onClick={() => setViewMode('analytics')}
              >
                Analytics
              </button>
              <button
                className={styles.closeBtn}
                onClick={() => {
                  setSelectedCampaign(null);
                  setViewMode('list');
                }}
              >
                ✕
              </button>
            </div>
          </div>

          <div className={styles.detailsContent}>
            {selectedCampaign.description && (
              <div className={styles.section}>
                <h3>Description</h3>
                <p>{selectedCampaign.description}</p>
              </div>
            )}

            <div className={styles.twoColumn}>
              <div className={styles.section}>
                <h3>Campaign Details</h3>
                <dl className={styles.details}>
                  <dt>Status</dt>
                  <dd>{selectedCampaign.status}</dd>
                  <dt>Channels</dt>
                  <dd>{selectedCampaign.channels.join(', ')}</dd>
                  <dt>Audience Size</dt>
                  <dd>{selectedCampaign.audienceSize.toLocaleString()} recipients</dd>
                  <dt>Start Date</dt>
                  <dd>{new Date(selectedCampaign.startDate).toLocaleString()}</dd>
                  <dt>End Date</dt>
                  <dd>{new Date(selectedCampaign.endDate).toLocaleString()}</dd>
                </dl>
              </div>

              <div className={styles.section}>
                <h3>Performance Metrics</h3>
                <dl className={styles.details}>
                  <dt>Sent</dt>
                  <dd>{selectedCampaign.metrics.sent.toLocaleString()}</dd>
                  <dt>Delivered</dt>
                  <dd>{selectedCampaign.metrics.delivered.toLocaleString()}</dd>
                  <dt>Conversion Rate</dt>
                  <dd>{selectedCampaign.metrics.conversionRate.toFixed(2)}%</dd>
                  <dt>Revenue</dt>
                  <dd>${selectedCampaign.metrics.revenue.toFixed(2)}</dd>
                  <dt>ROI</dt>
                  <dd className={styles.positive}>
                    {selectedCampaign.roiTracking.roi.toFixed(1)}%
                  </dd>
                </dl>
              </div>
            </div>

            {selectedCampaign.notes && (
              <div className={styles.section}>
                <h3>Notes</h3>
                <p>{selectedCampaign.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* View: Analytics */}
      {viewMode === 'analytics' && selectedCampaign && (
        <div className={styles.analyticsView}>
          <div className={styles.analyticsHeader}>
            <button
              className={styles.backBtn}
              onClick={() => setViewMode('details')}
            >
              ← Back
            </button>
            <h2>{selectedCampaign.name} - Analytics</h2>
          </div>
          <CampaignAnalyticsDashboard
            campaign={selectedCampaign}
            isLoading={campaignLoading}
          />
        </div>
      )}
    </div>
  );
};
