import React, { useEffect, useState } from 'react';
import { Booking, BookingStatus, PaymentStatus, PayerDetails, Traveler } from '../types/booking.types';
import { BookingService } from '../services/booking.service';
import { Search, Filter, MoreHorizontal, Download, Eye, X, CreditCard, User, Users, Calendar, Edit2, Save, Trash } from 'lucide-react';
import { Button, Badge, Input, Select } from '../../../shared/components/ui';
import { formatCurrency, formatDate } from '../../../shared/utils';
import { useToast } from '../../../shared/context/ToastContext';

export const BookingManager = () => {
  const toast = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');

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

    setFilteredBookings(result);
  }, [search, statusFilter, paymentFilter, bookings]);

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
        <Button variant="outline" icon={<Download className="h-4 w-4" />}>
          Export CSV
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-4 justify-between">
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
          <div className="flex gap-2">
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
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid / Total</th>
                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => setSelectedBooking(booking)}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {booking.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                    <div className="text-sm text-gray-500">{booking.payer.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
                    <div className="text-xs text-gray-500">{booking.tripDate}</div>
                    {booking.discountAmount && (
                      <div className="text-xs text-purple-600 font-medium">Saved: {formatCurrency(booking.discountAmount)}</div>
                    )}
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
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
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
    </div>
  );
};
