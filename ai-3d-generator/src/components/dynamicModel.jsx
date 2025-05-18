import React from 'react';

const DynamicModel = ({ modelConfig, position = [0, 0, 0] }) => {
  if (!modelConfig || !modelConfig.config) {
    return null;
  }

  const { config } = modelConfig;
  const { structure, primaryColor, materialProperties, styleModifications } = config;

  // Helper function to create material
  const createMaterial = (customColor = primaryColor) => {
    const materialProps = {
      color: customColor,
      roughness: materialProperties?.roughness || 0.7,
      metalness: materialProperties?.metalness || 0.1,
      transparent: materialProperties?.opacity < 1.0,
      opacity: materialProperties?.opacity || 1.0,
    };

    // Apply style modifications
    if (styleModifications?.vibrantColors) {
      materialProps.emissive = customColor;
      materialProps.emissiveIntensity = 0.1;
    }

    return <meshStandardMaterial {...materialProps} />;
  };

  // Helper function to render component based on model type
  const renderComponent = (key, componentData, index = 0) => {
    if (!componentData) return null;

    const uniqueKey = `${key}-${index}`;
    const { position: pos, geometry } = componentData;

    // Apply position offset
    const finalPosition = [
      position[0] + pos[0],
      position[1] + pos[1],
      position[2] + pos[2],
    ];

    // Determine component type for rendering
    if (key === 'legs' || key.includes('leg')) {
      return (
        <mesh key={uniqueKey} position={finalPosition}>
          <cylinderGeometry args={[geometry[0], geometry[0], geometry[1], 8]} />
          {createMaterial(materialProperties?.metalness > 0.5 ? '#C0C0C0' : primaryColor)}
        </mesh>
      );
    }

    // Default to box geometry for most components
    return (
      <mesh key={uniqueKey} position={finalPosition}>
        <boxGeometry args={geometry} />
        {createMaterial()}
      </mesh>
    );
  };

  // Render different model types
  const renderModel = () => {
    const components = [];

    Object.entries(structure).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Handle arrays (like legs)
        value.forEach((item, index) => {
          components.push(renderComponent(key, item, index));
        });
      } else {
        // Handle single components
        components.push(renderComponent(key, value));
      }
    });

    return components;
  };

  return (
    <group position={position}>
      {renderModel()}
      
      {/* Add ambient lighting for better visualization */}
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} />
    </group>
  );
};

export default DynamicModel;