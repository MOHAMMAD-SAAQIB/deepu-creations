import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { businessConfig } from '../../config/businessConfig';

export type IntroState = 'idle' | 'entering' | 'unwinding' | 'revealing' | 'transitioning' | 'complete';

// Generate procedural fibrous yarn bump texture for textile realism
function createYarnBumpTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, size, size);

    // Twisted yarn fibers (diagonal braided lines)
    for (let i = 0; i < size; i += 6) {
      ctx.strokeStyle = i % 12 === 0 ? '#404040' : '#b0b0b0';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(size, (i + size * 0.75) % size);
      ctx.stroke();
    }

    // Micro-fuzz / fibrous noise
    const imgData = ctx.getImageData(0, 0, size, size);
    const data = imgData.data;
    for (let p = 0; p < data.length; p += 4) {
      const noise = (Math.random() - 0.5) * 45;
      data[p] = Math.min(255, Math.max(0, data[p] + noise));
      data[p + 1] = Math.min(255, Math.max(0, data[p + 1] + noise));
      data[p + 2] = Math.min(255, Math.max(0, data[p + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 4);
  return texture;
}

// 3D Realistic Yarn Ball with multi-layered interwoven windings
function RealisticYarnBall({
  state,
  unwindProgress,
  color = '#D99AA3',
  secondaryColor = '#F0C9CB',
  highlightColor = '#E8B4BC',
}: {
  state: IntroState;
  unwindProgress: number;
  color?: string;
  secondaryColor?: string;
  highlightColor?: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const yarnTexture = useMemo(() => createYarnBumpTexture(), []);

  // Multi-band woven windings: simulates a true ball of yarn with layered overlapping passes
  const { windingTubes, coreRadius, strandRadius } = useMemo(() => {
    const tubes: THREE.TubeGeometry[] = [];
    const radius = 1.32;
    const sRadius = 0.045;

    // 4 major multi-axis winding bands (equatorial, dual diagonal, polar)
    const bandConfigs = [
      { axis: new THREE.Vector3(1, 0, 0), tilt: 0.15, coils: 7, loops: 48 },
      { axis: new THREE.Vector3(0.5, 0.86, 0.1), tilt: 0.85, coils: 8, loops: 52 },
      { axis: new THREE.Vector3(-0.6, 0.7, 0.35), tilt: -0.75, coils: 7, loops: 46 },
      { axis: new THREE.Vector3(0.2, 0.3, 0.93), tilt: 1.45, coils: 8, loops: 50 },
    ];

    bandConfigs.forEach((cfg) => {
      const pts: THREE.Vector3[] = [];
      const totalPoints = cfg.loops;
      for (let i = 0; i <= totalPoints; i++) {
        const t = (i / totalPoints) * Math.PI * 2 * cfg.coils;
        const phi = (i / totalPoints) * Math.PI - Math.PI / 2;

        // Introduce organic yarn strand wobble & tension variations
        const r = radius * (1 + Math.sin(t * 3.5) * 0.035 + Math.cos(i * 1.8) * 0.02);
        const x = r * Math.cos(phi) * Math.cos(t);
        const y = r * Math.sin(phi);
        const z = r * Math.cos(phi) * Math.sin(t);

        const v = new THREE.Vector3(x, y, z);
        v.applyAxisAngle(cfg.axis, cfg.tilt);
        pts.push(v);
      }
      const curve = new THREE.CatmullRomCurve3(pts);
      tubes.push(new THREE.TubeGeometry(curve, 140, sRadius, 8, false));
    });

    return { windingTubes: tubes, coreRadius: radius * 0.94, strandRadius: sRadius };
  }, []);

  // Continuous restrained organic rotation and floating
  useFrame((_, delta) => {
    if (groupRef.current) {
      const rotSpeed = state === 'unwinding' ? 0.75 : 0.32;
      groupRef.current.rotation.y += delta * rotSpeed;
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.12;
      groupRef.current.rotation.z = Math.cos(Date.now() * 0.0008) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Dense wool inner core */}
      <mesh>
        <sphereGeometry args={[coreRadius, 36, 36]} />
        <meshStandardMaterial
          color="#B87682"
          roughness={0.96}
          metalness={0.02}
          bumpMap={yarnTexture}
          bumpScale={0.06}
        />
      </mesh>

      {/* Layered woven winding strands */}
      {windingTubes.map((geo, idx) => (
        <mesh key={idx} geometry={geo}>
          <meshStandardMaterial
            color={idx === 0 ? color : idx === 1 ? secondaryColor : idx === 2 ? highlightColor : '#C98590'}
            roughness={0.92}
            metalness={0.02}
            bumpMap={yarnTexture}
            bumpScale={0.08}
          />
        </mesh>
      ))}

      {/* Tangent attachment anchor node where unwinding strand emerges from ball */}
      <mesh position={[1.18, 0.45, 0.38]}>
        <sphereGeometry args={[strandRadius * 1.15, 12, 12]} />
        <meshStandardMaterial
          color={secondaryColor}
          roughness={0.9}
          bumpMap={yarnTexture}
          bumpScale={0.05}
        />
      </mesh>
    </group>
  );
}

// 3D Animated Unraveling Strand that seamlessly connects to the ball and weaves into a decorative floral wreath
function RealisticUnwindingStrand({
  progress,
  color = '#F0C9CB',
}: {
  progress: number;
  color?: string;
}) {
  const yarnTexture = useMemo(() => createYarnBumpTexture(), []);

  // Deliberate 3D path: originates precisely at ball anchor [1.18, 0.45, 0.38],
  // unspools tangentially, swoops across foreground, and loops into a floral crest around center
  const curve = useMemo(() => {
    const pts = [
      new THREE.Vector3(1.18, 0.45, 0.38),   // Ball anchor
      new THREE.Vector3(1.75, 0.1, 0.75),    // Peel off
      new THREE.Vector3(1.9, -0.65, 1.25),   // Downward curve
      new THREE.Vector3(1.3, -1.2, 1.65),    // Lower swoop
      new THREE.Vector3(-0.2, -1.35, 1.8),   // Bottom traverse
      new THREE.Vector3(-1.4, -0.85, 1.95),  // Left upward
      new THREE.Vector3(-1.65, 0.3, 2.05),   // Left crest
      new THREE.Vector3(-0.95, 1.35, 2.15),  // Top arch
      new THREE.Vector3(0.4, 1.4, 2.15),     // Top right arch
      new THREE.Vector3(1.2, 0.7, 2.2),      // Closing outer circle
      new THREE.Vector3(0.85, -0.3, 2.25),   // Inward swirl
      new THREE.Vector3(0.0, -0.4, 2.3),     // Heart base
      new THREE.Vector3(-0.35, 0.1, 2.32),   // Heart left lobe
      new THREE.Vector3(0.0, 0.35, 2.33),    // Heart center
      new THREE.Vector3(0.35, 0.1, 2.32),    // Heart right lobe
      new THREE.Vector3(0.0, -0.4, 2.3),     // Finished knot
    ];
    return new THREE.CatmullRomCurve3(pts);
  }, []);

  const visibleGeometry = useMemo(() => {
    const clamped = Math.max(0.02, Math.min(1, progress));
    const fullPoints = curve.getPoints(140);
    const count = Math.max(2, Math.floor(fullPoints.length * clamped));
    const sliced = fullPoints.slice(0, count);
    if (sliced.length < 2) return null;
    const subCurve = new THREE.CatmullRomCurve3(sliced);
    return new THREE.TubeGeometry(subCurve, Math.max(10, count * 2), 0.042, 8, false);
  }, [curve, progress]);

  if (!visibleGeometry) return null;

  return (
    <mesh geometry={visibleGeometry}>
      <meshStandardMaterial
        color={color}
        roughness={0.88}
        metalness={0.02}
        bumpMap={yarnTexture}
        bumpScale={0.08}
        emissive="#522734"
        emissiveIntensity={0.25}
      />
    </mesh>
  );
}

interface YarnBallExperienceProps {
  onComplete: () => void;
  replayTrigger?: number; // Increment to reset and replay sequence
}

export const YarnBallExperience: React.FC<YarnBallExperienceProps> = ({
  onComplete,
  replayTrigger = 0,
}) => {
  // State machine: idle -> entering -> unwinding -> revealing -> transitioning -> complete
  const [state, setState] = useState<IntroState>('entering');
  const [strandProgress, setStrandProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [hasWebGL, setHasWebGL] = useState(true);

  // Reset & start animation cleanly whenever replayTrigger changes
  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    setState('entering');
    setStrandProgress(0);

    // Timeline: Entering (0 -> 1.2s)
    const enterTimer = setTimeout(() => {
      setState('unwinding');
    }, 1200);

    return () => clearTimeout(enterTimer);
  }, [replayTrigger, onComplete]);

  // Unwinding progress animation (1.2s -> 3.2s)
  useEffect(() => {
    if (state === 'unwinding') {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 0.028;
        if (progress >= 1) {
          setStrandProgress(1);
          clearInterval(interval);
          setState('revealing');
        } else {
          setStrandProgress(progress);
        }
      }, 30);

      return () => clearInterval(interval);
    }
  }, [state]);

  // Revealing -> Transitioning -> Complete
  useEffect(() => {
    if (state === 'revealing') {
      const revealTimer = setTimeout(() => {
        setState('transitioning');
      }, 2600);
      return () => clearTimeout(revealTimer);
    } else if (state === 'transitioning') {
      const finishTimer = setTimeout(() => {
        setState('complete');
        onComplete();
      }, 850);
      return () => clearTimeout(finishTimer);
    }
  }, [state, onComplete]);

  const handleSkip = () => {
    setState('complete');
    onComplete();
  };

  if (state === 'complete') return null;

  return (
    <div
      role="region"
      aria-label="3D Yarn Ball Introduction"
      className={`fixed inset-0 z-50 flex items-center justify-center transition-colors duration-1000 select-none overflow-hidden ${
        state === 'transitioning' ? 'bg-[#F6F0E7]' : 'bg-[#321923]'
      }`}
    >
      {/* Background ambient gradient glow */}
      <div className="absolute inset-0 bg-radial from-[#6E3947]/40 via-transparent to-transparent pointer-events-none" />

      {/* Top controls: Skip Intro & Audio toggle */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-2.5 rounded-full bg-[#522734]/80 text-[#F0C9CB] hover:text-white hover:bg-[#6E3947] transition-all backdrop-blur-md border border-[#F0C9CB]/20 text-xs flex items-center gap-1.5 shadow-lg"
          title={isMuted ? 'Unmute ambiance' : 'Mute sound'}
          aria-label={isMuted ? 'Unmute ambiance' : 'Mute sound'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={handleSkip}
          className="px-4 py-2 rounded-full bg-[#F0C9CB]/90 text-[#321923] hover:bg-white transition-all text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 shadow-lg shadow-[#321923]/40 border border-white/40 active:scale-95 cursor-pointer"
        >
          <span>Skip Intro</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main 3D Canvas */}
      <div className="absolute inset-0 flex items-center justify-center">
        {hasWebGL ? (
          <Canvas
            camera={{ position: [0, 0, 5.2], fov: 42 }}
            onCreated={({ gl }) => {
              gl.setClearColor(new THREE.Color('#321923'), 0);
            }}
            onError={() => setHasWebGL(false)}
            className="w-full h-full"
          >
            {/* Warm Studio Lights that reveal yarn tactile depth */}
            <ambientLight intensity={1.1} color="#FFE4E6" />
            <directionalLight position={[4, 5, 4]} intensity={1.8} color="#FFF1F2" />
            <directionalLight position={[-4, -3, -2]} intensity={0.6} color="#F0C9CB" />
            <pointLight position={[0, 2.5, 3]} intensity={0.9} color="#F2D2BE" />

            <Suspense fallback={null}>
              <Float
                speed={state === 'revealing' ? 1.2 : 2.0}
                rotationIntensity={0.5}
                floatIntensity={0.6}
              >
                <group
                  position={[
                    0,
                    state === 'revealing' || state === 'transitioning' ? 0.45 : 0,
                    0,
                  ]}
                  scale={state === 'entering' ? 0.92 : 1}
                >
                  <RealisticYarnBall state={state} unwindProgress={strandProgress} />
                  <RealisticUnwindingStrand progress={strandProgress} />
                </group>
              </Float>
              <ContactShadows
                position={[0, -2.1, 0]}
                opacity={0.65}
                scale={6}
                blur={2.5}
                far={4}
                color="#100508"
              />
            </Suspense>
          </Canvas>
        ) : (
          /* Graceful WebGL Fallback */
          <div className="relative flex items-center justify-center">
            <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-[#6E3947] via-[#D99AA3] to-[#F0C9CB] shadow-2xl flex items-center justify-center border-4 border-[#F0C9CB]/40">
              <span className="text-white text-xs tracking-widest font-mono">3D YARN</span>
            </div>
          </div>
        )}
      </div>

      {/* Logo Reveal and Warm Storefront Transition */}
      <AnimatePresence>
        {(state === 'revealing' || state === 'transitioning') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-30 text-center px-6 max-w-md mx-auto pointer-events-auto"
          >
            {/* Wreath ring framing brand name */}
            <div className="relative inline-block mb-3 p-8">
              <div className="absolute inset-0 rounded-full border border-[#F0C9CB]/30 border-dashed animate-[spin_40s_linear_infinite]" />
              <div className="absolute inset-2 rounded-full border border-[#D99AA3]/20" />

              <div className="flex items-center justify-center gap-1.5 text-[#F0C9CB] mb-1">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span className="text-[11px] uppercase tracking-[0.3em] font-sans font-medium text-[#F2D2BE]">
                  Artisanal Crochet Atelier
                </span>
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>

              <h1 className="font-serif text-5xl sm:text-6xl text-[#F6F0E7] font-normal tracking-wide drop-shadow-md">
                {businessConfig.brandName}
              </h1>

              <p className="font-script text-2xl sm:text-3xl text-[#F0C9CB] mt-1 drop-shadow">
                Handmade with Love ♡
              </p>

              <div className="mt-2.5">
                {businessConfig.isSloganConfigured ? (
                  <p className="text-xs text-[#FAF6F0] tracking-wider uppercase font-light">
                    {businessConfig.slogan}
                  </p>
                ) : (
                  <span className="inline-flex items-center text-[10px] uppercase font-mono tracking-wider px-2.5 py-0.5 rounded-full bg-[#522734]/80 text-[#D99AA3] border border-[#6E3947]">
                    Official Slogan: [OFFICIAL_SLOGAN]
                  </span>
                )}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-3"
            >
              <button
                onClick={handleSkip}
                className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D99AA3] to-[#F0C9CB] text-[#321923] font-semibold text-sm tracking-wide shadow-xl shadow-[#220F16]/50 hover:from-white hover:to-[#FAF6F0] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>Enter Boutique</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom technical landmark */}
      <div className="absolute bottom-6 left-6 z-20 text-[11px] font-mono text-[#F0C9CB]/60 tracking-wider">
        3D Procedural Yarn • Three.js & React Three Fiber
      </div>
    </div>
  );
};
