import React, { useState } from 'react';

const ModelControls = ({ visionResults, onModelGenerate, isGenerating }) => {
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [modelStyle, setModelStyle] = useState('realistic');
  const [modelSize, setModelSize] = useState('medium');

  const handleLabelToggle = (label) => {
    setSelectedLabels(prev => 
      prev.includes(label) 
        ? prev.filter(l => l !== label)
        : [...prev, label]
    );
  };

  const handleGenerate = () => {
    onModelGenerate({
      style: modelStyle,
      size: modelSize
    });
  };

  // Extract labels from Vision API results
  const availableLabels = visionResults ? 
    visionResults.map(result => result.description) : 
    [];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">3D Model Generator</h3>
      
      {/* Label Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Select detected objects:</label>
        <div className="space-y-2">
          {availableLabels.slice(0, 8).map((label, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`label-${index}`}
                  checked={selectedLabels.includes(label)}
                  onChange={() => handleLabelToggle(label)}
                  className="mr-2"
                />
                <label htmlFor={`label-${index}`} className="text-sm">{label}</label>
              </div>
              {visionResults && (
                <span className="text-xs text-gray-500">
                  {(visionResults.find(r => r.description === label)?.score * 100).toFixed(1)}%
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Model Style */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Model Style:</label>
        <select 
          value={modelStyle} 
          onChange={(e) => setModelStyle(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="realistic">Realistic</option>
          <option value="minimalist">Minimalist</option>
          <option value="stylized">Stylized</option>
        </select>
      </div>

      {/* Model Size */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Model Size:</label>
        <select 
          value={modelSize} 
          onChange={(e) => setModelSize(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={!visionResults || isGenerating}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded disabled:bg-gray-300"
      >
        {isGenerating ? 'Generating...' : 'Generate 3D Model'}
      </button>
    </div>
  );
};

export default ModelControls;