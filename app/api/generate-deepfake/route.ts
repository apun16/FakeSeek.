import { NextRequest, NextResponse } from 'next/server'
import { generateDeepfakeVariations } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { originalImage } = await request.json()
    
    if (!originalImage) {
      return NextResponse.json(
        { error: 'Original image is required' },
        { status: 400 }
      )
    }
    
    const deepfakeVariations = await generateDeepfakeVariations(originalImage)
    return NextResponse.json({ variations: deepfakeVariations })
  } catch (error) {
    console.error('Error generating deepfake variations:', error)
    return NextResponse.json(
      { error: 'Failed to generate deepfake variations' },
      { status: 500 }
    )
  }
}
