import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { HelpCircle } from 'lucide-react';
import LoadingScreen from './components/LoadingScreen';
import DemoGuide from './components/DemoGuide';
import { useAuth } from './context/AuthContext';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showDemoGuide, setShowDemoGuide] = useState(false);
  const { loading: authLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        const hasSeenDemo = localStorage.getItem('hasSeenDemo');
        if (!hasSeenDemo) {
          setShowDemoGuide(true);
          localStorage.setItem('hasSeenDemo', 'true');
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <>
      <LoadingScreen onComplete={() => setIsLoading(false)} />
      {!isLoading && (
        <>
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#ECF0F1',
                color: '#2C3E50',
              },
              success: {
                style: {
                  background: '#2ECC71',
                  color: '#fff',
                },
              },
              error: {
                style: {
                  background: '#E74C3C',
                  color: '#fff',
                },
              },
            }}
          />
          
          {/* Help button - floating above all content */}
          <button 
            onClick={() => setShowDemoGuide(true)}
            className="fixed bottom-20 right-6 p-3 rounded-full bg-primary-light text-white shadow-lg hover:bg-primary-deep transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 z-40"
            title="Show Demo Guide"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Demo Guide */}
          {showDemoGuide && (
            <DemoGuide onClose={() => setShowDemoGuide(false)} />
          )}
        </>
      )}
    </>
  );
}

export default App;