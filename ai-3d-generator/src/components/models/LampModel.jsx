// src/components/models/LampModel.jsx
import React from 'react';
import { meshStandardMaterial } from '@react-three/fiber';

export const LampModel = ({ color }) => (
  <group>
    <mesh position={[0, 0, 0]}>
      <cylinderGeometry args={[0.8, 1.2, 0.3, 8]} />
      <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
    </mesh>
    <mesh position={[0, 1, 0]}>
      <cylinderGeometry args={[0.1, 0.1, 2, 8]} />
      <meshStandardMaterial color="#333" />
    </mesh>
    <mesh position={[0, 2.5, 0]}>
      <cylinderGeometry args={[1.5, 1.2, 1.8, 16]} />
      <meshStandardMaterial color="#f0f0f0" transparent opacity={0.8} />
    </mesh>
  </group>
);