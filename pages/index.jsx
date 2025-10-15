import Scene from '../components/Scene'

export default function Home() {
  return (
    <main className="w-screen h-screen flex flex-col items-center justify-center relative">
      <h1 className="absolute top-6 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
        AI Lounge by Khudri
      </h1>
      <Scene />
      <footer className="absolute bottom-4 text-xs opacity-70">
        Powered by Vercel • React Three Fiber
      </footer>
    </main>
  )
}
