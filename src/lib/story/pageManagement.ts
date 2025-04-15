
export interface Page {
  content: string;
  image?: string;
  imagePrompt?: string;
  imageError?: boolean;
  pageNumber: number;
}

/**
 * Splits a story into pages
 */
export const splitStoryIntoPages = (story: string, paragraphsPerPage: number = 2): Page[] => {
  const pages: Page[] = [
    {
      pageNumber: 0,
      content: "Title Page",
    }
  ];
  
  const paragraphs = story.split('\n\n').filter(p => p.trim() !== '');
  
  for (let i = 0; i < paragraphs.length; i += paragraphsPerPage) {
    const pageContent = paragraphs.slice(i, i + paragraphsPerPage).join('\n\n');
    pages.push({
      pageNumber: pages.length,
      content: pageContent,
    });
  }
  
  if (pages.length === 1) {
    pages.push({
      pageNumber: 1,
      content: story || "Once upon a time..."
    });
  }
  
  return pages;
};

