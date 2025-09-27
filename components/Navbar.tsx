'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Navbar = () => {
  const pathname = usePathname()

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
        </div>
      </div>
    </nav>
  )
}

export default Navbar
