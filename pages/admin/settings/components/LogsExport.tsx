import React, { useState } from 'react';
import { Download, FileJson, FileText, Sheet } from 'lucide-react';

export const LogsExport: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);

  const handleExport = (format: string) => {
    console.log(`Exporting logs as ${format}`);
    // TODO: Implement backend export API call
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
      >
        <Download size={18} />
        Export
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <button
            onClick={() => handleExport('csv')}
            className="w-full px-4 py-2 text-left hover:bg-gray-50 transition flex items-center gap-2 border-b border-gray-200"
          >
            <Sheet size={16} className="text-green-600" />
            Export as CSV
          </button>
          <button
            onClick={() => handleExport('json')}
            className="w-full px-4 py-2 text-left hover:bg-gray-50 transition flex items-center gap-2 border-b border-gray-200"
          >
            <FileJson size={16} className="text-yellow-600" />
            Export as JSON
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="w-full px-4 py-2 text-left hover:bg-gray-50 transition flex items-center gap-2"
          >
            <FileText size={16} className="text-red-600" />
            Export as PDF
          </button>
        </div>
      )}
    </div>
  );
};
