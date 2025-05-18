// src/components/ModelViewer.jsx
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, useGLTF } from '@react-three/drei';
import { LampModel } from './models/LampModel';
import { VaseModel } from './models/VaseModel';
import { ChairModel } from './models/ChairModel';
import { CushionModel } from './models/CushionModel'; // Import CushionModel
import { FrameModel } from './models/FrameModel';

const GLTFViewer = ({ url }) => {
    const { scene } = useGLTF(url);
    return <primitive object={scene} dispose={null} />;
}

export const ModelViewer = ({ modelData, modelUrl, sceneRef }) => {
    const getComponent = () => {
        if (modelUrl) return <GLTFViewer url={modelUrl} />;
        switch (modelData?.geometry) {
            case 'lamp':
                return <LampModel color={modelData.color} dimensions={modelData.dimensions} />;
            case 'vase':
                return <VaseModel color={modelData.color} dimensions={modelData.dimensions} />;
            case 'chair':
                return <ChairModel color={modelData.color} dimensions={modelData.dimensions} />;
            case 'cushion':
                return <CushionModel color={modelData.color} dimensions={modelData.dimensions} />; // Add CushionModel case
            case 'frame':
                return <FrameModel color={modelData.color} dimensions={modelData.dimensions} />;
            default:
                return null;
        }
    };

    return (
        <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
            <Canvas
                onCreated={({ scene }) => {
                    if (sceneRef) sceneRef.current = scene;
                }}
            >
                <PerspectiveCamera makeDefault position={[5, 5, 5]} />
                <OrbitControls />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Environment preset="apartment" />
                <Suspense fallback={null}>
                    {getComponent()}
                </Suspense>
            </Canvas>
        </div>
    );
};