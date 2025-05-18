// src/components/models/FrameModel.jsx
import React from 'react';

export const FrameModel = ({ color }) => (
  <group>
    <mesh position={[0, 0, 0.1]}>
      <boxGeometry args={[3, 4, 0.2]} />
      <meshStandardMaterial color={color} />
    </mesh>
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[2.6, 3.6, 0.1]} />
      <meshStandardMaterial color="#ffffff" />
    </mesh>
  </group>
);