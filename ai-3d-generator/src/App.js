import React, { useState, useRef, useEffect } from 'react';
import { ModelViewer } from './components/ModelViewer';
import { ImageUploader } from './components/ImageUploader';
import { LoadingSpinner } from './components/LoadingSpinner';
import DefaultImage from './3D-model-Creation.png';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';

const App = () => {
    const [analysis, setAnalysis] = useState(null);
    const [generatedModel, setGeneratedModel] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const sceneRef = useRef();
    const [imageSrc, setImageSrc] = useState(DefaultImage);

    useEffect(() => {
        return () => {
            if (imagePreview && imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    useEffect(() => {
        if (imagePreview) {
            setImageSrc(imagePreview);
        } else {
            setImageSrc(DefaultImage);
        }
    }, [imagePreview]);

    const handleImageUpload = async (file) => {
        if (imagePreview && imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }

        const previewURL = URL.createObjectURL(file);
        setImagePreview(previewURL);
        setAnalysis(null);
        setGeneratedModel(null);
        setIsAnalyzing(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('http://localhost:5000/api/analyze-image', {
                method: 'POST',
                body: formData,
            });
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            console.log("Frontend received data:", data);
            setAnalysis(data.objects);
            setGeneratedModel(data.modelData);
        } catch (err) {
            console.error("Frontend error:", err);
            alert('Image analysis and model generation failed.');
            setGeneratedModel(null); // Ensure no model is displayed on failure
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleGenerate3D = () => {
        if (!analysis) return;
        setIsGenerating(true);
        setTimeout(() => setIsGenerating(false), 500);
    };

    const handleDownload = () => {
        if (!generatedModel || !sceneRef.current) return;

        const exporter = new GLTFExporter();
        exporter.parse(
            sceneRef.current,
            (result) => {
                let blob;
                let filename;
                if (result instanceof ArrayBuffer) {
                    blob = new Blob([result], { type: 'application/octet-stream' });
                    filename = 'model.glb';
                } else {
                    blob = new Blob([JSON.stringify(result, null, 2)], {
                        type: 'application/json',
                    });
                    filename = 'model.gltf';
                }
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);
            },
            { binary: true }
        );
    };

    const handleReset = () => {
        if (imagePreview && imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }
        setAnalysis(null);
        setGeneratedModel(null);
        setImagePreview(null);
        setImageSrc(DefaultImage);
    };

    const handleImageError = (e) => {
        console.error('Failed to load image:', e.target.src);
        e.target.src = '/api/placeholder/400/300';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="mb-4 text-xl font-semibold text-gray-900">
                            Upload Design Image
                        </h2>
                        <ImageUploader
                            onImageUpload={handleImageUpload}
                            isLoading={isAnalyzing}
                        />
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="mb-4 text-xl font-semibold text-gray-900">
                            {imagePreview ? 'Image Analysis' : 'Default Design Image'}
                        </h2>
                        <div className="md:grid md:grid-cols-2 gap-6">
                            <div className="relative">
                                <img
                                    src={imageSrc}
                                    alt={imagePreview ? "Uploaded preview" : "Default design image"}
                                    className="w-full max-h-64 object-contain rounded-lg border"
                                    onError={handleImageError}
                                />
                                {isAnalyzing && (
                                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                                        <LoadingSpinner message="Analyzing your image..." />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                {imagePreview && (
                                    <>
                                        {isAnalyzing ? (
                                            <div className="p-4 bg-blue-50 rounded-lg">
                                                <h3 className="font-medium text-blue-900">
                                                    Processing...
                                                </h3>
                                                <p className="text-blue-700 text-sm">
                                                    Please wait while we analyze your image
                                                </p>
                                            </div>
                                        ) : (
                                            analysis && (
                                                <>
                                                    <div className="p-4 bg-green-50 rounded-lg">
                                                        <h3 className="font-medium text-green-900">
                                                            Detected: {analysis[0]?.name || 'Unknown'}
                                                        </h3>
                                                        <p className="text-green-700 text-sm">
                                                            Confidence: {(analysis[0]?.score * 100).toFixed(1)}%
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={handleGenerate3D}
                                                        disabled={isGenerating}
                                                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 disabled:opacity-50"
                                                    >
                                                        {isGenerating ? 'Generating...' : 'Generate 3D'}
                                                    </button>
                                                </>
                                            )
                                        )}
                                        <button
                                            onClick={handleReset}
                                            className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                                        >
                                            Reset to Default
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {generatedModel && (
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Generated 3D Model
                                </h2>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleDownload}
                                        className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
                                    >
                                        Download GLTF
                                    </button>
                                    <button
                                        onClick={handleReset}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>
                            <ModelViewer modelData={generatedModel} sceneRef={sceneRef} />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default App;