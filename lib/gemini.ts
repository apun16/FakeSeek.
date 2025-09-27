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

/**
 * Enhanced generateDeepfakeVariations
 * - Creates mock deepfake variations using client-side canvas manipulation
 * - Returns 4 progressively manipulated images with confidence markers
 * - More reliable than API-based generation
 *
 * Usage:
 * const variations = await generateDeepfakeVariations(uploadedFileBase64)
 * variations.forEach(variation => <img src={variation} />)
 */
export async function generateDeepfakeVariations(originalImageBase64: string): Promise<string[]> {
  try {
    // Create canvas-based deepfake variations
    return await createCanvasDeepfakeVariations(originalImageBase64)
  } catch (error) {
    console.error('Error generating deepfake variations:', error)
    
    // Fallback: return the original image 4 times with markers
    return [
      originalImageBase64 + '#subtle',
      originalImageBase64 + '#moderate', 
      originalImageBase64 + '#strong',
      originalImageBase64 + '#extreme'
    ]
  }
}

// Create deepfake variations using canvas manipulation
async function createCanvasDeepfakeVariations(originalImageBase64: string): Promise<string[]> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        resolve([
          originalImageBase64 + '#subtle',
          originalImageBase64 + '#moderate', 
          originalImageBase64 + '#strong',
          originalImageBase64 + '#extreme'
        ])
        return
      }
      
      canvas.width = img.width
      canvas.height = img.height
      
      const variations: string[] = []
      
      // Variation 1: 30% confidence - Subtle facial manipulation
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.filter = 'brightness(1.05) contrast(1.02) saturate(1.05)'
      ctx.drawImage(img, 0, 0)
      
      // Add subtle facial distortion
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const x = (i / 4) % canvas.width
        const y = Math.floor((i / 4) / canvas.width)
        
        // Create subtle wave distortion in facial area (center region)
        if (x > canvas.width * 0.2 && x < canvas.width * 0.8 && y > canvas.height * 0.2 && y < canvas.height * 0.7) {
          const waveX = Math.sin((x / canvas.width) * Math.PI * 2) * 0.5
          const waveY = Math.cos((y / canvas.height) * Math.PI * 2) * 0.3
          data[i] = Math.min(255, data[i] + waveX * 2)     // R
          data[i + 1] = Math.min(255, data[i + 1] + waveY * 2) // G
          data[i + 2] = Math.min(255, data[i + 2] + (waveX + waveY) * 1) // B
        }
      }
      ctx.putImageData(imageData, 0, 0)
      variations.push(canvas.toDataURL('image/jpeg', 0.9) + '#subtle')
      
      // Variation 2: 50% confidence - Moderate facial asymmetry
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.filter = 'brightness(1.1) contrast(1.05) saturate(1.1) hue-rotate(5deg)'
      ctx.drawImage(img, 0, 0)
      
      // Create facial asymmetry by shifting one side
      const imageData2 = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data2 = imageData2.data
      const newData = new Uint8ClampedArray(data2)
      
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          if (x > canvas.width * 0.3 && x < canvas.width * 0.7 && y > canvas.height * 0.2 && y < canvas.height * 0.6) {
            const shift = Math.sin((x / canvas.width) * Math.PI) * 2
            const newX = Math.max(0, Math.min(canvas.width - 1, x + shift))
            const newY = y
            
            const oldIndex = (y * canvas.width + x) * 4
            const newIndex = (newY * canvas.width + newX) * 4
            
            newData[oldIndex] = data2[newIndex]
            newData[oldIndex + 1] = data2[newIndex + 1]
            newData[oldIndex + 2] = data2[newIndex + 2]
            newData[oldIndex + 3] = data2[newIndex + 3]
          }
        }
      }
      ctx.putImageData(new ImageData(newData, canvas.width, canvas.height), 0, 0)
      variations.push(canvas.toDataURL('image/jpeg', 0.8) + '#moderate')
      
      // Variation 3: 75% confidence - Strong lighting inconsistencies
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.filter = 'brightness(1.2) contrast(1.15) saturate(1.3) hue-rotate(15deg)'
      ctx.drawImage(img, 0, 0)
      
      // Add artificial lighting effects
      const imageData3 = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data3 = imageData3.data
      
      for (let i = 0; i < data3.length; i += 4) {
        const x = (i / 4) % canvas.width
        const y = Math.floor((i / 4) / canvas.width)
        
        // Create artificial lighting gradient
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)
        const maxDistance = Math.sqrt(centerX ** 2 + centerY ** 2)
        const lightFactor = 1 - (distance / maxDistance) * 0.3
        
        data3[i] = Math.min(255, data3[i] * lightFactor)     // R
        data3[i + 1] = Math.min(255, data3[i + 1] * lightFactor) // G
        data3[i + 2] = Math.min(255, data3[i + 2] * lightFactor) // B
      }
      ctx.putImageData(imageData3, 0, 0)
      variations.push(canvas.toDataURL('image/jpeg', 0.7) + '#strong')
      
      // Variation 4: 100% confidence - Extreme deepfake artifacts
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.filter = 'brightness(1.3) contrast(1.25) saturate(1.5) hue-rotate(25deg) blur(0.5px)'
      ctx.drawImage(img, 0, 0)
      
      // Add extreme deepfake artifacts
      const imageData4 = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data4 = imageData4.data
      
      for (let i = 0; i < data4.length; i += 4) {
        const x = (i / 4) % canvas.width
        const y = Math.floor((i / 4) / canvas.width)
        
        // Add compression artifacts and color banding
        if (x > canvas.width * 0.25 && x < canvas.width * 0.75 && y > canvas.height * 0.25 && y < canvas.height * 0.65) {
          const noise = (Math.random() - 0.5) * 20
          const banding = Math.floor((x + y) / 10) * 5
          
          data4[i] = Math.max(0, Math.min(255, data4[i] + noise + banding))     // R
          data4[i + 1] = Math.max(0, Math.min(255, data4[i + 1] + noise - banding)) // G
          data4[i + 2] = Math.max(0, Math.min(255, data4[i + 2] + noise + banding * 0.5)) // B
        }
      }
      ctx.putImageData(imageData4, 0, 0)
      variations.push(canvas.toDataURL('image/jpeg', 0.6) + '#extreme')
      
      resolve(variations)
    }
    img.src = originalImageBase64
  })
}

