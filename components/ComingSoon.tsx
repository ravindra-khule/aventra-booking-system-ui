import React from 'react';
import { Construction } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description?: string;
  features?: string[];
}

export const ComingSoon: React.FC<ComingSoonProps> = ({ 
  title, 
  description = 'This feature is currently under development and will be available soon.',
  features = []
}) => {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <Construction className="w-8 h-8 text-purple-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{title}</h1>
          <p className="text-lg text-gray-600 mb-6">{description}</p>
          
          <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-lg">
            <span className="text-sm font-medium">🚧 Under Development</span>
          </div>
        </div>

        {/* Planned Features */}
        {features.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Planned Features</h2>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-8 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Development Timeline</h2>
          <p className="text-gray-600">
            We're working hard to bring you this feature. Check back soon for updates!
          </p>
          <div className="mt-4 flex gap-2">
            <div className="flex-1 bg-purple-200 h-2 rounded-full">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '30%' }}></div>
            </div>
            <span className="text-sm text-gray-600">30% Complete</span>
          </div>
        </div>
      </div>
    </div>
  );
};
