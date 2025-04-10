
import React, { useState, useEffect } from 'react';
import { generateImagesForAllPages, retryImageForPage } from './storybook/ImageGenerationService';
import BookContainer from './storybook/BookContainer';
import MobilePageCards from './storybook/MobilePageCards';

interface Page {
  content: string;
  image?: string;
  imageError?: boolean;
}

interface StoryBookProps {
  childName: string;
  pages: Page[];
  artStyle: string;
  storyText?: string; // Full story text for consistency analysis
}

const StoryBook = ({ childName, pages, artStyle, storyText = "" }: StoryBookProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [loadedPages, setLoadedPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState<boolean[]>([]);
  const totalPages = pages.length;

  useEffect(() => {
    const initialLoading = Array(pages.length).fill(true);
    setLoading(initialLoading);
    
    // Copy the pages initially
    setLoadedPages([...pages]);
    
    // Generate consistent images for all pages
    const generateAllImages = async () => {
      // Set loading state
      setLoading(Array(pages.length).fill(true));
      
      try {
        // Generate consistent images across all pages
        const updatedPages = await generateImagesForAllPages(
          pages, 
          childName, 
          artStyle,
          storyText
        );
        
        // Update with completed pages
        setLoadedPages(updatedPages);
      } catch (error) {
        console.error('Error generating consistent images:', error);
      } finally {
        // Mark all pages as loaded regardless of success/failure
        setLoading(Array(pages.length).fill(false));
      }
    };
    
    generateAllImages();
  }, [pages, childName, artStyle, storyText]);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const retryImageGeneration = async (pageIndex: number) => {
    // Mark the page as loading
    const newLoadingStates = [...loading];
    newLoadingStates[pageIndex] = true;
    setLoading(newLoadingStates);
    
    try {
      const imageUrl = await retryImageForPage(loadedPages[pageIndex], pageIndex, artStyle);
      const updatedPages = [...loadedPages];
      updatedPages[pageIndex] = { 
        ...updatedPages[pageIndex], 
        image: imageUrl,
        imageError: imageUrl.includes('placeholder') 
      };
      setLoadedPages(updatedPages);
    } catch (error) {
      console.error(`Error retrying image generation for page ${pageIndex}:`, error);
      const updatedPages = [...loadedPages];
      updatedPages[pageIndex] = { 
        ...updatedPages[pageIndex], 
        imageError: true,
        image: `${import.meta.env.BASE_URL}placeholder.svg`
      };
      setLoadedPages(updatedPages);
    }
    
    // Mark as no longer loading
    newLoadingStates[pageIndex] = false;
    setLoading(newLoadingStates);
  };

  return (
    <BookContainer
      childName={childName}
      currentPage={currentPage}
      totalPages={totalPages}
      loadedPages={loadedPages}
      loading={loading}
      onNextPage={nextPage}
      onPrevPage={prevPage}
      onRetryImageGeneration={retryImageGeneration}
    />
  );
};

export default StoryBook;
