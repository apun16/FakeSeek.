'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { DeepfakeAnalysis } from '@/lib/gemini'

export default function SpotDeepfake() {
  const [uploadedImage1, setUploadedImage1] = useState<string | null>(null)
  const [uploadedImage2, setUploadedImage2] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<DeepfakeAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const analyzeImage = async (imageBase64: string) => {
    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/analyze-deepfake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageBase64 }),
      })

      const data = await response.json()
      setAnalysis(data.analysis)
      setShowResults(true)
    } catch (error) {
      console.error('Error analyzing image:', error)
      setAnalysis({
        isDeepfake: false,
        confidence: 0,
        analysis: "Unable to analyze image. Please try again.",
        generatedImages: []
      })
      setShowResults(true)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleImageUpload1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageBase64 = e.target?.result as string
        setUploadedImage1(imageBase64)
        
        // Track progress in localStorage for digital passport
        const currentProgress = localStorage.getItem('digitalPassportProgress') || '0'
        const currentScore = parseInt(currentProgress)
        const newProgress = Math.min(100, currentScore + 5) // Uploading image adds 5%
        
        localStorage.setItem('digitalPassportProgress', newProgress.toString())
        localStorage.setItem('lastActivity', 'deepfake_image_upload')
        
        // Analyze the image
        analyzeImage(imageBase64)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUpload2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage2(e.target?.result as string)
        
        // Track progress in localStorage for digital passport
        const currentProgress = localStorage.getItem('digitalPassportProgress') || '0'
        const currentScore = parseInt(currentProgress)
        const newProgress = Math.min(100, currentScore + 5) // Uploading image adds 5%
        
        localStorage.setItem('digitalPassportProgress', newProgress.toString())
        localStorage.setItem('lastActivity', 'deepfake_comparison_upload')
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-navy">
      
     
      <main className="flex items-center justify-center h-[calc(100vh-4rem)] pt-16">
        <div className="w-full max-w-6xl px-4">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-oswald font-bold text-black dark:text-white mb-4">
              Spot the Deepfake
            </h1>
            <p className="text-black/70 dark:text-white/70 text-lg">
              Upload two images to compare and learn about deepfake detection
            </p>
          </div>

          {/* Upload Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* First Upload Area */}
            <div className="bg-orange/30 dark:bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <h2 className="text-2xl font-oswald font-semibold text-black dark:text-white text-center mb-6">
                Upload Original Image
              </h2>
              <div className="border-2 border-dashed border-black/30 dark:border-white/30 rounded-lg p-8 text-center hover:border-black/50 dark:hover:border-white/50 transition-colors">
                {uploadedImage1 ? (
                  <div className="space-y-4">
                    <img 
                      src={uploadedImage1} 
                      alt="Uploaded original" 
                      className="w-full h-48 object-cover rounded-lg mx-auto"
                    />
                    <button 
                      onClick={() => setUploadedImage1(null)}
                      className="text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors text-sm"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-black/50 dark:text-white/50 text-6xl">📷</div>
                    <p className="text-black/70 dark:text-white/70">Click to upload or drag and drop</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload1}
                      className="hidden"
                      id="upload1"
                    />
                    <label 
                      htmlFor="upload1"
                      className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer transition-colors"
                    >
                      Choose File
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Second Upload Area */}
            <div className="bg-orange/30 dark:bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <h2 className="text-2xl font-oswald font-semibold text-black dark:text-white text-center mb-6">
                Upload Suspected Deepfake
              </h2>
              <div className="border-2 border-dashed border-black/30 dark:border-white/30 rounded-lg p-8 text-center hover:border-black/50 dark:hover:border-white/50 transition-colors">
                {uploadedImage2 ? (
                  <div className="space-y-4">
                    <img 
                      src={uploadedImage2} 
                      alt="Uploaded suspected deepfake" 
                      className="w-full h-48 object-cover rounded-lg mx-auto"
                    />
                    <button 
                      onClick={() => setUploadedImage2(null)}
                      className="text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors text-sm"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-black/50 dark:text-white/50 text-6xl">🔍</div>
                    <p className="text-black/70 dark:text-white/70">Click to upload or drag and drop</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload2}
                      className="hidden"
                      id="upload2"
                    />
                    <label 
                      htmlFor="upload2"
                      className="inline-block bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg cursor-pointer transition-colors"
                    >
                      Choose File
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Analysis Results */}
          {isAnalyzing && (
            <div className="bg-orange/30 dark:bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange mx-auto mb-4"></div>
                <h3 className="text-2xl font-oswald font-semibold text-black dark:text-white mb-2">
                  Analyzing Image...
                </h3>
                <p className="text-black/70 dark:text-white/70">
                  Our AI is examining the image for deepfake characteristics
                </p>
              </div>
            </div>
          )}

          {showResults && analysis && (
            <div className="bg-orange/30 dark:bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-oswald font-semibold text-black dark:text-white text-center mb-6">
                Analysis Results
              </h3>
              
              {/* Analysis Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/20 dark:bg-black/20 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-black dark:text-white mb-2">
                    Deepfake Detection
                  </h4>
                  <div className={`text-2xl font-bold mb-2 ${
                    analysis.isDeepfake ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {analysis.isDeepfake ? 'LIKELY DEEPFAKE' : 'LIKELY REAL'}
                  </div>
                  <div className="text-sm text-black/70 dark:text-white/70">
                    Confidence: {analysis.confidence}%
                  </div>
                </div>
                
                <div className="bg-white/20 dark:bg-black/20 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-black dark:text-white mb-2">
                    AI Analysis
                  </h4>
                  <p className="text-sm text-black/70 dark:text-white/70">
                    {analysis.analysis}
                  </p>
                </div>
              </div>

              {/* Generated Deepfake Variations */}
              {analysis.generatedImages.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xl font-oswald font-semibold text-black dark:text-white text-center mb-4">
                    Generated Deepfake Variations
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {analysis.generatedImages.map((imageUrl, index) => (
                      <div key={index} className="bg-white/20 dark:bg-black/20 rounded-lg p-2">
                        <img 
                          src={imageUrl} 
                          alt={`Deepfake variation ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <p className="text-xs text-center text-black/70 dark:text-white/70 mt-2">
                          Variation {index + 1}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Educational Text */}
          <div className="bg-orange/30 dark:bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-oswald font-semibold text-black dark:text-white text-center mb-4">
              Deepfake Awareness
            </h3>
            <p className="text-black/70 dark:text-white/70 text-center text-lg leading-relaxed">
              Notice the similarities and accuracy within deepfake videos. Make sure to be mindful when using the internet.
              Deepfakes can be incredibly convincing, using advanced AI to create realistic but fake content. Always verify
              sources and be cautious of manipulated media that could spread misinformation.
            </p>
          </div>

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