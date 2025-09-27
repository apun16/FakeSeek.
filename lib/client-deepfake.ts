/**
 * Client-side deepfake generation utilities
 * These functions run in the browser and use Canvas API for image manipulation
 */

export interface DeepfakeVariation {
  dataUrl: string
  confidence: number
  label: string
}

// Helper function to calculate edge factor for realistic artifact placement
function calculateEdgeFactor(imageData: ImageData, x: number, y: number, width: number): number {
  const center = imageData.data[(y * width + x) * 4]
  let edgeStrength = 0

  // Check neighboring pixels for color differences
  const neighbors = [
    { dx: -1, dy: 0 }, { dx: 1, dy: 0 },
    { dx: 0, dy: -1 }, { dx: 0, dy: 1 }
  ]

  for (const neighbor of neighbors) {
    const nx = x + neighbor.dx
    const ny = y + neighbor.dy
    if (nx >= 0 && nx < width && ny >= 0 && ny < imageData.height) {
      const nIndex = (ny * width + nx) * 4
      const neighborCenter = imageData.data[nIndex]
      edgeStrength += Math.abs(center - neighborCenter)
    }
  }

  return Math.min(edgeStrength / (255 * 4), 1) // Normalize to 0-1
}

/**
 * Generate deepfake variations client-side using Canvas API with realistic artifacts
 * @param originalImageBase64 - Base64 data URL of the original image
 * @returns Promise<string[]> - Array of base64 data URLs for variations
 */
