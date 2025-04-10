
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Page {
  content: string;
  image?: string;
}

interface StoryBookProps {
  childName: string;
  pages: Page[];
  artStyle: string;
}

const StoryBook = ({ childName, pages, artStyle }: StoryBookProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = pages.length;

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

  return (
    <div className="flex flex-col items-center">
      {/* Book title */}
      <h1 className="text-2xl md:text-3xl font-display mb-4 text-legend-blue">
        {childName}'s Magical Adventure
      </h1>
      <p className="text-gray-500 italic mb-6">
        Art style: {artStyle}
      </p>
      
      {/* Book container */}
      <div className="relative w-full max-w-3xl aspect-[3/2] bg-white rounded-lg shadow-lg mb-8 overflow-hidden">
        {/* Page counter */}
        <div className="absolute top-2 right-2 bg-white/80 text-gray-500 px-2 py-1 rounded-md text-xs">
          Page {currentPage + 1} of {totalPages}
        </div>
        
        {/* Book content */}
        <div className="flex h-full">
          {/* Page content */}
          <div className="flex-1 p-8 overflow-auto flex flex-col justify-between">
            <div className="prose prose-lg">
              {pages[currentPage].content}
            </div>
          </div>
          
          {/* Page illustration */}
          <div className="flex-1 bg-gray-100 flex items-center justify-center">
            {pages[currentPage].image ? (
              <img 
                src={pages[currentPage].image} 
                alt={`Illustration for page ${currentPage + 1}`} 
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="text-gray-400 italic text-center p-4">
                [Illustration would appear here]
              </div>
            )}
          </div>
        </div>
        
        {/* Navigation buttons */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between p-4">
          <Button 
            onClick={prevPage} 
            disabled={currentPage === 0}
            variant="ghost" 
            className="rounded-full h-10 w-10 p-0 flex items-center justify-center"
            aria-label="Previous page"
          >
            <ChevronLeft size={20} />
          </Button>
          
          <Button 
            onClick={nextPage} 
            disabled={currentPage === totalPages - 1}
            variant="ghost"
            className="rounded-full h-10 w-10 p-0 flex items-center justify-center"
            aria-label="Next page"
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>
      
      {/* Mobile view with stack layout */}
      <div className="md:hidden mt-4 space-y-8">
        {pages.map((page, index) => (
          <div 
            key={index} 
            className={cn(
              "card p-6 bg-white rounded-lg shadow transition-all",
              currentPage === index ? "scale-100 opacity-100" : "scale-95 opacity-50"
            )}
          >
            <h3 className="font-semibold mb-2">Page {index + 1}</h3>
            <div className="prose mb-4">
              {page.content}
            </div>
            {page.image && (
              <img 
                src={page.image} 
                alt={`Illustration for page ${index + 1}`} 
                className="w-full h-auto rounded"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryBook;
