
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
    const { childName, childAge, favoriteAnimal, magicalPower, characters, artStyle } = await req.json();

    // Validate required parameters
    if (!childName || !childAge || !favoriteAnimal) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
    `;

    // Call OpenAI API to generate the story
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a child-friendly storyteller who creates magical, engaging stories for children. Your stories should be wholesome, positive, and appropriate for the age group specified."
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

    return new Response(
      JSON.stringify({ story }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating story:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
