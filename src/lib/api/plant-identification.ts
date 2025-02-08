const GEMINI_API_KEY = 'AIzaSyDVRDD3PaAZrm5qnqnP98Sqa6DlT9wcbE4';
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB limit per image

export interface PlantIdentification {
  name: string;
  species: string;
  description: string;
  confidence: number;
  rawResponse?: string;
}

interface GenerationConfig {
  temperature: number;
  topK: number;
  topP: number;
  maxOutputTokens: number;
}

interface SafetySetting {
  category: string;
  threshold: string;
}

interface GeminiRequest {
  contents: Array<{
    parts: Array<{
      text?: string;
      inline_data?: {
        mime_type: string;
        data: string;
      };
    }>;
  }>;
  generationConfig: GenerationConfig;
  safetySettings: SafetySetting[];
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      // Remove the data:image/xyz;base64, prefix
      resolve(base64String.split(',')[1]);
    };
    reader.onerror = reject;
  });
};

async function compressImage(file: File): Promise<File> {
  const maxSize = 4 * 1024 * 1024; // 4MB limit for Gemini
  if (file.size <= maxSize) return file;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions while maintaining aspect ratio
      if (width > 2048 || height > 2048) {
        if (width > height) {
          height = Math.round((height * 2048) / width);
          width = 2048;
        } else {
          width = Math.round((width * 2048) / height);
          height = 2048;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Could not compress image'));
            return;
          }
          resolve(new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          }));
        },
        'image/jpeg',
        0.8  // Quality setting
      );
    };
    img.onerror = () => reject(new Error('Could not load image'));
  });
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const retryWithExponentialBackoff = async <T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = RETRY_DELAY
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await sleep(delay);
    return retryWithExponentialBackoff(fn, retries - 1, delay * 2);
  }
};

export const identifyPlant = async (imageFile: File): Promise<PlantIdentification | null> => {
  try {
    const processedImage = await compressImage(imageFile);
    const base64Image = await fileToBase64(processedImage);
    
    const prompt = `You are an expert botanist helping identify plants. 
    Analyze this plant image and provide the following information:

    1. The common name (or most likely plant type if unsure)
    2. The scientific name (genus and species, just genus if species is uncertain)
    3. A brief description including:
       - Plant family
       - Key identifying features
       - Basic care requirements

    Format your response EXACTLY like this:
    Name: [common name]
    Scientific Name: [genus species]
    Description: [your description]
    Confidence: [high/medium/low]

    If you can't identify the plant with reasonable confidence, say so and explain what would help make a better identification.`;

    const makeRequest = async () => {
      const requestBody: GeminiRequest = {
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64Image
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.2,  // Lower temperature for more focused responses
          topK: 32,
          topP: 1,
          maxOutputTokens: 1024
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE"
          }
        ]
      };

      console.log('Making Gemini API request...');
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API response:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          headers: Object.fromEntries(response.headers.entries())
        });
        throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      console.log('Gemini API response:', JSON.stringify(data, null, 2));
      return data;
    };

    const data = await retryWithExponentialBackoff(makeRequest);

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('No valid response from Gemini API:', data);
      return null;
    }

    const text = data.candidates[0].content.parts[0].text;
    console.log('Raw Gemini response:', text);
    
    // Parse the response with better error handling
    const nameMatch = text.match(/Name:\s*(.+?)(?:\n|$)/);
    const scientificMatch = text.match(/Scientific Name:\s*(.+?)(?:\n|$)/);
    const descriptionMatch = text.match(/Description:\s*(.+?)(?=\nConfidence:|$)/s);
    const confidenceMatch = text.match(/Confidence:\s*(high|medium|low)/i);

    if (!nameMatch || !scientificMatch || !descriptionMatch) {
      console.error('Could not parse Gemini response:', text);
      return null;
    }

    const confidenceLevel = confidenceMatch?.[1]?.toLowerCase() || 'medium';
    const confidenceScore = {
      high: 0.9,
      medium: 0.7,
      low: 0.5
    }[confidenceLevel] || 0.7;

    const result = {
      name: nameMatch[1].trim(),
      species: scientificMatch[1].trim(),
      description: descriptionMatch[1].trim(),
      confidence: confidenceScore,
      rawResponse: text
    };

    console.log('Parsed plant identification:', result);
    return result;
  } catch (error) {
    console.error('Error identifying plant:', error);
    throw error;
  }
};