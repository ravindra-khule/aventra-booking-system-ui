import React, { useEffect, useState } from 'react';
import { Waitlist } from '../../types';
import { WaitlistService } from '../../services/api';
import { Users, Mail, Phone, MessageSquare, X, Edit2, Save, Search, ListFilter } from 'lucide-react';

export const WaitlistManager = () => {
  const [waitlist, setWaitlist] = useState<Waitlist[]>([]);
  const [filteredWaitlist, setFilteredWaitlist] = useState<Waitlist[]>([]);
  const [selectedTour, setSelectedTour] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedEntry, setSelectedEntry] = useState<Waitlist | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadWaitlist();
  }, []);

  const loadWaitlist = async () => {
    const data = await WaitlistService.getAll();
    setWaitlist(data);
  };

  useEffect(() => {
    let result = waitlist;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(w =>
        w.firstName.toLowerCase().includes(q) ||
        w.lastName.toLowerCase().includes(q) ||
        w.email.toLowerCase().includes(q) ||
        w.phone.toLowerCase().includes(q) ||
        w.id.toLowerCase().includes(q)
      );
    }

    if (selectedTour !== 'ALL') {
      result = result.filter(w => w.tourId === selectedTour);
    }

    if (selectedStatus !== 'ALL') {
      result = result.filter(w => w.status === selectedStatus);
    }

    setFilteredWaitlist(result);
  }, [selectedTour, selectedStatus, waitlist, search]);

  const uniqueTours = Array.from(new Set(waitlist.map(w => JSON.stringify({ id: w.tourId, title: w.tourTitle }))))
    .map((str: string) => JSON.parse(str) as { id: string; title: string });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CONTACTED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CONVERTED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleUpdateEntry = async (id: string, updates: Partial<Waitlist>) => {
    try {
      await WaitlistService.update(id, updates);
      await loadWaitlist();
    } catch (error) {
      console.error('Failed to update entry', error);
      alert('Failed to update waitlist entry');
    }
  };

  const WaitlistDetailsPanel = ({ entry, onClose }: { entry: Waitlist, onClose: () => void }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Waitlist>(entry);

    const handleSave = async () => {
      await handleUpdateEntry(entry.id, formData);
      setSelectedEntry(formData);
      setIsEditing(false);
      alert('Waitlist entry updated successfully!');
    };

    const handleCancel = () => {
      setFormData(entry);
      setIsEditing(false);
    };

    return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="w-screen max-w-md">
            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
              <div className="px-6 py-6 bg-orange-900 text-white flex justify-between items-start sticky top-0 z-10">
                <div>
                  <h2 className="text-xl font-bold">{formData.tourTitle}</h2>
                  <p className="text-orange-200 text-sm mt-1">Waitlist ID: {entry.id}</p>
                </div>
                <button onClick={onClose} className="text-orange-200 hover:text-white">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 px-6 py-6 space-y-6">
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit Details
                  </button>
                )}

                <div className="border rounded-xl p-4 bg-white shadow-sm">
                  <label className="text-xs uppercase text-gray-500 font-bold tracking-wide block mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => {
                      const newStatus = e.target.value as Waitlist['status'];
                      setFormData({...formData, status: newStatus});
                      if (!isEditing) {
                        handleUpdateEntry(entry.id, { status: newStatus });
                      }
                    }}
                    className="w-full border border-gray-300 rounded-lg p-3 bg-white"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="CONVERTED">Converted to Booking</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                <div className="border rounded-xl p-4 bg-gray-50">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center">
                    <Users className="h-4 w-4 mr-2" /> Contact Details
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">First Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          className="w-full border border-gray-300 rounded px-2 py-1"
                        />
                      ) : (
                        <div className="text-gray-900 font-medium">{formData.firstName}</div>
                      )}
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Last Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          className="w-full border border-gray-300 rounded px-2 py-1"
                        />
                      ) : (
                        <div className="text-gray-900 font-medium">{formData.lastName}</div>
                      )}
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">
                        <Mail className="h-3 w-3 inline mr-1" />
                        Email
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full border border-gray-300 rounded px-2 py-1"
                        />
                      ) : (
                        <a href={'mailto:' + formData.email} className="text-blue-600 hover:underline">{formData.email}</a>
                      )}
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">
                        <Phone className="h-3 w-3 inline mr-1" />
                        Phone
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full border border-gray-300 rounded px-2 py-1"
                        />
                      ) : (
                        <a href={'tel:' + formData.phone} className="text-blue-600 hover:underline">{formData.phone}</a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border rounded-xl p-4 bg-gray-50">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Request Details</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-500 block text-xs mb-1">Participants</span>
                      {isEditing ? (
                        <input
                          type="number"
                          min="1"
                          value={formData.participants}
                          onChange={(e) => setFormData({...formData, participants: parseInt(e.target.value) || 1})}
                          className="w-full border border-gray-300 rounded px-2 py-1"
                        />
                      ) : (
                        <span className="font-medium text-gray-900">{formData.participants} {formData.participants === 1 ? 'person' : 'people'}</span>
                      )}
                    </div>
                    <div>
                      <span className="text-gray-500 block text-xs mb-1">Preferred Date</span>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.preferredDate || ''}
                          onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                          className="w-full border border-gray-300 rounded px-2 py-1"
                          placeholder="Optional"
                        />
                      ) : (
                        <span className="font-medium text-gray-900">{formData.preferredDate || 'No preference'}</span>
                      )}
                    </div>
                    <div>
                      <span className="text-gray-500 block text-xs">Submitted</span>
                      <span className="font-medium text-gray-900">{new Date(formData.submittedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-xl p-4 bg-gray-50">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" /> Message
                  </h3>
                  {isEditing ? (
                    <textarea
                      value={formData.message || ''}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 min-h-[80px]"
                      placeholder="Customer message..."
                    />
                  ) : (
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{formData.message || 'No message provided'}</p>
                  )}
                </div>

                {isEditing && (
                  <div className="flex gap-3">
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
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Waitlist Management</h1>
        <p className="text-gray-600">Manage customer waitlist requests for fully booked tours</p>
      </div>

      <div className="mb-6 space-y-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2 flex-1">
            <ListFilter className="h-5 w-5 text-gray-400" />
            <select
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={selectedTour}
              onChange={(e) => setSelectedTour(e.target.value)}
            >
              <option value="ALL">All Tours</option>
              {uniqueTours.map((tour) => (
                <option key={tour.id} value={tour.id}>{tour.title}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONTACTED">Contacted</option>
              <option value="CONVERTED">Converted</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-xs text-gray-500 uppercase font-medium mb-1">Total Entries</p>
          <p className="text-2xl font-bold text-gray-900">{waitlist.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-xs text-gray-500 uppercase font-medium mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{waitlist.filter(w => w.status === 'PENDING').length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-xs text-gray-500 uppercase font-medium mb-1">Contacted</p>
          <p className="text-2xl font-bold text-blue-600">{waitlist.filter(w => w.status === 'CONTACTED').length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-xs text-gray-500 uppercase font-medium mb-1">Converted</p>
          <p className="text-2xl font-bold text-green-600">{waitlist.filter(w => w.status === 'CONVERTED').length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWaitlist.length > 0 ? filteredWaitlist.map((entry) => (
                <tr 
                  key={entry.id} 
                  className="hover:bg-gray-50 transition cursor-pointer" 
                  onClick={() => setSelectedEntry(entry)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-600">
                    {entry.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{entry.firstName} {entry.lastName}</div>
                    <div className="text-xs text-gray-500 flex items-center mt-1">
                      <Mail className="h-3 w-3 mr-1" />
                      {entry.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{entry.tourTitle}</div>
                    <div className="text-xs text-gray-500">{entry.preferredDate || 'No preference'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-gray-400" />
                      {entry.participants}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(entry.submittedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ' + getStatusColor(entry.status)}>
                      {entry.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No waitlist entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">Showing {filteredWaitlist.length} of {waitlist.length} entries</p>
        </div>
      </div>

      {selectedEntry && <WaitlistDetailsPanel entry={selectedEntry} onClose={() => setSelectedEntry(null)} />}
    </div>
  );
};
