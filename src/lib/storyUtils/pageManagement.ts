
export interface Page {
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
