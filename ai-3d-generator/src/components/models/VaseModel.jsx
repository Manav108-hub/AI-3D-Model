// src/components/models/VaseModel.jsx
import React from 'react';

export const VaseModel = ({ color }) => (
  <mesh>
    <cylinderGeometry args={[0.6, 1.0, 3, 16]} />
    <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} />
  </mesh>
);