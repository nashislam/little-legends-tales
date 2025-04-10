
import { supabase } from '@/integrations/supabase/client';

interface Page {
  content: string;
  image?: string;
}

/**
 * Splits a story into pages
 * @param story - The full story text
 * @param paragraphsPerPage - Number of paragraphs per page (default: 2)
 * @returns Array of page objects with content
 */
export const splitStoryIntoPages = (story: string, paragraphsPerPage: number = 2): Page[] => {
  // Split the story by paragraphs (empty lines)
  const paragraphs = story.split('\n\n').filter(p => p.trim() !== '');
  
  // Group paragraphs into pages
  const pages: Page[] = [];
  
  for (let i = 0; i < paragraphs.length; i += paragraphsPerPage) {
    const pageContent = paragraphs.slice(i, i + paragraphsPerPage).join('\n\n');
    pages.push({
      content: pageContent,
    });
  }
  
  // Ensure we have at least one page
  if (pages.length === 0) {
    pages.push({
      content: story || "Once upon a time..."
    });
  }
  
  return pages;
};

/**
 * Extracts a scene description from page content for image generation
 * @param content - The page content
 * @returns A concise scene description for image generation
 */
const extractSceneDescription = (content: string): string => {
  // Extract the first 100-150 characters as a base
  let description = content.substring(0, 150);
  
  // Look for descriptive sentences
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
  
  return description.trim();
};

/**
 * Generates an AI image for a story page
 * @param pageContent - The content of the page
 * @param pageNumber - The page number
 * @param artStyle - The selected art style
 * @returns Promise with the image URL
 */
export const generateStoryImage = async (pageContent: string, pageNumber: number, artStyle: string): Promise<string> => {
  try {
    // Extract a scene description from the page content
    const sceneDescription = extractSceneDescription(pageContent);
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
      return generatePlaceholderImage(pageNumber, artStyle);
    }

    console.log('Image generation response:', data);
    
    // Return the generated image URL or a placeholder if something went wrong
    return data?.imageUrl || generatePlaceholderImage(pageNumber, artStyle);
  } catch (error) {
    console.error('Error in generateStoryImage:', error);
    return generatePlaceholderImage(pageNumber, artStyle);
  }
};

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
