
import React, { useState } from 'react';
import { Book, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import NavigationControls from './NavigationControls';
import BookContent from './BookContent';
import MobilePageCards from './MobilePageCards';
import BookCover from './BookCover';

interface BookContainerProps {
  childName: string;
  currentPage: number;
  totalPages: number;
  loadedPages: any[];
  loading: boolean[];
  onNextPage: () => void;
  onPrevPage: () => void;
  onRetryImageGeneration: (pageIndex: number) => Promise<void>;
  setCurrentPage: (page: number) => void;
}

const BookContainer = ({ 
  childName, 
  currentPage, 
  totalPages, 
  loadedPages, 
  loading, 
  onNextPage, 
  onPrevPage,
  onRetryImageGeneration,
  setCurrentPage
}: BookContainerProps) => {
  const [fullscreen, setFullscreen] = useState(false);
  const [isBookOpen, setIsBookOpen] = useState(false);
  const isTitlePage = currentPage === 0;
  const isEvenPage = currentPage % 2 === 0;
  
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };
  
  const handleOpenBook = () => {
    console.log("Opening book...");
    setIsBookOpen(true);
    // Set page to 1 which is the first content page (after title)
    onNextPage();
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
            {isBookOpen && (
              <span className="text-sm text-gray-500 font-story">
                {currentPage + 1} of {totalPages}
              </span>
            )}
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
            {/* Show either the book cover or the book content based on state */}
            {!isBookOpen ? (
              <BookCover
                childName={childName}
                image={loadedPages[0]?.image}
                loading={loading[0]}
                onOpenBook={handleOpenBook}
              />
            ) : (
              <>
                {/* Current page content - only shown on desktop */}
                <div className="flex-1 p-5 hidden md:block">
                  <BookContent 
                    content={loadedPages[currentPage]?.content || ""}
                    image={loadedPages[currentPage]?.image}
                    imageError={loadedPages[currentPage]?.imageError}
                    loading={loading[currentPage]}
                    currentPage={currentPage}
                    isTitlePage={isTitlePage}
                    childName={childName}
                    onRetryImage={() => onRetryImageGeneration(currentPage)}
                    isEvenPage={isEvenPage}
                  />
                </div>
                
                {/* Navigation controls - only shown on desktop */}
                <div className="px-6 py-3 bg-white/50 backdrop-blur-sm border-t border-[#E6D7CC] hidden md:block">
                  <NavigationControls 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPrevPage={onPrevPage}
                    onNextPage={onNextPage}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile view with swipeable layout */}
      <div className={cn(
        "md:hidden mt-6 space-y-16 pb-16 w-full px-4",
        fullscreen || !isBookOpen ? "hidden" : "block"
      )}>
        <MobilePageCards
          pages={loadedPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          childName={childName}
          loading={loading}
          onRetryImage={onRetryImageGeneration}
        />
      </div>
    </div>
  );
};

export default BookContainer;
