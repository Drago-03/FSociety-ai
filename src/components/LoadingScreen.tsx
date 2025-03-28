import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const hasSeenSplash = localStorage.getItem('hasSeenSplash');
    const lastSeen = localStorage.getItem('splashLastSeen');
    const now = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000; // 1 day in milliseconds
    
    // Show splash only if never seen before or if it's been more than a day
    if (hasSeenSplash && lastSeen && (now - parseInt(lastSeen)) < oneDay) {
      setShowSplash(false);
      onComplete();
      return;
    }

    // Faster loading progress
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setShowSplash(false);
            localStorage.setItem('hasSeenSplash', 'true');
            localStorage.setItem('splashLastSeen', now.toString());
            onComplete();
          }, 200); // Reduced delay
          return 100;
        }
        return prev + 4; // Increased increment
      });
    }, 25); // Reduced interval

    return () => clearInterval(timer);
  }, [onComplete]);

  if (!showSplash) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 flex flex-col items-center justify-center z-50">
      <div className="relative">
        <Shield className="w-24 h-24 text-white animate-pulse" />
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-16">
          <svg className="animate-spin" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeDasharray="32"
              strokeLinecap="round"
              strokeDashoffset="0"
            />
            <circle
              className="opacity-75"
              cx="12"
              cy="12"
              r="10"
              stroke="white"
              strokeWidth="4"
              fill="none"
              strokeDasharray="32"
              strokeLinecap="round"
              strokeDashoffset="16"
            />
          </svg>
        </div>
      </div>
      <h1 className="text-4xl font-bold text-white mt-8 mb-2">FSociety AI</h1>
      <p className="text-indigo-200 mb-8">Secure Content Moderation</p>
      <div className="w-64 h-2 bg-indigo-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-white transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-indigo-200 mt-4">Loading System...</p>
    </div>
  );
};

export default LoadingScreen; 