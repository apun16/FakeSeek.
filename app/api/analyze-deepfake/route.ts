import { NextRequest, NextResponse } from 'next/server'
import { analyzeImageForDeepfake } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { originalImage, deepfakeImage } = await request.json()
    
    if (!originalImage || !deepfakeImage) {
      return NextResponse.json(
        { error: 'Both original and deepfake images are required' },
        { status: 400 }
      )
    }
    
    const analysis = await analyzeImageForDeepfake(originalImage, deepfakeImage)
    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error analyzing deepfake:', error)
    return NextResponse.json(
      { error: 'Failed to analyze images' },
      { status: 500 }
    )
  }
}
