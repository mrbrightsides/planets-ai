import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import AIOrb from './AIOrb'

export default function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={2} />
      <Environment preset="city" />
      <AIOrb
        position={[-3, 1.5, 0]}
        color="#00FFFF"
        label="AI Tongkrongan"
        url="https://lpf-ai-buddy.vercel.app/"
      />
      <AIOrb
        position={[3, 1.5, 0]}
        color="#C084FC"
        label="AI Blockchain"
        url="https://learn3ai.vercel.app/"
      />
      <AIOrb
        position={[-3, -1.5, 0]}
        color="#FDBA74"
        label="AI Edukasi"
        url="https://rantai-nexus.vercel.app/"
      />
      <AIOrb
        position={[3, -1.5, 0]}
        color="#5EEAD4"
        label="AI Spiritual"
        url="https://smartfaith.vercel.app/"
      />
      <OrbitControls enableZoom={false} />
    </Canvas>
  )
}
