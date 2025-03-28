import React, { useState, useEffect } from 'react';
import { Shield, Lock } from 'lucide-react';

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
    <div className="fixed inset-0 bg-gradient-to-br from-green-900 via-green-800 to-green-950 flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Matrix code effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none matrix-code-container">
        <div className="matrix-code"></div>
      </div>
      {/* Binary data streams */}
      <div className="absolute inset-0 flex justify-around pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-full w-px bg-gradient-to-b from-transparent via-green-400/30 to-transparent animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
        ))}
      </div>
      <div className="relative">
        <div className="relative">
          <Shield className="w-24 h-24 text-green-400 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Lock className="w-12 h-12 text-white animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          <div className="absolute -inset-4 border-2 border-green-500/50 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
          <div className="absolute -inset-8 border border-green-400/30 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
        </div>
      </div>
      <h1 className="text-4xl font-bold text-white mt-8 mb-2 glitch-text" data-text="FSociety AI">FSociety AI</h1>
      <p className="text-green-400 mb-8 tracking-wider">SECURE CONTENT MODERATION</p>
      <div className="w-64 h-3 bg-green-900/50 rounded-full overflow-hidden border border-green-700/50 backdrop-blur-sm">
        <div 
          className="h-full bg-gradient-to-r from-green-500 to-green-300 transition-all duration-300 ease-out relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <p className="text-green-300 font-mono tracking-wide">INITIALIZING SYSTEM...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;