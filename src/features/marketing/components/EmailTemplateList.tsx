/**
 * EmailTemplateList - Display and manage email templates
 */

import React, { useState, useEffect } from 'react';
import {
  Mail,
  Plus,
  Search,
  Filter,
  Edit2,
  Copy,
  Trash2,
  Eye,
  Send,
  MoreVertical,
  Clock,
  CheckCircle,
  Archive,
  AlertCircle
} from 'lucide-react';
import {
  EmailTemplate,
  EmailTemplateCategory,
  EmailTemplateStatus,
  TemplateLanguage,
  TemplateFilter
} from '../types/email.types';
import { emailTemplateService } from '../services/email.service';

interface EmailTemplateListProps {
  onCreateNew: () => void;
  onEdit: (template: EmailTemplate) => void;
  onPreview: (template: EmailTemplate) => void;
  onSendTest: (template: EmailTemplate) => void;
}

export const EmailTemplateList: React.FC<EmailTemplateListProps> = ({
  onCreateNew,
  onEdit,
  onPreview,
  onSendTest
}) => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EmailTemplateCategory | ''>('');
  const [selectedStatus, setSelectedStatus] = useState<EmailTemplateStatus | ''>('');
  const [selectedLanguage, setSelectedLanguage] = useState<TemplateLanguage | ''>('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, [searchQuery, selectedCategory, selectedStatus, selectedLanguage]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const filter: TemplateFilter = {
        searchQuery: searchQuery || undefined,
        category: selectedCategory || undefined,
        status: selectedStatus || undefined,
        language: selectedLanguage || undefined
      };

      const data = await emailTemplateService.getAllTemplates(filter);
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async (template: EmailTemplate) => {
    try {
      const newName = `${template.name} (Copy)`;
      await emailTemplateService.duplicateTemplate(template.id, newName, 'admin');
      await loadTemplates();
      setActiveDropdown(null);
    } catch (error) {
      console.error('Error duplicating template:', error);
      alert('Failed to duplicate template');
    }
  };

  const handleDelete = async (template: EmailTemplate) => {
    if (!confirm(`Are you sure you want to delete "${template.name}"?`)) {
      return;
    }

    try {
      await emailTemplateService.deleteTemplate(template.id);
      await loadTemplates();
      setActiveDropdown(null);
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Failed to delete template');
    }
  };

  const handleArchive = async (template: EmailTemplate) => {
    try {
      await emailTemplateService.updateTemplate(template.id, {
        status: template.status === EmailTemplateStatus.ARCHIVED 
          ? EmailTemplateStatus.DRAFT 
          : EmailTemplateStatus.ARCHIVED
      });
      await loadTemplates();
      setActiveDropdown(null);
    } catch (error) {
      console.error('Error archiving template:', error);
      alert('Failed to archive template');
    }
  };

  const getStatusColor = (status: EmailTemplateStatus) => {
    switch (status) {
      case EmailTemplateStatus.ACTIVE:
        return 'bg-green-100 text-green-800';
      case EmailTemplateStatus.DRAFT:
        return 'bg-yellow-100 text-yellow-800';
      case EmailTemplateStatus.ARCHIVED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: EmailTemplateStatus) => {
    switch (status) {
      case EmailTemplateStatus.ACTIVE:
        return <CheckCircle className="w-3 h-3" />;
      case EmailTemplateStatus.DRAFT:
        return <Clock className="w-3 h-3" />;
      case EmailTemplateStatus.ARCHIVED:
        return <Archive className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  const getCategoryColor = (category: EmailTemplateCategory) => {
    const colors: Record<EmailTemplateCategory, string> = {
      [EmailTemplateCategory.BOOKING]: 'bg-blue-100 text-blue-800',
      [EmailTemplateCategory.PAYMENT]: 'bg-green-100 text-green-800',
      [EmailTemplateCategory.REMINDER]: 'bg-orange-100 text-orange-800',
      [EmailTemplateCategory.CANCELLATION]: 'bg-red-100 text-red-800',
      [EmailTemplateCategory.WAITLIST]: 'bg-purple-100 text-purple-800',
      [EmailTemplateCategory.MARKETING]: 'bg-pink-100 text-pink-800',
      [EmailTemplateCategory.NOTIFICATION]: 'bg-indigo-100 text-indigo-800',
      [EmailTemplateCategory.CUSTOM]: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Email Templates</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage your email templates for automated communications
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Template
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as EmailTemplateCategory | '')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {Object.values(EmailTemplateCategory).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as EmailTemplateStatus | '')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            {Object.values(EmailTemplateStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          {/* Language Filter */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value as TemplateLanguage | '')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Languages</option>
            <option value="en">English</option>
            <option value="sv">Swedish</option>
          </select>
        </div>

        {/* Active Filters Summary */}
        {(searchQuery || selectedCategory || selectedStatus || selectedLanguage) && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            <span>Active filters:</span>
            {searchQuery && <span className="px-2 py-1 bg-gray-100 rounded">Search: "{searchQuery}"</span>}
            {selectedCategory && <span className="px-2 py-1 bg-gray-100 rounded">Category: {selectedCategory}</span>}
            {selectedStatus && <span className="px-2 py-1 bg-gray-100 rounded">Status: {selectedStatus}</span>}
            {selectedLanguage && <span className="px-2 py-1 bg-gray-100 rounded">Language: {selectedLanguage === 'en' ? 'English' : 'Swedish'}</span>}
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                setSelectedStatus('');
                setSelectedLanguage('');
              }}
              className="ml-2 text-blue-600 hover:text-blue-700"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading templates...</p>
        </div>
      ) : templates.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || selectedCategory || selectedStatus || selectedLanguage
              ? 'Try adjusting your filters'
              : 'Get started by creating your first email template'}
          </p>
          {!searchQuery && !selectedCategory && !selectedStatus && !selectedLanguage && (
            <button
              onClick={onCreateNew}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Template
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              {/* Card Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
                  </div>
                  <div className="relative ml-2">
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === template.id ? null : template.id)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {activeDropdown === template.id && (
                      <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        <button
                          onClick={() => {
                            onEdit(template);
                            setActiveDropdown(null);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDuplicate(template)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                          Duplicate
                        </button>
                        <button
                          onClick={() => handleArchive(template)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Archive className="w-4 h-4" />
                          {template.status === EmailTemplateStatus.ARCHIVED ? 'Unarchive' : 'Archive'}
                        </button>
                        <button
                          onClick={() => handleDelete(template)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-b-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(template.category)}`}>
                    {template.category}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(template.status)}`}>
                    {getStatusIcon(template.status)}
                    {template.status}
                  </span>
                  {template.isDefault && (
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      Default
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                {/* Languages */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Languages:</span>
                  {template.content.map((content) => (
                    <span key={content.language} className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {content.language === 'en' ? '🇬🇧 EN' : '🇸🇪 SV'}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Version: {template.version}</span>
                  <span>Sent: {template.usageCount}</span>
                </div>

                {template.lastSent && (
                  <div className="text-xs text-gray-500">
                    Last sent: {new Date(template.lastSent).toLocaleDateString()}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="p-4 border-t border-gray-200 flex items-center gap-2">
                <button
                  onClick={() => onPreview(template)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button
                  onClick={() => onSendTest(template)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Test
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Click outside to close dropdown */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </div>
  );
};
