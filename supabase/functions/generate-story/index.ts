
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { OpenAI } from "https://deno.land/x/openai@v4.16.1/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to generate a fallback story when OpenAI is unavailable
function generateFallbackStory(params) {
  const { childName, childAge, favoriteAnimal, magicalPower, characters } = params;
  const magicalAbility = magicalPower || 'do amazing magical things';
  const friendsAndFamily = characters ? `with ${characters}` : 'with family and friends';
  
  return `
Once upon a time, there was a ${childAge}-year-old named ${childName} who loved ${favoriteAnimal}s more than anything in the world. ${childName} had a special gift - the magical ability to ${magicalAbility}!

One sunny morning, ${childName} woke up to find a tiny ${favoriteAnimal} sitting at the foot of the bed. This wasn't just any ${favoriteAnimal} - it could talk! "My name is Whisper," said the ${favoriteAnimal}, "and I need your help!"

Whisper explained that the forest where all magical ${favoriteAnimal}s lived was in danger. A mysterious fog had rolled in, causing all the colors to fade away. "Only someone with your special magic can help us," Whisper said.

${childName} didn't hesitate. Together ${friendsAndFamily}, they journeyed to the enchanted forest. When they arrived, everything was gray and gloomy. The flowers drooped and the trees looked sad without their vibrant colors.

"Now," said Whisper, "use your power to ${magicalAbility}!" ${childName} concentrated hard, feeling the magic tingling from head to toe. Suddenly, a burst of light shot from ${childName}'s fingertips!

Slowly, colors began to return to the forest. First the greens of the leaves, then the reds and yellows of the flowers, and finally the bright blue of the stream that ran through the middle of the forest.

All the magical ${favoriteAnimal}s came out from hiding to thank ${childName}. They danced and played together all afternoon until the sun began to set.

Before ${childName} headed home, the Queen of the ${favoriteAnimal}s presented a magical charm. "This will let you visit us whenever you wish," she said with a smile.

That night, as ${childName} drifted off to sleep with the magical charm clutched tightly, dreams of adventures with the ${favoriteAnimal}s filled the night. And ${childName} knew that this was just the beginning of many magical journeys to come.

Remember, ${childName}, magic is all around us - we just need to believe!
  `;
}

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

    // Check if OpenAI API key is available
    if (!openAIApiKey) {
      console.log('No OpenAI API key found, using fallback story generator');
      const fallbackStory = generateFallbackStory({ childName, childAge, favoriteAnimal, magicalPower, characters });
      return new Response(
        JSON.stringify({ story: fallbackStory }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    try {
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
    } catch (openaiError) {
      // If OpenAI API fails, use the fallback story generator
      console.error('OpenAI API error:', openaiError);
      console.log('Using fallback story generator');
      const fallbackStory = generateFallbackStory({ childName, childAge, favoriteAnimal, magicalPower, characters });
      return new Response(
        JSON.stringify({ story: fallbackStory }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error generating story:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
