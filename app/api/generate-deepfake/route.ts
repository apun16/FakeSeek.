import { NextRequest, NextResponse } from 'next/server'
import { generateDeepfakeVariations } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    console.log('API: Starting deepfake generation request')
    const { originalImage } = await request.json()
    console.log('API: Received originalImage, length:', originalImage?.length)

    if (!originalImage) {
      console.error('API: No originalImage provided')
      return NextResponse.json(
        { error: 'Original image is required' },
        { status: 400 }
      )
    }

    // Generate deepfake variations using Gemini
    console.log('API: Calling generateDeepfakeVariations')
    const variations = await generateDeepfakeVariations(originalImage)
    console.log('API: Generated variations count:', variations?.length)

    return NextResponse.json({ variations })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    console.error('API: Error generating deepfakes:', errorMessage, errorStack)
    return NextResponse.json(
      { error: 'Failed to generate deepfake variations' },
      { status: 500 }
    )
  }
}