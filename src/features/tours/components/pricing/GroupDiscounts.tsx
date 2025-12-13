/**
 * Group Discounts Component
 */
import React, { useState } from 'react';
import { GroupDiscountTier } from '../../types/pricing.types';
import { Plus, Edit2, Trash2, Users, X, Check } from 'lucide-react';
import { formatCurrency } from '../../../../shared/utils';

interface GroupDiscountsProps {
  discounts: GroupDiscountTier[];
  basePrice: number;
  onUpdate: (discounts: GroupDiscountTier[]) => void;
}

export const GroupDiscounts: React.FC<GroupDiscountsProps> = ({
  discounts,
  basePrice,
  onUpdate,
}) => {
  const [isEditingId, setIsEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<GroupDiscountTier | null>(null);

  const handleAdd = () => {
    setIsAdding(true);
    setEditingDiscount({
      id: `gd_${Date.now()}`,
      name: '',
      minGroupSize: 2,
      discountPercentage: 5,
    });
  };

  const handleSave = () => {
    if (!editingDiscount || !editingDiscount.name) return;

    if (isAdding) {
      onUpdate([...discounts, editingDiscount]);
      setIsAdding(false);
    } else if (isEditingId) {
      onUpdate(discounts.map(d => (d.id === isEditingId ? editingDiscount : d)));
      setIsEditingId(null);
    }

    setEditingDiscount(null);
  };

  const handleDelete = (id: string) => {
    onUpdate(discounts.filter(d => d.id !== id));
  };

  const calculatePriceForTier = (tier: GroupDiscountTier): number => {
    if (tier.pricePerPerson) return tier.pricePerPerson;
    return basePrice * (1 - tier.discountPercentage / 100);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Group Discounts</h3>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Tier
        </button>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || isEditingId) && editingDiscount && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
          <input
            type="text"
            placeholder="Tier name (e.g., Small Group)"
            value={editingDiscount.name}
            onChange={(e) => setEditingDiscount({ ...editingDiscount, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Minimum Group Size
              </label>
              <input
                type="number"
                min="1"
                value={editingDiscount.minGroupSize}
                onChange={(e) =>
                  setEditingDiscount({
                    ...editingDiscount,
                    minGroupSize: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Maximum Group Size (optional)
              </label>
              <input
                type="number"
                min="1"
                value={editingDiscount.maxGroupSize || ''}
                onChange={(e) =>
                  setEditingDiscount({
                    ...editingDiscount,
                    maxGroupSize: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Unlimited"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Discount Percentage
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={editingDiscount.discountPercentage}
                onChange={(e) =>
                  setEditingDiscount({
                    ...editingDiscount,
                    discountPercentage: parseFloat(e.target.value),
                  })
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">%</span>
              <span className="text-sm font-medium text-gray-900 min-w-fit">
                {formatCurrency(calculatePriceForTier(editingDiscount))}/person
              </span>
            </div>
          </div>

          <textarea
            placeholder="Description (optional)"
            value={editingDiscount.description || ''}
            onChange={(e) => setEditingDiscount({ ...editingDiscount, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            rows={2}
          />

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Check className="h-4 w-4 mr-2" />
              Save
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setIsEditingId(null);
                setEditingDiscount(null);
              }}
              className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Group Discounts List */}
      {discounts.length > 0 ? (
        <div className="space-y-2">
          {discounts.map((discount) => (
            <div
              key={discount.id}
              className="bg-white border border-gray-200 rounded-lg p-4 flex items-start justify-between hover:shadow-sm transition-shadow"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">{discount.name}</h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-sm text-gray-600 ml-11">
                  <div>
                    <span className="text-xs text-gray-500">Min Size</span>
                    <p className="font-medium text-gray-900">{discount.minGroupSize}+ people</p>
                  </div>
                  {discount.maxGroupSize && (
                    <div>
                      <span className="text-xs text-gray-500">Max Size</span>
                      <p className="font-medium text-gray-900">{discount.maxGroupSize}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-xs text-gray-500">Discount</span>
                    <p className="font-medium text-green-600">-{discount.discountPercentage}%</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Price/Person</span>
                    <p className="font-medium text-gray-900">{formatCurrency(calculatePriceForTier(discount))}</p>
                  </div>
                  {discount.description && (
                    <div>
                      <span className="text-xs text-gray-500">Notes</span>
                      <p className="font-medium text-gray-900 truncate">{discount.description}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => {
                    setIsEditingId(discount.id);
                    setEditingDiscount(discount);
                  }}
                  className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(discount.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No group discounts configured</p>
          <p className="text-sm text-gray-500">Add your first tier to encourage group bookings</p>
        </div>
      )}
    </div>
  );
};
