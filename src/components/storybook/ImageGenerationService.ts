import { generateStoryImage } from "@/lib/storyUtils";

interface Page {
  content: string;
  image?: string;
  imageError?: boolean;
}

// Maximum number of concurrent image generation requests
const MAX_CONCURRENT_REQUESTS = 2;

/**
 * Generate images for all pages with concurrency control and prioritization
 */
export const generateImagesForAllPages = async (
  pages: Page[], 
  childName: string, 
  artStyle: string,
  storyText: string
): Promise<Page[]> => {
  try {
    console.log(`Starting image generation for ${pages.length} pages with art style: ${artStyle}`);
    
    // Create a copy of pages that we'll update
    const updatedPages = [...pages];
    
    // Skip the cover image (page 0) since we generate it separately first
    // Process remaining pages with concurrency control
    const pagesToProcess = updatedPages.slice(1);
    const chunks = [];
    
    // Split the pages into chunks based on MAX_CONCURRENT_REQUESTS
    for (let i = 0; i < pagesToProcess.length; i += MAX_CONCURRENT_REQUESTS) {
      chunks.push(pagesToProcess.slice(i, i + MAX_CONCURRENT_REQUESTS));
    }
    
    // Process each chunk sequentially, but pages within a chunk concurrently
    for (const chunk of chunks) {
      await Promise.all(chunk.map(async (page, index) => {
        const pageIndex = chunks.indexOf(chunk) * MAX_CONCURRENT_REQUESTS + index + 1; // +1 because we already processed page 0
        try {
          // Add a small delay between chunks to prevent rate limiting
          const delay = chunks.indexOf(chunk) * 100;
          if (delay > 0) await new Promise(resolve => setTimeout(resolve, delay));
          
          const imageUrl = await generateStoryImage(page.content, pageIndex, artStyle);
          updatedPages[pageIndex].image = imageUrl;
          updatedPages[pageIndex].imageError = false;
        } catch (error) {
          console.error(`Error generating image for page ${pageIndex}:`, error);
          updatedPages[pageIndex].image = `${import.meta.env.BASE_URL}placeholder.svg`;
          updatedPages[pageIndex].imageError = true;
        }
      }));
    }
    
    return updatedPages;
  } catch (error) {
    console.error('Error in image generation service:', error);
    return pages.map(page => ({
      ...page,
      image: `${import.meta.env.BASE_URL}placeholder.svg`,
      imageError: true
    }));
  }
};

/**
 * Retry image generation for a specific page with improved performance
 */
export const retryImageForPage = async (
  page: Page,
  pageIndex: number,
  artStyle: string
): Promise<string> => {
  console.log(`Retrying image generation for page ${pageIndex} with art style: ${artStyle}`);
  try {
    // If this is the cover page (index 0), use a special prompt
    if (pageIndex === 0) {
      const coverPrompt = `A beautiful book cover image for a children's story. Art style: ${artStyle}. The image should be magical and child-friendly, perfect as a storybook cover.`;
      return await generateStoryImage(coverPrompt, pageIndex, artStyle);
    }
    
    // Otherwise, generate a regular page illustration
    const imageUrl = await generateStoryImage(page.content, pageIndex, artStyle);
    return imageUrl;
  } catch (error) {
    console.error(`Error retrying image generation for page ${pageIndex}:`, error);
    return `${import.meta.env.BASE_URL}placeholder.svg`;
  }
};
