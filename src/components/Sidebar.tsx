import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface MenuItem {
  icon: any;
  label: string;
  path: string;
}

interface SidebarProps {
  menuItems: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userData } = useAuth();

  // Filter out the Profile menu item
  const filteredMenuItems = menuItems.filter(item => item.label !== 'Profile');

  return (
    <div className="w-64 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 animate-gradient bg-[length:200%_200%] text-white min-h-screen p-4">
      <div className="flex items-center gap-3 mb-8 px-2">
        <Shield className="w-8 h-8" />
        <span className="text-xl font-bold">FSociety AI</span>
      </div>
      
      <nav>
        {filteredMenuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive
                  ? 'bg-indigo-800 text-white'
                  : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div 
        onClick={() => navigate('/profile')}
        className="absolute bottom-4 left-4 right-4 cursor-pointer hover:bg-indigo-800 rounded-lg p-2 transition-colors"
      >
        <div className="px-2 py-1 text-indigo-200">
          <img
            src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.firstName || 'User')}`}
            alt={userData?.firstName || 'User'}
            className="w-8 h-8 rounded-full inline-block mr-3"
          />
          <div className="inline-block">
            <p className="text-sm font-semibold">{userData?.firstName} {userData?.lastName}</p>
            <p className="text-xs opacity-75">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;