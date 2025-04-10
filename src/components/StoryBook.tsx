
import React, { useState, useEffect } from 'react';
import { generateStoryImage } from "@/lib/storyUtils";
import { cn } from "@/lib/utils";
import NavigationControls from './storybook/NavigationControls';
import Page from './storybook/Page';
import MobilePageCard from './storybook/MobilePageCard';

interface Page {
  content: string;
  image?: string;
  imageError?: boolean;
}

interface StoryBookProps {
  childName: string;
  pages: Page[];
  artStyle: string;
}

const StoryBook = ({ childName, pages, artStyle }: StoryBookProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [loadedPages, setLoadedPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState<boolean[]>([]);
  const totalPages = pages.length;

  useEffect(() => {
    const initialLoading = Array(pages.length).fill(true);
    setLoading(initialLoading);
    
    // Copy the pages initially
    setLoadedPages([...pages]);
    
    // Generate images for all pages asynchronously
    const generateAllImages = async () => {
      const updatedPages = [...pages];
      const newLoadingStates = [...initialLoading];
      
      // Process pages one by one to avoid overwhelming the API
      for (let i = 0; i < updatedPages.length; i++) {
        try {
          // Only generate if there's no image already
          if (!updatedPages[i].image) {
            const imageUrl = await generateStoryImage(updatedPages[i].content, i, artStyle);
            updatedPages[i] = { 
              ...updatedPages[i], 
              image: imageUrl,
              imageError: imageUrl.includes('placeholder')  // Mark as error if returning placeholder
            };
          }
        } catch (error) {
          console.error(`Error generating image for page ${i}:`, error);
          updatedPages[i] = { 
            ...updatedPages[i], 
            imageError: true,
            image: `${import.meta.env.BASE_URL}placeholder.svg` 
          };
        }
        
        // Mark this page as loaded regardless of success/failure
        newLoadingStates[i] = false;
        setLoading([...newLoadingStates]);
        setLoadedPages([...updatedPages]);
      }
    };
    
    generateAllImages();
  }, [pages, artStyle]);

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
      const imageUrl = await generateStoryImage(loadedPages[pageIndex].content, pageIndex, artStyle);
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
  
  // Determine if we're on the title page (first page)
  const isTitlePage = currentPage === 0;

  return (
    <div className="flex flex-col items-center">
      {/* Book title */}
      <h1 className="text-2xl md:text-3xl font-display mb-4 text-legend-blue">
        {childName}'s Magical Adventure
      </h1>
      <p className="text-gray-500 italic mb-6">
        Art style: {artStyle}
      </p>
      
      {/* Book container with rounded corners and shading to look book-like */}
      <div className="relative w-full max-w-3xl aspect-[3/2] bg-[#FFF9F5] rounded-lg shadow-lg mb-8 overflow-hidden border-2 border-[#E6D7CC]">
        {/* Page counter */}
        <div className="absolute top-2 right-2 bg-white/80 text-gray-500 px-2 py-1 rounded-md text-xs">
          Page {currentPage + 1} of {totalPages}
        </div>
        
        {/* Current page content */}
        <Page
          content={loadedPages[currentPage]?.content || pages[currentPage]?.content}
          image={loadedPages[currentPage]?.image}
          imageError={loadedPages[currentPage]?.imageError}
          loading={loading[currentPage]}
          currentPage={currentPage}
          isTitlePage={isTitlePage}
          childName={childName}
          onRetryImage={retryImageGeneration}
        />
        
        {/* Navigation buttons */}
        <NavigationControls 
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevPage={prevPage}
          onNextPage={nextPage}
        />
      </div>
      
      {/* Mobile view with stack layout */}
      <div className="md:hidden mt-4 space-y-8">
        {loadedPages.map((page, index) => (
          <MobilePageCard
            key={index}
            page={page}
            index={index}
            currentPage={currentPage}
            childName={childName}
            loading={loading[index]}
            onRetryImage={retryImageGeneration}
          />
        ))}
      </div>
    </div>
  );
};

export default StoryBook;
