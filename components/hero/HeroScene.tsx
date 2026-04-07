"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { memo, useRef } from "react";
import * as THREE from "three";

type HeroSceneProps = {
  reducedMotion: boolean;
};

function createParticlePositions(count: number) {
  const array = new Float32Array(count * 3);
  let seed = 937;

  const next = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  for (let i = 0; i < count; i += 1) {
    array[i * 3] = (next() - 0.5) * 7;
    array[i * 3 + 1] = (next() - 0.5) * 7;
    array[i * 3 + 2] = (next() - 0.5) * 7;
  }

  return array;
}

const PARTICLE_POSITIONS = createParticlePositions(320);

function ParticleField() {
  const points = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    if (!points.current) {
      return;
    }

    points.current.rotation.y += delta * 0.04;
    points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.2;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[PARTICLE_POSITIONS, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#8cf0ff"
        size={0.022}
        sizeAttenuation
        transparent
        opacity={0.58}
      />
    </points>
  );
}

function IdentityTotem({ reducedMotion }: HeroSceneProps) {
  const group = useRef<THREE.Group>(null);
  const bookOrbiter = useRef<THREE.Group>(null);
  const ballOrbiter = useRef<THREE.Group>(null);
  const flutterMark = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) {
      return;
    }

    const targetX = state.pointer.y * 0.35;
    const targetY = state.pointer.x * 0.45;

    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      targetX,
      5,
      delta,
    );
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      targetY,
      5,
      delta,
    );

    if (!reducedMotion) {
      const t = state.clock.elapsedTime;

      group.current.rotation.z += delta * 0.05;
      group.current.position.y = Math.sin(t * 0.9) * 0.08;

      if (bookOrbiter.current) {
        bookOrbiter.current.position.x = Math.cos(t * 0.8) * 1.58;
        bookOrbiter.current.position.z = Math.sin(t * 0.8) * 1.58;
        bookOrbiter.current.position.y = 0.24 + Math.sin(t * 1.7) * 0.08;
        bookOrbiter.current.rotation.y = -t * 0.8;
      }

      if (ballOrbiter.current) {
        ballOrbiter.current.position.x = Math.cos(t * 1.12 + Math.PI) * 1.34;
        ballOrbiter.current.position.z = Math.sin(t * 1.12 + Math.PI) * 1.34;
        ballOrbiter.current.position.y = -0.38 + Math.cos(t * 2.2) * 0.06;
        ballOrbiter.current.rotation.y += delta * 0.9;
      }

      if (flutterMark.current) {
        flutterMark.current.rotation.y += delta * 0.45;
      }
    }
  });

  return (
    <group ref={group}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.32, 2.16, 0.12]} />
        <meshStandardMaterial color="#0e1526" metalness={0.45} roughness={0.42} />
      </mesh>

      <mesh position={[0, 0, 0.068]}>
        <planeGeometry args={[1.2, 2]} />
        <meshStandardMaterial
          color="#0f2035"
          emissive="#133458"
          emissiveIntensity={0.5}
          roughness={0.3}
          metalness={0.15}
        />
      </mesh>

      <mesh position={[0, 0.82, 0.07]}>
        <circleGeometry args={[0.06, 32]} />
        <meshBasicMaterial color="#8cf0ff" transparent opacity={0.75} />
      </mesh>

      <group ref={flutterMark} position={[0, 0.05, 0.1]}>
        <mesh position={[-0.16, 0.19, 0]} rotation={[0, 0, 0.82]}>
          <boxGeometry args={[0.2, 0.74, 0.05]} />
          <meshStandardMaterial color="#46c4ff" metalness={0.25} roughness={0.25} />
        </mesh>
        <mesh position={[0.16, -0.04, 0]} rotation={[0, 0, -0.78]}>
          <boxGeometry args={[0.22, 0.9, 0.05]} />
          <meshStandardMaterial color="#2899ff" metalness={0.3} roughness={0.22} />
        </mesh>
        <mesh position={[0.03, -0.3, 0.01]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.52, 0.2, 0.04]} />
          <meshStandardMaterial color="#85e9ff" metalness={0.12} roughness={0.26} />
        </mesh>
      </group>

      <group position={[0, -0.86, 0.095]}>
        <mesh position={[0, 0.06, 0]} rotation={[0.09, 0.12, -0.1]}>
          <boxGeometry args={[0.84, 0.06, 0.09]} />
          <meshStandardMaterial color="#f4f8ff" roughness={0.82} />
        </mesh>
        <mesh position={[0, -0.01, 0]} rotation={[-0.08, -0.12, 0.11]}>
          <boxGeometry args={[0.84, 0.06, 0.09]} />
          <meshStandardMaterial color="#dce8fa" roughness={0.84} />
        </mesh>
      </group>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.018, 20, 200]} />
        <meshStandardMaterial color="#8cf0ff" emissive="#8cf0ff" emissiveIntensity={0.35} />
      </mesh>

      <group ref={bookOrbiter}>
        <mesh rotation={[0.2, 0.34, 0.14]}>
          <boxGeometry args={[0.3, 0.04, 0.18]} />
          <meshStandardMaterial color="#fcffff" roughness={0.74} />
        </mesh>
        <mesh position={[0, 0.045, 0]} rotation={[0.2, -0.28, -0.14]}>
          <boxGeometry args={[0.3, 0.04, 0.18]} />
          <meshStandardMaterial color="#d8ecff" roughness={0.72} />
        </mesh>
      </group>

      <group ref={ballOrbiter}>
        <mesh>
          <icosahedronGeometry args={[0.19, 0]} />
          <meshStandardMaterial color="#c8102e" metalness={0.22} roughness={0.35} emissive="#50050f" emissiveIntensity={0.2} />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[0.205, 1]} />
          <meshBasicMaterial color="#ffd7de" wireframe transparent opacity={0.24} />
        </mesh>
      </group>
    </group>
  );
}

function OrbitGuides() {
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.6, 0.008, 16, 140]} />
        <meshBasicMaterial color="#9edfff" transparent opacity={0.24} />
      </mesh>
      <mesh rotation={[Math.PI / 2.35, 0.38, 0.45]}>
        <torusGeometry args={[1.36, 0.008, 16, 140]} />
        <meshBasicMaterial color="#ff7f95" transparent opacity={0.17} />
      </mesh>
    </group>
  );
}

function HeroScene({ reducedMotion }: HeroSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.6} color="#86d8ff" />
      <pointLight position={[2.6, 3.1, 3.8]} intensity={12} color="#96e8ff" />
      <pointLight position={[-3.2, -2.6, -2.8]} intensity={8.5} color="#75bfff" />
      <pointLight position={[0, 0.2, 2.8]} intensity={6} color="#d02245" />
      <ParticleField />
      <OrbitGuides />
      <IdentityTotem reducedMotion={reducedMotion} />
    </Canvas>
  );
}

export default memo(HeroScene);
