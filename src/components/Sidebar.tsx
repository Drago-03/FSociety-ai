import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';

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

  return (
    <div className="w-64 bg-indigo-900 text-white min-h-screen p-4">
      <div className="flex items-center gap-3 mb-8 px-2">
        <Shield className="w-8 h-8" />
        <span className="text-xl font-bold">FSociety AI</span>
      </div>
      
      <nav>
        {menuItems.map((item, index) => {
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
      
      <div className="absolute bottom-4 left-4 right-4">
        <div className="border-t border-indigo-800 pt-4">
          <div className="flex items-center gap-3 px-4 py-2 text-indigo-200">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Admin"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <p className="text-sm font-semibold">Admin User</p>
              <p className="text-xs opacity-75">admin@indiehub.ai</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;