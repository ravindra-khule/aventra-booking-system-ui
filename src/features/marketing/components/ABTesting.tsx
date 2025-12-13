/**
 * A/B Testing Component
 * Create and manage A/B tests for campaigns
 */

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, TrendingUp, Check, X as IconX } from 'lucide-react';
import { ABTestConfig, ABTestVariant, ABTestStatus, Campaign } from '../types/campaign.types';
import { CampaignAnalyticsService } from '../services/campaign.service';
import styles from './ABTesting.module.css';

interface ABTestingProps {
  campaign: Campaign;
  onTestUpdate: (config: ABTestConfig) => Promise<void>;
  isLoading?: boolean;
}

export const ABTesting: React.FC<ABTestingProps> = ({
  campaign,
  onTestUpdate,
  isLoading = false,
}) => {
  const [testConfig, setTestConfig] = useState<ABTestConfig | null>(campaign.abTestConfig || null);
  const [variants, setVariants] = useState<ABTestVariant[]>(campaign.abTestConfig?.variants || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    testName: testConfig?.testName || 'A/B Test',
    testDuration: testConfig?.testDuration || 24,
  });

  useEffect(() => {
    if (campaign.hasABTest && campaign.id) {
      loadTestResults();
    }
  }, [campaign.id]);

  const loadTestResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await CampaignAnalyticsService.getABTestResults(campaign.id);
      setTestConfig(results);
      setVariants(results.variants);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load A/B test results');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVariant = () => {
    const newVariant: ABTestVariant = {
      id: `variant-${Date.now()}`,
      name: `Variant ${variants.length + 1}`,
      isControl: variants.length === 0,
      percentage: Math.floor(100 / (variants.length + 1)),
      metrics: {
        sent: 0,
        delivered: 0,
        clicked: 0,
        converted: 0,
        conversionRate: 0,
        bounceRate: 0,
      },
    };
    setVariants([...variants, newVariant]);
  };

  const handleRemoveVariant = (id: string) => {
    const updated = variants.filter(v => v.id !== id);
    // Rebalance percentages
    const newPercentage = Math.floor(100 / Math.max(updated.length, 1));
    const rebalanced = updated.map(v => ({ ...v, percentage: newPercentage }));
    setVariants(rebalanced);
  };

  const handleVariantChange = (id: string, field: string, value: any) => {
    setVariants(variants.map(v => (v.id === id ? { ...v, [field]: value } : v)));
  };

  const validateTest = (): boolean => {
    if (variants.length < 2) {
      setError('At least 2 variants are required for A/B testing');
      return false;
    }

    const totalPercentage = variants.reduce((sum, v) => sum + v.percentage, 0);
    if (totalPercentage !== 100) {
      setError('Variant percentages must add up to 100%');
      return false;
    }

    if (formData.testDuration < 1) {
      setError('Test duration must be at least 1 hour');
      return false;
    }

    return true;
  };

  const handleCreateTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateTest()) {
      return;
    }

    try {
      const newConfig: ABTestConfig = {
        id: `test-${Date.now()}`,
        testName: formData.testName,
        status: ABTestStatus.ACTIVE,
        variants,
        testDuration: formData.testDuration,
        startedAt: new Date(),
      };

      await onTestUpdate(newConfig);
      setTestConfig(newConfig);
      setShowForm(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create A/B test');
    }
  };

  const handleApplyWinner = async (variantId: string) => {
    if (!window.confirm('Apply this variant to the entire campaign?')) {
      return;
    }

    try {
      await CampaignAnalyticsService.applyABTestWinner(campaign.id, variantId);
      // Reload test results
      await loadTestResults();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to apply variant');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading A/B test data...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>A/B Testing</h3>
        {testConfig?.status === ABTestStatus.COMPLETED && testConfig.winner && (
          <div className={styles.winnerBadge}>
            <TrendingUp className={styles.icon} />
            Winner: {testConfig.winner.improvement.toFixed(1)}% improvement
          </div>
        )}
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {testConfig && testConfig.status !== ABTestStatus.COMPLETED ? (
        <div className={styles.activeTest}>
          <div className={styles.testInfo}>
            <h4>{testConfig.testName}</h4>
            <p>Status: <span className={styles[testConfig.status.toLowerCase()]}>
              {testConfig.status}
            </span></p>
            <p>Duration: {testConfig.testDuration} hours</p>
            {testConfig.startedAt && (
              <p>Started: {new Date(testConfig.startedAt).toLocaleString()}</p>
            )}
          </div>

          <div className={styles.variantsGrid}>
            {testConfig.variants.map(variant => {
              const winRate = variant.metrics?.conversionRate || 0;
              const isWinner = testConfig.winner?.variantId === variant.id;

              return (
                <div key={variant.id} className={`${styles.variantCard} ${isWinner ? styles.winner : ''}`}>
                  <div className={styles.variantHeader}>
                    <h5>{variant.name}</h5>
                    {variant.isControl && <span className={styles.control}>Control</span>}
                    {isWinner && <span className={styles.winnerLabel}>Winner</span>}
                  </div>

                  <div className={styles.metrics}>
                    <div className={styles.metric}>
                      <span>Distribution</span>
                      <p>{variant.percentage}%</p>
                    </div>
                    <div className={styles.metric}>
                      <span>Sent</span>
                      <p>{variant.metrics?.sent.toLocaleString() || 0}</p>
                    </div>
                    <div className={styles.metric}>
                      <span>Conversion Rate</span>
                      <p>{winRate.toFixed(2)}%</p>
                    </div>
                  </div>

                  {testConfig.status === ABTestStatus.COMPLETED && !isWinner && (
                    <button
                      className={styles.applyBtn}
                      onClick={() => handleApplyWinner(variant.id)}
                    >
                      Apply This Variant
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : testConfig && testConfig.status === ABTestStatus.COMPLETED ? (
        <div className={styles.completedTest}>
          <div className={styles.resultsSummary}>
            <h4>Test Results</h4>
            <p className={styles.testName}>{testConfig.testName}</p>

            {testConfig.winner ? (
              <div className={styles.winnerInfo}>
                <Check className={styles.checkIcon} />
                <div>
                  <p className={styles.winnerName}>
                    {testConfig.variants.find(v => v.id === testConfig.winner?.variantId)?.name}
                  </p>
                  <p className={styles.improvement}>
                    {testConfig.winner.improvement.toFixed(1)}% improvement in conversion rate
                  </p>
                  {testConfig.confidence && (
                    <p className={styles.confidence}>
                      Confidence: {testConfig.confidence.toFixed(0)}%
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className={styles.inconclusive}>
                <IconX className={styles.xIcon} />
                <p>Test results are inconclusive. No clear winner found.</p>
              </div>
            )}
          </div>

          <div className={styles.variantsGrid}>
            {testConfig.variants.map(variant => (
              <div
                key={variant.id}
                className={`${styles.variantCard} ${
                  testConfig.winner?.variantId === variant.id ? styles.winner : ''
                }`}
              >
                <div className={styles.variantHeader}>
                  <h5>{variant.name}</h5>
                  {variant.isControl && <span className={styles.control}>Control</span>}
                  {testConfig.winner?.variantId === variant.id && (
                    <span className={styles.winnerLabel}>Winner</span>
                  )}
                </div>

                <div className={styles.metrics}>
                  <div className={styles.metric}>
                    <span>Sent</span>
                    <p>{variant.metrics?.sent.toLocaleString()}</p>
                  </div>
                  <div className={styles.metric}>
                    <span>Delivered</span>
                    <p>{variant.metrics?.delivered.toLocaleString()}</p>
                  </div>
                  <div className={styles.metric}>
                    <span>Clicked</span>
                    <p>{variant.metrics?.clicked.toLocaleString()}</p>
                  </div>
                  <div className={styles.metric}>
                    <span>Converted</span>
                    <p>{variant.metrics?.converted.toLocaleString()}</p>
                  </div>
                  <div className={styles.metric}>
                    <span>Conversion Rate</span>
                    <p>{variant.metrics?.conversionRate.toFixed(2)}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.noTest}>
          <p>No A/B test configured for this campaign</p>
          {!showForm ? (
            <button className={styles.createBtn} onClick={() => setShowForm(true)}>
              <Plus className={styles.icon} />
              Create A/B Test
            </button>
          ) : (
            <form onSubmit={handleCreateTest} className={styles.testForm}>
              <div className={styles.formGroup}>
                <label>Test Name</label>
                <input
                  type="text"
                  value={formData.testName}
                  onChange={e => setFormData({ ...formData, testName: e.target.value })}
                  placeholder="e.g., Subject Line Test"
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Test Duration (hours)</label>
                <input
                  type="number"
                  min="1"
                  value={formData.testDuration}
                  onChange={e => setFormData({ ...formData, testDuration: parseInt(e.target.value) })}
                  className={styles.input}
                />
              </div>

              <div className={styles.variantsSection}>
                <h4>Test Variants</h4>
                <div className={styles.variantsList}>
                  {variants.map(variant => (
                    <div key={variant.id} className={styles.variantForm}>
                      <input
                        type="text"
                        value={variant.name}
                        onChange={e => handleVariantChange(variant.id, 'name', e.target.value)}
                        placeholder="Variant name"
                        className={styles.input}
                      />
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={variant.percentage}
                        onChange={e => handleVariantChange(variant.id, 'percentage', parseInt(e.target.value))}
                        placeholder="Traffic %"
                        className={styles.input}
                      />
                      <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={() => handleRemoveVariant(variant.id)}
                        disabled={variants.length <= 2}
                      >
                        <Trash2 className={styles.icon} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className={styles.addVariantBtn}
                  onClick={handleAddVariant}
                >
                  <Plus className={styles.icon} />
                  Add Variant
                </button>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Test'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
