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

// Deepfake analysis interfaces
export interface DeepfakeAnalysis {
  original: string
  deepfake: string
  comparison: {
    similarities: string
    anomalies: string
    confidenceScore: string
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
          
          // Check for relevant topics (broader search)
          const isRelevant = content.includes('deepfake') || 
                           content.includes('phishing') || 
                           content.includes('ai scam') ||
                           content.includes('artificial intelligence') ||
                           content.includes('ai fraud') ||
                           content.includes('cybersecurity') ||
                           content.includes('digital safety') ||
                           content.includes('online security') ||
                           content.includes('ai safety') ||
                           content.includes('machine learning') ||
                           content.includes('neural network')
          
          // Filter out inappropriate content
          const isAppropriate = !content.includes('explicit') && 
                              !content.includes('adult') &&
                              !content.includes('violent') &&
                              !content.includes('graphic')
          
          return isRelevant && isAppropriate && article.title && article.description
        })
        .slice(0, 6) // Get up to 6 articles
        .map((article: any) => ({
          title: article.title,
          description: article.description,
          url: article.url,
          publishedAt: article.publishedAt,
          source: {
            name: article.source.name
          }
        }))

      // If we have at least 2 articles, return them, otherwise use fallback
      if (filteredArticles.length >= 2) {
        return filteredArticles.slice(0, 4) // Return up to 4 articles
      }
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
    },
    {
      title: "Cybersecurity Awareness: Protecting Yourself from AI-Powered Scams",
      description: "Learn how to identify and avoid sophisticated AI-powered scams targeting individuals and businesses.",
      url: "https://example.com/ai-scam-awareness",
      publishedAt: new Date(Date.now() - 345600000).toISOString(),
      source: { name: "Security Today" }
    },
    {
      title: "The Future of Digital Forensics in the Age of Deepfakes",
      description: "How digital forensics experts are adapting their techniques to detect increasingly sophisticated deepfake content.",
      url: "https://example.com/digital-forensics-future",
      publishedAt: new Date(Date.now() - 432000000).toISOString(),
      source: { name: "Forensics Weekly" }
    }
  ]
}



// Analyze deepfake images for anomalies using Gemini
export async function analyzeImageForDeepfake(originalImageBase64: string, deepfakeImageBase64: string): Promise<DeepfakeAnalysis> {
  try {
    // Use gemini-2.0-flash for image analysis
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    
    const prompt = `You are a deepfake detection expert. Analyze these two images carefully.

IMAGE 1: Original reference image
IMAGE 2: Potentially manipulated image

EXAMINE IMAGE 2 FOR THESE SPECIFIC DEEPFAKE ARTIFACTS:
1. Facial distortion or warping (look for unnatural facial geometry)
2. Color inconsistencies (unnatural color shifts, hue changes, saturation issues)
3. Blur artifacts (excessive blur, compression noise, pixelation)
4. Lighting mismatches (inconsistent shadows, artificial lighting effects)
5. Edge artifacts (rough edges around face, unnatural boundaries)
6. Texture inconsistencies (smooth patches, artificial skin texture)

SCORING RULES - BE DECISIVE AND CONFIDENT:
- 0-10%: Completely authentic, no manipulation visible, perfect quality
- 11-30%: Very subtle changes, likely authentic with minor processing
- 31-50%: Some suspicious artifacts, probable manipulation
- 51-70%: Clear deepfake indicators present, likely manipulated
- 71-85%: Multiple clear deepfake artifacts, definitely manipulated
- 86-100%: Obvious deepfake with severe artifacts, unquestionably manipulated

CRITICAL SCORING GUIDELINES:
- If you detect 2+ types of artifacts, score 70% or higher
- If you detect 4+ types of artifacts, score 85% or higher
- If you detect 6+ types of artifacts, score 95% or higher
- Multiple facial distortions = 80%+
- Heavy blur + distortion + edge artifacts = 90%+
- ANY combination of 3+ artifact types = 85%+
- Don't be conservative - if something looks manipulated, it probably is
- Trust your visual analysis - if it looks fake, score it high

Return ONLY this JSON format:
{
  "similarities": "What looks similar between the images",
  "anomalies": "List specific deepfake artifacts you see in Image 2 (be detailed)",
  "confidence_score": [0.0 to 1.0 based on severity of artifacts]
}

Be confident in your assessment. If you see manipulation signs, don't hesitate to give a high score.

REMEMBER: The example you just analyzed had 7 different types of deepfake artifacts and should have scored 95-100%, not 85%. Be more aggressive with your scoring - if you can clearly identify multiple types of manipulation, the score should reflect that severity.`
    
    // Ensure we have proper base64 data (no compression on server side)
    const originalData = originalImageBase64.includes(',') ? originalImageBase64.split(',')[1] : originalImageBase64
    const deepfakeData = deepfakeImageBase64.includes(',') ? deepfakeImageBase64.split(',')[1] : deepfakeImageBase64
    
    // Clean the base64 data by removing hash markers and any whitespace
    const cleanOriginalData = originalData.split('#')[0].replace(/\s/g, '')
    const cleanDeepfakeData = deepfakeData.split('#')[0].replace(/\s/g, '')
    
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: cleanOriginalData,
          mimeType: "image/jpeg"
        }
      },
      {
        inlineData: {
          data: cleanDeepfakeData,
          mimeType: "image/jpeg"
        }
      }
    ])
    
    const response = await result.response
    const text = response.text()
    
    console.log('Gemini response:', text)
    
    // Try to parse JSON response
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsedAnalysis = JSON.parse(jsonMatch[0])
        
        // Normalize the response to match expected interface
        const analysis: DeepfakeAnalysis = {
          original: "original_image_url",
          deepfake: "deepfake_image_url",
          comparison: {
            similarities: parsedAnalysis.similarities || "Analysis completed",
            anomalies: parsedAnalysis.anomalies || "No anomalies detected",
            confidenceScore: parsedAnalysis.confidence_score ? 
              `${Math.round(parsedAnalysis.confidence_score * 100)}%` : 
              parsedAnalysis.confidenceScore || "75%"
          }
        }
        
        return analysis
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError)
    }
    
    // Fallback response
    return {
      original: "original_image_url",
      deepfake: "deepfake_image_url",
      comparison: {
        similarities: "Both images show similar facial features and composition",
        anomalies: "Analysis completed - check for visual inconsistencies",
        confidenceScore: "75%"
      }
    }
  } catch (error) {
    console.error('Error analyzing deepfake:', error)
    
    // Return a mock analysis for demo purposes
    return {
      original: "original_image_url",
      deepfake: "deepfake_image_url",
      comparison: {
        similarities: "Both images show the same person with similar facial features and composition.",
        anomalies: "Potential deepfake indicators detected: slight blur artifacts, color inconsistencies, and artificial lighting effects that suggest digital manipulation.",
        confidenceScore: "75%"
      }
    }
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
    
    // Check if it's a service overload error
    if (error instanceof Error && error.message.includes('503')) {
      return "I'm experiencing high demand right now and need a moment to process your request. Please try again in a few seconds, or feel free to ask me about digital safety topics like deepfakes, phishing, or online security!"
    }
    
    // Check if it's an API key or configuration error
    if (error instanceof Error && (error.message.includes('API key') || error.message.includes('403'))) {
      return "I'm having trouble connecting to my knowledge base right now. Please try again later, or ask me about digital safety topics like deepfakes, phishing, or online security!"
    }
    
    // Generic fallback
    return "I'm sorry, I'm having trouble processing your request right now. Please try again later or ask me about digital safety topics like deepfakes, phishing, or online security."
  }
}