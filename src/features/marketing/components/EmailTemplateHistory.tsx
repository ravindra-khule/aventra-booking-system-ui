/**
 * EmailTemplateHistory - View and restore previous versions
 */

import React, { useState, useEffect } from 'react';
import { X, Clock, RotateCcw, User, CheckCircle } from 'lucide-react';
import { EmailTemplateWithHistory, EmailTemplateVersion } from '../types/email.types';
import { emailTemplateService } from '../services/email.service';

interface EmailTemplateHistoryProps {
  templateId: string;
  onClose: () => void;
  onRestore: () => void;
}

export const EmailTemplateHistory: React.FC<EmailTemplateHistoryProps> = ({
  templateId,
  onClose,
  onRestore
}) => {
  const [template, setTemplate] = useState<EmailTemplateWithHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState<number | null>(null);

  useEffect(() => {
    loadHistory();
  }, [templateId]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await emailTemplateService.getTemplateWithHistory(templateId);
      setTemplate(data);
    } catch (error) {
      console.error('Error loading template history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (versionNumber: number) => {
    if (!template) return;

    const confirmed = confirm(
      `Are you sure you want to restore version ${versionNumber}? This will create a new version with the content from version ${versionNumber}.`
    );

    if (!confirmed) return;

    setRestoring(versionNumber);
    try {
      await emailTemplateService.restoreVersion(templateId, versionNumber, 'admin');
      alert(`Successfully restored to version ${versionNumber}`);
      onRestore();
      onClose();
    } catch (error) {
      console.error('Error restoring version:', error);
      alert('Failed to restore version');
    } finally {
      setRestoring(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Version History</h2>
              <p className="text-sm text-gray-600 mt-1">
                {template?.name || 'Loading...'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Loading version history...</p>
              </div>
            </div>
          ) : !template ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-600">Template not found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Current Version Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-900 font-semibold mb-2">
                  <CheckCircle className="w-5 h-5" />
                  Current Version: {template.version}
                </div>
                <p className="text-sm text-blue-800">
                  You are viewing the version history for this template. You can restore any
                  previous version, which will create a new version with the old content.
                </p>
              </div>

              {/* Version List */}
              <div className="space-y-3">
                {template.versions
                  .sort((a, b) => b.version - a.version)
                  .map((version) => (
                    <div
                      key={version.id}
                      className={`border rounded-lg p-4 transition-all ${
                        version.version === template.version
                          ? 'border-blue-300 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                                version.version === template.version
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-200 text-gray-700'
                              }`}
                            >
                              Version {version.version}
                              {version.version === template.version && ' (Current)'}
                            </span>
                          </div>

                          <div className="space-y-2 text-sm">
                            {version.changeDescription && (
                              <div className="text-gray-700">
                                <span className="font-medium">Changes:</span>{' '}
                                {version.changeDescription}
                              </div>
                            )}

                            <div className="flex items-center gap-4 text-gray-600">
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                <span>{version.createdBy}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{formatDate(version.createdDate)}</span>
                              </div>
                            </div>

                            <div className="text-gray-600">
                              <span className="font-medium">Languages:</span>{' '}
                              {version.content.map((c) => (
                                <span key={c.language} className="ml-1">
                                  {c.language === 'en' ? '🇬🇧' : '🇸🇪'}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {version.version !== template.version && (
                          <button
                            onClick={() => handleRestore(version.version)}
                            disabled={restoring !== null}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {restoring === version.version ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                Restoring...
                              </>
                            ) : (
                              <>
                                <RotateCcw className="w-4 h-4" />
                                Restore
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Version Content Preview */}
                      <details className="mt-3">
                        <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                          View content
                        </summary>
                        <div className="mt-2 space-y-2">
                          {version.content.map((content) => (
                            <div
                              key={content.language}
                              className="p-3 bg-white border border-gray-200 rounded text-xs"
                            >
                              <div className="font-semibold text-gray-900 mb-1">
                                {content.language === 'en' ? '🇬🇧 English' : '🇸🇪 Swedish'}
                              </div>
                              <div className="mb-2">
                                <span className="font-medium text-gray-700">Subject:</span>{' '}
                                <span className="text-gray-600">{content.subject}</span>
                              </div>
                              <div className="max-h-32 overflow-y-auto">
                                <span className="font-medium text-gray-700">Content:</span>
                                <div
                                  className="mt-1 text-gray-600 prose prose-sm max-w-none"
                                  dangerouslySetInnerHTML={{
                                    __html: content.htmlContent.substring(0, 300) + '...'
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>
                  ))}
              </div>

              {template.versions.length === 0 && (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No version history available</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <p className="text-xs text-gray-600 text-center">
            Restoring a version creates a new version with the old content. The current version is
            preserved in history.
          </p>
        </div>
      </div>
    </div>
  );
};
