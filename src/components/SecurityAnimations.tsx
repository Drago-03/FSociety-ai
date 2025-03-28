import React, { useEffect, useRef } from 'react';
import { Trash2, Shield, Bug } from 'lucide-react';
import { 
  createVirusParticle, 
  eliminateVirus, 
  createBug, 
  activateShield, 
  showScanComplete,
  createDataTransfer,
  initTrashBin
} from '../utils/animationEffects';

interface SecurityAnimationsProps {
  containerRef?: React.RefObject<HTMLDivElement>;
}

const SecurityAnimations: React.FC<SecurityAnimationsProps> = ({ containerRef }) => {
  const trashBinRef = useRef<HTMLDivElement>(null);
  const shieldRef = useRef<HTMLDivElement>(null);
  const animationContainerRef = useRef<HTMLDivElement>(null);
  
  // Initialize the trash bin when component mounts
  useEffect(() => {
    if (trashBinRef.current) {
      initTrashBin(trashBinRef.current);
    }
  }, []);

  // Function to create a virus at random position
  const handleCreateVirus = () => {
    const container = containerRef?.current || animationContainerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const x = Math.random() * (rect.width - 50) + 25;
    const y = Math.random() * (rect.height - 100) + 50;
    
    const virus = createVirusParticle(x, y, container);
    
    // Auto-eliminate after a delay
    setTimeout(() => {
      if (virus.parentNode && trashBinRef.current) {
        eliminateVirus(virus, trashBinRef.current);
      }
    }, 3000);
  };

  // Function to create a bug that crawls across the screen
  const handleCreateBug = () => {
    const container = containerRef?.current || animationContainerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const startX = 0;
    const startY = Math.random() * (rect.height - 50) + 25;
    
    const bug = createBug(startX, startY, container);
    
    // Remove the bug after it completes its journey
    setTimeout(() => {
      if (bug.parentNode) {
        bug.parentNode.removeChild(bug);
      }
    }, 8000);
  };

  // Function to activate shield protection
  const handleActivateShield = () => {
    if (shieldRef.current) {
      activateShield(shieldRef.current);
    }
  };

  // Function to show scan complete animation
  const handleScanComplete = () => {
    const container = containerRef?.current || animationContainerRef.current;
    if (container) {
      showScanComplete(container);
    }
  };

  // Function to demonstrate data transfer
  const handleDataTransfer = () => {
    if (shieldRef.current && trashBinRef.current) {
      const container = containerRef?.current || animationContainerRef.current;
      if (container) {
        createDataTransfer(shieldRef.current, trashBinRef.current, 8, container);
      }
    }
  };

  return (
    <div className="p-4 bg-terminal-black-800 rounded-lg border border-cyber-green-700">
      <h3 className="text-xl font-bold mb-4 text-cyber-green-400">Security Animation Demo</h3>
      
      <div 
        ref={animationContainerRef}
        className="relative min-h-[200px] bg-terminal-black-900 rounded border border-cyber-green-900 mb-4 overflow-hidden"
      >
        {/* This is where animations will appear */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <div 
            ref={trashBinRef}
            className="w-12 h-12 flex items-center justify-center bg-terminal-black-700 rounded p-2 cursor-pointer"
          >
            <Trash2 className="w-8 h-8 text-cyber-green-500" />
          </div>
          
          <div 
            ref={shieldRef}
            className="w-12 h-12 flex items-center justify-center bg-terminal-black-700 rounded p-2 cursor-pointer"
            onClick={handleActivateShield}
          >
            <Shield className="w-8 h-8 text-cyber-green-500" />
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <button 
          onClick={handleCreateVirus}
          className="px-4 py-2 bg-red-900 text-white rounded hover:bg-red-800 transition-colors hacker-button"
        >
          Create Virus
        </button>
        
        <button 
          onClick={handleCreateBug}
          className="px-4 py-2 bg-orange-900 text-white rounded hover:bg-orange-800 transition-colors hacker-button"
        >
          <Bug className="inline-block mr-1 w-4 h-4" />
          Release Bug
        </button>
        
        <button 
          onClick={handleActivateShield}
          className="px-4 py-2 bg-cyber-green-900 text-white rounded hover:bg-cyber-green-800 transition-colors hacker-button"
        >
          Activate Shield
        </button>
        
        <button 
          onClick={handleScanComplete}
          className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 transition-colors hacker-button"
        >
          Run Scan
        </button>
        
        <button 
          onClick={handleDataTransfer}
          className="px-4 py-2 bg-purple-900 text-white rounded hover:bg-purple-800 transition-colors hacker-button"
        >
          Transfer Data
        </button>
      </div>
    </div>
  );
};

export default SecurityAnimations;