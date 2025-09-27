import { NextRequest, NextResponse } from 'next/server'
import { analyzeImageForDeepfake } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { imageBase64 } = await request.json()
    
    if (!imageBase64) {
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      )
    }
    
    const analysis = await analyzeImageForDeepfake(imageBase64)
    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('Error analyzing deepfake:', error)
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    )
  }
}
