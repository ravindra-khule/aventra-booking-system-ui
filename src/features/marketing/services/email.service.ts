/**
 * Email Template Service - CRUD operations with backend API calls
 */

import {
  EmailTemplate,
  EmailTemplateVersion,
  EmailTemplateWithHistory,
  EmailTemplateCategory,
  EmailTemplateStatus,
  TemplateLanguage,
  TemplateContent,
  TemplateFilter,
  TemplateValidation,
  TemplateValidationError,
  TemplateValidationWarning,
  TestEmailPayload,
  EmailSendResult,
  EmailSendOptions,
  TemplateStatistics
} from '../types/email.types';
import { extractPlaceholders, replacePlaceholders } from '../constants/email.constants';

class EmailTemplateService {
  private apiBaseUrl: string;

  constructor() {
    this.apiBaseUrl = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5500';
  }

  private async apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.apiBaseUrl}/api/${endpoint}`;
    console.log(`[EmailTemplateService] Calling API: ${url}`, options);
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'API returned error');
      }

      return data.data;
    } catch (error) {
      console.error(`[EmailTemplateService] API Error:`, error);
      throw error;
    }
  }

  /**
   * Get all templates with optional filtering
   */
  async getAllTemplates(filter?: TemplateFilter): Promise<EmailTemplate[]> {
    const params = new URLSearchParams();
    if (filter?.searchQuery) params.append('search', filter.searchQuery);
    if (filter?.category) params.append('category', filter.category);
    if (filter?.status) params.append('status', filter.status);
    if (filter?.language) params.append('language', filter.language);

    const queryString = params.toString();
    const endpoint = `email-templates-list.php${queryString ? '?' + queryString : ''}`;
    
    return this.apiCall<EmailTemplate[]>(endpoint);
  }

  /**
   * Get a single template by ID
   */
  async getTemplateById(id: string): Promise<EmailTemplate | null> {
    try {
      return await this.apiCall<EmailTemplate>(`email-templates-get.php?id=${id}`);
    } catch (error) {
      console.error('Template not found:', id);
      return null;
    }
  }

  /**
   * Get template with full version history
   */
  async getTemplateWithHistory(id: string): Promise<EmailTemplateWithHistory | null> {
    try {
      const template = await this.apiCall<any>(`email-templates-get.php?id=${id}`);
      const versions = await this.apiCall<EmailTemplateVersion[]>(`email-templates-versions.php?id=${id}`);
      
      return {
        ...template,
        versions
      };
    } catch (error) {
      console.error('Template with history not found:', id);
      return null;
    }
  }

  /**
   * Create a new template
   */
  async createTemplate(
    template: Omit<EmailTemplate, 'id' | 'version' | 'usageCount' | 'createdDate'>
  ): Promise<EmailTemplate> {
    // Validate template
    const validation = this.validateTemplate({
      id: 'temp',
      version: 1,
      usageCount: 0,
      createdDate: new Date().toISOString(),
      ...template
    });
    
    if (!validation.isValid) {
      throw new Error(`Template validation failed: ${validation.errors[0]?.message}`);
    }

    return this.apiCall<EmailTemplate>('email-templates-create.php', {
      method: 'POST',
      body: JSON.stringify(template)
    });
  }

  /**
   * Update an existing template
   */
  async updateTemplate(
    id: string,
    updates: Partial<EmailTemplate>,
    changeDescription?: string
  ): Promise<EmailTemplate> {
    return this.apiCall<EmailTemplate>('email-templates-update.php', {
      method: 'PUT',
      body: JSON.stringify({
        id,
        ...updates,
        changeDescription
      })
    });
  }

  /**
   * Delete a template
   */
  async deleteTemplate(id: string): Promise<boolean> {
    try {
      await this.apiCall<any>('email-templates-delete.php', {
        method: 'DELETE',
        body: JSON.stringify({ id })
      });
      return true;
    } catch (error) {
      console.error('Failed to delete template:', error);
      return false;
    }
  }

  /**
   * Duplicate a template
   */
  async duplicateTemplate(id: string, newName: string, createdBy: string): Promise<EmailTemplate> {
    return this.apiCall<EmailTemplate>('email-templates-duplicate.php', {
      method: 'POST',
      body: JSON.stringify({
        id,
        newName,
        createdBy
      })
    });
  }

  /**
   * Restore a previous version
   */
  async restoreVersion(templateId: string, versionNumber: number, restoredBy: string): Promise<EmailTemplate> {
    return this.apiCall<EmailTemplate>('email-templates-restore.php', {
      method: 'POST',
      body: JSON.stringify({
        templateId,
        versionNumber,
        restoredBy
      })
    });
  }

  /**
   * Validate a template
   */
  validateTemplate(template: EmailTemplate): TemplateValidation {
    const errors: TemplateValidationError[] = [];
    const warnings: TemplateValidationWarning[] = [];

    // Check required fields
    if (!template.name || template.name.trim().length === 0) {
      errors.push({
        field: 'name',
        message: 'Template name is required',
        severity: 'error'
      });
    }

    if (!template.content || template.content.length === 0) {
      errors.push({
        field: 'content',
        message: 'Template must have at least one language version',
        severity: 'error'
      });
    }

    // Validate each language content
    template.content?.forEach((content, index) => {
      if (!content.subject || content.subject.trim().length === 0) {
        errors.push({
          field: `content[${index}].subject`,
          message: `Subject is required for ${content.language} version`,
          severity: 'error'
        });
      }

      if (!content.htmlContent || content.htmlContent.trim().length === 0) {
        errors.push({
          field: `content[${index}].htmlContent`,
          message: `HTML content is required for ${content.language} version`,
          severity: 'error'
        });
      }

      // Check for unsubscribe link in marketing emails
      if (template.category === EmailTemplateCategory.MARKETING) {
        if (!content.htmlContent.includes('{{unsubscribeLink}}')) {
          warnings.push({
            field: `content[${index}].htmlContent`,
            message: `Marketing emails should include an unsubscribe link for ${content.language} version`,
            severity: 'warning'
          });
        }
      }

      // Check for broken placeholders
      const placeholders = extractPlaceholders(content.htmlContent);
      placeholders.forEach(placeholder => {
        if (!placeholder.match(/^[a-zA-Z]+$/)) {
          warnings.push({
            field: `content[${index}].htmlContent`,
            message: `Invalid placeholder format: {{${placeholder}}}`,
            severity: 'warning'
          });
        }
      });
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Send a test email
   */
  async sendTestEmail(payload: TestEmailPayload): Promise<EmailSendResult> {
    try {
      await this.apiCall<any>('email-templates-send-test.php', {
        method: 'POST',
        body: JSON.stringify({
          templateId: payload.templateId,
          language: payload.language,
          testEmail: payload.recipientEmail,
          createdBy: 'admin'
        })
      });

      return {
        success: true,
        messageId: `msg-${Date.now()}`,
        sentAt: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Send an email using a template
   */
  async sendEmail(options: EmailSendOptions): Promise<EmailSendResult> {
    try {
      await this.apiCall<any>('email-templates-send-test.php', {
        method: 'POST',
        body: JSON.stringify({
          templateId: options.templateId,
          language: options.language,
          testEmail: options.to,
          placeholders: options.data,
          createdBy: 'system'
        })
      });

      return {
        success: true,
        messageId: `msg-${Date.now()}`,
        sentAt: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get template statistics
   */
  async getStatistics(): Promise<TemplateStatistics> {
    try {
      const templates = await this.getAllTemplates();

      const stats: TemplateStatistics = {
        totalTemplates: templates.length,
        activeTemplates: templates.filter(t => t.status === EmailTemplateStatus.ACTIVE).length,
        draftTemplates: templates.filter(t => t.status === EmailTemplateStatus.DRAFT).length,
        archivedTemplates: templates.filter(t => t.status === EmailTemplateStatus.ARCHIVED).length,
        totalSent: templates.reduce((sum, t) => sum + t.usageCount, 0),
        byCategory: {} as Record<EmailTemplateCategory, number>
      };

      // Count by category
      Object.values(EmailTemplateCategory).forEach(category => {
        stats.byCategory[category] = templates.filter(t => t.category === category).length;
      });

      return stats;
    } catch (error) {
      console.error('Error getting statistics:', error);
      return {
        totalTemplates: 0,
        activeTemplates: 0,
        draftTemplates: 0,
        archivedTemplates: 0,
        totalSent: 0,
        byCategory: {}
      };
    }
  }

  /**
   * Get content for a specific language from a template
   */
  async getTemplateContent(templateId: string, language: TemplateLanguage): Promise<TemplateContent | null> {
    const template = await this.getTemplateById(templateId);
    if (!template) return null;

    return template.content.find(c => c.language === language) || null;
  }

  /**
   * Preview template with sample data
   */
  async previewTemplate(templateId: string, language: TemplateLanguage, data: Record<string, any>): Promise<{
    subject: string;
    htmlContent: string;
    textContent?: string;
  } | null> {
    const content = await this.getTemplateContent(templateId, language);
    if (!content) return null;

    return {
      subject: replacePlaceholders(content.subject, data),
      htmlContent: replacePlaceholders(content.htmlContent, data),
      textContent: content.textContent ? replacePlaceholders(content.textContent, data) : undefined
    };
  }
}

// Export singleton instance
export const emailTemplateService = new EmailTemplateService();
