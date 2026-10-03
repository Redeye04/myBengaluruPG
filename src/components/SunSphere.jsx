import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Glowing sun sphere: bright yellow core + soft additive halo
 */
export default function SunSphere({ position = [6, 8, -18] }) {
  const coreRef = useRef();
  const haloRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (coreRef.current) {
      coreRef.current.intensity = 1.0 + Math.sin(t * 0.8) * 0.1;
    }
    if (haloRef.current) {
      haloRef.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.04);
    }
  });

  return (
    <group position={position}>
      {/* Core */}
      <mesh>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshBasicMaterial color="#FFC300" />
      </mesh>

      {/* Inner halo */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[1.3, 32, 32]} />
        <meshBasicMaterial color="#FFE066" transparent opacity={0.18} side={THREE.BackSide} />
      </mesh>

      {/* Outer soft glow */}
      <mesh>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial color="#FFF5A0" transparent opacity={0.07} side={THREE.BackSide} />
      </mesh>

      {/* Point light from the sun */}
      <pointLight ref={coreRef} color="#FFF0A0" intensity={1.0} distance={60} decay={1.4} />
    </group>
  );
}
