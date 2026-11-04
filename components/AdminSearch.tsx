import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CornerDownLeft, Search, SearchX, X } from 'lucide-react';
import { AdminMenuItem, useAdminMenu } from './adminMenu';

interface SearchResult extends AdminMenuItem {
  category: string | null;
}

interface AdminSearchProps {
  autoFocus?: boolean;
  onNavigate?: () => void;
}

// Wraps the matched portion of the label with an accent-colored highlight
const highlightMatch = (text: string, query: string) => {
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <span className="font-semibold" style={{ color: '#ff1b00' }}>
        {text.slice(index, index + query.length)}
      </span>
      {text.slice(index + query.length)}
    </>
  );
};

const AdminSearch: React.FC<AdminSearchProps> = ({ autoFocus = false, onNavigate }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { dashboardItem, visibleCategories } = useAdminMenu();

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Flatten the menu (dashboard + all categories the user's role can access)
  const searchableItems = useMemo<SearchResult[]>(() => {
    const items: SearchResult[] = [{ ...dashboardItem, category: null }];
    visibleCategories.forEach((category) => {
      category.items.forEach((item) => {
        items.push({ ...item, category: category.label });
      });
    });
    return items;
  }, [dashboardItem, visibleCategories]);

  const trimmedQuery = query.trim();

  const results = useMemo(() => {
    if (!trimmedQuery) return [];
    const q = trimmedQuery.toLowerCase();
    return searchableItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q) ||
        item.keywords?.some((keyword) => keyword.toLowerCase().includes(q))
    );
  }, [trimmedQuery, searchableItems]);

  // Highlight the first result whenever the result set changes
  useEffect(() => {
    setActiveIndex(results.length > 0 ? 0 : -1);
  }, [results]);

  // Close the dropdown when clicking outside the component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keep the highlighted option in view while navigating with arrow keys
  useEffect(() => {
    if (activeIndex < 0) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const selectResult = (result: SearchResult) => {
    navigate(result.path);
    setQuery('');
    setIsOpen(false);
    onNavigate?.();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const target = activeIndex >= 0 ? results[activeIndex] : results[0];
      if (target) selectResult(target);
    } else if (event.key === 'Escape') {
      setIsOpen(false);
      event.currentTarget.blur();
    }
  };

  const showDropdown = isOpen && trimmedQuery.length > 0;

  return (
    <div ref={containerRef} className="relative w-full">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
        style={{ color: '#9ca3af' }}
      />
      <input
        type="text"
        value={query}
        autoFocus={autoFocus}
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={t('admin:searchMenu')}
        aria-label={t('admin:searchMenu')}
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls="admin-search-results"
        aria-activedescendant={
          activeIndex >= 0 ? `admin-search-option-${activeIndex}` : undefined
        }
        className="w-full pl-9 pr-8 py-2 text-sm border rounded-lg bg-gray-50 focus:bg-white focus:outline-none transition-colors"
        style={{ borderColor: '#e5e7eb', color: '#111827' }}
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          aria-label={t('admin:clearSearch')}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition-colors"
        >
          <X className="w-3.5 h-3.5" style={{ color: '#6b7280' }} />
        </button>
      )}

      {showDropdown && (
        <div
          className="absolute left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg overflow-hidden z-50"
          style={{ borderColor: '#e5e7eb' }}
        >
          {results.length > 0 ? (
            <ul
              ref={listRef}
              id="admin-search-results"
              role="listbox"
              className="max-h-80 overflow-y-auto py-1"
            >
              {results.map((result, index) => (
                <li
                  key={result.path}
                  id={`admin-search-option-${index}`}
                  data-index={index}
                  role="option"
                  aria-selected={index === activeIndex}
                >
                  <button
                    type="button"
                    onClick={() => selectResult(result)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                    style={
                      index === activeIndex ? { backgroundColor: '#fff1ed' } : undefined
                    }
                  >
                    <span
                      className="flex-shrink-0"
                      style={{ color: index === activeIndex ? '#ff1b00' : '#6b7280' }}
                    >
                      {result.icon}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span
                        className="block text-sm font-medium truncate"
                        style={{ color: '#111827' }}
                      >
                        {highlightMatch(result.label, trimmedQuery)}
                      </span>
                      {result.category && (
                        <span className="block text-xs truncate" style={{ color: '#9ca3af' }}>
                          {result.category}
                        </span>
                      )}
                    </span>
                    {index === activeIndex && (
                      <CornerDownLeft
                        className="w-3.5 h-3.5 flex-shrink-0"
                        style={{ color: '#9ca3af' }}
                      />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center gap-2 px-4 py-6 text-center">
              <SearchX className="w-6 h-6" style={{ color: '#9ca3af' }} />
              <p className="text-sm" style={{ color: '#6b7280' }}>
                {t('admin:noSearchResults')}{' '}
                <span className="font-medium" style={{ color: '#111827' }}>
                  &ldquo;{trimmedQuery}&rdquo;
                </span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminSearch;
