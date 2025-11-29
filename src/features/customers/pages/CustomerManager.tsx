import React, { useEffect, useState } from 'react';
import { Customer } from '../types/customer.types';
import { Booking } from '../../bookings/types/booking.types';
import { CustomerService } from '../services/customer.service';
import { Search, User, Mail, Phone, MapPin, DollarSign, ShoppingBag, Calendar, Edit2, Save, X, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { Button, Badge, Card, Input } from '../../../shared/components/ui';
import { formatCurrency, formatDate } from '../../../shared/utils';

export const CustomerManager = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerBookings, setCustomerBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await CustomerService.getAll();
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (error) {
      console.error('Failed to fetch customers', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (search) {
      const q = search.toLowerCase();
      const result = customers.filter(c =>
        c.firstName.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
      );
      setFilteredCustomers(result);
    } else {
      setFilteredCustomers(customers);
    }
  }, [search, customers]);

  const handleViewCustomer = async (customer: Customer) => {
    setSelectedCustomer(customer);
    const bookings = await CustomerService.getCustomerBookings(customer.id);
    setCustomerBookings(bookings);
  };

  const handleUpdateCustomer = async (updatedCustomer: Customer) => {
    try {
      await CustomerService.update(updatedCustomer.id, updatedCustomer);
      setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
      setSelectedCustomer(updatedCustomer);
      alert('Customer updated successfully!');
    } catch (error) {
      console.error('Failed to update customer', error);
      alert('Failed to update customer');
    }
  };

  // Customer Details Panel Component
  const CustomerDetailsPanel = ({ 
    customer, 
    bookings, 
    onClose, 
    onUpdate 
  }: { 
    customer: Customer; 
    bookings: Booking[]; 
    onClose: () => void; 
    onUpdate: (c: Customer) => void;
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Customer>(customer);
    const [showBookings, setShowBookings] = useState(true);

    const handleSave = () => {
      onUpdate(formData);
      setIsEditing(false);
    };

    const handleCancel = () => {
      setFormData(customer);
      setIsEditing(false);
    };

    const getStatusColor = (status: string) => {
      switch(status) {
        case 'CONFIRMED': return 'bg-green-100 text-green-800';
        case 'PENDING': return 'bg-yellow-100 text-yellow-800';
        case 'CANCELLED': return 'bg-red-100 text-red-800';
        case 'COMPLETED': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="w-screen max-w-2xl">
            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
              {/* Header */}
              <div className="px-6 py-6 bg-blue-900 text-white flex justify-between items-start sticky top-0 z-10">
                <div>
                  <h2 className="text-2xl font-bold">{formData.firstName} {formData.lastName}</h2>
                  <p className="text-blue-200 text-sm mt-1">Customer ID: {customer.id}</p>
                </div>
                <button onClick={onClose} className="text-blue-200 hover:text-white">
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4 p-6 bg-gray-50 border-b">
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <div className="flex items-center text-gray-500 text-sm mb-1">
                    <ShoppingBag className="h-4 w-4 mr-1" />
                    Total Bookings
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{customer.totalBookings}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <div className="flex items-center text-gray-500 text-sm mb-1">
                    <DollarSign className="h-4 w-4 mr-1" />
                    Total Spent
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{customer.totalSpent.toLocaleString()} SEK</div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 px-6 py-6 space-y-6">
                {/* Edit Button */}
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit Customer Details
                  </button>
                )}

                {/* Contact Information */}
                <div className="border rounded-xl p-6 bg-white shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-600" />
                    Contact Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                          First Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium">{formData.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                          Last Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium">{formData.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                        <Mail className="h-3 w-3 inline mr-1" />
                        Email
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                      ) : (
                        <p className="text-gray-900">{formData.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                        <Phone className="h-3 w-3 inline mr-1" />
                        Phone
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                      ) : (
                        <p className="text-gray-900">{formData.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                        <MapPin className="h-3 w-3 inline mr-1" />
                        Address
                      </label>
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            placeholder="Street Address"
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2"
                          />
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="text"
                              placeholder="Zip Code"
                              value={formData.zipCode}
                              onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                              className="border border-gray-300 rounded-lg px-3 py-2"
                            />
                            <input
                              type="text"
                              placeholder="City"
                              value={formData.city}
                              onChange={(e) => setFormData({...formData, city: e.target.value})}
                              className="border border-gray-300 rounded-lg px-3 py-2"
                            />
                            <input
                              type="text"
                              placeholder="Country"
                              value={formData.country}
                              onChange={(e) => setFormData({...formData, country: e.target.value})}
                              className="border border-gray-300 rounded-lg px-3 py-2"
                            />
                          </div>
                        </>
                      ) : (
                        <p className="text-gray-900">
                          {formData.address}<br />
                          {formData.zipCode} {formData.city}<br />
                          {formData.country}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                        Notes
                      </label>
                      {isEditing ? (
                        <textarea
                          value={formData.notes || ''}
                          onChange={(e) => setFormData({...formData, notes: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-[80px]"
                          placeholder="Add any notes about this customer..."
                        />
                      ) : (
                        <p className="text-gray-900">{formData.notes || 'No notes'}</p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={handleSave}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Save className="h-4 w-4" />
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Customer Metadata */}
                <div className="border rounded-xl p-6 bg-white shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                    Customer History
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">First Booking:</span>
                      <p className="font-medium text-gray-900">{new Date(customer.createdDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Last Booking:</span>
                      <p className="font-medium text-gray-900">
                        {customer.lastBookingDate ? new Date(customer.lastBookingDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Booking History */}
                <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
                  <button
                    onClick={() => setShowBookings(!showBookings)}
                    className="w-full px-6 py-4 bg-gray-50 border-b flex justify-between items-center hover:bg-gray-100 transition-colors"
                  >
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                      <ShoppingBag className="h-5 w-5 mr-2 text-blue-600" />
                      Booking History ({bookings.length})
                    </h3>
                    {showBookings ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                  
                  {showBookings && (
                    <div className="p-6">
                      {bookings.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No bookings found</p>
                      ) : (
                        <div className="space-y-4">
                          {bookings.map(booking => (
                            <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-bold text-gray-900">{booking.tourTitle}</h4>
                                  <p className="text-sm text-gray-500">Booking ID: {booking.id}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                  {booking.status}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                                <div>
                                  <span className="text-gray-500">Booking Date:</span>
                                  <p className="font-medium">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Trip Date:</span>
                                  <p className="font-medium">{new Date(booking.tripDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Participants:</span>
                                  <p className="font-medium">{booking.participants}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Total Amount:</span>
                                  <p className="font-medium">{booking.totalAmount.toLocaleString()} SEK</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Paid Amount:</span>
                                  <p className="font-medium text-green-600">{booking.paidAmount.toLocaleString()} SEK</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Payment Status:</span>
                                  <p className="font-medium">{booking.paymentStatus}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="p-8">Loading customers...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Management</h1>
        <p className="text-gray-600">View and manage all customers in the system</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone, or customer ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
            </div>
            <User className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">
                {customers.reduce((sum, c) => sum + c.totalBookings, 0)}
              </p>
            </div>
            <ShoppingBag className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()} SEK
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Booking
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No customers found
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(customer => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">
                          {customer.firstName} {customer.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{customer.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-gray-900 flex items-center">
                          <Mail className="h-3 w-3 mr-1 text-gray-400" />
                          {customer.email}
                        </div>
                        <div className="text-gray-500 flex items-center mt-1">
                          <Phone className="h-3 w-3 mr-1 text-gray-400" />
                          {customer.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.city}</div>
                      <div className="text-sm text-gray-500">{customer.country}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm font-medium text-gray-900">
                        <ShoppingBag className="h-4 w-4 mr-1 text-blue-600" />
                        {customer.totalBookings}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {customer.totalSpent.toLocaleString()} SEK
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {customer.lastBookingDate 
                          ? new Date(customer.lastBookingDate).toLocaleDateString() 
                          : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewCustomer(customer)}
                        className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details Panel */}
      {selectedCustomer && (
        <CustomerDetailsPanel
          customer={selectedCustomer}
          bookings={customerBookings}
          onClose={() => {
            setSelectedCustomer(null);
            setCustomerBookings([]);
          }}
          onUpdate={handleUpdateCustomer}
        />
      )}
    </div>
  );
};
