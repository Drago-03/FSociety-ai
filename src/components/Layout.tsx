import React from 'react';
import { Shield, Activity, Users, Settings as SettingsIcon, MessageSquare, Link } from 'lucide-react';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useTheme } from '../theme/ThemeProvider';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, requireAuth = false }) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  
  const menuItems = [
    { icon: Shield, label: 'Dashboard', path: '/' },
    { icon: Activity, label: 'Content Queue', path: '/queue' },
    { icon: Users, label: 'Analytics', path: '/analytics' },
    { icon: MessageSquare, label: 'Community', path: '/community' },
    { icon: Link, label: 'Integrations', path: '/integrations' },
    { icon: SettingsIcon, label: 'Settings', path: '/settings' }
  ];

  // For public pages like Terms, Privacy Policy, etc.
  if (!user && !requireAuth) {
    return (
      <div className="min-h-screen bg-primary-deep text-neutral-light">
        <div className="max-w-4xl mx-auto p-8">
          {children}
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-primary-deep text-neutral-light">
      <Sidebar menuItems={menuItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout; 