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
      title: "Step 1 Create Your Profile",
      content: "Create your personalized profile to get started with our fake news detection system. This step involves setting up your preferences, choosing your areas of interest, and configuring your detection settings. Your profile will help us provide more accurate and relevant results tailored to your needs."
    },
    {
      id: 2,
      title: "Step 2 Start Your Scan",
      content: "Begin scanning for fake news using our advanced AI technology. Simply paste a URL, upload content, or enter text that you want to analyze. Our system will examine the content for signs of misinformation, check against our database of verified sources, and provide you with a comprehensive analysis."
    },
    {
      id: 3,
      title: "Step 3 View Your Report",
      content: "Review your detailed fake news detection report. The report includes a confidence score, identified red flags, source verification status, and recommendations. You'll also receive educational insights about the techniques used in the content and tips for identifying similar misinformation in the future."
    }
  ]

  return (
    <div className="min-h-screen bg-navy">
      <Navbar />
      <main className="flex h-[calc(100vh-4rem)]">
        {/* Left Side - Step Buttons */}
        <div className="w-1/3 p-8 border-r border-white/20">
          <h1 className="text-3xl font-oswald font-bold text-white mb-8">
            Detection Process
          </h1>
          <div className="space-y-4">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`w-full p-6 text-left rounded-lg border-2 transition-all duration-300 ${
                  activeStep === step.id
                    ? 'border-orange bg-orange/10 text-orange'
                    : 'border-white/30 bg-white/5 text-white hover:border-orange/50 hover:bg-orange/5'
                }`}
              >
                <h3 className="text-lg font-oswald font-semibold mb-2">
                  {step.title}
                </h3>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  activeStep === step.id
                    ? 'border-orange bg-orange text-navy'
                    : 'border-white/50 text-white/50'
                }`}>
                  {step.id}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side - Content Display */}
        <div className="w-2/3 p-8">
          {/* Step Content */}
          <div className="mt-8">
            <div className="bg-white/10 border border-white/20 rounded-lg p-8 h-96 overflow-y-auto">
              <h2 className="text-2xl font-oswald font-bold text-white mb-6">
                {steps[activeStep - 1].title}
              </h2>
              <p className="text-lg font-author text-white/80 leading-relaxed mb-6">
                {steps[activeStep - 1].content}
              </p>
              
              {/* Show Profile Form for Step 1 when user is signed in */}
              {activeStep === 1 && user && <ProfileForm />}
            </div>
          </div>

          {/* Authentication Section */}
          <div className="mt-8 bg-white/5 border border-white/20 rounded-lg p-6">
            <h3 className="text-xl font-oswald font-bold text-white mb-4">
              Authentication Required
            </h3>
            <p className="text-sm font-author text-white/70 mb-6">
              Please sign in to access the full detection features.
            </p>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange"></div>
              </div>
            ) : user ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img 
                    src={user.picture || ''} 
                    alt="Profile" 
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="text-white font-author font-medium">
                      Welcome, {user.name}
                    </p>
                    <p className="text-white/60 text-sm">
                      {user.email}
                    </p>
                  </div>
                </div>
                <a
                  href="/api/auth/logout"
                  className="block w-full bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-author font-medium transition-colors duration-200 text-center"
                >
                  Sign Out
                </a>
              </div>
            ) : (
              <a
                href="/api/auth/login"
                className="block w-full bg-orange hover:bg-orange/80 text-white px-6 py-3 rounded-lg font-author font-medium transition-colors duration-200 text-center"
              >
                Sign In with Google
              </a>
            )}
            
            {error && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-300 text-sm font-author">
                  Authentication error: {error.message}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
