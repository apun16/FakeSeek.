'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface ProgressContextType {
  digitalSafetyScore: number
  updateScore: (change: number) => void
  resetScore: () => void
  getScoreLevel: () => 'beginner' | 'intermediate' | 'advanced' | 'expert'
  getScoreColor: () => string
  getScoreMessage: () => string
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [digitalSafetyScore, setDigitalSafetyScore] = useState(0)

  // Load score from localStorage on mount
  useEffect(() => {
    const savedScore = localStorage.getItem('digitalSafetyScore')
    if (savedScore) {
      setDigitalSafetyScore(parseInt(savedScore, 10))
    }
  }, [])

  // Save score to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('digitalSafetyScore', digitalSafetyScore.toString())
  }, [digitalSafetyScore])

  const updateScore = (change: number) => {
    setDigitalSafetyScore(prev => {
      const newScore = Math.max(0, Math.min(100, prev + change))
      return newScore
    })
  }

  const resetScore = () => {
    setDigitalSafetyScore(0)
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
      getScoreMessage
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
