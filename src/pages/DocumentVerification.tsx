import React, { useState } from 'react';
import { Shield, FileText, Upload, AlertTriangle, CheckCircle, X } from 'lucide-react';
import DocumentVerifier from '../components/DocumentVerifier';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface VerificationStats {
  totalVerified: number;
  authenticCount: number;
  suspiciousCount: number;
  pendingCount: number;
}

const DocumentVerification = () => {
  const { user, userData } = useAuth();
  const [activeTab, setActiveTab] = useState<'upload' | 'history'>('upload');
  
  // Mock verification stats
  const stats: VerificationStats = {
    totalVerified: 128,
    authenticCount: 98,
    suspiciousCount: 22,
    pendingCount: 8
  };

  // Mock verification history
  const verificationHistory = [
    {
      id: '1',
      filename: 'contract_agreement.pdf',
      timestamp: '2023-11-28 14:32',
      status: 'authentic',
      confidence: 0.94,
      category: 'legal_document'
    },
    {
      id: '2',
      filename: 'financial_report_q3.pdf',
      timestamp: '2023-11-27 09:15',
      status: 'suspicious',
      confidence: 0.72,
      category: 'financial_document'
    },
    {
      id: '3',
      filename: 'employee_handbook.docx',
      timestamp: '2023-11-25 16:48',
      status: 'authentic',
      confidence: 0.89,
      category: 'policy_document'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'authentic':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'suspicious':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Shield className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'authentic':
        return 'bg-green-100 text-green-800';
      case 'suspicious':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Verification</h1>
          <p className="text-gray-600">Verify the authenticity of documents and detect misinformation</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Documents Verified</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{stats.totalVerified}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">Authentic Documents</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-green-600">{stats.authenticCount}</p>
            <p className="ml-2 text-sm font-medium text-gray-500">
              ({Math.round((stats.authenticCount / stats.totalVerified) * 100)}%)
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">Suspicious Documents</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-red-600">{stats.suspiciousCount}</p>
            <p className="ml-2 text-sm font-medium text-gray-500">
              ({Math.round((stats.suspiciousCount / stats.totalVerified) * 100)}%)
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">Pending Verification</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-yellow-600">{stats.pendingCount}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('upload')}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === 'upload' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <Upload className="w-4 h-4 inline-block mr-2" />
              Upload Document
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === 'history' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <FileText className="w-4 h-4 inline-block mr-2" />
              Verification History
            </button>
          </nav>
        </div>
        <div className="p-6">
          {activeTab === 'upload' ? (
            <DocumentVerifier />
          ) : (
            <div className="overflow-x-auto">
              {verificationHistory.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No verification history</h3>
                  <p className="text-gray-500">Documents you verify will appear here</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Document
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
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {verificationHistory.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileText className="w-5 h-5 text-gray-400 mr-3" />
                            <div className="text-sm font-medium text-gray-900">{item.filename}</div>
                          </div>
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
                          <div className="text-sm text-gray-900">{item.category.replace('_', ' ')}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{(item.confidence * 100).toFixed(1)}%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{item.timestamp}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentVerification;