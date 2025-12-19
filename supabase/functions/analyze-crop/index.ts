import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();
    
    if (!imageBase64) {
      throw new Error('No image provided');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Analyzing crop image with Lovable AI...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an expert agricultural pathologist specializing in crop disease identification. Analyze the provided image of a crop/plant and identify any diseases present.

You MUST respond with a valid JSON object in this exact format:
{
  "disease": "Name of the disease or 'Healthy' if no disease detected",
  "confidence": 85,
  "severity": "Low/Moderate/High/Critical or 'N/A' if healthy",
  "symptoms": "Detailed description of visible symptoms observed in the image",
  "treatment": "Specific treatment recommendations including fungicides, pesticides, or organic solutions",
  "prevention": "Preventive measures to avoid future occurrences"
}

Be specific and accurate. If the image doesn't show a crop or plant, indicate that in the disease field as "Not a crop image". The confidence should be a number between 0-100.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please analyze this crop image for any diseases and provide detailed findings.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: "Rate limit exceeded. Please try again in a moment.",
          disease: "Rate Limited",
          confidence: 0,
          severity: "N/A",
          symptoms: "Too many requests. Please wait a moment and try again.",
          treatment: "Wait a few seconds and retry.",
          prevention: "N/A"
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: "AI credits exhausted. Please add credits to continue.",
          disease: "Credits Exhausted",
          confidence: 0,
          severity: "N/A",
          symptoms: "AI analysis requires credits.",
          treatment: "Add credits in Settings -> Workspace -> Usage",
          prevention: "N/A"
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Lovable AI response received');
    
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response from AI');
    }

    // Parse the JSON response
    let analysisResult;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      // Fallback response
      analysisResult = {
        disease: "Analysis Error",
        confidence: 0,
        severity: "Unknown",
        symptoms: "Could not parse the analysis results",
        treatment: "Please try again with a clearer image",
        prevention: "N/A"
      };
    }

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-crop function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ 
      error: errorMessage,
      disease: "Error",
      confidence: 0,
      severity: "Unknown",
      symptoms: "An error occurred during analysis",
      treatment: "Please try again",
      prevention: "N/A"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
