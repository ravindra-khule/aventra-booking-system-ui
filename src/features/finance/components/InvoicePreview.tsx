/**
 * InvoicePreview Component - Preview and print invoice
 */

import React, { useRef } from 'react';
import { Download, Send, X, Printer } from 'lucide-react';
import { Invoice } from '../types/invoice.types';

interface InvoicePreviewProps {
  invoice: Invoice;
  onClose?: () => void;
  onSend?: (invoice: Invoice) => void;
  onDownload?: (invoice: Invoice) => void;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  invoice,
  onClose,
  onSend,
  onDownload,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: invoice.currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header with Actions */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 print:hidden">
          <h2 className="text-xl font-bold text-gray-900">Invoice Preview</h2>
          <div className="flex gap-2">
            {onSend && (
              <button
                onClick={() => onSend(invoice)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            )}
            {onDownload && (
              <button
                onClick={() => onDownload(invoice)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            )}
            <button
              onClick={handlePrint}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Invoice Content */}
        <div className="flex-1 overflow-y-auto p-8" ref={printRef}>
          <div className="max-w-3xl mx-auto bg-white">
            {/* Company Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-blue-600 mb-2">Aventra Tours</h1>
              <p className="text-gray-600">Your Adventure Awaits</p>
            </div>

            {/* Invoice Info */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">Bill To:</h3>
                <div className="text-gray-900">
                  <p className="font-medium">{invoice.recipient.name}</p>
                  {invoice.recipient.email && <p className="text-sm">{invoice.recipient.email}</p>}
                  {invoice.recipient.phone && <p className="text-sm">{invoice.recipient.phone}</p>}
                  {invoice.recipient.address && <p className="text-sm mt-1">{invoice.recipient.address}</p>}
                  {(invoice.recipient.zipCode || invoice.recipient.city) && (
                    <p className="text-sm">
                      {invoice.recipient.zipCode} {invoice.recipient.city}
                    </p>
                  )}
                  {invoice.recipient.country && <p className="text-sm">{invoice.recipient.country}</p>}
                  {invoice.recipient.vatNumber && (
                    <p className="text-sm mt-1">VAT: {invoice.recipient.vatNumber}</p>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">INVOICE</h2>
                  <p className="text-lg font-semibold text-blue-600">{invoice.invoiceNumber}</p>
                </div>
                <div className="text-sm space-y-1">
                  <div className="flex justify-end gap-4">
                    <span className="text-gray-600 font-medium">Issue Date:</span>
                    <span className="text-gray-900">{formatDate(invoice.issueDate)}</span>
                  </div>
                  <div className="flex justify-end gap-4">
                    <span className="text-gray-600 font-medium">Due Date:</span>
                    <span className="text-gray-900">{formatDate(invoice.dueDate)}</span>
                  </div>
                  {invoice.reference && (
                    <div className="flex justify-end gap-4">
                      <span className="text-gray-600 font-medium">Reference:</span>
                      <span className="text-gray-900">{invoice.reference}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 text-sm font-semibold text-gray-700 uppercase">
                      Description
                    </th>
                    <th className="text-right py-3 text-sm font-semibold text-gray-700 uppercase">
                      Qty
                    </th>
                    <th className="text-right py-3 text-sm font-semibold text-gray-700 uppercase">
                      Unit Price
                    </th>
                    <th className="text-right py-3 text-sm font-semibold text-gray-700 uppercase">
                      Tax
                    </th>
                    <th className="text-right py-3 text-sm font-semibold text-gray-700 uppercase">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.lineItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="py-3 text-gray-900">{item.description}</td>
                      <td className="py-3 text-right text-gray-900">{item.quantity}</td>
                      <td className="py-3 text-right text-gray-900">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="py-3 text-right text-gray-600 text-sm">
                        {item.taxRate}%
                      </td>
                      <td className="py-3 text-right font-medium text-gray-900">
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-80">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax:</span>
                    <span className="font-medium">{formatCurrency(invoice.totalTax)}</span>
                  </div>
                  {invoice.discountAmount && invoice.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>
                        Discount
                        {invoice.discountReason && (
                          <span className="text-xs ml-1">({invoice.discountReason})</span>
                        )}
                        :
                      </span>
                      <span className="font-medium">-{formatCurrency(invoice.discountAmount)}</span>
                    </div>
                  )}
                  <div className="border-t-2 border-gray-300 pt-2 mt-2">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total:</span>
                      <span>{formatCurrency(invoice.totalAmount)}</span>
                    </div>
                  </div>
                  {invoice.paidAmount > 0 && (
                    <>
                      <div className="flex justify-between text-green-600 font-medium">
                        <span>Paid:</span>
                        <span>-{formatCurrency(invoice.paidAmount)}</span>
                      </div>
                      {invoice.paidAmount < invoice.totalAmount && (
                        <div className="flex justify-between text-lg font-bold text-red-600">
                          <span>Amount Due:</span>
                          <span>{formatCurrency(invoice.totalAmount - invoice.paidAmount)}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Notes:</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
              </div>
            )}

            {/* Payment Information */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Payment Information:</h4>
              <div className="grid grid-cols-2 gap-6 text-sm text-gray-600">
                <div>
                  <p className="font-medium text-gray-700 mb-1">Bank Details:</p>
                  <p>Bank: Swedbank</p>
                  <p>Account: 1234-567890</p>
                  <p>IBAN: SE45 5000 0000 0583 9825 7466</p>
                  <p>BIC/SWIFT: SWEDSESS</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-1">Payment Terms:</p>
                  <p>Payment is due within 30 days from the issue date.</p>
                  <p className="mt-2">Please include the invoice number as reference.</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
              <p>Thank you for choosing Aventra Tours!</p>
              <p className="mt-2">
                Questions about your invoice? Contact us at info@aventratours.com or +46 70 123 4567
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:hidden {
            display: none !important;
          }
          ${printRef.current && `#${printRef.current.id}`} * {
            visibility: visible;
          }
        }
      `}</style>
    </div>
  );
};
