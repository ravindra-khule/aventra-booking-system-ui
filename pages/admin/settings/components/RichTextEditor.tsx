import React, { useState } from 'react';
import { FileText, Bold, Italic, List } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Enter your text...',
  rows = 6,
}) => {
  const [isFormatting, setIsFormatting] = useState(false);

  const insertFormatting = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea[data-editor="company-description"]') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const beforeText = value.substring(0, start);
    const afterText = value.substring(end);

    const newText = beforeText + before + selectedText + after + afterText;
    onChange(newText);

    // Move cursor after inserted text
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + before.length + selectedText.length;
      textarea.focus();
    }, 0);
  };

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-3 bg-gray-100 rounded-t-lg border border-b-0 border-gray-300">
        <button
          onClick={() => insertFormatting('**', '**')}
          title="Bold"
          className="p-2 hover:bg-gray-200 rounded transition flex items-center gap-1"
        >
          <Bold size={16} className="text-gray-700" />
          <span className="text-xs font-medium hidden sm:inline">Bold</span>
        </button>

        <button
          onClick={() => insertFormatting('*', '*')}
          title="Italic"
          className="p-2 hover:bg-gray-200 rounded transition flex items-center gap-1"
        >
          <Italic size={16} className="text-gray-700" />
          <span className="text-xs font-medium hidden sm:inline">Italic</span>
        </button>

        <div className="w-px bg-gray-300"></div>

        <button
          onClick={() => insertFormatting('\n• ')}
          title="Bullet List"
          className="p-2 hover:bg-gray-200 rounded transition flex items-center gap-1"
        >
          <List size={16} className="text-gray-700" />
          <span className="text-xs font-medium hidden sm:inline">List</span>
        </button>

        <button
          onClick={() => insertFormatting('\n\n---\n\n')}
          title="Divider"
          className="p-2 hover:bg-gray-200 rounded transition flex items-center gap-1 text-xs"
        >
          <span className="text-gray-700">—</span>
          <span className="text-xs font-medium hidden sm:inline">Divider</span>
        </button>

        <div className="ml-auto text-xs text-gray-500 flex items-center">
          {value.length} characters
        </div>
      </div>

      {/* Editor */}
      <textarea
        data-editor="company-description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 border border-gray-300 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-vertical font-mono text-sm"
      />

      {/* Preview Info */}
      <div className="flex gap-4 text-xs text-gray-500 mt-2">
        <span>💡 Use **text** for bold, *text* for italic</span>
        <span>•</span>
        <span>Supports markdown formatting</span>
      </div>
    </div>
  );
};
