import Navbar from '@/components/Navbar'

export default function About() {
  return (
    <div className="min-h-screen bg-navy">
      <Navbar />
      <main className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h1 className="text-5xl font-oswald font-bold text-white mb-6">
            About Us
          </h1>
          <p className="text-xl font-author text-white/80 max-w-2xl mx-auto">
            Learn more about FakeSeek and our mission to combat fake news through technology and education.
          </p>
        </div>
      </main>
    </div>
  )
}
