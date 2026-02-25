import React, { useEffect, useState } from 'react';
import { StripeWrapper } from '../components/StripeWrapper';
import { Booking, BookingStatus, PaymentStatus, PayerDetails, Traveler } from '../types/booking.types';
import { BookingService } from '../services/booking.service';
import { Search, Filter, MoreHorizontal, Download, Eye, X, CreditCard, User, Users, Calendar, Edit2, Save, Trash, Mail, CheckSquare, Square } from 'lucide-react';
import { Button, Badge, Input, Select } from '../../../shared/components/ui';
import { BulkActionsToolbar, BulkAction } from '../../../shared/components/BulkActionsToolbar';
import { useBulkSelection } from '../../../shared/hooks/useBulkSelection';
import { formatCurrency, formatDate } from '../../../shared/utils';
import { useToast } from '../../../shared/context/ToastContext';

export const BookingManager = () => {
    // CSV Export Handler
    const handleExportCSV = () => {
      if (!filteredBookings.length) {
        toast.error('No bookings to export.');
        return;
      }
      // Define CSV headers
      const headers = [
        'Booking ID',
        'Customer Name',
        'Customer Email',
        'Tour',
        'Trip Date',
        'Status',
        'Payment Status',
        'Paid Amount',
        'Total Amount',
        'Promo Code',
        'Discount Amount'
      ];
      // Map bookings to CSV rows
      const rows = filteredBookings.map(b => [
        b.id,
        b.customerName,
        b.payer?.email || '',
        b.tourTitle,
        b.tripDate,
        b.status,
        b.paymentStatus,
        b.paidAmount,
        b.totalAmount,
        b.promoCode || '',
        b.discountAmount || ''
      ]);
      // Build CSV string
      const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
        .join('\r\n');
      // Create blob and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'bookings.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('CSV exported!');
    };
  const toast = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  
  // Bulk selection hook
  const bulkSelection = useBulkSelection(filteredBookings);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');
  const [tourFilter, setTourFilter] = useState<string>('ALL');
  const [dateFromFilter, setDateFromFilter] = useState<string>('');
  const [dateToFilter, setDateToFilter] = useState<string>('');

  const fetchBookings = () => {
    BookingService.getAll().then((data) => {
      setBookings(data);
      // Re-apply filters if needed, but for simplicity we can just set filtered here initially
      // A better way is to have the useEffect dependent on 'bookings' handle the filtering
    });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    let result = bookings;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(b => 
        b.customerName.toLowerCase().includes(q) || 
        b.id.toLowerCase().includes(q) ||
        b.tourTitle.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'ALL') {
      result = result.filter(b => b.status === statusFilter);
    }

    if (paymentFilter !== 'ALL') {
      result = result.filter(b => b.paymentStatus === paymentFilter);
    }

    if (tourFilter !== 'ALL') {
      result = result.filter(b => b.tourTitle === tourFilter);
    }

    if (dateFromFilter) {
      result = result.filter(b => b.tripDate >= dateFromFilter);
    }

    if (dateToFilter) {
      result = result.filter(b => b.tripDate <= dateToFilter);
    }

    setFilteredBookings(result);
  }, [search, statusFilter, paymentFilter, tourFilter, dateFromFilter, dateToFilter, bookings]);

  // Get unique tour titles for filter dropdown
  const uniqueTours = Array.from(new Set(bookings.map(b => b.tourTitle))).sort();

  const handleBookingUpdate = async (updatedBooking: Booking) => {
     // Update local state immediately for responsiveness
     setBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b));
     setSelectedBooking(updatedBooking);
     // Persist
     try {
       await BookingService.update(updatedBooking.id, updatedBooking);
       toast.success('Booking updated successfully!');
     } catch (e) {
       console.error("Failed to update booking", e);
       toast.error('Failed to save changes. Please try again.');
     }
  };

  const handleToggleBookingSelection = (bookingId: string) => {
    bulkSelection.toggleSelection(bookingId);
  };

  const handleSelectAll = () => {
    bulkSelection.selectAll();
  };

  const handleSendEmails = async () => {
    if (bulkSelection.selectedCount === 0) {
      toast.error('Please select at least one booking');
      return;
    }

    if (!emailSubject.trim() || !emailMessage.trim()) {
      toast.error('Please enter both subject and message');
      return;
    }

    setSendingEmail(true);
    try {
      // Get selected bookings
      const selectedBookingsData = bulkSelection.getSelectedItems();
      
      // Collect unique emails
      const emailsSet = new Set<string>();
      selectedBookingsData.forEach(booking => {
        emailsSet.add(booking.payer.email);
      });

      // Call API to send emails
      for (const email of emailsSet) {
        await BookingService.sendBulkEmail({
          email,
          subject: emailSubject,
          message: emailMessage,
          bookingCount: selectedBookingsData.filter(b => b.payer.email === email).length
        });
      }

      toast.success(`Email sent to ${emailsSet.size} customer(s)`);
      setShowEmailModal(false);
      setEmailSubject('');
      setEmailMessage('');
      bulkSelection.clearSelection();
    } catch (e) {
      console.error("Failed to send emails", e);
      toast.error('Failed to send emails. Please try again.');
    } finally {
      setSendingEmail(false);
    }
  };

  const getStatusVariant = (status: BookingStatus): 'success' | 'warning' | 'danger' | 'info' | 'default' => {
    switch(status) {
      case BookingStatus.CONFIRMED: return 'success';
      case BookingStatus.PENDING: return 'warning';
      case BookingStatus.CANCELLED: return 'danger';
      case BookingStatus.COMPLETED: return 'info';
      default: return 'default';
    }
  };

  const getPaymentVariant = (status: PaymentStatus): 'info' | 'warning' | 'danger' | 'default' => {
    switch(status) {
        case PaymentStatus.PAID: return 'info';
        case PaymentStatus.PARTIAL: return 'warning';
        case PaymentStatus.UNPAID: return 'danger';
        case PaymentStatus.REFUNDED: return 'default';
        default: return 'default';
    }
  };

  // Email Modal
  const EmailModal = () => {
    if (!showEmailModal) return null;

    const selectedCount = bulkSelection.selectedCount;
    const customerCount = new Set(
      bulkSelection.getSelectedItems()
        .map(b => b.payer.email)
    ).size;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowEmailModal(false)}></div>
          
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start mb-4">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Send Email to {customerCount} Customer(s)
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {selectedCount} booking(s) selected
                  </p>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Subject
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="e.g., Important Update About Your Tour"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Message
                  </label>
                  <textarea
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    placeholder="Enter your message here..."
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800">
                  <p>
                    <strong>Recipients:</strong> {customerCount} unique customer(s) will receive this email.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
              <Button
                onClick={handleSendEmails}
                variant="primary"
                disabled={sendingEmail}
                className="w-full sm:w-auto"
              >
                {sendingEmail ? 'Sending...' : 'Send Email'}
              </Button>
              <Button
                onClick={() => setShowEmailModal(false)}
                variant="outline"
                className="w-full sm:w-auto"
                disabled={sendingEmail}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Sidebar / Modal for details
  const BookingDetailsPanel = ({ booking, onClose, onUpdate }: { booking: Booking, onClose: () => void, onUpdate: (b: Booking) => void }) => {
     if (!booking) return null;
     
     const [isEditing, setIsEditing] = useState(false);
     const [formData, setFormData] = useState<Booking>(booking);
     
     const remainingAmount = formData.totalAmount - formData.paidAmount;

     const handleSave = () => {
        onUpdate(formData);
        setIsEditing(false);
     };

     const handleCancel = () => {
        setFormData(booking); // Reset
        setIsEditing(false);
     };

     const handleChange = (field: keyof Booking, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
     };

     const handlePayerChange = (field: keyof PayerDetails, value: string) => {
        setFormData(prev => ({
            ...prev,
            payer: { ...prev.payer, [field]: value }
        }));
     };

     const handleTravelerChange = (index: number, field: keyof Traveler, value: string) => {
        const newTravelers = [...formData.travelers];
        newTravelers[index] = { ...newTravelers[index], [field]: value };
        setFormData(prev => ({ ...prev, travelers: newTravelers }));
     };

     return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="w-screen max-w-md">
            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                                                {/* Payment UI Integration with Stripe */}
                                                <div className="mt-6">
                                                  <StripeWrapper
                                                    booking={formData}
                                                    onPaymentSuccess={(updatedBooking) => {
                                                      setFormData(updatedBooking);
                                                      onUpdate(updatedBooking);
                                                    }}
                                                  />
                                                </div>
                        <div className="px-6 py-6 bg-gray-900 text-white flex justify-between items-start sticky top-0 z-10">
                           <div>
                                <h2 className="text-xl font-bold">{formData.tourTitle}</h2>
                                <p className="text-gray-400 text-sm mt-1">Ref: {formData.id}</p>
                           </div>
                           <Button onClick={onClose} variant="ghost" className="text-gray-400 hover:text-white !p-2">
                               <X className="h-6 w-6" />
                           </Button>
                        </div>
                        
                        <div className="flex-1 px-6 py-6 space-y-8 pb-20">
                            
                            {/* Actions Toolbar */}
                            <div className="flex justify-end space-x-2">
                                {isEditing ? (
                                    <>
                                        <Button onClick={handleCancel} variant="outline" size="sm">Cancel</Button>
                                        <Button onClick={handleSave} variant="primary" size="sm" icon={<Save className="h-4 w-4" />}>
                                            Save Changes
                                        </Button>
                                    </>
                                ) : (
                                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" icon={<Edit2 className="h-4 w-4" />}>
                                        Edit Booking
                                    </Button>
                                )}
                            </div>

                            {/* Status Section */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs uppercase text-gray-500 font-bold tracking-wide block mb-1">Booking Status</label>
                                    {isEditing ? (
                                        <Select
                                            value={formData.status} 
                                            onChange={e => handleChange('status', e.target.value)}
                                            options={Object.values(BookingStatus).map(s => ({ value: s, label: s }))}
                                            fullWidth
                                        />
                                    ) : (
                                        <div className="flex justify-center">
                                            <Badge variant={getStatusVariant(formData.status)} size="lg">
                                                {formData.status}
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                                
                                <div>
                                    <label className="text-xs uppercase text-gray-500 font-bold tracking-wide block mb-1">Payment Status</label>
                                    {isEditing ? (
                                        <Select
                                            value={formData.paymentStatus} 
                                            onChange={e => handleChange('paymentStatus', e.target.value)}
                                            options={Object.values(PaymentStatus).map(s => ({ value: s, label: s }))}
                                            fullWidth
                                        />
                                    ) : (
                                        <div className="flex justify-center">
                                            <Badge variant={getPaymentVariant(formData.paymentStatus)} size="lg">
                                                {formData.paymentStatus}
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Financials */}
                            <div className="border rounded-xl p-4 bg-gray-50">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center">
                                    <CreditCard className="h-4 w-4 mr-2" /> Financials
                                </h3>
                                <div className="space-y-2 text-sm">
                                    {/* Show promo code discount if applied */}
                                    {formData.promoCode && formData.discountAmount && (
                                        <>
                                            <div className="flex justify-between text-purple-600 bg-purple-50 -mx-4 px-4 py-2 rounded">
                                                <span className="flex items-center gap-1 font-medium">
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                    </svg>
                                                    Promo Code Applied
                                                </span>
                                            </div>
                                            <div className="bg-purple-50 -mx-4 px-4 pb-3 space-y-1">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600 text-xs">Code:</span>
                                                    <span className="font-mono font-bold text-purple-700 text-sm">{formData.promoCode}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600 text-xs">Discount:</span>
                                                    <span className="font-bold text-purple-700">-{formatCurrency(formData.discountAmount)}</span>
                                                </div>
                                            </div>
                                            <div className="border-t border-gray-200 pt-2"></div>
                                        </>
                                    )}
                                    
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Amount</span>
                                        <span className="font-medium">{formatCurrency(formData.totalAmount)}</span>
                                    </div>
                                    <div className="flex justify-between text-green-600">
                                        <span>Paid Amount</span>
                                        <span className="font-bold">-{formatCurrency(formData.paidAmount)}</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900">
                                        <span>Remaining Due</span>
                                        <span>{formatCurrency(remainingAmount)}</span>
                                    </div>
                                    <div className="pt-2 mt-2 border-t border-gray-200">
                                        <span className="text-xs text-gray-400">Stripe Transaction ID</span>
                                        <p className="font-mono text-xs text-gray-600 truncate">{formData.transactionId || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Payer Details */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center">
                                    <User className="h-4 w-4 mr-2" /> Payer Details
                                </h3>
                                <div className="bg-white border rounded-lg p-4 space-y-3 text-sm">
                                    {isEditing ? (
                                        <>
                                            <div>
                                                <label className="block text-xs text-gray-500">First Name</label>
                                                <input type="text" className="w-full border p-1 rounded" value={formData.payer.firstName} onChange={e => handlePayerChange('firstName', e.target.value)} />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500">Last Name</label>
                                                <input type="text" className="w-full border p-1 rounded" value={formData.payer.lastName} onChange={e => handlePayerChange('lastName', e.target.value)} />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500">Email</label>
                                                <input type="text" className="w-full border p-1 rounded" value={formData.payer.email} onChange={e => handlePayerChange('email', e.target.value)} />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500">Phone</label>
                                                <input type="text" className="w-full border p-1 rounded" value={formData.payer.phone} onChange={e => handlePayerChange('phone', e.target.value)} />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p><span className="text-gray-500 block text-xs">Name</span> {formData.payer.firstName} {formData.payer.lastName}</p>
                                            <p><span className="text-gray-500 block text-xs">Email</span> {formData.payer.email}</p>
                                            <p><span className="text-gray-500 block text-xs">Phone</span> {formData.payer.phone}</p>
                                            <p><span className="text-gray-500 block text-xs">Address</span> {formData.payer.address}, {formData.payer.zipCode} {formData.payer.city}, {formData.payer.country}</p>
                                        </>
                                    )}
                                </div>
                            </div>

                             {/* Travelers */}
                             <div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center">
                                    <Users className="h-4 w-4 mr-2" /> Travelers ({formData.participants})
                                </h3>
                                <div className="space-y-3">
                                    {formData.travelers.map((traveler, idx) => (
                                        <div key={idx} className="bg-white border rounded-lg p-3 text-sm">
                                            {isEditing ? (
                                                <div className="space-y-2">
                                                    <div className="font-bold text-xs text-gray-400 uppercase">Traveler {idx + 1}</div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <input type="text" placeholder="First Name" className="border p-1 rounded text-xs" value={traveler.firstName} onChange={e => handleTravelerChange(idx, 'firstName', e.target.value)} />
                                                        <input type="text" placeholder="Last Name" className="border p-1 rounded text-xs" value={traveler.lastName} onChange={e => handleTravelerChange(idx, 'lastName', e.target.value)} />
                                                    </div>
                                                    <input type="text" placeholder="SSN" className="w-full border p-1 rounded text-xs" value={traveler.ssn} onChange={e => handleTravelerChange(idx, 'ssn', e.target.value)} />
                                                    <input type="text" placeholder="Room Pref" className="w-full border p-1 rounded text-xs" value={traveler.roomPreference} onChange={e => handleTravelerChange(idx, 'roomPreference', e.target.value)} />
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="font-bold text-gray-900">{traveler.firstName} {traveler.lastName}</span>
                                                        {traveler.isPayer && <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">Payer</span>}
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                                        <div>
                                                            <span className="block text-gray-400">SSN/DOB</span>
                                                            {traveler.ssn}
                                                        </div>
                                                        <div>
                                                            <span className="block text-gray-400">Phone</span>
                                                            {traveler.phone}
                                                        </div>
                                                        <div className="col-span-2 mt-1">
                                                            <span className="block text-gray-400">Room Preference</span>
                                                            {traveler.roomPreference || 'None'}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Trip Info */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center">
                                    <Calendar className="h-4 w-4 mr-2" /> Trip Details
                                </h3>
                                <div className="bg-white border rounded-lg p-4 text-sm space-y-2">
                                     <p><span className="text-gray-500 block text-xs">Tour</span> {formData.tourTitle}</p>
                                     <p><span className="text-gray-500 block text-xs">Start Date</span> {formData.tripDate}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
     );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">All Bookings</h1>
            <p className="text-gray-500">Manage customers, payments, and trip rosters.</p>
        </div>
        <Button variant="outline" icon={<Download className="h-4 w-4" />} onClick={handleExportCSV}>
          Export CSV
        </Button>
      </div>


      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200">
          {/* Search Bar */}
          <div className="flex flex-col gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text"
                placeholder="Search by name, ID, or tour..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Filters Row 1 */}
            <div className="flex flex-wrap gap-2">
              <select 
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Status</option>
                {Object.values(BookingStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select 
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
              >
                <option value="ALL">All Payments</option>
                {Object.values(PaymentStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select 
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                value={tourFilter}
                onChange={(e) => setTourFilter(e.target.value)}
              >
                <option value="ALL">All Tours</option>
                {uniqueTours.map(tour => <option key={tour} value={tour}>{tour}</option>)}
              </select>
            </div>

            {/* Filters Row 2 - Date Range */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 font-medium">Trip Date Range:</label>
              </div>
              <input
                type="date"
                value={dateFromFilter}
                onChange={(e) => setDateFromFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                placeholder="From"
              />
              <span className="text-gray-400">to</span>
              <input
                type="date"
                value={dateToFilter}
                onChange={(e) => setDateToFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                placeholder="To"
              />
              {(dateFromFilter || dateToFilter) && (
                <Button
                  onClick={() => {
                    setDateFromFilter('');
                    setDateToFilter('');
                  }}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Clear Dates
                </Button>
              )}
            </div>
          </div>

          {/* Bulk Actions Toolbar */}
          {bulkSelection.selectedCount > 0 && (
            <BulkActionsToolbar
              selectedCount={bulkSelection.selectedCount}
              actions={[
                {
                  id: 'send-email',
                  label: 'Send Email',
                  icon: <Mail className="h-4 w-4" />,
                  variant: 'primary',
                  onClick: () => setShowEmailModal(true)
                }
              ]}
              onClearSelection={() => bulkSelection.clearSelection()}
            />
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                  <button
                    onClick={handleSelectAll}
                    className="inline-flex items-center justify-center h-5 w-5 hover:bg-gray-200 rounded"
                    title={bulkSelection.isAllSelected ? 'Deselect all' : 'Select all'}
                  >
                    {bulkSelection.isAllSelected ? (
                      <CheckSquare className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Square className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trip Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid / Total</th>
                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                <tr 
                  key={booking.id} 
                  className={`hover:bg-gray-50 transition ${bulkSelection.isSelected(booking.id) ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleBookingSelection(booking.id)}
                      className="inline-flex items-center justify-center h-5 w-5 hover:bg-gray-200 rounded"
                    >
                      {bulkSelection.isSelected(booking.id) ? (
                        <CheckSquare className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Square className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 cursor-pointer" onClick={() => setSelectedBooking(booking)}>
                    {booking.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => setSelectedBooking(booking)}>
                    <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                    <div className="text-sm text-gray-500">{booking.payer.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => setSelectedBooking(booking)}>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-900">{booking.tourTitle}</div>
                      {booking.promoCode && (
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                          <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          {booking.promoCode}
                        </span>
                      )}
                    </div>
                    {booking.discountAmount && (
                      <div className="text-xs text-purple-600 font-medium">Saved: {formatCurrency(booking.discountAmount)}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm cursor-pointer" onClick={() => setSelectedBooking(booking)}>
                    {booking.tripDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusVariant(booking.status)} size="sm">
                      {booking.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getPaymentVariant(booking.paymentStatus)} size="sm">
                      {booking.paymentStatus}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="text-gray-900 font-medium">{formatCurrency(booking.paidAmount)} <span className="text-gray-400 font-normal">/ {formatCurrency(booking.totalAmount)}</span></div>
                    {booking.totalAmount - booking.paidAmount > 0 && (
                        <div className="text-xs text-red-500">Due: {formatCurrency(booking.totalAmount - booking.paidAmount)}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-600 !p-1" onClick={(e) => { e.stopPropagation(); setSelectedBooking(booking); }}>
                      <Eye className="h-5 w-5" />
                    </Button>
                  </td>
                </tr>
              )) : (
                <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                        No bookings found matching your filters.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">Showing {filteredBookings.length} results</p>
        </div>
      </div>

      {/* Slide-over Modal */}
      {selectedBooking && <BookingDetailsPanel booking={selectedBooking} onClose={() => setSelectedBooking(null)} onUpdate={handleBookingUpdate} />}
      
      {/* Email Modal */}
      <EmailModal />
    </div>
  );
};
