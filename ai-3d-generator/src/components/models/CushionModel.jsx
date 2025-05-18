// src/components/models/CushionModel.jsx
import React from 'react';

export const CushionModel = ({ color }) => (
  <mesh>
    <boxGeometry args={[2, 0.8, 2]} />
    <meshStandardMaterial color={color} roughness={0.8} />
  </mesh>
);