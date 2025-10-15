import { Html, Float } from '@react-three/drei'
import { useCursor } from '@react-three/drei'
import { useState } from 'react'

export default function AIOrb({ position, color, label, url }) {
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)

  return (
    <Float speed={3} rotationIntensity={1} floatIntensity={2}>
      <mesh
        position={position}
        onClick={() => window.open(url, '_blank')}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          emissive={color}
          emissiveIntensity={hovered ? 3 : 1.2}
          color={color}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>
      <Html center distanceFactor={8}>
        <div className="text-center text-white font-semibold text-sm opacity-80">
          {label}
        </div>
      </Html>
    </Float>
  )
}
