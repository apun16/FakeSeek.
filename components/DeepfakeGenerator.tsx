'use client'

import { useState, useEffect, useRef } from 'react'
import { createCanvasDeepfakeVariations, generateDeepfakeVariationsWithMetadata } from '@/lib/client-deepfake'

interface DeepfakeGeneratorProps {
  onVariationsGenerated?: (variations: string[]) => void
}

export default function DeepfakeGenerator({ onVariationsGenerated }: DeepfakeGeneratorProps) {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [variations, setVariations] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setOriginalImage(result)
        setVariations([])
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const generateVariations = async () => {
    if (!originalImage) return

    setIsGenerating(true)
    setError(null)

    try {
      // Method 1: Simple array of base64 strings
      const simpleVariations = await createCanvasDeepfakeVariations(originalImage)
      setVariations(simpleVariations)
      onVariationsGenerated?.(simpleVariations)

      // Method 2: With metadata (uncomment to use)
      // const variationsWithMetadata = await generateDeepfakeVariationsWithMetadata(originalImage)
      // console.log('Variations with metadata:', variationsWithMetadata)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate variations')
    } finally {
      setIsGenerating(false)
    }
  }

  // Auto-generate when image is uploaded
  useEffect(() => {
    if (originalImage && variations.length === 0) {
      generateVariations()
    }
  }, [originalImage])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Deepfake Generator Example</h2>
      
      {/* Upload Section */}
      <div className="mb-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Upload Image
        </button>
      </div>

      {/* Original Image */}
      {originalImage && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Original Image</h3>
          <img
            src={originalImage}
            alt="Original"
            className="max-w-full h-64 object-contain border rounded-lg"
          />
        </div>
      )}

      {/* Generation Status */}
      {isGenerating && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            <span className="text-blue-700">Generating deepfake variations...</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">Error: {error}</p>
        </div>
      )}

      {/* Variations Display */}
      {variations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Generated Variations</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {variations.map((variation, index) => {
              const labels = ['Color Tint (40%)', 'Mild Blurring (60%)', 'Extreme Color Tinting (80%)', 'Obvious Deepfake (100%)']
              return (
                <div key={index} className="text-center">
                  <img
                    src={variation}
                    alt={`Variation ${index + 1}`}
                    className="w-full h-32 object-cover border rounded-lg mb-2"
                  />
                  <p className="text-sm text-gray-600">{labels[index]}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Manual Generate Button */}
      {originalImage && variations.length === 0 && !isGenerating && (
        <button
          onClick={generateVariations}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Generate Variations
        </button>
      )}
    </div>
  )
}
