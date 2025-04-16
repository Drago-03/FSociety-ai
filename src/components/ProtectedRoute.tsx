import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield } from 'lucide-react';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [renderTimeout, setRenderTimeout] = useState(false);

  // Safety timeout to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setRenderTimeout(true);
    }, 5000); // 5 seconds max loading time
    
    return () => clearTimeout(timer);
  }, []);

  // If still loading and haven't timed out, show loading indicator
  if (loading && !renderTimeout) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-primary-deep text-neutral-light">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-light mb-4"></div>
        <div className="flex items-center gap-2 mt-4">
          <Shield className="w-5 h-5 text-primary-light" />
          <p className="text-lg">Loading your secure workspace...</p>
        </div>
      </div>
    );
  }

  // If loading timed out or no user, redirect to login
  if (renderTimeout || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render children
  return <>{children}</>;
};

export default ProtectedRoute;