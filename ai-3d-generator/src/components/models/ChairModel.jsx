// src/components/models/ChairModel.jsx
import React from 'react';

export const ChairModel = ({ color }) => (
  <group>
    <mesh position={[0, 1, 0]}>
      <boxGeometry args={[2, 0.2, 2]} />
      <meshStandardMaterial color={color} />
    </mesh>
    <mesh position={[0, 2.5, -0.9]}>
      <boxGeometry args={[2, 3, 0.2]} />
      <meshStandardMaterial color={color} />
    </mesh>
    <mesh position={[-0.9, 0.5, -0.9]}>
      <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
      <meshStandardMaterial color="#654321" />
    </mesh>
    <mesh position={[0.9, 0.5, -0.9]}>
      <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
      <meshStandardMaterial color="#654321" />
    </mesh>
    <mesh position={[-0.9, 0.5, 0.9]}>
      <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
      <meshStandardMaterial color="#654321" />
    </mesh>
    <mesh position={[0.9, 0.5, 0.9]}>
      <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
      <meshStandardMaterial color="#654321" />
    </mesh>
  </group>
);