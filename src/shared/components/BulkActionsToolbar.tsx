import React from 'react';
import { Button } from './ui';
import { Mail, Download, Trash2, Eye } from 'lucide-react';

export interface BulkAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  variant?: 'primary' | 'danger' | 'outline';
  onClick: () => void;
  confirm?: boolean;
  confirmMessage?: string;
}

interface BulkActionsToolbarProps {
  selectedCount: number;
  actions: BulkAction[];
  onClearSelection: () => void;
}

/**
 * Reusable bulk actions toolbar component
 * Displays selected item count and action buttons
 */
export const BulkActionsToolbar: React.FC<BulkActionsToolbarProps> = ({
  selectedCount,
  actions,
  onClearSelection,
}) => {
  if (selectedCount === 0) return null;

  const handleActionClick = (action: BulkAction) => {
    if (action.confirm && action.confirmMessage) {
      if (window.confirm(action.confirmMessage)) {
        action.onClick();
      }
    } else {
      action.onClick();
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="text-sm text-blue-800 font-medium">
        {selectedCount} item(s) selected
      </div>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <Button
            key={action.id}
            onClick={() => handleActionClick(action)}
            variant={action.variant || 'primary'}
            size="sm"
            icon={action.icon}
            className="gap-2"
          >
            {action.label}
          </Button>
        ))}
        <Button
          onClick={onClearSelection}
          variant="outline"
          size="sm"
        >
          Clear Selection
        </Button>
      </div>
    </div>
  );
};
