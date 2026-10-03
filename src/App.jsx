import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import Scene from './components/Scene';
import Overlay from './components/Overlay';

export default function App() {
  return (
    <div className="relative w-screen h-screen overflow-hidden font-inter">
      {/* Fixed full-screen 3D canvas */}
      <div className="fixed inset-0 z-0">
        <Canvas
          shadows
          camera={{ position: [0, 4, 28], fov: 55 }}
          gl={{ antialias: true, alpha: false }}
          dpr={[1, 1.5]}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* HTML UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <Overlay />
      </div>

      <Loader />
    </div>
  );
}
