'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function SpotDeepfake() {
  const [uploadedImage1, setUploadedImage1] = useState<string | null>(null)
  const [uploadedImage2, setUploadedImage2] = useState<string | null>(null)

  const handleImageUpload1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage1(e.target?.result as string)
        
        // Track progress in localStorage for digital passport
        const currentProgress = localStorage.getItem('digitalPassportProgress') || '0'
        const currentScore = parseInt(currentProgress)
        const newProgress = Math.min(100, currentScore + 5) // Uploading image adds 5%
        
        localStorage.setItem('digitalPassportProgress', newProgress.toString())
        localStorage.setItem('lastActivity', 'deepfake_image_upload')
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