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
      <div className={styles['bulk-overlay']}>
        <div className={styles['bulk-dialog']}>
          <div className={styles['success-state']}>
            <div className={styles['success-icon']}>
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
    <div className={styles['bulk-overlay']}>
      <div className={styles['bulk-dialog']}>
        {/* Header */}
        <div className={styles['dialog-header']}>
          <h2>Bulk Actions</h2>
          <button className={styles['close-btn']} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles['dialog-content']}>
            {!action ? (
              <div className={styles['action-grid']}>
                <button
                  type="button"
                  className={styles['action-card']}
                  onClick={() => setAction('activate')}
                >
                  <div className={`${styles['action-icon']} ${styles.activate}`}>✓</div>
                  <div className={styles['action-name']}>Activate</div>
                  <div className={styles['action-desc']}>Enable groups</div>
                </button>

                <button
                  type="button"
                  className={styles['action-card']}
                  onClick={() => setAction('deactivate')}
                >
                  <div className={`${styles['action-icon']} ${styles.deactivate}`}>✕</div>
                  <div className={styles['action-name']}>Deactivate</div>
                  <div className={styles['action-desc']}>Disable groups</div>
                </button>

                <button
                  type="button"
                  className={styles['action-card']}
                  onClick={() => setAction('addTag')}
                >
                  <div className={`${styles['action-icon']} ${styles.addTag}`}>#</div>
                  <div className={styles['action-name']}>Add Tag</div>
                  <div className={styles['action-desc']}>Tag groups</div>
                </button>

                <button
                  type="button"
                  className={styles['action-card']}
                  onClick={() => setAction('applyDiscount')}
                >
                  <div className={`${styles['action-icon']} ${styles.discount}`}>$</div>
                  <div className={styles['action-name']}>Discount</div>
                  <div className={styles['action-desc']}>Apply discount</div>
                </button>

                <button
                  type="button"
                  className={`${styles['action-card']} ${styles.delete}`}
                  onClick={() => setAction('delete')}
                >
                  <div className={`${styles['action-icon']} ${styles.delete}`}>🗑</div>
                  <div className={styles['action-name']}>Delete</div>
                  <div className={styles['action-desc']}>Remove groups</div>
                </button>
              </div>
            ) : (
              <div className={styles['action-form']}>
                <div className={styles['form-header']}>
                  <button
                    type="button"
                    className={styles['back-btn']}
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
                  <div className={styles['form-group']}>
                    <label htmlFor="tag">Tag Name</label>
                    <input
                      type="text"
                      id="tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Enter tag name"
                      className={styles['form-input']}
                      autoFocus
                    />
                  </div>
                )}

                {action === 'applyDiscount' && (
                  <div className={styles['form-group']}>
                    <label>Discount Settings</label>
                    <div className={styles['form-row']}>
                      <div className={styles['form-col']}>
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
                          className={styles['form-input']}
                        >
                          <option value="percentage">Percentage (%)</option>
                          <option value="fixed">Fixed Amount ($)</option>
                        </select>
                      </div>
                      <div className={styles['form-col']}>
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
                          className={styles['form-input']}
                          autoFocus
                        />
                      </div>
                    </div>
                  </div>
                )}

                {action === 'delete' && (
                  <div className={styles['warning-box']}>
                    <AlertCircle size={20} />
                    <div>
                      <strong>This action cannot be undone</strong>
                      <p>
                        {groupIds.length} group(s) will be permanently deleted.
                      </p>
                    </div>
                  </div>
                )}

                {error && <div className={styles['error-message']}>{error}</div>}
              </div>
            )}
          </div>

          {/* Footer */}
          {action && (
            <div className={styles['dialog-footer']}>
              <button
                type="button"
                onClick={() => {
                  setAction(null);
                  setError(null);
                }}
                className={`${styles.btn} ${styles['btn-secondary']}`}
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
                className={`${styles.btn} ${
                  action === 'delete' ? styles['btn-danger'] : styles['btn-primary']
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
