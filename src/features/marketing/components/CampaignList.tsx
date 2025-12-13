/**
 * Campaign List Component
 * Displays all campaigns with filtering and management options
 */

import React, { useState, useEffect } from 'react';
import {
  MoreVertical,
  Edit2,
  Trash2,
  Play,
  Pause,
  Copy,
  TrendingUp,
  Clock,
  Users,
  DollarSign,
} from 'lucide-react';
import { Campaign, CampaignStatus } from '../types/campaign.types';
import { useCampaignContext } from '../context/CampaignContext';
import styles from './CampaignList.module.css';

interface CampaignListProps {
  campaigns: Campaign[];
  onEdit: (campaign: Campaign) => void;
  onDelete: (id: string) => void;
  onSelect: (campaign: Campaign) => void;
  isLoading?: boolean;
}

export const CampaignList: React.FC<CampaignListProps> = ({
  campaigns,
  onEdit,
  onDelete,
  onSelect,
  isLoading = false,
}) => {
  const { updateCampaignStatus, sendCampaignNow, duplicateCampaign } = useCampaignContext();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleStatusToggle = async (campaign: Campaign) => {
    setActionLoading(campaign.id);
    try {
      const newStatus =
        campaign.status === CampaignStatus.PAUSED ? CampaignStatus.ACTIVE : CampaignStatus.PAUSED;
      await updateCampaignStatus(campaign.id, newStatus);
    } catch (error) {
      console.error('Error updating campaign status:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendNow = async (campaignId: string) => {
    setActionLoading(campaignId);
    try {
      await sendCampaignNow(campaignId);
    } catch (error) {
      console.error('Error sending campaign:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDuplicate = async (campaignId: string) => {
    setActionLoading(campaignId);
    try {
      await duplicateCampaign(campaignId);
    } catch (error) {
      console.error('Error duplicating campaign:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadgeClass = (status: CampaignStatus): string => {
    switch (status) {
      case CampaignStatus.DRAFT:
        return styles.statusDraft;
      case CampaignStatus.SCHEDULED:
        return styles.statusScheduled;
      case CampaignStatus.ACTIVE:
        return styles.statusActive;
      case CampaignStatus.COMPLETED:
        return styles.statusCompleted;
      case CampaignStatus.PAUSED:
        return styles.statusPaused;
      case CampaignStatus.CANCELLED:
        return styles.statusCancelled;
      default:
        return '';
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading campaigns...</div>;
  }

  if (campaigns.length === 0) {
    return (
      <div className={styles.empty}>
        <TrendingUp className={styles.emptyIcon} />
        <h3>No campaigns yet</h3>
        <p>Create your first marketing campaign to get started</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {campaigns.map(campaign => (
        <div
          key={campaign.id}
          className={`${styles.campaignCard} ${
            expandedId === campaign.id ? styles.expanded : ''
          }`}
        >
          <div className={styles.cardHeader} onClick={() => onSelect(campaign)}>
            <div className={styles.cardTitle}>
              <h3>{campaign.name}</h3>
              <span className={`${styles.statusBadge} ${getStatusBadgeClass(campaign.status)}`}>
                {campaign.status}
              </span>
            </div>
            <p className={styles.description}>{campaign.description}</p>

            <div className={styles.cardStats}>
              <div className={styles.stat}>
                <Users className={styles.statIcon} />
                <span>{campaign.audienceSize.toLocaleString()} recipients</span>
              </div>
              <div className={styles.stat}>
                <DollarSign className={styles.statIcon} />
                <span>${campaign.metrics.revenue.toFixed(2)} revenue</span>
              </div>
              <div className={styles.stat}>
                <TrendingUp className={styles.statIcon} />
                <span>{campaign.metrics.conversionRate.toFixed(1)}% conversion</span>
              </div>
              <div className={styles.stat}>
                <Clock className={styles.statIcon} />
                <span>{new Date(campaign.startDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className={styles.channelsContainer}>
              {campaign.channels.map(channel => (
                <span key={channel} className={styles.channelBadge}>
                  {channel}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.cardActions}>
            <button
              className={styles.expandButton}
              onClick={() => setExpandedId(expandedId === campaign.id ? null : campaign.id)}
            >
              <MoreVertical className={styles.icon} />
            </button>
          </div>

          {expandedId === campaign.id && (
            <div className={styles.expandedContent}>
              <div className={styles.actionButtons}>
                {campaign.status === CampaignStatus.DRAFT && (
                  <button
                    className={`${styles.actionBtn} ${styles.primaryBtn}`}
                    onClick={() => handleSendNow(campaign.id)}
                    disabled={actionLoading === campaign.id}
                  >
                    <Play className={styles.icon} />
                    {actionLoading === campaign.id ? 'Sending...' : 'Send Now'}
                  </button>
                )}
                {(campaign.status === CampaignStatus.ACTIVE ||
                  campaign.status === CampaignStatus.PAUSED) && (
                  <button
                    className={`${styles.actionBtn} ${styles.secondaryBtn}`}
                    onClick={() => handleStatusToggle(campaign)}
                    disabled={actionLoading === campaign.id}
                  >
                    <Pause className={styles.icon} />
                    {actionLoading === campaign.id
                      ? 'Updating...'
                      : campaign.status === CampaignStatus.ACTIVE
                        ? 'Pause'
                        : 'Resume'}
                  </button>
                )}
                <button
                  className={`${styles.actionBtn} ${styles.secondaryBtn}`}
                  onClick={() => onEdit(campaign)}
                >
                  <Edit2 className={styles.icon} />
                  Edit
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.secondaryBtn}`}
                  onClick={() => handleDuplicate(campaign.id)}
                  disabled={actionLoading === campaign.id}
                >
                  <Copy className={styles.icon} />
                  {actionLoading === campaign.id ? 'Duplicating...' : 'Duplicate'}
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.dangerBtn}`}
                  onClick={() => {
                    if (
                      window.confirm(
                        'Are you sure you want to delete this campaign? This action cannot be undone.'
                      )
                    ) {
                      onDelete(campaign.id);
                    }
                  }}
                >
                  <Trash2 className={styles.icon} />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
