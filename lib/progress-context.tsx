'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface ProgressContextType {
  digitalSafetyScore: number
  updateScore: (change: number) => void
  resetScore: () => void
  getScoreLevel: () => 'beginner' | 'intermediate' | 'advanced' | 'expert'
  getScoreColor: () => string
  getScoreMessage: () => string
  hasCompletedModule: (moduleName: string) => boolean
  markModuleCompleted: (moduleName: string) => void
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [digitalSafetyScore, setDigitalSafetyScore] = useState(0)
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set())

  // Load score and completed modules from localStorage on mount and when window regains focus
  useEffect(() => {
    const loadData = () => {
      const savedScore = localStorage.getItem('digitalSafetyScore')
      if (savedScore) {
        const score = parseInt(savedScore, 10)
        if (!isNaN(score)) {
          setDigitalSafetyScore(score)
        }
      }
      
      const savedModules = localStorage.getItem('completedModules')
      if (savedModules) {
        try {
          const modules = JSON.parse(savedModules)
          setCompletedModules(new Set(modules))
        } catch (e) {
          console.error('Error parsing completed modules:', e)
        }
      }
    }
    
    loadData()
    
    // Reload data when window regains focus (user returns from another page)
    window.addEventListener('focus', loadData)
    
    // Listen for storage changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'digitalSafetyScore' && e.newValue) {
        const score = parseInt(e.newValue, 10)
        if (!isNaN(score)) {
          setDigitalSafetyScore(score)
        }
      } else if (e.key === 'completedModules' && e.newValue) {
        try {
          const modules = JSON.parse(e.newValue)
          setCompletedModules(new Set(modules))
        } catch (err) {
          console.error('Error parsing completed modules from storage:', err)
        }
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('focus', loadData)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // Save score to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('digitalSafetyScore', digitalSafetyScore.toString())
  }, [digitalSafetyScore])

  // Save completed modules to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('completedModules', JSON.stringify(Array.from(completedModules)))
  }, [completedModules])

  const updateScore = (change: number) => {
    setDigitalSafetyScore(prev => {
      const newScore = Math.max(0, Math.min(100, prev + change))
      return newScore
    })
  }

  const resetScore = () => {
    setDigitalSafetyScore(0)
  }

  const hasCompletedModule = (moduleName: string): boolean => {
    return completedModules.has(moduleName)
  }

  const markModuleCompleted = (moduleName: string) => {
    setCompletedModules(prev => new Set([...prev, moduleName]))
  }

  const getScoreLevel = (): 'beginner' | 'intermediate' | 'advanced' | 'expert' => {
    if (digitalSafetyScore < 25) return 'beginner'
    if (digitalSafetyScore < 50) return 'intermediate'
    if (digitalSafetyScore < 75) return 'advanced'
    return 'expert'
  }

  const getScoreColor = (): string => {
    const level = getScoreLevel()
    switch (level) {
      case 'beginner': return 'from-red-500 to-red-600'
      case 'intermediate': return 'from-yellow-500 to-orange-500'
      case 'advanced': return 'from-blue-500 to-indigo-500'
      case 'expert': return 'from-green-500 to-emerald-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getScoreMessage = (): string => {
    const level = getScoreLevel()
    switch (level) {
      case 'beginner': return 'Keep learning! Every step counts towards better digital safety.'
      case 'intermediate': return 'Great progress! You\'re building solid digital safety skills.'
      case 'advanced': return 'Excellent! You have strong digital safety knowledge.'
      case 'expert': return 'Outstanding! You\'re a digital safety expert!'
      default: return 'Start your digital safety journey today!'
    }
  }

  return (
    <ProgressContext.Provider value={{
      digitalSafetyScore,
      updateScore,
      resetScore,
      getScoreLevel,
      getScoreColor,
      getScoreMessage,
      hasCompletedModule,
      markModuleCompleted
    }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider')
  }
  return context
}
