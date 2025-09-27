import { NextRequest, NextResponse } from 'next/server'
import { analyzeImageForDeepfake } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { originalImage, deepfakeImage } = body

    // Validate required fields
    if (!originalImage || !deepfakeImage) {
      return NextResponse.json(
        {
          error: 'Both originalImage and deepfakeImage are required',
          details: 'Please provide base64-encoded images for both fields'
        },
        { status: 400 }
      )
    }

    // Validate base64 format
    if (typeof originalImage !== 'string' || typeof deepfakeImage !== 'string') {
      return NextResponse.json(
        {
          error: 'Invalid image format',
          details: 'Both images must be provided as base64-encoded strings'
        },
        { status: 400 }
      )
    }

    // Check for valid base64 data
    try {
      // Extract base64 data from data URLs (data:image/jpeg;base64,<data>)
      // Also remove any hash markers that might be appended for UI purposes
      const originalData = originalImage.includes(',') ? originalImage.split(',')[1] : originalImage
      const deepfakeData = deepfakeImage.includes(',') ? deepfakeImage.split(',')[1] : deepfakeImage

      // Remove hash markers and any whitespace
      const cleanOriginalData = originalData.split('#')[0].replace(/\s/g, '')
      const cleanDeepfakeData = deepfakeData.split('#')[0].replace(/\s/g, '')

      // Validate that we have non-empty base64 data
      if (!cleanOriginalData || !cleanDeepfakeData) {
        throw new Error('Empty base64 data')
      }

      // Validate base64 encoding by attempting to decode
      atob(cleanOriginalData)
      atob(cleanDeepfakeData)
    } catch (decodeError) {
      console.error('Base64 validation error:', decodeError)
      return NextResponse.json(
        {
          error: 'Invalid base64 data',
          details: 'One or both images contain invalid base64 encoding'
        },
        { status: 400 }
      )
    }

    console.log('Starting deepfake analysis...')
    console.log('Original image length:', originalImage.length)
    console.log('Deepfake image length:', deepfakeImage.length)
    console.log('Original image starts with:', originalImage.substring(0, 50))
    console.log('Deepfake image starts with:', deepfakeImage.substring(0, 50))
    
    const analysis = await analyzeImageForDeepfake(originalImage, deepfakeImage)

    return NextResponse.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error in analyze-deepfake API:', error)

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          {
            error: 'API configuration error',
            details: 'Gemini API is not properly configured'
          },
          { status: 500 }
        )
      }

      if (error.message.includes('Invalid response format')) {
        return NextResponse.json(
          {
            error: 'Analysis failed',
            details: 'Unable to process the analysis response. Please try again.'
          },
          { status: 502 }
        )
      }
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: 'An unexpected error occurred during analysis'
      },
      { status: 500 }
    )
  }
}
