// src/components/models/CushionModel.jsx
import React from 'react';

export const CushionModel = ({ color, dimensions = {} }) => {
  const width  = dimensions.width  ?? 2;
  const height = dimensions.height ?? 0.8;
  const depth  = dimensions.depth  ?? 2;

  return (
    <mesh position={[0, height / 2, 0]}>
      {/* args: [width, height, depth] */}
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial
        color={color}
        roughness={0.8}
      />
    </mesh>
  );
};