// Create mock variations based on Gemini's descriptions
function createMockVariationsFromDescription(originalImageBase64: string, variations: any[]): string[] {
  // This would create actual image variations based on the descriptions
  // For now, return the original with markers
  return variations.map((v, index) => {
    const markers = ['#subtle', '#moderate', '#strong', '#extreme']
    return originalImageBase64 + markers[index]
  })
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

SCORING RULES - BE STRICT:
- 0-20%: Completely authentic, no manipulation visible
- 21-40%: Very subtle changes, likely authentic with minor processing
- 41-60%: Some suspicious artifacts, possible light manipulation
- 61-80%: Clear deepfake indicators present, likely manipulated
- 81-100%: Obvious deepfake with severe artifacts, definitely manipulated

IMPORTANT: Look at the actual visual quality of Image 2. If it has heavy blur, color distortion, or obvious artifacts, give a high score. If it looks natural, give a low score.

Return ONLY this JSON format:
{
  "similarities": "What looks similar between the images",
  "anomalies": "List specific deepfake artifacts you see in Image 2 (be detailed)",
  "confidence_score": [0.0 to 1.0 based on severity of artifacts]
}

Do not default to 0.75. Base your score on what you actually observe.`
    
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
    return "I'm sorry, I'm having trouble processing your request right now. Please try again later or ask me about digital safety topics like deepfakes, phishing, or online security."
  }
}