"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";

const nodes = [
  { name: "AI Tongkrongan", link: "https://lpf-ai-buddy.vercel.app/", desc: "Teman ngobrol dan brainstorming ringan." },
  { name: "AI Blockchain", link: "https://learn3ai.vercel.app/", desc: "Penjelasan teknologi dan integrasi blockchain." },
  { name: "AI Edukasi", link: "https://rantai-nexus.vercel.app/", desc: "AI untuk pembelajaran dan penjelasan konsep." },
  { name: "AI Spiritual", link: "https://smartfaith.vercel.app/", desc: "Eksperimen dan sandbox untuk ide baru." },
];

function FloatingSphere({ position, color, name, link, desc, onHover }) {
  const mesh = useRef();
  const [hovered, setHover] = useState(false);
  const [direction] = useState(() => new THREE.Vector3(
    (Math.random() - 0.5) * 0.01,
    (Math.random() - 0.5) * 0.01,
    (Math.random() - 0.5) * 0.01
  ));

  useState(() => {
    const interval = setInterval(() => {
      mesh.current.position.add(direction);
      ["x", "y", "z"].forEach((axis) => {
        if (mesh.current.position[axis] > 3 || mesh.current.position[axis] < -3)
          direction[axis] *= -1;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <mesh
      ref={mesh}
      position={position}
      onClick={() => window.open(link, "_blank")}
      onPointerOver={() => {
        setHover(true);
        onHover(name, desc);
      }}
      onPointerOut={() => {
        setHover(false);
        onHover(null, null);
      }}
      scale={hovered ? 1.2 : 1}
    >
      <sphereGeometry args={[0.5, 64, 64]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        roughness={0.3}
        metalness={0.2}
      />
    </mesh>
  );
}

export default function Home() {
  const [hoveredInfo, setHoveredInfo] = useState({ name: null, desc: null });
  const colors = ["#9bbcff", "#c49bff", "#9bffd6", "#ffe29b"];

  return (
    <div
      className="h-screen w-screen"
      style={{
        background: "radial-gradient(circle at 20% 20%, #1a0033, #000010)",
        color: "white",
        fontFamily: "serif",
      }}
    >
      <h1 className="text-4xl font-bold text-center pt-6">🌌 AI Lounge by Khudri</h1>

      <Canvas camera={{ position: [0, 0, 6] }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          {nodes.map((n, i) => (
            <FloatingSphere
              key={i}
              position={[
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 2,
              ]}
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

      <div className="absolute bottom-6 w-full text-center">
        {hoveredInfo.name && (
          <div>
            <p className="text-xl font-semibold">{hoveredInfo.name}</p>
            <p className="text-sm opacity-80">{hoveredInfo.desc}</p>
          </div>
        )}
      </div>

      <footer className="absolute bottom-2 left-4 text-xs opacity-70">
        Powered by Vercel • React Three Fiber
      </footer>
    </div>
  );
}
