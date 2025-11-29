import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Package,
  Bed,
  Shield,
  Utensils,
  Wrench,
  Activity,
  Car,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { TourAddOn, AddOnType, AddOnCategory } from '../../../src/features/tours/types/tour.types';
import { AddOnService } from '../../../src/features/tours/services/addon.service';
import { Button, Input, Select } from '../../../src/shared/components/ui';
import { formatCurrency } from '../../../src/shared/utils';

const ADDON_TYPE_ICONS: Record<AddOnType, React.ReactNode> = {
  [AddOnType.EXTRA_NIGHT]: <Bed className="h-5 w-5" />,
  [AddOnType.INSURANCE]: <Shield className="h-5 w-5" />,
  [AddOnType.EQUIPMENT]: <Wrench className="h-5 w-5" />,
  [AddOnType.MEAL]: <Utensils className="h-5 w-5" />,
  [AddOnType.ACTIVITY]: <Activity className="h-5 w-5" />,
  [AddOnType.TRANSPORT]: <Car className="h-5 w-5" />,
  [AddOnType.OTHER]: <Package className="h-5 w-5" />,
};

const EMPTY_ADDON: Omit<TourAddOn, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '',
  description: '',
  type: AddOnType.OTHER,
  category: AddOnCategory.SERVICES,
  price: 0,
  currency: 'SEK',
  imageUrl: '',
  isAvailable: true,
  isMandatory: false,
  maxQuantity: 10,
  minQuantity: 1,
  tourIds: [],
  pricePerPerson: true,
  displayOrder: 0,
};

