import React, { useEffect, useState } from 'react';
import { PromoCode, PromoCodeType, PromoCodeStatus } from '../types/promo.types';
import { Tour } from '../../tours/types/tour.types';
import { PromoCodeService } from '../services/promo.service';
import { TourService } from '../../tours/services/tour.service';
import { Search, Plus, Edit2, Trash2, X, Save, Tag, Calendar, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button, Badge, Input, Select, Modal } from '../../../shared/components/ui';
import { formatCurrency, formatDate } from '../../../shared/utils';

export const PromoCodeManager = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredPromoCodes, setFilteredPromoCodes] = useState<PromoCode[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPromoCode, setEditingPromoCode] = useState<PromoCode | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchPromoCodes = async () => {
    setLoading(true);
    try {
      const data = await PromoCodeService.getAll();
      setPromoCodes(data);
    } catch (error) {
      console.error('Failed to fetch promo codes', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTours = async () => {
    try {
      const data = await TourService.getAll();
      setTours(data);
    } catch (error) {
      console.error('Failed to fetch tours', error);
    }
  };

  useEffect(() => {
    fetchPromoCodes();
    fetchTours();
  }, []);

  useEffect(() => {
    let result = promoCodes;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(pc =>
        pc.code.toLowerCase().includes(q) ||
        pc.description.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'ALL') {
      result = result.filter(pc => pc.status === statusFilter);
    }

    setFilteredPromoCodes(result);
  }, [search, statusFilter, promoCodes]);

  const handleCreateNew = () => {
    setEditingPromoCode(null);
    setIsCreating(true);
    setShowModal(true);
  };

  const handleEdit = (promoCode: PromoCode) => {
    setEditingPromoCode(promoCode);
    setIsCreating(false);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this promo code?')) {
      try {
        await PromoCodeService.delete(id);
        await fetchPromoCodes();
        alert('Promo code deleted successfully!');
      } catch (error) {
        console.error('Failed to delete promo code', error);
        alert('Failed to delete promo code');
      }
    }
  };

  const getStatusBadge = (status: PromoCodeStatus) => {
    switch (status) {
      case PromoCodeStatus.ACTIVE:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>;
      case PromoCodeStatus.INACTIVE:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Inactive</span>;
      case PromoCodeStatus.EXPIRED:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Expired</span>;
      default:
        return null;
    }
  };

  const getTypeBadge = (type: PromoCodeType) => {
    return type === PromoCodeType.PERCENTAGE ? (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Percentage</span>
    ) : (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">Fixed Amount</span>
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promo Code Manager</h1>
          <p className="text-gray-500 mt-1">Create and manage discount codes for bookings</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          <Plus className="h-5 w-5" />
          Create Promo Code
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Codes</p>
              <h3 className="text-2xl font-bold text-gray-900">{promoCodes.length}</h3>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Tag className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Active</p>
              <h3 className="text-2xl font-bold text-green-600">
                {promoCodes.filter(pc => pc.status === PromoCodeStatus.ACTIVE).length}
              </h3>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Expired</p>
              <h3 className="text-2xl font-bold text-red-600">
                {promoCodes.filter(pc => pc.status === PromoCodeStatus.EXPIRED).length}
              </h3>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Usage</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {promoCodes.reduce((sum, pc) => sum + pc.usageCount, 0)}
              </h3>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by code or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ALL">All Status</option>
            <option value={PromoCodeStatus.ACTIVE}>Active</option>
            <option value={PromoCodeStatus.INACTIVE}>Inactive</option>
            <option value={PromoCodeStatus.EXPIRED}>Expired</option>
          </select>
        </div>
      </div>

      {/* Promo Codes Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading promo codes...</div>
        ) : filteredPromoCodes.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Tag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p>No promo codes found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Period</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPromoCodes.map((promoCode) => {
                  const usagePercent = promoCode.usageLimit
                    ? (promoCode.usageCount / promoCode.usageLimit) * 100
                    : 0;
                  const isNearLimit = promoCode.usageLimit && usagePercent >= 80;

                  return (
                    <tr key={promoCode.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-bold text-gray-900">{promoCode.code}</div>
                          <div className="text-sm text-gray-500">{promoCode.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{getTypeBadge(promoCode.type)}</td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">
                          {promoCode.type === PromoCodeType.PERCENTAGE
                            ? `${promoCode.value}%`
                            : `${promoCode.value} SEK`}
                        </span>
                        {promoCode.maxDiscount && (
                          <div className="text-xs text-gray-500">Max: {promoCode.maxDiscount} SEK</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <span className={`font-medium ${isNearLimit ? 'text-orange-600' : 'text-gray-900'}`}>
                            {promoCode.usageCount}
                            {promoCode.usageLimit ? ` / ${promoCode.usageLimit}` : ' / ∞'}
                          </span>
                          {promoCode.usageLimit && (
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                              <div
                                className={`h-1.5 rounded-full ${isNearLimit ? 'bg-orange-500' : 'bg-blue-600'}`}
                                style={{ width: `${Math.min(usagePercent, 100)}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-gray-900">{promoCode.validFrom}</div>
                          <div className="text-gray-500">to {promoCode.validUntil}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(promoCode.status)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(promoCode)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(promoCode.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <PromoCodeModal
          promoCode={editingPromoCode}
          tours={tours}
          onClose={() => {
            setShowModal(false);
            setEditingPromoCode(null);
          }}
          onSave={async () => {
            setShowModal(false);
            setEditingPromoCode(null);
            await fetchPromoCodes();
          }}
          isCreating={isCreating}
        />
      )}
    </div>
  );
};

// Modal Component for Create/Edit
interface PromoCodeModalProps {
  promoCode: PromoCode | null;
  tours: Tour[];
  onClose: () => void;
  onSave: () => void;
  isCreating: boolean;
}

const PromoCodeModal: React.FC<PromoCodeModalProps> = ({ promoCode, tours, onClose, onSave, isCreating }) => {
  const [formData, setFormData] = useState<Partial<PromoCode>>({
    code: promoCode?.code || '',
    description: promoCode?.description || '',
    type: promoCode?.type || PromoCodeType.PERCENTAGE,
    value: promoCode?.value || 0,
    minBookingAmount: promoCode?.minBookingAmount || undefined,
    maxDiscount: promoCode?.maxDiscount || undefined,
    usageLimit: promoCode?.usageLimit || undefined,
    validFrom: promoCode?.validFrom || new Date().toISOString().split('T')[0],
    validUntil: promoCode?.validUntil || '',
    status: promoCode?.status || PromoCodeStatus.ACTIVE,
    applicableTours: promoCode?.applicableTours || [],
    createdBy: promoCode?.createdBy || 'admin',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    // Validation
    if (!formData.code || !formData.description || !formData.validUntil) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.value === undefined || formData.value <= 0) {
      setError('Value must be greater than 0');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      if (isCreating) {
        await PromoCodeService.create(formData as Omit<PromoCode, 'id' | 'usageCount' | 'createdDate'>);
      } else if (promoCode) {
        await PromoCodeService.update(promoCode.id, formData);
      }
      alert(`Promo code ${isCreating ? 'created' : 'updated'} successfully!`);
      onSave();
    } catch (err: any) {
      setError(err.message || 'Failed to save promo code');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {isCreating ? 'Create New Promo Code' : 'Edit Promo Code'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                placeholder="SUMMER2026"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
                placeholder="Summer promotion - 10% off all tours"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as PromoCodeType })}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={PromoCodeType.PERCENTAGE}>Percentage (%)</option>
                <option value={PromoCodeType.FIXED_AMOUNT}>Fixed Amount (SEK)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Value <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={formData.type === PromoCodeType.PERCENTAGE ? "10" : "500"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Booking Amount (SEK)
              </label>
              <input
                type="number"
                value={formData.minBookingAmount || ''}
                onChange={(e) => setFormData({ ...formData, minBookingAmount: e.target.value ? parseFloat(e.target.value) : undefined })}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Optional"
              />
            </div>

            {formData.type === PromoCodeType.PERCENTAGE && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Discount (SEK)
                </label>
                <input
                  type="number"
                  value={formData.maxDiscount || ''}
                  onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Optional"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usage Limit
              </label>
              <input
                type="number"
                value={formData.usageLimit || ''}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Unlimited"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valid From <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.validFrom}
                onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valid Until <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as PromoCodeStatus })}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={PromoCodeStatus.ACTIVE}>Active</option>
                <option value={PromoCodeStatus.INACTIVE}>Inactive</option>
                <option value={PromoCodeStatus.EXPIRED}>Expired</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Applicable Tours (Leave empty for all tours)
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {tours.map((tour) => (
                  <label key={tour.id} className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.applicableTours?.includes(tour.id) || false}
                      onChange={(e) => {
                        const currentTours = formData.applicableTours || [];
                        if (e.target.checked) {
                          setFormData({ ...formData, applicableTours: [...currentTours, tour.id] });
                        } else {
                          setFormData({ ...formData, applicableTours: currentTours.filter(id => id !== tour.id) });
                        }
                      }}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700">{tour.title}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : isCreating ? 'Create' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};
