import { useState, useCallback } from 'react';

/**
 * Custom hook for managing bulk selection of table rows
 * 
 * @template T - Type of items being selected (must have an 'id' property)
 * @returns Object with selection state and handlers
 */
export const useBulkSelection = <T extends { id: string }>(items: T[]) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const selectAll = useCallback(() => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map(item => item.id)));
    }
  }, [items, selectedIds.size]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const getSelectedItems = useCallback(() => {
    return items.filter(item => selectedIds.has(item.id));
  }, [items, selectedIds]);

  const isSelected = useCallback((id: string) => {
    return selectedIds.has(id);
  }, [selectedIds]);

  return {
    selectedIds,
    selectedCount: selectedIds.size,
    isAllSelected: selectedIds.size === items.length && items.length > 0,
    toggleSelection,
    selectAll,
    clearSelection,
    getSelectedItems,
    isSelected
  };
};
