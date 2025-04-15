
import { supabase } from '@/integrations/supabase/client';
import { Page } from './pageManagement';
import { extractSceneDescription } from './imageGeneration';
import { extractStoryElements } from './analysis';

/**
 * Generates AI images for all story pages
 */
export const generateConsistentStoryImages = async (
  pages: Page[], 
  childName: string,
  artStyle: string
): Promise<Page[]> => {
  console.log('Starting image generation for pages', pages);
  const updatedPages = [...pages];
  
  for (let i = 0; i < updatedPages.length; i++) {
    try {
      const page = updatedPages[i];
      const prompt = page.imagePrompt || 
                    (i === 0 ? 
                      `A beautiful book cover for "${childName}'s Magical Adventure". Art style: ${artStyle}.` : 
                      `Illustration for a children's book. Scene: ${page.content.substring(0, 200)}. Art style: ${artStyle}.`);
      
      console.log(`Generating image for page ${i} with prompt: ${prompt}`);
      
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: {
          prompt,
          artStyle,
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

      console.log('Image generation response for page', i, ':', data);
      updatedPages[i].image = data.imageUrl;
      updatedPages[i].imageError = false;
    } catch (error) {
      console.error(`Error generating image for page ${i}:`, error);
      updatedPages[i].imageError = true;
      updatedPages[i].image = `${import.meta.env.BASE_URL}placeholder.svg`;
    }
  }
  
  return updatedPages;
};

