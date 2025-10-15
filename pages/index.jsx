import Scene from '../components/Scene'

export default function Home() {
  return (
    <main className="w-screen h-screen relative">
      <header className="absolute top-6 left-6 z-40">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-400">
          AI Lounge by Khudri
        </h1>
        <p className="text-xs mt-1 opacity-80">Klik orb untuk buka masing-masing AI — buka di tab baru</p>
      </header>

      <Scene />

      <footer className="absolute bottom-4 left-6 z-40 text-xs opacity-70">
        Powered by Vercel • React Three Fiber
      </footer>
    </main>
  )
}
