/**
 * Export Reports Component
 * Allows exporting analytics data to Excel and PDF formats
 */

import React, { useState } from 'react';
import { Download, FileText, Loader } from 'lucide-react';
import { AnalyticsReport, ExportFormat } from '../types/analytics.types';
import styles from './ExportReports.module.css';

interface ExportReportsProps {
  onExport: (format: 'excel' | 'pdf', options: ExportFormat) => Promise<void>;
  isExporting?: boolean;
}

export const ExportReports: React.FC<ExportReportsProps> = ({ onExport, isExporting = false }) => {
  const [selectedFormat, setSelectedFormat] = useState<'excel' | 'pdf'>('excel');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeMetrics, setIncludeMetrics] = useState(true);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'custom'>('30d');
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    try {
      setError(null);

      let finalStartDate = startDate;
      let finalEndDate = endDate;

      if (dateRange === '7d') {
        finalStartDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        finalEndDate = new Date().toISOString().split('T')[0];
      } else if (dateRange === '30d') {
        finalStartDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        finalEndDate = new Date().toISOString().split('T')[0];
      } else if (dateRange === '90d') {
        finalStartDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        finalEndDate = new Date().toISOString().split('T')[0];
      }

      const exportOptions: ExportFormat = {
        format: selectedFormat,
        includeCharts,
        includeMetrics,
        dateRange: {
          startDate: finalStartDate,
          endDate: finalEndDate,
        },
      };

      await onExport(selectedFormat, exportOptions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export report');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.icon}>
            <Download size={24} />
          </div>
          <div>
            <h3>Export Analytics Report</h3>
            <p>Download your marketing analytics data in your preferred format</p>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <label className={styles.sectionLabel}>Report Format</label>
          <div className={styles.formatGrid}>
            <div
              className={`${styles.formatCard} ${selectedFormat === 'excel' ? styles.selected : ''}`}
              onClick={() => setSelectedFormat('excel')}
            >
              <div className={styles.formatIcon}>
                <FileText size={32} />
              </div>
              <div className={styles.formatName}>Excel (.xlsx)</div>
              <div className={styles.formatDesc}>Tables and basic charts</div>
            </div>
            <div
              className={`${styles.formatCard} ${selectedFormat === 'pdf' ? styles.selected : ''}`}
              onClick={() => setSelectedFormat('pdf')}
            >
              <div className={styles.formatIcon}>
                <FileText size={32} />
              </div>
              <div className={styles.formatName}>PDF Document</div>
              <div className={styles.formatDesc}>Professional formatted report</div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <label className={styles.sectionLabel}>Date Range</label>
          <div className={styles.dateRangeButtons}>
            {(['7d', '30d', '90d', 'custom'] as const).map((range) => (
              <button
                key={range}
                className={`${styles.rangeBtn} ${dateRange === range ? styles.active : ''}`}
                onClick={() => setDateRange(range)}
              >
                {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : range === '90d' ? 'Last 90 Days' : 'Custom'}
              </button>
            ))}
          </div>

          {dateRange === 'custom' && (
            <div className={styles.customDateRange}>
              <div className={styles.dateInput}>
                <label>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className={styles.dateInput}>
                <label>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <div className={styles.section}>
          <label className={styles.sectionLabel}>Report Contents</label>
          <div className={styles.checkboxGroup}>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={includeMetrics}
                onChange={(e) => setIncludeMetrics(e.target.checked)}
              />
              <span>Include Key Metrics</span>
            </label>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={includeCharts}
                onChange={(e) => setIncludeCharts(e.target.checked)}
              />
              <span>Include Charts & Visualizations</span>
            </label>
          </div>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <button
          className={styles.exportBtn}
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <Loader size={18} className={styles.spinner} />
              Generating Report...
            </>
          ) : (
            <>
              <Download size={18} />
              Export Report
            </>
          )}
        </button>
      </div>

      <div className={styles.footer}>
        <p>Reports are generated in real-time based on your selected parameters.</p>
        <p>Large reports may take a moment to generate.</p>
      </div>
    </div>
  );
};
