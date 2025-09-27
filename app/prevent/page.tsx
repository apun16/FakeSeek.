'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import ChatWidget from '@/components/ChatWidget'
import Link from 'next/link'
import { useUser } from '@auth0/nextjs-auth0/client'

export default function Prevent() {
  const [progress, setProgress] = useState(45) // Default progress
  const { user, error, isLoading } = useUser()

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem('digitalPassportProgress')
    if (savedProgress) {
      setProgress(parseInt(savedProgress))
    }
  }, [])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-navy flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange"></div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-navy flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <h1 className="text-3xl font-oswald font-bold text-gray-900 dark:text-white mb-6">
            Authentication Required
          </h1>
          <p className="text-lg font-inter text-gray-700 dark:text-white/80 mb-8">
            Please sign in to access the prevention features.
          </p>
          <a
            href="/api/auth/login"
            className="block w-full bg-orange hover:bg-orange/80 text-white px-6 py-3 rounded-lg font-inter font-medium transition-colors duration-200 text-center"
          >
            Sign In with Google
          </a>
          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-300 text-sm font-inter">
                Authentication error: {error.message}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-white dark:bg-navy"> 
      <main className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="w-full max-w-6xl">
          
          {/* Digital Passport Progress Bar */}
          <div className="w-full mb-16">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-oswald font-semibold text-black dark:text-white">
                Digital Passport Progress
              </h3>
              <span className="text-black/70 dark:text-white/70">{progress}% Complete</span>
            </div>
            
            {/* Progress Bar with Benchmarks */}
            <div className="relative mb-8">
              <div className="bg-gray-200 dark:bg-white/20 rounded-full h-4 overflow-hidden">
                <div className="bg-gradient-to-r from-orange to-orange/80 dark:from-orange dark:to-orange/70 h-full rounded-full transition-all duration-500" style={{width: `${progress}%`}}></div>
              </div>
              
              {/* Benchmarks */}
              <div className="absolute top-0 w-full h-4 flex justify-between">
                <div className="flex flex-col items-center">
                  <div className="w-1 h-4 bg-gray-400 dark:bg-white/40 rounded-full"></div>
                  <div className="text-xs text-gray-600 dark:text-white/70 mt-6">Novice<br/>0%</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-1 h-4 bg-gray-400 dark:bg-white/40 rounded-full"></div>
                  <div className="text-xs text-gray-600 dark:text-white/70 mt-6">Privacy Protector<br/>25%</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-1 h-4 bg-gray-400 dark:bg-white/40 rounded-full"></div>
                  <div className="text-xs text-gray-600 dark:text-white/70 mt-6">Phishing Fighter<br/>50%</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-1 h-4 bg-gray-400 dark:bg-white/40 rounded-full"></div>
                  <div className="text-xs text-gray-600 dark:text-white/70 mt-6">Deepfake Detective<br/>75%</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-1 h-4 bg-gray-400 dark:bg-white/40 rounded-full"></div>
                  <div className="text-xs text-gray-600 dark:text-white/70 mt-6">Expert Privacy Passport<br/>100%</div>
                </div>
              </div>
            </div>
            
            {/* Progress Details */}
            <div className="text-center mt-20">
              <p className="text-black/70 dark:text-white/70 text-sm">
                Complete modules and quizzes to advance your digital literacy level
              </p>
            </div>
          </div>
             
          {/* Learn and News boxes */}
          <div className="flex gap-8 justify-center w-full mt-8">
            <div className="bg-orange/30 dark:bg-white/10 backdrop-blur-sm rounded-xl p-8 h-[28rem] flex-1 hover:bg-orange/35 dark:hover:bg-white/15 transition-colors cursor-pointer flex flex-col">
              <h2 className="text-3xl font-oswald font-bold text-black dark:text-white text-center mb-6">
                Learn
              </h2>
              <div className="flex-1 flex flex-col justify-center gap-6">
                <Link href="/spot-deepfake" className="block">
                  <div className="bg-orange/20 dark:bg-white/10 rounded-lg p-6 hover:bg-orange/30 dark:hover:bg-white/20 transition-colors cursor-pointer">
                    <h3 className="text-xl font-oswald font-semibold text-black dark:text-white text-center">
                      Spot the Deepfake
                    </h3>
                    <p className="text-black/70 dark:text-white/70 text-center mt-2 text-sm">
                      View the how realistic a deepfake is from the real photo
                    </p>
                  </div>
                </Link>
                <Link href="/phishing-protection" className="block">
                  <div className="bg-orange/20 dark:bg-white/10 rounded-lg p-6 hover:bg-orange/30 dark:hover:bg-white/20 transition-colors cursor-pointer">
                    <h3 className="text-xl font-oswald font-semibold text-black dark:text-white text-center">
                      Phishing Protection
                    </h3>
                    <p className="text-black/70 dark:text-white/70 text-center mt-2 text-sm">
                      Protect yourself from phishing attacks
                    </p>
                  </div>
                </Link>
              </div>
            </div>
            
            <div className="bg-orange/30 dark:bg-white/10 backdrop-blur-sm rounded-xl p-8 h-[28rem] flex-1 hover:bg-orange/35 dark:hover:bg-white/15 transition-colors cursor-pointer overflow-y-auto">
              <h2 className="text-3xl font-oswald font-bold text-black dark:text-white text-center mb-6">
                Latest News
              </h2>
              
              {/* News Articles */}
              <div className="space-y-4">
                <a href="https://www.bbc.com/news/technology-67928138" target="_blank" rel="noopener noreferrer" className="block">
                  <div className="bg-orange/20 dark:bg-white/5 rounded-lg p-4 hover:bg-orange/30 dark:hover:bg-white/10 transition-colors">
                    <h3 className="text-black dark:text-white font-semibold text-sm mb-2">
                      AI-Generated Deepfakes Surge 900% in 2024
                    </h3>
                    <p className="text-black/70 dark:text-white/70 text-xs">
                      Cybersecurity experts report unprecedented rise in deepfake attacks targeting businesses and individuals...
                    </p>
                    <div className="text-black/50 dark:text-white/50 text-xs mt-2">Dec 15, 2024</div>
                  </div>
                </a>
                
                <a href="https://www.bbc.com/news/technology-67928138" target="_blank" rel="noopener noreferrer" className="block">
                  <div className="bg-orange/20 dark:bg-white/5 rounded-lg p-4 hover:bg-orange/30 dark:hover:bg-white/10 transition-colors">
                    <h3 className="text-black dark:text-white font-semibold text-sm mb-2">
                      New Deepfake Detection Tools Launched
                    </h3>
                    <p className="text-black/70 dark:text-white/70 text-xs">
                      Tech companies introduce advanced AI systems to identify and flag synthetic media content...
                    </p>
                    <div className="text-black/50 dark:text-white/50 text-xs mt-2">Dec 12, 2024</div>
                  </div>
                </a>
                
                <a href="https://www.bbc.com/news/technology-67928138" target="_blank" rel="noopener noreferrer" className="block">
                  <div className="bg-orange/20 dark:bg-white/5 rounded-lg p-4 hover:bg-orange/30 dark:hover:bg-white/10 transition-colors">
                    <h3 className="text-black dark:text-white font-semibold text-sm mb-2">
                      Political Deepfakes Threaten Elections
                    </h3>
                    <p className="text-black/70 dark:text-white/70 text-xs">
                      Governments worldwide scramble to implement regulations as deepfake technology advances rapidly...
                    </p>
                    <div className="text-black/50 dark:text-white/50 text-xs mt-2">Dec 10, 2024</div>
                  </div>
                </a>
                
                <a href="https://www.bbc.com/news/technology-67928138" target="_blank" rel="noopener noreferrer" className="block">
                  <div className="bg-orange/20 dark:bg-white/5 rounded-lg p-4 hover:bg-orange/30 dark:hover:bg-white/10 transition-colors">
                    <h3 className="text-black dark:text-white font-semibold text-sm mb-2">
                      Celebrities Fight Back Against Deepfakes
                    </h3>
                    <p className="text-black/70 dark:text-white/70 text-xs">
                      Hollywood stars and influencers take legal action against unauthorized AI-generated content...
                    </p>
                    <div className="text-black/50 dark:text-white/50 text-xs mt-2">Dec 8, 2024</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Chat Widget */}
      <ChatWidget />
    </div>
  )
}
