'use client'

import Navbar from '@/components/Navbar'
import ProfileForm from '@/components/ProfileForm'
import { useState, useEffect } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'

export default function Detect() {
  const [activeStep, setActiveStep] = useState(1)
  const [scanInProgress, setScanInProgress] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)
  const [scanResults, setScanResults] = useState<any>(null)
  const [loadingResults, setLoadingResults] = useState(false)
  const { user, error, isLoading } = useUser()

  const fetchDeepfakeResults = async () => {
    try {
      setLoadingResults(true)
      console.log('Starting deepfake scan...')
      
      const response = await fetch('/api/deepfake-scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('API response status:', response.status)
      const data = await response.json()
      console.log('API response data:', data)
      
      if (response.ok && data.success) {
        console.log('Setting scan results:', data.result)
        setScanResults(data.result)
      } else {
        console.error('Error fetching deepfake results:', data.error)
        // Set default result if API fails
        setScanResults({
          status: 'error',
          message: 'Unable to complete deepfake scan',
          full_name: 'Unknown',
          total_results: 0,
          deepfake_related_count: 0,
          results: []
        })
      }
    } catch (error) {
      console.error('Error fetching deepfake results:', error)
      setScanResults({
        status: 'error',
        message: 'Unable to complete deepfake scan',
        full_name: 'Unknown',
        total_results: 0,
        deepfake_related_count: 0,
        results: []
      })
    } finally {
      setLoadingResults(false)
    }
  }

  const handleBeginScan = () => {
    setScanInProgress(true)
    setScanComplete(false)
    setScanResults(null)
    
    // Start fetching deepfake results immediately
    fetchDeepfakeResults()
    
    // After 5 seconds, show scan complete
    setTimeout(() => {
      setScanInProgress(false)
      setScanComplete(true)
      
      // After 1 more second, move to step 3
      setTimeout(() => {
        setActiveStep(3)
        setScanComplete(false)
      }, 1000)
    }, 5000)
  }

  const handleNewProfile = () => {
    setActiveStep(1)
    setScanInProgress(false)
    setScanComplete(false)
    setScanResults(null)
  }

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
        <div className="w-2/3 p-8 overflow-y-auto">
          {/* Step Content */}
          <div className="flex items-start justify-center min-h-full">
            <div className="bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-lg p-8 w-full max-w-4xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-oswald font-bold text-gray-900 dark:text-white mb-6">
                  {steps[activeStep - 1].title}
                </h2>
                <p className="text-lg font-inter text-gray-900 dark:text-white/80 leading-relaxed max-w-3xl mx-auto">
                  {steps[activeStep - 1].content}
                </p>
              </div>
              
              {/* Show Profile Form for Step 1 when user is signed in */}
              {activeStep === 1 && user && (
                <div className="flex justify-center">
                  <ProfileForm onSuccess={() => setActiveStep(2)} onNewProfile={handleNewProfile} />
                </div>
              )}

              {/* Show Begin Scan Button for Step 2 */}
              {activeStep === 2 && user && (
                <div className="flex flex-col items-center justify-center space-y-6">
                  {!scanInProgress && !scanComplete ? (
                    <button
                      onClick={handleBeginScan}
                      className="bg-orange hover:bg-orange/80 text-white px-8 py-4 rounded-lg font-author font-medium text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                    >
                      Begin Scan
                    </button>
                  ) : scanInProgress ? (
                    <div className="flex flex-col items-center space-y-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange"></div>
                      <p className="text-lg font-author text-gray-900 dark:text-white/80">
                        Scan in Progress...
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-4">
                      <div className="flex items-center justify-center w-16 h-16 bg-green-500 rounded-full">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <p className="text-lg font-author text-gray-900 dark:text-white/80">
                        Scan Complete
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Show Deepfake Scan Results for Step 3 */}
              {activeStep === 3 && user && (
                <div className="flex flex-col items-center space-y-6">
                  {loadingResults ? (
                    <div className="flex flex-col items-center space-y-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange"></div>
                      <p className="text-lg font-author text-gray-900 dark:text-white/80">
                        Analyzing scan results...
                      </p>
                    </div>
                  ) : scanResults ? (
                    <div className="w-full max-w-2xl max-h-[70vh] overflow-y-auto">
                      <div className={`p-6 rounded-lg border-2 ${
                        scanResults.status === 'clean' 
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                          : scanResults.status === 'found'
                          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                          : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                      }`}>
                        <div className="flex items-center justify-center mb-4">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                            scanResults.status === 'clean' 
                              ? 'bg-green-500' 
                              : scanResults.status === 'found'
                              ? 'bg-red-500'
                              : 'bg-yellow-500'
                          }`}>
                            {scanResults.status === 'clean' ? (
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            ) : scanResults.status === 'found' ? (
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                              </svg>
                            ) : (
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </div>
                        </div>
                        
                        <h3 className={`text-2xl font-oswald font-bold text-center mb-4 ${
                          scanResults.status === 'clean' 
                            ? 'text-green-800 dark:text-green-200' 
                            : scanResults.status === 'found'
                            ? 'text-red-800 dark:text-red-200'
                            : 'text-yellow-800 dark:text-yellow-200'
                        }`}>
                          {scanResults.status === 'clean' ? '✅ All Clear!' : 
                           scanResults.status === 'found' ? '⚠️ Deepfakes Detected' : 
                           '❓ Scan Incomplete'}
                        </h3>
                        
                        <p className={`text-lg font-author text-center mb-4 ${
                          scanResults.status === 'clean' 
                            ? 'text-green-700 dark:text-green-300' 
                            : scanResults.status === 'found'
                            ? 'text-red-700 dark:text-red-300'
                            : 'text-yellow-700 dark:text-yellow-300'
                        }`}>
                          {scanResults.message}
                        </p>
                        
                        <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4 mt-4">
                          <h4 className="font-oswald font-bold text-gray-900 dark:text-white mb-2">
                            Scan Details for {scanResults.full_name}:
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-sm font-author">
                            <div>
                              <span className="text-gray-900 dark:text-gray-300">Total Results:</span>
                              <span className="ml-2 font-bold text-gray-900 dark:text-white">{scanResults.total_results}</span>
                            </div>
                            <div>
                              <span className="text-gray-900 dark:text-gray-300">Deepfake Related:</span>
                              <span className="ml-2 font-bold text-gray-900 dark:text-white">{scanResults.deepfake_related_count}</span>
                            </div>
                          </div>
                        </div>
                        
                        {scanResults.status === 'found' && (
                          <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 rounded-lg">
                            <h5 className="font-oswald font-bold text-red-800 dark:text-red-200 mb-2">
                              Recommended Actions:
                            </h5>
                            <ul className="text-sm font-author text-red-700 dark:text-red-300 space-y-1">
                              <li>• Report fake content to the platform where it was found</li>
                              <li>• Consider contacting law enforcement if the content is harmful</li>
                              <li>• Monitor your online presence regularly</li>
                              <li>• Use reverse image search tools to find other instances</li>
                            </ul>
                          </div>
                        )}
                        
                        {scanResults.status === 'clean' && (
                          <div className="mt-4 p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <h5 className="font-oswald font-bold text-green-800 dark:text-green-200 mb-2">
                              Keep Your Digital Identity Safe:
                            </h5>
                            <ul className="text-sm font-author text-green-700 dark:text-green-300 space-y-1">
                              <li>• Continue monitoring your online presence</li>
                              <li>• Be cautious about sharing personal photos online</li>
                              <li>• Use privacy settings on social media platforms</li>
                              <li>• Run regular scans to stay protected</li>
                            </ul>
                          </div>
                        )}
                        
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange"></div>
                      <p className="text-lg font-author text-gray-900 dark:text-white/80">
                        Loading scan results...
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}