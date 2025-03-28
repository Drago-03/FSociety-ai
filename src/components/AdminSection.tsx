import React, { useState } from 'react';
import { Upload, Play, AlertTriangle, CheckCircle, Download } from 'lucide-react';
import toast from 'react-hot-toast';

interface TrainingMetrics {
  accuracy: number;
  loss: number;
  epoch: number;
  totalEpochs: number;
}

const AdminSection = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [trainingMetrics, setTrainingMetrics] = useState<TrainingMetrics | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [modelConfig, setModelConfig] = useState({
    epochs: 5,
    batchSize: 32,
    learningRate: 2e-5,
    categories: ['vulgar', 'cyberbullying', 'misinformation']
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv') {
        toast.error('Please upload a CSV file');
        return;
      }
      setSelectedFile(file);
      toast.success('Training data uploaded successfully');
    }
  };

  const handleStartTraining = async () => {
    if (!selectedFile) {
      toast.error('Please upload training data first');
      return;
    }

    setIsTraining(true);
    setTrainingMetrics({
      accuracy: 0,
      loss: 0,
      epoch: 0,
      totalEpochs: modelConfig.epochs
    });

    try {
      // Simulated training progress
      for (let epoch = 1; epoch <= modelConfig.epochs; epoch++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setTrainingMetrics({
          accuracy: Math.min(0.5 + (epoch * 0.1), 0.95),
          loss: Math.max(0.5 - (epoch * 0.1), 0.05),
          epoch,
          totalEpochs: modelConfig.epochs
        });
      }

      toast.success('Model training completed successfully!');
    } catch (error) {
      console.error('Training error:', error);
      toast.error('Error during model training');
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Model Training</h2>
      <div className="space-y-6">
        {/* Model Configuration */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Model Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Number of Epochs</label>
              <input
                type="number"
                value={modelConfig.epochs}
                onChange={(e) => setModelConfig({ ...modelConfig, epochs: parseInt(e.target.value) })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                min="1"
                max="20"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Batch Size</label>
              <input
                type="number"
                value={modelConfig.batchSize}
                onChange={(e) => setModelConfig({ ...modelConfig, batchSize: parseInt(e.target.value) })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                min="8"
                max="128"
                step="8"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Learning Rate</label>
              <input
                type="number"
                value={modelConfig.learningRate}
                onChange={(e) => setModelConfig({ ...modelConfig, learningRate: parseFloat(e.target.value) })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                min="1e-6"
                max="1e-3"
                step="1e-6"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {modelConfig.categories.map((category) => (
              <span
                key={category}
                className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        {/* Upload Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Training Data</h3>
          <div className="flex items-center space-x-4">
            <label className="flex-1">
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".csv"
                  className="hidden"
                  disabled={isTraining}
                />
                <div className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 cursor-pointer">
                  <Upload className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    {selectedFile ? selectedFile.name : 'Upload training data (CSV)'}
                  </span>
                </div>
              </div>
            </label>
            <button
              onClick={handleStartTraining}
              disabled={!selectedFile || isTraining}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isTraining ? (
                <>
                  <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2" />
                  Training...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Training
                </>
              )}
            </button>
          </div>
        </div>

        {/* Training Progress */}
        {trainingMetrics && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Training Progress</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Accuracy</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {(trainingMetrics.accuracy * 100).toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Loss</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {trainingMetrics.loss.toFixed(4)}
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(trainingMetrics.epoch / trainingMetrics.totalEpochs) * 100}%`
                  }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Epoch {trainingMetrics.epoch} of {trainingMetrics.totalEpochs}
              </p>
            </div>
          </div>
        )}

        {/* Model Information */}
        <div className="bg-indigo-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-indigo-900 mb-2">Model Information</h3>
          <div className="space-y-2">
            <p className="text-sm text-indigo-700">
              <span className="font-medium">Base Model:</span> DistilBERT (uncased)
            </p>
            <p className="text-sm text-indigo-700">
              <span className="font-medium">Task:</span> Multi-label Content Moderation
            </p>
            <p className="text-sm text-indigo-700">
              <span className="font-medium">Categories:</span> Vulgar Content, Cyberbullying, Misinformation
            </p>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800">Training Tips</h4>
              <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside space-y-1">
                <li>Ensure your training data is properly labeled</li>
                <li>Use a balanced dataset for better results</li>
                <li>Consider using data augmentation for minority classes</li>
                <li>Monitor the loss to avoid overfitting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSection; 