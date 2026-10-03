import React, { useMemo } from 'react';

/* ─── canvas coords ──────────────────────────────────────────────────── */
const VW     = 1600;
const VH     = 760;
const GROUND = 760;

/* ─── ink & stroke ───────────────────────────────────────────────────── */
const INK = '#2A1608';
const SW  = 1.9;

/* ─── seeded random ──────────────────────────────────────────────────── */
function mkRand(seed) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}
const pick  = (arr, r) => arr[Math.floor(r() * arr.length)];
const rr    = (a, b, r) => a + r() * (b - a);
const irr   = (a, b, r) => Math.floor(rr(a, b + 1, r));

/* ─── palettes ───────────────────────────────────────────────────────── */
const WALLS = [
  '#EDE0C8','#D6A08C','#9BB891','#A9BDD4','#CEBFA0',
  '#BC8268','#AEC2A8','#D9CEAD','#CAA47A','#B2C8C4',
  '#E8D4B8','#C4A898',
];
const ROOFS = [
  '#6B3028','#3A4858','#5A3A20','#2A5038',
  '#4A2A50','#7A3828','#3A5060','#5C4020',
];
const WIN_WARM  = '#FFE090';
const WIN_COOL  = '#C8E4FF';
const WIN_LIT   = '#FFF4A0';
const BLOOMS    = ['#FF8FAB','#FFB347','#FF7043','#CC79B0','#FF69B4','#FFF176','#FFCC02','#A8E6CF'];
const LAUNDRY   = ['#FFD0D0','#D0D0FF','#D0FFD0','#FFFFD0','#FFD0FF','#D0FFFF','#FFE8D0','#F0D0FF'];

/* ══════════════════════════════════════════════════════════════════════
   WINDOW COMPONENTS
══════════════════════════════════════════════════════════════════════ */

/** Classic arched window — very Ghibli European */
function ArchWin({ x, y, w, h, glass }) {
  const ah = w * 0.55;
  const rh = h - ah;
  return (
    <g>
      <path
        d={`M${x},${y+h} L${x},${y+rh} A${w/2},${ah} 0 0 1 ${x+w},${y+rh} L${x+w},${y+h} Z`}
        fill={glass} stroke={INK} strokeWidth={SW} strokeLinejoin="round"
      />
      <line x1={x+w/2} y1={y+rh}      x2={x+w/2} y2={y+h}       stroke={INK} strokeWidth={SW*0.5}/>
      <line x1={x}     y1={y+rh+rh*0.55} x2={x+w} y2={y+rh+rh*0.55} stroke={INK} strokeWidth={SW*0.5}/>
      <ellipse cx={x+w*0.34} cy={y+ah*0.5} rx={w*0.09} ry={ah*0.16} fill="white" opacity={0.4}/>
    </g>
  );
}

/** Cross-bar rectangular window */
function RectWin({ x, y, w, h, glass }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={glass} stroke={INK} strokeWidth={SW} rx={1.5}/>
      <line x1={x+w/2} y1={y}    x2={x+w/2} y2={y+h} stroke={INK} strokeWidth={SW*0.48}/>
      <line x1={x}     y1={y+h*0.44} x2={x+w} y2={y+h*0.44} stroke={INK} strokeWidth={SW*0.48}/>
      <rect x={x+w*0.07} y={y+h*0.09} width={w*0.18} height={h*0.13}
            fill="white" opacity={0.32} rx={1}/>
    </g>
  );
}

/** Round porthole window */
function PortWin({ cx, cy, r, glass }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r}     fill={glass} stroke={INK} strokeWidth={SW}/>
      <line x1={cx-r*0.85} y1={cy} x2={cx+r*0.85} y2={cy} stroke={INK} strokeWidth={SW*0.45}/>
      <line x1={cx} y1={cy-r*0.85} x2={cx} y2={cy+r*0.85} stroke={INK} strokeWidth={SW*0.45}/>
      <ellipse cx={cx-r*0.28} cy={cy-r*0.28} rx={r*0.22} ry={r*0.14}
               fill="white" opacity={0.4}/>
    </g>
  );
}

