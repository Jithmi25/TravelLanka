import React, { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import {
  OrbitControls,
  Float,
  Html,
  Stars,
  Environment,
  MeshTransmissionMaterial,
  useTexture,
  Text,
  Cloud,
  Sparkles,
} from "@react-three/drei";
import {
  Compass,
  MapPin,
  Navigation,
  Plane,
  Mountain,
  Waves,
  TreePine,
  Sun,
  Camera,
  Star,
  ChevronRight,
  Play,
  Info,
  Train,
  Castle,
  Landmark,
} from "lucide-react";
import * as THREE from "three";

// ═══════════════════════════════════════════════════════════════════════════════
// THEME CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════
const THEME = {
  colors: {
    deepNavy: "#051622",
    forestGreen: "#0A2E1C",
    amber: "#DEB992",
    gold: "#FFD700",
    teal: "#1BA098",
    tealGlow: "#00FFE5",
    oceanDeep: "#0A3D62",
    oceanLight: "#1E90FF",
    sand: "#F4D03F",
    sunset: "#FF6B35",
    mist: "#E8F4F8",
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// OCEAN COMPONENT - Reactive 3D Ocean Canvas
// ═══════════════════════════════════════════════════════════════════════════════
function Ocean() {
  const meshRef = useRef();
  const { mouse } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColorDeep: { value: new THREE.Color(THEME.colors.deepNavy) },
      uColorLight: { value: new THREE.Color(THEME.colors.oceanDeep) },
    }),
    [],
  );

  useFrame((state) => {
    if (meshRef.current) {
      uniforms.uTime.value = state.clock.elapsedTime;
      uniforms.uMouse.value.set(mouse.x, mouse.y);

      // Animate vertices for wave effect
      const positions = meshRef.current.geometry.attributes.position;
      const time = state.clock.elapsedTime;

      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const wave1 = Math.sin(x * 0.5 + time * 0.8) * 0.15;
        const wave2 = Math.sin(y * 0.3 + time * 0.6) * 0.1;
        const wave3 = Math.sin((x + y) * 0.2 + time * 1.2) * 0.08;
        const mouseInfluence =
          Math.sin(
            Math.sqrt(
              Math.pow(x - mouse.x * 10, 2) + Math.pow(y - mouse.y * 10, 2),
            ) *
              0.3 +
              time * 2,
          ) * 0.05;
        positions.setZ(i, wave1 + wave2 + wave3 + mouseInfluence);
      }
      positions.needsUpdate = true;
    }
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -2.5, 0]}
      receiveShadow
    >
      <planeGeometry args={[80, 80, 128, 128]} />
      <meshStandardMaterial
        color={THEME.colors.oceanDeep}
        metalness={0.6}
        roughness={0.3}
        transparent
        opacity={0.85}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FLOATING ISLAND - Sri Lanka Landmass
