
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { OpenAI } from "https://deno.land/x/openai@v4.16.1/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to generate a fallback story when OpenAI is unavailable
function generateFallbackStoryResponse(params) {
  const { childName, childAge, favoriteAnimal, magicalPower, characters } = params;
  const magicalAbility = magicalPower || 'do amazing magical things';
  const friendsAndFamily = characters ? `with ${characters}` : 'with family and friends';
  
  // Create a structured storybook format with pages
  const fullStory = `
Once upon a time, there was a ${childAge}-year-old named ${childName} who loved ${favoriteAnimal}s more than anything in the world. ${childName} had a special gift - the magical ability to ${magicalAbility}!

One sunny morning, ${childName} woke up to find a tiny ${favoriteAnimal} sitting at the foot of the bed. This wasn't just any ${favoriteAnimal} - it could talk! "My name is Whisper," said the ${favoriteAnimal}, "and I need your help!"

Whisper explained that the forest where all magical ${favoriteAnimal}s lived was in danger. A mysterious fog had rolled in, causing all the colors to fade away. "Only someone with your special magic can help us," Whisper said.

${childName} didn't hesitate. Together ${friendsAndFamily}, they journeyed to the enchanted forest. When they arrived, everything was gray and gloomy. The flowers drooped and the trees looked sad without their vibrant colors.

"Now," said Whisper, "use your power to ${magicalAbility}!" ${childName} concentrated hard, feeling the magic tingling from head to toe. Suddenly, a burst of light shot from ${childName}'s fingertips!

Slowly, colors began to return to the forest. First the greens of the leaves, then the reds and yellows of the flowers, and finally the bright blue of the stream that ran through the middle of the forest.

All the magical ${favoriteAnimal}s came out from hiding to thank ${childName}. They danced and played together all afternoon until the sun began to set.

Before ${childName} headed home, the Queen of the ${favoriteAnimal}s presented a magical charm. "This will let you visit us whenever you wish," she said with a smile.

That night, as ${childName} drifted off to sleep with the magical charm clutched tightly, dreams of adventures with the ${favoriteAnimal}s filled the night. And ${childName} knew that this was just the beginning of many magical journeys to come.
  `;

  // Split the story into pages
  const storyParagraphs = fullStory.trim().split('\n\n');
  
  // Create pages with content and image prompts
  const pages = [];
  
  // We need 8 content pages (plus 2 covers = 10 total)
  for (let i = 0; i < 8; i++) {
    const pageContent = storyParagraphs[i] || `Page ${i+1} of ${childName}'s adventure`;
    
    pages.push({
      pageNumber: i + 1,
      content: pageContent,
      imagePrompt: `A children's book illustration showing ${childName} and a ${favoriteAnimal} in an adventure. Page ${i+1}.`
    });
  }
  
  return {
    pages,
    story: fullStory,
    coverPrompt: `A magical storybook cover featuring ${childName} and a ${favoriteAnimal} on an adventure with the title "${childName}'s Magical Adventure"`,
    backCoverPrompt: `A beautiful back cover illustration for a children's book about ${childName} and a ${favoriteAnimal}`
  };
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
      const fallbackResponse = generateFallbackStoryResponse({ childName, childAge, favoriteAnimal, magicalPower, characters });
      return new Response(
        JSON.stringify(fallbackResponse),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    try {
      // Initialize OpenAI client
      const openai = new OpenAI({
        apiKey: openAIApiKey,
      });

      // Craft a prompt for the story with image prompts
      const systemPrompt = `
You are an expert children's book author and illustrator who creates engaging, age-appropriate stories with matching illustrations.
You will create a 10-page storybook (front cover + 8 story pages + back cover) for a ${childAge}-year-old named ${childName}.

YOUR OUTPUT MUST BE IN THE FOLLOWING JSON FORMAT:
{
  "pages": [
    {
      "pageNumber": 1,
      "content": "Page text content (max 50 words per page)",
      "imagePrompt": "Detailed description for AI image generation"
    },
    ...more pages
  ],
  "coverPrompt": "Detailed front cover image prompt",
  "backCoverPrompt": "Detailed back cover image prompt"
}

DETAILED INSTRUCTIONS:
1. Create a story about ${childName} who loves ${favoriteAnimal}s and has the magical ability to ${magicalPower || 'do amazing things'}.
2. ${characters ? `Include these characters in the story: ${characters}.` : 'Include some supporting characters in the story.'}
3. Ensure all text fits within a children's book page (maximum 50 words per page).
4. For each page, provide an "imagePrompt" that describes what the illustration should show.
5. The illustrations should follow the "${artStyle}" art style.
6. Create image prompts that would work well with AI image generation.
7. Make sure character appearance descriptions remain consistent across all image prompts.
8. Structure the story with a clear beginning, middle, and resolution.
9. Make the front and back cover prompts special and eye-catching.
10. The story should be heartwarming and have a positive message.
`;

      const userPrompt = `
Create a 10-page children's storybook about ${childName}, a ${childAge}-year-old who loves ${favoriteAnimal}s and can ${magicalPower || 'do amazing magical things'}.
${characters ? `Include these characters: ${characters}.` : ''}
Use the "${artStyle}" art style for illustrations.
Remember to follow the required JSON output format with pages array, coverPrompt, and backCoverPrompt.
`;

      console.log('Calling OpenAI API with prompt');
      
      // Call OpenAI API to generate the structured story with image prompts
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // Using GPT-4o for better story and image prompt generation
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 2500,
        temperature: 0.7,
      });

      const result = JSON.parse(response.choices[0].message.content);
      console.log('Successfully generated structured storybook');

      // Add the full story as plain text (joining all page contents)
      const fullStory = result.pages.map(page => page.content).join('\n\n');
      result.story = fullStory;

      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (openaiError) {
      // If OpenAI API fails, use the fallback story generator
      console.error('OpenAI API error:', openaiError);
      console.log('Using fallback story generator');
      const fallbackResponse = generateFallbackStoryResponse({ childName, childAge, favoriteAnimal, magicalPower, characters });
      return new Response(
        JSON.stringify(fallbackResponse),
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
