import React from 'react';

/**
 * Debug page to check available tours
 * Useful for finding valid tour IDs for booking
 */
export const TourDebugPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Available Tours for Booking</h1>
        
        <div className="bg-white rounded-lg shadow-lg border border-blue-200 p-6 space-y-4">
          <p className="text-gray-600">
            Below are the tour IDs you can use for testing the booking system. Replace the <code>tourId</code> in the URL:
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <p className="font-mono text-sm">
              <span className="text-blue-600">http://localhost:3000/#/book/</span>
              <span className="text-red-600 font-bold">{'{tourId}'}</span>
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-bold text-gray-900">Known Working Tour IDs:</h2>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="font-mono text-lg text-green-700 font-bold">✅ Tour ID: 3</p>
              <p className="text-gray-700">Patagonia Adventure Tour</p>
              <p className="text-sm text-gray-600 mt-2">
                Link: <a href="http://localhost:3000/#/book/3" className="text-blue-600 hover:underline">
                  http://localhost:3000/#/book/3
                </a>
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="font-mono text-lg text-red-700 font-bold">❌ Tour ID: 9</p>
              <p className="text-gray-700">Does not exist in the database</p>
              <p className="text-sm text-gray-600 mt-2">Please use a valid tour ID from the list above.</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
            <h3 className="font-bold text-yellow-900 mb-2">💡 How to Find More Tours:</h3>
            <ol className="list-decimal list-inside space-y-1 text-gray-700">
              <li>Go to the home page: <a href="http://localhost:3000/" className="text-blue-600 hover:underline">http://localhost:3000/</a></li>
              <li>View the available tours displayed on the home page</li>
              <li>Note the tour ID from the URL or the tour card</li>
              <li>Use that tour ID in the booking URL: <code className="bg-white px-2 py-1 rounded">#/book/{'{tourId}'}</code></li>
            </ol>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <h3 className="font-bold text-blue-900 mb-2">📝 Test Booking Flow:</h3>
            <p className="text-gray-700">
              Once you have a valid tour ID, you can test the complete booking flow:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 mt-2">
              <li>Step 1: Add travelers</li>
              <li>Step 2: Enter booking details</li>
              <li>Step 3: Choose payment method (Stripe)</li>
              <li>Step 4: View confirmation</li>
            </ul>
          </div>

          <button
            onClick={() => window.location.href = 'http://localhost:3000/'}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition"
          >
            Go to Home Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourDebugPage;
