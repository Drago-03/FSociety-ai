import React, { useState, useEffect, useRef } from 'react';
import { Globe, Search, AlertTriangle, CheckCircle, Loader, Shield, Zap, Skull, Lock, ExternalLink, Activity, Database, Eye, Terminal, Wifi } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import webScraper, { ScrapedContent, ThreatAnalysis } from '../utils/webScraper';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService } from '../utils/ai-service';

const WebVerification = () => {
  const { user } = useAuth();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedContent, setScrapedContent] = useState<ScrapedContent | null>(null);
  const [verificationResult, setVerificationResult] = useState<{
    verified: boolean;
    matchedSources: string[];
    confidence: number;
  } | null>(null);
  const [threatAnalysis, setThreatAnalysis] = useState<ThreatAnalysis | null>(null);
  const [scanningProgress, setScanningProgress] = useState<number>(0);
  const [showRealTimeAlerts, setShowRealTimeAlerts] = useState<boolean>(false);
  const [alertMessages, setAlertMessages] = useState<{message: string, type: 'info' | 'warning' | 'danger' | 'success'}[]>([]);
  const [scanHistory, setScanHistory] = useState<{url: string, threatLevel: string, timestamp: string}[]>([]);
  const [activeTab, setActiveTab] = useState<'scan' | 'history'>('scan');
  const terminalRef = useRef<HTMLDivElement>(null);
  const [showTerminal, setShowTerminal] = useState<boolean>(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    setScrapedContent(null);
    setVerificationResult(null);
    setThreatAnalysis(null);
    setScanningProgress(0);

    try {
      // Validate URL format
      if (!url.match(/^https?:\/\/.+/)) {
        toast.error('Please enter a valid URL starting with http:// or https://');
        setIsLoading(false);
        return;
      }

      // Simulate scanning progress
      const progressInterval = setInterval(() => {
        setScanningProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.floor(Math.random() * 10) + 1;
        });
      }, 300);

      // Use web scraper utility to scrape URL
      const content = await webScraper.scrapeUrl(url);
      setScrapedContent(content);

      if (content.success && content.content) {
        // Verify the scraped content using web scraper utility
        const result = await webScraper.verifyInformation(content.content);
        setVerificationResult(result);
        
        // Analyze content for threats
        const threatResult = await webScraper.analyzeThreatContent(content.content);
        setThreatAnalysis(threatResult);
        
        setScanningProgress(100);
        clearInterval(progressInterval);
        toast.success('Content analysis complete');
      } else {
        clearInterval(progressInterval);
        toast.error('Failed to extract content from URL');
      }
    } catch (error) {
      console.error('Error analyzing URL:', error);
      toast.error('Failed to analyze URL content');
    } finally {
      setIsLoading(false);
    }
  };

  // Animation effect for cyberpunk glitch
  useEffect(() => {
    const glitchElements = document.querySelectorAll('.glitch-effect');
    
    const glitchInterval = setInterval(() => {
      glitchElements.forEach(element => {
        if (Math.random() > 0.7) {
          element.classList.add('glitch-active');
          setTimeout(() => {
            element.classList.remove('glitch-active');
          }, 150);
        }
      });
    }, 2000);
    
    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div className="space-y-6 bg-gray-900 text-cyan-400 p-6 rounded-lg">
      <div className="flex items-center justify-between border-b border-cyan-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-cyan-300 glitch-effect flex items-center">
            <Shield className="h-8 w-8 mr-2 text-cyan-400" />
            Web Threat Scanner
          </h1>
          <p className="text-cyan-500">Detect misinformation, hate speech, and cyber threats in real-time</p>
        </div>
        <div className="flex items-center">
          <Zap className="h-6 w-6 text-yellow-400 animate-pulse" />
          <span className="ml-2 text-yellow-400 font-mono">FSociety AI</span>
        </div>
      </div>

      {/* URL Input Form */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-cyan-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-900 opacity-20 rounded-full blur-xl -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-900 opacity-20 rounded-full blur-xl -ml-10 -mb-10"></div>
        
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-cyan-300 flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              TARGET URL
            </label>
            <div className="mt-2 flex rounded-md shadow-md">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-cyan-700 bg-gray-700 text-cyan-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="text"
                name="url"
                id="url"
                className="focus:ring-cyan-500 focus:border-cyan-500 flex-1 block w-full rounded-none rounded-r-md text-sm border-cyan-700 p-3 border bg-gray-700 text-cyan-100 font-mono"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          
          {scanningProgress > 0 && scanningProgress < 100 && (
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${scanningProgress}%` }}
              ></div>
              <p className="text-xs text-cyan-400 mt-1 font-mono">Scanning: {scanningProgress}%</p>
            </div>
          )}
          
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-lg text-black bg-cyan-400 hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-mono"
            disabled={isLoading || !url}
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                SCANNING TARGET...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                ANALYZE THREATS
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results Section */}
      {activeTab === 'scan' && scrapedContent && (
        <motion.div 
          className="bg-gray-800 rounded-lg shadow-lg p-6 border border-cyan-800 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-purple-900 opacity-10 rounded-full blur-xl -mr-10 -mt-10"></div>
          <div className="absolute inset-0 bg-circuit-pattern opacity-5 pointer-events-none"></div>
          
          <motion.h2 
            className="text-lg font-medium text-cyan-300 mb-4 flex items-center glitch-effect"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ExternalLink className="h-5 w-5 mr-2" />
            TARGET CONTENT ANALYSIS
          </motion.h2>
          
          <motion.div 
            className="border border-gray-700 rounded-md p-4 bg-gray-900 relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500"></div>
            <h3 className="font-medium text-cyan-200">{scrapedContent.title || url}</h3>
            <p className="text-sm text-cyan-600 mb-2 font-mono flex items-center">
              <Globe className="h-3 w-3 mr-1" />
              {url}
            </p>
            <div className="mt-2 text-sm text-gray-400 whitespace-pre-line max-h-60 overflow-y-auto custom-scrollbar">
              {scrapedContent.content}
            </div>
          </motion.div>

          {/* Verification Result */}
          {verificationResult && (
            <motion.div 
              className={`mt-6 p-4 rounded-lg border ${verificationResult.verified ? 'border-green-700 bg-green-900 bg-opacity-30' : 'border-red-700 bg-red-900 bg-opacity-30'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-start">
                {verificationResult.verified ? (
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 mr-3" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 mr-3" />
                )}
                <div className="w-full">
                  <h3 className="text-sm font-medium text-cyan-200">
                    {verificationResult.verified ? 'Content appears authentic' : 'Content may contain misinformation'}
                  </h3>
                  <div className="mt-2 flex items-center">
                    <span className="text-sm text-cyan-400 font-mono">Confidence:</span>
                    <div className="ml-2 w-32 bg-gray-700 rounded-full h-2 overflow-hidden">
                      <motion.div 
                        className={`h-2 rounded-full ${verificationResult.verified ? 'bg-green-500' : 'bg-red-500'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${verificationResult.confidence * 100}%` }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                      ></motion.div>
                    </div>
                    <span className="ml-2 text-sm text-cyan-300 font-mono">{(verificationResult.confidence * 100).toFixed(1)}%</span>
                  </div>
                  {verificationResult.matchedSources.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-cyan-300">Matched trusted sources:</p>
                      <ul className="list-disc list-inside text-sm text-cyan-500 mt-1 font-mono">
                        {verificationResult.matchedSources.map((source, index) => (
                          <motion.li 
                            key={index} 
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + (index * 0.1) }}
                          >
                            {source}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Threat Analysis Section */}
          {threatAnalysis && (
            <motion.div 
              className="mt-6 p-4 rounded-lg border border-cyan-800 bg-gray-900 bg-opacity-70 relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {/* Animated background for critical threats */}
              {threatAnalysis.threatLevel === 'critical' && (
                <div className="absolute inset-0 bg-red-900 bg-opacity-20 animate-pulse rounded-lg"></div>
              )}
              
              <div className="relative z-10">
                <h3 className="text-md font-medium text-cyan-300 mb-3 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-cyan-400" />
                  THREAT INTELLIGENCE REPORT
                </h3>
                
                <div className="flex items-center mb-4">
                  <div className="mr-3">
                    {threatAnalysis.threatLevel === 'none' && <CheckCircle className="w-8 h-8 text-green-400" />}
                    {threatAnalysis.threatLevel === 'low' && <AlertTriangle className="w-8 h-8 text-yellow-400" />}
                    {threatAnalysis.threatLevel === 'medium' && <AlertTriangle className="w-8 h-8 text-orange-400" />}
                    {threatAnalysis.threatLevel === 'high' && <Skull className="w-8 h-8 text-red-400" />}
                    {threatAnalysis.threatLevel === 'critical' && (
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 2
                        }}
                      >
                        <Skull className="w-8 h-8 text-red-600" />
                      </motion.div>
                    )}
                  </div>
                  <div>
                    <div className="text-lg font-bold font-mono">
                      {threatAnalysis.threatLevel === 'none' && <span className="text-green-400">NO THREATS DETECTED</span>}
                      {threatAnalysis.threatLevel === 'low' && <span className="text-yellow-400">LOW THREAT LEVEL</span>}
                      {threatAnalysis.threatLevel === 'medium' && <span className="text-orange-400">MEDIUM THREAT LEVEL</span>}
                      {threatAnalysis.threatLevel === 'high' && <span className="text-red-400">HIGH THREAT LEVEL</span>}
                      {threatAnalysis.threatLevel === 'critical' && <span className="text-red-600 glitch-effect">CRITICAL THREAT LEVEL</span>}
                    </div>
                  </div>
                </div>
                
                {/* Hexagonal Threat Visualization */}
                <div className="mb-6 flex justify-center">
                  <div className="relative w-48 h-48">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {/* Hexagon background */}
                      <polygon 
                        points="50,3 100,28 100,72 50,97 0,72 0,28" 
                        fill="rgba(8, 47, 73, 0.5)" 
                        stroke="#0e7490" 
                        strokeWidth="1"
                      />
                      
                      {/* Threat category lines */}
                      <line x1="50" y1="3" x2="50" y2="97" stroke="rgba(14, 116, 144, 0.3)" strokeWidth="1" />
                      <line x1="0" y1="28" x2="100" y2="72" stroke="rgba(14, 116, 144, 0.3)" strokeWidth="1" />
                      <line x1="0" y1="72" x2="100" y2="28" stroke="rgba(14, 116, 144, 0.3)" strokeWidth="1" />
                      
                      {/* Threat data polygon */}
                      <motion.polygon 
                        points={`
                          50,${50 - 47 * threatAnalysis.categories.hateSpeech} 
                          ${50 + 47 * threatAnalysis.categories.misinformation},${50 - 23.5 * threatAnalysis.categories.misinformation} 
                          ${50 + 47 * threatAnalysis.categories.phishing},${50 + 23.5 * threatAnalysis.categories.phishing} 
                          50,${50 + 47 * threatAnalysis.categories.cyberbullying} 
                          ${50 - 47 * threatAnalysis.categories.malware},${50 + 23.5 * threatAnalysis.categories.malware} 
                          ${50 - 47 * threatAnalysis.categories.misinformation},${50 - 23.5 * threatAnalysis.categories.misinformation}
                        `}
                        fill="rgba(6, 182, 212, 0.3)"
                        stroke="#06b6d4"
                        strokeWidth="1.5"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                      />
                      
                      {/* Data points */}
                      <motion.circle 
                        cx="50" cy={50 - 47 * threatAnalysis.categories.hateSpeech} r="3" 
                        fill="#ef4444" 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                      />
                      <motion.circle 
                        cx={50 + 47 * threatAnalysis.categories.misinformation} 
                        cy={50 - 23.5 * threatAnalysis.categories.misinformation} 
                        r="3" 
                        fill="#eab308" 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1 }}
                      />
                      <motion.circle 
                        cx={50 + 47 * threatAnalysis.categories.phishing} 
                        cy={50 + 23.5 * threatAnalysis.categories.phishing} 
                        r="3" 
                        fill="#3b82f6" 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                      />
                      <motion.circle 
                        cx="50" 
                        cy={50 + 47 * threatAnalysis.categories.cyberbullying} 
                        r="3" 
                        fill="#f97316" 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.3 }}
                      />
                      <motion.circle 
                        cx={50 - 47 * threatAnalysis.categories.malware} 
                        cy={50 + 23.5 * threatAnalysis.categories.malware} 
                        r="3" 
                        fill="#a855f7" 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.4 }}
                      />
                      
                      {/* Labels */}
                      <text x="50" y="0" textAnchor="middle" fill="#ef4444" fontSize="8" fontFamily="monospace">Hate Speech</text>
                      <text x="105" y="25" textAnchor="start" fill="#eab308" fontSize="8" fontFamily="monospace">Misinfo</text>
                      <text x="105" y="75" textAnchor="start" fill="#3b82f6" fontSize="8" fontFamily="monospace">Phishing</text>
                      <text x="50" y="100" textAnchor="middle" fill="#f97316" fontSize="8" fontFamily="monospace">Cyberbullying</text>
                      <text x="-5" y="75" textAnchor="end" fill="#a855f7" fontSize="8" fontFamily="monospace">Malware</text>
                    </svg>
                  </div>
                </div>
                
                {/* Threat Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm text-cyan-400 mb-2 font-mono">THREAT CATEGORIES</h4>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-cyan-300">Hate Speech</span>
                          <span className="text-cyan-400 font-mono">{Math.round(threatAnalysis.categories.hateSpeech * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <motion.div 
                            className="bg-red-500 h-1.5 rounded-full" 
                            initial={{ width: 0 }}
                            animate={{ width: `${threatAnalysis.categories.hateSpeech * 100}%` }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                          ></motion.div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-cyan-300">Misinformation</span>
                          <span className="text-cyan-400 font-mono">{Math.round(threatAnalysis.categories.misinformation * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <motion.div 
                            className="bg-yellow-500 h-1.5 rounded-full" 
                            initial={{ width: 0 }}
                            animate={{ width: `${threatAnalysis.categories.misinformation * 100}%` }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                          ></motion.div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-cyan-300">Cyberbullying</span>
                          <span className="text-cyan-400 font-mono">{Math.round(threatAnalysis.categories.cyberbullying * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <motion.div 
                            className="bg-orange-500 h-1.5 rounded-full" 
                            initial={{ width: 0 }}
                            animate={{ width: `${threatAnalysis.categories.cyberbullying * 100}%` }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                          ></motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm text-cyan-400 mb-2 font-mono">SECURITY RISKS</h4>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-cyan-300">Malware</span>
                          <span className="text-cyan-400 font-mono">{Math.round(threatAnalysis.categories.malware * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <motion.div 
                            className="bg-purple-500 h-1.5 rounded-full" 
                            initial={{ width: 0 }}
                            animate={{ width: `${threatAnalysis.categories.malware * 100}%` }}
                            transition={{ delay: 0.9, duration: 0.8 }}
                          ></motion.div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-cyan-300">Phishing</span>
                          <span className="text-cyan-400 font-mono">{Math.round(threatAnalysis.categories.phishing * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <motion.div 
                            className="bg-blue-500 h-1.5 rounded-full" 
                            initial={{ width: 0 }}
                            animate={{ width: `${threatAnalysis.categories.phishing * 100}%` }}
                            transition={{ delay: 1, duration: 0.8 }}
                          ></motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Detected Threats */}
                {threatAnalysis.detectedThreats.length > 0 && (
                  <motion.div 
                    className="mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                  >
                    <h4 className="text-sm text-cyan-400 mb-2 font-mono flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2 text-red-400" />
                      DETECTED THREATS
                    </h4>
                    <ul className="list-disc list-inside text-sm text-red-400 space-y-1">
                      {threatAnalysis.detectedThreats.map((threat, index) => (
                        <motion.li 
                          key={index} 
                          className="font-mono"
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.2 + (index * 0.1) }}
                        >
                          {threat}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
                
                {/* Security Recommendations */}
                {threatAnalysis.securityRecommendations.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3 }}
                  >
                    <h4 className="text-sm text-cyan-400 mb-2 font-mono flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-cyan-400" />
                      SECURITY RECOMMENDATIONS
                    </h4>
                    <ul className="list-disc list-inside text-sm text-cyan-300 space-y-1">
                      {threatAnalysis.securityRecommendations.map((rec, index) => (
                        <motion.li 
                          key={index}
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.4 + (index * 0.1) }}
                        >
                          {rec}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Tips Section */}
      <motion.div 
        className="bg-gray-800 rounded-lg p-6 border border-cyan-800 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-900 opacity-20 rounded-full blur-xl -mr-10 -mb-10"></div>
        <div className="absolute inset-0 bg-circuit-pattern opacity-5 pointer-events-none"></div>
        
        <h3 className="text-md font-medium text-cyan-300 mb-3 flex items-center glitch-effect">
          <Zap className="w-5 h-5 mr-2 text-yellow-400" />
          FSOCIETY SECURITY PROTOCOLS
        </h3>
        <ul className="list-disc list-inside text-sm text-cyan-400 space-y-2">
          <motion.li initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            Enter the full URL including http:// or https:// for complete analysis
          </motion.li>
          <motion.li initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            Our AI-driven system detects hate speech, misinformation, and cyberbullying in real-time
          </motion.li>
          <motion.li initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            Threat intelligence is powered by machine learning and NLP algorithms
          </motion.li>
          <motion.li initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
            For document verification and deeper analysis, use the Document Verification module
          </motion.li>
          <motion.li initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
            All scans are encrypted and processed securely through our advanced infrastructure
          </motion.li>
        </ul>
      </motion.div>
      
      {/* CSS for cyberpunk effects */}
      <style jsx>{`
        .glitch-effect {
          position: relative;
        }
        
        .glitch-active {
          animation: glitch 0.3s cubic-bezier(.25, .46, .45, .94) both;
        }
        
        @keyframes glitch {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(-2px, -2px);
          }
          60% {
            transform: translate(2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
          100% {
            transform: translate(0);
          }
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #0e7490;
          border-radius: 4px;
        }
        
        /* Grid pattern background */
        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(6, 182, 212, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        /* Circuit pattern background */
        .bg-circuit-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10h80v80H10z' fill='none' stroke='%2306b6d4' stroke-width='0.5' stroke-dasharray='2,2'/%3E%3Cpath d='M30 10v20M50 10v30M70 10v20M10 30h20M10 50h30M10 70h20M70 30h20M50 70h40M70 50h20' stroke='%2306b6d4' stroke-width='0.5'/%3E%3Ccircle cx='30' cy='30' r='2' fill='%2306b6d4' opacity='0.5'/%3E%3Ccircle cx='50' cy='50' r='2' fill='%2306b6d4' opacity='0.5'/%3E%3Ccircle cx='70' cy='70' r='2' fill='%2306b6d4' opacity='0.5'/%3E%3C/svg%3E");
          background-size: 100px 100px;
        }
        
        /* Animated border effect */
        @keyframes borderPulse {
          0% {
            border-color: rgba(6, 182, 212, 0.5);
            box-shadow: 0 0 0 rgba(6, 182, 212, 0);
          }
          50% {
            border-color: rgba(6, 182, 212, 1);
            box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
          }
          100% {
            border-color: rgba(6, 182, 212, 0.5);
            box-shadow: 0 0 0 rgba(6, 182, 212, 0);
          }
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #0891b2;
        }
      `}</style>
    </div>
  );bar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #0e7490;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #0891b2;
        }
      `}</style>
    </div>
  );
};

export default WebVerification;