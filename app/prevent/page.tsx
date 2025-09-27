import Navbar from '@/components/Navbar'

export default function Prevent() {
  return (
    <div className="min-h-screen bg-navy">
      
      <main className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="w-full max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-oswald font-bold text-white mb-6">
              Learn & Prevent
            </h1>
            <p className="text-xl font-inter text-white/80 max-w-2xl mx-auto">
              This page will contain educational resources and prevention strategies for fake news.
            </p>
          </div>
          
          {/* Learn and News boxes */}
          <div className="flex gap-8 justify-center w-full">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 h-80 flex-1 hover:bg-white/15 transition-colors cursor-pointer">
              <h2 className="text-3xl font-oswald font-bold text-white text-center">
                Learn
              </h2>
              <p className="text-white/70 text-center mt-4 text-lg">
                Educational resources and guides
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 h-80 flex-1 hover:bg-white/15 transition-colors cursor-pointer">
              <h2 className="text-3xl font-oswald font-bold text-white text-center">
                News
              </h2>
              <p className="text-white/70 text-center mt-4 text-lg">
                Latest updates and articles
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