export const TourAddons: React.FC = () => {
  const [addOns, setAddOns] = useState<TourAddOn[]>([]);
  const [filteredAddOns, setFilteredAddOns] = useState<TourAddOn[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<AddOnCategory | 'ALL'>('ALL');
  const [filterType, setFilterType] = useState<AddOnType | 'ALL'>('ALL');
  
  // Edit/Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddOn, setEditingAddOn] = useState<TourAddOn | null>(null);
  const [formData, setFormData] = useState<Omit<TourAddOn, 'id' | 'createdAt' | 'updatedAt'>>(EMPTY_ADDON);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Load add-ons
  useEffect(() => {
    loadAddOns();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...addOns];

    if (searchQuery) {
      filtered = filtered.filter(
        (addOn) =>
          addOn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          addOn.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterCategory !== 'ALL') {
      filtered = filtered.filter((addOn) => addOn.category === filterCategory);
    }

    if (filterType !== 'ALL') {
      filtered = filtered.filter((addOn) => addOn.type === filterType);
    }

    setFilteredAddOns(filtered);
  }, [addOns, searchQuery, filterCategory, filterType]);

  const loadAddOns = async () => {
    setIsLoading(true);
    try {
      const data = await AddOnService.getAll();
      setAddOns(data);
    } catch (error) {
      showNotification('error', 'Failed to load add-ons');
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenModal = (addOn?: TourAddOn) => {
    if (addOn) {
      setEditingAddOn(addOn);
      setFormData(addOn);
    } else {
      setEditingAddOn(null);
      setFormData({ ...EMPTY_ADDON, displayOrder: addOns.length + 1 });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAddOn(null);
    setFormData(EMPTY_ADDON);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.description || formData.price <= 0) {
      showNotification('error', 'Please fill all required fields');
      return;
    }

    setIsSaving(true);
    try {
      if (editingAddOn) {
        await AddOnService.update(editingAddOn.id, formData);
        showNotification('success', 'Add-on updated successfully');
      } else {
        await AddOnService.create(formData);
        showNotification('success', 'Add-on created successfully');
      }
      await loadAddOns();
      handleCloseModal();
    } catch (error) {
      showNotification('error', 'Failed to save add-on');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await AddOnService.delete(id);
      showNotification('success', 'Add-on deleted successfully');
      await loadAddOns();
    } catch (error) {
      showNotification('error', 'Failed to delete add-on');
    }
  };

  const handleToggleAvailability = async (addOn: TourAddOn) => {
    try {
      await AddOnService.update(addOn.id, { isAvailable: !addOn.isAvailable });
      showNotification('success', `Add-on ${addOn.isAvailable ? 'disabled' : 'enabled'}`);
      await loadAddOns();
    } catch (error) {
      showNotification('error', 'Failed to update availability');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading add-ons...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tour Add-ons</h1>
          <p className="text-gray-600 mt-1">Manage optional extras and upgrades for tour bookings</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="h-4 w-4 mr-2" />
          Create Add-on
        </Button>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 ${
            notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          {notification.message}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search add-ons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as AddOnCategory | 'ALL')}
            options={[
              { value: 'ALL', label: 'All Categories' },
              ...Object.values(AddOnCategory).map((cat) => ({
                value: cat,
                label: cat.replace('_', ' ')
              }))
            ]}
          />
          <Select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value as AddOnType | 'ALL')}
            options={[
              { value: 'ALL', label: 'All Types' },
              ...Object.values(AddOnType).map((type) => ({
                value: type,
                label: type.replace('_', ' ')
              }))
            ]}
          />
        </div>
      </div>

      {/* Add-ons Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredAddOns.map((addOn) => (
          <div
            key={addOn.id}
            className={`bg-white rounded-lg shadow-sm border p-5 ${
              !addOn.isAvailable ? 'opacity-60 border-gray-300' : 'border-gray-200'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${addOn.isAvailable ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'}`}>
                  {ADDON_TYPE_ICONS[addOn.type]}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{addOn.name}</h3>
                  <p className="text-xs text-gray-500">{addOn.category.replace('_', ' ')}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleOpenModal(addOn)}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Edit"
                >
                  <Edit2 className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDelete(addOn.id, addOn.name)}
                  className="p-1 hover:bg-red-50 rounded"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{addOn.description}</p>

            {/* Details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Price:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(addOn.price, addOn.currency)}
                  {addOn.pricePerPerson ? ' /person' : ' /booking'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quantity:</span>
                <span className="text-gray-900">
                  {addOn.minQuantity} - {addOn.maxQuantity > 0 ? addOn.maxQuantity : '∞'}
                </span>
              </div>
              {addOn.isMandatory && (
                <div className="flex items-center gap-1 text-orange-600">
                  <AlertCircle className="h-3 w-3" />
                  <span className="text-xs font-medium">Mandatory</span>
                </div>
              )}
            </div>

            {/* Availability Toggle */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleToggleAvailability(addOn)}
                className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition ${
                  addOn.isAvailable
                    ? 'bg-green-50 text-green-700 hover:bg-green-100'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {addOn.isAvailable ? 'Available' : 'Unavailable'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredAddOns.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No add-ons found</p>
          <Button onClick={() => handleOpenModal()} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Create First Add-on
          </Button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingAddOn ? 'Edit Add-on' : 'Create Add-on'}
              </h2>
              <button onClick={handleCloseModal} className="p-1 hover:bg-gray-100 rounded">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Extra Night in Stockholm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of the add-on"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  rows={3}
                />
              </div>

              {/* Type and Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <Select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as AddOnType })}
                    options={Object.values(AddOnType).map((type) => ({
                      value: type,
                      label: type.replace('_', ' ')
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <Select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as AddOnCategory })
                    }
                    options={Object.values(AddOnCategory).map((cat) => ({
                      value: cat,
                      label: cat.replace('_', ' ')
                    }))}
                  />
                </div>
              </div>

              {/* Price and Currency */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <Select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    options={[
                      { value: 'SEK', label: 'SEK' },
                      { value: 'EUR', label: 'EUR' },
                      { value: 'USD', label: 'USD' }
                    ]}
                  />
                </div>
              </div>

              {/* Quantity Limits */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Quantity</label>
                  <Input
                    type="number"
                    value={formData.minQuantity}
                    onChange={(e) =>
                      setFormData({ ...formData, minQuantity: parseInt(e.target.value) })
                    }
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Quantity (0 = unlimited)
                  </label>
                  <Input
                    type="number"
                    value={formData.maxQuantity}
                    onChange={(e) =>
                      setFormData({ ...formData, maxQuantity: parseInt(e.target.value) })
                    }
                    min="0"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.pricePerPerson}
                    onChange={(e) => setFormData({ ...formData, pricePerPerson: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Price is per person</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isMandatory}
                    onChange={(e) => setFormData({ ...formData, isMandatory: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Mandatory add-on</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Available for booking</span>
                </label>
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                <Input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <Input
                  value={formData.imageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <Button variant="outline" onClick={handleCloseModal} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {editingAddOn ? 'Update' : 'Create'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
