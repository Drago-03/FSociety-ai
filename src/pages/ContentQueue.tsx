import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle, CheckCircle, XCircle, Clock, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { addSampleContent } from '../utils/sampleData';

interface ContentItem {
  id: string;
  content: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
  confidence: number;
  category: string;
}

const ContentQueue = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [addingData, setAddingData] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    loadContentQueue();
  }, [user]);

  const loadContentQueue = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const contentRef = collection(db, 'users', user.uid, 'content');
      const q = query(contentRef, orderBy('timestamp', 'desc'), limit(50));
      const querySnapshot = await getDocs(q);
      
      const items: ContentItem[] = [];
      querySnapshot.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data(),
          timestamp: new Date(doc.data().timestamp?.toDate()).toLocaleString(),
        } as ContentItem);
      });
      
      setContents(items);
    } catch (error) {
      console.error('Error loading content queue:', error);
      toast.error('Failed to load content queue');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleAddSampleData = async () => {
    if (!user) return;
    
    setAddingData(true);
    try {
      await addSampleContent(user.uid);
      toast.success('Sample content added successfully');
      await loadContentQueue();
    } catch (error) {
      console.error('Error adding sample content:', error);
      toast.error('Failed to add sample content');
    } finally {
      setAddingData(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'approved' | 'rejected') => {
    if (!user) return;

    setSavingId(id);
    try {
      const contentRef = doc(db, 'users', user.uid, 'content', id);
      await updateDoc(contentRef, {
        status: newStatus,
        updatedAt: new Date()
      });

      // Update local state
      setContents(prev => prev.map(item => 
        item.id === id ? { ...item, status: newStatus } : item
      ));

      toast.success(`Content ${newStatus} successfully`);
    } catch (error) {
      console.error('Error updating content status:', error);
      toast.error('Failed to update content status');
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Content Queue</h1>
        <p className="text-gray-600">Review and manage content moderation requests</p>
      </div>

      {contents.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">No content to review</h3>
            <p className="text-gray-500">Content will appear here once submitted for moderation.</p>
            <button
              onClick={handleAddSampleData}
              disabled={addingData}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addingData ? (
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              {addingData ? 'Adding...' : 'Add Sample Content'}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Content
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confidence
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contents.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.content}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(item.status)}
                        <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(item.status)}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.confidence}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.timestamp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleStatusChange(item.id, 'approved')}
                          disabled={item.status === 'approved' || savingId === item.id}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Approve"
                        >
                          {savingId === item.id ? (
                            <div className="w-5 h-5 border-t-2 border-b-2 border-green-600 rounded-full animate-spin" />
                          ) : (
                            <CheckCircle className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleStatusChange(item.id, 'rejected')}
                          disabled={item.status === 'rejected' || savingId === item.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Reject"
                        >
                          {savingId === item.id ? (
                            <div className="w-5 h-5 border-t-2 border-b-2 border-red-600 rounded-full animate-spin" />
                          ) : (
                            <XCircle className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentQueue;