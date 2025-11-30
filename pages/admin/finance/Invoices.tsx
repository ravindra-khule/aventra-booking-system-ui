import React, { useState } from 'react';
import { Plus, DollarSign, AlertCircle, Download, RefreshCw } from 'lucide-react';
import { InvoiceList, InvoiceForm, InvoicePreview, InvoiceStats } from '../../../src/features/finance/components';
import { Invoice, InvoiceStatus, RecordPaymentInput, PaymentMethod } from '../../../src/features/finance/types/invoice.types';
import { InvoiceService } from '../../../src/features/finance/services/invoice.service';

type ViewMode = 'list' | 'create' | 'edit' | 'preview' | 'record-payment';

export const Invoices: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState<RecordPaymentInput>({
    method: PaymentMethod.STRIPE,
    amount: 0,
    paidDate: new Date().toISOString().split('T')[0],
  });

  // Handle view changes
  const handleCreateNew = () => {
    setSelectedInvoice(null);
    setViewMode('create');
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setViewMode('edit');
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setViewMode('preview');
  };

  const handleSelectInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setViewMode('preview');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedInvoice(null);
    setRefreshKey(prev => prev + 1); // Trigger refresh
  };

  // Handle invoice actions
  const handleSaveInvoice = (invoice: Invoice) => {
    handleBackToList();
  };

  const handleSendInvoice = async (invoice: Invoice) => {
    try {
      await InvoiceService.sendInvoice(invoice.id, {
        to: invoice.recipient.email,
        subject: `Invoice ${invoice.invoiceNumber} from Aventra Tours`,
        message: 'Please find your invoice attached. Payment is due by ' + invoice.dueDate,
        attachPdf: true,
      });
      alert('Invoice sent successfully!');
      handleBackToList();
    } catch (error) {
      console.error('Failed to send invoice:', error);
      alert('Failed to send invoice. Please try again.');
    }
  };

  const handleDownloadInvoice = async (invoice: Invoice) => {
    try {
      // TODO: Implement actual PDF download
      console.log('Downloading invoice:', invoice.id);
      alert('PDF download will be available soon!');
    } catch (error) {
      console.error('Failed to download invoice:', error);
    }
  };

  const handleFilterByStatus = (status: InvoiceStatus) => {
    setStatusFilter([status]);
  };

  const handleRecordPayment = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPaymentData({
      method: PaymentMethod.BANK_TRANSFER,
      amount: invoice.totalAmount - invoice.paidAmount,
      paidDate: new Date().toISOString().split('T')[0],
    });
    setShowPaymentModal(true);
  };

  const submitPayment = async () => {
    if (!selectedInvoice) return;

    try {
      await InvoiceService.recordPayment(selectedInvoice.id, paymentData);
      alert('Payment recorded successfully!');
      setShowPaymentModal(false);
      handleBackToList();
    } catch (error) {
      console.error('Failed to record payment:', error);
      alert('Failed to record payment. Please try again.');
    }
  };

  const handleSendReminder = async (invoice: Invoice) => {
    try {
      await InvoiceService.sendPaymentReminder({
        invoiceId: invoice.id,
        reminderLevel: (invoice.remindersSent || 0) + 1,
      });
      alert('Payment reminder sent successfully!');
      handleBackToList();
    } catch (error) {
      console.error('Failed to send reminder:', error);
      alert('Failed to send payment reminder. Please try again.');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoice Management</h1>
          <p className="text-gray-600 mt-1">
            Create, manage, and track invoices for your tours
          </p>
        </div>
        <div className="flex gap-3">
          {viewMode === 'list' && (
            <>
              <button
                onClick={() => setRefreshKey(prev => prev + 1)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={handleCreateNew}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Invoice
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'list' && (
        <>
          {/* Statistics Dashboard */}
          <InvoiceStats onFilterByStatus={handleFilterByStatus} />

          {/* Invoice List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">All Invoices</h2>
              <InvoiceList
                key={refreshKey}
                onSelectInvoice={handleSelectInvoice}
                onEditInvoice={handleEditInvoice}
                onViewInvoice={handleViewInvoice}
                filters={{ status: statusFilter.length > 0 ? statusFilter : undefined }}
              />
            </div>
          </div>
        </>
      )}

      {(viewMode === 'create' || viewMode === 'edit') && (
        <div className="bg-white rounded-lg shadow p-6">
          <InvoiceForm
            invoice={selectedInvoice || undefined}
            onSave={handleSaveInvoice}
            onCancel={handleBackToList}
          />
        </div>
      )}

      {viewMode === 'preview' && selectedInvoice && (
        <div>
          <InvoicePreview
            invoice={selectedInvoice}
            onClose={handleBackToList}
            onSend={handleSendInvoice}
            onDownload={handleDownloadInvoice}
          />
          
          {/* Additional Actions Below Preview */}
          <div className="bg-white rounded-lg shadow p-6 mt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Actions</h3>
            <div className="flex flex-wrap gap-3">
              {selectedInvoice.status === InvoiceStatus.DRAFT && (
                <button
                  onClick={() => handleEditInvoice(selectedInvoice)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Edit Invoice
                </button>
              )}
              
              {(selectedInvoice.status === InvoiceStatus.SENT || 
                selectedInvoice.status === InvoiceStatus.OVERDUE) && (
                <>
                  <button
                    onClick={() => handleRecordPayment(selectedInvoice)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <DollarSign className="w-4 h-4" />
                    Record Payment
                  </button>
                  
                  {selectedInvoice.status === InvoiceStatus.OVERDUE && (
                    <button
                      onClick={() => handleSendReminder(selectedInvoice)}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4" />
                      Send Reminder ({selectedInvoice.remindersSent || 0} sent)
                    </button>
                  )}
                </>
              )}
              
              <button
                onClick={handleBackToList}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back to List
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Recording Modal */}
      {showPaymentModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Record Payment</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Invoice: <span className="font-medium">{selectedInvoice.invoiceNumber}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Total: <span className="font-medium">{formatCurrency(selectedInvoice.totalAmount)}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Already Paid: <span className="font-medium">{formatCurrency(selectedInvoice.paidAmount)}</span>
                </p>
                <p className="text-sm font-semibold text-gray-900 mt-2">
                  Outstanding: {formatCurrency(selectedInvoice.totalAmount - selectedInvoice.paidAmount)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentData.method}
                  onChange={(e) => setPaymentData({ ...paymentData, method: e.target.value as PaymentMethod })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value={PaymentMethod.STRIPE}>Stripe</option>
                  <option value={PaymentMethod.BANK_TRANSFER}>Bank Transfer</option>
                  <option value={PaymentMethod.SWISH}>Swish</option>
                  <option value={PaymentMethod.CASH}>Cash</option>
                  <option value={PaymentMethod.OTHER}>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({ ...paymentData, amount: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Date
                </label>
                <input
                  type="date"
                  value={paymentData.paidDate}
                  onChange={(e) => setPaymentData({ ...paymentData, paidDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction ID (Optional)
                </label>
                <input
                  type="text"
                  value={paymentData.transactionId || ''}
                  onChange={(e) => setPaymentData({ ...paymentData, transactionId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., pi_3abc123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reference (Optional)
                </label>
                <input
                  type="text"
                  value={paymentData.reference || ''}
                  onChange={(e) => setPaymentData({ ...paymentData, reference: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Payment reference or OCR number"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={submitPayment}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Record Payment
              </button>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
