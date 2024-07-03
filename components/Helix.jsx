import React, { useState, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const COLORS = ['orange', 'blue', 'green', 'red', 'purple'];

const SpiralHelix = ({ pitch, length, helixRadius, tubeRadius, rotationSpeed }) => {
  const ref = useRef();

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      Array(length).fill().map((_, i) => {
        const t = i / length;
        const angle = 2 * Math.PI * t;
        return new THREE.Vector3(
          Math.cos(angle) * helixRadius,
          t * pitch,
          Math.sin(angle) * helixRadius
        );
      })
    );
  }, [length, pitch, helixRadius]);

  const segments = useMemo(() => {
    const points = curve.getPoints(length);
    const segmentLength = 10;
    const segmentCount = Math.floor(points.length / segmentLength);

    return Array(segmentCount).fill().map((_, i) => {
      const start = i * segmentLength;
      const end = start + segmentLength + 1;
      const segmentPoints = points.slice(start, end);
      const segmentCurve = new THREE.CatmullRomCurve3(segmentPoints);

      return {
        geometry: new THREE.TubeGeometry(segmentCurve, segmentPoints.length - 1, tubeRadius, 8, false),
        color: COLORS[i % COLORS.length]
      };
    });
  }, [curve, length, tubeRadius]);

  useFrame((state, delta) => {
    ref.current.rotation.y += delta * rotationSpeed;
  });

  return (
    <group ref={ref}>
      {segments.map((segment, index) => (
        <mesh key={index}>
          <primitive object={segment.geometry} />
          <meshStandardMaterial color={segment.color} />
        </mesh>
      ))}
    </group>
  );
};

const CuttingPlane = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <circleGeometry args={[10, 64]} />
      <meshStandardMaterial color="lightblue" side={THREE.DoubleSide} transparent opacity={0.5} />
    </mesh>
  );
};

const Scene = ({ pitch, length, helixRadius, tubeRadius, rotationSpeed }) => {
  return (
    <>
      <ambientLight intensity={0.9} />
      <pointLight position={[10, 20, 10]} />
      <SpiralHelix 
        pitch={pitch}
        length={length}
        helixRadius={helixRadius}
        tubeRadius={tubeRadius}
        rotationSpeed={rotationSpeed}
      />
      <CuttingPlane />
      <OrbitControls />
    </>
  );
};

const ParameterControl = ({ label, value, onChange, min, max, step }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="mt-1 block w-full"
    />
    <span className="text-sm text-gray-500">{value.toFixed(2)}</span>
  </div>
);

const SpiralHelixVisualization = () => {
  const [pitch, setPitch] = useState(40);
  const [length, setLength] = useState(1000);
  const [helixRadius, setHelixRadius] = useState(4);
  const [tubeRadius, setTubeRadius] = useState(0.1);
  const [rotationSpeed, setRotationSpeed] = useState(2 * Math.PI);

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/4 p-4">
        <h2 className="text-xl font-bold mb-4">Helix Parameters</h2>
        <ParameterControl label="Pitch" value={pitch} onChange={setPitch} min={1} max={100} step={1} />
        <ParameterControl label="Length" value={length} onChange={setLength} min={100} max={2000} step={10} />
        <ParameterControl label="Helix Radius" value={helixRadius} onChange={setHelixRadius} min={1} max={10} step={0.1} />
        <ParameterControl label="Tube Radius" value={tubeRadius} onChange={setTubeRadius} min={0.01} max={0.5} step={0.01} />
        <ParameterControl label="Rotation Speed" value={rotationSpeed} onChange={setRotationSpeed} min={0} max={4 * Math.PI} step={0.1} />
      </div>
      <div className="w-full md:w-3/4 h-[600px]">
        <Canvas camera={{ position: [0, 0, 20], fov: 50 }}>
          <Scene 
            pitch={pitch}
            length={length}
            helixRadius={helixRadius}
            tubeRadius={tubeRadius}
            rotationSpeed={rotationSpeed}
          />
        </Canvas>
      </div>
    </div>
  );
};

export default SpiralHelixVisualization;