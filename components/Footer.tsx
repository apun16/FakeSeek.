import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-navy border-t border-gray-200 dark:border-white/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-gray-900 dark:text-white font-oswald text-3xl font-bold mb-4 block">
              FakeSeek
            </Link>
            <p className="text-gray-600 dark:text-white/80 font-inter text-sm leading-relaxed max-w-md mb-6">
              Empowering users with AI-powered tools to detect and prevent fake news, 
              ensuring a more informed and trustworthy digital world.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-orange/20 hover:bg-orange/30 rounded-full flex items-center justify-center text-orange transition-all duration-300 hover:scale-110"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
            
              <a 
                href="#" 
                className="w-10 h-10 bg-orange/20 hover:bg-orange/30 rounded-full flex items-center justify-center text-orange transition-all duration-300 hover:scale-110"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-oswald text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-600 dark:text-white/80 hover:text-orange font-inter text-sm transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/detect" className="text-gray-600 dark:text-white/80 hover:text-orange font-inter text-sm transition-colors duration-200">
                  Detect
                </Link>
              </li>
              <li>
                <Link href="/prevent" className="text-gray-600 dark:text-white/80 hover:text-orange font-inter text-sm transition-colors duration-200">
                  Prevent
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-oswald text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 dark:text-white/80 hover:text-orange font-inter text-sm transition-colors duration-200">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-white/80 hover:text-orange font-inter text-sm transition-colors duration-200">
                  API Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-white/80 hover:text-orange font-inter text-sm transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-white/80 hover:text-orange font-inter text-sm transition-colors duration-200">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-white/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 dark:text-white/60 font-inter text-sm">
              © 2024 FakeSeek. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 dark:text-white/60 hover:text-orange font-inter text-sm transition-colors duration-200">
                Privacy
              </a>
              <a href="#" className="text-gray-500 dark:text-white/60 hover:text-orange font-inter text-sm transition-colors duration-200">
                Terms
              </a>
              <a href="#" className="text-gray-500 dark:text-white/60 hover:text-orange font-inter text-sm transition-colors duration-200">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
