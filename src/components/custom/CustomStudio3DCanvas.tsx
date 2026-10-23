import React, { useRef, useMemo, Suspense, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, ContactShadows, Text } from '@react-three/drei';
import * as THREE from 'three';
import { AlertCircle, RotateCcw } from 'lucide-react';

export type CustomProductType = 'bunny' | 'tulip' | 'rose' | 'sunflower' | 'tote' | 'heart';

export interface CustomStudio3DCanvasProps {
  productType: CustomProductType;
  primaryColor: { name: string; hex: string };
  accentColor: { name: string; hex: string };
  sizeLabel: string;
  sizeIndex: number;
  customInitial?: string;
  fallbackImage?: string;
}

// Error Boundary for 3D Canvas
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class CanvasErrorBoundary extends Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('3D Studio Canvas Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#FAF6F0] rounded-2xl border border-[#D99AA3]/40">
            <AlertCircle className="w-10 h-10 text-[#6E3947] mb-2" />
            <p className="text-xs font-semibold text-[#321923]">3D Preview Temporarily Unavailable</p>
            <p className="text-[11px] text-[#6B5B54] mt-1 max-w-xs">
              Your color and size customizations are safely recorded and will be crafted exactly as specified.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-3 px-3 py-1.5 text-[11px] rounded-full bg-[#6E3947] text-white flex items-center gap-1 hover:bg-[#522734]"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Retry 3D Preview</span>
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

// Procedural crochet knit texture with authentic yarn stitch loops
function createCrochetKnitTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, size, size);

    const rows = 16;
    const cols = 16;
    const cellW = size / cols;
    const cellH = size / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * cellW + (r % 2 === 0 ? 0 : cellW / 2);
        const y = r * cellH;

        ctx.strokeStyle = '#dedede';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.arc(x, y + cellH * 0.4, cellW * 0.35, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#323232';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(x + 1.8, y + cellH * 0.4 + 1.8, cellW * 0.25, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  return texture;
}

// Helper: Generates a plump, 3D extruded puffy heart geometry
function createPuffyHeartGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.25);
  shape.bezierCurveTo(-0.05, 0.45, -0.35, 0.65, -0.65, 0.65);
  shape.bezierCurveTo(-0.95, 0.65, -1.05, 0.35, -1.05, 0.15);
  shape.bezierCurveTo(-1.05, -0.15, -0.75, -0.45, 0, -0.95);
  shape.bezierCurveTo(0.75, -0.45, 1.05, -0.15, 1.05, 0.15);
  shape.bezierCurveTo(1.05, 0.35, 0.95, 0.65, 0.65, 0.65);
  shape.bezierCurveTo(0.35, 0.65, 0.05, 0.45, 0, 0.25);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.26,
    bevelEnabled: true,
    bevelSegments: 8,
    steps: 2,
    bevelSize: 0.16,
    bevelThickness: 0.16,
  });
  geometry.center();
  return geometry;
}

