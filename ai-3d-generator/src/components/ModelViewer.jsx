// src/components/ModelViewer.jsx
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, useGLTF } from '@react-three/drei';
import { LampModel } from './models/LampModel';
import { VaseModel } from './models/VaseModel';
import { ChairModel } from './models/ChairModel';
import { CushionModel } from './models/CushionModel';
import { FrameModel } from './models/FrameModel';

/**
 * If you pass a `modelUrl` prop, it will load that GLTF/GLB.
 * Otherwise it falls back to your custom components.
 */
const GLTFViewer = ({ url }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} dispose={null} />;
};

export const ModelViewer = ({ modelData, modelUrl }) => {
  const getHardcodedComponent = () => {
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
      <Canvas>
        <PerspectiveCamera makeDefault position={[5, 5, 5]} />
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Environment preset="apartment" />
        <Suspense fallback={null}>
          {modelUrl
            ? <GLTFViewer url={modelUrl} />
            : getHardcodedComponent()
          }
        </Suspense>
      </Canvas>
    </div>
  );
};
