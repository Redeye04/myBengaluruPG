import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sky, Cloud } from '@react-three/drei';
import Buildings from './Buildings';
import SunSphere from './SunSphere';

/**
 * Main 3D scene:
 *  - Sky gradient via Drei's Sky component
 *  - Animated clouds
 *  - Procedural cityscape
 *  - Mouse parallax on the camera rig
 */
export default function Scene() {
  const mouse = useRef({ x: 0, y: 0 });
  const cameraTarget = useRef({ x: 0, y: 0 });
  const { camera } = useThree();

  // Track mouse globally
  // useEffect(() => {
  //   const onMove = (e) => {
  //     mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
  //     mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
  //   };
  //   window.addEventListener('mousemove', onMove);
  //   return () => window.removeEventListener('mousemove', onMove);
  // }, []);

  useFrame((state, delta) => {
    // Smooth lerp toward mouse
    cameraTarget.current.x += (mouse.current.x * 1.8 - cameraTarget.current.x) * 0.04;
    cameraTarget.current.y += (mouse.current.y * 0.6 - cameraTarget.current.y) * 0.04;

    camera.position.x = cameraTarget.current.x;
    camera.position.y = 4 + cameraTarget.current.y * 0.5;
    camera.lookAt(0, 2, 0);
  });

  return (
    <>
      {/* Ambient + directional lighting */}
      <ambientLight intensity={0.9} color="#fff8ee" />
      <directionalLight
        position={[8, 14, 8]}
        intensity={1.8}
        color="#fffbe0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={60}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={20}
        shadow-camera-bottom={-10}
      />
      <hemisphereLight skyColor="#A2D2FF" groundColor="#D4BE9E" intensity={0.5} />

      {/* Clean, vibrant Ghibli blue background instead of hazy atmospheric shader */}
      <color attach="background" args={['#9BBAD8']} />

      {/* Glowing Sun — brought forward & higher so it clears buildings */}
      {/* <SunSphere position={[5, 17, -8]} /> */}

      {/* Clouds */}
      <CloudLayer />

      {/* Ground plane */}
      {/* <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[120, 60]} />
        <meshLambertMaterial color="#c8b89a" />
      </mesh> */}

      {/* City — replaced by 2D Ghibli SVG in Overlay */}
      {/* <group position={[0, -2, 12]}>
        <Buildings />
      </group> */}
    </>
  );
}

// ── Animated cloud layer — 12 small wispy clouds ─────────────────────────────
function CloudLayer() {
  const clouds = useMemo(() => [
    { position: [-18, 15,  -10], scale: 0.9,  opacity: 0.80 },
    { position: [-10, 19, -14], scale: 1.1,  opacity: 0.75 },
    { position: [ -4, 9,  -11], scale: 0.75, opacity: 0.70 },
    { position: [  2, 12, -16], scale: 1.3,  opacity: 0.85 },
    { position: [  8, 8,  -10], scale: 0.8,  opacity: 0.72 },
    { position: [ 14, 10, -13], scale: 1.0,  opacity: 0.78 },
    { position: [ 20, 9,  -11], scale: 0.85, opacity: 0.68 },
    { position: [-24, 15, -15], scale: 1.2,  opacity: 0.82 },
    { position: [-14, 7,  -9 ], scale: 0.7,  opacity: 0.65 },
    { position: [  -7, 6, -18], scale: 1.5,  opacity: 0.88 },
    { position: [ 26, 17, -12], scale: 0.9,  opacity: 0.70 },
    { position: [-30, 8,  -13], scale: 1.0,  opacity: 0.74 },
    { position: [ -40, 9,  -11], scale: 0.85, opacity: 0.68 },
    { position: [ -37, 16,  -11], scale: 0.85, opacity: 0.68 },
    { position: [ 38, 6,  -11], scale: 0.85, opacity: 0.68 },
  ], []);

  return (
    <>
      {clouds.map((c, i) => (
        <AnimatedCloud key={i} {...c} index={i} />
      ))}
    </>
  );
}

function AnimatedCloud({ position, scale, opacity, index }) {
  const ref = useRef();
  const speed = 0.03 + index * 0.006;
  const origin = position[0];

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.x = origin + Math.sin(state.clock.elapsedTime * speed + index) * 1.5;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.12 + index) * 0.2;
  });

  return (
    <Cloud
      ref={ref}
      position={position}
      scale={scale}
      opacity={opacity}
      color="#FDFDFD"
      speed={0.08}
      segments={10}
    />
  );
}
