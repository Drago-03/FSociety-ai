import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Shield, AlertCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorTimestamp: number | null;
}

class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorTimestamp: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorTimestamp: Date.now()
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    console.error('Error caught by AppErrorBoundary:', error);
    console.error('Component stack:', errorInfo.componentStack);

    // Auto-reset error state after 1 minute to prevent being stuck
    setTimeout(() => {
      if (this.state.hasError) {
        this.setState({
          hasError: false,
          error: null,
          errorInfo: null,
          errorTimestamp: null
        });
        window.location.href = '/login'; // Redirect to login as a fallback
      }
    }, 60000); // 1 minute
  }

  isAuthError(error: Error): boolean {
    const errorMessage = error?.message?.toLowerCase() || '';
    return (
      errorMessage.includes('auth') ||
      errorMessage.includes('authentication') ||
      errorMessage.includes('useauth') ||
      errorMessage.includes('permission') ||
      errorMessage.includes('unauthorized') ||
      errorMessage.includes('login') ||
      errorMessage.includes('sign in') ||
      errorMessage.includes('firebase')
    );
  }

  handleReload = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorTimestamp: null
    });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorTimestamp: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // For auth errors, redirect to login
      if (this.state.error && this.isAuthError(this.state.error)) {
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
                <p className="text-xl">{this.state.error?.message || 'Authentication required'}</p>
              </div>
              <div className="flex gap-4">
                <Link 
                  to="/login" 
                  onClick={this.handleGoHome}
                  className="flex-1 bg-primary-light hover:bg-primary-light/80 text-white font-bold py-3 px-4 rounded transition-colors duration-200 text-center"
                >
                  Sign In
                </Link>
                <Link 
                  to="/dev-login" 
                  onClick={this.handleGoHome}
                  className="flex-1 bg-neutral-light/10 hover:bg-neutral-light/20 border border-primary-light/30 text-neutral-light font-bold py-3 px-4 rounded transition-colors duration-200 text-center"
                >
                  Dev Login
                </Link>
              </div>
            </div>
          </div>
        );
      }
      
      // For other errors
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-primary-deep text-neutral-light p-4">
          <div className="max-w-md w-full bg-neutral-dark rounded-lg shadow-lg p-8 border border-primary-light/20">
            <div className="flex items-center justify-center mb-6">
              <Shield className="w-16 h-16 text-alert-critical" />
            </div>
            <h1 className="text-2xl font-bold mb-4 text-alert-critical text-center">
              Something went wrong
            </h1>
            <div className="py-4 px-4 mb-6 bg-alert-critical/10 border border-alert-critical/20 rounded">
              <div className="flex items-start mb-2">
                <AlertCircle className="w-5 h-5 text-alert-critical mr-2 mt-1 flex-shrink-0" />
                <p>{this.state.error?.message || 'An unexpected error occurred'}</p>
              </div>
              {import.meta.env.DEV && this.state.errorInfo && (
                <details className="mt-4 text-xs overflow-auto max-h-40 bg-neutral-dark/50 p-2 rounded">
                  <summary className="cursor-pointer text-primary-light mb-2">View Component Stack</summary>
                  <pre>{this.state.errorInfo.componentStack}</pre>
                </details>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <button
                onClick={this.handleReload}
                className="flex items-center justify-center bg-primary-light hover:bg-primary-light/80 text-white font-bold py-3 px-4 rounded transition-colors duration-200 text-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload Page
              </button>
              <Link 
                to="/"
                onClick={this.handleGoHome}
                className="flex items-center justify-center bg-neutral-light/10 hover:bg-neutral-light/20 border border-primary-light/30 text-neutral-light font-bold py-3 px-4 rounded transition-colors duration-200 text-center"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary; 