// src/components/models/CushionModel.jsx
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';

export const CushionModel = ({ color = '#ffb6c1', dimensions = {} }) => {
    const defaultWidth = 2;
    const defaultHeight = 0.6;
    const defaultDepth = 2;

    const width = dimensions.width ?? defaultWidth;
    const height = dimensions.height ?? defaultHeight;
    const depth = dimensions.depth ?? defaultDepth;

    const normalMap = useLoader(THREE.TextureLoader, '/fabric-normal.png');
    normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
    normalMap.repeat.set(4, 4);

    const geometry = useMemo(() => {
        const geometry = new THREE.BoxGeometry(width, height, depth, 20, 10, 20);
        const pos = geometry.attributes.position;

        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            const z = pos.getZ(i);

            // Normalize X and Z
            const nx = x / (width / 2);
            const nz = z / (depth / 2);

            // Inward curve on sides (concave)
            const inwardAmount = 0.1 * Math.sin(Math.PI * nx) * Math.sin(Math.PI * nz);

            // Sharpen edges at corners (pointy tips)
            const edgeWeight = (Math.abs(nx) + Math.abs(nz)) / 2;
            const tipFactor = edgeWeight > 0.9 ? 1.2 : 1;

            // Apply transformation
            pos.setX(i, x * tipFactor);
            pos.setY(i, y - inwardAmount);
            pos.setZ(i, z * tipFactor);
        }

        geometry.computeVertexNormals();
        return geometry;
    }, [width, height, depth]);

    const material = useMemo(() => {
        return new THREE.MeshStandardMaterial({
            color: new THREE.Color(color),
            roughness: 0.85,
            metalness: 0.0,
            normalMap: normalMap,
            normalScale: new THREE.Vector2(0.4, 0.4),
        });
    }, [color, normalMap]);

    return (
        <mesh geometry={geometry} material={material} position={[0, height / 2, 0]} castShadow receiveShadow />
    );
};
