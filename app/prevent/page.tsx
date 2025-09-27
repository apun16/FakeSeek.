import Navbar from '@/components/Navbar'

export default function Prevent() {
  return (
    <div className="min-h-screen bg-navy">
      
      <main className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="w-full max-w-6xl">
          
          {/* Progress Bar */}
          <div className="w-full mb-8">
            <div className="bg-white/20 rounded-full h-3 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-full w-3/4 rounded-full transition-all duration-500"></div>
            </div>
          </div>
             
          {/* Learn and News boxes */}
          <div className="flex gap-8 justify-center w-full">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 h-96 flex-1 hover:bg-white/15 transition-colors cursor-pointer flex flex-col">
              <h2 className="text-3xl font-oswald font-bold text-white text-center mb-6">
                Learn
              </h2>
              <div className="flex-1 flex flex-col gap-4">
                <div className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors cursor-pointer">
                  <h3 className="text-xl font-oswald font-semibold text-white text-center">
                    Spot the Deepfake
                  </h3>
                  <p className="text-white/70 text-center mt-2 text-sm">
                    Learn to identify AI-generated content
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors cursor-pointer">
                  <h3 className="text-xl font-oswald font-semibold text-white text-center">
                    Phishing Protection
                  </h3>
                  <p className="text-white/70 text-center mt-2 text-sm">
                    Protect yourself from phishing attacks
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 h-96 flex-1 hover:bg-white/15 transition-colors cursor-pointer">
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
