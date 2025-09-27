'use client'

import Navbar from '@/components/Navbar'
import ProfileForm from '@/components/ProfileForm'
import { useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'

export default function Detect() {
  const [activeStep, setActiveStep] = useState(1)
  const { user, error, isLoading } = useUser()

  const steps = [
    {
      id: 1,
      title: "Create Your Profile",
      content: "Create your personalized profile to get started with our fake news detection system. This step involves setting up your preferences, choosing your areas of interest, and configuring your detection settings. Your profile will help us provide more accurate and relevant results tailored to your needs."
    },
    {
      id: 2,
      title: "Start Your Scan",
      content: "Begin scanning for fake news using our advanced AI technology. Simply paste a URL, upload content, or enter text that you want to analyze. Our system will examine the content for signs of misinformation, check against our database of verified sources, and provide you with a comprehensive analysis."
    },
    {
      id: 3,
      title: "View Your Report",
      content: "Review your detailed fake news detection report. The report includes a confidence score, identified red flags, source verification status, and recommendations. You'll also receive educational insights about the techniques used in the content and tips for identifying similar misinformation in the future."
    }
  ]

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
            Please sign in to access the detection features.
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
      <main className="flex h-[calc(100vh-4rem)]">
        {/* Left Side - Step Buttons */}
        <div className="w-1/3 p-8 border-r border-gray-200 dark:border-white/20">
          <h1 className="text-3xl font-oswald font-bold text-gray-900 dark:text-white mb-8">
            Detection Process
          </h1>
          <div className="space-y-4">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`w-full p-6 text-center rounded-lg border-2 transition-all duration-300 ${
                  activeStep === step.id
                    ? 'border-orange bg-orange/10 text-orange'
                    : 'border-gray-300 dark:border-white/30 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white hover:border-orange/50 hover:bg-orange/5'
                }`}
              >
                {/* Number above text */}
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mx-auto mb-4 ${
                  activeStep === step.id
                    ? 'border-orange bg-orange text-white'
                    : 'border-gray-400 dark:border-white/50 text-gray-600 dark:text-white/50'
                }`}>
                  <span className="text-lg font-bold">{step.id}</span>
                </div>
                <h3 className="text-lg font-oswald font-semibold">
                  {step.title}
                </h3>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side - Content Display */}
        <div className="w-2/3 p-8">
          {/* Step Content */}
          <div className="flex items-center justify-center h-full">
            <div className="bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-lg p-8 w-full max-w-4xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-oswald font-bold text-gray-900 dark:text-white mb-6">
                  {steps[activeStep - 1].title}
                </h2>
                <p className="text-lg font-inter text-gray-700 dark:text-white/80 leading-relaxed max-w-3xl mx-auto">
                  {steps[activeStep - 1].content}
                </p>
              </div>
              
              {/* Show Profile Form for Step 1 when user is signed in */}
              {activeStep === 1 && user && (
                <div className="flex justify-center">
                  <ProfileForm />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}