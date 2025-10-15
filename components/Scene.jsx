import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import AIOrb from './AIOrb'
import { useRef } from 'react'

function RotatingGroup({ children }) {
  const g = useRef()
  useFrame((state, delta) => {
    // very slow rotation around Y axis for the whole group
    if (g.current) g.current.rotation.y += delta * 0.08
  })
  return <group ref={g}>{children}</group>
}

export default function Scene() {
  // Positions arranged roughly in a circle
  const positions = {
    buddy: [2.6, 1.2, 0],
    blockchain: [-2.6, 1.2, 0],
    edukasi: [2.6, -1.2, 0],
    spiritual: [-2.6, -1.2, 0]
  }

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 9], fov: 50 }} style={{ height: '100vh' }}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 10, 7]} intensity={1.2} />
        <pointLight position={[-6, -2, -4]} intensity={0.45} />
        <Environment preset="city" blur={0.8} />

        <RotatingGroup>
          <AIOrb
            position={positions.buddy}
            color={'#00FFFF'}
            label={'AI Tongkrongan'}
            description={'Teman ngobrol santai: curhat, ngelawak, atau diskusi ringan.'}
            url={'https://lpf-ai-buddy.vercel.app/'}
          />
          <AIOrb
            position={positions.blockchain}
            color={'#C084FC'}
            label={'AI Blockchain'}
            description={'Penjelas teknologi & blockchain: dari konsep sampai integrasi.'}
            url={'https://learn3ai.vercel.app/'}
          />
          <AIOrb
            position={positions.edukasi}
            color={'#FDBA74'}
            label={'AI Edukasi'}
            description={'Asisten akademik: riset, nulis, dan bimbingan materi kampus.'}
            url={'https://rantai-nexus.vercel.app/'}
          />
          <AIOrb
            position={positions.spiritual}
            color={'#5EEAD4'}
            label={'AI Spiritual'}
            description={'Refleksi dan pemikiran mendalam: dialog santai ke arah spiritual.'}
            url={'https://smartfaith.vercel.app/'}
          />
        </RotatingGroup>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={6}
          maxDistance={15}
          autoRotate={false}
        />
      </Canvas>
    </div>
  )
}
