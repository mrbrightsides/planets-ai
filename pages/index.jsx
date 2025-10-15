"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";

const nodes = [
  { name: "AI Tongkrongan", link: "https://lpf-ai-buddy.vercel.app/", desc: "Teman ngobrol santai: curhat, ngelawak, atau diskusi ringan." },
  { name: "AI Blockchain", link: "https://learn3ai.vercel.app/", desc: "Penjelas teknologi & blockchain: dari konsep sampai integrasi." },
  { name: "AI Edukasi", link: "https://rantai-nexus.vercel.app/", desc: "Asisten akademik: riset, nulis, dan bimbingan materi kampus." },
  { name: "AI Spiritual", link: "https://smartfaith.vercel.app/", desc: "Refleksi dan pemikiran mendalam: dialog santai ke arah spiritual." },
];

function FloatingSphere({ index, color, name, link, desc, onHover }) {
  const mesh = useRef();
  const [hovered, setHover] = useState(false);
  const radius = 2 + Math.random() * 1.5;
  const speed = 0.2 + Math.random() * 0.3;
  const angleOffset = Math.random() * Math.PI * 2;

  useFrame(({ clock }) => {
  const t = clock.getElapsedTime() * speed + angleOffset;

  const hoverFactor = hovered ? 0.1 : 1;
  mesh.current.position.x = Math.cos(t) * radius * hoverFactor;
  mesh.current.position.y = Math.sin(t * 0.9) * radius * 0.5 * hoverFactor;
  mesh.current.position.z = Math.sin(t) * radius * hoverFactor;

  mesh.current.rotation.y += 0.003;
});

  return (
    <mesh
      ref={mesh}
      onClick={() => window.open(link, "_blank")}
      onPointerOver={() => {
        setHover(true);
        onHover(name, desc);
      }}
      onPointerOut={() => {
        setHover(false);
        onHover(null, null);
      }}
      scale={hovered ? 1.3 : 1}
    >
      <sphereGeometry args={[0.5, 64, 64]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={hovered ? 0.7 : 0.3}
        metalness={0.4}
        roughness={0.2}
      />
    </mesh>
  );
}

export default function Home() {
  const [hoveredInfo, setHoveredInfo] = useState({ name: null, desc: null });
  const colors = ["#9bbcff", "#c49bff", "#9bffd6", "#ffe29b"];

  return (
    <div
      className="h-screen w-screen relative"
      style={{
        background: "radial-gradient(circle at 20% 20%, #120032, #000010)",
        color: "white",
        fontFamily: "serif",
        overflow: "hidden",
      }}
    >
      <h1 className="text-4xl font-bold text-center pt-6">
        🌌 AI Lounge by Khudri
      </h1>

      <Canvas camera={{ position: [0, 0, 6] }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} />
        <Stars radius={100} depth={50} count={4000} factor={4} saturation={0} fade speed={1} />
        <Suspense fallback={null}>
          {nodes.map((n, i) => (
            <FloatingSphere
              key={i}
              index={i}
              color={colors[i % colors.length]}
              name={n.name}
              link={n.link}
              desc={n.desc}
              onHover={(name, desc) => setHoveredInfo({ name, desc })}
            />
          ))}
        </Suspense>
        <OrbitControls enableZoom={false} />
      </Canvas>

      <div className="absolute bottom-10 w-full text-center">
        {hoveredInfo.name ? (
          <div>
            <p className="text-xl font-semibold">{hoveredInfo.name}</p>
            <p className="text-sm opacity-80">{hoveredInfo.desc}</p>
          </div>
        ) : (
          <p className="text-sm opacity-60 italic">Arahkan kursor ke salah satu AI</p>
        )}
      </div>

      <footer className="absolute bottom-2 left-4 text-xs opacity-70">
        Powered by Vercel • React Three Fiber
      </footer>
    </div>
  );
}
