import { useState, useEffect, Dispatch, SetStateAction } from 'react';

/**
 * useLocalStorage Hook
 * 
 * Persist state in localStorage with automatic serialization/deserialization
 * 
 * @param key - localStorage key
 * @param initialValue - Initial value if key doesn't exist
 * @returns Tuple of [value, setValue] similar to useState
 * 
 * @example
 * const [user, setUser] = useLocalStorage('user', null);
 * const [theme, setTheme] = useLocalStorage('theme', 'light');
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when value changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
