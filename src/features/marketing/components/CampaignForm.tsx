/**
 * Campaign Form Component
 * Main form for creating and editing campaigns
 */

import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, Share2, Clock, AlertCircle, CheckCircle, Plus, X } from 'lucide-react';
import {
  Campaign,
  CampaignChannel,
  CampaignRequest,
  AudienceSegment,
  CampaignTemplate,
  EmailTemplateContent,
  SMSTemplateContent,
  SocialTemplateContent,
} from '../types/campaign.types';
import { useCampaignContext } from '../context/CampaignContext';
import styles from './CampaignForm.module.css';

interface CampaignFormProps {
  campaign?: Campaign;
  onSubmit: (data: CampaignRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const CampaignForm: React.FC<CampaignFormProps> = ({
  campaign,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const { segments, templates, loadSegments, loadTemplates } = useCampaignContext();

  const [formData, setFormData] = useState<Partial<CampaignRequest>>({
    name: campaign?.name || '',
    description: campaign?.description || '',
    channels: campaign?.channels || [CampaignChannel.EMAIL],
    templateId: campaign?.templateId,
    audienceSegments: campaign?.audienceSegments.map(s => s.id) || [],
    startDate: campaign?.startDate || new Date(),
    endDate: campaign?.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    emailContent: campaign?.emailContent,
    smsContent: campaign?.smsContent,
    socialContent: campaign?.socialContent,
    hasABTest: campaign?.hasABTest || false,
    notes: campaign?.notes || '',
  });

  const [selectedTemplate, setSelectedTemplate] = useState<CampaignTemplate | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'basic' | 'channels' | 'segments' | 'scheduling'>('basic');

  useEffect(() => {
    loadSegments();
    loadTemplates();
  }, [loadSegments, loadTemplates]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleChannelToggle = (channel: CampaignChannel) => {
    const channels = formData.channels || [];
    const updated = channels.includes(channel)
      ? channels.filter(c => c !== channel)
      : [...channels, channel];
    handleChange('channels', updated);
  };

  const handleSegmentToggle = (segmentId: string) => {
    const segments = formData.audienceSegments || [];
    const updated = segments.includes(segmentId)
      ? segments.filter(s => s !== segmentId)
      : [...segments, segmentId];
    handleChange('audienceSegments', updated);
  };

  const handleTemplateSelect = async (template: CampaignTemplate) => {
    setSelectedTemplate(template);
    handleChange('templateId', template.id);

    // Apply template content
    if (template.emailTemplate && formData.channels?.includes(CampaignChannel.EMAIL)) {
      handleChange('emailContent', template.emailTemplate);
    }
    if (template.smsTemplate && formData.channels?.includes(CampaignChannel.SMS)) {
      handleChange('smsContent', template.smsTemplate);
    }
    if (template.socialTemplate && formData.channels?.includes(CampaignChannel.SOCIAL_MEDIA)) {
      handleChange('socialContent', template.socialTemplate);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Campaign name is required';
    }
    if (!formData.channels || formData.channels.length === 0) {
      newErrors.channels = 'At least one channel must be selected';
    }
    if (!formData.audienceSegments || formData.audienceSegments.length === 0) {
      newErrors.segments = 'At least one audience segment must be selected';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.dates = 'Start date must be before end date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData as CampaignRequest);
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to save campaign',
      });
    }
  };

  const channelIcons = {
    [CampaignChannel.EMAIL]: <Mail className={styles.icon} />,
    [CampaignChannel.SMS]: <MessageSquare className={styles.icon} />,
    [CampaignChannel.SOCIAL_MEDIA]: <Share2 className={styles.icon} />,
    [CampaignChannel.PUSH_NOTIFICATION]: <AlertCircle className={styles.icon} />,
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Tabs */}
        <div className={styles.tabsContainer}>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === 'basic' ? styles.active : ''}`}
            onClick={() => setActiveTab('basic')}
          >
            Basic Info
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === 'channels' ? styles.active : ''}`}
            onClick={() => setActiveTab('channels')}
          >
            Channels
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === 'segments' ? styles.active : ''}`}
            onClick={() => setActiveTab('segments')}
          >
            Audience
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === 'scheduling' ? styles.active : ''}`}
            onClick={() => setActiveTab('scheduling')}
          >
            Schedule
          </button>
        </div>

        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className={styles.tabContent}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Campaign Name *</label>
              <input
                id="name"
                type="text"
                value={formData.name || ''}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="e.g., Summer Promotion 2024"
                className={`${styles.input} ${errors.name ? styles.error : ''}`}
              />
              {errors.name && <span className={styles.errorText}>{errors.name}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={formData.description || ''}
                onChange={e => handleChange('description', e.target.value)}
                placeholder="Describe your campaign objectives and strategy"
                rows={4}
                className={styles.textarea}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Campaign Template</label>
              <div className={styles.templateGrid}>
                {templates.map(template => (
                  <button
                    key={template.id}
                    type="button"
                    className={`${styles.templateCard} ${
                      selectedTemplate?.id === template.id ? styles.selected : ''
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    {template.thumbnail && (
                      <img src={template.thumbnail} alt={template.name} className={styles.thumbnail} />
                    )}
                    <div>
                      <h4>{template.name}</h4>
                      <p>{template.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                value={formData.notes || ''}
                onChange={e => handleChange('notes', e.target.value)}
                placeholder="Internal notes about this campaign"
                rows={3}
                className={styles.textarea}
              />
            </div>
          </div>
        )}

        {/* Channels Tab */}
        {activeTab === 'channels' && (
          <div className={styles.tabContent}>
            <h3 className={styles.sectionTitle}>Select Communication Channels</h3>
            <div className={styles.channelsGrid}>
              {Object.values(CampaignChannel).map(channel => (
                <label key={channel} className={styles.channelOption}>
                  <input
                    type="checkbox"
                    checked={formData.channels?.includes(channel) || false}
                    onChange={() => handleChannelToggle(channel)}
                  />
                  <span className={styles.channelLabel}>
                    {channelIcons[channel]}
                    {channel}
                  </span>
                </label>
              ))}
            </div>
            {errors.channels && <span className={styles.errorText}>{errors.channels}</span>}

            {/* Channel-specific content */}
            {formData.channels?.includes(CampaignChannel.EMAIL) && (
              <div className={styles.channelContent}>
                <h4>Email Content</h4>
                <div className={styles.formGroup}>
                  <label htmlFor="emailSubject">Subject Line</label>
                  <input
                    id="emailSubject"
                    type="text"
                    value={formData.emailContent?.subject || ''}
                    onChange={e => handleChange('emailContent', {
                      ...formData.emailContent,
                      subject: e.target.value,
                    })}
                    placeholder="Email subject"
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="emailHtml">HTML Content</label>
                  <textarea
                    id="emailHtml"
                    value={formData.emailContent?.htmlContent || ''}
                    onChange={e => handleChange('emailContent', {
                      ...formData.emailContent,
                      htmlContent: e.target.value,
                    })}
                    placeholder="HTML email content"
                    rows={6}
                    className={styles.textarea}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="emailCta">CTA Button Text</label>
                  <input
                    id="emailCta"
                    type="text"
                    value={formData.emailContent?.ctaButtonText || ''}
                    onChange={e => handleChange('emailContent', {
                      ...formData.emailContent,
                      ctaButtonText: e.target.value,
                    })}
                    placeholder="e.g., Book Now"
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="emailCtaUrl">CTA Button URL</label>
                  <input
                    id="emailCtaUrl"
                    type="url"
                    value={formData.emailContent?.ctaButtonUrl || ''}
                    onChange={e => handleChange('emailContent', {
                      ...formData.emailContent,
                      ctaButtonUrl: e.target.value,
                    })}
                    placeholder="https://..."
                    className={styles.input}
                  />
                </div>
              </div>
            )}

            {formData.channels?.includes(CampaignChannel.SMS) && (
              <div className={styles.channelContent}>
                <h4>SMS Content</h4>
                <div className={styles.formGroup}>
                  <label htmlFor="smsMessage">Message</label>
                  <textarea
                    id="smsMessage"
                    value={formData.smsContent?.message || ''}
                    onChange={e => {
                      const message = e.target.value;
                      handleChange('smsContent', {
                        ...formData.smsContent,
                        message,
                        characterCount: message.length,
                      });
                    }}
                    placeholder="SMS message (max 160 characters)"
                    rows={3}
                    maxLength={160}
                    className={styles.textarea}
                  />
                  <small>{formData.smsContent?.characterCount || 0}/160 characters</small>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Segments Tab */}
        {activeTab === 'segments' && (
          <div className={styles.tabContent}>
            <h3 className={styles.sectionTitle}>Select Target Audience Segments</h3>
            <div className={styles.segmentsList}>
              {segments.map(segment => (
                <label key={segment.id} className={styles.segmentOption}>
                  <input
                    type="checkbox"
                    checked={formData.audienceSegments?.includes(segment.id) || false}
                    onChange={() => handleSegmentToggle(segment.id)}
                  />
                  <div className={styles.segmentInfo}>
                    <span className={styles.segmentName}>{segment.name}</span>
                    <span className={styles.segmentCount}>{segment.customerCount} customers</span>
                    <p>{segment.description}</p>
                  </div>
                </label>
              ))}
            </div>
            {errors.segments && <span className={styles.errorText}>{errors.segments}</span>}
          </div>
        )}

        {/* Scheduling Tab */}
        {activeTab === 'scheduling' && (
          <div className={styles.tabContent}>
            <div className={styles.formGroup}>
              <label htmlFor="startDate">Campaign Start Date *</label>
              <input
                id="startDate"
                type="datetime-local"
                value={formData.startDate ? new Date(formData.startDate).toISOString().slice(0, 16) : ''}
                onChange={e => handleChange('startDate', new Date(e.target.value))}
                className={`${styles.input} ${errors.startDate ? styles.error : ''}`}
              />
              {errors.startDate && <span className={styles.errorText}>{errors.startDate}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="endDate">Campaign End Date *</label>
              <input
                id="endDate"
                type="datetime-local"
                value={formData.endDate ? new Date(formData.endDate).toISOString().slice(0, 16) : ''}
                onChange={e => handleChange('endDate', new Date(e.target.value))}
                className={`${styles.input} ${errors.endDate ? styles.error : ''}`}
              />
              {errors.endDate && <span className={styles.errorText}>{errors.endDate}</span>}
            </div>

            {errors.dates && <span className={styles.errorText}>{errors.dates}</span>}

            <div className={styles.formGroup}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={formData.hasABTest || false}
                  onChange={e => handleChange('hasABTest', e.target.checked)}
                />
                <span>Enable A/B Testing</span>
              </label>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className={styles.formActions}>
          {errors.submit && <span className={styles.errorText}>{errors.submit}</span>}
          <button type="button" onClick={onCancel} className={styles.cancelButton}>
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className={styles.submitButton}>
            {isLoading ? 'Saving...' : campaign ? 'Update Campaign' : 'Create Campaign'}
          </button>
        </div>
      </form>
    </div>
  );
};
