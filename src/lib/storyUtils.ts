
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
  return `/placeholder.svg`;
};
