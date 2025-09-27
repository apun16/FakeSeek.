'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'

const Navbar = () => {
  const pathname = usePathname()
  const { user, isLoading } = useUser()
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)

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
              <div 
                className="relative"
                onMouseEnter={() => setIsProfileDropdownOpen(true)}
                onMouseLeave={() => setIsProfileDropdownOpen(false)}
              >
                <div className="flex items-center space-x-3 cursor-pointer">
                  <img 
                    src={user.picture || ''} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full hover:opacity-80 transition-opacity duration-200"
                  />
                </div>
                
                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-1 w-48 bg-white dark:bg-navy rounded-lg shadow-lg border border-gray-200 dark:border-white/20 py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-white/20">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                    
                    
                    
                    <a
                      href="/api/auth/logout"
                      className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                    >
                      Sign Out
                    </a>
                  </div>
                )}
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