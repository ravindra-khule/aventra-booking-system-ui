import React, { useState } from 'react';
import { X, AlertCircle, Check } from 'lucide-react';
import { CustomerGroupService } from '../../services/group.service';
import styles from '../styles/BulkActions.module.css';

interface BulkActionsDialogProps {
  groupIds: string[];
  onClose: () => void;
}

export const BulkActionsDialog: React.FC<BulkActionsDialogProps> = ({
  groupIds,
  onClose,
}) => {
  const [action, setAction] = useState<
    'activate' | 'deactivate' | 'delete' | 'addTag' | 'applyDiscount' | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [discountData, setDiscountData] = useState({
    type: 'percentage' as 'percentage' | 'fixed',
    value: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!action) return;

    setError(null);
    setLoading(true);

    try {
      const payload: any = {};

      if (action === 'addTag' && tagInput) {
        payload.tag = tagInput;
      } else if (action === 'applyDiscount') {
        payload.discountType = discountData.type;
        payload.discountValue = discountData.value;
      }

      await CustomerGroupService.bulkAction({
        groupIds,
        action,
        payload: Object.keys(payload).length > 0 ? payload : undefined,
      });

      setCompleted(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed');
      setLoading(false);
    }
  };

  if (completed) {
    return (
      <div className="bulk-overlay">
        <div className="bulk-dialog">
          <div className="success-state">
            <div className="success-icon">
              <Check size={32} />
            </div>
            <h3>Success!</h3>
            <p>Action completed for {groupIds.length} group(s)</p>
          </div>
        </div>
      </div>
    );
  }

  const getActionDescription = () => {
    switch (action) {
      case 'activate':
        return `Activate ${groupIds.length} group(s)`;
      case 'deactivate':
        return `Deactivate ${groupIds.length} group(s)`;
      case 'delete':
        return `Delete ${groupIds.length} group(s) permanently`;
      case 'addTag':
        return `Add tag "${tagInput}" to ${groupIds.length} group(s)`;
      case 'applyDiscount':
        return `Apply ${discountData.type === 'percentage' ? `${discountData.value}%` : `$${discountData.value}`} discount to ${groupIds.length} group(s)`;
      default:
        return null;
    }
  };

  return (
    <div className="bulk-overlay">
      <div className="bulk-dialog">
        {/* Header */}
        <div className="dialog-header">
          <h2>Bulk Actions</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="dialog-content">
            {!action ? (
              <div className="action-grid">
                <button
                  type="button"
                  className="action-card"
                  onClick={() => setAction('activate')}
                >
                  <div className="action-icon activate">✓</div>
                  <div className="action-name">Activate</div>
                  <div className="action-desc">Enable groups</div>
                </button>

                <button
                  type="button"
                  className="action-card"
                  onClick={() => setAction('deactivate')}
                >
                  <div className="action-icon deactivate">✕</div>
                  <div className="action-name">Deactivate</div>
                  <div className="action-desc">Disable groups</div>
                </button>

                <button
                  type="button"
                  className="action-card"
                  onClick={() => setAction('addTag')}
                >
                  <div className="action-icon addTag">#</div>
                  <div className="action-name">Add Tag</div>
                  <div className="action-desc">Tag groups</div>
                </button>

                <button
                  type="button"
                  className="action-card"
                  onClick={() => setAction('applyDiscount')}
                >
                  <div className="action-icon discount">$</div>
                  <div className="action-name">Discount</div>
                  <div className="action-desc">Apply discount</div>
                </button>

                <button
                  type="button"
                  className="action-card delete"
                  onClick={() => setAction('delete')}
                >
                  <div className="action-icon delete">🗑</div>
                  <div className="action-name">Delete</div>
                  <div className="action-desc">Remove groups</div>
                </button>
              </div>
            ) : (
              <div className="action-form">
                <div className="form-header">
                  <button
                    type="button"
                    className="back-btn"
                    onClick={() => {
                      setAction(null);
                      setError(null);
                    }}
                  >
                    ← Back
                  </button>
                  <h3>{getActionDescription()}</h3>
                </div>

                {action === 'addTag' && (
                  <div className="form-group">
                    <label htmlFor="tag">Tag Name</label>
                    <input
                      type="text"
                      id="tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Enter tag name"
                      className="form-input"
                      autoFocus
                    />
                  </div>
                )}

                {action === 'applyDiscount' && (
                  <div className="form-group">
                    <label>Discount Settings</label>
                    <div className="form-row">
                      <div className="form-col">
                        <label htmlFor="discountType">Type</label>
                        <select
                          id="discountType"
                          value={discountData.type}
                          onChange={(e) =>
                            setDiscountData((prev) => ({
                              ...prev,
                              type: e.target.value as 'percentage' | 'fixed',
                            }))
                          }
                          className="form-input"
                        >
                          <option value="percentage">Percentage (%)</option>
                          <option value="fixed">Fixed Amount ($)</option>
                        </select>
                      </div>
                      <div className="form-col">
                        <label htmlFor="discountValue">Value</label>
                        <input
                          type="number"
                          id="discountValue"
                          value={discountData.value}
                          onChange={(e) =>
                            setDiscountData((prev) => ({
                              ...prev,
                              value: parseFloat(e.target.value) || 0,
                            }))
                          }
                          placeholder="0"
                          min="0"
                          className="form-input"
                          autoFocus
                        />
                      </div>
                    </div>
                  </div>
                )}

                {action === 'delete' && (
                  <div className="warning-box">
                    <AlertCircle size={20} />
                    <div>
                      <strong>This action cannot be undone</strong>
                      <p>
                        {groupIds.length} group(s) will be permanently deleted.
                      </p>
                    </div>
                  </div>
                )}

                {error && <div className="error-message">{error}</div>}
              </div>
            )}
          </div>

          {/* Footer */}
          {action && (
            <div className="dialog-footer">
              <button
                type="button"
                onClick={() => {
                  setAction(null);
                  setError(null);
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  loading ||
                  (action === 'addTag' && !tagInput) ||
                  (action === 'applyDiscount' && discountData.value <= 0)
                }
                className={`btn btn-${
                  action === 'delete' ? 'danger' : 'primary'
                }`}
              >
                {loading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
