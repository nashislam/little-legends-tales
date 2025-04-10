
import { supabase } from '@/integrations/supabase/client';

/**
 * Generates a dummy image URL for story illustration (placeholder)
 * In a production app, this would be replaced with real image generation
 */
export const generatePlaceholderImage = (pageNumber: number, artStyle: string): string => {
  // In a real app, this would call an AI image generation service
  // For now, we'll return placeholder images
  const styles = {
    watercolor: 'pastel',
    cartoon: 'cartoon',
    dreamy: 'fantasy',
    pixel: 'pixel',
    comic: 'comic',
    storybook: 'storybook'
  };
  
  const style = styles[artStyle as keyof typeof styles] || 'storybook';
  
  // Return placeholder image - in production this would be AI-generated
  return `${import.meta.env.BASE_URL}placeholder.svg`;
};

/**
 * Generates a single AI image for a story page
 * @param pageContent - The content of the page
 * @param pageNumber - The page number
 * @param artStyle - The selected art style
 * @returns Promise with the image URL
 */
export const generateStoryImage = async (pageContent: string, pageNumber: number, artStyle: string): Promise<string> => {
  try {
    // Extract a scene description from the page content
    const sceneDescription = extractSceneDescription(pageContent, pageNumber, "Child", "magical animal", {});
    console.log(`Generating image for page ${pageNumber} with description: ${sceneDescription}`);
    
    // Call our Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: {
        prompt: sceneDescription,
        artStyle: artStyle,
      },
    });

    if (error) {
      console.error('Error calling generate-image function:', error);
      throw new Error(`Failed to generate image: ${error.message}`);
    }

    if (!data?.imageUrl) {
      console.error('No image URL returned from function:', data);
      throw new Error('No image URL returned from generation service');
    }

    console.log('Image generation response:', data);
    return data.imageUrl;
  } catch (error) {
    console.error('Error in generateStoryImage:', error);
    return generatePlaceholderImage(pageNumber, artStyle);
  }
};

/**
 * Extracts a scene description from page content for image generation
 * @param content - The page content
 * @param pageNumber - The page number
 * @param childName - The child's name
 * @param favoriteAnimal - The child's favorite animal
 * @param storyElements - Key elements extracted from the story
 * @returns A consistent scene description for image generation
 */
export const extractSceneDescription = (
  content: string, 
  pageNumber: number,
  childName: string,
  favoriteAnimal: string,
  storyElements: any
): string => {
  // Handle title page differently
  if (content === "Title Page") {
    return `A magical children's storybook cover featuring ${childName}, a ${favoriteAnimal}, and a magical adventure theme. Whimsical, fantasy style, child-friendly illustration with vibrant colors.`;
  }
  
  // Extract the first 150-200 characters as a base for the current scene
  let description = content.substring(0, 200);
  
  // Look for descriptive sentences that indicate a scene
  const descriptivePatterns = [
    /(\w+\s+was\s+\w+ing\s+[^.!?]+[.!?])/i, // "X was doing Y"
    /(\w+\s+saw\s+[^.!?]+[.!?])/i,           // "X saw Y"
    /(\w+\s+looked\s+[^.!?]+[.!?])/i,        // "X looked Y"
    /(there\s+was\s+[^.!?]+[.!?])/i,         // "There was X"
  ];
  
  for (const pattern of descriptivePatterns) {
    const match = content.match(pattern);
    if (match && match[0]) {
      description = match[0];
      break;
    }
  }
  
  // Add consistency elements to the prompt
  let consistentPrompt = `A scene from a children's storybook featuring ${childName}`;
  
  // Add the favorite animal for consistency
  consistentPrompt += `, with ${favoriteAnimal}`;
  
  // Add extracted story elements for consistency across pages
  if (storyElements.mainCharacter) {
    consistentPrompt += `, and ${storyElements.mainCharacter}`;
  }
  
  // Combine with the specific scene description
  const finalPrompt = `${consistentPrompt}. Scene: ${description.trim()}. Children's book illustration style, consistent character design across all images, same art style throughout the book.`;
  
  return finalPrompt;
};
