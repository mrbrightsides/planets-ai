import { Html, Float, useTexture } from '@react-three/drei'
import { useCursor } from '@react-three/drei'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function AIOrb({ position, color, label, url, description }) {
  const ref = useRef()
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)
  const matRef = useRef()

  // subtle bobbing handled by Float wrapper, but we add small scale/rotation
  useFrame((state, delta) => {
    if (!ref.current) return
    // slow gentle spin
    ref.current.rotation.y += delta * 0.2
    // smooth scale
    const target = hovered ? 1.18 : 1.0
    ref.current.scale.lerp(new THREE.Vector3(target, target, target), 0.1)
  })

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
      <group position={position}>
        <mesh
          ref={ref}
          onClick={() => window.open(url, '_blank')}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
          onPointerOut={(e) => { e.stopPropagation(); setHovered(false) }}
        >
          <sphereGeometry args={[0.9, 64, 64]} />
          <meshStandardMaterial
            ref={matRef}
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 2.6 : 1.2}
            metalness={0.7}
            roughness={0.2}
            envMapIntensity={0.6}
            transparent
            opacity={0.96}
          />
        </mesh>

        {/* inner core glow */}
        <mesh position={[0, 0, 0]} scale={[0.7, 0.7, 0.7]}>
          <sphereGeometry args={[0.85, 64, 64]} />
          <meshBasicMaterial color={color} transparent opacity={0.12} />
        </mesh>

        <Html center distanceFactor={6}>
          <div className="pointer-events-none select-none text-center">
            <div className="text-sm font-semibold text-white drop-shadow-md">{label}</div>
          </div>
        </Html>

        {/* Tooltip shown when hovered */}
        {hovered && (
          <Html position={[0, -1.6, 0]} distanceFactor={6}>
            <div className="bg-white/6 backdrop-blur-md border border-white/10 text-xs text-white px-3 py-2 rounded-md shadow-lg max-w-xs">
              <div className="font-medium text-sm">{label}</div>
              <div className="mt-1 text-[12px] opacity-85">{description}</div>
              <div className="mt-2 text-[11px] opacity-70">Klik untuk buka →</div>
            </div>
          </Html>
        )}
      </group>
    </Float>
  )
}
