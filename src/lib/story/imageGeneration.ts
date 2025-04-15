
import { supabase } from '@/integrations/supabase/client';

/**
 * Generates a dummy image URL for story illustration (placeholder)
 */
export const generatePlaceholderImage = (pageNumber: number, artStyle: string): string => {
  const styles = {
    watercolor: 'pastel',
    cartoon: 'cartoon',
    dreamy: 'fantasy',
    pixel: 'pixel',
    comic: 'comic',
    storybook: 'storybook'
  };
  
  const style = styles[artStyle as keyof typeof styles] || 'storybook';
  return `${import.meta.env.BASE_URL}placeholder.svg`;
};

/**
 * Extracts a scene description from page content for image generation
 */
export const extractSceneDescription = (
  content: string, 
  pageNumber: number,
  childName: string,
  favoriteAnimal: string,
  storyElements: any
): string => {
  if (content === "Title Page") {
    return `A magical children's storybook cover featuring ${childName}, a ${favoriteAnimal}, and a magical adventure theme. Whimsical, fantasy style, child-friendly illustration with vibrant colors.`;
  }
  
  let description = content.substring(0, 200);
  
  const descriptivePatterns = [
    /(\w+\s+was\s+\w+ing\s+[^.!?]+[.!?])/i,
    /(\w+\s+saw\s+[^.!?]+[.!?])/i,
    /(\w+\s+looked\s+[^.!?]+[.!?])/i,
    /(there\s+was\s+[^.!?]+[.!?])/i,
  ];
  
  for (const pattern of descriptivePatterns) {
    const match = content.match(pattern);
    if (match && match[0]) {
      description = match[0];
      break;
    }
  }
  
  let consistentPrompt = `A scene from a children's storybook featuring ${childName}`;
  consistentPrompt += `, with ${favoriteAnimal}`;
  
  if (storyElements.mainCharacter) {
    consistentPrompt += `, and ${storyElements.mainCharacter}`;
  }
  
  return `${consistentPrompt}. Scene: ${description.trim()}. Children's book illustration style, consistent character design across all images, same art style throughout the book.`;
};

