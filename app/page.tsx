import ReviewsSlider from '@/components/ReviewsSlider'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="bg-white dark:bg-navy relative overflow-hidden">
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange/2 rounded-full blur-3xl"></div>
      </div>
      
      <main className="flex-1 relative z-10">
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Left Button - Detect and Scan */}
          <Link 
            href="/detect"
            className="flex-1 flex items-center justify-center bg-gradient-to-br from-orange/20 via-orange/10 to-white dark:from-orange/15 dark:via-orange/10 dark:to-navy/50 border-r border-orange/20 hover:from-orange/30 hover:via-orange/20 hover:to-orange/10 dark:hover:from-orange/25 dark:hover:via-orange/15 dark:hover:to-purple/30 transition-all duration-500 group relative overflow-hidden"
          >
            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange/10 to-transparent dark:from-orange/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="text-center p-8 relative z-10">
              <div className="mb-8">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange/30 to-orange/20 dark:from-orange/20 dark:to-orange/10 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <svg 
                    className="w-10 h-10 text-orange group-hover:scale-110 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2.5} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-5xl font-oswald font-bold text-gray-900 dark:text-white mb-6 group-hover:text-orange transition-colors duration-500 leading-tight">
                Detect and Scan
              </h2>
              <p className="text-xl font-inter text-gray-700 dark:text-white/90 max-w-lg mx-auto leading-relaxed group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                Use our advanced web scraping technology to scan and detect for deepfakes of people across the internet with precision and speed
              </p>
            </div>
          </Link>

          {/* Right Button - Learn and Prevent */}
          <Link 
            href="/prevent"
            className="flex-1 flex items-center justify-center bg-gradient-to-br from-orange/20 via-orange/10 to-white dark:from-orange/15 dark:via-orange/10 dark:to-navy/50 hover:from-orange/30 hover:via-orange/20 hover:to-orange/10 dark:hover:from-orange/25 dark:hover:via-orange/15 dark:hover:to-purple/30 transition-all duration-500 group relative overflow-hidden"
          >
            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange/10 to-transparent dark:from-orange/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="text-center p-8 relative z-10">
              <div className="mb-8">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange/30 to-orange/20 dark:from-orange/20 dark:to-orange/10 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <svg 
                    className="w-10 h-10 text-orange group-hover:scale-110 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2.5} 
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-5xl font-oswald font-bold text-gray-900 dark:text-white mb-6 group-hover:text-orange transition-colors duration-500 leading-tight">
                Learn and Prevent
              </h2>
              <p className="text-xl font-inter text-gray-700 dark:text-white/90 max-w-lg mx-auto leading-relaxed group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                Educate yourself with our comprehensive resources and tools to stay safe from deepfakes and phishing attacks.
              </p>
            </div>
          </Link>
        </div>

        {/* Reviews Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-oswald font-bold text-gray-900 dark:text-white mb-4">
                What Our Users Say
              </h2>
              <p className="text-xl font-inter text-gray-700 dark:text-white/80 max-w-2xl mx-auto">
                Join thousands of users who trust FakeSeek to help them navigate the new age of digital deepfakes and cyber attacks.
              </p>
            </div>
            <ReviewsSlider />
          </div>
        </section>
      </main>
    </div>
  )
}
