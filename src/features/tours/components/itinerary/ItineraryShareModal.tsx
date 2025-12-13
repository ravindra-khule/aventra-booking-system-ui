/**
 * Itinerary Share Modal - Share itineraries with customers
 */

import React, { useState } from 'react';
import { Button } from '../../../../shared/components/ui';
import { X, Plus, Copy, CheckCircle } from 'lucide-react';
import styles from './ItineraryShareModal.module.css';

interface ItineraryShareModalProps {
  itineraryTitle: string;
  onShare: (emails: string[], options: any) => void;
  onClose: () => void;
}

export const ItineraryShareModal: React.FC<ItineraryShareModalProps> = ({
  itineraryTitle,
  onShare,
  onClose
}) => {
  const [emails, setEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState('');
  const [shareOptions, setShareOptions] = useState({
    allowDownload: true,
    allowPrint: true,
    publicShare: false,
    expiresAt: ''
  });
  const [copied, setCopied] = useState(false);

  const addEmail = () => {
    if (emailInput.trim() && emailInput.includes('@')) {
      setEmails([...emails, emailInput.trim()]);
      setEmailInput('');
    }
  };

  const removeEmail = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  const handleShare = () => {
    if (emails.length === 0 && !shareOptions.publicShare) {
      alert('Please add at least one email or enable public sharing');
      return;
    }
    onShare(emails, shareOptions);
  };

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/itinerary-share/${Math.random().toString(36).substr(2, 9)}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Share Itinerary</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className={styles.content}>
          <p className={styles.subtitle}>Share "{itineraryTitle}" with customers</p>

          {/* Share Options */}
          <div className={styles.section}>
            <h3>Share Options</h3>
            <div className={styles.checkboxes}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={shareOptions.publicShare}
                  onChange={(e) => setShareOptions(prev => ({ ...prev, publicShare: e.target.checked }))}
                />
                <span>Enable public sharing (generate link)</span>
              </label>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={shareOptions.allowDownload}
                  onChange={(e) => setShareOptions(prev => ({ ...prev, allowDownload: e.target.checked }))}
                />
                <span>Allow customers to download PDF</span>
              </label>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={shareOptions.allowPrint}
                  onChange={(e) => setShareOptions(prev => ({ ...prev, allowPrint: e.target.checked }))}
                />
                <span>Allow customers to print</span>
              </label>
            </div>

            {shareOptions.publicShare && (
              <div className={styles.formGroup}>
                <label>Expires (optional)</label>
                <input
                  type="date"
                  value={shareOptions.expiresAt}
                  onChange={(e) => setShareOptions(prev => ({ ...prev, expiresAt: e.target.value }))}
                  className={styles.input}
                />
              </div>
            )}
          </div>

          {/* Share Link */}
          {shareOptions.publicShare && (
            <div className={styles.section}>
              <h3>Shareable Link</h3>
              <div className={styles.linkDisplay}>
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/itinerary-share/${Math.random().toString(36).substr(2, 9)}`}
                  className={styles.linkInput}
                />
                <button
                  onClick={handleCopyLink}
                  className={`${styles.copyBtn} ${copied ? styles.copied : ''}`}
                >
                  {copied ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <p className={styles.hint}>
                Share this link with customers via email or messaging
              </p>
            </div>
          )}

          {/* Email Sharing */}
          <div className={styles.section}>
            <h3>Send to Customers</h3>
            <div className={styles.emailInput}>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addEmail()}
                className={styles.input}
                placeholder="Enter customer email"
              />
              <button onClick={addEmail} className={styles.addBtn}>
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {emails.length === 0 ? (
              <p className={styles.empty}>No emails added yet</p>
            ) : (
              <div className={styles.emailList}>
                {emails.map((email, index) => (
                  <div key={index} className={styles.emailTag}>
                    {email}
                    <button onClick={() => removeEmail(index)}>×</button>
                  </div>
                ))}
              </div>
            )}

            <p className={styles.hint}>
              Add emails to send itinerary directly to customers
            </p>
          </div>
        </div>

        <div className={styles.footer}>
          <Button onClick={onClose} variant="ghost">
            Cancel
          </Button>
          <Button onClick={handleShare} variant="primary">
            Share Itinerary
          </Button>
        </div>
      </div>
    </div>
  );
};
