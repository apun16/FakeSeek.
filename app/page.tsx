import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-navy">
      <Navbar />
      
      <main className="flex-1">
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Left Button - Detect and Scan */}
          <Link 
            href="/detect"
            className="flex-1 flex items-center justify-center bg-gradient-to-br from-orange/20 to-orange/10 border-r border-white/20 hover:from-orange/30 hover:to-orange/20 transition-all duration-300 group"
          >
            <div className="text-center p-8">
              <div className="mb-6">
                <svg 
                  className="w-16 h-16 mx-auto text-orange group-hover:scale-110 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
              </div>
              <h2 className="text-4xl font-oswald font-bold text-white mb-4 group-hover:text-orange transition-colors duration-300">
                Detect and Scan the Web
              </h2>
              <p className="text-lg font-author text-white/80 max-w-md mx-auto">
                Use our advanced AI technology to scan and detect fake news across the internet
              </p>
            </div>
          </Link>

          {/* Right Button - Learn and Prevent */}
          <Link 
            href="/prevent"
            className="flex-1 flex items-center justify-center bg-gradient-to-br from-orange/20 to-orange/10 hover:from-orange/30 hover:to-orange/20 transition-all duration-300 group"
          >
            <div className="text-center p-8">
              <div className="mb-6">
                <svg 
                  className="w-16 h-16 mx-auto text-orange group-hover:scale-110 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                  />
                </svg>
              </div>
              <h2 className="text-4xl font-oswald font-bold text-white mb-4 group-hover:text-orange transition-colors duration-300">
                Learn and Prevent
              </h2>
              <p className="text-lg font-author text-white/80 max-w-md mx-auto">
                Educate yourself with our comprehensive resources to prevent falling for fake news
              </p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}
