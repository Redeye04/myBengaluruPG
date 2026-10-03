import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

// ─────────────────────────────────────────────────────────────────────────────
//  Colour palette  — soft, slightly desaturated to match the cloud aesthetic
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  terracotta: '#C87E66',
  sage:       '#A8BF96',
  teal:       '#4A7A82',
  deepGreen:  '#2E6068',
  sandstone:  '#DCCBA8',
  cream:      '#F0E8D8',
  olive:      '#5A7A4E',
  leafLight:  '#7BAF62',
  pot:        '#C47A45',
  soil:       '#6B3E26',
  stem:       '#3A7A28',
  bloom1:     '#FF8FAB',
  bloom2:     '#FFD166',
  bloom3:     '#A8DADC',
  winDay:     '#C8E8FF',
  winWarm:    '#FFE8A0',
  winLit:     '#FFF4C2',
  shadow:     '#00000022',
  people:     '#3D4B52',
  skin:       '#F4C89A',
};

// ─────────────────────────────────────────────────────────────────────────────
//  Seeded random
// ─────────────────────────────────────────────────────────────────────────────
function mkRand(seed) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

// ─────────────────────────────────────────────────────────────────────────────
//  Animated vine that sways in the "wind"
// ─────────────────────────────────────────────────────────────────────────────
function Vine({ x, topY, depth, phase }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.55 + phase) * 0.09;
  });

  const drops = 6;
  return (
    <group ref={ref} position={[x, topY, depth + 0.02]}>
      {Array.from({ length: drops }).map((_, i) => {
        const sway = Math.sin(i * 0.7) * 0.06;
        const y    = -i * 0.28;
        return (
          <group key={i} position={[sway, y, 0]}>
            {/* stem segment */}
            <mesh>
              <boxGeometry args={[0.04, 0.24, 0.04]} />
              <meshLambertMaterial color={C.olive} />
            </mesh>
            {/* leaf blob every other segment */}
            {i % 2 === 0 && (
              <mesh position={[i % 4 === 0 ? 0.11 : -0.11, 0.04, 0]}>
                <sphereGeometry args={[0.1, 6, 5]} />
                <meshLambertMaterial color={C.leafLight} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Flower pot with animated bloom
// ─────────────────────────────────────────────────────────────────────────────
function Pot({ position, bloomColor, phase }) {
  const stemRef = useRef();
  useFrame(({ clock }) => {
    if (!stemRef.current) return;
    stemRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.7 + phase) * 0.07;
  });
  return (
    <group position={position}>
      {/* pot body */}
      <mesh>
        <cylinderGeometry args={[0.12, 0.09, 0.18, 7]} />
        <meshLambertMaterial color={C.pot} />
      </mesh>
      {/* soil top */}
      <mesh position={[0, 0.095, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.025, 7]} />
        <meshLambertMaterial color={C.soil} />
      </mesh>
      {/* stem + bloom */}
      <group ref={stemRef} position={[0, 0.1, 0]}>
        <mesh position={[0, 0.14, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 0.25, 5]} />
          <meshLambertMaterial color={C.stem} />
        </mesh>
        {/* petals */}
        {[0, 1, 2, 3, 4].map((k) => (
          <mesh
            key={k}
            position={[
              Math.cos((k / 5) * Math.PI * 2) * 0.09,
              0.28,
              Math.sin((k / 5) * Math.PI * 2) * 0.09,
            ]}
          >
            <sphereGeometry args={[0.06, 5, 5]} />
            <meshLambertMaterial color={bloomColor} />
          </mesh>
        ))}
        {/* centre */}
        <mesh position={[0, 0.28, 0]}>
          <sphereGeometry args={[0.055, 6, 6]} />
          <meshLambertMaterial color={C.winWarm} />
        </mesh>
      </group>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Tiny illustrated person silhouette (2 people chatting on a rooftop)
// ─────────────────────────────────────────────────────────────────────────────
function PeoplePair({ position, facing = 1 }) {
  // person A — looking up slightly
  const bodyH = 0.32, headR = 0.085;
  const offsets = [-0.14, 0.14];
  const leans   = [0.12 * facing, -0.08 * facing]; // slight lean toward each other
  const headTilts = [-0.22, -0.28]; // looking upward

  return (
    <group position={position}>
      {offsets.map((ox, pi) => (
        <group key={pi} position={[ox, 0, 0]} rotation={[0, 0, leans[pi]]}>
          {/* body */}
          <mesh position={[0, bodyH / 2, 0]}>
            <boxGeometry args={[0.13, bodyH, 0.09]} />
            <meshLambertMaterial color={C.people} />
          </mesh>
          {/* head */}
          <mesh position={[0, bodyH + headR * 0.9, 0]} rotation={[headTilts[pi], 0, 0]}>
            <sphereGeometry args={[headR, 7, 7]} />
            <meshLambertMaterial color={C.skin} />
          </mesh>
          {/* little arm reaching up */}
          <mesh
            position={[pi === 0 ? 0.1 : -0.1, bodyH * 0.8, 0]}
            rotation={[0, 0, pi === 0 ? -0.9 : 0.9]}
          >
            <boxGeometry args={[0.06, 0.22, 0.06]} />
            <meshLambertMaterial color={C.people} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Window — soft glowing rectangle
// ─────────────────────────────────────────────────────────────────────────────
function Window({ position, color, depth }) {
  return (
    <group position={position}>
      {/* frame */}
      <mesh position={[0, 0, depth / 2 + 0.01]}>
        <planeGeometry args={[0.22, 0.30]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.25} />
      </mesh>
      {/* glass */}
      <mesh position={[0, 0, depth / 2 + 0.015]}>
        <planeGeometry args={[0.17, 0.24]} />
        <meshBasicMaterial color={color} transparent opacity={0.82} />
      </mesh>
      {/* cross divider */}
      <mesh position={[0, 0, depth / 2 + 0.02]}>
        <planeGeometry args={[0.17, 0.015]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
      </mesh>
      <mesh position={[0, 0, depth / 2 + 0.02]}>
        <planeGeometry args={[0.015, 0.24]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Single illustrated building
// ─────────────────────────────────────────────────────────────────────────────
function Building({ bx, baseY, width, height, depth, bodyColor, seed }) {
  const rand = useMemo(() => mkRand(seed), [seed]);

  // derive everything deterministically once
  const cfg = useMemo(() => {
    const r = mkRand(seed);

    // windows: 2–4 columns, rows by height
    const wCols  = 2 + Math.floor(r() * 3);
    const wRows  = 1 + Math.floor(height * 0.9);
    const winClr = r() > 0.55 ? C.winDay : (r() > 0.4 ? C.winWarm : C.winLit);
    const winPad = 0.28;
    const wSpacX = (width - winPad * 2) / wCols;
    const wSpacY = (height - winPad) / (wRows + 1);

    const wins = [];
    for (let c = 0; c < wCols; c++) {
      for (let rr = 0; rr < wRows; rr++) {
        wins.push({
          x: -width / 2 + winPad + c * wSpacX + wSpacX / 2,
          y: -height / 2 + winPad + rr * wSpacY + wSpacY / 2,
          color: winClr,
        });
      }
    }

    // rooftop elements
    const hasParapet  = r() > 0.3;
    const hasTower    = r() > 0.55;
    const towerW      = 0.3 + r() * 0.35;
    const towerH      = 0.5 + r() * 1.1;
    const towerX      = (r() - 0.5) * (width * 0.5);

    // vines: 0–3 on front face
    const vineCount = Math.floor(r() * 4);
    const vines = Array.from({ length: vineCount }, (_, i) => ({
      x: -width / 2 + (i + 1) * (width / (vineCount + 1)),
      phase: r() * Math.PI * 2,
    }));

    // pots: 1–3 on rooftop ledge
    const potCount = 1 + Math.floor(r() * 3);
    const blooms   = [C.bloom1, C.bloom2, C.bloom3];
    const pots = Array.from({ length: potCount }, (_, i) => ({
      x: -width / 3 + i * (width * 0.65 / Math.max(potCount - 1, 1)),
      bloom: blooms[Math.floor(r() * blooms.length)],
      phase: r() * Math.PI * 2,
    }));

    // people: randomly on some rooftops
    const hasPeople = r() > 0.45;
    const peopleX   = (r() - 0.5) * width * 0.4;
    const peopleFacing = r() > 0.5 ? 1 : -1;

    return { wins, hasParapet, hasTower, towerW, towerH, towerX, vines, pots, hasPeople, peopleX, peopleFacing };
  }, [seed, width, height]);

  return (
    <group position={[bx, baseY + height / 2, 0]}>

      {/* ── Body ─────────────────────────────────────── */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshLambertMaterial color={bodyColor} />
      </mesh>

      {/* ── Subtle top-edge lighter face (illustrative rim) */}
      <mesh position={[0, height / 2 - 0.04, depth / 2 + 0.005]}>
        <planeGeometry args={[width, 0.08]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.18} />
      </mesh>

      {/* ── Windows ──────────────────────────────────── */}
      {cfg.wins.map((w, i) => (
        <Window key={i} position={[w.x, w.y, 0]} color={w.color} depth={depth} />
      ))}

      {/* ── Parapet (low wall along roof) ────────────── */}
      {cfg.hasParapet && (
        <mesh position={[0, height / 2 + 0.07, 0]}>
          <boxGeometry args={[width + 0.06, 0.14, depth + 0.06]} />
          <meshLambertMaterial color={bodyColor} />
        </mesh>
      )}

      {/* ── Tower / penthouse ────────────────────────── */}
      {cfg.hasTower && (
        <group position={[cfg.towerX, height / 2 + cfg.towerH / 2 + 0.12, 0]}>
          <mesh castShadow>
            <boxGeometry args={[cfg.towerW, cfg.towerH, depth * 0.7]} />
            <meshLambertMaterial color={bodyColor} />
          </mesh>
          {/* tower windows — 1 column */}
          {Array.from({ length: Math.max(1, Math.floor(cfg.towerH * 1.2)) }).map((_, wi) => (
            <mesh
              key={wi}
              position={[0, -cfg.towerH / 2 + 0.3 + wi * 0.55, depth * 0.35 + 0.015]}
            >
              <planeGeometry args={[0.13, 0.19]} />
              <meshBasicMaterial color={C.winDay} transparent opacity={0.8} />
            </mesh>
          ))}
        </group>
      )}

      {/* ── Vines cascading down the front ───────────── */}
      {cfg.vines.map((v, i) => (
        <Vine key={i} x={v.x} topY={height / 2} depth={depth / 2} phase={v.phase} />
      ))}

      {/* ── Flower pots on rooftop ────────────────────── */}
      {cfg.pots.map((p, i) => (
        <Pot
          key={i}
          position={[p.x, height / 2 + 0.09, depth / 2 - 0.05]}
          bloomColor={p.bloom}
          phase={p.phase}
        />
      ))}

      {/* ── People chatting on roof ───────────────────── */}
      {cfg.hasPeople && (
        <PeoplePair
          position={[cfg.peopleX, height / 2 + 0.15, depth / 2 + 0.05]}
          facing={cfg.peopleFacing}
        />
      )}

    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Cityscape — one dense row, plastered against the bottom of the screen
// ─────────────────────────────────────────────────────────────────────────────
export default function Buildings() {
  const palette = [C.terracotta, C.sage, C.teal, C.deepGreen, C.sandstone, C.cream];

  const buildings = useMemo(() => {
    const rand = mkRand(77);
    const items = [];

    // ── Back row: skinny shorter buildings peeking over the front ────────────
    const backCount = 20;
    let bx = -38;
    for (let i = 0; i < backCount; i++) {
      const w = 2.2 + rand() * 2.0;
      const h = 3.5 + rand() * 4.5;
      const d = 0.6;
      items.push({
        id: `back${i}`,
        bx,
        baseY: -0.1,
        width: w, height: h, depth: d,
        bodyColor: palette[Math.floor(rand() * palette.length)],
        seed: i * 19 + 7,
        z: -4,
      });
      bx += w + 0.15 + rand() * 0.4;
    }

    // ── Front row: wide, tall, packed tight — almost touching ────────────────
    const frontCount = 16;
    let fx = -36;
    for (let i = 0; i < frontCount; i++) {
      const w = 3.2 + rand() * 2.8;
      const h = 5.0 + rand() * 6.5;
      const d = 0.8;
      items.push({
        id: `front${i}`,
        bx: fx,
        baseY: -0.1,
        width: w, height: h, depth: d,
        bodyColor: palette[Math.floor(rand() * palette.length)],
        seed: i * 23 + 100,
        z: 0,
      });
      fx += w + 0.08 + rand() * 0.25; // nearly no gap
    }

    return items;
  }, []);

  return (
    <>
      {buildings.map((b) => (
        <group key={b.id} position={[0, 0, b.z]}>
          <Building
            bx={b.bx}
            baseY={b.baseY}
            width={b.width}
            height={b.height}
            depth={b.depth}
            bodyColor={b.bodyColor}
            seed={b.seed}
          />
        </group>
      ))}
    </>
  );
}
