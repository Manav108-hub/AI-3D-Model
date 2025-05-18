import React, { useMemo } from 'react';
import * as THREE from 'three';

export const VaseModel = ({ color, dimensions = {} }) => {
    const defaultTopRadius = 0.4;
    const defaultBottomRadius = 0.6;
    const defaultHeight = 2;
    const defaultMidRadius = 0.8;
    const defaultRimThickness = 0.1;
    const defaultNeckHeight = defaultHeight * 0.4;
    const defaultNeckRadius = 0.3;

    const topRadius = dimensions.radiusTop ?? defaultTopRadius;
    const bottomRadius = dimensions.radiusBottom ?? defaultBottomRadius;
    const height = dimensions.height ?? defaultHeight;
    const midRadius = dimensions.midRadius ?? defaultMidRadius;
    const rimThickness = dimensions.rimThickness ?? defaultRimThickness;
    const neckHeight = dimensions.neckHeight ?? defaultNeckHeight;
    const neckRadius = dimensions.neckRadius ?? defaultNeckRadius;

    const points = useMemo(() => {
        const pts = [];
        const segments = 32;

        // Bottom
        for (let i = 0; i <= segments; i++) {
            const a = (i / segments) * Math.PI * 2;
            const x = bottomRadius * Math.cos(a);
            const z = bottomRadius * Math.sin(a);
            pts.push(new THREE.Vector2(x, 0));
        }
        // Middle
        for (let i = 0; i <= segments; i++) {
            const a = (i / segments) * Math.PI * 2;
            const x = midRadius * Math.cos(a);
            const z = midRadius * Math.sin(a);
            pts.push(new THREE.Vector2(x, height * 0.6));
        }

        // Neck
        for (let i = 0; i <= segments; i++) {
            const a = (i / segments) * Math.PI * 2;
            const x = neckRadius * Math.cos(a);
            const z = neckRadius * Math.sin(a);
            pts.push(new THREE.Vector2(x, height - neckHeight));
        }

        // Top (Rim)
        for (let i = 0; i <= segments; i++) {
            const a = (i / segments) * Math.PI * 2;
            const x = (topRadius + rimThickness) * Math.cos(a);
            const z = (topRadius + rimThickness) * Math.sin(a);
            pts.push(new THREE.Vector2(x, height));
        }
        return pts;
    }, [topRadius, bottomRadius, height, midRadius, rimThickness, neckHeight, neckRadius]);

    const geometry = useMemo(() => {
        try {
            return new THREE.LatheGeometry(points, 32);
        } catch (error) {
            console.error("Error creating LatheGeometry:", error);
            return null;
        }
    }, [points]);

    if (!geometry) {
        return null;
    }

    return (
        <mesh position={[0, height / 2, 0]}>
            <primitive object={geometry} />
            <meshStandardMaterial
                color={color}
                roughness={0.2}
                metalness={0.1}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
};