
import { generateStoryImage, generateConsistentStoryImages } from "@/lib/storyUtils";

interface Page {
  content: string;
  image?: string;
  imageError?: boolean;
}

export const generateImagesForAllPages = async (
  pages: Page[], 
  childName: string, 
  artStyle: string,
  storyText: string
): Promise<Page[]> => {
  try {
    // Default to a magical creature if no specific animal provided
    const favoriteAnimal = "magical creature";
    
    // Generate consistent images across all pages
    const updatedPages = await generateConsistentStoryImages(
      pages, 
      childName, 
      favoriteAnimal,
      artStyle,
      storyText
    );
    
    return updatedPages;
  } catch (error) {
    console.error('Error generating consistent images:', error);
    // Return the original pages if image generation fails
    return pages;
  }
};

export const retryImageForPage = async (
  page: Page,
  pageIndex: number,
  artStyle: string
): Promise<string> => {
  try {
    const imageUrl = await generateStoryImage(page.content, pageIndex, artStyle);
    return imageUrl;
  } catch (error) {
    console.error(`Error retrying image generation for page ${pageIndex}:`, error);
    return `${import.meta.env.BASE_URL}placeholder.svg`;
  }
};
