import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Shield, Activity, Users, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ContentQueue from './pages/ContentQueue';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Team from './pages/Team';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  const menuItems = [
    { icon: Shield, label: 'Dashboard', path: '/' },
    { icon: Activity, label: 'Content Queue', path: '/queue' },
    { icon: Users, label: 'Analytics', path: '/analytics' },
    { icon: SettingsIcon, label: 'Settings', path: '/settings' },
  ];

  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="flex h-screen bg-gray-100">
                  <Sidebar menuItems={menuItems} />
                  <div className="flex-1 overflow-auto flex flex-col">
                    <div className="flex-1 p-8">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/queue" element={<ContentQueue />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/settings" element={<Settings />} />
                      </Routes>
                    </div>
                    <Footer />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;