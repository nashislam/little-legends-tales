import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, artStyle, pageNumber = 0 } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required parameter: prompt",
          imageUrl: `${import.meta.env.BASE_URL || '/'}placeholder.svg` 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if OpenAI API key is available
    if (!openAIApiKey) {
      console.log('No OpenAI API key found, returning placeholder image URL');
      return new Response(
        JSON.stringify({ 
          imageUrl: `${import.meta.env.BASE_URL || '/'}placeholder.svg`,
          error: "OpenAI API key not configured"
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log image generation attempt
    console.log(`Generating image for page ${pageNumber} with art style: ${artStyle}`);
    console.log(`Prompt length: ${prompt.length} characters`);
    
    // Enhanced art style prompts for better results
    const artStylePrompts = {
      watercolor: "Soft, dreamy watercolor illustration with gentle colors, suitable for children's books.",
      cartoon: "Bright, playful cartoon illustration with bold outlines and vibrant colors.",
      dreamy: "Ethereal, magical illustration with soft focus, glowing elements, and dreamy atmosphere.",
      pixel: "Cute pixel art illustration with 16-bit style, nostalgic game-like appearance.",
      comic: "Comic book style illustration with dynamic composition and bold colors.",
      storybook: "Classic storybook illustration with warm colors and fairy tale quality."
    };
    
    // Create a simplified prompt focused on key elements
    let enhancedPrompt = `Children's book illustration: ${prompt.substring(0, 250)}`;
    
    // Add art style information
    if (artStyle && artStylePrompts[artStyle as keyof typeof artStylePrompts]) {
      enhancedPrompt += ` Style: ${artStylePrompts[artStyle as keyof typeof artStylePrompts]}`;
    } else {
      enhancedPrompt += " Style: Children's book illustration style.";
    }
    
    // Keep prompt to a reasonable length
    enhancedPrompt = enhancedPrompt.substring(0, 500);
    
    // Set a shorter timeout for the OpenAI request (15 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    try {
      // Call OpenAI API with optimized parameters
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "dall-e-2", // Use DALL-E 2 for faster generation
          prompt: enhancedPrompt,
          n: 1,
          size: "256x256", // Smaller size for faster generation
          response_format: "url",
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `OpenAI API returned status ${response.status}`);
      }

      const data = await response.json();
      console.log('Image generation successful');

      return new Response(
        JSON.stringify({ imageUrl: data.data[0].url }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError.name === 'AbortError' ? 'Request timed out' : openaiError);
      
      // If the request timed out or otherwise failed, return a placeholder
      return new Response(
        JSON.stringify({ 
          imageUrl: `${import.meta.env.BASE_URL || '/'}placeholder.svg`,
          error: openaiError.name === 'AbortError' ? 
            "Image generation timed out. Try again later." : 
            `Image generation failed: ${openaiError.message || "Unknown error"}`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unknown error occurred',
        imageUrl: `${import.meta.env.BASE_URL || '/'}placeholder.svg` 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
