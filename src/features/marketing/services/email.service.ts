/**
 * Email Template Service - CRUD operations and business logic
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
import { PRE_DESIGNED_TEMPLATES } from '../constants/pre-designed-templates';

class EmailTemplateService {
  private templates: Map<string, EmailTemplateWithHistory> = new Map();
  private nextId = 1;

  constructor() {
    this.initializeMockData();
  }

  /**
   * Initialize with mock data
   */
  private initializeMockData(): void {
    // Load pre-designed templates
    PRE_DESIGNED_TEMPLATES.forEach((preDesigned) => {
      const now = new Date().toISOString();
      const id = `template-${this.nextId++}`;

      const template: EmailTemplate = {
        id,
        name: preDesigned.name,
        description: preDesigned.description,
        category: preDesigned.category,
        status: EmailTemplateStatus.ACTIVE,
        content: preDesigned.content,
        version: 1,
        isDefault: true,
        tags: preDesigned.tags,
        usageCount: 0,
        createdBy: 'system',
        createdDate: now
      };

      const initialVersion: EmailTemplateVersion = {
        id: `version-${id}-1`,
        templateId: id,
        version: 1,
        content: template.content,
        changeDescription: 'Initial version',
        createdBy: 'system',
        createdDate: now
      };

      const templateWithHistory: EmailTemplateWithHistory = {
        ...template,
        versions: [initialVersion]
      };

      this.templates.set(id, templateWithHistory);
    });

    console.log(`Email Template Service initialized with ${PRE_DESIGNED_TEMPLATES.length} pre-designed templates`);
  }

  /**
   * Get all templates with optional filtering
   */
  async getAllTemplates(filter?: TemplateFilter): Promise<EmailTemplate[]> {
    let templates = Array.from(this.templates.values()).map(t => {
      const { versions, ...template } = t;
      return template;
    });

    if (filter) {
      templates = this.applyFilters(templates, filter);
    }

    return templates;
  }

  /**
   * Get a single template by ID
   */
  async getTemplateById(id: string): Promise<EmailTemplate | null> {
    const template = this.templates.get(id);
    if (!template) return null;

    const { versions, ...templateData } = template;
    return templateData;
  }

  /**
   * Get template with full version history
   */
  async getTemplateWithHistory(id: string): Promise<EmailTemplateWithHistory | null> {
    return this.templates.get(id) || null;
  }

  /**
   * Create a new template
   */
  async createTemplate(
    template: Omit<EmailTemplate, 'id' | 'version' | 'usageCount' | 'createdDate'>
  ): Promise<EmailTemplate> {
    const now = new Date().toISOString();
    const id = `template-${this.nextId++}`;

    const newTemplate: EmailTemplate = {
      ...template,
      id,
      version: 1,
      usageCount: 0,
      createdDate: now
    };

    // Validate template
    const validation = this.validateTemplate(newTemplate);
    if (!validation.isValid) {
      throw new Error(`Template validation failed: ${validation.errors[0]?.message}`);
    }

    // Create initial version
    const initialVersion: EmailTemplateVersion = {
      id: `version-${id}-1`,
      templateId: id,
      version: 1,
      content: newTemplate.content,
      changeDescription: 'Initial version',
      createdBy: newTemplate.createdBy,
      createdDate: now
    };

    const templateWithHistory: EmailTemplateWithHistory = {
      ...newTemplate,
      versions: [initialVersion]
    };

    this.templates.set(id, templateWithHistory);
    return newTemplate;
  }

  /**
   * Update an existing template
   */
  async updateTemplate(
    id: string,
    updates: Partial<EmailTemplate>,
    changeDescription?: string
  ): Promise<EmailTemplate> {
    const existing = this.templates.get(id);
    if (!existing) {
      throw new Error(`Template with ID ${id} not found`);
    }

    const now = new Date().toISOString();
    const newVersion = existing.version + 1;

    const updatedTemplate: EmailTemplate = {
      ...existing,
      ...updates,
      id, // Preserve ID
      version: newVersion,
      lastModified: now
    };

    // Validate template
    const validation = this.validateTemplate(updatedTemplate);
    if (!validation.isValid) {
      throw new Error(`Template validation failed: ${validation.errors[0]?.message}`);
    }

    // Create new version if content changed
    if (updates.content) {
      const newVersionEntry: EmailTemplateVersion = {
        id: `version-${id}-${newVersion}`,
        templateId: id,
        version: newVersion,
        content: updates.content,
        changeDescription: changeDescription || 'Template updated',
        createdBy: updates.lastModifiedBy || existing.createdBy,
        createdDate: now
      };

      existing.versions.push(newVersionEntry);
    }

    // Update template
    const templateWithHistory: EmailTemplateWithHistory = {
      ...updatedTemplate,
      versions: existing.versions
    };

    this.templates.set(id, templateWithHistory);
    return updatedTemplate;
  }

  /**
   * Delete a template
   */
  async deleteTemplate(id: string): Promise<boolean> {
    return this.templates.delete(id);
  }

  /**
   * Duplicate a template
   */
  async duplicateTemplate(id: string, newName: string, createdBy: string): Promise<EmailTemplate> {
    const existing = await this.getTemplateById(id);
    if (!existing) {
      throw new Error(`Template with ID ${id} not found`);
    }

    const duplicated = await this.createTemplate({
      name: newName,
      description: `Copy of ${existing.name}`,
      category: existing.category,
      status: EmailTemplateStatus.DRAFT,
      content: existing.content,
      isDefault: false,
      tags: existing.tags,
      createdBy
    });

    return duplicated;
  }

  /**
   * Restore a previous version
   */
  async restoreVersion(templateId: string, versionNumber: number, restoredBy: string): Promise<EmailTemplate> {
    const existing = this.templates.get(templateId);
    if (!existing) {
      throw new Error(`Template with ID ${templateId} not found`);
    }

    const version = existing.versions.find(v => v.version === versionNumber);
    if (!version) {
      throw new Error(`Version ${versionNumber} not found for template ${templateId}`);
    }

    return this.updateTemplate(
      templateId,
      {
        content: version.content,
        lastModifiedBy: restoredBy
      },
      `Restored to version ${versionNumber}`
    );
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
    const template = await this.getTemplateById(payload.templateId);
    if (!template) {
      return {
        success: false,
        error: 'Template not found'
      };
    }

    const content = template.content.find(c => c.language === payload.language);
    if (!content) {
      return {
        success: false,
        error: `Template does not have content for language: ${payload.language}`
      };
    }

    try {
      // Mock sending email (in production, this would use SendGrid)
      console.log('Sending test email:', {
        to: payload.recipientEmail,
        subject: content.subject,
        template: template.name,
        language: payload.language
      });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

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
    const template = await this.getTemplateById(options.templateId);
    if (!template) {
      return {
        success: false,
        error: 'Template not found'
      };
    }

    const content = template.content.find(c => c.language === options.language);
    if (!content) {
      return {
        success: false,
        error: `Template does not have content for language: ${options.language}`
      };
    }

    try {
      // Replace placeholders with actual data
      const subject = replacePlaceholders(content.subject, options.data);
      const htmlContent = replacePlaceholders(content.htmlContent, options.data);
      const textContent = content.textContent 
        ? replacePlaceholders(content.textContent, options.data)
        : undefined;

      // Mock sending email (in production, this would use SendGrid)
      console.log('Sending email:', {
        to: options.to,
        subject,
        template: template.name,
        language: options.language
      });

      // Update usage count
      await this.updateTemplate(template.id, {
        usageCount: template.usageCount + 1,
        lastSent: new Date().toISOString()
      });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

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
  }

  /**
   * Apply filters to templates
   */
  private applyFilters(templates: EmailTemplate[], filter: TemplateFilter): EmailTemplate[] {
    let filtered = templates;

    if (filter.category) {
      filtered = filtered.filter(t => t.category === filter.category);
    }

    if (filter.status) {
      filtered = filtered.filter(t => t.status === filter.status);
    }

    if (filter.language) {
      filtered = filtered.filter(t => 
        t.content.some(c => c.language === filter.language)
      );
    }

    if (filter.tags && filter.tags.length > 0) {
      filtered = filtered.filter(t =>
        t.tags?.some(tag => filter.tags?.includes(tag))
      );
    }

    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
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
