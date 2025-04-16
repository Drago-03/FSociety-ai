import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, X, Shield, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Step {
  title: string;
  description: string;
  image?: string;
  action?: () => void;
  actionLabel?: string;
}

interface DemoGuideProps {
  onClose: () => void;
}

const DemoGuide: React.FC<DemoGuideProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps: Step[] = [
    {
      title: 'Welcome to FSociety AI',
      description: 'This guided tour will show you how our cybersecurity content moderation platform works.'
    },
    {
      title: 'Dashboard Overview',
      description: 'The dashboard provides a real-time overview of your content moderation metrics and recent alerts.'
    },
    {
      title: 'Content Queue',
      description: 'Review and moderate content flagged by our AI. Approve safe content or reject harmful content.'
    },
    {
      title: 'Analytics',
      description: 'Track moderation performance and identify trends in content violations over time.'
    },
    {
      title: 'Community',
      description: 'Connect with other security professionals and share best practices for content moderation.'
    },
    {
      title: 'Settings',
      description: 'Configure your AI sensitivity, notification preferences, and API integrations.'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Shield className="w-8 h-8 text-cyber-green-400" />;
      case 1:
        return <Shield className="w-8 h-8 text-cyber-green-400" />;
      case 2:
        return <Clock className="w-8 h-8 text-yellow-500 animate-pulse" />;
      case 3:
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 4:
        return <AlertTriangle className="w-8 h-8 text-yellow-500" />;
      case 5:
        return <XCircle className="w-8 h-8 text-red-500" />;
      default:
        return <Shield className="w-8 h-8 text-cyber-green-400" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-terminal-black-800 border border-cyber-green-700 rounded-lg shadow-lg w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-cyber-green-900">
          <h3 className="text-xl font-bold text-cyber-green-400">FSociety AI Demo Guide</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-cyber-green-900/50 text-cyber-green-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 min-h-[300px]">
          <div className="flex items-center mb-6">
            {getStepIcon(currentStep)}
            <h4 className="text-xl font-bold ml-3 text-white">{steps[currentStep].title}</h4>
          </div>
          
          <p className="text-gray-300 mb-6">{steps[currentStep].description}</p>
          
          {/* Progress indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {steps.map((_, index) => (
              <div 
                key={index} 
                className={`w-2 h-2 rounded-full ${index === currentStep ? 'bg-cyber-green-400' : 'bg-gray-600'}`}
              />
            ))}
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex justify-between p-4 border-t border-cyber-green-900 bg-terminal-black-900">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center px-4 py-2 rounded-md text-cyber-green-400 hover:bg-cyber-green-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </button>
          
          <button
            onClick={handleNext}
            className="flex items-center px-4 py-2 rounded-md bg-cyber-green-700 text-white hover:bg-cyber-green-600 transition-colors"
          >
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
            {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoGuide;