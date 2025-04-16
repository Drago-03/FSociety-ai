import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, LogIn, User, AlertCircle } from 'lucide-react';

const AuthError: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary-deep text-neutral-light p-4">
      <div className="max-w-md w-full bg-neutral-dark rounded-lg shadow-lg p-8 border border-primary-light/20">
        <div className="flex items-center justify-center mb-6">
          <Shield className="w-16 h-16 text-primary-light" />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-primary-light text-center">
          Authentication Error
        </h1>
        <div className="flex items-center justify-center mb-6 text-alert-critical">
          <AlertCircle className="w-6 h-6 mr-2" />
          <p className="text-xl">Authentication required</p>
        </div>
        <div className="py-2 px-4 mb-6 bg-alert-critical/10 border border-alert-critical/20 rounded text-center">
          <p>Please sign in to access this feature:</p>
        </div>
        <ul className="space-y-4 mb-8">
          <li className="flex items-center gap-3">
            <User className="w-5 h-5 text-primary-light" />
            <span>Sign in with your account</span>
          </li>
          <li className="flex items-center gap-3">
            <LogIn className="w-5 h-5 text-primary-light" />
            <span>Create a new account</span>
          </li>
        </ul>
        <div className="flex gap-4">
          <Link 
            to="/login" 
            className="flex-1 bg-primary-light hover:bg-primary-light/80 text-white font-bold py-3 px-4 rounded transition-colors duration-200 text-center"
          >
            Sign In
          </Link>
          <Link 
            to="/dev-login" 
            className="flex-1 bg-neutral-light/10 hover:bg-neutral-light/20 border border-primary-light/30 text-neutral-light font-bold py-3 px-4 rounded transition-colors duration-200 text-center"
          >
            Dev Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthError; 