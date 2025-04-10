
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
    const { prompt, artStyle } = await req.json();
    
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

    console.log('Generating image with prompt:', prompt);
    
    // Enhance the prompt based on art style
    let enhancedPrompt = `A child-friendly illustration in ${artStyle || 'watercolor'} style: ${prompt}`;
    
    // Style-specific prompt enhancements
    switch (artStyle) {
      case 'watercolor':
        enhancedPrompt += ". Soft, dreamy watercolor illustration, gentle colors, suitable for children's book.";
        break;
      case 'cartoon':
        enhancedPrompt += ". Bright, playful cartoon illustration with bold outlines, vibrant colors, child-friendly.";
        break;
      case 'dreamy':
        enhancedPrompt += ". Ethereal, magical illustration with soft focus, glowing elements, and dreamy atmosphere.";
        break;
      case 'pixel':
        enhancedPrompt += ". Cute pixel art illustration, 16-bit style, nostalgic game-like appearance.";
        break;
      case 'comic':
        enhancedPrompt += ". Comic book style illustration with panels, speech bubbles, and action lines.";
        break;
      case 'storybook':
        enhancedPrompt += ". Classic storybook illustration, detailed, warm colors, fairy tale quality.";
        break;
    }
    
    try {
      // Call OpenAI API to generate the image
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "dall-e-2", // Using DALL-E 2 for faster and more cost-effective generations
          prompt: enhancedPrompt,
          n: 1,
          size: "512x512", // Smaller size for faster generation and lower cost
          response_format: "url",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `OpenAI API returned status ${response.status}`);
      }

      const data = await response.json();
      console.log('Image generation response:', data);

      if (!data.data || data.data.length === 0) {
        throw new Error("No image generated");
      }

      return new Response(
        JSON.stringify({ imageUrl: data.data[0].url }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (openaiError) {
      // If OpenAI API fails, return a placeholder and error details
      console.error('OpenAI API error:', openaiError);
      return new Response(
        JSON.stringify({ 
          imageUrl: `${import.meta.env.BASE_URL || '/'}placeholder.svg`,
          error: `Image generation failed: ${openaiError.message || "Unknown error"}`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error generating image:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unknown error occurred',
        imageUrl: `${import.meta.env.BASE_URL || '/'}placeholder.svg` 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
