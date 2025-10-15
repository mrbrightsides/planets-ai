"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Suspense, useRef, useState } from "react";
import { motion } from "framer-motion";
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
  if (!hovered) {
    mesh.current.position.x = Math.cos(t) * radius;
    mesh.current.position.y = Math.sin(t * 0.9) * radius * 0.5;
    mesh.current.position.z = Math.sin(t) * radius;
  }

  mesh.current.rotation.y += 0.003;
});

  return (
    <mesh
      ref={mesh}
      onClick={() => window.location.href = link}
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
      <motion.h1
        className="text-2xl md:text-3xl font-extrabold text-white tracking-wide flex items-center justify-center space-x-2"
        initial={{ y: 0 }}
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <span>AI Lounge</span>
      </motion.h1>

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

      <section className="about-section">
        <div className="about-content">
          <h2>Welcome to AI Lounge</h2>
          <p>
            AI (Artificial Intelligence) Lounge by Khudri is a creative space exploring the intersection of 
            artificial intelligence, design, science, technology, religion, and imagination. Each AI represents 
            a different capability — from storytelling to smart analytics.
          </p>
          <p>
            Dive into the cosmic playground of ideas where humans and AI 
            collaborate to build the future.
          </p>
        </div>
      </section>

      <div className="w-full h-[4px] bg-gradient-to-r from-cyan-400 via-purple-500 to-yellow-400 my-6 rounded-full border border-white/20 shadow-lg" />

      <motion.section
        className="text-white mt-4 text-sm space-y-2"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <h3 className="font-semibold text-lg mb-2">🪐 AI Planet Guide</h3>
        <p>🔵 <b>AI Tongkrongan</b> — <i>Teman ngobrol santai</i>: curhat, ngelawak, atau diskusi ringan.</p>
        <p>🟣 <b>AI Blockchain</b> — <i>Penjelas teknologi & blockchain</i>: dari konsep sampai integrasi.</p>
        <p>🟢 <b>AI Edukasi</b> — <i>Asisten akademik</i>: riset, nulis, dan bimbingan materi kampus.</p>
        <p>🟡 <b>AI Spiritual</b> — <i>Refleksi dan pemikiran mendalam</i>: dialog santai ke arah spiritual.</p>
      </motion.section>

      <div className="absolute bottom-10 w-full text-center">
        {hoveredInfo.name ? (
          <div>
            <p className="text-xl font-semibold">{hoveredInfo.name}</p>
            <p className="text-sm opacity-80">{hoveredInfo.desc}</p>
          </div>
        ) : (
          <p className="text-sm opacity-60 italic">💡 Click one of the circles to dive into different personalities of AI</p>
        )}
      </div>

      <div className="w-full h-[4px] bg-gradient-to-r from-cyan-400 via-purple-500 to-yellow-400 my-6 rounded-full border border-white/20 shadow-lg" />

      <footer className="absolute bottom-2 left-4 text-xs opacity-70">
        Powered by Vercel • React Three Fiber
      </footer>
    </div>
  );
}
