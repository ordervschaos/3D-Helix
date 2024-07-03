import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const PITCH = 40;
const FINESS = 1000;
const LENGTH = 6000
const TUBE_RADIUS = 0.1;
const HELIX_RADIUS = 4;
const COLORS = ['orange', 'blue', 'green', 'red', 'purple'];

const SpiralHelix = () => {
  const ref = useRef();

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      Array(LENGTH).fill().map((_, i) => {
        var spiral_radius = HELIX_RADIUS;
        const t = i / FINESS;
        const angle = 2 * Math.PI * 4 * t;
        return new THREE.Vector3(
          Math.cos(angle) * spiral_radius,
          t * PITCH,
          Math.sin(angle) * spiral_radius
        );
      })
    );
  }, []);

  const segments = useMemo(() => {
    const points = curve.getPoints(FINESS);
    const segmentLength = 10;
    const segmentCount = Math.floor(points.length / segmentLength);

    return Array(segmentCount).fill().map((_, i) => {
      const start = i * segmentLength;
      const end = start + segmentLength + 1;
      const segmentPoints = points.slice(start, end);
      const segmentCurve = new THREE.CatmullRomCurve3(segmentPoints);

      return {
        geometry: new THREE.TubeGeometry(segmentCurve, segmentPoints.length - 1, TUBE_RADIUS, 8, false),
        color: COLORS[i % COLORS.length]
      };
    });
  }, [curve]);

  useFrame((state, delta) => {
    ref.current.position.y -= delta;
  });

  return (
    <group ref={ref}>
      {segments.map((segment, index) => (
        <mesh key={index}>
          <primitive object={segment.geometry} />
          <meshStandardMaterial color={segment.color} />
        </mesh>
      ))}
      {curve.getPoints(FINESS).map((point, index) => (
        index % 10 === 0 && (
          <mesh key={index} position={[point.x, point.y, point.z]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="red" />
          </mesh>
        )
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