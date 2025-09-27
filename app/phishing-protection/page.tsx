'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { useProgress } from '@/lib/progress-context'

interface Email {
  id: number
  subject: string
  sender: string
  content: string
  isSafe: boolean
  reason: string
}

export default function PhishingProtection() {
  const [draggedEmail, setDraggedEmail] = useState<Email | null>(null)
  const [safeEmails, setSafeEmails] = useState<Email[]>([])
  const [suspiciousEmails, setSuspiciousEmails] = useState<Email[]>([])
  const [showResults, setShowResults] = useState(false)
  const { updateScore, hasCompletedModule, markModuleCompleted } = useProgress()

  const emails: Email[] = [
    {
      id: 1,
      subject: "Your account has been compromised - Action Required",
      sender: "security@yourbank.com",
      content: "URGENT: We detected suspicious activity on your account. Click here immediately to secure your account or it will be suspended within 24 hours.",
      isSafe: false,
      reason: "Creates urgency and pressure, asks for immediate action"
    },
    {
      id: 2,
      subject: "Monthly Newsletter - March 2024",
      sender: "newsletter@techcompany.com",
      content: "Hello! Here's our monthly update with new features and company news. No action required on your part.",
      isSafe: true,
      reason: "Informational content, no urgent action required, legitimate sender"
    },
    {
      id: 3,
      subject: "You've won $10,000! Click to claim",
      sender: "noreply@lottowinner.net",
      content: "Congratulations! You've been selected as our grand prize winner. Click the link below to claim your $10,000 prize now!",
      isSafe: false,
      reason: "Too good to be true offer, suspicious domain, asks for immediate action"
    },
    {
      id: 4,
      subject: "Invoice #12345 - Payment Confirmation",
      sender: "billing@paypal.com",
      content: "Thank you for your recent payment of $29.99. Your transaction has been processed successfully. Invoice attached.",
      isSafe: true,
      reason: "Confirmation message, legitimate service, no action required"
    },
    {
      id: 5,
      subject: "Verify your identity - Account Suspension Warning",
      sender: "noreply@amazon-security.com",
      content: "We need to verify your identity to prevent account suspension. Please enter your password and social security number immediately.",
      isSafe: false,
      reason: "Asks for sensitive information, creates false urgency, suspicious sender"
    },
    {
      id: 6,
      subject: "Your order has been shipped",
      sender: "orders@shopify.com",
      content: "Good news! Your order #ORD-789 has been shipped and is on its way. Track your package using the tracking number provided.",
      isSafe: true,
      reason: "Informational update, legitimate service, no sensitive information requested"
    }
  ]

  const handleDragStart = (e: React.DragEvent, email: Email) => {
    setDraggedEmail(email)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetBox: 'safe' | 'suspicious') => {
    e.preventDefault()
    if (!draggedEmail) return

    // Remove from other boxes
    setSafeEmails(prev => prev.filter(email => email.id !== draggedEmail.id))
    setSuspiciousEmails(prev => prev.filter(email => email.id !== draggedEmail.id))

    // Add to target box
    if (targetBox === 'safe') {
      setSafeEmails(prev => [...prev, draggedEmail])
    } else {
      setSuspiciousEmails(prev => [...prev, draggedEmail])
    }

    setDraggedEmail(null)
  }

  const resetGame = () => {
    setSafeEmails([])
    setSuspiciousEmails([])
    setShowResults(false)
  }

  const checkAnswers = () => {
    setShowResults(true)
    
    // Calculate score and update progress (always apply penalties)
    const correctAnswers = calculateScore()
    const totalAnswers = safeEmails.length + suspiciousEmails.length
    const wrongAnswers = totalAnswers - correctAnswers
    
    // Update progress: +2 points for each correct answer, -1 point for each wrong answer
    const progressChange = (correctAnswers * 2) - (wrongAnswers * 1)
    updateScore(progressChange)
    
    // Mark module as completed (only once)
    if (!hasCompletedModule('phishing_protection')) {
      markModuleCompleted('phishing_protection')
    }
    
    // Track activity
    localStorage.setItem('lastActivity', 'phishing_protection_quiz')
  }

  const calculateScore = () => {
    let correct = 0
    safeEmails.forEach(email => {
      if (email.isSafe) correct++
    })
    suspiciousEmails.forEach(email => {
      if (!email.isSafe) correct++
    })
    return correct
  }

  return (
    <div className="min-h-screen bg-white dark:bg-navy">
     
      
      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-8 pt-16">
        <div className="w-full max-w-7xl px-4">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-oswald font-bold text-black dark:text-white mb-4">
              Phishing Protection Training
            </h1>
            <p className="text-black/70 dark:text-white/70 text-lg">
              Sort the emails into Safe or Suspicious boxes. Learn to identify phishing attempts!
            </p>
          </div>

          {/* Email List */}
          <div className="mb-8">
            <h2 className="text-2xl font-oswald font-semibold text-black dark:text-white mb-4 text-center">
              Emails to Sort ({emails.filter(email => 
                !safeEmails.some(safe => safe.id === email.id) && 
                !suspiciousEmails.some(suspicious => suspicious.id === email.id)
              ).length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {emails
                .filter(email => 
                  !safeEmails.some(safe => safe.id === email.id) && 
                  !suspiciousEmails.some(suspicious => suspicious.id === email.id)
                )
                .length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-2xl font-oswald font-semibold text-black dark:text-white mb-2">
                      All Emails Sorted!
                    </h3>
                    <p className="text-black/70 dark:text-white/70 mb-6">
                      Great job! You've sorted all the emails. Click "Check Answers" to see your results.
                    </p>
                    <button
                      onClick={checkAnswers}
                      className="bg-orange hover:bg-orange/80 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Check Answers
                    </button>
                  </div>
                ) : (
                  emails
                    .filter(email => 
                      !safeEmails.some(safe => safe.id === email.id) && 
                      !suspiciousEmails.some(suspicious => suspicious.id === email.id)
                    )
                    .map(email => (
                    <div
                      key={email.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, email)}
                      className="bg-orange/30 dark:bg-white/10 backdrop-blur-sm rounded-lg p-4 cursor-move hover:bg-black/15 dark:hover:bg-white/15 transition-colors"
                    >
                      <div className="text-black dark:text-white font-semibold text-sm mb-2">
                        From: {email.sender}
                      </div>
                      <div className="text-black/90 dark:text-white/90 font-medium mb-2">
                        {email.subject}
                      </div>
                      <div className="text-black/70 dark:text-white/70 text-sm">
                        {email.content.substring(0, 100)}...
                      </div>
                    </div>
                  ))
                )}
            </div>
          </div>

          {/* Drop Zones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Safe Box */}
            <div
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'safe')}
              className="bg-green-500/20 backdrop-blur-sm rounded-xl p-6 min-h-96 border-2 border-dashed border-green-400/50"
            >
              <h3 className="text-2xl font-oswald font-semibold text-green-600 dark:text-green-400 text-center mb-6">
                ✅ Safe Emails ({safeEmails.length})
              </h3>
              <div className="space-y-4">
                {safeEmails.map(email => (
                  <div key={email.id} className="bg-black/10 dark:bg-white/10 rounded-lg p-4">
                    <div className="text-black dark:text-white font-semibold text-sm mb-2">
                      From: {email.sender}
                    </div>
                    <div className="text-black/90 dark:text-white/90 font-medium mb-2">
                      {email.subject}
                    </div>
                    {showResults && (
                      <div className={`text-sm mt-2 p-2 rounded ${
                        email.isSafe 
                          ? 'bg-green-500/20 text-green-700 dark:text-green-200' 
                          : 'bg-red-500/20 text-red-700 dark:text-red-200'
                      }`}>
                        {email.isSafe ? '✅ Correct!' : '❌ Wrong - This is suspicious'}
                        <div className="text-xs mt-1">{email.reason}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Suspicious Box */}
            <div
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'suspicious')}
              className="bg-red-500/20 backdrop-blur-sm rounded-xl p-6 min-h-96 border-2 border-dashed border-red-400/50"
            >
              <h3 className="text-2xl font-oswald font-semibold text-red-600 dark:text-red-400 text-center mb-6">
                ⚠️ Suspicious Emails ({suspiciousEmails.length})
              </h3>
              <div className="space-y-4">
                {suspiciousEmails.map(email => (
                  <div key={email.id} className="bg-black/10 dark:bg-white/10 rounded-lg p-4">
                    <div className="text-black dark:text-white font-semibold text-sm mb-2">
                      From: {email.sender}
                    </div>
                    <div className="text-black/90 dark:text-white/90 font-medium mb-2">
                      {email.subject}
                    </div>
                    {showResults && (
                      <div className={`text-sm mt-2 p-2 rounded ${
                        !email.isSafe 
                          ? 'bg-green-500/20 text-green-700 dark:text-green-200' 
                          : 'bg-red-500/20 text-red-700 dark:text-red-200'
                      }`}>
                        {!email.isSafe ? '✅ Correct!' : '❌ Wrong - This is safe'}
                        <div className="text-xs mt-1">{email.reason}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={checkAnswers}
              disabled={safeEmails.length + suspiciousEmails.length !== emails.length}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg transition-colors"
            >
              Check Answers
            </button>
            <button
              onClick={resetGame}
              className="bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-black dark:text-white px-8 py-3 rounded-lg transition-colors"
            >
              Reset Game
            </button>
          </div>

          {/* Results */}
          {showResults && (
            <div className="bg-orange/30 dark:bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 text-center">
              <h3 className="text-2xl font-oswald font-semibold text-black dark:text-white mb-4">
                Your Score: {calculateScore()} / {emails.length}
              </h3>
              <p className="text-black/70 dark:text-white/70">
                {calculateScore() === emails.length 
                  ? "Perfect! You're a phishing detection expert!" 
                  : `Good job! You correctly identified ${calculateScore()} out of ${emails.length} emails.`}
              </p>
            </div>
          )}

          {/* Back Button */}
          <div className="text-center">
            <Link 
              href="/prevent"
              className="inline-block bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-black dark:text-white px-8 py-3 rounded-lg transition-colors"
            >
              ← Back to Prevention Tools
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}