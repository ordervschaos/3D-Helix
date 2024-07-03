import React, { useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const PITCH = 4;
const FINESS = 300;
const TUBE_RADIUS = 0.1;
const HELIX_RADIUS = 4;

const SpiralHelix = () => {
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      Array(FINESS).fill().map((_, i) => {
        var spiral_radius = HELIX_RADIUS;
        // var spiral_radius = HELIX_RADIUS - (i*HELIX_RADIUS/FINESS);
        const t = i / FINESS;
        const angle = 2 * Math.PI * 4 * t;
        return new THREE.Vector3(
          Math.cos(angle) * spiral_radius,
          t * PITCH - spiral_radius,
          Math.sin(angle) * spiral_radius
        );
      })
    );
  }, []);

  const geometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, FINESS, TUBE_RADIUS, 8, false);
  }, [curve]);

  const points = curve.getPoints(FINESS);

  return (
    <>
      <mesh>
        <primitive object={geometry} />
        <meshStandardMaterial color="orange" />
      </mesh>
      {points.map((point, index) => (
        index % 10 === 0 && (
          <mesh key={index} position={[point.x, point.y, point.z]}>
            <sphereGeometry args={[0.12, 5, 5]} />
            <meshStandardMaterial color="darkorange" />
          </mesh>
        )
      ))}
    </>
  );
};

const CuttingPlane = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
      <circleGeometry args={[10, 64]} />
      <meshStandardMaterial color="lightblue" side={THREE.DoubleSide} transparent opacity={0.5} />
    </mesh>
  );
};

const Scene = () => {
  useFrame((state) => {
    state.camera.position.x = Math.sin(state.clock.elapsedTime * 2) * 8;
    state.camera.position.z = Math.cos(state.clock.elapsedTime * 2) * 8;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.9} />
      <pointLight position={[10, 20, 10]} />
      <SpiralHelix />
      <CuttingPlane />
      <OrbitControls />
    </>
  );
};

const Stats = () => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, color: 'white' }}>
      <p>React Three Fiber</p>
    </div>
  );
};

const SpiralHelixVisualization = () => (
  <div style={{ width: '100%', height: '400px' }}>
    <Canvas camera={{ position: [0, 0, 10], fov: 30 }}>
      <Scene />
    </Canvas>
  </div>
);

export default SpiralHelixVisualization;