
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const TEXTBELT_API_KEY = "39bbdf476046aa16d8749550512216f1e2b393090aXdzG5eyrvQO3dTIT1YLH31l"

serve(async (req) => {
  try {
    const { phoneNumber, message } = await req.json()

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
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error('Send SMS Error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    )
  }
})
