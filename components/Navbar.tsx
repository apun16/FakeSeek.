'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '@auth0/nextjs-auth0/client'
import ThemeToggle from './ThemeToggle'

const Navbar = () => {
  const pathname = usePathname()
  const { user, isLoading } = useUser()

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Detect', href: '/detect' },
    { name: 'Prevent', href: '/prevent' },
  ]

  return (
    <nav className="bg-white dark:bg-navy border-b border-gray-200 dark:border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-gray-900 dark:text-white font-oswald text-3xl font-bold">
              FakeSeek
            </Link>
          </div>
          
          <div className="flex items-center space-x-8">
            <div className="flex space-x-12">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-inter text-lg font-medium transition-colors duration-200 ${
                    pathname === item.href
                      ? 'text-orange border-b-2 border-orange'
                      : 'text-gray-700 dark:text-white hover:text-orange'
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
                </Link>
                <a
                  href="/api/auth/logout"
                  className="text-orange hover:text-orange/80 text-xs font-inter transition-colors duration-200 ml-2"
                >
                  Sign Out
                </a>
              </div>
            ) : (
              <a
                href="/api/auth/login"
                className="bg-orange hover:bg-orange/80 text-white px-4 py-2 rounded-lg font-inter text-sm font-medium transition-colors duration-200"
              >
                Sign In
              </a>
            )}
            
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
