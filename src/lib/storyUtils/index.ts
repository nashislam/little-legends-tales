
import { supabase } from '@/integrations/supabase/client';
import { extractStoryElements } from './storyAnalysis';
import { Page, splitStoryIntoPages } from './pageManagement';
import { extractSceneDescription, generatePlaceholderImage } from './imageGeneration';

export { splitStoryIntoPages, extractStoryElements, generatePlaceholderImage };
export type { Page };

/**
 * Generates AI images for all story pages with consistent characters and scenes
 * @param pages - Array of page content
 * @param childName - The child's name
 * @param favoriteAnimal - The child's favorite animal
 * @param artStyle - The selected art style
 * @param fullStory - The complete story text
 * @returns Promise with updated pages containing image URLs
 */
export const generateConsistentStoryImages = async (
  pages: Page[], 
  childName: string,
  favoriteAnimal: string,
  artStyle: string,
  fullStory: string
): Promise<Page[]> => {
  // Extract key story elements for consistency
  const storyElements = extractStoryElements(fullStory);
  console.log('Extracted story elements for consistent imagery:', storyElements);
  
  // Create the character description for consistency
  const characterDescription = `${childName} (the main character) and ${favoriteAnimal} maintaining the same appearance throughout all illustrations.`;
  
  // Process pages sequentially to maintain consistency
  const updatedPages = [...pages];
  
  for (let i = 0; i < updatedPages.length; i++) {
    try {
      const sceneDescription = extractSceneDescription(
        updatedPages[i].content,
        i,
        childName,
        favoriteAnimal,
        storyElements
      );
      
      console.log(`Generating consistent image for page ${i+1} with description: ${sceneDescription}`);
      
      // Create a prompt that maintains consistency
      const consistentPrompt = `${sceneDescription} ${characterDescription} Art style: ${artStyle}. Consistent character design across all illustrations.`;
      
      // Call our Supabase Edge Function with the enhanced prompt
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: {
          prompt: consistentPrompt,
          artStyle: artStyle,
          pageNumber: i,
          previousPages: i > 0 ? updatedPages.slice(0, i).map(p => p.content) : [],
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

      console.log('Image generation response for page', i+1, ':', data);
      updatedPages[i].image = data.imageUrl;
    } catch (error) {
      console.error(`Error generating image for page ${i}:`, error);
      updatedPages[i].imageError = true;
      updatedPages[i].image = generatePlaceholderImage(i, artStyle);
    }
  }
  
  return updatedPages;
};

