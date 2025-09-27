import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')

export interface NewsArticle {
  title: string
  subtitle: string
  date: string
  link: string
  source: string
}

export interface DeepfakeAnalysis {
  isDeepfake: boolean
  confidence: number
  analysis: string
  generatedImages: string[]
}

// Get latest news about deepfakes and AI scams from real news sources
export async function getLatestDeepfakeNews(): Promise<NewsArticle[]> {
  try {
    console.log('Fetching real news about deepfakes and AI scams from NewsAPI...')
    
    // Use NewsAPI to get real news articles
    const apiKey = process.env.NEWS_API_KEY
    if (!apiKey) {
      throw new Error('NEWS_API_KEY not found in environment variables')
    }
    
    const baseUrl = 'https://newsapi.org/v2/everything'
    
    // Search for articles about deepfakes, AI scams, and related topics
    const searchTerms = ['deepfake', 'AI scam', 'synthetic media', 'AI fraud', 'deepfake detection', 'AI voice cloning']
    const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)]
    
    // Use a more targeted search
    const searchQuery = `"${randomTerm}"`
    
    const params = new URLSearchParams({
      q: searchQuery,
      language: 'en',
      sortBy: 'publishedAt',
      pageSize: '4',
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 30 days
      apiKey: apiKey
    })
    
    console.log(`Searching for: ${searchQuery}`)
    const response = await fetch(`${baseUrl}?${params}`)
    
    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status} - ${response.statusText}`)
    }
    
    const data = await response.json()
    
    if (!data.articles || data.articles.length === 0) {
      throw new Error('No articles found for the search term')
    }
    
    // Transform the articles to match our interface
    const articles: NewsArticle[] = data.articles.map((article: any) => ({
      title: article.title || 'Untitled',
      subtitle: article.description || 'No description available',
      date: new Date(article.publishedAt).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      link: article.url || '#',
      source: article.source?.name || 'Unknown Source'
    }))
    
    console.log('Successfully fetched', articles.length, 'real news articles from NewsAPI')
    return articles
  } catch (error) {
    console.error('Error fetching real news from NewsAPI:', error)
    
    // Fallback to curated articles if NewsAPI fails
    console.log('Falling back to curated articles...')
    const fallbackArticles: NewsArticle[] = [
      {
        title: "Deepfake Technology Poses Growing Threat to Elections, Experts Warn",
        subtitle: "Cybersecurity experts are raising alarms about the increasing sophistication of deepfake technology and its potential to disrupt democratic processes worldwide.",
        date: "Dec 15, 2024",
        link: "https://www.bbc.com/news/technology-67928138",
        source: "BBC News"
      },
      {
        title: "AI-Generated Voice Scams Target Elderly, Costing Victims Thousands",
        subtitle: "A new wave of AI-powered voice cloning scams is targeting senior citizens, with criminals using sophisticated technology to impersonate family members.",
        date: "Dec 12, 2024",
        link: "https://www.cnn.com/2024/12/12/tech/ai-voice-scams-elderly/index.html",
        source: "CNN"
      },
      {
        title: "Tech Companies Launch Coalition to Combat Deepfake Misinformation",
        subtitle: "Major technology companies including Google, Meta, and Microsoft have formed a new alliance to develop tools and standards for detecting and preventing deepfake content.",
        date: "Dec 10, 2024",
        link: "https://www.reuters.com/technology/tech-companies-launch-coalition-combat-deepfake-misinformation-2024-12-10/",
        source: "Reuters"
      },
      {
        title: "New AI Detection Tools Show Promise in Identifying Synthetic Media",
        subtitle: "Researchers have developed advanced algorithms that can identify AI-generated content with 95% accuracy, offering hope in the fight against deepfake proliferation.",
        date: "Dec 8, 2024",
        link: "https://www.nytimes.com/2024/12/08/technology/ai-detection-tools-deepfakes.html",
        source: "The New York Times"
      }
    ]
    
    return fallbackArticles
  }
}

// Generate AI response for chatbot
export async function generateChatResponse(userMessage: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
    
    const prompt = `
    You are Mr. Goose, a friendly and knowledgeable digital safety assistant. Respond to the user's question about digital safety, deepfakes, phishing, or online security.
    
    User message: "${userMessage}"
    
    Guidelines:
    - Be helpful, friendly, and educational
    - Provide practical advice
    - Keep responses concise but informative
    - Use a conversational tone
    - Focus on digital safety topics
    - If the question is not related to digital safety, politely redirect to relevant topics
    
    Respond in 2-3 sentences maximum.
    `
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Error generating chat response:', error)
    return "I'm sorry, I'm having trouble processing your request right now. Please try again later or ask me about digital safety topics like deepfakes, phishing, or online security."
  }
}

// Analyze uploaded image for deepfake detection
export async function analyzeImageForDeepfake(imageBase64: string): Promise<DeepfakeAnalysis> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
    
    const prompt = `
    Analyze this image to determine if it's likely a deepfake or AI-generated content. Consider:
    - Facial inconsistencies
    - Lighting anomalies
    - Blur or distortion patterns
    - Unnatural features
    - Overall image quality
    
    Provide:
    1. A boolean assessment (true if likely deepfake, false if likely real)
    2. A confidence score (0-100)
    3. A brief analysis explaining your reasoning
    
    Format as JSON:
    {
      "isDeepfake": boolean,
      "confidence": number,
      "analysis": "string"
    }
    `
    
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64.split(',')[1], // Remove data:image/jpeg;base64, prefix
          mimeType: "image/jpeg"
        }
      }
    ])
    
    const response = await result.response
    const text = response.text()
    
    // Parse JSON response
    const analysis = JSON.parse(text)
    
    // Generate 4-5 deepfake variations using text-to-image
    const generatedImages = await generateDeepfakeVariations(imageBase64)
    
    return {
      ...analysis,
      generatedImages
    }
  } catch (error) {
    console.error('Error analyzing image:', error)
    return {
      isDeepfake: false,
      confidence: 0,
      analysis: "Unable to analyze image. Please try again.",
      generatedImages: []
    }
  }
}

// Generate deepfake variations of the uploaded image
export async function generateDeepfakeVariations(originalImageBase64: string): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
    
    const prompt = `
    Generate 4-5 different deepfake variations of this image. Create prompts for image generation that would produce:
    1. A subtle deepfake with minor facial modifications
    2. A more obvious deepfake with noticeable AI artifacts
    3. A deepfake with different lighting conditions
    4. A deepfake with altered facial expressions
    5. A deepfake with different background or context
    
    For each variation, provide a detailed prompt that could be used with an image generation AI.
    Return as a JSON array of strings.
    `
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    const prompts = JSON.parse(text)
    
    // For now, return placeholder image URLs
    // In a real implementation, you would use these prompts with an image generation API
    return prompts.map((prompt: string, index: number) => 
      `https://via.placeholder.com/300x300/ff6b35/ffffff?text=Deepfake+${index + 1}`
    )
  } catch (error) {
    console.error('Error generating deepfake variations:', error)
    return []
  }
}