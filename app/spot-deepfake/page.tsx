'use client'

import { useState, useRef } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { DeepfakeAnalysis } from '@/lib/gemini'

export default function SpotDeepfake() {
  const { user, error, isLoading } = useUser()
  const [normalImage, setNormalImage] = useState<string | null>(null)
  const [deepfakeImage, setDeepfakeImage] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<DeepfakeAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalImage, setModalImage] = useState<string | null>(null)
  const normalFileInputRef = useRef<HTMLInputElement>(null)
  const deepfakeFileInputRef = useRef<HTMLInputElement>(null)

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
            Please sign in to access the deepfake detection features.
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

  const handleNormalImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setNormalImage(result)
        setAnalysis(null)
        setShowResults(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeepfakeImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setDeepfakeImage(result)
        setAnalysis(null)
        setShowResults(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImages = async () => {
    if (!normalImage || !deepfakeImage) return

    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/analyze-deepfake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalImage: normalImage,
          deepfakeImage: deepfakeImage
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || errorData.error || 'Analysis failed')
      }

      const data = await response.json()
      console.log('Analysis response:', data)

      if (data.success && data.analysis) {
        // Validate the analysis structure
        if (data.analysis.comparison && 
            typeof data.analysis.comparison.similarities === 'string' &&
            typeof data.analysis.comparison.anomalies === 'string' &&
            typeof data.analysis.comparison.confidenceScore === 'string') {
          setAnalysis(data.analysis)
          setShowResults(true)
        } else {
          throw new Error('Invalid analysis structure received')
        }
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('Error analyzing images:', error)

      // Show error to user
      alert(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`)

      // Provide fallback analysis for demo purposes
      const fallbackAnalysis = {
        original: "Error occurred during analysis",
        deepfake: "Error occurred during analysis",
        comparison: {
          similarities: "Analysis could not be completed due to an error.",
          anomalies: "Please check your internet connection and try again. If the problem persists, the service may be temporarily unavailable.",
          confidenceScore: "N/A"
        }
      }
      setAnalysis(fallbackAnalysis)
      setShowResults(true)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const openModal = (imageSrc: string) => {
    setModalImage(imageSrc)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setModalImage(null)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-navy py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-oswald font-bold text-gray-900 dark:text-white mb-4">
            Deepfake Detection Analysis
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Upload two images - one normal and one suspected deepfake - to analyze and detect AI-generated content anomalies
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-orange/10 dark:bg-white/5 rounded-xl p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-oswald font-semibold text-gray-900 dark:text-white mb-4">
              Upload Images for Analysis
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Upload two images - one normal reference image and one suspected deepfake for comparison analysis
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Normal Image Upload */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Normal Reference Image</h3>
              <input
                ref={normalFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleNormalImageUpload}
                className="hidden"
              />
              <button
                onClick={() => normalFileInputRef.current?.click()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-inter font-medium transition-colors duration-200 mb-4"
              >
                Choose Normal Image
              </button>
              {normalImage && (
                <div className="mt-4">
                  <img
                    src={normalImage}
                    alt="Normal"
                    className="w-32 h-32 object-cover rounded-lg mx-auto cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => openModal(normalImage)}
                  />
                </div>
              )}
            </div>

            {/* Deepfake Image Upload */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Suspected Deepfake Image</h3>
              <input
                ref={deepfakeFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleDeepfakeImageUpload}
                className="hidden"
              />
              <button
                onClick={() => deepfakeFileInputRef.current?.click()}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-inter font-medium transition-colors duration-200 mb-4"
              >
                Choose Deepfake Image
              </button>
              {deepfakeImage && (
                <div className="mt-4">
                  <img
                    src={deepfakeImage}
                    alt="Deepfake"
                    className="w-32 h-32 object-cover rounded-lg mx-auto cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => openModal(deepfakeImage)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Image Comparison */}
        {normalImage && deepfakeImage && (
          <div className="mb-8">
            <h2 className="text-2xl font-oswald font-semibold text-gray-900 dark:text-white mb-6 text-center">
              Compare Images
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Normal Image */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Normal Reference</h3>
                <div className="relative w-full h-80 flex items-center justify-center">
                  <img
                    src={normalImage}
                    alt="Normal"
                    className="max-w-full max-h-full object-contain rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => openModal(normalImage)}
                  />
                </div>
              </div>

              {/* Deepfake Image */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Suspected Deepfake</h3>
                <div className="relative w-full h-80 flex items-center justify-center">
                  <img
                    src={deepfakeImage}
                    alt="Deepfake"
                    className="max-w-full max-h-full object-contain rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => openModal(deepfakeImage)}
                  />
                </div>
              </div>
            </div>

            {/* Detect Anomalies Button */}
            <div className="text-center mt-8 space-y-4">
              <button
                onClick={analyzeImages}
                disabled={isAnalyzing}
                className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-8 py-3 rounded-lg font-inter font-medium transition-colors duration-200"
              >
                {isAnalyzing ? 'Analyzing...' : 'Detect Anomalies'}
              </button>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {showResults && analysis && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-oswald font-semibold text-gray-900 dark:text-white mb-6">
              Analysis Results
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Similarities */}
              <div>
                <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-3">
                  Similarities
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {analysis.comparison.similarities}
                </p>
              </div>

              {/* Anomalies */}
              <div>
                <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-3">
                  Detected Anomalies
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {analysis.comparison.anomalies}
                </p>
              </div>
            </div>

            {/* Confidence Score */}
            <div className="mt-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Deepfake Confidence Score
              </h3>
              <div className="text-3xl font-bold text-orange">
                {analysis.comparison.confidenceScore}
              </div>
            </div>

          </div>
        )}

        {/* Modal for Image Zoom */}
        {showModal && modalImage && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
            <div className="relative w-full h-full flex items-center justify-center">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl z-10 bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
              >
                ×
              </button>
              <img
                src={modalImage}
                alt="Zoomed view"
                className="max-w-full max-h-full w-auto h-auto object-contain"
                style={{ maxWidth: '100vw', maxHeight: '100vh' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}