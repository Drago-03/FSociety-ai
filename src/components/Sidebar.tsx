import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Terminal, Lock, User as UserIcon } from 'lucide-react';
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
    <div className="w-64 bg-gradient-to-br from-primary-deep to-neutral-dark animate-gradient bg-[length:200%_200%] text-neutral-light min-h-screen p-4 relative overflow-hidden">
      {/* Matrix-like code rain effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="matrix-code"></div>
      </div>
      <div className="flex items-center gap-3 mb-8 px-2">
        <Shield className="w-8 h-8 text-primary-light" />
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
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                isActive
                  ? 'bg-primary-light text-white shadow-lg shadow-primary-light/30 border-l-4 border-alert-success'
                  : 'text-neutral-light hover:bg-primary-deep/70 hover:text-white hover:translate-x-1'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      {user && (
        <div 
          onClick={() => navigate('/profile')}
          className="absolute bottom-4 left-4 right-4 cursor-pointer hover:bg-primary-light/20 rounded-lg p-2 transition-all hover:translate-x-1 border border-primary-light/30"
        >
          <div className="px-2 py-1 text-neutral-light">
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
      )}
      
      {!user && (
        <div className="absolute bottom-4 left-4 right-4 p-2">
          <Link 
            to="/login"
            className="flex items-center justify-center gap-2 py-2 rounded-lg bg-primary-light text-white hover:bg-primary-light/90 transition-colors"
          >
            <UserIcon className="w-4 h-4" />
            <span>Login</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Sidebar;