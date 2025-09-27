'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '@auth0/nextjs-auth0/client'

const Navbar = () => {
  const pathname = usePathname()
  const { user, isLoading } = useUser()

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Detect', href: '/detect' },
    { name: 'Prevent', href: '/prevent' },
    { name: 'About', href: '/about' },
  ]

  return (
    <nav className="bg-navy border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-white font-oswald text-xl font-bold">
              FakeSeek
            </Link>
          </div>
          
          <div className="flex items-center space-x-8">
            <div className="flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-author text-sm font-medium transition-colors duration-200 ${
                    pathname === item.href
                      ? 'text-orange border-b-2 border-orange'
                      : 'text-white hover:text-orange'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            {/* User Profile Section */}
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange"></div>
              </div>
            ) : user ? (
              <div className="flex items-center space-x-3">
                <Link href="/profile" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200">
                  <img 
                    src={user.picture || ''} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="text-right">
                    <p className="text-white font-author text-sm font-medium">
                      {user.name}
                    </p>
                    <p className="text-orange text-xs font-author">
                      View Profile
                    </p>
                  </div>
                </Link>
                <a
                  href="/api/auth/logout"
                  className="text-orange hover:text-orange/80 text-xs font-author transition-colors duration-200 ml-2"
                >
                  Sign Out
                </a>
              </div>
            ) : (
              <a
                href="/api/auth/login"
                className="bg-orange hover:bg-orange/80 text-white px-4 py-2 rounded-lg font-author text-sm font-medium transition-colors duration-200"
              >
                Sign In
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar