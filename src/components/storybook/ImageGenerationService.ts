import { generateStoryImage, generateConsistentStoryImages } from "@/lib/storyUtils";

interface Page {
  content: string;
  image?: string;
  imageError?: boolean;
}

// Maximum number of concurrent image generation requests
const MAX_CONCURRENT_REQUESTS = 2;

/**
 * Generate images for all pages with concurrency control
 */
export const generateImagesForAllPages = async (
  pages: Page[], 
  childName: string, 
  artStyle: string,
  storyText: string
): Promise<Page[]> => {
  try {
    console.log(`Starting image generation for ${pages.length} pages with art style: ${artStyle}`);
    
    // First, try to generate consistent images
    try {
      // Prioritize the cover image generation
      const coverPrompt = `A beautiful book cover image for a children's story featuring ${childName}. Art style: ${artStyle}. The image should be detailed and magical.`;
      
      console.log("Generating cover image first with prompt:", coverPrompt);
      
      // Attempt to generate the cover image first
      try {
        const coverImage = await generateStoryImage(coverPrompt, 0, artStyle);
        pages[0].image = coverImage;
        pages[0].imageError = false;
      } catch (error) {
        console.error("Error generating cover image:", error);
        pages[0].imageError = true;
        pages[0].image = `${import.meta.env.BASE_URL}placeholder.svg`;
      }
      
      // Then generate the rest of the images consistently
      const updatedPages = await generateConsistentStoryImages(
        pages, 
        childName, 
        "magical creature", // Default animal if none provided
        artStyle,
        storyText
      );
      
      // Keep our cover image
      if (!updatedPages[0].imageError && pages[0].image) {
        updatedPages[0].image = pages[0].image;
      }
      
      return updatedPages;
    } catch (error) {
      console.error('Error generating consistent images, falling back to individual generation:', error);
      
      // Fall back to generating images one by one with concurrency control
      const updatedPages = [...pages];
      const chunks = [];
      
      // Ensure the cover (first page) is generated first
      try {
        const coverPrompt = `A beautiful book cover image for a children's story. Art style: ${artStyle}. The image should be detailed and magical.`;
        const coverImage = await generateStoryImage(coverPrompt, 0, artStyle);
        updatedPages[0].image = coverImage;
        updatedPages[0].imageError = false;
      } catch (error) {
        console.error("Error generating cover image:", error);
        updatedPages[0].imageError = true;
        updatedPages[0].image = `${import.meta.env.BASE_URL}placeholder.svg`;
      }
      
      // Split the remaining pages into chunks based on MAX_CONCURRENT_REQUESTS
      for (let i = 1; i < updatedPages.length; i += MAX_CONCURRENT_REQUESTS) {
        chunks.push(updatedPages.slice(i, i + MAX_CONCURRENT_REQUESTS));
      }
      
      // Process each chunk sequentially, but pages within a chunk concurrently
      for (const chunk of chunks) {
        await Promise.all(chunk.map(async (page, index) => {
          const pageIndex = chunks.indexOf(chunk) * MAX_CONCURRENT_REQUESTS + index + 1; // +1 because we already processed page 0
          try {
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
    }
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
 * Retry image generation for a specific page
 */
export const retryImageForPage = async (
  page: Page,
  pageIndex: number,
  artStyle: string
): Promise<string> => {
  console.log(`Retrying image generation for page ${pageIndex} with art style: ${artStyle}`);
  try {
    // Add a small delay to prevent rapid retries
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // If this is the cover page (index 0), use a special prompt
    if (pageIndex === 0) {
      const coverPrompt = `A beautiful book cover image for a children's story. Art style: ${artStyle}. The image should be detailed and magical.`;
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
