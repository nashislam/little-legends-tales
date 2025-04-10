
import { supabase } from '@/integrations/supabase/client';

interface Page {
  content: string;
  image?: string;
  imageError?: boolean;
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
      content: "Title Page",
    }
  ];
  
  // Split the story by paragraphs (empty lines)
  const paragraphs = story.split('\n\n').filter(p => p.trim() !== '');
  
  // Group paragraphs into pages, starting from page 2 (after title)
  for (let i = 0; i < paragraphs.length; i += paragraphsPerPage) {
    const pageContent = paragraphs.slice(i, i + paragraphsPerPage).join('\n\n');
    pages.push({
      content: pageContent,
    });
  }
  
  // Ensure we have at least two pages (title + content)
  if (pages.length === 1) {
    pages.push({
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
 * Extracts a scene description from page content for image generation
 * @param content - The page content
 * @param pageNumber - The page number
 * @param childName - The child's name
 * @param favoriteAnimal - The child's favorite animal
 * @param storyElements - Key elements extracted from the story
 * @returns A consistent scene description for image generation
 */
const extractSceneDescription = (
  content: string, 
  pageNumber: number,
  childName: string,
  favoriteAnimal: string,
  storyElements: ReturnType<typeof extractStoryElements>
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

