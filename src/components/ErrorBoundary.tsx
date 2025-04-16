import React from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { Shield, RefreshCw, Wifi, Home } from 'lucide-react';

const ErrorPage: React.FC = () => {
  const error = useRouteError();
  
  let errorMessage: string;
  let status: number | undefined;
  
  if (isRouteErrorResponse(error)) {
    status = error.status;
    errorMessage = error.statusText || error.data?.message || 'An unexpected error occurred';
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = 'An unknown error occurred';
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary-deep text-neutral-light p-4">
      <div className="max-w-md w-full bg-neutral-dark rounded-lg shadow-lg p-8 border border-primary-light/20">
        <div className="flex items-center justify-center mb-6">
          <Shield className="w-16 h-16 text-primary-light" />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-primary-light text-center">
          {status ? `${status} Error` : 'Oops!'}
        </h1>
        <p className="text-xl mb-6 text-center">{errorMessage}</p>
        <div className="py-2 px-4 mb-6 bg-alert-critical/10 border border-alert-critical/20 rounded text-center">
          <p>Don't worry, we're on it. In the meantime, you can:</p>
        </div>
        <ul className="space-y-4 mb-8">
          <li className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-primary-light" />
            <span>Try refreshing the page</span>
          </li>
          <li className="flex items-center gap-3">
            <Wifi className="w-5 h-5 text-primary-light" />
            <span>Check your internet connection</span>
          </li>
          <li className="flex items-center gap-3">
            <Home className="w-5 h-5 text-primary-light" />
            <span>Return to the homepage</span>
          </li>
        </ul>
        <Link 
          to="/" 
          className="block w-full bg-primary-light hover:bg-primary-light/80 text-white font-bold py-3 px-4 rounded transition-colors duration-200 text-center"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