// ═══════════════════════════════════════════════════════════════════════════════
function FloatingIsland() {
  const islandRef = useRef();
  const rocksRef = useRef();

  useFrame((state) => {
    if (islandRef.current) {
      // Gentle floating animation
      islandRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
      islandRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.2) * 0.02;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={islandRef} position={[0, 0, 0]}>
        {/* Main Island Base - Sri Lanka shaped mass */}
        <mesh position={[0, -0.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[2.8, 3.5, 1.2, 8, 1]} />
          <meshStandardMaterial
            color="#1a4d2e"
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>

        {/* Island Top Terrain */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <coneGeometry args={[2.8, 0.8, 8]} />
          <meshStandardMaterial color="#2d5a3f" roughness={0.9} metalness={0} />
        </mesh>

        {/* Central Highlands */}
        <mesh position={[0.3, 0.6, -0.2]} castShadow>
          <coneGeometry args={[1.2, 1.5, 6]} />
          <meshStandardMaterial color="#1f4a2c" roughness={0.85} />
        </mesh>

        {/* Mountain Range */}
        <mesh position={[-0.5, 0.4, 0.3]} castShadow>
          <coneGeometry args={[0.8, 1.1, 5]} />
          <meshStandardMaterial color="#2a5f3d" roughness={0.9} />
        </mesh>

        <mesh position={[0.8, 0.35, 0.4]} castShadow>
          <coneGeometry args={[0.6, 0.9, 5]} />
          <meshStandardMaterial color="#234d31" roughness={0.85} />
        </mesh>

        {/* Floating Rock Base - Underside */}
        <group ref={rocksRef} position={[0, -1.3, 0]}>
          <mesh castShadow>
            <coneGeometry args={[2.5, 2, 7]} />
            <meshStandardMaterial
              color="#3d2914"
              roughness={0.95}
              metalness={0.05}
            />
          </mesh>
          {/* Hanging rocks */}
          <mesh position={[1.2, -0.8, 0.5]}>
            <dodecahedronGeometry args={[0.4, 0]} />
            <meshStandardMaterial color="#4a3520" roughness={0.9} />
          </mesh>
          <mesh position={[-0.8, -0.6, -0.7]}>
            <dodecahedronGeometry args={[0.35, 0]} />
            <meshStandardMaterial color="#3d2914" roughness={0.9} />
          </mesh>
          <mesh position={[0.3, -1.2, 0.3]}>
            <dodecahedronGeometry args={[0.5, 0]} />
            <meshStandardMaterial color="#5a4030" roughness={0.85} />
          </mesh>
        </group>

        {/* Waterfall effect */}
        <Sparkles
          count={30}
          scale={[1, 2, 1]}
          position={[-0.5, -0.5, 1.5]}
          size={2}
          speed={0.8}
          color={THEME.colors.tealGlow}
        />

        {/* Coastal beaches */}
        <mesh position={[1.8, -0.3, 1.2]} rotation={[0.3, 0.5, 0.1]}>
          <boxGeometry args={[0.8, 0.1, 0.5]} />
          <meshStandardMaterial color={THEME.colors.sand} roughness={0.95} />
        </mesh>

        <mesh position={[-1.5, -0.35, 1.5]} rotation={[-0.2, -0.3, 0]}>
          <boxGeometry args={[0.6, 0.08, 0.4]} />
          <meshStandardMaterial color="#e6c875" roughness={0.9} />
        </mesh>
      </group>
    </Float>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// POI MARKERS - Gamified Points of Interest
// ═══════════════════════════════════════════════════════════════════════════════
function POIMarker({
  position,
  name,
  description,
  icon: Icon,
  color,
  details,
}) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const markerRef = useRef();
  const ringRef = useRef();
  const glowRef = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Pulsing animation
    if (markerRef.current) {
      const baseScale = hovered ? 1.3 : 1;
      const pulse = Math.sin(time * 3) * 0.1;
      markerRef.current.scale.setScalar(baseScale + pulse);
    }

    // Ring rotation
    if (ringRef.current) {
      ringRef.current.rotation.z = time * 0.5;
      ringRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
    }

    // Glow intensity
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.3 + Math.sin(time * 2) * 0.15;
    }
  });

  return (
    <group position={position}>
      {/* Outer glow ring */}
      <mesh ref={glowRef} scale={hovered ? 1.5 : 1}>
        <ringGeometry args={[0.25, 0.35, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Animated ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[0.2, 0.02, 8, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Main marker sphere */}
      <mesh
        ref={markerRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
        onClick={(e) => {
          e.stopPropagation();
          setClicked(!clicked);
        }}
      >
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color={hovered ? THEME.colors.amber : color}
          emissive={hovered ? THEME.colors.amber : color}
          emissiveIntensity={hovered ? 1 : 0.4}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>

      {/* Vertical beam */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 1, 8]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.8 : 0.4}
        />
      </mesh>

      {/* Info panel */}
      <Html
        distanceFactor={6}
        center
        position={[0, 1.2, 0]}
        style={{ pointerEvents: "none" }}
      >
        <div
          style={{
            background: hovered
              ? "rgba(5, 22, 34, 0.95)"
              : "rgba(5, 22, 34, 0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: hovered
              ? `2px solid ${THEME.colors.amber}`
              : "1px solid rgba(222, 185, 146, 0.2)",
            padding: hovered ? "16px 20px" : "10px 16px",
            borderRadius: "16px",
            color: "white",
            fontFamily: "'Inter', -apple-system, sans-serif",
            whiteSpace: "nowrap",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: hovered ? "scale(1.08) translateY(-8px)" : "scale(1)",
            boxShadow: hovered
              ? `0 20px 60px rgba(0,0,0,0.6), 0 0 40px ${color}40`
              : "0 10px 40px rgba(0,0,0,0.4)",
            minWidth: hovered ? "220px" : "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: hovered ? "8px" : "0",
            }}
          >
            <div
              style={{
                background: `linear-gradient(135deg, ${color}, ${THEME.colors.amber})`,
                padding: "8px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon size={16} color="#051622" strokeWidth={2.5} />
            </div>
            <div>
              <strong
                style={{
                  fontSize: "15px",
                  letterSpacing: "0.5px",
                  background: `linear-gradient(135deg, #ffffff, ${THEME.colors.amber})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {name}
              </strong>
              {hovered && (
                <div
                  style={{
                    fontSize: "11px",
                    color: THEME.colors.teal,
                    marginTop: "2px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  {details.type}
                </div>
              )}
            </div>
          </div>
          {hovered && (
            <>
              <p
                style={{
                  fontSize: "12px",
                  margin: "10px 0",
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: "1.5",
                  maxWidth: "200px",
                  whiteSpace: "normal",
                }}
              >
                {description}
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  marginTop: "12px",
                  paddingTop: "12px",
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: THEME.colors.amber,
                    }}
                  >
                    {details.rating}
                  </div>
                  <div
                    style={{
                      fontSize: "9px",
                      color: "rgba(255,255,255,0.5)",
                      marginTop: "2px",
                    }}
                  >
                    RATING
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: THEME.colors.teal,
                    }}
                  >
                    {details.visits}
                  </div>
                  <div
                    style={{
                      fontSize: "9px",
                      color: "rgba(255,255,255,0.5)",
                      marginTop: "2px",
                    }}
                  >
                    VISITS
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Html>

      {/* Sparkle effect for hovered state */}
      {hovered && (
        <Sparkles
          count={20}
          scale={0.8}
          size={3}
          speed={0.5}
          color={THEME.colors.amber}
        />
      )}
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SIGIRIYA - Ancient Fortress Rock with animated elements
// ═══════════════════════════════════════════════════════════════════════════════
function Sigiriya() {
  const rockRef = useRef();

  useFrame((state) => {
    if (rockRef.current) {
      rockRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
    }
  });

  return (
    <group position={[1.2, 0.8, 0.8]} ref={rockRef}>
      {/* Main rock pillar */}
      <mesh castShadow>
        <cylinderGeometry args={[0.08, 0.15, 0.6, 6]} />
        <meshStandardMaterial color="#8B4513" roughness={0.95} metalness={0} />
      </mesh>
      {/* Palace top */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[0.12, 0.05, 0.12]} />
        <meshStandardMaterial color="#DAA520" roughness={0.6} metalness={0.3} />
      </mesh>
      {/* Tiny flag */}
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[0.08, 0.04, 0.01]} />
        <meshStandardMaterial
          color={THEME.colors.sunset}
          emissive={THEME.colors.sunset}
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ELLA - Misty Mountains with Moving Train
// ═══════════════════════════════════════════════════════════════════════════════
function Ella() {
  const trainRef = useRef();
  const [trainPosition, setTrainPosition] = useState(0);

  useFrame((state) => {
    // Animate train along a path
    const t = (state.clock.elapsedTime * 0.3) % (Math.PI * 2);
    if (trainRef.current) {
      trainRef.current.position.x = Math.sin(t) * 0.3;
      trainRef.current.position.z = Math.cos(t) * 0.3;
      trainRef.current.rotation.y = t + Math.PI / 2;
    }
  });

  return (
    <group position={[-0.8, 0.6, -0.5]}>
      {/* Mountain peaks */}
      <mesh castShadow>
        <coneGeometry args={[0.3, 0.5, 5]} />
        <meshStandardMaterial color="#2d5a3f" roughness={0.9} />
      </mesh>
      <mesh position={[0.2, -0.1, 0.15]} castShadow>
        <coneGeometry args={[0.2, 0.35, 5]} />
        <meshStandardMaterial color="#1f4a2c" roughness={0.85} />
      </mesh>

      {/* Mist/Cloud effect */}
      <Sparkles
        count={15}
        scale={0.6}
        position={[0, 0.1, 0]}
        size={4}
        speed={0.2}
        color="#ffffff"
        opacity={0.3}
      />

      {/* Train on bridge */}
      <group ref={trainRef} position={[0.15, 0.05, 0.2]}>
        <mesh castShadow>
          <boxGeometry args={[0.08, 0.03, 0.03]} />
          <meshStandardMaterial
            color="#1E3A5F"
            metalness={0.4}
            roughness={0.6}
          />
        </mesh>
        {/* Train carriages */}
        <mesh position={[-0.06, 0, 0]}>
          <boxGeometry args={[0.04, 0.025, 0.025]} />
          <meshStandardMaterial
            color="#2C5282"
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>
      </group>

      {/* Bridge structure */}
      <mesh position={[0.15, -0.05, 0.2]} rotation={[0, 0.5, 0]}>
        <boxGeometry args={[0.4, 0.01, 0.05]} />
        <meshStandardMaterial color="#4a3520" roughness={0.9} />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GALLE - Historic Coastal Fortress
// ═══════════════════════════════════════════════════════════════════════════════
function Galle() {
  const lighthouseRef = useRef();

  useFrame((state) => {
    // Lighthouse beacon rotation
    if (lighthouseRef.current) {
      lighthouseRef.current.rotation.y = state.clock.elapsedTime * 2;
    }
  });

  return (
    <group position={[0.5, -0.1, 1.8]}>
      {/* Fort walls */}
      <mesh castShadow>
        <boxGeometry args={[0.4, 0.15, 0.3]} />
        <meshStandardMaterial color="#C4A77D" roughness={0.9} metalness={0} />
      </mesh>

      {/* Fort towers */}
      <mesh position={[-0.15, 0.12, -0.1]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 0.15, 8]} />
        <meshStandardMaterial color="#B8956E" roughness={0.85} />
      </mesh>
      <mesh position={[0.15, 0.12, 0.1]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 0.15, 8]} />
        <meshStandardMaterial color="#B8956E" roughness={0.85} />
      </mesh>

      {/* Lighthouse */}
      <group position={[0, 0.2, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.025, 0.035, 0.2, 8]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
        </mesh>
        {/* Beacon light */}
        <group ref={lighthouseRef} position={[0, 0.12, 0]}>
          <mesh>
            <boxGeometry args={[0.02, 0.02, 0.08]} />
            <meshBasicMaterial color={THEME.colors.amber} />
          </mesh>
        </group>
      </group>

      {/* Waves around fort */}
      <Sparkles
        count={10}
        scale={[0.5, 0.1, 0.5]}
        position={[0, -0.1, 0.2]}
        size={2}
        speed={0.5}
        color={THEME.colors.tealGlow}
      />
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CAMERA RIG - Mouse-tracking Parallax
// ═══════════════════════════════════════════════════════════════════════════════
function CameraRig() {
  const { camera, mouse } = useThree();
  const vec = new THREE.Vector3();

  useFrame(() => {
    // Smooth parallax camera movement
    const targetX = mouse.x * 2;
    const targetY = mouse.y * 1.5 + 1;

    camera.position.lerp(vec.set(targetX, targetY, 6), 0.03);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// AMBIENT PARTICLES
// ═══════════════════════════════════════════════════════════════════════════════
function AmbientParticles() {
  return (
    <>
      <Sparkles
        count={100}
        scale={15}
        size={1.5}
        speed={0.3}
        color={THEME.colors.amber}
        opacity={0.4}
      />
      <Stars
        radius={50}
        depth={50}
        count={2000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// POI DATA
// ═══════════════════════════════════════════════════════════════════════════════
const DESTINATIONS = [
  {
    name: "Sigiriya",
    position: [1.2, 1.4, 0.8],
    description:
      "An ancient rock fortress rising 200m from the jungle. Marvel at 5th-century frescoes and royal gardens.",
    icon: Landmark,
    color: THEME.colors.amber,
    details: { type: "UNESCO World Heritage", rating: "4.9", visits: "12K+" },
  },
  {
    name: "Ella",
    position: [-0.8, 1.2, -0.5],
    description:
      "Misty mountain paradise with the iconic Nine Arch Bridge and scenic railway adventures.",
    icon: Train,
    color: THEME.colors.teal,
    details: { type: "Hill Country", rating: "4.8", visits: "8K+" },
  },
  {
    name: "Galle Fort",
    position: [0.5, 0.6, 1.8],
    description:
      "A 16th-century colonial fortress blending European architecture with South Asian traditions.",
    icon: Castle,
    color: THEME.colors.sunset,
    details: { type: "Historic Landmark", rating: "4.7", visits: "15K+" },
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [activeDestination, setActiveDestination] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 500);
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: `radial-gradient(ellipse at 50% 0%, ${THEME.colors.oceanDeep} 0%, ${THEME.colors.deepNavy} 60%, #000000 100%)`,
        overflow: "hidden",
        position: "relative",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* NAVIGATION BAR */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <nav
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 50px",
          boxSizing: "border-box",
          zIndex: 10,
          background:
            "linear-gradient(to bottom, rgba(5, 22, 34, 0.8), transparent)",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              background: `linear-gradient(135deg, ${THEME.colors.teal}, ${THEME.colors.amber})`,
              padding: "10px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Compass size={24} color="#051622" strokeWidth={2.5} />
          </div>
          <div>
            <div
              style={{
                color: "white",
                fontSize: "22px",
                fontWeight: "700",
                letterSpacing: "0.5px",
              }}
            >
              Travel<span style={{ color: THEME.colors.amber }}>Lanka</span>
            </div>
            <div
              style={{
                fontSize: "9px",
                color: THEME.colors.teal,
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              3D Experience
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div
          style={{
            display: "flex",
            gap: "8px",
          }}
        >
          {["Explore", "Destinations", "Itineraries", "Book"].map((item, i) => (
            <button
              key={item}
              style={{
                padding: "10px 20px",
                background:
                  i === 0 ? `rgba(27, 160, 152, 0.15)` : "transparent",
                border:
                  i === 0
                    ? `1px solid ${THEME.colors.teal}`
                    : "1px solid transparent",
                borderRadius: "10px",
                color: i === 0 ? THEME.colors.teal : "rgba(255,255,255,0.7)",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                if (i !== 0) {
                  e.target.style.color = "white";
                  e.target.style.background = "rgba(255,255,255,0.05)";
                }
              }}
              onMouseOut={(e) => {
                if (i !== 0) {
                  e.target.style.color = "rgba(255,255,255,0.7)";
                  e.target.style.background = "transparent";
                }
              }}
            >
              {item}
            </button>
          ))}
        </div>

        {/* CTA Button */}
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 24px",
            background: `linear-gradient(135deg, ${THEME.colors.amber}, ${THEME.colors.sunset})`,
            border: "none",
            borderRadius: "12px",
            color: THEME.colors.deepNavy,
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: `0 8px 32px ${THEME.colors.amber}40`,
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = `0 12px 40px ${THEME.colors.amber}60`;
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = `0 8px 32px ${THEME.colors.amber}40`;
          }}
        >
          <Plane size={16} /> Plan Trip
        </button>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* HERO CONTENT OVERLAY */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          bottom: "8%",
          left: "5%",
          maxWidth: "480px",
          zIndex: 10,
          color: "white",
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? "translateY(0)" : "translateY(30px)",
          transition: "all 1s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: `linear-gradient(135deg, rgba(27, 160, 152, 0.15), rgba(222, 185, 146, 0.1))`,
            padding: "8px 16px",
            borderRadius: "30px",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "2px",
            marginBottom: "20px",
            border: `1px solid rgba(27, 160, 152, 0.3)`,
            backdropFilter: "blur(10px)",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              background: THEME.colors.teal,
              borderRadius: "50%",
              animation: "pulse 2s infinite",
            }}
          />
          <Navigation size={12} color={THEME.colors.teal} />
          Interactive 3D Island Experience
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: "clamp(2.5rem, 5vw, 3.8rem)",
            fontWeight: "800",
            lineHeight: "1.05",
            margin: "0 0 20px 0",
            background: `linear-gradient(135deg, #ffffff 0%, ${THEME.colors.amber} 50%, ${THEME.colors.teal} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Discover Sri Lanka
          <br />
          <span style={{ fontSize: "0.85em" }}>Like Never Before</span>
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: "16px",
            color: "rgba(255,255,255,0.65)",
            lineHeight: "1.7",
            marginBottom: "32px",
            maxWidth: "420px",
          }}
        >
          Navigate our immersive 3D paradise. Explore ancient fortresses, misty
          mountains, and coastal wonders. Hover over glowing markers to uncover
          hidden treasures.
        </p>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "16px 32px",
              background: `linear-gradient(135deg, ${THEME.colors.teal}, #0d8a82)`,
              color: "white",
              border: "none",
              borderRadius: "14px",
              fontWeight: "600",
              fontSize: "15px",
              cursor: "pointer",
              boxShadow: `0 12px 40px ${THEME.colors.teal}50`,
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
              e.currentTarget.style.boxShadow = `0 18px 50px ${THEME.colors.teal}70`;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = `0 12px 40px ${THEME.colors.teal}50`;
            }}
          >
            <Play size={18} fill="white" /> Start Exploring
          </button>

          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "16px 24px",
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(10px)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "14px",
              fontWeight: "500",
              fontSize: "15px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
            }}
          >
            <Camera size={18} /> Virtual Tour
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* STATISTICS PANEL */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          bottom: "8%",
          right: "5%",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? "translateX(0)" : "translateX(30px)",
          transition: "all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.3s",
        }}
      >
        {[
          {
            metric: "28°C",
            label: "Avg Temperature",
            icon: Sun,
            color: THEME.colors.amber,
          },
          {
            metric: "8+",
            label: "UNESCO Sites",
            icon: Landmark,
            color: THEME.colors.teal,
          },
          {
            metric: "26",
            label: "National Parks",
            icon: TreePine,
            color: "#4ade80",
          },
          {
            metric: "1340km",
            label: "Coastline",
            icon: Waves,
            color: "#60a5fa",
          },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              background: "rgba(5, 22, 34, 0.6)",
              border: "1px solid rgba(255,255,255,0.08)",
              padding: "18px 22px",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              minWidth: "180px",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(5, 22, 34, 0.8)";
              e.currentTarget.style.borderColor = stat.color + "40";
              e.currentTarget.style.transform = "translateX(-5px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(5, 22, 34, 0.6)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            <div
              style={{
                background: `${stat.color}20`,
                padding: "10px",
                borderRadius: "10px",
                display: "flex",
              }}
            >
              <stat.icon size={20} color={stat.color} />
            </div>
            <div>
              <div
                style={{
                  color: stat.color,
                  fontSize: "22px",
                  fontWeight: "700",
                  lineHeight: "1",
                }}
              >
                {stat.metric}
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  marginTop: "4px",
                  letterSpacing: "0.5px",
                }}
              >
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* DESTINATION QUICK ACCESS */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "20px",
          transform: "translateY(-50%)",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          opacity: isLoaded ? 1 : 0,
          transition: "all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.5s",
        }}
      >
        {DESTINATIONS.map((dest, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 14px",
              background: "rgba(5, 22, 34, 0.7)",
              backdropFilter: "blur(15px)",
              border: `1px solid ${dest.color}30`,
              borderRadius: "12px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(5, 22, 34, 0.9)";
              e.currentTarget.style.borderColor = dest.color;
              e.currentTarget.style.transform = "translateX(-8px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(5, 22, 34, 0.7)";
              e.currentTarget.style.borderColor = dest.color + "30";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            <div
              style={{
                background: dest.color,
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                boxShadow: `0 0 10px ${dest.color}`,
              }}
            />
            <span
              style={{
                color: "white",
                fontSize: "12px",
                fontWeight: "500",
              }}
            >
              {dest.name}
            </span>
            <ChevronRight size={14} color="rgba(255,255,255,0.5)" />
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* INTERACTION HINT */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 20px",
          background: "rgba(5, 22, 34, 0.6)",
          backdropFilter: "blur(10px)",
          borderRadius: "30px",
          border: "1px solid rgba(255,255,255,0.1)",
          opacity: isLoaded ? 0.8 : 0,
          transition: "all 1s ease 1s",
        }}
      >
        <Info size={14} color={THEME.colors.teal} />
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>
          Move your cursor to explore • Hover markers for details • Drag to
          rotate
        </span>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* VIGNETTE OVERLAY */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 5,
          background: `
            radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%),
            linear-gradient(to bottom, transparent 80%, rgba(5, 22, 34, 0.8) 100%)
          `,
        }}
      />

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* 3D CANVAS */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <Canvas
        camera={{ position: [0, 1, 6], fov: 55 }}
        shadows
        style={{ position: "absolute", inset: 0, zIndex: 1 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lighting Setup */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[10, 15, 10]}
          intensity={1.5}
          color={THEME.colors.amber}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <directionalLight
          position={[-5, 5, -5]}
          intensity={0.4}
          color={THEME.colors.teal}
        />
        <pointLight position={[0, 5, 0]} intensity={0.5} color="#ffffff" />

        {/* Hemisphere light for natural sky lighting */}
        <hemisphereLight
          args={[THEME.colors.amber, THEME.colors.oceanDeep, 0.3]}
        />

        {/* Fog for depth */}
        <fog attach="fog" args={[THEME.colors.deepNavy, 8, 30]} />

        {/* Ocean */}
        <Ocean />

        {/* Floating Island */}
        <FloatingIsland />

        {/* Detailed POI Elements */}
        <Sigiriya />
        <Ella />
        <Galle />

        {/* POI Markers */}
        {DESTINATIONS.map((dest, i) => (
          <POIMarker key={i} {...dest} />
        ))}

        {/* Ambient Effects */}
        <AmbientParticles />

        {/* Controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={4}
          maxDistance={12}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.2}
          autoRotate
          autoRotateSpeed={0.3}
        />

        {/* Camera Rig for Parallax */}
        <CameraRig />
      </Canvas>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* CSS ANIMATIONS */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.5); }
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          overflow: hidden;
        }
        
        ::selection {
          background: ${THEME.colors.teal};
          color: white;
        }
      `}</style>
    </div>
  );
}
