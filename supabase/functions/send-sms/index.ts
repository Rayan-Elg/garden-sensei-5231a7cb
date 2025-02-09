
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const TEXTBELT_API_KEY = "39bbdf476046aa16d8749550512216f1e2b393090aXdzG5eyrvQO3dTIT1YLH31l"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

serve(async (req) => {
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  // Handle POST request
  if (req.method === 'POST') {
    try {
      const { phoneNumber, message } = await req.json();
      
      const response = await fetch("https://textbelt.com/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phoneNumber,
          message: message,
          key: TEXTBELT_API_KEY,
        }),
      });

      const result = await response.json();
      
      return new Response(JSON.stringify(result), {
        headers: corsHeaders,
        status: 200
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, error: "Failed to send SMS" }),
        { 
          status: 500,
          headers: corsHeaders
        }
      );
    }
  }

  // Handle any other HTTP method
  return new Response(
    JSON.stringify({ error: "Method not allowed" }),
    { 
      status: 405,
      headers: corsHeaders
    }
  );
});
