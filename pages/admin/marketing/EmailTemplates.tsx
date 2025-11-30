/**
 * EmailTemplates Page - Manage email templates for automated communications
 */

import React, { useState } from 'react';
import { EmailTemplate } from '../../../src/features/marketing/types/email.types';
import { EmailTemplateList } from '../../../src/features/marketing/components/EmailTemplateList';
import { EmailTemplateForm } from '../../../src/features/marketing/components/EmailTemplateForm';
import { EmailPreview } from '../../../src/features/marketing/components/EmailPreview';
import { SendTestEmail } from '../../../src/features/marketing/components/SendTestEmail';
import { EmailTemplateHistory } from '../../../src/features/marketing/components/EmailTemplateHistory';

type ModalType = 'create' | 'edit' | 'preview' | 'test' | 'history' | null;

export const EmailTemplates: React.FC = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreateNew = () => {
    setSelectedTemplate(null);
    setActiveModal('create');
  };

  const handleEdit = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setActiveModal('edit');
  };

  const handlePreview = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setActiveModal('preview');
  };

  const handleSendTest = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setActiveModal('test');
  };

  const handleViewHistory = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setActiveModal('history');
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedTemplate(null);
  };

  const handleSaveTemplate = () => {
    // Trigger refresh of template list
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="p-6">
      <EmailTemplateList
        key={refreshKey}
        onCreateNew={handleCreateNew}
        onEdit={handleEdit}
        onPreview={handlePreview}
        onSendTest={handleSendTest}
      />

      {/* Create/Edit Modal */}
      {(activeModal === 'create' || activeModal === 'edit') && (
        <EmailTemplateForm
          template={activeModal === 'edit' ? selectedTemplate || undefined : undefined}
          onClose={handleCloseModal}
          onSave={handleSaveTemplate}
        />
      )}

      {/* Preview Modal */}
      {activeModal === 'preview' && selectedTemplate && (
        <EmailPreview
          template={selectedTemplate}
          onClose={handleCloseModal}
        />
      )}

      {/* Test Email Modal */}
      {activeModal === 'test' && selectedTemplate && (
        <SendTestEmail
          template={selectedTemplate}
          onClose={handleCloseModal}
        />
      )}

      {/* Version History Modal */}
      {activeModal === 'history' && selectedTemplate && (
        <EmailTemplateHistory
          templateId={selectedTemplate.id}
          onClose={handleCloseModal}
          onRestore={handleSaveTemplate}
        />
      )}
    </div>
  );
};
