import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { aiService } from '../utils/ai-service';
import toast from 'react-hot-toast';

const ContentQueue = () => {
  const [queueItems, setQueueItems] = useState([
    {
      id: '1234',
      content: 'This is a sample content that needs moderation...',
      type: 'text',
      confidence: 89,
      status: 'pending',
      timestamp: '2024-03-10T14:30:00Z'
    },
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadQueueItems();
  }, []);

  const loadQueueItems = async () => {
    setLoading(true);
    try {
      // Simulated API call - replace with actual backend integration
      const mockItems = [
        {
          id: '1234',
          content: 'This is a sample content that needs moderation...',
          type: 'text',
          confidence: 89,
          status: 'pending',
          timestamp: '2024-03-10T14:30:00Z'
        },
        {
          id: '1235',
          content: 'Another content piece requiring review and analysis.',
          type: 'text',
          confidence: 75,
          status: 'pending',
          timestamp: '2024-03-10T14:35:00Z'
        }
      ];

      // Analyze content using AI service
      const analysisResults = await aiService.batchAnalyzeContent(
        mockItems.map(item => item.content)
      );

      const enrichedItems = mockItems.map((item, index) => ({
        ...item,
        analysis: analysisResults[index]
      }));

      setQueueItems(enrichedItems);
    } catch (error) {
      toast.error('Failed to load content queue');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
                    {item.analysis && (
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">Toxicity: {(item.analysis.toxicity * 100).toFixed(1)}%</span>
                        <span className="text-sm text-gray-600">Sentiment: {(item.analysis.sentiment * 100).toFixed(1)}%</span>
                        {item.analysis.flags.hate && (
                          <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">Hate Speech</span>
                        )}
                        {item.analysis.flags.harassment && (
                          <span className="px-2 py-1 text-xs font-medium text-orange-700 bg-orange-100 rounded-full">Harassment</span>
                        )}
                      </div>
                    )}
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