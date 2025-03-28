import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminSection from '../components/AdminSection';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const Dashboard = () => {
  const { user, userData } = useAuth();
  const isAdmin = userData?.role === 'admin';

  const stats = [
    {
      title: 'Total Content Processed',
      value: '15,832',
      change: '+12.3%',
      changeType: 'positive'
    },
    {
      title: 'Flagged Content',
      value: '2,415',
      change: '-8.1%',
      changeType: 'negative'
    },
    {
      title: 'Average Response Time',
      value: '1.2s',
      change: '-24.5%',
      changeType: 'positive'
    },
    {
      title: 'Model Accuracy',
      value: '94.8%',
      change: '+2.3%',
      changeType: 'positive'
    }
  ];

  const recentAlerts = [
    {
      type: 'cyberbullying',
      confidence: 0.92,
      timestamp: '2 minutes ago',
      status: 'pending'
    },
    {
      type: 'misinformation',
      confidence: 0.88,
      timestamp: '15 minutes ago',
      status: 'approved'
    },
    {
      type: 'vulgar',
      confidence: 0.95,
      timestamp: '1 hour ago',
      status: 'rejected'
    }
  ];

  const getAlertIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Monitor and manage content moderation</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
            <div className="mt-2 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <p className={`ml-2 text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Alerts</h2>
          <div className="space-y-4">
            {recentAlerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getAlertIcon(alert.status)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                    </p>
                    <p className="text-xs text-gray-500">{alert.timestamp}</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {(alert.confidence * 100).toFixed(1)}% confidence
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Performance */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Model Performance</h2>
          <div className="space-y-4">
            {['vulgar', 'cyberbullying', 'misinformation'].map((category) => (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {(90 + Math.random() * 5).toFixed(1)}%
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${90 + Math.random() * 5}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Admin Section */}
      {isAdmin && (
        <div className="mt-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Admin Controls</h2>
          <AdminSection />
        </div>
      )}
    </div>
  );
};

export default Dashboard;