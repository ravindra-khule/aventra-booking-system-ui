import { useState, useCallback } from 'react';

export interface UseToggleResult {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * useToggle Hook
 * 
 * Manage boolean state with convenient toggle, open, and close functions
 * 
 * @param initialValue - Initial boolean value (default: false)
 * @returns Object with isOpen, open, close, and toggle functions
 * 
 * @example
 * const modal = useToggle();
 * 
 * <Button onClick={modal.open}>Open Modal</Button>
 * <Modal isOpen={modal.isOpen} onClose={modal.close}>
 *   Content
 * </Modal>
 */
export function useToggle(initialValue: boolean = false): UseToggleResult {
  const [isOpen, setIsOpen] = useState(initialValue);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle };
}
