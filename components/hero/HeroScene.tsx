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

function CoreObject({ reducedMotion }: HeroSceneProps) {
  const group = useRef<THREE.Group>(null);

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
      group.current.rotation.z += delta * 0.08;
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.09;
    }
  });

  return (
    <group ref={group}>
      <mesh castShadow receiveShadow>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshPhysicalMaterial
          color="#63d2e6"
          roughness={0.08}
          metalness={0.12}
          transmission={0.88}
          thickness={1.1}
          ior={1.32}
          clearcoat={1}
          clearcoatRoughness={0.1}
          opacity={0.9}
          transparent
        />
      </mesh>
      <mesh rotation={[Math.PI / 2.7, 0, 0]}>
        <torusGeometry args={[1.62, 0.03, 24, 160]} />
        <meshStandardMaterial color="#d8ff6a" emissive="#6f9f0f" emissiveIntensity={0.35} />
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
      <ambientLight intensity={0.65} color="#6bd6ff" />
      <pointLight position={[2.8, 3.2, 3.8]} intensity={14} color="#9eeeff" />
      <pointLight position={[-3.4, -2.5, -3]} intensity={10} color="#8aef81" />
      <ParticleField />
      <CoreObject reducedMotion={reducedMotion} />
    </Canvas>
  );
}

export default memo(HeroScene);
