
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const TEXTBELT_API_KEY = "39bbdf476046aa16d8749550512216f1e2b393090aXdzG5eyrvQO3dTIT1YLH31l"

serve(async (req) => {
  // Updated CORS headers with specific origin
  const headers = {
    'Access-Control-Allow-Origin': '*', // In production, replace with your specific domain
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'Content-Type': 'application/json'
  }

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204, // Use 204 for preflight success
      headers
    })
  }

  try {
    const { phoneNumber, message } = await req.json()
    console.log('Received request:', { phoneNumber, message })

    if (!phoneNumber || !message) {
      throw new Error('Phone number and message are required')
    }

    const response = await fetch('https://textbelt.com/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: phoneNumber,
        message: message,
        key: TEXTBELT_API_KEY,
      }),
    })

    const data = await response.json()
    console.log('TextBelt API Response:', data)

    return new Response(
      JSON.stringify(data),
      { headers }
    )
  } catch (error) {
    console.error('Send SMS Error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to send SMS'
      }),
      { 
        status: 500,
        headers
      }
    )
  }
})
