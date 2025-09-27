import { NextRequest, NextResponse } from 'next/server'
import { generateChatResponse } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }
    
    const response = await generateChatResponse(message)
    return NextResponse.json({ response })
  } catch (error) {
    console.error('Error generating chat response:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}
