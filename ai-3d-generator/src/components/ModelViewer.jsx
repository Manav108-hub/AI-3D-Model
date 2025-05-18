// src/components/ModelViewer.jsx
import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, useGLTF } from '@react-three/drei';
import { LampModel } from './models/LampModel';
import { VaseModel } from './models/VaseModel';
import { ChairModel } from './models/ChairModel';
import { CushionModel } from './models/CushionModel';
import { FrameModel } from './models/FrameModel';

// Optional: dynamic loader if you end up loading glb URLs
function GLTFViewer({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} dispose={null} />;
}

export const ModelViewer = ({ modelData, modelUrl, sceneRef }) => {
  // Pick your hard-coded components or the GLTF model URL
  const getComponent = () => {
    if (modelUrl) return <GLTFViewer url={modelUrl} />;
    switch (modelData.geometry) {
      case 'lamp':    return <LampModel color={modelData.color} />;
      case 'vase':    return <VaseModel color={modelData.color} />;
      case 'chair':   return <ChairModel color={modelData.color} />;
      case 'cushion': return <CushionModel color={modelData.color} />;
      case 'frame':   return <FrameModel color={modelData.color} />;
      default:        return <VaseModel color={modelData.color} />;
    }
  };

  return (
    <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
      <Canvas
        onCreated={({ scene }) => {
          // stash the scene object for export later
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
