import { useState, useEffect, useRef, Suspense } from "react";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Settings, 
  Trash2, 
  Rocket,
  Shield,
  BookOpen,
  Compass,
  Code2,
  ArrowLeft,
  Info
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./lib/utils";
import { GoogleGenAI } from "@google/genai";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Float, Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { PLANETS, PlanetConfig } from "./constants/planets";

const SUPPORTED_MODELS = [
  "gemini-3-flash-preview",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-3.1-pro-preview"
];

const PlanetIcon = ({ name, className }: { name: string, className?: string }) => {
  switch (name) {
    case "Rocket": return <Rocket className={className} />;
    case "Shield": return <Shield className={className} />;
    case "BookOpen": return <BookOpen className={className} />;
    case "Compass": return <Compass className={className} />;
    case "Code2": return <Code2 className={className} />;
    default: return <Rocket className={className} />;
  }
};

const FloatingPlanet = ({ config, onSelect }: { config: PlanetConfig, onSelect: (id: string) => void }) => {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.01;
      mesh.current.position.y = Math.sin(state.clock.getElapsedTime() + config.id.length) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <Sphere
        args={[1, 32, 32]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onSelect(config.id)}
        scale={hovered ? 1.2 : 1}
      >
        <MeshDistortMaterial
          color={config.color}
          speed={2}
          distort={0.3}
          radius={1}
        />
      </Sphere>
    </Float>
  );
};

