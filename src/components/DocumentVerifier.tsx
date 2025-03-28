import React, { useState, useRef } from 'react';
import { AlertTriangle, FileText, CheckCircle, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import documentVerifier from '../utils/documentVerification';

interface VerificationResult {
  isAuthentic: boolean;
  confidence: number;
  issues: string[];
  category: string;
}

const DocumentVerifier: React.FC = () => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setVerificationResult(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setVerificationResult(null);
    }
  };

  const handleVerify = async () => {
    if (!file) return;

    setIsVerifying(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 200);

      // Use document verification utility
      const result = await documentVerifier.verifyDocument(file);
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Process verification result
      const verificationResult: VerificationResult = {
        isAuthentic: result.is_authentic,
        confidence: result.confidence,
        issues: result.issues || [],
        category: result.category
      };

      setVerificationResult(verificationResult);
      toast.success('Document verification complete');
    } catch (error) {
      console.error('Error verifying document:', error);
      toast.error('Failed to verify document');
    } finally {
      setIsVerifying(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setVerificationResult(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Document Verification</h2>
      
      {!file ? (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            ref={fileInputRef}
            accept=".pdf,.doc,.docx,.txt,.rtf"
          />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-md font-medium text-gray-900">Upload a document</h3>
          <p className="text-sm text-gray-500 mt-1">Drag and drop or click to browse</p>
          <p className="text-xs text-gray-400 mt-2">Supported formats: PDF, DOC, DOCX, TXT, RTF</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-indigo-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600"
              disabled={isVerifying}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {isVerifying ? (
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 text-center">
                {uploadProgress < 100 ? 'Uploading and verifying...' : 'Processing document...'}
              </p>
            </div>
          ) : (
            <button
              onClick={handleVerify}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={!file}
            >
              Verify Document
            </button>
          )}

          {verificationResult && (
            <div className={`mt-4 p-4 rounded-lg ${verificationResult.isAuthentic ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-start">
                {verificationResult.isAuthentic ? (
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 mr-3" />
                )}
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {verificationResult.isAuthentic ? 'Document appears authentic' : 'Document may contain issues'}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Confidence: {(verificationResult.confidence * 100).toFixed(1)}%
                  </p>
                  {verificationResult.issues.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-900">Issues detected:</p>
                      <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                        {verificationResult.issues.map((issue, index) => (
                          <li key={index}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentVerifier;