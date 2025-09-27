import { NextResponse } from 'next/server'
import { getLatestDeepfakeNews } from '@/lib/gemini'

export async function GET() {
  try {
    const news = await getLatestDeepfakeNews()
    return NextResponse.json({ news })
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}
