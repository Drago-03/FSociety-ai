import React from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const ContentQueue = () => {
  const queueItems = [
    {
      id: '1234',
      content: 'This is a sample content that needs moderation...',
      type: 'text',
      confidence: 89,
      status: 'pending',
      timestamp: '2024-03-10T14:30:00Z'
    },
    // Add more mock items as needed
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Content Moderation Queue</h1>
        <p className="text-gray-600">Review and moderate flagged content</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <select className="rounded-md border-gray-300 text-sm">
                <option>All Content Types</option>
                <option>Text</option>
                <option>Images</option>
                <option>Videos</option>
              </select>
              <select className="rounded-md border-gray-300 text-sm">
                <option>All Statuses</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                Bulk Actions
              </button>
            </div>
          </div>
        </div>

        <div className="divide-y">
          {queueItems.map((item) => (
            <div key={item.id} className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-900">#{item.id}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-gray-600 mb-4">{item.content}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <span className="text-sm text-gray-600">Confidence: {item.confidence}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-full">
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-full">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentQueue;