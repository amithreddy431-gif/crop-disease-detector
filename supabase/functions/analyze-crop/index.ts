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

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    console.log('Analyzing crop image with OpenAI Vision...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
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
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');
    
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response from OpenAI
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
      console.error('Failed to parse OpenAI response:', content);
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
