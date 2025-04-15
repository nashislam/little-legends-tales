
import { supabase } from '@/integrations/supabase/client';

interface Page {
  content: string;
  image?: string;
  imagePrompt?: string;
  imageError?: boolean;
  pageNumber: number;
}

/**
 * Splits a story into pages
 * @param story - The full story text
 * @param paragraphsPerPage - Number of paragraphs per page (default: 2)
 * @returns Array of page objects with content
 */
export const splitStoryIntoPages = (story: string, paragraphsPerPage: number = 2): Page[] => {
  // Create title page as the first page
  const pages: Page[] = [
    {
      pageNumber: 0,
      content: "Title Page",
    }
  ];
  
  // Split the story by paragraphs (empty lines)
  const paragraphs = story.split('\n\n').filter(p => p.trim() !== '');
  
  // Group paragraphs into pages, starting from page 2 (after title)
  for (let i = 0; i < paragraphs.length; i += paragraphsPerPage) {
    const pageContent = paragraphs.slice(i, i + paragraphsPerPage).join('\n\n');
    pages.push({
      pageNumber: pages.length,
      content: pageContent,
    });
  }
  
  // Ensure we have at least two pages (title + content)
  if (pages.length === 1) {
    pages.push({
      pageNumber: 1,
      content: story || "Once upon a time..."
    });
  }
  
  return pages;
};

/**
 * Extracts key story elements from the full story text
 * @param story - The full story text
 * @returns Object containing key elements (main character, animals, locations)
 */
export const extractStoryElements = (story: string): {
  mainCharacter?: string;
  animals?: string[];
  locations?: string[];
} => {
  const elements: {
    mainCharacter?: string;
    animals?: string[];
    locations?: string[];
  } = {
    animals: [],
    locations: []
  };
  
  // Try to extract the main character (usually mentioned early in the story)
  const nameMatch = story.match(/([A-Z][a-z]+)(?:\s+was|\s+had|\s+felt|\s+saw|\s+looked|\s+went)/);
  if (nameMatch && nameMatch[1]) {
    elements.mainCharacter = nameMatch[1];
  }
  
  // Extract animal mentions
  const animalMatches = story.match(/(?:a|the)\s+([a-z]+\s+[a-z]+|[a-z]+)(?:\s+with|\s+that|\s+who|\s+which)/ig);
  if (animalMatches) {
    const animalCandidates = animalMatches.map(m => 
      m.replace(/^(?:a|the)\s+/, '').replace(/\s+(?:with|that|who|which).*$/, '')
    );
    elements.animals = [...new Set(animalCandidates)];
  }
  
  // Extract location mentions
  const locationMatches = story.match(/(?:at|in|to)\s+(?:the|a)\s+([a-z]+\s+[a-z]+|[a-z]+)/ig);
  if (locationMatches) {
    const locationCandidates = locationMatches.map(m => 
      m.replace(/^(?:at|in|to)\s+(?:the|a)\s+/, '')
    );
    elements.locations = [...new Set(locationCandidates)];
  }
  
  return elements;
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

/**
 * Generates AI images for all story pages using the provided image prompts
 * @param pages - Array of page content
 * @param childName - The child's name for context
 * @param artStyle - The selected art style
 * @returns Promise with updated pages containing image URLs
 */
export const generateConsistentStoryImages = async (
  pages: Page[], 
  childName: string,
  artStyle: string
): Promise<Page[]> => {
  console.log('Starting image generation for pages', pages);
  // Process pages sequentially to maintain consistency
  const updatedPages = [...pages];
  
  for (let i = 0; i < updatedPages.length; i++) {
    try {
      const page = updatedPages[i];
      
      // Use the imagePrompt if available, otherwise generate one from the content
      const prompt = page.imagePrompt || 
                    (i === 0 ? 
                      `A beautiful book cover for "${childName}'s Magical Adventure". Art style: ${artStyle}.` : 
                      `Illustration for a children's book. Scene: ${page.content.substring(0, 200)}. Art style: ${artStyle}.`);
      
      console.log(`Generating image for page ${i} with prompt: ${prompt}`);
      
      // Call our Supabase Edge Function with the prompt
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
      updatedPages[i].image = generatePlaceholderImage(i, artStyle);
    }
  }
  
  return updatedPages;
};