const LandingPage = ({ onSelectPlanet }: { onSelectPlanet: (id: string) => void }) => {
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          <Suspense fallback={null}>
            {Object.values(PLANETS).map((planet, i) => {
              const angle = (i / Object.values(PLANETS).length) * Math.PI * 2;
              const radius = 6;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              
              return (
                <group key={planet.id} position={[x, y, 0]}>
                  <FloatingPlanet config={planet} onSelect={onSelectPlanet} />
                </group>
              );
            })}
          </Suspense>
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      <div className="z-10 text-center px-4 max-w-2xl pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-4 tracking-tighter">
            Welcome to <span className="text-space-accent">Planets AI</span>
          </h1>
          <p className="text-lg text-white/70 mb-8 leading-relaxed">
            A creative space exploring the intersection of artificial intelligence, design, science, and imagination. Each AI represents a different capability.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pointer-events-auto">
          {Object.values(PLANETS).map((planet) => (
            <button
              key={planet.id}
              onClick={() => onSelectPlanet(planet.id)}
              className="group flex items-center gap-4 p-4 glass-panel hover:bg-white/10 transition-all text-left border-l-4"
              style={{ borderLeftColor: planet.color }}
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: planet.color }}
              >
                <PlanetIcon name={planet.icon} className="text-white w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-white group-hover:text-space-glow transition-colors">{planet.name}</h3>
                <p className="text-xs text-white/50 line-clamp-1">{planet.description}</p>
              </div>
            </button>
          ))}
        </div>
        
        <p className="mt-8 text-xs text-white/30 font-mono uppercase tracking-widest animate-pulse">
          Click a planet to dive into different personalities
        </p>
      </div>
    </div>
  );
};

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const StarBackground = () => {
  const [stars, setStars] = useState<{ id: number; top: string; left: string; size: string; duration: string }[]>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      duration: `${Math.random() * 3 + 2}s`,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="stars-bg">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            "--duration": star.duration,
          } as any}
        />
      ))}
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<"landing" | "chat">("landing");
  const [selectedPlanetId, setSelectedPlanetId] = useState<string>("buddy");
  const [selectedModel, setSelectedModel] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("selectedModel");
      if (saved && SUPPORTED_MODELS.includes(saved)) return saved;
    }
    return SUPPORTED_MODELS[0];
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentPlanet = PLANETS[selectedPlanetId];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    localStorage.setItem("selectedModel", selectedModel);
  }, [selectedModel]);

  useEffect(() => {
    if (view === "chat") {
      inputRef.current?.focus();
    }
  }, [view]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSelectPlanet = (id: string) => {
    setSelectedPlanetId(id);
    setMessages([]); // Clear messages when switching planets
    setView("chat");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "" });
      
      const history = messages.map(m => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }]
      }));

      const chat = ai.chats.create({
        model: selectedModel,
        config: {
          systemInstruction: currentPlanet.systemInstruction,
        },
        history: history as any
      });

      const assistantMessageId = (Date.now() + 1).toString();
      setMessages((prev) => [...prev, { id: assistantMessageId, role: "assistant", content: "" }]);

      const result = await chat.sendMessageStream({ message: input });
      
      let fullContent = "";
      for await (const chunk of result) {
        fullContent += chunk.text;
        setMessages((prev) => 
          prev.map((m) => 
            m.id === assistantMessageId ? { ...m, content: fullContent } : m
          )
        );
      }
    } catch (error: any) {
      console.error("Gemini Error:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `🚨 **Space Engine Error**: ${error.message || "Something went wrong with the Gemini connection."}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  if (view === "landing") {
    return <LandingPage onSelectPlanet={handleSelectPlanet} />;
  }

  return (
    <div className="relative h-screen flex flex-col items-center p-4 md:p-8 overflow-hidden">
      <StarBackground />
      {/* Dynamic Background Glow */}
      <div 
        className="fixed inset-0 z-0 transition-colors duration-1000"
        style={{ 
          backgroundImage: `radial-gradient(circle at 50% 50%, ${currentPlanet.glowColor} 0%, transparent 70%)` 
        }}
      />

      {/* Header */}
      <header className="w-full max-w-4xl flex items-center justify-between mb-6 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setView("landing")}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white mr-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-500"
            style={{ 
              backgroundColor: currentPlanet.color,
              boxShadow: `0 0 20px ${currentPlanet.accentColor}`
            }}
          >
            <PlanetIcon name={currentPlanet.icon} className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold tracking-tight text-white">
              {currentPlanet.name} <span className="text-white/30 text-sm font-normal ml-2">Planets AI</span>
            </h1>
            <p className="text-xs text-white/50 font-mono uppercase tracking-widest">{currentPlanet.tagline}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMessages([])}
            className="p-2 rounded-full hover:bg-red-500/20 transition-colors text-white/70 hover:text-red-400"
            title="Clear orbit"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="w-full max-w-4xl flex-1 flex flex-col glass-panel overflow-hidden z-10 shadow-2xl">
        <AnimatePresence>
          {isSettingsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b border-white/10 bg-white/5 overflow-hidden"
            >
              <div className="p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-white/50 uppercase">Engine Selection</label>
                  <div className="flex items-center gap-1 text-[10px] text-white/30">
                    <Info className="w-3 h-3" />
                    <span>Gemini 3 Flash is recommended</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {SUPPORTED_MODELS.map((model) => (
                    <button
                      key={model}
                      onClick={() => setSelectedModel(model)}
                      className={cn(
                        "text-xs p-2 rounded-lg border transition-all text-left truncate",
                        selectedModel === model
                          ? "bg-white/10 border-white/40 text-white"
                          : "bg-white/5 border-white/10 text-white/50 hover:border-white/30"
                      )}
                      style={selectedModel === model ? { borderColor: currentPlanet.color } : {}}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
              <div 
                className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10 transition-all duration-1000"
                style={{ borderColor: currentPlanet.accentColor }}
              >
                <Sparkles className="w-10 h-10" style={{ color: currentPlanet.color }} />
              </div>
              <div>
                <h3 className="text-lg font-display font-medium">Greetings from {currentPlanet.name}</h3>
                <p className="text-sm max-w-xs mx-auto mb-6">
                  {currentPlanet.welcomeMessage}
                </p>

                <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto">
                  <div className="flex items-center gap-2 text-white/30">
                    <div className="h-px w-8 bg-current" />
                    <span className="text-[10px] uppercase tracking-widest">Suggested Prompts</span>
                    <div className="h-px w-8 bg-current" />
                  </div>
                  <div className="grid grid-cols-1 gap-2 w-full">
                    {currentPlanet.suggestedPrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => setInput(prompt)}
                        className="group flex items-center gap-3 text-left text-xs p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-white/60 hover:text-white"
                      >
                        <Sparkles className="w-3 h-3 shrink-0 opacity-30 group-hover:opacity-100 transition-opacity" style={{ color: currentPlanet.color }} />
                        <span className="line-clamp-1">{prompt}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((m) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={m.id}
                  className={cn(
                    "flex gap-4",
                    m.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div 
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-500",
                      m.role === "user" ? "bg-white/10" : "text-white shadow-lg"
                    )}
                    style={m.role === "assistant" ? { backgroundColor: currentPlanet.color, boxShadow: `0 0 10px ${currentPlanet.accentColor}` } : {}}
                  >
                    {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={cn(
                    "max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed",
                    m.role === "user" 
                      ? "bg-white/10 text-white rounded-tr-none" 
                      : "bg-white/5 border border-white/10 text-white/90 rounded-tl-none"
                  )}>
                    {m.role === "assistant" && m.content === "" ? (
                      <div className="flex gap-1 py-2">
                        <span className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    ) : (
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown>
                          {m.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 border-t border-white/10 bg-black/20">
          <form onSubmit={handleSubmit} className="relative">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message ${currentPlanet.name}...`}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-4 pr-14 focus:outline-none focus:ring-2 transition-all text-sm"
              style={{ 
                borderColor: input.trim() ? currentPlanet.accentColor : 'rgba(255,255,255,0.1)',
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all text-white shadow-lg"
              style={{ 
                backgroundColor: currentPlanet.color,
                opacity: (!input.trim() || isLoading) ? 0.5 : 1
              }}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className="text-[10px] text-center mt-3 text-white/30 font-mono uppercase tracking-tighter">
            {currentPlanet.name} Engine • {selectedModel}
          </p>
        </div>
      </main>
    </div>
  );
}
