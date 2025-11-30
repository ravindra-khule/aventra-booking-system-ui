/**
 * EmailEditor - Rich text editor for email templates with placeholder support
 */

import React, { useState, useRef } from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  Image,
  Code,
  Type,
  AtSign
} from 'lucide-react';
import {
  EMAIL_PLACEHOLDERS,
  formatPlaceholder,
  getPlaceholdersByCategory
} from '../constants/email.constants';
import { PlaceholderType } from '../types/email.types';

interface EmailEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  height?: string;
}

export const EmailEditor: React.FC<EmailEditorProps> = ({
  value,
  onChange,
  label = 'Email Content',
  placeholder = 'Start typing your email content...',
  height = '400px'
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showPlaceholders, setShowPlaceholders] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Handle content changes
  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Execute formatting command
  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  // Insert placeholder at cursor position
  const insertPlaceholder = (placeholderType: PlaceholderType) => {
    const placeholder = formatPlaceholder(placeholderType);
    const placeholderHtml = `<span class="placeholder" contenteditable="false" style="display: inline-block; padding: 2px 8px; background-color: #e0e7ff; color: #4338ca; border-radius: 4px; font-size: 0.875rem; font-family: monospace; margin: 0 2px;">${placeholder}</span>&nbsp;`;
    
    document.execCommand('insertHTML', false, placeholderHtml);
    setShowPlaceholders(false);
    editorRef.current?.focus();
  };

  // Insert link
  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  // Insert image
  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      executeCommand('insertImage', url);
    }
  };

  // Get filtered placeholders
  const filteredPlaceholders = selectedCategory === 'all'
    ? EMAIL_PLACEHOLDERS
    : getPlaceholdersByCategory(selectedCategory);

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        {/* Toolbar */}
        <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap items-center gap-1">
          {/* Text Formatting */}
          <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
            <button
              type="button"
              onClick={() => executeCommand('bold')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('italic')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('underline')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Underline"
            >
              <Underline className="w-4 h-4" />
            </button>
          </div>

          {/* Font Size */}
          <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
            <select
              onChange={(e) => executeCommand('fontSize', e.target.value)}
              className="text-sm border-0 bg-transparent focus:ring-0"
              title="Font Size"
            >
              <option value="1">Small</option>
              <option value="3" selected>Normal</option>
              <option value="5">Large</option>
              <option value="7">Huge</option>
            </select>
          </div>

          {/* Alignment */}
          <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
            <button
              type="button"
              onClick={() => executeCommand('justifyLeft')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('justifyCenter')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('justifyRight')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </button>
          </div>

          {/* Lists */}
          <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
            <button
              type="button"
              onClick={() => executeCommand('insertUnorderedList')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('insertOrderedList')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
          </div>

          {/* Insert */}
          <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
            <button
              type="button"
              onClick={insertLink}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Insert Link"
            >
              <Link className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={insertImage}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Insert Image"
            >
              <Image className="w-4 h-4" />
            </button>
          </div>

          {/* Placeholders */}
          <div className="relative flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowPlaceholders(!showPlaceholders)}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Insert Placeholder"
            >
              <AtSign className="w-4 h-4" />
              Insert Variable
            </button>

            {/* Placeholders Dropdown */}
            {showPlaceholders && (
              <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
                {/* Category Tabs */}
                <div className="border-b border-gray-200 p-2 overflow-x-auto">
                  <div className="flex gap-1 min-w-max">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                        selectedCategory === 'all'
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      All
                    </button>
                    {['customer', 'booking', 'tour', 'payment', 'company', 'system'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1 text-xs font-medium rounded capitalize transition-colors ${
                          selectedCategory === cat
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Placeholder List */}
                <div className="max-h-64 overflow-y-auto">
                  {filteredPlaceholders.map((placeholder) => (
                    <button
                      key={placeholder.key}
                      type="button"
                      onClick={() => insertPlaceholder(placeholder.key)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {placeholder.label}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {placeholder.description}
                          </div>
                          <div className="text-xs font-mono text-blue-600 mt-1">
                            {formatPlaceholder(placeholder.key)}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Editor Area */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          dangerouslySetInnerHTML={{ __html: value }}
          className="p-4 focus:outline-none prose max-w-none"
          style={{ minHeight: height }}
          data-placeholder={placeholder}
        />
      </div>

      {/* Helper Text */}
      <p className="text-xs text-gray-500">
        Use the toolbar to format your email. Click "Insert Variable" to add dynamic content placeholders.
      </p>

      {/* Click outside to close placeholders */}
      {showPlaceholders && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowPlaceholders(false)}
        />
      )}
    </div>
  );
};