/** Window with folded shutters on either side */
function ShutterWin({ x, y, w, h, glass, wall }) {
  const sw = w * 0.38;
  const slats = [0.2, 0.4, 0.6, 0.8];
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={glass} stroke={INK} strokeWidth={SW} rx={1}/>
      {/* shutters */}
      {[-1,1].map((side) => {
        const sx = side < 0 ? x - sw - 2 : x + w + 2;
        return (
          <g key={side}>
            <rect x={sx} y={y-1} width={sw} height={h+2} fill={wall}
                  stroke={INK} strokeWidth={SW*0.8} rx={1}/>
            {slats.map((t,i) => (
              <line key={i} x1={sx} y1={y+h*t} x2={sx+sw} y2={y+h*t}
                    stroke={INK} strokeWidth={SW*0.38}/>
            ))}
          </g>
        );
      })}
    </g>
  );
}

/** Ground floor shop front with a striped awning */
function ShopFront({ x, y, w, h, glass, awningColor }) {
  const stripes = 5;
  const aw = w + 12, aTop = y - 20, aBot = y - 3;
  return (
    <g>
      {/* glass pane */}
      <rect x={x} y={y} width={w} height={h} fill={glass}
            stroke={INK} strokeWidth={SW*1.1} rx={2}/>
      <line x1={x+w/3}   y1={y} x2={x+w/3}   y2={y+h} stroke={INK} strokeWidth={SW*0.6}/>
      <line x1={x+w*2/3} y1={y} x2={x+w*2/3} y2={y+h} stroke={INK} strokeWidth={SW*0.6}/>
      {/* glint */}
      <rect x={x+5} y={y+7} width={w*0.22} height={h*0.15}
            fill="white" opacity={0.25} rx={1}/>
      {/* awning body */}
      <path d={`M${x-6},${aBot} L${x+w+6},${aBot} L${x+w+4},${aTop} L${x-4},${aTop} Z`}
            fill={awningColor} stroke={INK} strokeWidth={SW*0.8}/>
      {/* awning stripes */}
      {Array.from({length: stripes}, (_,i) => {
        const t = (i+0.5)/stripes;
        const bx = x-6 + t*aw;
        return (
          <line key={i} x1={bx-6} y1={aTop} x2={bx+6} y2={aBot}
                stroke={INK} strokeWidth={0.7} opacity={0.45}/>
        );
      })}
      {/* scalloped hem */}
      {Array.from({length: Math.floor(aw/12)}, (_,i) => (
        <path key={i}
              d={`M${x-6+i*12},${aBot} Q${x-6+i*12+6},${aBot+7} ${x-6+i*12+12},${aBot}`}
              fill={awningColor} stroke={INK} strokeWidth={SW*0.6}/>
      ))}
    </g>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   ROOF COMPONENTS
══════════════════════════════════════════════════════════════════════ */

function GableRoof({ x, y, w, h, color }) {
  const mid  = x + w / 2;
  const pts  = `${x-5},${y} ${mid},${y-h} ${x+w+5},${y}`;
  const cols = Math.floor(w / 20);
  return (
    <g>
      <polygon points={pts} fill={color} stroke={INK} strokeWidth={SW} strokeLinejoin="round"/>
      {Array.from({length: cols}, (_, i) => {
        const t  = (i + 1) / (cols + 1);
        const lx = x + t * w;
        const ly = y - h * (1 - 2 * Math.abs(t - 0.5));
        return (
          <line key={i} x1={lx} y1={ly} x2={lx} y2={y}
                stroke={INK} strokeWidth={0.7} opacity={0.45}/>
        );
      })}
    </g>
  );
}

function HipRoof({ x, y, w, h, color }) {
  const ins = w * 0.18;
  const pts = `${x-3},${y} ${x+ins},${y-h} ${x+w-ins},${y-h} ${x+w+3},${y}`;
  return (
    <g>
      <polygon points={pts} fill={color} stroke={INK} strokeWidth={SW} strokeLinejoin="round"/>
      <line x1={x+ins} y1={y-h} x2={x+w-ins} y2={y-h} stroke={INK} strokeWidth={SW*0.7}/>
    </g>
  );
}

function FlatRoof({ x, y, w, color }) {
  const notchW = 13, notchH = 8;
  const count  = Math.max(2, Math.floor(w / 24));
  const gap    = (w + 8) / (count + 1);
  return (
    <g>
      <rect x={x-4} y={y-18} width={w+8} height={18} fill={color} stroke={INK} strokeWidth={SW}/>
      {Array.from({length: count}, (_, i) => (
        <rect key={i} x={x-4+gap*(i+1)-notchW/2} y={y-18-notchH}
              width={notchW} height={notchH}
              fill={color} stroke={INK} strokeWidth={SW*0.7}/>
      ))}
    </g>
  );
}

function CurvedRoof({ x, y, w, h, color }) {
  const mid = x + w / 2;
  const d   = `M${x-6},${y} C${x-6},${y-h*0.35} ${mid},${y-h} ${mid},${y-h} C${mid},${y-h} ${x+w+6},${y-h*0.35} ${x+w+6},${y}`;
  return (
    <g>
      <path d={d} fill={color} stroke={INK} strokeWidth={SW}/>
      <path d={`M${mid-8},${y-h-5} Q${mid},${y-h-14} ${mid+8},${y-h-5}`}
            fill="none" stroke={INK} strokeWidth={SW*0.7}/>
    </g>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   DECORATION COMPONENTS
══════════════════════════════════════════════════════════════════════ */

function Chimney({ x, topY, h, color, smoke }) {
  return (
    <g>
      <rect x={x} y={topY} width={20} height={h} fill={color} stroke={INK} strokeWidth={SW} rx={1}/>
      <rect x={x-4} y={topY-5} width={28} height={6} fill={color} stroke={INK} strokeWidth={SW}/>
      {smoke && (
        <g opacity={0.62}>
          <circle cx={x+10} cy={topY-18} r={7}  fill="#D8D0C0" stroke="#9A9088" strokeWidth={0.7}/>
          <circle cx={x+16} cy={topY-35} r={10} fill="#E0D8CE" stroke="#9A9088" strokeWidth={0.7}/>
          <circle cx={x+8}  cy={topY-54} r={13} fill="#E8E2D8" stroke="#9A9088" strokeWidth={0.6}/>
        </g>
      )}
    </g>
  );
}

function FlowerBox({ x, y, w }) {
  const count = Math.max(3, Math.floor(w / 15));
  return (
    <g>
      <rect x={x-2} y={y} width={w+4} height={13} fill="#7A4820" stroke={INK} strokeWidth={SW*0.8}/>
      <rect x={x-4} y={y-3} width={w+8} height={5}  fill="#8B5530" stroke={INK} strokeWidth={SW*0.7}/>
      {Array.from({length: count}, (_, i) => {
        const fx    = x + (i + 0.5) * (w / count);
        const bloom = BLOOMS[i % BLOOMS.length];
        const lean  = (i % 2 === 0 ? 1 : -1) * 4;
        return (
          <g key={i}>
            <line x1={fx} y1={y-1} x2={fx+lean} y2={y-19}
                  stroke="#3A6030" strokeWidth={1.9} strokeLinecap="round"/>
            <circle cx={fx+lean} cy={y-21} r={7}
                    fill={bloom} stroke={INK} strokeWidth={0.8}/>
            <ellipse cx={fx+lean*0.5-5} cy={y-13} rx={5} ry={3.5}
                     fill="#5A8A50" stroke="#3A5030" strokeWidth={0.7}
                     transform={`rotate(-38,${fx+lean*0.5-5},${y-13})`}/>
          </g>
        );
      })}
    </g>
  );
}

function Vine({ x, topY, len }) {
  const segs = Math.floor(len / 22);
  return (
    <g>
      {Array.from({length: segs}, (_, i) => {
        const vy   = topY + i * 22;
        const vx   = x + Math.sin(i * 1.3) * 8;
        const nx   = x + Math.sin((i+1) * 1.3) * 8;
        const side = i % 2 === 0 ? 1 : -1;
        return (
          <g key={i}>
            <line x1={vx} y1={vy} x2={nx} y2={vy+22}
                  stroke="#3A6030" strokeWidth={2.2} strokeLinecap="round"/>
            {i % 2 === 0 && (
              <ellipse cx={vx+side*13} cy={vy+8} rx={10} ry={5.5}
                       fill="#5A8A50" stroke="#3A5030" strokeWidth={0.8}
                       transform={`rotate(${i*35+side*20},${vx+side*13},${vy+8})`}/>
            )}
          </g>
        );
      })}
    </g>
  );
}

function Balcony({ x, y, w }) {
  const posts = Math.max(3, Math.floor(w / 10));
  const bw    = w + 14;
  return (
    <g>
      <rect x={x-7} y={y} width={bw} height={7} fill="#C8B8A2" stroke={INK} strokeWidth={SW*0.9}/>
      <line x1={x-7} y1={y+25} x2={x-7+bw} y2={y+25} stroke={INK} strokeWidth={SW}/>
      {Array.from({length: posts}, (_, i) => (
        <line key={i}
              x1={x-7+i*(bw/(posts-1))} y1={y+7}
              x2={x-7+i*(bw/(posts-1))} y2={y+25}
              stroke={INK} strokeWidth={1.4}/>
      ))}
    </g>
  );
}

/** Two Ghibli-style silhouettes on a rooftop, looking / pointing skyward */
function PeoplePair({ x, topY }) {
  return (
    <g>
      {/* Person A — leaning back, looking up */}
      <g fill="#2C2018">
        <ellipse cx={x+5} cy={topY-33} rx={7} ry={8}/>          {/* head */}
        <rect x={x-1} y={topY-25} width={12} height={22} rx={4}/>  {/* body */}
        {/* arm up */}
        <line x1={x+11} y1={topY-22} x2={x+20} y2={topY-42}
              stroke="#2C2018" strokeWidth={3.5} strokeLinecap="round"/>
        <circle cx={x+21} cy={topY-44} r={3.5} fill="#F0C8A0"/>
      </g>
      {/* Person B — leaning forward, arm on parapet */}
      <g fill="#3A2820">
        <ellipse cx={x+32} cy={topY-28} rx={6} ry={7}/>
        <rect x={x+26} y={topY-21} width={12} height={20} rx={4}/>
        {/* arm resting */}
        <line x1={x+26} y1={topY-14} x2={x+14} y2={topY-8}
              stroke="#3A2820" strokeWidth={3.5} strokeLinecap="round"/>
      </g>
    </g>
  );
}

/** Tiny cat silhouette sitting on a ledge */
function Cat({ x, topY }) {
  return (
    <g fill={INK} transform={`translate(${x},${topY})`}>
      <ellipse cx={0}  cy={-5}   rx={12} ry={8}/>    {/* body */}
      <circle  cx={9}  cy={-14}  r={6.5}/>            {/* head */}
      <polygon points="6,-19 8,-27 10,-19"/>           {/* ear L */}
      <polygon points="10,-19 12,-27 14,-19"/>         {/* ear R */}
      {/* tail curves behind */}
      <path d={`M-12,-4 Q-22,-2 -18,-16`}
            fill="none" stroke={INK} strokeWidth={3.2} strokeLinecap="round"/>
      <circle cx={10} cy={-14} r={1.8} fill="#777"/>  {/* eye */}
    </g>
  );
}

function WaterTank({ x, topY }) {
  return (
    <g>
      {[5,20,35].map(lx => (
        <line key={lx} x1={x+lx} y1={topY} x2={x+lx} y2={topY+28}
              stroke={INK} strokeWidth={1.9}/>
      ))}
      <line x1={x+5} y1={topY+16} x2={x+35} y2={topY+16} stroke={INK} strokeWidth={1.3}/>
      <rect x={x} y={topY-30} width={40} height={30} fill="#7A9090"
            stroke={INK} strokeWidth={SW} rx={3}/>
      <ellipse cx={x+20} cy={topY-30} rx={20} ry={5} fill="#8AAAA0"
               stroke={INK} strokeWidth={SW*0.8}/>
      <line x1={x} y1={topY-20} x2={x+40} y2={topY-20} stroke={INK} strokeWidth={0.9}/>
      <line x1={x} y1={topY-10} x2={x+40} y2={topY-10} stroke={INK} strokeWidth={0.9}/>
    </g>
  );
}

function Antenna({ x, topY }) {
  return (
    <g stroke={INK} strokeLinecap="round">
      <line x1={x+7} y1={topY}    x2={x+7} y2={topY-40} strokeWidth={1.9}/>
      <line x1={x}   y1={topY-19} x2={x+14} y2={topY-19} strokeWidth={1.3}/>
      <line x1={x+1} y1={topY-27} x2={x+13} y2={topY-27} strokeWidth={1.2}/>
      <line x1={x+2} y1={topY-34} x2={x+12} y2={topY-34} strokeWidth={1.1}/>
      <circle cx={x+7} cy={topY-40} r={2.8} fill={INK} stroke="none"/>
    </g>
  );
}

/** Sagging rope with illustrated clothes hanging from it */
function LaundryLine({ x1, y1, x2, y2, seed }) {
  const r     = mkRand(seed * 7 + 3);
  const count = 3 + irr(0, 3, r);
  const midX  = (x1 + x2) / 2;
  const midY  = Math.max(y1, y2) + 22;
  return (
    <g>
      <path d={`M${x1},${y1} Q${midX},${midY} ${x2},${y2}`}
            fill="none" stroke="#907862" strokeWidth={0.9}/>
      {Array.from({length: count}, (_, i) => {
        const t  = (i + 1) / (count + 1);
        const bx = (1-t)*(1-t)*x1 + 2*(1-t)*t*midX + t*t*x2;
        const by = (1-t)*(1-t)*y1 + 2*(1-t)*t*midY + t*t*y2 + 6;
        const col = LAUNDRY[i % LAUNDRY.length];
        const isShirt = r() > 0.45;
        return (
          <g key={i}>
            <line x1={bx} y1={by-6} x2={bx} y2={by+2} stroke="#907862" strokeWidth={0.7}/>
            {isShirt
              ? <path d={`M${bx-12},${by+4} L${bx-16},${by+13} L${bx-9},${by+15} L${bx-8},${by+31}
                          L${bx+8},${by+31} L${bx+9},${by+15} L${bx+16},${by+13} L${bx+12},${by+4}
                          Q${bx},${by+9} ${bx-12},${by+4}`}
                       fill={col} stroke={INK} strokeWidth={0.9}/>
              : <>
                  <rect x={bx-9} y={by+2} width={18} height={13}
                        fill={col} stroke={INK} strokeWidth={0.8}/>
                  <line x1={bx-5} y1={by+15} x2={bx-7} y2={by+33}
                        stroke={INK} strokeWidth={1}  strokeLinecap="round"/>
                  <line x1={bx+5} y1={by+15} x2={bx+7} y2={by+33}
                        stroke={INK} strokeWidth={1}  strokeLinecap="round"/>
                  <line x1={bx}   y1={by+15} x2={bx}   y2={by+33}
                        stroke={INK} strokeWidth={0.8} strokeLinecap="round"/>
                </>
            }
          </g>
        );
      })}
    </g>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   BUILDING DATA GENERATOR
══════════════════════════════════════════════════════════════════════ */

function genBuildingData(startX, w, h, seed, isBack) {
  const r = mkRand(seed);

  const wallColor  = pick(WALLS, r);
  const roofColor  = pick(ROOFS, r);
  const roofType   = pick(isBack
    ? ['gable','hip','flat']
    : ['gable','hip','flat','curved'], r);
  const roofH      = roofType === 'flat' ? 18
                   : roofType === 'curved' ? rr(30, 58, r)
                   : rr(36, 72, r);
  const awningColor = pick(['#C87050','#5078A8','#6A9860','#A86050','#8060A8'], r);

  /* ── Windows ──────────────────────────────────────────────── */
  const groundFloorH = Math.min(78, h * 0.22);
  const usableH      = h - groundFloorH - 20;
  const cols         = isBack ? irr(1,2,r) : irr(1,3,r);
  const rows         = irr(1, Math.max(1, Math.floor(usableH / 55)), r);
  const padX         = 12, padY = 10;
  const cellW        = (w - padX*2) / cols;
  const cellH        = usableH / (rows + 0.5);

  const windows = [];
  for (let c = 0; c < cols; c++) {
    for (let row = 0; row < rows; row++) {
      if (r() < 0.1) continue; // occasional gap
      const types   = ['arch','rect','port','shutter'];
      const type    = row === rows-1 && r() > 0.55 ? 'arch'
                    : r() < 0.22 ? 'shutter'
                    : r() < 0.38 ? 'port'
                    : 'rect';
      const isPort  = type === 'port';
      const portR   = isPort ? rr(10, 16, r) : 0;
      const winW    = isPort ? 0 : rr(cellW*0.38, cellW*0.65, r);
      const winH    = isPort ? 0 : rr(cellH*0.44, cellH*0.72, r);
      const jitter  = (r() - 0.5) * 10;
      const rx      = padX + c*cellW + cellW/2 - (isPort ? portR : winW/2) + jitter;
      const ry      = padY + row*cellH + (isPort ? cellH*0.5 : 0) + (r()-0.5)*6;
      const glass   = r() > 0.55 ? WIN_WARM : r() > 0.35 ? WIN_LIT : WIN_COOL;
      windows.push({ type, rx, ry, w: winW, h: winH, r: portR, glass,
                     hasBox: !isPort && r() > 0.5 });
    }
  }

  /* ── Ground floor ─────────────────────────────────────────── */
  const hasShop = !isBack && r() > 0.42;

  /* ── Balconies ────────────────────────────────────────────── */
  const balconyCount = isBack ? 0 : r() > 0.55 ? irr(1,2,r) : 0;
  const balconies    = Array.from({length: balconyCount}, () => ({
    rx: rr(8, w*0.5, r),
    ry: rr(40, h - 100, r),
    bw: rr(28, 58, r),
  }));

  /* ── Chimneys ─────────────────────────────────────────────── */
  const chimneyCount = r() > 0.4 ? irr(1, isBack ? 1 : 2, r) : 0;
  const chimneys     = Array.from({length: chimneyCount}, () => ({
    rx:    rr(8, w-28, r),
    h:     rr(28, 55, r),
    smoke: r() > 0.45,
  }));

  /* ── Roof extras ──────────────────────────────────────────── */
  const hasPeople    = !isBack && r() > 0.52;
  const peopleRX     = rr(10, w - 55, r);
  const hasCat       = r() > 0.58;
  const catRX        = rr(5, w - 22, r);
  const hasWaterTank = !isBack && r() > 0.62;
  const tankRX       = rr(5, w - 45, r);
  const hasAntenna   = r() > 0.48;
  const antennaRX    = rr(5, w - 18, r);

  /* ── Vine ─────────────────────────────────────────────────── */
  const hasVine = r() > 0.5;
  const vineRX  = rr(0, w - 10, r);
  const vineLen = rr(70, 200, r);

  /* ── Subtle corner wobble (for hand-drawn polygon) ────────── */
  const wobble = Array.from({length:8}, () => (r()-0.5) * 2.2);

  return {
    x: startX, w, h, wallColor, roofType, roofH, roofColor, awningColor,
    windows, hasShop, groundFloorH, balconies, chimneys,
    hasPeople, peopleRX, hasCat, catRX,
    hasWaterTank, tankRX, hasAntenna, antennaRX,
    hasVine, vineRX, vineLen, wobble,
  };
}

/* ══════════════════════════════════════════════════════════════════════
   LAYOUT GENERATOR  (two seeded passes for stable layout)
══════════════════════════════════════════════════════════════════════ */

function generateAll() {
  const r    = mkRand(42);
  const back = [], front = [];

  /* back row */
  let bx = -50, bi = 0;
  while (bx < VW + 120) {
    const w = rr(72, 155, r);
    const h = rr(100, 190, r); // reduced from 140-295
    back.push(genBuildingData(bx, w, h, bi * 31 + 7, true));
    bx += w - 12 + r() * 12;
    bi++;
  }

  /* front row */
  let fx = -40, fi = 0;
  while (fx < VW + 140) {
    const w = rr(95, 215, r);
    const h = rr(150, 310, r); // reduced from 230-470
    front.push(genBuildingData(fx, w, h, fi * 23 + 100, false));
    fx += w - 10 + r() * 8;
    fi++;
  }

  /* laundry lines — between every 3rd adjacent front buildings */
  const laundry = [];
  for (let i = 0; i < front.length - 1; i += 3) {
    const a = front[i], b = front[i+1];
    if (!a || !b) continue;
    laundry.push({
      x1: a.x + a.w - 4, y1: GROUND - a.h * 0.78,
      x2: b.x + 5,       y2: GROUND - b.h * 0.78,
      seed: i,
    });
  }

  return { back, front, laundry };
}

/* ══════════════════════════════════════════════════════════════════════
   SINGLE BUILDING RENDERER
══════════════════════════════════════════════════════════════════════ */

function BuildingSVG({ bld }) {
  const {
    x, w, h, wallColor, roofType, roofH, roofColor, awningColor,
    windows, hasShop, groundFloorH, balconies, chimneys,
    hasPeople, peopleRX, hasCat, catRX,
    hasWaterTank, tankRX, hasAntenna, antennaRX,
    hasVine, vineRX, vineLen, wobble,
  } = bld;

  const topY        = GROUND - h;
  const gfY         = GROUND - groundFloorH;   // top of ground floor
  const roofTopY    = topY - (roofType === 'flat' ? 18 : roofH * 0.25);

  /* Slightly wobbly polygon corners for hand-drawn feel */
  const [o0,o1,o2,o3,o4,o5,o6,o7] = wobble;
  const poly = [
    `${x+o6},${GROUND}`,
    `${x+o0},${topY+o1}`,
    `${x+w+o2},${topY+o3}`,
    `${x+w+o4},${GROUND+o5}`,
  ].join(' ');

  return (
    <g>
      {/* ─ wall body ─────────────────────────────────────────── */}
      <polygon points={poly} fill={wallColor} stroke={INK} strokeWidth={SW} strokeLinejoin="round"/>

      {/* ─ faint floor lines ──────────────────────────────────── */}
      {Array.from({length: Math.floor(h / 48)}, (_, i) => {
        const ly = topY + (i+1) * (h / (Math.floor(h/48)+1));
        return (
          <line key={i} x1={x+2} y1={ly} x2={x+w-2} y2={ly}
                stroke={INK} strokeWidth={0.5} opacity={0.16}/>
        );
      })}

      {/* ─ vine on wall face ──────────────────────────────────── */}
      {hasVine && (
        <Vine x={x+vineRX} topY={topY+8} len={vineLen}/>
      )}

      {/* ─ windows ────────────────────────────────────────────── */}
      {windows.map((win, i) => {
        const wx  = x + win.rx;
        const wy  = topY + win.ry + groundFloorH + 8;
        if (wy + win.h > gfY - 5) return null;

        return (
          <g key={i}>
            {win.type === 'arch'    && <ArchWin    x={wx}          y={wy}          w={win.w} h={win.h} glass={win.glass}/>}
            {win.type === 'rect'    && <RectWin    x={wx}          y={wy}          w={win.w} h={win.h} glass={win.glass}/>}
            {win.type === 'port'    && <PortWin    cx={wx+win.r}   cy={wy+win.r}   r={win.r}            glass={win.glass}/>}
            {win.type === 'shutter' && <ShutterWin x={wx}          y={wy}          w={win.w} h={win.h} glass={win.glass} wall={wallColor}/>}
            {/* flower box below window */}
            {win.hasBox && win.type !== 'port' && wy + win.h + 18 < gfY - 12 && (
              <FlowerBox x={wx-4} y={wy+win.h+2} w={win.w+8}/>
            )}
          </g>
        );
      })}

      {/* ─ ground floor shop ──────────────────────────────────── */}
      {hasShop && (
        <ShopFront
          x={x+10} y={gfY+8}
          w={w-20} h={groundFloorH-14}
          glass={WIN_LIT} awningColor={awningColor}
        />
      )}

      {/* ─ balconies ──────────────────────────────────────────── */}
      {balconies.map((b, i) => (
        <Balcony key={i} x={x+b.rx} y={topY+b.ry} w={b.bw}/>
      ))}

      {/* ─ roof ───────────────────────────────────────────────── */}
      {roofType === 'gable'  && <GableRoof  x={x} y={topY} w={w} h={roofH} color={roofColor}/>}
      {roofType === 'hip'    && <HipRoof    x={x} y={topY} w={w} h={roofH} color={roofColor}/>}
      {roofType === 'flat'   && <FlatRoof   x={x} y={topY} w={w}           color={roofColor}/>}
      {roofType === 'curved' && <CurvedRoof x={x} y={topY} w={w} h={roofH} color={roofColor}/>}

      {/* ─ chimneys ───────────────────────────────────────────── */}
      {chimneys.map((ch, i) => (
        <Chimney key={i}
          x={x+ch.rx}
          topY={roofTopY - ch.h}
          h={ch.h}
          color={wallColor}
          smoke={ch.smoke}
        />
      ))}

      {/* ─ rooftop extras ─────────────────────────────────────── */}
      {hasWaterTank && <WaterTank x={x+tankRX}   topY={roofTopY}/>}
      {hasAntenna   && <Antenna   x={x+antennaRX} topY={roofTopY}/>}
      {hasPeople    && <PeoplePair x={x+peopleRX}  topY={roofTopY}/>}
      {hasCat       && <Cat        x={x+catRX}     topY={roofTopY+2}/>}
    </g>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════════════════════════ */

export default function Cityscape() {
  const { back, front, laundry } = useMemo(() => generateAll(), []);

  return (
    <div style={{
      position: 'absolute',
      bottom:   0,
      left:     0,
      right:    0,
      height:   '62%',
      pointerEvents: 'none',
    }}>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${VW} ${VH}`}
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
      >
        <defs>
          {/* ── Hand-drawn edge wobble ─────────────────────────── */}
          <filter id="sketch" x="-4%" y="-4%" width="108%" height="108%">
            <feTurbulence type="fractalNoise"
                          baseFrequency="0.016 0.012"
                          numOctaves="3" seed="5" result="n"/>
            <feDisplacementMap in="SourceGraphic" in2="n"
                               scale="2.8"
                               xChannelSelector="R" yChannelSelector="G"/>
          </filter>

          {/* ── Slightly more wobble for back row ─────────────── */}
          <filter id="sketchBack" x="-4%" y="-4%" width="108%" height="108%">
            <feTurbulence type="fractalNoise"
                          baseFrequency="0.02 0.015"
                          numOctaves="2" seed="9" result="n"/>
            <feDisplacementMap in="SourceGraphic" in2="n"
                               scale="2"
                               xChannelSelector="R" yChannelSelector="G"/>
          </filter>

          {/* ── Ground gradient ───────────────────────────────── */}
          <linearGradient id="gnd" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#C8B898"/>
            <stop offset="100%" stopColor="#AE9878"/>
          </linearGradient>
        </defs>

        {/* Ground strip */}
        <rect x={0} y={GROUND-10} width={VW} height={40}
              fill="url(#gnd)" stroke={INK} strokeWidth={1.6}/>

        {/* ── Back row (slightly faded) ─────────────────────── */}
        <g filter="url(#sketchBack)" opacity={0.72}>
          {back.map((bld, i) => <BuildingSVG key={i} bld={bld}/>)}
        </g>

        {/* ── Laundry lines ────────────────────────────────── */}
        {laundry.map((l, i) => (
          <LaundryLine key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} seed={l.seed}/>
        ))}

        {/* ── Front row ────────────────────────────────────── */}
        <g filter="url(#sketch)">
          {front.map((bld, i) => <BuildingSVG key={i} bld={bld}/>)}
        </g>
      </svg>
    </div>
  );
}
