import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle, Shield, Lock } from 'lucide-react';

// This is a valid test user UID
const DEFAULT_UID = 'NpyoqK8NPXXa3dTbHC6s9DGJ6Kr2';

const DevLogin = () => {
  const [uid, setUid] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithUID } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (loginUid: string) => {
    setLoading(true);
    try {
      await loginWithUID(loginUid);
      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid.trim()) return;
    await handleLogin(uid.trim());
  };

  const handleQuickLogin = async () => {
    await handleLogin(DEFAULT_UID);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-deep to-neutral-dark">
      <div className="max-w-md w-full space-y-8 p-8 bg-neutral-light/95 backdrop-blur-sm rounded-lg shadow-xl border border-primary-light/20">
        <div>
          <div className="flex justify-center mb-4">
            <Shield className="w-16 h-16 text-primary-light" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-primary-deep">
            Development Login
          </h2>
          <div className="mt-4 bg-alert-warning/10 border border-alert-warning/20 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-alert-warning" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-alert-warning">
                  Development Mode Only
                </h3>
                <p className="mt-2 text-sm text-neutral-dark">
                  This login method is for development purposes only.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Login Button */}
        <div>
          <button
            onClick={handleQuickLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-gradient-to-r from-primary-deep to-primary-light hover:from-primary-light hover:to-primary-deep focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {loading ? (
              <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Quick Login (Test User)
              </>
            )}
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-dark/20" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-neutral-light text-neutral-dark">Or use custom UID</span>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="uid" className="block text-sm font-medium text-primary-deep">
              User ID
            </label>
            <div className="mt-1">
              <input
                id="uid"
                name="uid"
                type="text"
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-neutral-dark/20 bg-white rounded-md shadow-sm placeholder-neutral-dark/50 text-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light transition-colors"
                placeholder="Enter user ID"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !uid.trim()}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-primary-light hover:bg-primary-deep focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {loading ? (
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
              ) : (
                'Login with Custom UID'
              )}
            </button>
          </div>

          <div className="text-sm text-center">
            <p className="text-neutral-dark">
              Default Test UID:{' '}
              <code className="px-2 py-1 bg-primary-light/10 rounded text-sm font-mono text-primary-deep border border-primary-light/20">
                {DEFAULT_UID}
              </code>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DevLogin;