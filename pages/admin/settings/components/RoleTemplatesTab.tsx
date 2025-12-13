import React, { useState, useEffect } from 'react';
import { Zap, AlertCircle, Check } from 'lucide-react';
import { RolePermissionService } from '../../../../src/shared/services/role-permission.service';
import { RoleTemplate } from '../../../../types';
import { TemplateSelectionModal } from './modals/TemplateSelectionModal';

interface RoleTemplatesTabProps {
  onTemplateSelected: () => void;
}

export const RoleTemplatesTab: React.FC<RoleTemplatesTabProps> = ({ onTemplateSelected }) => {
  const [templates, setTemplates] = useState<RoleTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<RoleTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data = await RolePermissionService.getRoleTemplates();
      setTemplates(data);
      setError(null);
    } catch (err) {
      setError('Failed to load role templates');
      console.error('Error loading templates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelected = () => {
    setSelectedTemplate(null);
    onTemplateSelected();
  };

  const presetTemplates = templates.filter((t) => t.category === 'preset');
  const customTemplates = templates.filter((t) => t.category === 'custom');

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="flex gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">Error</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-purple-200 rounded-lg p-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <Zap className="h-6 w-6 text-purple-600 mt-1" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Quick Setup with Templates</h3>
            <p className="text-gray-700 text-sm mb-3">
              Start with a pre-configured role template and customize it to your needs. Templates come with recommended permission sets for common roles in your organization.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Templates */}
      {presetTemplates.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Preset Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {presetTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={() => setSelectedTemplate(template)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Custom Templates */}
      {customTemplates.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Custom Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={() => setSelectedTemplate(template)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {templates.length === 0 && !error && (
        <div className="text-center py-12">
          <Zap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates available</h3>
          <p className="text-gray-600">Check back soon for role templates</p>
        </div>
      )}

      {/* Modal */}
      {selectedTemplate && (
        <TemplateSelectionModal
          isOpen={!!selectedTemplate}
          template={selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
          onSuccess={handleTemplateSelected}
        />
      )}
    </div>
  );
};

interface TemplateCardProps {
  template: RoleTemplate;
  onSelect: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onSelect }) => (
  <button
    onClick={onSelect}
    className="text-left border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-purple-300 transition-all group"
  >
    <div className="flex items-start gap-3 mb-4">
      <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center font-bold group-hover:bg-purple-600 group-hover:text-white transition-colors">
        {template.name.charAt(0)}
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-gray-900">{template.name}</h4>
        <p className="text-xs text-gray-500">{template.category}</p>
      </div>
    </div>

    <p className="text-sm text-gray-600 mb-4">{template.description}</p>

    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
      <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
        {template.permissions.length} permissions
      </span>
      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
        →
      </div>
    </div>
  </button>
);
