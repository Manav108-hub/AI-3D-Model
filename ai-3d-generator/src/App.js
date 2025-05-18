import React, { useState } from 'react';
import { ModelViewer } from './components/ModelViewer';
import { ImageUploader } from './components/ImageUploader';
import { LoadingSpinner } from './components/LoadingSpinner';

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [generatedModel, setGeneratedModel] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleImageUpload = async (file) => {
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setAnalysis(null);
    setGeneratedModel(null);

    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/analyze-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAnalysis(data.objects);  // Changed from data.labels to data.objects
      setGeneratedModel(data.modelData);
    } catch (error) {
      console.error('Error analyzing image:', error);
      alert('Failed to analyze image. Check the console for details.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerate3D = async () => {
    if (!analysis) return;
    setIsGenerating(true);
    
    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false);
      if (generatedModel) {
        alert("Model Generated from Image Analysis")
      }
    }, 1000);
  };

  const handleDownload = () => {
    if (!generatedModel) return;

    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(generatedModel, null, 2)], {
      type: 'application/json'
    });
    element.href = URL.createObjectURL(file);
    element.download = `model.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setAnalysis(null);
    setGeneratedModel(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header and main content unchanged */}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Upload section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Upload Design Image
            </h2>
            <ImageUploader
              onImageUpload={handleImageUpload}
              isLoading={isAnalyzing}
            />
          </div>

          {/* Analysis Results */}
          {imagePreview && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Image Analysis
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={imagePreview}
                    alt="Uploaded design"
                    className="w-full h-64 object-cover rounded-lg border"
                  />
                </div>
                <div className="space-y-4">
                  {isAnalyzing ? (
                    <LoadingSpinner message="Analyzing your image..." />
                  ) : analysis ? (
                    <div className="space-y-3">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h3 className="font-medium text-green-900">
                          Detected Object: {analysis[0]?.name || 'Unknown'}
                        </h3>
                        <p className="text-green-700 text-sm mt-1">
                          Confidence: {(analysis[0]?.score * 100).toFixed(1)}%
                        </p>
                      </div>
                      <button
                        onClick={handleGenerate3D}
                        disabled={isGenerating}
                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        <span className="mr-2">📦</span>
                        {isGenerating ? 'Generating 3D Model...' : 'Generate 3D Model'}
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}

          {/* Model Viewer */}
          {generatedModel && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Generated 3D Model
                </h2>
                <div className="space-x-3">
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <span className="mr-2">⬇️</span>
                    Download Model
                  </button>
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Start Over
                  </button>
                </div>
              </div>
              {isGenerating ? (
                <LoadingSpinner message="Generating your 3D model..." />
              ) : (
                <div className="space-y-4">
                  <ModelViewer modelData={generatedModel} />
                  {generatedModel && (
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="bg-gray-50 p-3 rounded">
                        <span className="font-medium">Type:</span> {generatedModel.geometry}
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <span className="font-medium">Material:</span> {generatedModel.material}
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <span className="font-medium">Color:</span>
                        <span
                          className="inline-block w-4 h-4 rounded ml-2 align-text-bottom"
                          style={{ backgroundColor: generatedModel.color }}
                        ></span>
                      </div>
                    </div>
                  )}
                  <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded">
                    <strong>Controls:</strong> Click and drag to rotate • Scroll to zoom • Right-click and drag to pan
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;