import Navbar from '@/components/Navbar'

export default function Prevent() {
  return (
    <div className="min-h-screen bg-navy">
      <Navbar />
      <main className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h1 className="text-5xl font-oswald font-bold text-white mb-6">
            Learn & Prevent
          </h1>
          <p className="text-xl font-author text-white/80 max-w-2xl mx-auto">
            This page will contain educational resources and prevention strategies for fake news.
          </p>
        </div>
      </main>
    </div>
  )
}
