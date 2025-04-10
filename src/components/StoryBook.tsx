import React, { useState, useEffect } from 'react';
import { generateStoryImage, generateConsistentStoryImages } from "@/lib/storyUtils";
import { cn } from "@/lib/utils";
import NavigationControls from './storybook/NavigationControls';
import Page from './storybook/Page';
import MobilePageCard from './storybook/MobilePageCard';
import { Book, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

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
  const [fullscreen, setFullscreen] = useState(false);
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
        const favoriteAnimal = "magical creature"; // Default, could be passed as prop
        const updatedPages = await generateConsistentStoryImages(
          pages, 
          childName, 
          favoriteAnimal,
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
  
  // Determine if the current page is even or odd for alternating layout
  const isEvenPage = currentPage % 2 === 0;
  
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  return (
    <div className="flex flex-col items-center">
      <div className={cn(
        "transition-all duration-500 w-full",
        fullscreen ? "fixed inset-0 z-50 bg-blue-50" : ""
      )}>
        {/* Book header with controls */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Book size={20} className="text-legend-blue mr-3" />
            <h2 className="text-lg md:text-xl font-display text-gray-700">
              {childName}'s Magical Adventure
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 font-story">
              {currentPage + 1} of {totalPages}
            </span>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleFullscreen}
              className="rounded-full h-9 w-9"
            >
              {fullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </Button>
          </div>
        </div>
        
        {/* Book container with rounded corners and book-like appearance */}
        <div className={cn(
          "mx-auto bg-gradient-to-b from-[#F9F5F2] to-[#F5EFE9] transition-all duration-300",
          "rounded-2xl overflow-hidden book-container",
          fullscreen 
            ? "w-full h-[calc(100vh-130px)] max-w-none" 
            : "w-full max-w-5xl aspect-[4/3] mt-8 mb-10"
        )}>
          <div className={cn(
            "relative w-full h-full flex flex-col",
            "shadow-[0_0_40px_rgba(0,0,0,0.05)_inset,_0_0_0_1px_rgba(0,0,0,0.03)_inset]"
          )}>
            {/* Current page content */}
            <div className="flex-1 p-5">
              <Page
                content={loadedPages[currentPage]?.content || pages[currentPage]?.content}
                image={loadedPages[currentPage]?.image}
                imageError={loadedPages[currentPage]?.imageError}
                loading={loading[currentPage]}
                currentPage={currentPage}
                isTitlePage={isTitlePage}
                childName={childName}
                onRetryImage={retryImageGeneration}
                isEvenPage={isEvenPage}
              />
            </div>
            
            {/* Navigation controls */}
            <div className="px-6 py-3 bg-white/50 backdrop-blur-sm border-t border-[#E6D7CC]">
              <NavigationControls 
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevPage={prevPage}
                onNextPage={nextPage}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile view with stack layout */}
      <div className={cn(
        "md:hidden mt-6 space-y-16 pb-16 w-full px-6",
        fullscreen ? "hidden" : "block"
      )}>
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
