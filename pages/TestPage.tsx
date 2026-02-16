import React from 'react';

export const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-blue-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg p-8 shadow-lg">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">✅ Test Page Works!</h1>
        <p className="text-gray-700 text-lg mb-4">If you can see this, the routing is working correctly.</p>
        
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded">
            <p className="font-semibold text-green-900">✓ Page loaded successfully</p>
            <p className="text-sm text-green-700">Router is working</p>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="font-semibold text-blue-900">Try these links:</p>
            <ul className="text-sm text-blue-700 mt-2 space-y-1">
              <li>• <a href="#/" className="underline">Home</a></li>
              <li>• <a href="#/book/3" className="underline">Booking Page (Tour 3)</a></li>
              <li>• <a href="#/test" className="underline">Test Page</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
