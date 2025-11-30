/**
 * InvoiceList Component - Display and manage invoices with filtering
 */

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  Send,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  XCircle,
  MoreVertical,
} from 'lucide-react';
import { Invoice, InvoiceStatus, InvoiceFilters } from '../types/invoice.types';
import { InvoiceService } from '../services/invoice.service';

interface InvoiceListProps {
  onSelectInvoice?: (invoice: Invoice) => void;
  onEditInvoice?: (invoice: Invoice) => void;
  onViewInvoice?: (invoice: Invoice) => void;
  filters?: InvoiceFilters;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({
  onSelectInvoice,
  onEditInvoice,
  onViewInvoice,
  filters: externalFilters,
}) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus[]>([]);
  const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  // Load invoices
  useEffect(() => {
    loadInvoices();
  }, [searchTerm, statusFilter, externalFilters]);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const filters: InvoiceFilters = {
        ...externalFilters,
        search: searchTerm || undefined,
        status: statusFilter.length > 0 ? statusFilter : undefined,
      };
      const data = await InvoiceService.getInvoices(filters);
      setInvoices(data);
    } catch (error) {
      console.error('Failed to load invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get status badge styling
  const getStatusBadge = (status: InvoiceStatus) => {
    const styles = {
      [InvoiceStatus.DRAFT]: {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        icon: FileText,
      },
      [InvoiceStatus.SENT]: {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        icon: Send,
      },
      [InvoiceStatus.PAID]: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        icon: CheckCircle,
      },
      [InvoiceStatus.OVERDUE]: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        icon: AlertCircle,
      },
      [InvoiceStatus.CANCELLED]: {
        bg: 'bg-gray-100',
        text: 'text-gray-500',
        icon: XCircle,
      },
      [InvoiceStatus.REFUNDED]: {
        bg: 'bg-orange-100',
        text: 'text-orange-700',
        icon: DollarSign,
      },
    };

    const style = styles[status];
    const Icon = style.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string = 'SEK') => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Handle bulk actions
  const handleBulkSend = async () => {
    if (selectedInvoices.size === 0) return;

    // TODO: Implement bulk send
    console.log('Sending invoices:', Array.from(selectedInvoices));
    setSelectedInvoices(new Set());
  };

  const handleBulkExport = async () => {
    if (selectedInvoices.size === 0) return;

    // TODO: Implement bulk export
    console.log('Exporting invoices:', Array.from(selectedInvoices));
  };

  // Handle individual actions
  const handleSendInvoice = async (invoice: Invoice) => {
    try {
      await InvoiceService.sendInvoice(invoice.id, {
        to: invoice.recipient.email,
        subject: `Invoice ${invoice.invoiceNumber}`,
        message: 'Please find your invoice attached.',
        attachPdf: true,
      });
      loadInvoices();
    } catch (error) {
      console.error('Failed to send invoice:', error);
    }
  };

  const handleDeleteInvoice = async (invoice: Invoice) => {
    if (!confirm(`Are you sure you want to delete invoice ${invoice.invoiceNumber}?`)) {
      return;
    }

    try {
      await InvoiceService.deleteInvoice(invoice.id);
      loadInvoices();
    } catch (error) {
      console.error('Failed to delete invoice:', error);
      alert('Failed to delete invoice. Only draft invoices can be deleted.');
    }
  };

  // Toggle invoice selection
  const toggleInvoiceSelection = (id: string) => {
    const newSelection = new Set(selectedInvoices);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedInvoices(newSelection);
  };

  // Select all/none
  const toggleSelectAll = () => {
    if (selectedInvoices.size === invoices.length) {
      setSelectedInvoices(new Set());
    } else {
      setSelectedInvoices(new Set(invoices.map(inv => inv.id)));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search invoices by number, customer name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
        >
          <Filter className="w-5 h-5" />
          Filters
          {statusFilter.length > 0 && (
            <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {statusFilter.length}
            </span>
          )}
        </button>

        {/* Bulk Actions */}
        {selectedInvoices.size > 0 && (
          <div className="flex gap-2">
            <button
              onClick={handleBulkSend}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send ({selectedInvoices.size})
            </button>
            <button
              onClick={handleBulkExport}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        )}
      </div>

      {/* Status Filters */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Filter by Status</h4>
          <div className="flex flex-wrap gap-2">
            {Object.values(InvoiceStatus).map((status) => (
              <label key={status} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={statusFilter.includes(status)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setStatusFilter([...statusFilter, status]);
                    } else {
                      setStatusFilter(statusFilter.filter(s => s !== status));
                    }
                  }}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">{status}</span>
              </label>
            ))}
          </div>
          {statusFilter.length > 0 && (
            <button
              onClick={() => setStatusFilter([])}
              className="mt-3 text-sm text-blue-600 hover:text-blue-700"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Invoice List */}
      {invoices.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No invoices found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedInvoices.size === invoices.length}
                      onChange={toggleSelectAll}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => onSelectInvoice?.(invoice)}
                  >
                    <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedInvoices.has(invoice.id)}
                        onChange={() => toggleInvoiceSelection(invoice.id)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900">{invoice.invoiceNumber}</div>
                      {invoice.bookingId && (
                        <div className="text-xs text-gray-500">Booking: {invoice.bookingId}</div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">{invoice.recipient.name}</div>
                      <div className="text-xs text-gray-500">{invoice.recipient.email}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {formatDate(invoice.issueDate)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        {invoice.status === InvoiceStatus.OVERDUE && (
                          <Clock className="w-4 h-4 text-red-500" />
                        )}
                        {formatDate(invoice.dueDate)}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(invoice.totalAmount, invoice.currency)}
                      </div>
                      {invoice.paidAmount > 0 && invoice.paidAmount < invoice.totalAmount && (
                        <div className="text-xs text-green-600">
                          Paid: {formatCurrency(invoice.paidAmount, invoice.currency)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td className="px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="relative inline-block text-left">
                        <button
                          onClick={() => setActionMenuOpen(actionMenuOpen === invoice.id ? null : invoice.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                        
                        {actionMenuOpen === invoice.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  onViewInvoice?.(invoice);
                                  setActionMenuOpen(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                View
                              </button>
                              
                              {invoice.status === InvoiceStatus.DRAFT && (
                                <button
                                  onClick={() => {
                                    onEditInvoice?.(invoice);
                                    setActionMenuOpen(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                  <Edit className="w-4 h-4" />
                                  Edit
                                </button>
                              )}
                              
                              {(invoice.status === InvoiceStatus.DRAFT || invoice.status === InvoiceStatus.SENT) && (
                                <button
                                  onClick={() => {
                                    handleSendInvoice(invoice);
                                    setActionMenuOpen(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                  <Send className="w-4 h-4" />
                                  {invoice.status === InvoiceStatus.DRAFT ? 'Send' : 'Resend'}
                                </button>
                              )}
                              
                              <button
                                onClick={() => {
                                  // TODO: Download PDF
                                  setActionMenuOpen(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                              >
                                <Download className="w-4 h-4" />
                                Download PDF
                              </button>
                              
                              {invoice.status === InvoiceStatus.DRAFT && (
                                <>
                                  <div className="border-t border-gray-200 my-1"></div>
                                  <button
                                    onClick={() => {
                                      handleDeleteInvoice(invoice);
                                      setActionMenuOpen(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Click outside to close action menu */}
      {actionMenuOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setActionMenuOpen(null)}
        />
      )}
    </div>
  );
};
