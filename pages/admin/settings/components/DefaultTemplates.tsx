import React, { useState } from 'react';
import { EmailTemplate } from '../types/emailSettings';
import { EditTemplateModal } from './EditTemplateModal';

interface DefaultTemplatesProps {
  templates: EmailTemplate[];
  onEditTemplate: (template: EmailTemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
}

export const DefaultTemplates: React.FC<DefaultTemplatesProps> = ({
  templates,
  onEditTemplate,
  onDeleteTemplate,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleSave = (template: EmailTemplate) => {
    onEditTemplate(template);
    setIsModalOpen(false);
    setSelectedTemplate(null);
  };

  const handleDelete = (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      onDeleteTemplate(templateId);
    }
  };

  // Sample templates for demo
  const sampleTemplates: EmailTemplate[] = [
    {
      id: '1',
      name: 'Booking Confirmation',
      subject: 'Your Booking is Confirmed - {{BOOKING_ID}}',
      body: 'Dear {{CUSTOMER_NAME}},\n\nYour booking has been confirmed.',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Payment Receipt',
      subject: 'Payment Receipt - {{INVOICE_NUMBER}}',
      body: 'Dear {{CUSTOMER_NAME}},\n\nThank you for your payment.',
      createdAt: '2024-01-20',
      updatedAt: '2024-01-20',
    },
    {
      id: '3',
      name: 'Cancellation Notice',
      subject: 'Booking Cancelled - {{BOOKING_ID}}',
      body: 'Dear {{CUSTOMER_NAME}},\n\nYour booking has been cancelled.',
      createdAt: '2024-02-01',
      updatedAt: '2024-02-01',
    },
  ];

  const displayTemplates = templates.length > 0 ? templates : sampleTemplates;

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Default Email Templates</h3>

        {displayTemplates.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600">No email templates configured yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayTemplates.map((template) => (
              <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{template.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">Subject: {template.subject}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Last updated: {new Date(template.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(template)}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 text-sm font-medium transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(template.id)}
                      className="px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 text-sm font-medium transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button className="mt-6 w-full px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 transition font-medium">
          + Add New Template
        </button>
      </div>

      {selectedTemplate && (
        <EditTemplateModal
          isOpen={isModalOpen}
          template={selectedTemplate}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTemplate(null);
          }}
          onSave={handleSave}
        />
      )}
    </>
  );
};
