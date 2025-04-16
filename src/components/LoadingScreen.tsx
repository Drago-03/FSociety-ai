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
    <div className="fixed inset-0 bg-gradient-to-br from-primary-deep via-neutral-dark to-primary-deep flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Matrix code effect */}
      <div className="absolute inset-0 opacity-30 pointer-events-none matrix-code-container">
        <div className="matrix-code"></div>
      </div>
      {/* Binary data streams */}
      <div className="absolute inset-0 flex justify-around pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="h-full w-px bg-gradient-to-b from-transparent via-primary-light/40 to-transparent animate-pulse" style={{ animationDelay: `${i * 0.15}s` }}></div>
        ))}
      </div>
      {/* Hexagonal grid pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI0MyI+PHBhdGggZD0iTTI1IDQzTDAgMjEuNSAwIDAgMjUgMCA1MCAwIDUwIDIxLjUgMjUgNDN6IiBmaWxsPSJub25lIiBzdHJva2U9IiMwZjAiIHN0cm9rZS1vcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] bg-repeat"></div>
      </div>
      <div className="relative">
        <div className="relative">
          <Shield className="w-24 h-24 text-primary-light animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Lock className="w-12 h-12 text-white animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          <div className="absolute -inset-4 border-2 border-primary-light/50 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
          <div className="absolute -inset-8 border border-primary-light/30 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
        </div>
      </div>
      <h1 className="text-4xl font-bold text-white mt-8 mb-2 glitch-text" data-text="FSociety AI">FSociety AI</h1>
      <p className="text-primary-light mb-8 tracking-wider">SECURE CONTENT MODERATION</p>
      <div className="w-64 h-3 bg-primary-deep/50 rounded-full overflow-hidden border border-primary-light/50 backdrop-blur-sm">
        <div 
          className="h-full bg-gradient-to-r from-primary-light to-data-teal transition-all duration-300 ease-out relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <div className="w-3 h-3 bg-primary-light rounded-full animate-pulse"></div>
        <p className="text-neutral-light font-mono tracking-wide">INITIALIZING SYSTEM...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;