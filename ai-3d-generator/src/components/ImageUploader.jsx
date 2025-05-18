import React, { useState, useRef } from 'react';
import { CloudArrowUpIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { Image } from '@unpic/react';
import DefaultImage from "../3D-model-Creation.png";

export const ImageUploader = ({ onImageUpload, isLoading }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    if (files && files[0]) {
      onImageUpload(files[0]);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files && files[0]) {
      onImageUpload(files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isLoading}
        />
        <div className="space-y-4">
          {/* <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" /> */}
          <Image src={DefaultImage} width={600} height={400} className='mx-auto h-12 w-12 text-gray-400' />
          <div>
            <p className="text-lg font-medium text-gray-900">
              Drop your design image here
            </p>
            <p className="text-gray-500">
              or click to browse (PNG, JPG, JPEG)
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <CloudArrowUpIcon className="mr-2 h-5 w-5" />
            Select Image
          </button>
        </div>
      </div>
    </div>
  );
};