import { NextResponse } from 'next/server'
import { getLatestDeepfakeNews } from '@/lib/gemini'

export async function GET() {
  try {
    const articles = await getLatestDeepfakeNews()
    return NextResponse.json(articles)
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}