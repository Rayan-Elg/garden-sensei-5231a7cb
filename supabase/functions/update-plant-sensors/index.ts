
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed')
    }

    const body = await req.json()
    const { plant_id, moisture, light, temperature } = body

    if (!plant_id) {
      throw new Error('plant_id is required')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const updateData: any = {}
    if (typeof moisture === 'number' && moisture >= 0 && moisture <= 100) {
      updateData.moisture = moisture
    }
    if (typeof light === 'number' && light >= 0 && light <= 100) {
      updateData.light = light
    }
    if (typeof temperature === 'number' && temperature >= -50 && temperature <= 100) {
      updateData.temperature = temperature
    }

    const { data, error } = await supabaseClient
      .from('plants')
      .update(updateData)
      .eq('id', plant_id)
      .select()
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({ message: 'Plant updated successfully', data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
