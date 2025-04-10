
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { OpenAI } from "https://deno.land/x/openai@v4.16.1/mod.ts";

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
    console.log('Received request to generate-story function');
    const { childName, childAge, favoriteAnimal, magicalPower, characters, artStyle } = await req.json();

    // Validate required parameters
    if (!childName || !childAge || !favoriteAnimal) {
      console.error('Missing required parameters');
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate OpenAI API key
    if (!openAIApiKey) {
      console.error('Missing OpenAI API key');
      return new Response(
        JSON.stringify({ error: 'Server configuration error: Missing API key' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: openAIApiKey,
    });

    // Craft a prompt for the story
    const prompt = `
    Create a child-friendly story for a ${childAge}-year-old named ${childName} who loves ${favoriteAnimal}s.
    The story should feature ${childName} as the main character with the magical ability to ${magicalPower || 'do amazing magical things'}.
    ${characters ? `Include these characters in the story: ${characters}.` : ''}
    The story should be 8-10 paragraphs long, child-appropriate, engaging, and end with a positive message.
    Structure the story with a beginning (introduction of ${childName} and their magical power), 
    a middle (a challenge or adventure they face), and an end (how they overcome the challenge using their power).
    Make the story heartwarming and magical.
    Consider the art style "${artStyle}" when crafting the imagery described in the story.
    `;

    console.log('Calling OpenAI API with prompt');
    
    // Call OpenAI API to generate the story (using GPT-4o for better story generation)
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using GPT-4o-mini as it's a good balance of quality and speed
      messages: [
        {
          role: "system",
          content: "You are a child-friendly storyteller who creates magical, engaging stories for children. Your stories should be wholesome, positive, and appropriate for the age group specified. Structure your stories clearly with paragraphs for easy reading."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const story = response.choices[0].message.content;
    console.log('Successfully generated story');

    return new Response(
      JSON.stringify({ story }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating story:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
