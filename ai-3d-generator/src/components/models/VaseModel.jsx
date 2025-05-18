// src/components/models/VaseModel.jsx
import React from 'react';

export const VaseModel = ({ color, dimensions = {} }) => {
  // pull in the dynamic dimensions (fall back to your defaults)
  const topRadius    = dimensions.topRadius    ?? 0.6;
  const bottomRadius = dimensions.bottomRadius ?? 1.0;
  const height       = dimensions.height       ?? 3;

  return (
    <mesh position={[0, height / 2, 0]}>
      {/* args: [radiusTop, radiusBottom, height, radialSegments] */}
      <cylinderGeometry args={[topRadius, bottomRadius, height, 16]} />
      <meshStandardMaterial
        color={color}
        roughness={0.2}
        metalness={0.1}
      />
    </mesh>
  );
};
