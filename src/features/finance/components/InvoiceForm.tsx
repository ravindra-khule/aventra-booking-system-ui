/**
 * InvoiceForm Component - Create and edit invoices
 */

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';
import {
  Invoice,
  CreateInvoiceInput,
  InvoiceLineItem,
  InvoiceRecipient,
} from '../types/invoice.types';
import { InvoiceService } from '../services/invoice.service';

interface InvoiceFormProps {
  invoice?: Invoice;
  onSave?: (invoice: Invoice) => void;
  onCancel?: () => void;
}

interface LineItemInput {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoice,
  onSave,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [recipient, setRecipient] = useState<InvoiceRecipient>({
    name: '',
    email: '',
    address: '',
    zipCode: '',
    city: '',
    country: 'Sweden',
  });
  const [lineItems, setLineItems] = useState<LineItemInput[]>([
    { description: '', quantity: 1, unitPrice: 0, taxRate: 12 },
  ]);
  const [dueDate, setDueDate] = useState('');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountReason, setDiscountReason] = useState('');

  // Load existing invoice data
  useEffect(() => {
    if (invoice) {
      setRecipient(invoice.recipient);
      setLineItems(
        invoice.lineItems.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          taxRate: item.taxRate,
        }))
      );
      setDueDate(invoice.dueDate);
      setReference(invoice.reference || '');
      setNotes(invoice.notes || '');
      setInternalNotes(invoice.internalNotes || '');
      setDiscountAmount(invoice.discountAmount || 0);
      setDiscountReason(invoice.discountReason || '');
    } else {
      // Default due date: 30 days from now
      const defaultDueDate = new Date();
      defaultDueDate.setDate(defaultDueDate.getDate() + 30);
      setDueDate(defaultDueDate.toISOString().split('T')[0]);
    }
  }, [invoice]);

  // Calculate line item totals
  const calculateLineItem = (item: LineItemInput) => {
    const amount = item.quantity * item.unitPrice;
    const taxAmount = amount * (item.taxRate / 100);
    const total = amount + taxAmount;
    return { amount, taxAmount, total };
  };

  // Calculate invoice totals
  const calculateTotals = () => {
    let subtotal = 0;
    let totalTax = 0;

    lineItems.forEach((item) => {
      const { amount, taxAmount } = calculateLineItem(item);
      subtotal += amount;
      totalTax += taxAmount;
    });

    const totalAmount = subtotal + totalTax - discountAmount;

    return { subtotal, totalTax, totalAmount };
  };

  const { subtotal, totalTax, totalAmount } = calculateTotals();

  // Add new line item
  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: 1, unitPrice: 0, taxRate: 12 }]);
  };

  // Remove line item
  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  // Update line item
  const updateLineItem = (index: number, field: keyof LineItemInput, value: any) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!recipient.name || !recipient.email) {
      alert('Please fill in recipient name and email');
      return;
    }

    if (lineItems.some((item) => !item.description || item.quantity <= 0 || item.unitPrice < 0)) {
      alert('Please fill in all line items with valid values');
      return;
    }

    try {
      setLoading(true);

      const input: CreateInvoiceInput = {
        recipient,
        lineItems,
        dueDate,
        reference: reference || undefined,
        notes: notes || undefined,
        internalNotes: internalNotes || undefined,
        discountAmount: discountAmount > 0 ? discountAmount : undefined,
        discountReason: discountReason || undefined,
      };

      let savedInvoice: Invoice;
      if (invoice) {
        savedInvoice = await InvoiceService.updateInvoice(invoice.id, input);
      } else {
        savedInvoice = await InvoiceService.createInvoice(input);
      }

      onSave?.(savedInvoice);
    } catch (error) {
      console.error('Failed to save invoice:', error);
      alert('Failed to save invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
    }).format(amount);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {invoice ? 'Edit Invoice' : 'Create New Invoice'}
        </h2>
        <div className="flex gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : invoice ? 'Update' : 'Create'}
          </button>
        </div>
      </div>

      {/* Recipient Details */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recipient Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={recipient.name}
              onChange={(e) => setRecipient({ ...recipient, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={recipient.email}
              onChange={(e) => setRecipient({ ...recipient, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={recipient.phone || ''}
              onChange={(e) => setRecipient({ ...recipient, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              value={recipient.address}
              onChange={(e) => setRecipient({ ...recipient, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
            <input
              type="text"
              value={recipient.zipCode}
              onChange={(e) => setRecipient({ ...recipient, zipCode: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              value={recipient.city}
              onChange={(e) => setRecipient({ ...recipient, city: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input
              type="text"
              value={recipient.country}
              onChange={(e) => setRecipient({ ...recipient, country: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">VAT Number</label>
            <input
              type="text"
              value={recipient.vatNumber || ''}
              onChange={(e) => setRecipient({ ...recipient, vatNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Optional"
            />
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Line Items</h3>
          <button
            type="button"
            onClick={addLineItem}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>

        <div className="space-y-3">
          {lineItems.map((item, index) => {
            const { amount, taxAmount, total } = calculateLineItem(item);
            return (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-12 md:col-span-4">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="col-span-4 md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(index, 'quantity', parseInt(e.target.value))}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="col-span-4 md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Unit Price
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateLineItem(index, 'unitPrice', parseFloat(e.target.value))}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="col-span-4 md:col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Tax %
                    </label>
                    <select
                      value={item.taxRate}
                      onChange={(e) => updateLineItem(index, 'taxRate', parseFloat(e.target.value))}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={0}>0%</option>
                      <option value={6}>6%</option>
                      <option value={12}>12%</option>
                      <option value={25}>25%</option>
                    </select>
                  </div>

                  <div className="col-span-10 md:col-span-2 flex items-end">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(total)}
                    </div>
                  </div>

                  <div className="col-span-2 md:col-span-1 flex items-end justify-end">
                    <button
                      type="button"
                      onClick={() => removeLineItem(index)}
                      disabled={lineItems.length === 1}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded disabled:opacity-30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Reference
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Amount
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {discountAmount > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Reason
                </label>
                <input
                  type="text"
                  value={discountReason}
                  onChange={(e) => setDiscountReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Early payment discount"
                />
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Notes visible to customer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Internal Notes
              </label>
              <textarea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Internal notes (not visible to customer)"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Total Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Total</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal:</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Tax:</span>
            <span className="font-medium">{formatCurrency(totalTax)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount:</span>
              <span className="font-medium">-{formatCurrency(discountAmount)}</span>
            </div>
          )}
          <div className="border-t border-gray-300 pt-2"></div>
          <div className="flex justify-between text-lg font-bold text-gray-900">
            <span>Total:</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </div>
    </form>
  );
};