// ---------------------------------------------------------------------------
// 1. MODEL: Heirloom Crochet Bunny (Plushie with limbs, floppy ears, face)
// ---------------------------------------------------------------------------
function BunnyModel({
  primaryColor,
  accentColor,
  sizeIndex,
  customInitial,
}: {
  primaryColor: string;
  accentColor: string;
  sizeIndex: number;
  customInitial?: string;
}) {
  const knitTexture = useMemo(() => createCrochetKnitTexture(), []);
  const scale = sizeIndex === 0 ? 0.78 : sizeIndex === 2 ? 1.06 : 0.92;

  return (
    <group scale={[scale, scale, scale]} position={[0, -0.22, 0]}>
      {/* Egg-shaped Seated Tummy */}
      <mesh position={[0, 0, 0]} scale={[0.82, 1.05, 0.82]}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshStandardMaterial
          color={primaryColor}
          roughness={0.92}
          bumpMap={knitTexture}
          bumpScale={0.08}
        />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.18, 0]} scale={[0.92, 0.88, 0.92]}>
        <sphereGeometry args={[0.74, 32, 32]} />
        <meshStandardMaterial
          color={primaryColor}
          roughness={0.92}
          bumpMap={knitTexture}
          bumpScale={0.08}
        />
      </mesh>

      {/* Embroidered Snout & Nose */}
      <mesh position={[0, 1.08, 0.65]} scale={[0.2, 0.14, 0.1]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#FAF6F0" roughness={0.88} />
      </mesh>
      <mesh position={[0, 1.13, 0.73]} scale={[0.065, 0.045, 0.04]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#E89BA5" roughness={0.6} />
      </mesh>

      {/* Rosy Cheeks */}
      <mesh position={[-0.36, 1.04, 0.55]} scale={[0.15, 0.09, 0.04]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#F0C9CB" roughness={0.9} />
      </mesh>
      <mesh position={[0.36, 1.04, 0.55]} scale={[0.15, 0.09, 0.04]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#F0C9CB" roughness={0.9} />
      </mesh>

      {/* Onyx Eyes */}
      <mesh position={[-0.25, 1.25, 0.6]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#1a0f14" roughness={0.15} metalness={0.2} />
      </mesh>
      <mesh position={[0.25, 1.25, 0.6]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#1a0f14" roughness={0.15} metalness={0.2} />
      </mesh>

      {/* Long Floppy Left Ear drooping downward */}
      <group position={[-0.48, 1.7, 0]} rotation={[0.15, 0, 0.55]}>
        <mesh position={[0, 0.65, 0]} scale={[0.26, 0.95, 0.16]}>
          <capsuleGeometry args={[0.45, 0.9, 16, 16]} />
          <meshStandardMaterial color={primaryColor} roughness={0.92} bumpMap={knitTexture} bumpScale={0.08} />
        </mesh>
        <mesh position={[0, 0.65, 0.08]} scale={[0.17, 0.8, 0.04]}>
          <capsuleGeometry args={[0.4, 0.8, 12, 12]} />
          <meshStandardMaterial color="#F8D4D6" roughness={0.95} />
        </mesh>
      </group>

      {/* Long Floppy Right Ear drooping downward */}
      <group position={[0.48, 1.7, 0]} rotation={[0.15, 0, -0.55]}>
        <mesh position={[0, 0.65, 0]} scale={[0.26, 0.95, 0.16]}>
          <capsuleGeometry args={[0.45, 0.9, 16, 16]} />
          <meshStandardMaterial color={primaryColor} roughness={0.92} bumpMap={knitTexture} bumpScale={0.08} />
        </mesh>
        <mesh position={[0, 0.65, 0.08]} scale={[0.17, 0.8, 0.04]}>
          <capsuleGeometry args={[0.4, 0.8, 12, 12]} />
          <meshStandardMaterial color="#F8D4D6" roughness={0.95} />
        </mesh>
      </group>

      {/* Front Paws/Arms resting inward on tummy */}
      <mesh position={[-0.34, 0.4, 0.52]} rotation={[0.4, 0.3, -0.4]} scale={[0.16, 0.38, 0.16]}>
        <capsuleGeometry args={[0.5, 0.7, 12, 12]} />
        <meshStandardMaterial color={primaryColor} roughness={0.92} bumpMap={knitTexture} bumpScale={0.07} />
      </mesh>
      <mesh position={[0.34, 0.4, 0.52]} rotation={[0.4, -0.3, 0.4]} scale={[0.16, 0.38, 0.16]}>
        <capsuleGeometry args={[0.5, 0.7, 12, 12]} />
        <meshStandardMaterial color={primaryColor} roughness={0.92} bumpMap={knitTexture} bumpScale={0.07} />
      </mesh>

      {/* Seated Feet sticking forward with oval pads */}
      <group position={[-0.46, -0.65, 0.42]} rotation={[-0.25, 0.2, 0]}>
        <mesh scale={[0.26, 0.22, 0.44]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color={primaryColor} roughness={0.92} />
        </mesh>
        <mesh position={[0, -0.02, 0.12]} scale={[0.16, 0.08, 0.24]}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial color="#F8D4D6" roughness={0.9} />
        </mesh>
      </group>
      <group position={[0.46, -0.65, 0.42]} rotation={[-0.25, -0.2, 0]}>
        <mesh scale={[0.26, 0.22, 0.44]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color={primaryColor} roughness={0.92} />
        </mesh>
        <mesh position={[0, -0.02, 0.12]} scale={[0.16, 0.08, 0.24]}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial color="#F8D4D6" roughness={0.9} />
        </mesh>
      </group>

      {/* Knitted Ribbon Bowtie in accentColor */}
      <group position={[0, 0.62, 0.65]}>
        <mesh scale={[0.13, 0.11, 0.09]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color={accentColor} roughness={0.88} />
        </mesh>
        <mesh position={[-0.2, 0, 0]} rotation={[0, 0, 0.2]} scale={[0.22, 0.14, 0.07]}>
          <coneGeometry args={[1, 1.8, 16]} />
          <meshStandardMaterial color={accentColor} roughness={0.88} />
        </mesh>
        <mesh position={[0.2, 0, 0]} rotation={[0, 0, -0.2]} scale={[0.22, 0.14, 0.07]}>
          <coneGeometry args={[1, 1.8, 16]} />
          <meshStandardMaterial color={accentColor} roughness={0.88} />
        </mesh>
      </group>

      {/* Embroidered Monogram Tag */}
      {customInitial && (
        <group position={[0, 0.08, 0.8]}>
          <mesh>
            <cylinderGeometry args={[0.25, 0.25, 0.04, 32]} />
            <meshStandardMaterial color="#FAF6F0" roughness={0.8} />
          </mesh>
          <Text
            position={[0, 0, 0.03]}
            fontSize={0.22}
            color={accentColor}
            anchorX="center"
            anchorY="middle"
          >
            {customInitial.toUpperCase()}
          </Text>
        </group>
      )}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 2. MODEL: Artisan Tulip Bouquet (Recognizable tulip petal cups, stems, leaves, wrap)
// ---------------------------------------------------------------------------
function TulipFlowerHead({ color, scale = 1 }: { color: string; scale?: number }) {
  const knitTexture = useMemo(() => createCrochetKnitTexture(), []);

  return (
    <group scale={[scale, scale, scale]}>
      {/* 3 Outer Curving Petals forming the tulip cup */}
      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, i) => (
        <group key={`out-${i}`} rotation={[0, angle, 0]}>
          <mesh position={[0, 0.22, 0.11]} rotation={[-0.16, 0, 0]} scale={[0.25, 0.38, 0.07]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color={color} roughness={0.92} bumpMap={knitTexture} bumpScale={0.08} />
          </mesh>
        </group>
      ))}
      {/* 3 Inner Petals rotated 60 deg completing the bloom goblet */}
      {[Math.PI / 3, Math.PI, (Math.PI * 5) / 3].map((angle, i) => (
        <group key={`in-${i}`} rotation={[0, angle, 0]}>
          <mesh position={[0, 0.25, 0.08]} rotation={[-0.06, 0, 0]} scale={[0.22, 0.36, 0.06]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color={color} roughness={0.92} bumpMap={knitTexture} bumpScale={0.08} />
          </mesh>
        </group>
      ))}
      {/* Inner yellow stamen hint */}
      <mesh position={[0, 0.22, 0]} scale={[0.05, 0.14, 0.05]}>
        <cylinderGeometry args={[1, 1, 1, 8]} />
        <meshStandardMaterial color="#EAB308" roughness={0.8} />
      </mesh>
      {/* Green Calyx base */}
      <mesh position={[0, 0.02, 0]} scale={[0.15, 0.12, 0.15]}>
        <coneGeometry args={[1, 1, 12]} />
        <meshStandardMaterial color="#4A5C38" roughness={0.9} />
      </mesh>
    </group>
  );
}

function TulipBouquetModel({
  primaryColor,
  accentColor,
  sizeIndex,
  customInitial,
}: {
  primaryColor: string;
  accentColor: string;
  sizeIndex: number;
  customInitial?: string;
}) {
  const tulips = useMemo(() => {
    if (sizeIndex === 0) {
      // Petite: 3 tulips
      return [
        { pos: [0, 0.72, 0.06], rot: [0.12, 0, 0], scale: 0.95 },
        { pos: [-0.25, 0.54, 0.14], rot: [0.18, 0, 0.22], scale: 0.88 },
        { pos: [0.25, 0.54, 0.14], rot: [0.18, 0, -0.22], scale: 0.88 },
      ];
    } else if (sizeIndex === 2) {
      // Luxe: 12 tulips
      return [
        { pos: [0, 0.82, 0.04], rot: [0.1, 0, 0], scale: 0.86 },
        { pos: [-0.26, 0.68, 0.1], rot: [0.15, 0, 0.2], scale: 0.82 },
        { pos: [0.26, 0.68, 0.1], rot: [0.15, 0, -0.2], scale: 0.82 },
        { pos: [0, 0.62, 0.2], rot: [0.2, 0, 0], scale: 0.82 },
        { pos: [-0.36, 0.48, 0.16], rot: [0.22, 0, 0.32], scale: 0.78 },
        { pos: [0.36, 0.48, 0.16], rot: [0.22, 0, -0.32], scale: 0.78 },
        { pos: [-0.18, 0.38, 0.26], rot: [0.25, 0, 0.15], scale: 0.78 },
        { pos: [0.18, 0.38, 0.26], rot: [0.25, 0, -0.15], scale: 0.78 },
        { pos: [-0.26, 0.6, -0.14], rot: [-0.1, 0, 0.2], scale: 0.78 },
        { pos: [0.26, 0.6, -0.14], rot: [-0.1, 0, -0.2], scale: 0.78 },
        { pos: [0, 0.52, -0.2], rot: [-0.15, 0, 0], scale: 0.78 },
        { pos: [0, 0.28, 0.3], rot: [0.28, 0, 0], scale: 0.74 },
      ];
    } else {
      // Classic: 7 tulips
      return [
        { pos: [0, 0.78, 0.06], rot: [0.12, 0, 0], scale: 0.92 },
        { pos: [-0.26, 0.6, 0.12], rot: [0.16, 0, 0.22], scale: 0.85 },
        { pos: [0.26, 0.6, 0.12], rot: [0.16, 0, -0.22], scale: 0.85 },
        { pos: [0, 0.55, 0.22], rot: [0.2, 0, 0], scale: 0.85 },
        { pos: [-0.18, 0.36, 0.25], rot: [0.24, 0, 0.18], scale: 0.78 },
        { pos: [0.18, 0.36, 0.25], rot: [0.24, 0, -0.18], scale: 0.78 },
        { pos: [0, 0.26, 0.3], rot: [0.28, 0, 0], scale: 0.78 },
      ];
    }
  }, [sizeIndex]);

  return (
    <group position={[0, -0.25, 0]}>
      {/* Kraft Paper Wrapping Sleeve with open front fold */}
      <mesh position={[0, -0.18, 0]}>
        <coneGeometry args={[0.82, 1.45, 32, 1, true]} />
        <meshStandardMaterial color="#C2A482" roughness={0.92} side={THREE.DoubleSide} />
      </mesh>

      {/* Jute String Tie around wrap */}
      <mesh position={[0, -0.12, 0]}>
        <torusGeometry args={[0.44, 0.05, 16, 32]} />
        <meshStandardMaterial color={accentColor} roughness={0.88} />
      </mesh>

      {/* Ribbon Bow knot */}
      <group position={[0, -0.12, 0.44]}>
        <mesh scale={[0.08, 0.06, 0.05]}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial color={accentColor} roughness={0.88} />
        </mesh>
        <mesh position={[-0.12, 0, 0]} rotation={[0, 0, 0.2]} scale={[0.14, 0.08, 0.04]}>
          <coneGeometry args={[1, 1.6, 12]} />
          <meshStandardMaterial color={accentColor} roughness={0.88} />
        </mesh>
        <mesh position={[0.12, 0, 0]} rotation={[0, 0, -0.2]} scale={[0.14, 0.08, 0.04]}>
          <coneGeometry args={[1, 1.6, 12]} />
          <meshStandardMaterial color={accentColor} roughness={0.88} />
        </mesh>
      </group>

      {/* Monogram charm on ribbon */}
      {customInitial && (
        <group position={[0, -0.25, 0.52]}>
          <mesh>
            <cylinderGeometry args={[0.18, 0.18, 0.03, 32]} />
            <meshStandardMaterial color="#FAF6F0" roughness={0.8} />
          </mesh>
          <Text
            position={[0, 0, 0.025]}
            fontSize={0.16}
            color={accentColor}
            anchorX="center"
            anchorY="middle"
          >
            {customInitial.toUpperCase()}
          </Text>
        </group>
      )}

      {/* Green Lancet Leaves flanking bouquet */}
      <mesh position={[-0.42, 0.35, 0.1]} rotation={[0.2, 0.1, 0.4]} scale={[0.14, 0.65, 0.04]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#4A5C38" roughness={0.9} />
      </mesh>
      <mesh position={[0.42, 0.35, 0.1]} rotation={[0.2, -0.1, -0.4]} scale={[0.14, 0.65, 0.04]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#4A5C38" roughness={0.9} />
      </mesh>

      {/* Stems */}
      {tulips.map((t, idx) => (
        <mesh
          key={`stem-${idx}`}
          position={[t.pos[0] * 0.55, (t.pos[1] - 0.2) * 0.55, t.pos[2] * 0.55]}
          rotation={[0, 0, -t.pos[0] * 0.25]}
        >
          <cylinderGeometry args={[0.03, 0.03, 1.15, 12]} />
          <meshStandardMaterial color="#4A5C38" roughness={0.85} />
        </mesh>
      ))}

      {/* True Sculpted Tulip Blossom Cups */}
      {tulips.map((t, idx) => (
        <group key={`flower-${idx}`} position={t.pos as [number, number, number]} rotation={t.rot as [number, number, number]}>
          <TulipFlowerHead color={primaryColor} scale={t.scale} />
        </group>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 3. MODEL: Burgundy Velvet Rose Bouquet (Concentric layered spiral petals)
// ---------------------------------------------------------------------------
function RoseFlowerHead({ color, scale = 1 }: { color: string; scale?: number }) {
  const knitTexture = useMemo(() => createCrochetKnitTexture(), []);

  return (
    <group scale={[scale, scale, scale]}>
      {/* Center spiral bud core */}
      <mesh position={[0, 0.16, 0]} scale={[0.14, 0.16, 0.14]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.9} bumpMap={knitTexture} bumpScale={0.08} />
      </mesh>
      {/* Middle Petal Ring (curled outward) */}
      {[0, 1.25, 2.5, 3.75, 5.0].map((angle, i) => (
        <group key={`mid-${i}`} rotation={[0, angle, 0]}>
          <mesh position={[0, 0.12, 0.14]} rotation={[0.32, 0, 0]} scale={[0.2, 0.22, 0.05]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color={color} roughness={0.9} bumpMap={knitTexture} bumpScale={0.08} />
          </mesh>
        </group>
      ))}
      {/* Outer Flared Petal Ring */}
      {[0.6, 1.85, 3.1, 4.35, 5.6].map((angle, i) => (
        <group key={`out-${i}`} rotation={[0, angle, 0]}>
          <mesh position={[0, 0.06, 0.25]} rotation={[0.62, 0, 0]} scale={[0.25, 0.25, 0.05]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color={color} roughness={0.9} bumpMap={knitTexture} bumpScale={0.08} />
          </mesh>
        </group>
      ))}
      {/* 5 Green Sepals beneath rose */}
      {[0, (Math.PI * 2) / 5, (Math.PI * 4) / 5, (Math.PI * 6) / 5, (Math.PI * 8) / 5].map((angle, i) => (
        <group key={`sepal-${i}`} rotation={[0, angle, 0]}>
          <mesh position={[0, 0.01, 0.22]} rotation={[0.75, 0, 0]} scale={[0.07, 0.22, 0.03]}>
            <coneGeometry args={[1, 1, 8]} />
            <meshStandardMaterial color="#4A5C38" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function RoseBouquetModel({
  primaryColor,
  accentColor,
  sizeIndex,
  customInitial,
}: {
  primaryColor: string;
  accentColor: string;
  sizeIndex: number;
  customInitial?: string;
}) {
  const roses = useMemo(() => {
    if (sizeIndex === 0) {
      // Trio: 3 roses
      return [
        { pos: [0, 0.72, 0.06], rot: [0.15, 0, 0], scale: 0.95 },
        { pos: [-0.25, 0.52, 0.14], rot: [0.2, 0, 0.25], scale: 0.88 },
        { pos: [0.25, 0.52, 0.14], rot: [0.2, 0, -0.25], scale: 0.88 },
      ];
    } else if (sizeIndex === 2) {
      // Full Dozen: 12 roses
      return [
        { pos: [0, 0.82, 0.04], rot: [0.15, 0, 0], scale: 0.85 },
        { pos: [-0.26, 0.68, 0.1], rot: [0.18, 0, 0.2], scale: 0.8 },
        { pos: [0.26, 0.68, 0.1], rot: [0.18, 0, -0.2], scale: 0.8 },
        { pos: [0, 0.62, 0.2], rot: [0.22, 0, 0], scale: 0.8 },
        { pos: [-0.36, 0.48, 0.16], rot: [0.25, 0, 0.32], scale: 0.76 },
        { pos: [0.36, 0.48, 0.16], rot: [0.25, 0, -0.32], scale: 0.76 },
        { pos: [-0.18, 0.38, 0.26], rot: [0.28, 0, 0.15], scale: 0.76 },
        { pos: [0.18, 0.38, 0.26], rot: [0.28, 0, -0.15], scale: 0.76 },
        { pos: [-0.26, 0.6, -0.14], rot: [-0.1, 0, 0.2], scale: 0.76 },
        { pos: [0.26, 0.6, -0.14], rot: [-0.1, 0, -0.2], scale: 0.76 },
        { pos: [0, 0.52, -0.2], rot: [-0.15, 0, 0], scale: 0.76 },
        { pos: [0, 0.28, 0.3], rot: [0.32, 0, 0], scale: 0.72 },
      ];
    } else {
      // Half dozen: 6 roses
      return [
        { pos: [0, 0.76, 0.06], rot: [0.15, 0, 0], scale: 0.9 },
        { pos: [-0.26, 0.58, 0.12], rot: [0.2, 0, 0.22], scale: 0.84 },
        { pos: [0.26, 0.58, 0.12], rot: [0.2, 0, -0.22], scale: 0.84 },
        { pos: [0, 0.52, 0.22], rot: [0.24, 0, 0], scale: 0.84 },
        { pos: [-0.18, 0.32, 0.25], rot: [0.28, 0, 0.18], scale: 0.76 },
        { pos: [0.18, 0.32, 0.25], rot: [0.28, 0, -0.18], scale: 0.76 },
      ];
    }
  }, [sizeIndex]);

  return (
    <group position={[0, -0.25, 0]}>
      {/* Kraft Paper Wrapping Sleeve */}
      <mesh position={[0, -0.18, 0]}>
        <coneGeometry args={[0.82, 1.45, 32, 1, true]} />
        <meshStandardMaterial color="#B8977E" roughness={0.92} side={THREE.DoubleSide} />
      </mesh>

      {/* Accent Ribbon around wrap */}
      <mesh position={[0, -0.12, 0]}>
        <torusGeometry args={[0.44, 0.05, 16, 32]} />
        <meshStandardMaterial color={accentColor} roughness={0.88} />
      </mesh>

      {customInitial && (
        <group position={[0, -0.25, 0.52]}>
          <mesh>
            <cylinderGeometry args={[0.18, 0.18, 0.03, 32]} />
            <meshStandardMaterial color="#FAF6F0" roughness={0.8} />
          </mesh>
          <Text
            position={[0, 0, 0.025]}
            fontSize={0.16}
            color={accentColor}
            anchorX="center"
            anchorY="middle"
          >
            {customInitial.toUpperCase()}
          </Text>
        </group>
      )}

      {/* Stems */}
      {roses.map((r, idx) => (
        <mesh
          key={`stem-${idx}`}
          position={[r.pos[0] * 0.55, (r.pos[1] - 0.2) * 0.55, r.pos[2] * 0.55]}
          rotation={[0, 0, -r.pos[0] * 0.25]}
        >
          <cylinderGeometry args={[0.03, 0.03, 1.15, 12]} />
          <meshStandardMaterial color="#4A5C38" roughness={0.85} />
        </mesh>
      ))}

      {/* Recognizable Layered Rose Blooms */}
      {roses.map((r, idx) => (
        <group key={`rose-${idx}`} position={r.pos as [number, number, number]} rotation={r.rot as [number, number, number]}>
          <RoseFlowerHead color={primaryColor} scale={r.scale} />
        </group>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 4. MODEL: Radiant Sunflower Cluster (Dark spiral disc & pointed petals)
// ---------------------------------------------------------------------------
function SunflowerHead({ color, scale = 1 }: { color: string; scale?: number }) {
  const knitTexture = useMemo(() => createCrochetKnitTexture(), []);

  return (
    <group scale={[scale, scale, scale]}>
      {/* Dark Domed Center Disc with spiral crochet ridges */}
      <mesh position={[0, 0.06, 0]} scale={[0.42, 0.16, 0.42]}>
        <cylinderGeometry args={[1, 0.9, 0.5, 32]} />
        <meshStandardMaterial color="#382015" roughness={0.96} bumpMap={knitTexture} bumpScale={0.14} />
      </mesh>
      {/* Front Petal Ring: 14 pointed golden petals */}
      {Array.from({ length: 14 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 14;
        return (
          <group key={`front-${i}`} rotation={[0, angle, 0]}>
            <mesh position={[0, 0.02, 0.65]} rotation={[0.1, 0, 0]} scale={[0.14, 0.05, 0.32]}>
              <coneGeometry args={[1, 1.8, 12]} />
              <meshStandardMaterial color={color} roughness={0.88} bumpMap={knitTexture} bumpScale={0.07} />
            </mesh>
          </group>
        );
      })}
      {/* Back Petal Ring: 14 pointed golden petals, offset */}
      {Array.from({ length: 14 }).map((_, i) => {
        const angle = ((i + 0.5) * Math.PI * 2) / 14;
        return (
          <group key={`back-${i}`} rotation={[0, angle, 0]}>
            <mesh position={[0, -0.02, 0.76]} rotation={[0.2, 0, 0]} scale={[0.15, 0.05, 0.36]}>
              <coneGeometry args={[1, 1.8, 12]} />
              <meshStandardMaterial color={color} roughness={0.88} bumpMap={knitTexture} bumpScale={0.07} />
            </mesh>
          </group>
        );
      })}
      {/* Jagged Green Calyx Sepals */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 8;
        return (
          <group key={`calyx-${i}`} rotation={[0, angle, 0]}>
            <mesh position={[0, -0.06, 0.55]} rotation={[0.35, 0, 0]} scale={[0.15, 0.04, 0.25]}>
              <coneGeometry args={[1, 1.4, 8]} />
              <meshStandardMaterial color="#4A5C38" roughness={0.9} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function SunflowerClusterModel({
  primaryColor,
  accentColor,
  sizeIndex,
  customInitial,
}: {
  primaryColor: string;
  accentColor: string;
  sizeIndex: number;
  customInitial?: string;
}) {
  const flowers = useMemo(() => {
    if (sizeIndex === 0) {
      // Single Statement (1 large sunflower)
      return [{ pos: [0, 0.62, 0.08], rot: [0.38, 0, 0], scale: 0.95 }];
    } else if (sizeIndex === 2) {
      // Meadow bunch (5 sunflowers)
      return [
        { pos: [0, 0.78, 0.04], rot: [0.32, 0, 0], scale: 0.72 },
        { pos: [-0.3, 0.58, 0.14], rot: [0.36, 0, 0.28], scale: 0.65 },
        { pos: [0.3, 0.58, 0.14], rot: [0.36, 0, -0.28], scale: 0.65 },
        { pos: [-0.18, 0.36, 0.26], rot: [0.42, 0, 0.18], scale: 0.58 },
        { pos: [0.18, 0.36, 0.26], rot: [0.42, 0, -0.18], scale: 0.58 },
      ];
    } else {
      // Trio (3 sunflowers)
      return [
        { pos: [0, 0.72, 0.06], rot: [0.34, 0, 0], scale: 0.8 },
        { pos: [-0.26, 0.52, 0.16], rot: [0.38, 0, 0.26], scale: 0.7 },
        { pos: [0.26, 0.52, 0.16], rot: [0.38, 0, -0.26], scale: 0.7 },
      ];
    }
  }, [sizeIndex]);

  return (
    <group position={[0, -0.25, 0]}>
      {/* Kraft Wrap Sleeve */}
      <mesh position={[0, -0.18, 0]}>
        <coneGeometry args={[0.82, 1.45, 32, 1, true]} />
        <meshStandardMaterial color="#C2A482" roughness={0.92} side={THREE.DoubleSide} />
      </mesh>

      {/* Accent Ribbon around wrap */}
      <mesh position={[0, -0.12, 0]}>
        <torusGeometry args={[0.44, 0.05, 16, 32]} />
        <meshStandardMaterial color={accentColor} roughness={0.88} />
      </mesh>

      {customInitial && (
        <group position={[0, -0.25, 0.52]}>
          <mesh>
            <cylinderGeometry args={[0.18, 0.18, 0.03, 32]} />
            <meshStandardMaterial color="#FAF6F0" roughness={0.8} />
          </mesh>
          <Text
            position={[0, 0, 0.025]}
            fontSize={0.16}
            color={accentColor}
            anchorX="center"
            anchorY="middle"
          >
            {customInitial.toUpperCase()}
          </Text>
        </group>
      )}

      {/* Stems */}
      {flowers.map((f, idx) => (
        <mesh
          key={`stem-${idx}`}
          position={[f.pos[0] * 0.55, (f.pos[1] - 0.2) * 0.55, f.pos[2] * 0.55]}
          rotation={[0, 0, -f.pos[0] * 0.25]}
        >
          <cylinderGeometry args={[0.035, 0.035, 1.15, 12]} />
          <meshStandardMaterial color="#4A5C38" roughness={0.85} />
        </mesh>
      ))}

      {/* Recognizable Sunflowers with dark chocolate spiral center & radiant pointed petals */}
      {flowers.map((f, idx) => (
        <group key={`sunflower-${idx}`} position={f.pos as [number, number, number]} rotation={f.rot as [number, number, number]}>
          <SunflowerHead color={primaryColor} scale={f.scale} />
        </group>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 5. MODEL: Diamond Weave Crochet Tote (Basket pouch, raised diamond weave, rope handles)
// ---------------------------------------------------------------------------
function ToteBagModel({
  primaryColor,
  accentColor,
  sizeIndex,
  customInitial,
}: {
  primaryColor: string;
  accentColor: string;
  sizeIndex: number;
  customInitial?: string;
}) {
  const knitTexture = useMemo(() => createCrochetKnitTexture(), []);
  const scale = sizeIndex === 1 ? 0.88 : 0.78;

  return (
    <group scale={[scale, scale, scale]} position={[0, -0.12, 0]}>
      {/* Main Bag Basket Pouch: Tapered oval body wider at rim, narrower at bottom */}
      <mesh position={[0, 0, 0]} scale={[1.35, 1.15, 0.72]}>
        <cylinderGeometry args={[1.05, 0.88, 1.1, 32]} />
        <meshStandardMaterial
          color={primaryColor}
          roughness={0.92}
          bumpMap={knitTexture}
          bumpScale={0.09}
        />
      </mesh>

      {/* Top Rim Hem Band */}
      <mesh position={[0, 0.62, 0]} scale={[1.44, 0.1, 0.78]}>
        <cylinderGeometry args={[1.06, 1.05, 0.12, 32]} />
        <meshStandardMaterial
          color={primaryColor}
          roughness={0.88}
          bumpMap={knitTexture}
          bumpScale={0.06}
        />
      </mesh>

      {/* Dark interior lining */}
      <mesh position={[0, 0.64, 0]} scale={[1.34, 0.04, 0.68]}>
        <cylinderGeometry args={[1.0, 1.0, 0.04, 32]} />
        <meshStandardMaterial color="#2B181F" roughness={0.95} />
      </mesh>

      {/* RAISED DIAMOND WEAVE LATTICE on Front Face */}
      <group position={[0, 0, 0.4]}>
        {/* Diamond 1: Top-Right rib */}
        <mesh position={[0.22, 0.18, 0]} rotation={[0, 0, -Math.PI / 4]} scale={[0.55, 0.05, 0.05]}>
          <capsuleGeometry args={[1, 1, 8, 8]} />
          <meshStandardMaterial color={accentColor} roughness={0.9} />
        </mesh>
        {/* Diamond 2: Bottom-Right rib */}
        <mesh position={[0.22, -0.18, 0]} rotation={[0, 0, Math.PI / 4]} scale={[0.55, 0.05, 0.05]}>
          <capsuleGeometry args={[1, 1, 8, 8]} />
          <meshStandardMaterial color={accentColor} roughness={0.9} />
        </mesh>
        {/* Diamond 3: Bottom-Left rib */}
        <mesh position={[-0.22, -0.18, 0]} rotation={[0, 0, -Math.PI / 4]} scale={[0.55, 0.05, 0.05]}>
          <capsuleGeometry args={[1, 1, 8, 8]} />
          <meshStandardMaterial color={accentColor} roughness={0.9} />
        </mesh>
        {/* Diamond 4: Top-Left rib */}
        <mesh position={[-0.22, 0.18, 0]} rotation={[0, 0, Math.PI / 4]} scale={[0.55, 0.05, 0.05]}>
          <capsuleGeometry args={[1, 1, 8, 8]} />
          <meshStandardMaterial color={accentColor} roughness={0.9} />
        </mesh>
        {/* Center Diamond Raised Fill */}
        <mesh position={[0, 0, 0.02]} scale={[0.25, 0.25, 0.03]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={accentColor} roughness={0.92} />
        </mesh>
      </group>

      {/* 4 Tan Leather Tabs holding handles */}
      {[-0.45, 0.45].map((x, i) => (
        <group key={`tab-front-${i}`} position={[x, 0.58, 0.38]}>
          <mesh scale={[0.1, 0.22, 0.04]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#C49767" roughness={0.65} />
          </mesh>
          {/* Twin Brass Rivet Studs */}
          <mesh position={[0, 0.05, 0.03]}>
            <sphereGeometry args={[0.025, 12, 12]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.05, 0.03]}>
            <sphereGeometry args={[0.025, 12, 12]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {[-0.45, 0.45].map((x, i) => (
        <group key={`tab-back-${i}`} position={[x, 0.58, -0.38]}>
          <mesh scale={[0.1, 0.22, 0.04]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#C49767" roughness={0.65} />
          </mesh>
          <mesh position={[0, 0.05, -0.03]}>
            <sphereGeometry args={[0.025, 12, 12]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.05, -0.03]}>
            <sphereGeometry args={[0.025, 12, 12]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* FRONT Tall Vertical Arching Twisted Rope Handle */}
      <group position={[0, 0.65, 0.36]}>
        <mesh rotation={[0, 0, 0]}>
          <torusGeometry args={[0.45, 0.055, 16, 48, Math.PI]} />
          <meshStandardMaterial color={accentColor} roughness={0.85} />
        </mesh>
      </group>

      {/* BACK Tall Vertical Arching Twisted Rope Handle */}
      <group position={[0, 0.65, -0.36]}>
        <mesh rotation={[0, 0, 0]}>
          <torusGeometry args={[0.45, 0.055, 16, 48, Math.PI]} />
          <meshStandardMaterial color={accentColor} roughness={0.85} />
        </mesh>
      </group>

      {/* Hanging Leather Artisan Tag with monogram */}
      <group position={[0.45, 0.35, 0.44]}>
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.22, 8]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh position={[0, -0.04, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.03, 32]} />
          <meshStandardMaterial color="#C49767" roughness={0.7} />
        </mesh>
        {customInitial ? (
          <Text
            position={[0, -0.04, 0.02]}
            fontSize={0.16}
            color="#321923"
            anchorX="center"
            anchorY="middle"
          >
            {customInitial.toUpperCase()}
          </Text>
        ) : (
          <Text
            position={[0, -0.04, 0.02]}
            fontSize={0.07}
            color="#321923"
            anchorX="center"
            anchorY="middle"
          >
            DEEPU
          </Text>
        )}
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 6. MODEL: Puffy Heart Bag Charm (Plump 3D heart with border, lobster clasp, tassel)
// ---------------------------------------------------------------------------
function HeartCharmModel({
  primaryColor,
  accentColor,
  customInitial,
}: {
  primaryColor: string;
  accentColor: string;
  customInitial?: string;
}) {
  const knitTexture = useMemo(() => createCrochetKnitTexture(), []);
  const heartGeo = useMemo(() => createPuffyHeartGeometry(), []);

  return (
    <group scale={[0.82, 0.82, 0.82]} position={[0, -0.05, 0]}>
      {/* Antique Brass Hardware Swivel Clasp & Split Ring */}
      <group position={[0, 0.95, 0]}>
        {/* Main Split Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.24, 0.038, 16, 32]} />
          <meshStandardMaterial color="#C59B27" metalness={0.88} roughness={0.22} />
        </mesh>
        {/* Swivel eyelet */}
        <mesh position={[0, 0.28, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.24, 16]} />
          <meshStandardMaterial color="#C59B27" metalness={0.88} roughness={0.22} />
        </mesh>
        {/* Lobster clasp trigger hook */}
        <mesh position={[0, 0.48, 0]} rotation={[0, 0, 0.3]} scale={[0.11, 0.2, 0.05]}>
          <torusGeometry args={[0.8, 0.2, 12, 24, Math.PI * 1.5]} />
          <meshStandardMaterial color="#C59B27" metalness={0.88} roughness={0.22} />
        </mesh>
      </group>

      {/* PLUMP, PUFFY 3D CROCHET HEART (True Extruded Beveled Heart Mesh) */}
      <group position={[0, 0.15, 0]}>
        <mesh geometry={heartGeo}>
          <meshStandardMaterial
            color={primaryColor}
            roughness={0.92}
            bumpMap={knitTexture}
            bumpScale={0.09}
          />
        </mesh>

        {/* Monogram Initial on Heart Center */}
        {customInitial && (
          <group position={[0, 0.02, 0.28]}>
            <mesh>
              <cylinderGeometry args={[0.22, 0.22, 0.03, 32]} />
              <meshStandardMaterial color="#FAF6F0" roughness={0.8} />
            </mesh>
            <Text
              position={[0, 0, 0.025]}
              fontSize={0.2}
              color={accentColor}
              anchorX="center"
              anchorY="middle"
            >
              {customInitial.toUpperCase()}
            </Text>
          </group>
        )}
      </group>

      {/* Dangling Tassel at bottom tip of heart */}
      <group position={[0, -0.68, 0]}>
        {/* Coiled Brass Wire Collar */}
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.1, 16]} />
          <meshStandardMaterial color="#C59B27" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Tassel Skirt of yarn threads in accentColor */}
        <mesh position={[0, -0.3, 0]} scale={[0.2, 0.6, 0.2]}>
          <coneGeometry args={[1, 1.4, 16]} />
          <meshStandardMaterial color={accentColor} roughness={0.92} bumpMap={knitTexture} bumpScale={0.07} />
        </mesh>
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 7. MAIN CANVAS EXPORT
// ---------------------------------------------------------------------------
export const CustomStudio3DCanvas: React.FC<CustomStudio3DCanvasProps> = ({
  productType,
  primaryColor,
  accentColor,
  sizeLabel,
  sizeIndex,
  customInitial,
  fallbackImage,
}) => {
  const supportedTypes: CustomProductType[] = ['bunny', 'tulip', 'rose', 'sunflower', 'tote', 'heart'];
  const isSupported = supportedTypes.includes(productType);

  if (!isSupported) {
    return (
      <div className="relative w-full aspect-square max-w-md mx-auto bg-gradient-to-b from-[#FAF6F0] via-[#F8EAEB] to-[#F0C9CB]/40 rounded-3xl p-5 border border-[#E6D7CD] shadow-lg flex flex-col items-center justify-between select-none overflow-hidden text-center">
        <div className="w-full flex items-center justify-between z-10 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-[#6E3947] font-semibold shadow-xs border border-[#D99AA3]/40">
            <span className="w-2 h-2 rounded-full bg-[#D97706]" />
            <span>Artisanal Reference Preview</span>
          </span>
          <span className="text-[11px] font-mono text-[#78816A] bg-white/80 px-2 py-0.5 rounded border border-[#E6D7CD]">
            {sizeLabel}
          </span>
        </div>

        <div className="relative my-auto w-48 h-48 rounded-2xl overflow-hidden shadow-md border border-[#D99AA3]/40 bg-white p-2">
          {fallbackImage ? (
            <img src={fallbackImage} alt="Craft reference" className="w-full h-full object-cover rounded-xl" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#FAF6F0] text-xs text-[#6B5B54]">
              Artisan Reference
            </div>
          )}
        </div>

        <div className="w-full text-center">
          <p className="text-xs font-semibold text-[#321923]">3D Mesh Preview Unavailable</p>
          <p className="text-[11px] text-[#6B5B54] mt-0.5">
            Color palette ({primaryColor.name} &amp; {accentColor.name}) and size will be hand-crafted by our maker.
          </p>
        </div>
      </div>
    );
  }

  // Stable key ensures React Three Fiber tears down previous model cleanly
  const modelKey = `${productType}-${sizeIndex}-${primaryColor.hex}-${accentColor.hex}-${customInitial || 'noinit'}`;

  // Product title mapping for honest status badge
  const productTitles: Record<CustomProductType, string> = {
    bunny: 'Heirloom Bunny',
    tulip: 'Tulip Bouquet',
    rose: 'Rose Bouquet',
    sunflower: 'Sunflower Cluster',
    tote: 'Crochet Tote Bag',
    heart: 'Puffy Heart Charm',
  };

  return (
    <div className="relative w-full aspect-square max-w-md mx-auto bg-gradient-to-b from-[#FAF6F0] via-[#F8EAEB] to-[#F0C9CB]/40 rounded-3xl p-4 border border-[#E6D7CD] shadow-lg flex flex-col items-center justify-between select-none overflow-hidden">
      {/* Studio Header Badges with honest labeling */}
      <div className="w-full flex items-center justify-between z-10 text-xs">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-[#6E3947] font-semibold shadow-xs border border-[#D99AA3]/40">
          <span className="w-2 h-2 rounded-full bg-[#78816A] animate-pulse" />
          <span>{productTitles[productType]} 3D Preview</span>
        </span>
        <span className="text-[11px] font-mono text-[#78816A] bg-white/80 px-2 py-0.5 rounded border border-[#E6D7CD]">
          {sizeLabel}
        </span>
      </div>

      {/* Interactive 3D Canvas */}
      <div className="relative z-10 w-full flex-1 my-1 cursor-grab active:cursor-grabbing">
        <CanvasErrorBoundary>
          <Canvas
            key={productType}
            camera={{ position: [0, 0, 4.3], fov: 44 }}
            className="w-full h-full"
          >
            <ambientLight intensity={1.25} color="#FFE4E6" />
            <directionalLight position={[4, 5, 4]} intensity={1.6} color="#FFF1F2" />
            <directionalLight position={[-4, -2, -2]} intensity={0.6} color="#F0C9CB" />
            <pointLight position={[0, 2, 2.5]} intensity={0.8} color="#F2D2BE" />

            <Suspense fallback={null}>
              <Float speed={1.3} rotationIntensity={0.15} floatIntensity={0.2} key={modelKey}>
                {productType === 'bunny' && (
                  <BunnyModel
                    primaryColor={primaryColor.hex}
                    accentColor={accentColor.hex}
                    sizeIndex={sizeIndex}
                    customInitial={customInitial}
                  />
                )}
                {productType === 'tulip' && (
                  <TulipBouquetModel
                    primaryColor={primaryColor.hex}
                    accentColor={accentColor.hex}
                    sizeIndex={sizeIndex}
                    customInitial={customInitial}
                  />
                )}
                {productType === 'rose' && (
                  <RoseBouquetModel
                    primaryColor={primaryColor.hex}
                    accentColor={accentColor.hex}
                    sizeIndex={sizeIndex}
                    customInitial={customInitial}
                  />
                )}
                {productType === 'sunflower' && (
                  <SunflowerClusterModel
                    primaryColor={primaryColor.hex}
                    accentColor={accentColor.hex}
                    sizeIndex={sizeIndex}
                    customInitial={customInitial}
                  />
                )}
                {productType === 'tote' && (
                  <ToteBagModel
                    primaryColor={primaryColor.hex}
                    accentColor={accentColor.hex}
                    sizeIndex={sizeIndex}
                    customInitial={customInitial}
                  />
                )}
                {productType === 'heart' && (
                  <HeartCharmModel
                    primaryColor={primaryColor.hex}
                    accentColor={accentColor.hex}
                    customInitial={customInitial}
                  />
                )}
              </Float>

              <OrbitControls
                enablePan={false}
                minDistance={2.4}
                maxDistance={5.4}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 1.7}
                autoRotate={false}
              />

              <ContactShadows
                position={[0, -1.8, 0]}
                opacity={0.55}
                scale={5}
                blur={2.4}
                far={3.5}
                color="#321923"
              />
            </Suspense>
          </Canvas>
        </CanvasErrorBoundary>
      </div>

      {/* Honest, Clear Studio Footer Note */}
      <div className="w-full flex items-center justify-between z-10 text-[11px] text-[#6B5B54] pt-2 border-t border-[#E6D7CD]/60">
        <span className="text-[#6E3947] font-medium">Touch or drag to inspect 360°</span>
        <span className="text-[10px] text-[#8E987E] italic">Artisanal 3D representation</span>
      </div>
    </div>
  );
};
