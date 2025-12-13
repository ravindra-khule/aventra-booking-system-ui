import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown } from 'lucide-react';
import { SmartGroupRule } from '../../types/group.types';
import styles from '../styles/SmartGroupBuilder.module.css';

interface SmartGroupBuilderProps {
  rules: SmartGroupRule[];
  onChange: (rules: SmartGroupRule[]) => void;
}

export const SmartGroupBuilder: React.FC<SmartGroupBuilderProps> = ({
  rules,
  onChange,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const templates = [
    {
      id: 'vip',
      name: 'VIP Customers',
      description: 'High-value customers (spent > $5000)',
      rules: [
        {
          id: 'r1',
          field: 'totalSpent' as const,
          operator: 'gte' as const,
          value: 5000,
        },
      ],
    },
    {
      id: 'frequent',
      name: 'Frequent Travelers',
      description: 'Customers with 5+ bookings',
      rules: [
        {
          id: 'r1',
          field: 'totalBookings' as const,
          operator: 'gte' as const,
          value: 5,
        },
      ],
    },
    {
      id: 'recent',
      name: 'Recent Bookers',
      description: 'Active in the last 30 days',
      rules: [
        {
          id: 'r1',
          field: 'lastBookingDate' as const,
          operator: 'gte' as const,
          value: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        },
      ],
    },
    {
      id: 'inactive',
      name: 'Inactive Customers',
      description: 'No bookings in last 6 months',
      rules: [
        {
          id: 'r1',
          field: 'lastBookingDate' as const,
          operator: 'lt' as const,
          value: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        },
      ],
    },
  ];

  const applyTemplate = (template: (typeof templates)[0]) => {
    onChange(template.rules);
    setSelectedTemplate(template.id);
  };

  const addRule = () => {
    const newRule: SmartGroupRule = {
      id: `r-${Date.now()}`,
      field: 'totalBookings',
      operator: 'gte',
      value: 0,
    };
    onChange([...rules, newRule]);
  };

  const updateRule = (id: string, updates: Partial<SmartGroupRule>) => {
    onChange(
      rules.map((rule) =>
        rule.id === id ? { ...rule, ...updates } : rule
      )
    );
  };

  const removeRule = (id: string) => {
    onChange(rules.filter((rule) => rule.id !== id));
  };

  const fieldOptions = [
    { value: 'totalBookings', label: 'Total Bookings' },
    { value: 'totalSpent', label: 'Total Spent' },
    { value: 'lastBookingDate', label: 'Last Booking Date' },
    { value: 'registrationDate', label: 'Registration Date' },
    { value: 'country', label: 'Country' },
    { value: 'tags', label: 'Tags' },
  ];

  const operatorOptions = [
    { value: 'equals', label: 'Equals' },
    { value: 'gt', label: 'Greater Than' },
    { value: 'gte', label: 'Greater Than or Equal' },
    { value: 'lt', label: 'Less Than' },
    { value: 'lte', label: 'Less Than or Equal' },
    { value: 'between', label: 'Between' },
    { value: 'contains', label: 'Contains' },
    { value: 'in', label: 'In List' },
  ];

  return (
    <div className="smart-group-builder">
      {/* Templates */}
      <div className="templates-section">
        <h3>Quick Templates</h3>
        <div className="templates-grid">
          {templates.map((template) => (
            <button
              key={template.id}
              className={`template-card ${
                selectedTemplate === template.id ? 'selected' : ''
              }`}
              onClick={() => applyTemplate(template)}
            >
              <div className="template-name">{template.name}</div>
              <div className="template-desc">{template.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Rules Section */}
      <div className="rules-section">
        <div className="section-header">
          <h3>Custom Rules</h3>
          <button className="btn btn-secondary btn-sm" onClick={addRule}>
            <Plus size={16} />
            Add Rule
          </button>
        </div>

        {rules.length === 0 ? (
          <div className="no-rules">
            <p>No rules configured. Create a rule or select a template above.</p>
          </div>
        ) : (
          <div className="rules-list">
            {rules.map((rule, index) => (
              <div key={rule.id} className="rule-row">
                {index > 0 && (
                  <div className="logic-operator">
                    <select
                      value={rule.logicOperator || 'AND'}
                      onChange={(e) =>
                        updateRule(rule.id, {
                          logicOperator: e.target.value as 'AND' | 'OR',
                        })
                      }
                      className="operator-select"
                    >
                      <option value="AND">AND</option>
                      <option value="OR">OR</option>
                    </select>
                  </div>
                )}

                <div className="rule-inputs">
                  <select
                    value={rule.field}
                    onChange={(e) =>
                      updateRule(rule.id, {
                        field: e.target.value as any,
                      })
                    }
                    className="field-select"
                  >
                    {fieldOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={rule.operator}
                    onChange={(e) =>
                      updateRule(rule.id, {
                        operator: e.target.value as any,
                      })
                    }
                    className="operator-select"
                  >
                    {operatorOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  {rule.operator === 'between' ? (
                    <div className="range-inputs">
                      <input
                        type="number"
                        placeholder="Min"
                        defaultValue={
                          typeof rule.value === 'object' && 'min' in rule.value
                            ? rule.value.min
                            : 0
                        }
                        onChange={(e) =>
                          updateRule(rule.id, {
                            value: {
                              min: parseInt(e.target.value) || 0,
                              max: (rule.value as any).max || 0,
                            },
                          })
                        }
                        className="form-input"
                      />
                      <span className="range-separator">to</span>
                      <input
                        type="number"
                        placeholder="Max"
                        defaultValue={
                          typeof rule.value === 'object' && 'max' in rule.value
                            ? rule.value.max
                            : 0
                        }
                        onChange={(e) =>
                          updateRule(rule.id, {
                            value: {
                              min: (rule.value as any).min || 0,
                              max: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                        className="form-input"
                      />
                    </div>
                  ) : (
                    <input
                      type={
                        rule.field === 'totalBookings' ||
                        rule.field === 'totalSpent'
                          ? 'number'
                          : 'text'
                      }
                      placeholder={`Enter ${
                        fieldOptions.find((f) => f.value === rule.field)?.label
                      } value`}
                      value={
                        typeof rule.value === 'string' ||
                        typeof rule.value === 'number'
                          ? rule.value
                          : ''
                      }
                      onChange={(e) =>
                        updateRule(rule.id, {
                          value:
                            rule.field === 'totalBookings' ||
                            rule.field === 'totalSpent'
                              ? parseInt(e.target.value) || 0
                              : e.target.value,
                        })
                      }
                      className="form-input"
                    />
                  )}
                </div>

                <button
                  type="button"
                  className="delete-rule-btn"
                  onClick={() => removeRule(rule.id)}
                  title="Delete rule"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="builder-info">
        <p>
          <strong>How it works:</strong> Create rules to automatically segment
          customers. Each rule is evaluated against customer data, and multiple
          rules can be combined with AND/OR logic.
        </p>
      </div>
    </div>
  );
};
