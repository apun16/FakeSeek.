'use client'

import { useState, useRef } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { DeepfakeAnalysis } from '@/lib/gemini'

export default function SpotDeepfake() {
  const { user, error, isLoading } = useUser()
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [deepfakeImages, setDeepfakeImages] = useState<string[]>([])
  const [selectedDeepfake, setSelectedDeepfake] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<DeepfakeAnalysis | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalImage, setModalImage] = useState<string | null>(null)
  const [showAnomalies, setShowAnomalies] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setOriginalImage(result)
        setDeepfakeImages([])
        setAnalysis(null)
        setShowResults(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const generateDeepfakes = async () => {
    if (!originalImage) return

    setIsGenerating(true)
    try {
      // Create mock deepfake variations with different visual effects
      const variations = await createMockDeepfakes(originalImage)
      setDeepfakeImages(variations)
      setSelectedDeepfake(variations[0]) // Select first deepfake by default
    } catch (error) {
      console.error('Error generating deepfakes:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const createMockDeepfakes = (originalImage: string): Promise<string[]> => {
    // Create a canvas to manipulate the image
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    return new Promise((resolve) => {
      img.onload = () => {
        if (!ctx) {
          resolve([originalImage, originalImage, originalImage, originalImage])
          return
        }
        
        canvas.width = img.width
        canvas.height = img.height
        
        const variations: string[] = []
        
        // Variation 1: Original (for comparison)
        ctx.drawImage(img, 0, 0)
        variations.push(canvas.toDataURL('image/jpeg', 0.8))
        
        // Variation 2: Blurred (simulates compression artifacts)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.filter = 'blur(2px)'
        ctx.drawImage(img, 0, 0)
        variations.push(canvas.toDataURL('image/jpeg', 0.8))
        
        // Variation 3: Color shifted (simulates lighting inconsistencies)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.filter = 'hue-rotate(15deg) saturate(1.2)'
        ctx.drawImage(img, 0, 0)
        variations.push(canvas.toDataURL('image/jpeg', 0.8))
        
        // Variation 4: Brightness adjusted (simulates artificial lighting)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.filter = 'brightness(1.3) contrast(1.1)'
        ctx.drawImage(img, 0, 0)
        variations.push(canvas.toDataURL('image/jpeg', 0.8))
        
        resolve(variations)
      }
      img.src = originalImage
    })
  }

  const analyzeImages = async () => {
    if (!originalImage || !selectedDeepfake) return

    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/analyze-deepfake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          originalImage, 
          deepfakeImage: selectedDeepfake 
        }),
      })

      const data = await response.json()
      setAnalysis(data)
      setShowResults(true)
    } catch (error) {
      console.error('Error analyzing images:', error)
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
            Spot the Deepfake
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Upload an image to generate deepfake variations and learn how to detect AI-generated content
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-orange/10 dark:bg-white/5 rounded-xl p-8 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-oswald font-semibold text-gray-900 dark:text-white mb-4">
              Upload Your Image
            </h2>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-orange hover:bg-orange/80 text-white px-8 py-3 rounded-lg font-inter font-medium transition-colors duration-200 mb-4"
            >
              Choose Image
            </button>
            {originalImage && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Original Image:</p>
                <img
                  src={originalImage}
                  alt="Original"
                  className="w-32 h-32 object-cover rounded-lg mx-auto cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => openModal(originalImage)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Generate Deepfakes Button */}
        {originalImage && !deepfakeImages.length && (
          <div className="text-center mb-8">
            <button
              onClick={generateDeepfakes}
              disabled={isGenerating}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-8 py-3 rounded-lg font-inter font-medium transition-colors duration-200"
            >
              {isGenerating ? 'Generating Deepfakes...' : 'Generate Deepfake Variations'}
            </button>
          </div>
        )}

        {/* Image Comparison */}
        {originalImage && deepfakeImages.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-oswald font-semibold text-gray-900 dark:text-white mb-6 text-center">
              Compare Original vs Deepfake
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Original Image */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Original</h3>
                <div className="relative w-full h-80 flex items-center justify-center">
                  <img
                    src={originalImage}
                    alt="Original"
                    className="max-w-full max-h-full object-contain rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => openModal(originalImage)}
                  />
                </div>
              </div>

              {/* Deepfake Selection */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Generated Deepfake</h3>
                <div className="relative w-full h-80 flex items-center justify-center">
                  <img
                    src={selectedDeepfake || deepfakeImages[0]}
                    alt="Deepfake"
                    className="max-w-full max-h-full object-contain rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => openModal(selectedDeepfake || deepfakeImages[0])}
                  />
                  {/* Anomaly Overlay */}
                  {showAnomalies && analysis?.comparison.anomalyCoordinates && (
                    <div className="absolute inset-0 pointer-events-none">
                      {analysis.comparison.anomalyCoordinates.map((coord, index) => (
                        <div
                          key={index}
                          className="absolute border-2 border-red-500 rounded-full flex items-center justify-center"
                          style={{
                            left: `${(coord.x / 400) * 100}%`, // Assuming 400px base width
                            top: `${(coord.y / 400) * 100}%`, // Assuming 400px base height
                            width: `${(coord.w / 400) * 100}%`,
                            height: `${(coord.h / 400) * 100}%`,
                            minWidth: '20px',
                            minHeight: '20px'
                          }}
                        >
                          <div className="bg-red-500 text-white text-xs px-1 py-0.5 rounded absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                            {coord.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Deepfake Variations */}
                <div className="mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Choose a variation:</p>
                  <div className="flex gap-2 justify-center flex-wrap">
                    {deepfakeImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedDeepfake(img)}
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedDeepfake === img || (!selectedDeepfake && index === 0)
                            ? 'border-orange'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Deepfake ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
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
              
              {/* Toggle Anomaly Highlighting */}
              {analysis && (
                <div>
                  <button
                    onClick={() => setShowAnomalies(!showAnomalies)}
                    className={`px-6 py-2 rounded-lg font-inter font-medium transition-colors duration-200 ${
                      showAnomalies 
                        ? 'bg-green-500 hover:bg-green-600 text-white' 
                        : 'bg-gray-500 hover:bg-gray-600 text-white'
                    }`}
                  >
                    {showAnomalies ? 'Hide Anomaly Circles' : 'Show Anomaly Circles'}
                  </button>
                </div>
              )}
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

            {/* Anomaly Coordinates */}
            {analysis.comparison.anomalyCoordinates && analysis.comparison.anomalyCoordinates.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Detected Anomaly Locations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysis.comparison.anomalyCoordinates.map((coord, index) => (
                    <div key={index} className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                        <span className="font-medium text-red-800 dark:text-red-200">{coord.label}</span>
                      </div>
                      <div className="text-sm text-red-600 dark:text-red-300 mt-1">
                        Located at position ({coord.x}, {coord.y}) with size {coord.w}×{coord.h} pixels
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                  💡 Click "Show Anomaly Circles" above to see these anomalies highlighted on the deepfake image
                </div>
              </div>
            )}
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