export async function createCanvasDeepfakeVariations(originalImageBase64: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }

        canvas.width = img.width
        canvas.height = img.height

        const variations: string[] = []

        // Variation 1: 40% confidence - Normal with some color tint
        console.log('DEBUG: Creating subtle variation, image dimensions:', { width: canvas.width, height: canvas.height })
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.filter = 'brightness(1.05) contrast(1.02) saturate(1.1) hue-rotate(8deg)'
        ctx.drawImage(img, 0, 0)

        // Add subtle color tinting across the image
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        let pixelsModified = 0

        // Apply subtle color tinting
        for (let i = 0; i < data.length; i += 4) {
          const x = (i / 4) % canvas.width
          const y = Math.floor((i / 4) / canvas.width)
          
          // Apply subtle color tinting - slightly warmer tone
          data[i] = Math.min(255, Math.max(0, data[i] + 8))     // R - warmer
          data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + 3)) // G - slight green
          data[i + 2] = Math.min(255, Math.max(0, data[i + 2] - 2)) // B - less blue
          pixelsModified++
        }
        console.log('DEBUG: Color tint variation - pixels modified:', pixelsModified)
        ctx.putImageData(imageData, 0, 0)
        variations.push(canvas.toDataURL('image/jpeg', 0.95) + '#subtle')
        
        // Variation 2: 60% confidence - Mild blurring
        console.log('DEBUG: Creating moderate variation')
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.filter = 'brightness(1.02) contrast(1.01) blur(1.5px)'
        ctx.drawImage(img, 0, 0)

        // Add mild blurring effect
        const imageData2 = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data2 = imageData2.data
        let pixelsModified2 = 0

        // Apply mild blur by averaging neighboring pixels
        for (let y = 1; y < canvas.height - 1; y++) {
          for (let x = 1; x < canvas.width - 1; x++) {
            const i = (y * canvas.width + x) * 4
            
            // Only apply to facial area
            if (x > canvas.width * 0.2 && x < canvas.width * 0.8 && y > canvas.height * 0.2 && y < canvas.height * 0.7) {
              // Simple box blur
              let r = 0, g = 0, b = 0
              for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                  const ni = ((y + dy) * canvas.width + (x + dx)) * 4
                  r += data2[ni]
                  g += data2[ni + 1]
                  b += data2[ni + 2]
                }
              }
              
              data2[i] = r / 9
              data2[i + 1] = g / 9
              data2[i + 2] = b / 9
              pixelsModified2++
            }
          }
        }
        console.log('DEBUG: Mild blur variation - pixels modified:', pixelsModified2)
        ctx.putImageData(imageData2, 0, 0)
        variations.push(canvas.toDataURL('image/jpeg', 0.85) + '#moderate')
        
        // Variation 3: 80% confidence - Extreme color tinting
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.filter = 'brightness(1.1) contrast(1.05) saturate(1.8) hue-rotate(45deg)'
        ctx.drawImage(img, 0, 0)
        
        // Add extreme color tinting
        const imageData3 = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data3 = imageData3.data
        let pixelsModified3 = 0
        
        for (let i = 0; i < data3.length; i += 4) {
          const x = (i / 4) % canvas.width
          const y = Math.floor((i / 4) / canvas.width)
          
          // Apply extreme color tinting - very warm/reddish tone
          data3[i] = Math.min(255, Math.max(0, data3[i] + 25))     // R - much warmer
          data3[i + 1] = Math.min(255, Math.max(0, data3[i + 1] - 10)) // G - less green
          data3[i + 2] = Math.min(255, Math.max(0, data3[i + 2] - 20)) // B - much less blue
          pixelsModified3++
        }
        console.log('DEBUG: Extreme color tint variation - pixels modified:', pixelsModified3)
        ctx.putImageData(imageData3, 0, 0)
        variations.push(canvas.toDataURL('image/jpeg', 0.7) + '#strong')
        
        // Variation 4: 100% confidence - Obvious deepfake artifacts (controlled effects)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.filter = 'brightness(1.15) contrast(1.25) saturate(1.3) hue-rotate(20deg) blur(5px)'
        ctx.drawImage(img, 0, 0)
        
        // Create obvious deepfake artifacts with controlled distortion
        const imageData4 = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data4 = imageData4.data
        let pixelsModified4 = 0
        
        for (let i = 0; i < data4.length; i += 4) {
          const x = (i / 4) % canvas.width
          const y = Math.floor((i / 4) / canvas.width)
          
          // Apply to facial area only
          if (x > canvas.width * 0.25 && x < canvas.width * 0.75 && y > canvas.height * 0.25 && y < canvas.height * 0.75) {
            // Create controlled facial distortion
            const facialWarp = Math.sin((x / canvas.width) * Math.PI * 3) * 4
            const verticalDistortion = Math.cos((y / canvas.height) * Math.PI * 2) * 3
            
            // Add controlled noise
            const noise = (Math.random() - 0.5) * 15
            const compressionNoise = (Math.random() - 0.5) * 10
            
            // Apply controlled distortion with proper bounds
            const rChange = facialWarp + verticalDistortion + noise + compressionNoise
            const gChange = facialWarp * 0.8 + verticalDistortion + noise + compressionNoise
            const bChange = facialWarp * 0.6 + verticalDistortion + noise + compressionNoise
            
            data4[i] = Math.max(0, Math.min(255, data4[i] + rChange))     // R
            data4[i + 1] = Math.max(0, Math.min(255, data4[i + 1] + gChange)) // G
            data4[i + 2] = Math.max(0, Math.min(255, data4[i + 2] + bChange)) // B
            pixelsModified4++
          }
        }
        
        console.log('DEBUG: Controlled deepfake artifacts variation - pixels modified:', pixelsModified4)
        ctx.putImageData(imageData4, 0, 0)
        variations.push(canvas.toDataURL('image/jpeg', 0.3) + '#extreme')
        
        resolve(variations)
      } catch (error) {
        reject(error)
      }
    }
    
    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }
    
    img.src = originalImageBase64
  })
}

/**
 * Generate deepfake variations with metadata
 * @param originalImageBase64 - Base64 data URL of the original image
 * @returns Promise<DeepfakeVariation[]> - Array of variations with metadata
 */
export async function generateDeepfakeVariationsWithMetadata(originalImageBase64: string): Promise<DeepfakeVariation[]> {
  const variations = await createCanvasDeepfakeVariations(originalImageBase64)
  
  return [
    {
      dataUrl: variations[0],
      confidence: 40,
      label: 'Color Tint'
    },
    {
      dataUrl: variations[1],
      confidence: 60,
      label: 'Mild Blurring'
    },
    {
      dataUrl: variations[2],
      confidence: 80,
      label: 'Extreme Color Tinting'
    },
    {
      dataUrl: variations[3],
      confidence: 100,
      label: 'Obvious Deepfake'
    }
  ]
}
