import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')

// NewsAPI interface
export interface NewsArticle {
  title: string
  description: string
  url: string
  publishedAt: string
  source: {
    name: string
  }
}

// Fetch latest news about deepfakes, phishing, and AI scams
export async function getLatestDeepfakeNews(): Promise<NewsArticle[]> {
  try {
    const apiKey = process.env.NEWS_API_KEY
    if (!apiKey) {
      throw new Error('NewsAPI key not found')
    }

    // Search terms for age-appropriate content about digital safety
    const searchTerms = [
      'deepfake',
      'AI scam',
      'phishing'
    ]

    // Pick a random search term for variety
    const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)]
    
    const url = `https://newsapi.org/v2/everything?q="${randomTerm}"&language=en&sortBy=publishedAt&pageSize=6&apiKey=${apiKey}`
    
    const response = await fetch(url)
    const data = await response.json()

    if (data.status === 'ok' && data.articles) {
      // Filter for age-appropriate content and relevant topics
      const filteredArticles = data.articles
        .filter((article: any) => {
          const title = article.title?.toLowerCase() || ''
          const description = article.description?.toLowerCase() || ''
          const content = `${title} ${description}`
          
          // Check for relevant topics
          const isRelevant = content.includes('deepfake') || 
                           content.includes('phishing') || 
                           content.includes('ai scam') ||
                           content.includes('artificial intelligence scam') ||
                           content.includes('ai fraud')
          
          // Filter out inappropriate content
          const isAppropriate = !content.includes('explicit') && 
                              !content.includes('adult') &&
                              !content.includes('violent') &&
                              !content.includes('graphic')
          
          return isRelevant && isAppropriate && article.title && article.description
        })
        .slice(0, 4) // Limit to 4 articles
        .map((article: any) => ({
          title: article.title,
          description: article.description,
          url: article.url,
          publishedAt: article.publishedAt,
          source: {
            name: article.source.name
          }
        }))

      return filteredArticles
    }

    // Fallback to curated articles if NewsAPI fails
    return getFallbackArticles()
  } catch (error) {
    console.error('Error fetching news:', error)
    return getFallbackArticles()
  }
}

// Fallback articles for when NewsAPI is unavailable
function getFallbackArticles(): NewsArticle[] {
  return [
    {
      title: "Deepfake Technology: How to Identify AI-Generated Content",
      description: "Experts warn about the growing sophistication of deepfake technology and share tips for detection.",
      url: "https://example.com/deepfake-detection-guide",
      publishedAt: new Date().toISOString(),
      source: { name: "Tech Security News" }
    },
    {
      title: "Phishing Attacks Surge: New Tactics Target Social Media Users",
      description: "Cybersecurity researchers report a 60% increase in phishing attempts using social engineering tactics.",
      url: "https://example.com/phishing-protection-tips",
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      source: { name: "Cyber Defense Weekly" }
    },
    {
      title: "AI Scams Exploit Voice Cloning Technology",
      description: "Criminals are using AI voice cloning to impersonate family members in sophisticated phone scams.",
      url: "https://example.com/ai-scam-prevention",
      publishedAt: new Date(Date.now() - 172800000).toISOString(),
      source: { name: "AI Safety Report" }
    },
    {
      title: "Deepfake Detection Tools: What Works and What Doesn't",
      description: "A comprehensive review of current deepfake detection methods and their effectiveness against new AI models.",
      url: "https://example.com/deepfake-tools-review",
      publishedAt: new Date(Date.now() - 259200000).toISOString(),
      source: { name: "Digital Forensics Today" }
    }
  ]
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